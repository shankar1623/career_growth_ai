import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/userHelper";
import { generateInterviewQuestions } from "@/lib/ai/aiProvider";
import prisma from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to start an interview." }, { status: 401 });
    }

    const body = await req.json();
    const role = (body.role || "Full-Stack Software Engineer").trim();
    const experienceLevel = body.experienceLevel || "Entry / Mid Level";
    const resumeId = body.resumeId;
    const jdId = body.jdId;
    const jobDescriptionText = body.jobDescriptionText;

    let resumeText = "";
    let validResumeId: string | null = null;
    let jdText = "";
    let validJdId: string | null = null;

    // 1. Verify and resolve resume
    if (resumeId) {
      const dbResume = await prisma.resume.findFirst({
        where: { id: resumeId, userId: user.userId },
      });
      if (dbResume) {
        resumeText = dbResume.rawText;
        validResumeId = dbResume.id;
      }
    } else {
      const latestResume = await prisma.resume.findFirst({
        where: { userId: user.userId },
        orderBy: { createdAt: "desc" },
      });
      if (latestResume) {
        resumeText = latestResume.rawText;
        validResumeId = latestResume.id;
      }
    }

    // 2. Verify and resolve Job Description
    if (jobDescriptionText && jobDescriptionText.trim().length > 10) {
      jdText = jobDescriptionText.trim();
      try {
        const createdJd = await prisma.jobDescription.create({
          data: {
            userId: user.userId,
            title: role,
            companyName: "Target Job",
            rawText: jdText,
          },
        });
        validJdId = createdJd.id;
      } catch (jdErr) {
        console.warn("JobDescription record creation notice:", jdErr);
      }
    } else if (jdId) {
      const dbJD = await prisma.jobDescription.findFirst({
        where: { id: jdId, userId: user.userId },
      });
      if (dbJD) {
        jdText = dbJD.rawText;
        validJdId = dbJD.id;
      }
    } else {
      const latestJD = await prisma.jobDescription.findFirst({
        where: { userId: user.userId },
        orderBy: { createdAt: "desc" },
      });
      if (latestJD) {
        jdText = latestJD.rawText;
        validJdId = latestJD.id;
      }
    }

    // 3. Generate 5 structured interview rounds tailored to Role, Seniority, Resume + JD
    const roundsData = await generateInterviewQuestions(role, experienceLevel, resumeText, jdText);

    // 4. Create Interview session in DB with validated Foreign Keys
    const interview = await prisma.interview.create({
      data: {
        userId: user.userId,
        resumeId: validResumeId || undefined,
        jobDescriptionId: validJdId || undefined,
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
                category: q.category || "General",
                difficulty: q.difficulty || "Medium",
                context: q.context || undefined,
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

    // 5. Safely Increment user progress counter
    try {
      await prisma.userProgress.upsert({
        where: { userId: user.userId },
        update: { totalInterviews: { increment: 1 } },
        create: { userId: user.userId, totalInterviews: 1 },
      });
    } catch (progErr) {
      console.warn("UserProgress upsert notice:", progErr);
    }

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
