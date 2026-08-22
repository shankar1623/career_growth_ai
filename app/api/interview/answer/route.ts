import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/userHelper";
import { evaluateSpokenAnswer } from "@/lib/ai/aiProvider";
import prisma from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionId, transcript, durationSec = 0, roundType = "SELF_INTRO" } = await req.json();

    if (!questionId) {
      return NextResponse.json({ error: "Question ID is required." }, { status: 400 });
    }

    const question = await prisma.interviewQuestion.findUnique({
      where: { id: questionId },
      include: { round: { include: { interview: true } } },
    });

    if (!question || question.round.interview.userId !== user.userId) {
      return NextResponse.json({ error: "Question not found or unauthorized." }, { status: 404 });
    }

    const rawTranscript = (transcript || "").trim();
    const isSkipped = !rawTranscript || rawTranscript.toLowerCase().includes("skipped") || rawTranscript.toLowerCase().includes("no answer");

    let evalResult;
    if (isSkipped) {
      evalResult = {
        score: 0,
        clarityScore: 0,
        relevanceScore: 0,
        fillerWordCount: 0,
        detectedFillerWords: [],
        feedback: "Question was skipped without an answer. Review the recommended STAR answer structure below to practice this topic.",
        strengths: [],
        weaknesses: ["No response was provided for this question."],
        improvedExample: `[Situation] In my recent project, we encountered a critical requirement change right before sprint release.\n[Task] I needed to adapt our data model and API endpoints without delaying the release date.\n[Action] I prioritized core deliverables, automated regression tests, and communicated transparently with team members.\n[Result] We successfully shipped on time with zero production defects.`,
        starAnalysis: {
          situation: "Set context clearly at the start of your answer.",
          task: "Define the specific challenge or technical goal you owned.",
          action: "Detail your precise technical decisions and coding strategies.",
          result: "Conclude with measurable business impact or positive user outcomes.",
        },
      };
    } else {
      // Evaluate answer with AI / Groq / NLP engine
      evalResult = await evaluateSpokenAnswer(
        question.questionText,
        rawTranscript,
        roundType
      );
    }

    // Save Answer in DB
    const savedAnswer = await prisma.interviewAnswer.create({
      data: {
        questionId: question.id,
        userTranscript: isSkipped ? "(Question Skipped / No answer provided)" : rawTranscript,
        durationSec: Number(durationSec) || 0,
        score: evalResult.score,
        clarityScore: evalResult.clarityScore,
        relevanceScore: evalResult.relevanceScore,
        fillerWordCount: evalResult.fillerWordCount,
        feedback: evalResult.feedback,
        strengths: JSON.stringify(evalResult.strengths),
        weaknesses: JSON.stringify(evalResult.weaknesses),
        improvedExample: evalResult.improvedExample,
        starAnalysis: evalResult.starAnalysis ? JSON.stringify(evalResult.starAnalysis) : null,
      },
    });

    // Update Round score
    const allAnswersInRound = await prisma.interviewAnswer.findMany({
      where: { question: { roundId: question.roundId } },
    });

    const roundScore = allAnswersInRound.length > 0
      ? Math.round(allAnswersInRound.reduce((acc, curr) => acc + curr.score, 0) / allAnswersInRound.length)
      : 0;

    await prisma.interviewRound.update({
      where: { id: question.roundId },
      data: {
        score: roundScore,
        status: "IN_PROGRESS",
      },
    });

    return NextResponse.json({
      success: true,
      answerId: savedAnswer.id,
      evaluation: evalResult,
    });
  } catch (error: unknown) {
    console.error("Interview Answer Evaluation Error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to process answer.";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
