"use client";

import { AlertTriangle, BookOpen, CheckCircle2, Target, Sparkles, Lightbulb } from "lucide-react";
import { ImprovementItem } from "@/types";

interface StrengthsWeaknessesCardProps {
  strengths?: string[];
  improvements: ImprovementItem[];
}

export function StrengthsWeaknessesCard({
  improvements,
}: StrengthsWeaknessesCardProps) {
  return (
    <div className="space-y-6">
      {/* What Needs Improvement & Actionable Practice */}
      <div className="bg-[#0b0f19] dark:bg-[#0b0f19] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5 text-amber-400 font-extrabold text-sm uppercase tracking-wider">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span>What Needs Improvement & Actionable Practice</span>
          </div>
          <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
            {improvements.length} High-Impact Focus Areas
          </span>
        </div>

        <div className="space-y-6">
          {improvements.map((item, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-indigo-500/30 bg-[#0f172a] shadow-lg overflow-hidden divide-y divide-slate-800 text-xs"
            >
              {/* 1. Problem Identification */}
              <div className="p-5 bg-rose-950/30 flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-xl bg-rose-900/60 border border-rose-700/60 text-rose-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <span className="font-extrabold text-rose-300 uppercase tracking-wider text-[11px] block mb-1">
                    Identified Diagnostic Problem
                  </span>
                  <p className="text-white leading-relaxed font-semibold text-sm">{item.problem}</p>
                </div>
              </div>

              {/* 2. Why It Matters to Tech Interviewers */}
              <div className="p-5 bg-amber-950/20 flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-xl bg-amber-900/60 border border-amber-700/60 text-amber-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-amber-300 uppercase tracking-wider text-[11px] block mb-1">
                    Why Top Tech Interviewers Care
                  </span>
                  <p className="text-slate-300 leading-relaxed font-medium">{item.whyItMatters}</p>
                </div>
              </div>

              {/* 3. Exemplary Senior Engineer Model Answer */}
              <div className="p-5 bg-emerald-950/25 flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-xl bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-extrabold text-emerald-300 uppercase tracking-wider text-[11px] block mb-1.5">
                    Better Exemplary Senior Response (Model Answer)
                  </span>
                  <div className="p-4 rounded-2xl bg-[#090d16] border border-emerald-500/30 text-emerald-200 font-mono text-xs leading-relaxed shadow-inner">
                    {item.betterExample}
                  </div>
                </div>
              </div>

              {/* 4. Actionable Practice & Master Strategy */}
              <div className="p-5 bg-indigo-950/25 flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-xl bg-indigo-900/60 border border-indigo-700/60 text-indigo-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-indigo-300 uppercase tracking-wider text-[11px] block mb-1">
                    How to Practice & Master This Topic
                  </span>
                  <p className="text-slate-300 leading-relaxed font-medium">{item.howToPractice}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
