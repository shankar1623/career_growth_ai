import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/userHelper";
import { evaluateCodingSubmission } from "@/lib/ai/aiProvider";
import prisma from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roundId, language = "javascript", code = "", problemContext = "" } = await req.json();

    if (!roundId) {
      return NextResponse.json({ error: "Round ID is required." }, { status: 400 });
    }

    const round = await prisma.interviewRound.findUnique({
      where: { id: roundId },
      include: { interview: true },
    });

    if (!round || round.interview.userId !== user.userId) {
      return NextResponse.json({ error: "Round not found or unauthorized." }, { status: 404 });
    }

    const cleanCode = code.trim();
    if (!cleanCode) {
      return NextResponse.json({ error: "Please write code before submitting." }, { status: 400 });
    }

    // Evaluate coding submission with AI & static analyzer
    const codingEval = await evaluateCodingSubmission(cleanCode, language, problemContext);

    // Save coding submission in DB
    const submission = await prisma.codingSubmission.create({
      data: {
        roundId,
        language,
        code: cleanCode,
        correctnessScore: codingEval.correctnessScore,
        complexityTime: codingEval.complexityTime,
        complexitySpace: codingEval.complexitySpace,
        codeQualityScore: codingEval.codeQualityScore,
        feedback: codingEval.feedback,
        testResults: JSON.stringify(codingEval.testResults),
        status: "EVALUATED",
      },
    });

    // Update Round score
    const combinedRoundScore = Math.round(
      (codingEval.correctnessScore * 0.6) + (codingEval.codeQualityScore * 0.4)
    );

    await prisma.interviewRound.update({
      where: { id: roundId },
      data: {
        score: combinedRoundScore,
        status: "COMPLETED",
      },
    });

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      evaluation: codingEval,
    });
  } catch (error: unknown) {
    console.error("Coding Evaluation Error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to evaluate coding submission.";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
