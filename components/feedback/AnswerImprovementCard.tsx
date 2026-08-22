"use client";

import { useState } from "react";
import { MessageSquare, Sparkles, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { AnswerEvaluationResult } from "@/types";

interface AnswerImprovementCardProps {
  questionText: string;
  transcript: string;
  evaluation: AnswerEvaluationResult;
  roundTitle?: string;
  orderNumber: number;
}

export function AnswerImprovementCard({
  questionText,
  transcript,
  evaluation,
  roundTitle,
  orderNumber,
}: AnswerImprovementCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 px-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
            {orderNumber}
          </span>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight line-clamp-1">{questionText}</h4>
            {roundTitle && <span className="text-[10px] text-slate-500 dark:text-slate-400">{roundTitle}</span>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Score: {evaluation.score}/100
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 space-y-4 text-xs">
          {/* Your Spoken Answer */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
              <span>Your Spoken Answer:</span>
              {evaluation.fillerWordCount > 0 && (
                <span className="text-rose-600 dark:text-rose-400 font-bold">
                  {evaluation.fillerWordCount} filler words detected
                </span>
              )}
            </div>
            <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-wrap">
              &ldquo;{transcript}&rdquo;
            </p>
          </div>

          {/* AI Diagnostic Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60 space-y-1">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Strengths
              </span>
              <ul className="space-y-0.5 text-emerald-900 dark:text-emerald-200">
                {evaluation.strengths.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/60 space-y-1">
              <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Opportunities to Sharpen
              </span>
              <ul className="space-y-0.5 text-amber-900 dark:text-amber-200">
                {evaluation.weaknesses.map((w, i) => (
                  <li key={i}>• {w}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Better Answer Example */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 space-y-1.5">
            <div className="flex items-center gap-1.5 text-indigo-900 dark:text-indigo-300 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Recommended Model Answer:</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900 text-slate-800 dark:text-slate-200 font-mono text-[11px] leading-relaxed whitespace-pre-wrap shadow-xs">
              {evaluation.improvedExample}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
