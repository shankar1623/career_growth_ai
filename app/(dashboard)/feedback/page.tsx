"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquareCheck, Sparkles, Compass, ArrowRight, Video, Loader2, AlertCircle } from "lucide-react";
import { StrengthsWeaknessesCard } from "@/components/feedback/StrengthsWeaknessesCard";
import { AnswerImprovementCard } from "@/components/feedback/AnswerImprovementCard";

interface EvaluationItem {
  score: number;
  clarityScore: number;
  relevanceScore: number;
  fillerWordCount: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  improvedExample: string;
}

interface AnswerItem {
  questionText: string;
  roundTitle: string;
  transcript: string;
  evaluation: EvaluationItem;
}

export default function FeedbackPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [improvements, setImprovements] = useState<
    { problem: string; whyItMatters: string; betterExample: string; howToPractice: string }[]
  >([]);
  const [answers, setAnswers] = useState<AnswerItem[]>([]);
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    async function loadLatestFeedback() {
      try {
        const res = await fetch("/api/interview/latest");
        const data = await res.json();

        if (data.interview) {
          setHasSession(true);
          setTargetRole(data.interview.targetRole || "Software Engineer");
          setStrengths(data.interview.strengths || []);
          setImprovements(data.interview.improvements || []);
          setAnswers(data.interview.answers || []);
        }
      } catch (err) {
        console.warn("Feedback load error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadLatestFeedback();
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Loading your real interview performance feedback...</span>
      </div>
    );
  }

  if (!hasSession || answers.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xs">
          <MessageSquareCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">No Mock Interview Completed Yet</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Take your first AI video mock interview to receive real spoken answer transcript evaluations, model answer rewrites, and weakness diagnostics.
        </p>
        <Link
          href="/mock-interview"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-bold text-white transition-all shadow-md shadow-indigo-500/25"
        >
          <Video className="w-4 h-4" />
          <span>Start Your First Mock Interview</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
            <MessageSquareCheck className="w-3.5 h-3.5" />
            <span>AI Diagnostic Feedback Studio ({targetRole})</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Performance Review & Answer Improvements
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Actionable breakdowns of your real spoken answers, detected gaps, and structured model rewrites.
          </p>
        </div>

        <Link
          href="/roadmap"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-bold text-white transition-all shadow-md shadow-indigo-500/25"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Follow Personalized Roadmap</span>
        </Link>
      </div>

      {/* Detailed Actionable Engineering Improvement Plan */}
      {improvements.length > 0 ? (
        <StrengthsWeaknessesCard improvements={improvements} />
      ) : null}

      {/* Granular Answer-by-Answer Improvements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Real Answer-by-Answer Improvements</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">{answers.length} questions in latest session</span>
        </div>

        <div className="space-y-4">
          {answers.map((ans, idx) => (
            <AnswerImprovementCard
              key={idx}
              orderNumber={idx + 1}
              questionText={ans.questionText}
              roundTitle={ans.roundTitle}
              transcript={ans.transcript}
              evaluation={ans.evaluation}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
