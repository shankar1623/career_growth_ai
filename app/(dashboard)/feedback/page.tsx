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
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="text-xs font-semibold text-slate-500">Loading your real interview performance feedback...</span>
      </div>
    );
  }

  if (!hasSession || answers.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <MessageSquareCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Mock Interview Completed Yet</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Take your first AI video mock interview to receive real spoken answer transcript evaluations, STAR model rewrites, and weakness diagnostics.
        </p>
        <Link
          href="/mock-interview"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
        >
          <Video className="w-4 h-4" />
          <span>Start Your First Mock Interview</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <MessageSquareCheck className="w-3.5 h-3.5" />
            <span>AI Diagnostic Feedback Studio ({targetRole})</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Performance Review & Answer Improvements
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Actionable breakdowns of your real spoken answers, detected gaps, and structured STAR model rewrites.
          </p>
        </div>

        <Link
          href="/roadmap"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white transition-colors shadow-xs shadow-indigo-200"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Follow Personalized Roadmap</span>
        </Link>
      </div>

      {/* Strengths & Weaknesses Detailed Cards */}
      {strengths.length > 0 || improvements.length > 0 ? (
        <StrengthsWeaknessesCard strengths={strengths} improvements={improvements} />
      ) : null}

      {/* Granular Answer-by-Answer STAR Improvements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Real Answer-by-Answer Improvements (STAR Framework)</span>
          </div>
          <span className="text-xs text-slate-500">{answers.length} questions in latest session</span>
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
