import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/userHelper";
import { getRecommendedModelAnswer } from "@/lib/ai/smartFallbackProvider";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const latestInterview = await prisma.interview.findFirst({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
      include: {
        rounds: {
          include: {
            questions: {
              include: {
                answers: {
                  orderBy: { createdAt: "desc" },
                  take: 1,
                },
              },
            },
            codingSubmissions: {
              take: 1,
            },
          },
        },
      },
    });

    if (!latestInterview) {
      return NextResponse.json({ success: true, interview: null });
    }

    // Format real answers with question-specific model answers
    const answers = latestInterview.rounds.flatMap((r) =>
      r.questions.map((q) => {
        const latestAns = q.answers[0];
        let strengths: string[] = [];
        let weaknesses: string[] = [];
        try {
          if (latestAns?.strengths) strengths = JSON.parse(latestAns.strengths);
          if (latestAns?.weaknesses) weaknesses = JSON.parse(latestAns.weaknesses);
        } catch {}

        const specificModelAnswer = getRecommendedModelAnswer(q.questionText, r.roundType);

        let finalImprovedExample = latestAns?.improvedExample;
        if (
          !finalImprovedExample ||
          finalImprovedExample.startsWith("Use the STAR") ||
          finalImprovedExample.includes("In my experience, I always approach this methodically")
        ) {
          finalImprovedExample = specificModelAnswer;
        }

        return {
          questionText: q.questionText,
          roundTitle: r.title,
          transcript: latestAns?.userTranscript || "(Question Skipped / No answer provided)",
          evaluation: {
            score: latestAns?.score ?? 0,
            clarityScore: latestAns?.clarityScore ?? 0,
            relevanceScore: latestAns?.relevanceScore ?? 0,
            fillerWordCount: latestAns?.fillerWordCount ?? 0,
            feedback: latestAns?.feedback || (latestAns ? "Evaluation complete." : "Question was skipped without an answer."),
            strengths,
            weaknesses: weaknesses.length > 0 ? weaknesses : (latestAns ? [] : ["No spoken answer was provided."]),
            improvedExample: finalImprovedExample,
          },
        };
      })
    );

    let strengths: string[] = [];
    let improvements: { problem: string; whyItMatters: string; betterExample: string; howToPractice: string }[] = [];

    try {
      if (latestInterview.strengths) strengths = JSON.parse(latestInterview.strengths);
      if (latestInterview.improvements) improvements = JSON.parse(latestInterview.improvements);
    } catch {}

    return NextResponse.json({
      success: true,
      interview: {
        id: latestInterview.id,
        title: latestInterview.title,
        targetRole: latestInterview.targetRole,
        overallScore: latestInterview.overallScore,
        strengths,
        improvements,
        answers,
      },
    });
  } catch (error: unknown) {
    console.error("Latest Interview Feedback Error:", error);
    return NextResponse.json({ error: "Failed to load latest interview feedback" }, { status: 500 });
  }
}
