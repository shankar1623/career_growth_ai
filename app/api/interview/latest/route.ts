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

    // Extract candidate profile context (Name -> Education -> Projects)
    let candidateName = user.name || "Sai Shankar";
    let candidateEdu = "pursuing my Master's in Artificial Intelligence & Machine Learning";
    let candidateProject = "Full-Stack Web Platform";

    if (latestInterview.resumeId) {
      try {
        const resume = await prisma.resume.findUnique({
          where: { id: latestInterview.resumeId },
        });
        if (resume) {
          const rLower = (resume.rawText || "").toLowerCase();
          if (rLower.includes("sai") || rLower.includes("shankar")) {
            candidateName = "Sai Shankar";
          }
          if (rLower.includes("master") || rLower.includes("ai") || rLower.includes("aml")) {
            candidateEdu = "pursuing my Master's in Artificial Intelligence & Machine Learning";
          } else if (rLower.includes("bachelor") || rLower.includes("b.tech") || rLower.includes("computer science")) {
            candidateEdu = "holding a degree in Computer Science & Engineering";
          }
        }
      } catch {}
    }

    const candidateContext = {
      name: candidateName,
      education: candidateEdu,
      projects: candidateProject,
      role: latestInterview.targetRole || "Full-Stack Software Engineer",
    };

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

        const specificModelAnswer = getRecommendedModelAnswer(q.questionText, r.roundType, candidateContext);

        let finalImprovedExample = latestAns?.improvedExample;
        if (
          !finalImprovedExample ||
          finalImprovedExample.startsWith("Use the STAR") ||
          finalImprovedExample.startsWith("Hello! I am a software engineer") ||
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

    // Compute Humanized Round-by-Round Diagnostics for All 5 Rounds
    const roundMetadata = [
      {
        roundNumber: 1,
        roundType: "SELF_INTRO",
        title: "Round 1: Self Introduction & Background",
        goodProblem: "You gave a solid overview of your experience! To make it even more memorable, keep your story within 60 to 90 seconds and put your biggest project wins right at the start.",
        weakProblem: "Your introduction felt a bit too short or broad, and didn't clearly highlight the specific skills and projects that make you a great fit for this role.",
        whyItMatters: "The first 90 seconds set the tone for the entire conversation. Interviewers want to see your genuine passion, clear communication, and what kind of problems you love solving.",
        betterExample: getRecommendedModelAnswer("tell me about yourself", "SELF_INTRO"),
        howToPractice: "Practice talking through your background using a natural 3-step story: 1) What you're currently building & your core stack, 2) One standout project you're proud of, and 3) Why this specific team excites you.",
      },
      {
        roundNumber: 2,
        roundType: "RESUME_DEEP_DIVE",
        title: "Round 2: Resume & Project Deep-Dive",
        goodProblem: "You walked through your project well! To really stand out, mention exact before-and-after numbers (like how much you lowered query latency or how many users your feature supported).",
        weakProblem: "The explanation stayed high-level. Interviewers wanted to hear more about your real hands-on architectural decisions, data models, and how you solved tough bugs.",
        whyItMatters: "Interviewers want to see that you truly owned the code you wrote, made smart technical trade-offs, and learned valuable lessons from production bugs.",
        betterExample: getRecommendedModelAnswer("architecture of your most challenging project", "RESUME_DEEP_DIVE"),
        howToPractice: "Pick 2 favorite projects from your resume and practice telling the story: What was the core challenge, what tech choices did you make, and what was the real impact on performance?",
      },
      {
        roundNumber: 3,
        roundType: "TECHNICAL",
        title: "Round 3: Core Technical & System Architecture",
        goodProblem: "Great technical grasp! To take it to a senior level, bring in practical system design topics like caching invalidation, database sharding, or resilience fallbacks.",
        weakProblem: "The explanation felt a bit vague on core system concepts. Focus on clearly explaining asynchronous event loops, database indexing, and API design trade-offs.",
        whyItMatters: "This round tells interviewers how deeply you understand how software actually works under the hood and whether you can write resilient, scalable systems.",
        betterExample: getRecommendedModelAnswer("synchronous and asynchronous event loop", "TECHNICAL"),
        howToPractice: "Practice explaining fundamental concepts (like the Node.js Event Loop, B-Tree indexes, and Redis caching) out loud in under 2 minutes each as if explaining to a teammate.",
      },
      {
        roundNumber: 4,
        roundType: "CODING",
        title: "Round 4: Live Coding & Algorithmic Problem Solving",
        goodProblem: "Solid problem solving! Make sure to always state your Big-O time and space complexity out loud and test edge cases like empty inputs before finishing.",
        weakProblem: "The solution needed stronger edge-case validation (like empty arrays or null checks) or got stuck in a brute-force approach.",
        whyItMatters: "Interviewers look at how you think through edge cases, structure your logic, and write clean, readable code rather than just rushing to a solution.",
        betterExample: getRecommendedModelAnswer("coding algorithm solution", "CODING"),
        howToPractice: "Practice timed coding problems with this mental checklist: 1) Clarify the requirements, 2) Talk through 3 test cases, 3) Explain your approach, 4) Code cleanly, 5) Dry-run with an example.",
      },
      {
        roundNumber: 5,
        roundType: "BEHAVIORAL",
        title: "Round 5: Behavioral HR & STAR Method",
        goodProblem: "Great collaborative examples! Make sure every story finishes with the positive impact your solution had on your team or users.",
        weakProblem: "Your story felt conversational without a clear conclusion. Using the STAR structure (Situation, Task, Action, Result) will make your answers much more compelling.",
        whyItMatters: "Team chemistry and communication matter just as much as technical skills. Interviewers want to know how you collaborate, resolve disagreements, and deliver under pressure.",
        betterExample: getRecommendedModelAnswer("deadline requirements changed star method", "BEHAVIORAL"),
        howToPractice: "Prepare 4-5 go-to real stories: handling tight deadlines, working through a technical disagreement, troubleshooting a production issue, and taking ownership of an ambiguous feature.",
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

        const specificModelAnswer = getRecommendedModelAnswer(q.questionText, r.roundType, candidateContext);

        let finalImprovedExample = latestAns?.improvedExample;
        if (
          !finalImprovedExample ||
          finalImprovedExample.startsWith("Use the STAR") ||
          finalImprovedExample.startsWith("Hello! I am a software engineer") ||
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
