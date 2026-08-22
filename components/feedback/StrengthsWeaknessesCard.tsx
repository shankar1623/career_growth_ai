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
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>What You Did Well (Observed Strengths)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {strengths.map((str, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-950 font-medium leading-relaxed"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{str}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. What Needs Improvement: Problem -> Why It Matters -> Better Example -> How to Practice */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>What Needs Improvement & Actionable Practice</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {improvements.length} high-impact areas
          </span>
        </div>

        <div className="space-y-4">
          {improvements.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-slate-50/30 overflow-hidden divide-y divide-slate-200 text-xs"
            >
              {/* Problem */}
              <div className="p-4 bg-rose-50/20 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">Identified Problem:</span>
                  <p className="text-slate-700 leading-relaxed font-medium">{item.problem}</p>
                </div>
              </div>

              {/* Why It Matters */}
              <div className="p-4 bg-amber-50/20 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  !
                </div>
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">Why It Matters to Interviewers:</span>
                  <p className="text-slate-700 leading-relaxed">{item.whyItMatters}</p>
                </div>
              </div>

              {/* Better Example */}
              <div className="p-4 bg-emerald-50/20 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">Better Example Response:</span>
                  <div className="p-2.5 rounded-lg bg-white border border-emerald-200 text-slate-800 font-mono text-[11px] leading-relaxed">
                    {item.betterExample}
                  </div>
                </div>
              </div>

              {/* How to Practice */}
              <div className="p-4 bg-indigo-50/20 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="w-3 h-3" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">How to Practice & Master:</span>
                  <p className="text-slate-700 leading-relaxed font-medium">{item.howToPractice}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
