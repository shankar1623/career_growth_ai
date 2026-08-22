import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/userHelper";
import prisma from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch latest resume
    const latestResume = await prisma.resume.findFirst({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
    });

    // 2. Fetch latest job match
    const latestJobMatch = await prisma.jobMatch.findFirst({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
      include: { jobDescription: true },
    });

    // 3. Fetch latest interview & history
    const interviews = await prisma.interview.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "asc" },
    });
    const latestInterview = interviews.length > 0 ? interviews[interviews.length - 1] : null;

    // 4. Fetch roadmap progress
    const roadmap = await prisma.learningRoadmap.findFirst({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
    });

    // Extract genuine skills from user's actual resume
    const techKeywords = [
      "React", "TypeScript", "JavaScript", "Node.js", "Next.js", "Python", "Java",
      "PostgreSQL", "MongoDB", "SQL", "Docker", "AWS", "Git", "REST APIs", "Tailwind CSS", "C++"
    ];
    let strongSkills: string[] = [];
    if (latestResume?.rawText) {
      const rLower = latestResume.rawText.toLowerCase();
      strongSkills = techKeywords.filter((k) => rLower.includes(k.toLowerCase())).slice(0, 6);
    }
    if (strongSkills.length === 0 && latestResume) {
      strongSkills = ["Full-Stack Engineering", "Web Architecture", "REST APIs", "Git"];
    }

    const needsImprovement: string[] = [];
    if (latestJobMatch?.missingSkills) {
      try {
        const parsed = JSON.parse(latestJobMatch.missingSkills as unknown as string);
        if (Array.isArray(parsed)) {
          needsImprovement.push(...parsed.slice(0, 3).map((item: any) => item.skill || String(item)));
        }
      } catch {
        // ignore
      }
    }
    if (needsImprovement.length === 0) {
      if (latestResume) {
        needsImprovement.push("System Architecture", "Cloud Infrastructure", "Algorithmic Efficiency");
      }
    }

    // Real Score Trends
    const scoreTrends = interviews
      .filter((inv) => inv.overallScore && inv.overallScore > 0)
      .map((inv, idx) => ({
        date: new Date(inv.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        score: inv.overallScore || 0,
        type: "Interview",
        label: `Interview ${idx + 1}`,
      }));

    // Real Competency Breakdown
    const skillRadar = [
      { skill: "Technical", level: latestInterview?.technicalScore || 0, fullMark: 100 },
      { skill: "Communication", level: latestInterview?.communicationScore || 0, fullMark: 100 },
      { skill: "Problem Solving", level: latestInterview?.problemSolvingScore || 0, fullMark: 100 },
      { skill: "Resume Depth", level: latestResume?.overallScore || 0, fullMark: 100 },
      { skill: "Coding Execution", level: latestInterview?.codingScore || 0, fullMark: 100 },
      { skill: "STAR Behavioral", level: latestInterview?.hrScore || 0, fullMark: 100 },
    ];

    // Real Recent activities
    const recentActivities = [];

    if (latestInterview) {
      recentActivities.push({
        id: latestInterview.id,
        type: "INTERVIEW" as const,
        title: `${latestInterview.targetRole} Mock Interview`,
        score: latestInterview.overallScore,
        date: new Date(latestInterview.createdAt).toLocaleDateString(),
        link: `/interview/${latestInterview.id}/results`,
      });
    }

    if (latestJobMatch) {
      recentActivities.push({
        id: latestJobMatch.id,
        type: "JOB_MATCH" as const,
        title: `${latestJobMatch.jobDescription?.title || "Role"} Match Analysis`,
        score: latestJobMatch.overallMatch,
        date: new Date(latestJobMatch.createdAt).toLocaleDateString(),
        link: "/job-match",
      });
    }

    if (latestResume) {
      recentActivities.push({
        id: latestResume.id,
        type: "RESUME" as const,
        title: latestResume.title || latestResume.fileName || "Resume Review",
        score: latestResume.overallScore,
        date: new Date(latestResume.createdAt).toLocaleDateString(),
        link: "/resume-analyzer",
      });
    }

    return NextResponse.json({
      hasData: Boolean(latestResume || latestInterview || latestJobMatch),
      resumeScore: latestResume?.overallScore || 0,
      atsScore: latestResume?.atsScore || 0,
      latestMatchScore: latestJobMatch?.overallMatch || 0,
      targetRole: latestJobMatch?.jobDescription?.title || latestInterview?.targetRole || "Software Engineer",
      latestInterviewScore: latestInterview?.overallScore || 0,
      interviewRoundsCompleted: latestInterview?.currentRoundNumber || 0,
      strongSkills,
      needsImprovement,
      roadmapCompletionPct: roadmap?.overallProgress || 0,
      scoreTrends,
      skillRadar,
      recentActivities,
    });
  } catch (error: unknown) {
    console.error("Dashboard Analytics Error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to load analytics.";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
