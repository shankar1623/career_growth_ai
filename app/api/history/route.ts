import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/userHelper";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch Resume Analytics History
    const resumes = await prisma.resume.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        fileName: true,
        overallScore: true,
        atsScore: true,
        contentScore: true,
        impactScore: true,
        skillsScore: true,
        experienceScore: true,
        projectsScore: true,
        formattingScore: true,
        grammarScore: true,
        createdAt: true,
        sections: {
          select: {
            sectionName: true,
            score: true,
          },
        },
      },
    });

    // 2. Fetch Resume + JD Match History
    const jobMatches = await prisma.jobMatch.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
      include: {
        jobDescription: {
          select: {
            title: true,
            companyName: true,
          },
        },
        resume: {
          select: {
            title: true,
          },
        },
      },
    });

    const formattedJobMatches = jobMatches.map((jm) => {
      let strongMatches: string[] = [];
      let missingSkills: any[] = [];
      try {
        if (jm.strongMatches) strongMatches = JSON.parse(jm.strongMatches);
        if (jm.missingSkills) missingSkills = JSON.parse(jm.missingSkills);
      } catch {}

      return {
        id: jm.id,
        jobTitle: jm.jobDescription.title,
        companyName: jm.jobDescription.companyName || "Target Company",
        resumeTitle: jm.resume.title,
        overallMatch: jm.overallMatch,
        skillsMatch: jm.skillsMatch,
        experienceMatch: jm.experienceMatch,
        strongMatches: strongMatches.slice(0, 5),
        missingSkills: missingSkills.slice(0, 4).map((m: any) => (typeof m === "string" ? m : m.skill || m.name || "")).filter(Boolean),
        createdAt: jm.createdAt,
      };
    });

    // 3. Fetch Mock Interview History
    const interviews = await prisma.interview.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
      include: {
        rounds: {
          orderBy: { roundNumber: "asc" },
          select: {
            roundNumber: true,
            title: true,
            score: true,
            roundType: true,
          },
        },
      },
    });

    const formattedInterviews = interviews.map((iv) => ({
      id: iv.id,
      title: iv.title,
      targetRole: iv.targetRole,
      overallScore: iv.overallScore,
      createdAt: iv.createdAt,
      rounds: iv.rounds.map((r) => ({
        roundNumber: r.roundNumber,
        title: r.title,
        score: r.score,
        roundType: r.roundType,
      })),
    }));

    return NextResponse.json({
      success: true,
      resumes,
      jobMatches: formattedJobMatches,
      interviews: formattedInterviews,
    });
  } catch (error: unknown) {
    console.error("History fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch activity history" }, { status: 500 });
  }
}
