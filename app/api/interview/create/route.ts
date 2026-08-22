import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/userHelper";
import { generateInterviewQuestions } from "@/lib/ai/aiProvider";
import prisma from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      role = "Full-Stack Software Engineer",
      experienceLevel = "Entry / Mid Level",
      resumeId,
      jdId,
      jobDescriptionText,
    } = await req.json();

    let resumeText = "";
    let jdText = "";
    let resolvedJdId = jdId;

    if (resumeId) {
      const dbResume = await prisma.resume.findFirst({
        where: { id: resumeId, userId: user.userId },
      });
      if (dbResume) resumeText = dbResume.rawText;
    } else {
      const latestResume = await prisma.resume.findFirst({
        where: { userId: user.userId },
        orderBy: { createdAt: "desc" },
      });
      if (latestResume) resumeText = latestResume.rawText;
    }

    if (jobDescriptionText && jobDescriptionText.trim().length > 10) {
      jdText = jobDescriptionText.trim();
      const createdJd = await prisma.jobDescription.create({
        data: {
          userId: user.userId,
          title: role,
          companyName: "Target Job",
          rawText: jdText,
        },
      });
      resolvedJdId = createdJd.id;
    } else if (jdId) {
      const dbJD = await prisma.jobDescription.findFirst({
        where: { id: jdId, userId: user.userId },
      });
      if (dbJD) jdText = dbJD.rawText;
    } else {
      const latestJD = await prisma.jobDescription.findFirst({
        where: { userId: user.userId },
        orderBy: { createdAt: "desc" },
      });
      if (latestJD) {
        jdText = latestJD.rawText;
        resolvedJdId = latestJD.id;
      }
    }

    // Generate 5 structured interview rounds tailored to Role, Seniority, Resume + JD
    const roundsData = await generateInterviewQuestions(role, experienceLevel, resumeText, jdText);

    // Create Interview session in DB
    const interview = await prisma.interview.create({
      data: {
        userId: user.userId,
        resumeId: resumeId || undefined,
        jobDescriptionId: resolvedJdId || undefined,
        title: `${role} Mock Interview`,
        targetRole: role,
        experienceLevel,
        interviewType: "FULL_5_ROUNDS",
        rounds: {
          create: roundsData.map((round) => ({
            roundNumber: round.roundNumber,
            roundType: round.roundType,
            title: round.title,
            description: round.description,
            status: "PENDING",
            questions: {
              create: round.questions.map((q) => ({
                orderIndex: q.orderIndex,
                questionText: q.questionText,
                category: q.category,
                difficulty: q.difficulty,
                context: q.context,
                idealAnswer: JSON.stringify(q.idealAnswerPoints || []),
              })),
            },
          })),
        },
      },
      include: {
        rounds: {
          include: { questions: true },
          orderBy: { roundNumber: "asc" },
        },
      },
    });

    // Increment user progress
    await prisma.userProgress.upsert({
      where: { userId: user.userId },
      update: { totalInterviews: { increment: 1 } },
      create: { userId: user.userId, totalInterviews: 1 },
    });

    return NextResponse.json({
      success: true,
      interviewId: interview.id,
      interview,
    });
  } catch (error: unknown) {
    console.error("Create Interview Error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to create mock interview session.";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
