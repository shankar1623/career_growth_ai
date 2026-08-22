import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/userHelper";
import { generateFinalInterviewReport } from "@/lib/ai/aiProvider";
import prisma from "@/lib/db/prisma";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const interview = await prisma.interview.findFirst({
      where: { id, userId: user.userId },
      include: {
        rounds: {
          include: {
            questions: {
              include: { answers: true },
            },
            codingSubmissions: true,
          },
        },
      },
    });

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    // Collect scores per round
    const roundScores = interview.rounds.map((r) => {
      let rScore = r.score;
      const answers = r.questions.flatMap((q) => q.answers);
      if (answers.length > 0) {
        rScore = Math.round(answers.reduce((a, c) => a + c.score, 0) / answers.length);
      } else if (r.codingSubmissions.length > 0) {
        rScore = r.codingSubmissions[0].correctnessScore;
      } else {
        rScore = 0; // Skipped round = 0
      }

      return {
        round: r.roundNumber,
        score: rScore,
        type: r.roundType,
      };
    });

    // Generate comprehensive evaluation report
    const finalReport = await generateFinalInterviewReport(roundScores);

    // Update Interview in DB
    const updated = await prisma.interview.update({
      where: { id },
      data: {
        status: "COMPLETED",
        overallScore: finalReport.overallScore,
        communicationScore: finalReport.communicationScore,
        technicalScore: finalReport.technicalScore,
        problemSolvingScore: finalReport.problemSolvingScore,
        structureScore: finalReport.structureScore,
        resumeScore: finalReport.resumeScore,
        codingScore: finalReport.codingScore,
        hrScore: finalReport.hrScore,
        summaryFeedback: finalReport.summaryFeedback,
        strengths: JSON.stringify(finalReport.strengths),
        improvements: JSON.stringify(finalReport.improvements),
        completedAt: new Date(),
      },
    });

    // Update User Progress aggregates
    try {
      await prisma.userProgress.upsert({
        where: { userId: user.userId },
        update: {
          totalInterviews: { increment: 1 },
          avgScore: finalReport.overallScore,
          lastActiveAt: new Date(),
        },
        create: {
          userId: user.userId,
          totalInterviews: 1,
          avgScore: finalReport.overallScore,
        },
      });
    } catch (progErr) {
      console.warn("User progress update deferred:", progErr);
    }

    return NextResponse.json({
      success: true,
      report: finalReport,
      interview: updated,
    });
  } catch (error: unknown) {
    console.error("Interview Complete Error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to complete interview.";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
