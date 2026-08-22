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

    const { role = "Software Engineer", experienceLevel = "Entry / Mid Level", resumeId, jdId } = await req.json();

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

    if (jdId) {
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

    // Generate 5 structured interview rounds tailored to Resume + JD with Groq AI
    const roundsData = await generateInterviewQuestions(role, resumeText, jdText);

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
        status: "IN_PROGRESS",
        currentRoundNumber: 1,
        rounds: {
          create: roundsData.map((round) => ({
            roundNumber: round.roundNumber,
            roundType: round.roundType,
            title: round.title,
            description: round.description,
            status: round.roundNumber === 1 ? "IN_PROGRESS" : "PENDING",
            questions: {
              create: round.questions.map((q) => ({
                orderIndex: q.orderIndex,
                questionText: q.questionText,
                category: q.category || "General",
                difficulty: q.difficulty || "Medium",
                context: q.context || undefined,
                idealAnswerPoints: q.idealAnswerPoints ? JSON.stringify(q.idealAnswerPoints) : null,
              })),
            },
          })),
        },
      },
      include: {
        rounds: {
          include: {
            questions: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      interviewId: interview.id,
      interview,
    });
  } catch (error: unknown) {
    console.error("Interview Create Route Error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to create interview session.";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
