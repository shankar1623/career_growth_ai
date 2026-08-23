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
          orderBy: { roundNumber: "asc" },
          include: {
            questions: {
              orderBy: { orderIndex: "asc" },
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

    // Format question-level answers
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

    // Compute Round-by-Round Diagnostics for All 5 Rounds
    const roundMetadata = [
      {
        roundNumber: 1,
        roundType: "SELF_INTRO",
        title: "Round 1: Self Introduction & Background",
        goodProblem: "Strong personal summary. Focus on keeping the elevator pitch strictly under 90 seconds while front-loading your biggest technical achievements.",
        weakProblem: "Self-introduction was too broad or brief, lacking a clear narrative arc connecting past projects to target role requirements.",
        whyItMatters: "First impressions set the tone for the entire interview. Interviewers evaluate clarity, confidence, and how concisely you communicate your career journey.",
        betterExample: `'I am a Full-Stack Engineer with 3+ years of experience specializing in Next.js, Node.js, and PostgreSQL. In my recent role at Stripe, I engineered a high-throughput webhook processing engine handling 20,000 requests/sec. I am passionate about distributed architecture and excited about contributing to your team.'`,
        howToPractice: "Practice a 90-second pitch using the 3-part formula: Present (Current tech stack/role) -> Past (Top 2 impactful achievements) -> Future (Why this specific company).",
      },
      {
        roundNumber: 2,
        roundType: "RESUME_DEEP_DIVE",
        title: "Round 2: Resume & Project Deep-Dive",
        goodProblem: "Good architectural explanation. Quantify end-to-end performance gains with exact before-and-after numbers (e.g. latency, query time, scale).",
        weakProblem: "Project answers remained high-level and lacked technical depth on system architecture, database schema design, and root-cause debugging.",
        whyItMatters: "Interviewers probe your resume projects to verify authentic hands-on ownership and evaluate how you navigate difficult production trade-offs.",
        betterExample: `'When our database experienced slow queries under peak traffic, I profiled the execution plans with EXPLAIN ANALYZE, discovered missing composite indexes on (tenant_id, created_at), and reduced query latency by 85% from 420ms down to 62ms.'`,
        howToPractice: "Pick 2 projects from your resume and write out: Architectural decisions -> Trade-offs considered -> Hardest production bug diagnosed -> Exact quantifiable metrics.",
      },
      {
        roundNumber: 3,
        roundType: "TECHNICAL",
        title: "Round 3: Core Technical & System Architecture",
        goodProblem: "Solid conceptual grasp. Further articulate Redis caching invalidation strategies, database sharding, and resilience fallback patterns.",
        weakProblem: "Technical explanations were vague regarding concurrency, asynchronous event loops, and database indexing internals.",
        whyItMatters: "Core technical competence determines your engineering level (Junior vs Mid vs Senior) and system reliability instincts.",
        betterExample: `'In Node.js, the event loop handles non-blocking I/O via Libuv thread pools. For high-throughput endpoints, we implement Redis write-through caching with 5-minute TTL, offloading 75% of read queries from PostgreSQL.'`,
        howToPractice: "Practice explaining core concepts (Event Loop, B-Tree indexes, CAP theorem, REST vs GraphQL, Redis caching) aloud in under 2 minutes each.",
      },
      {
        roundNumber: 4,
        roundType: "CODING",
        title: "Round 4: Live Coding & Algorithmic Problem Solving",
        goodProblem: "Good algorithmic logic. Ensure you always state Big-O time & space complexity and verify edge cases before writing code.",
        weakProblem: "Coding solution struggled with boundary constraints (empty input, null pointers) or suboptimal brute-force complexity.",
        whyItMatters: "Live coding evaluates your structured problem-solving approach, clean variable naming, and algorithmic efficiency.",
        betterExample: `'Before iterating, I validate if the array is null or empty. Using a two-pointer sliding window guarantees strict O(N) linear time and O(1) auxiliary space, avoiding O(N^2) brute force.'`,
        howToPractice: "Practice timed 20-minute LeetCode Medium problems. Always talk through: Clarify constraints -> State 3 test cases -> Explain approach -> Code -> Dry run.",
      },
      {
        roundNumber: 5,
        roundType: "BEHAVIORAL",
        title: "Round 5: Behavioral HR & STAR Method",
        goodProblem: "Solid teamwork examples. Ensure every story highlights measurable outcomes and engineering leadership.",
        weakProblem: "Behavioral answers were conversational rather than structured using the STAR method (Situation, Task, Action, Result).",
        whyItMatters: "Culture fit and engineering collaboration determine hiring decisions. Interviewers assess how you handle conflicts, tight deadlines, and incidents.",
        betterExample: `'Situation: 3 days before release, requirements shifted for our checkout flow. Task: Deliver the feature without delaying the release. Action: I prioritized core user flows, negotiated deferring nice-to-have animations to sprint 2, and coordinated pair programming on the API integration. Result: Deployed on schedule with zero critical bugs.'`,
        howToPractice: "Prepare 5 STAR stories: 1) Tight deadline, 2) Technical disagreement during code review, 3) Production incident, 4) Refactoring tech debt, 5) Unclear requirements.",
      },
    ];

    const roundsFeedback = latestInterview.rounds.map((r, index) => {
      const meta = roundMetadata[index] || roundMetadata[0];
      let roundScore = r.score;

      const roundAnswers = r.questions.flatMap((q) => q.answers);
      if (roundAnswers.length > 0) {
        roundScore = Math.round(roundAnswers.reduce((a, c) => a + c.score, 0) / roundAnswers.length);
      } else if (r.codingSubmissions.length > 0) {
        roundScore = r.codingSubmissions[0].correctnessScore;
      }

      // If round was evaluated or default to realistic score based on interview overall
      if (!roundScore || roundScore === 0) {
        roundScore = Math.max(30, latestInterview.overallScore || 70);
      }

      const roundQuestions = r.questions.map((q) => {
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
          transcript: latestAns?.userTranscript || "(Question Skipped / No answer provided)",
          score: latestAns?.score ?? 0,
          clarityScore: latestAns?.clarityScore ?? 0,
          relevanceScore: latestAns?.relevanceScore ?? 0,
          fillerWordCount: latestAns?.fillerWordCount ?? 0,
          feedback: latestAns?.feedback || (latestAns ? "Evaluation complete." : "Question was skipped without an answer."),
          strengths,
          weaknesses: weaknesses.length > 0 ? weaknesses : (latestAns ? [] : ["No spoken answer was provided."]),
          improvedExample: finalImprovedExample,
        };
      });

      const isGood = roundScore >= 50;

      return {
        roundNumber: r.roundNumber,
        roundType: r.roundType,
        title: r.title || meta.title,
        score: roundScore,
        isGood,
        statusText: isGood ? "Good / Strong Performance" : "Weak / Needs Improvement",
        problem: isGood ? meta.goodProblem : meta.weakProblem,
        whyItMatters: meta.whyItMatters,
        betterExample: meta.betterExample,
        howToPractice: meta.howToPractice,
        questions: roundQuestions,
      };
    });

    return NextResponse.json({
      success: true,
      interview: {
        id: latestInterview.id,
        title: latestInterview.title,
        targetRole: latestInterview.targetRole,
        overallScore: latestInterview.overallScore,
        roundsFeedback,
        answers,
      },
    });
  } catch (error: unknown) {
    console.error("Latest Interview Feedback Error:", error);
    return NextResponse.json({ error: "Failed to load latest interview feedback" }, { status: 500 });
  }
}
