"use client";

import { CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Sparkles, HelpCircle } from "lucide-react";
import { ImprovementItem } from "@/types";

interface StrengthsWeaknessesCardProps {
  strengths: string[];
  improvements: ImprovementItem[];
}

export function StrengthsWeaknessesCard({
  strengths,
  improvements,
}: StrengthsWeaknessesCardProps) {
  return (
    <div className="space-y-6">
      {/* 1. What You Did Well */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>What You Did Well (Observed Strengths)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {strengths.map((str, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 flex items-start gap-2.5 text-xs text-emerald-950 dark:text-emerald-200 font-medium leading-relaxed"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{str}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. What Needs Improvement: Problem -> Why It Matters -> Better Example -> How to Practice */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>What Needs Improvement & Actionable Practice</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {improvements.length} high-impact areas
          </span>
        </div>

        <div className="space-y-4">
          {improvements.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850 overflow-hidden divide-y divide-slate-200 dark:divide-slate-800 text-xs"
            >
              {/* Problem */}
              <div className="p-4 bg-rose-50/30 dark:bg-rose-950/30 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Identified Problem:</span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{item.problem}</p>
                </div>
              </div>

              {/* Why It Matters */}
              <div className="p-4 bg-amber-50/30 dark:bg-amber-950/30 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  !
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Why It Matters to Interviewers:</span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{item.whyItMatters}</p>
                </div>
              </div>

              {/* Better Example */}
              <div className="p-4 bg-emerald-50/30 dark:bg-emerald-950/30 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Better Example Response:</span>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 text-slate-800 dark:text-slate-200 font-mono text-[11px] leading-relaxed">
                    {item.betterExample}
                  </div>
                </div>
              </div>

              {/* How to Practice */}
              <div className="p-4 bg-indigo-50/30 dark:bg-indigo-950/30 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="w-3 h-3" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">How to Practice & Master:</span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{item.howToPractice}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
