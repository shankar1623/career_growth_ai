import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/userHelper";
import { generateLearningRoadmap, matchJobDescription, RoadmapSynthesisContext } from "@/lib/ai/aiProvider";
import prisma from "@/lib/db/prisma";

// Helper to gather candidate diagnostic gaps across Resume, Job Match, and Mock Interview
async function gatherCandidateDiagnosticContext(
  userId: string,
  preferredRole?: string,
  customJdText?: string
): Promise<{ context: RoadmapSynthesisContext; hasDiagnosticData: boolean; resumeId?: string; interviewId?: string }> {
  // 1. Fetch latest Resume
  const latestResume = await prisma.resume.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { sections: true },
  });

  // 2. Fetch latest Job Match
  const latestJobMatch = await prisma.jobMatch.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { jobDescription: true },
  });

  // 3. Fetch latest Interview
  const latestInterview = await prisma.interview.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { rounds: { include: { questions: true } } },
  });

  const hasDiagnosticData = Boolean(latestResume || latestJobMatch || latestInterview || customJdText);

  // Extract missing skills
  const missingSkills: string[] = [];

  // If user provided a specific custom JD, analyze missing skills directly against resume!
  if (customJdText && latestResume?.rawText) {
    try {
      const matchResult = await matchJobDescription(latestResume.rawText, customJdText);
      if (matchResult.missingSkills && Array.isArray(matchResult.missingSkills)) {
        missingSkills.push(...matchResult.missingSkills.map((s) => s.skill));
      }
    } catch {
      // ignore
    }
  } else if (latestJobMatch?.missingSkills) {
    try {
      const parsed = JSON.parse(latestJobMatch.missingSkills as unknown as string);
      if (Array.isArray(parsed)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        missingSkills.push(...parsed.map((item: any) => item.skill || String(item)));
      }
    } catch {
      // ignore
    }
  }

  // Extract interview weaknesses
  const interviewWeaknesses: string[] = [];
  if (latestInterview) {
    if ((latestInterview.technicalScore || 0) < 75) {
      interviewWeaknesses.push("Deep technical systems, asynchronous event loop, and backend indexing");
    }
    if ((latestInterview.codingScore || 0) < 75) {
      interviewWeaknesses.push("Algorithmic problem-solving speed, edge case handling, and Big-O optimization");
    }
    if ((latestInterview.communicationScore || 0) < 75 || (latestInterview.hrScore || 0) < 75) {
      interviewWeaknesses.push("STAR behavioral communication structure, concise articulation, and filler word control");
    }
    if ((latestInterview.problemSolvingScore || 0) < 75) {
      interviewWeaknesses.push("System design architecture, component state management, and scalability");
    }
  }

  // Extract resume gaps
  const resumeGaps: string[] = [];
  if (latestResume?.sections) {
    for (const sec of latestResume.sections) {
      if (sec.weaknesses) {
        try {
          const w = JSON.parse(sec.weaknesses);
          if (Array.isArray(w)) resumeGaps.push(...w.slice(0, 2));
        } catch {
          // ignore
        }
      }
    }
  }

  const resolvedRole =
    preferredRole ||
    latestJobMatch?.jobDescription?.title ||
    latestInterview?.targetRole ||
    "Full-Stack Software Engineer";

  return {
    hasDiagnosticData,
    resumeId: latestResume?.id,
    interviewId: latestInterview?.id,
    context: {
      role: resolvedRole,
      missingSkills,
      interviewWeaknesses,
      resumeGaps,
      resumeText: latestResume?.rawText,
      targetCompany: latestJobMatch?.jobDescription?.companyName || undefined,
    },
  };
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch existing roadmap
    const roadmap = await prisma.learningRoadmap.findFirst({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          orderBy: { weekNumber: "asc" },
        },
      },
    });

    if (!roadmap) {
      return NextResponse.json({
        hasData: false,
        roadmap: null,
        message: "No learning roadmap generated yet. Complete your Resume Analysis, Job Match, or enter a target Job Description to generate your roadmap.",
      });
    }

    // Parse JSON fields for frontend
    const parsedItems = roadmap.items.map((it) => ({
      id: it.id,
      weekNumber: it.weekNumber,
      skill: it.skill,
      priority: it.priority as "HIGH" | "MEDIUM" | "LOW",
      currentLevel: it.currentLevel,
      targetLevel: it.targetLevel,
      topics: JSON.parse(it.topics || "[]"),
      practiceTasks: JSON.parse(it.practiceTasks || "[]"),
      resources: JSON.parse(it.resources || "[]"),
      isCompleted: it.isCompleted,
    }));

    return NextResponse.json({
      hasData: true,
      roadmap: {
        id: roadmap.id,
        title: roadmap.title,
        targetRole: roadmap.targetRole,
        overallProgress: roadmap.overallProgress,
        totalWeeks: roadmap.totalWeeks,
        items: parsedItems,
      },
    });
  } catch (error: unknown) {
    console.error("Get Roadmap Error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to load roadmap.";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetRole, jobDescriptionText, resumeId, interviewId } = await req.json();

    // If jobDescriptionText is provided, optionally save or update JobDescription in DB
    if (jobDescriptionText && jobDescriptionText.trim().length > 10) {
      await prisma.jobDescription.create({
        data: {
          userId: user.userId,
          title: targetRole || "Target Software Engineer Role",
          companyName: "Target Company",
          rawText: jobDescriptionText.trim(),
        },
      });
    }

    // Gather real candidate diagnostics from Database across Resume, Job Match, and Interview
    const { context, resumeId: autoResumeId, interviewId: autoInterviewId } = await gatherCandidateDiagnosticContext(
      user.userId,
      targetRole,
      jobDescriptionText
    );

    // Synthesize fresh roadmap with AI
    const generated = await generateLearningRoadmap(context);

    // Delete old roadmaps for this user so only the newly generated plan is active
    await prisma.learningRoadmap.deleteMany({
      where: { userId: user.userId },
    });

    const newRoadmap = await prisma.learningRoadmap.create({
      data: {
        userId: user.userId,
        resumeId: resumeId || autoResumeId || undefined,
        interviewId: interviewId || autoInterviewId || undefined,
        title: generated.title,
        targetRole: generated.targetRole,
        overallProgress: 0,
        totalWeeks: generated.totalWeeks,
        items: {
          create: generated.items.map((item) => ({
            weekNumber: item.weekNumber,
            skill: item.skill,
            priority: item.priority,
            currentLevel: item.currentLevel,
            targetLevel: item.targetLevel,
            topics: JSON.stringify(item.topics),
            practiceTasks: JSON.stringify(item.practiceTasks),
            resources: JSON.stringify(item.resources),
            isCompleted: false,
          })),
        },
      },
      include: {
        items: {
          orderBy: { weekNumber: "asc" },
        },
      },
    });

    // Update User Progress counter
    await prisma.userProgress.upsert({
      where: { userId: user.userId },
      update: { roadmapsActive: 1 },
      create: { userId: user.userId, roadmapsActive: 1 },
    });

    const parsedItems = newRoadmap.items.map((it) => ({
      id: it.id,
      weekNumber: it.weekNumber,
      skill: it.skill,
      priority: it.priority as "HIGH" | "MEDIUM" | "LOW",
      currentLevel: it.currentLevel,
      targetLevel: it.targetLevel,
      topics: JSON.parse(it.topics || "[]"),
      practiceTasks: JSON.parse(it.practiceTasks || "[]"),
      resources: JSON.parse(it.resources || "[]"),
      isCompleted: it.isCompleted,
    }));

    return NextResponse.json({
      success: true,
      hasData: true,
      roadmap: {
        id: newRoadmap.id,
        title: newRoadmap.title,
        targetRole: newRoadmap.targetRole,
        overallProgress: 0,
        totalWeeks: newRoadmap.totalWeeks,
        items: parsedItems,
      },
    });
  } catch (error: unknown) {
    console.error("Create Roadmap Error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to generate roadmap.";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
