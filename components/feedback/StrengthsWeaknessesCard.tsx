"use client";

import { AlertTriangle, BookOpen, CheckCircle2, Target, Sparkles, Lightbulb, Video, ShieldAlert, Award } from "lucide-react";
import { RoundFeedbackItem, ImprovementItem } from "@/types";

interface StrengthsWeaknessesCardProps {
  roundsFeedback?: RoundFeedbackItem[];
  improvements?: ImprovementItem[];
}

export function StrengthsWeaknessesCard({
  roundsFeedback = [],
  improvements = [],
}: StrengthsWeaknessesCardProps) {
  // If round-by-round items exist, render all 5 rounds with exact score indicators (>= 50 Good, < 50 Weak)
  const hasRounds = roundsFeedback && roundsFeedback.length > 0;

  return (
    <div className="space-y-6">
      <div className="bg-[#0b0f19] dark:bg-[#0b0f19] p-5 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl transition-colors">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5 text-amber-400 font-extrabold text-sm uppercase tracking-wider">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span>Round-by-Round Performance Diagnostics & Master Plans</span>
          </div>
          <span className="text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
            All 5 Rounds Evaluated
          </span>
        </div>

        {/* Round Cards */}
        <div className="space-y-6">
          {hasRounds ? (
            roundsFeedback.map((round) => {
              const isGood = round.score >= 50;

              return (
                <div
                  key={round.roundNumber}
                  className="rounded-3xl border border-indigo-500/30 bg-[#0f172a] shadow-xl overflow-hidden divide-y divide-slate-800 text-xs transition-all"
                >
                  {/* Round Top Header Bar with Score & Status */}
                  <div className="p-4 sm:p-5 bg-slate-900/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-indigo-500/30 shrink-0">
                        R{round.roundNumber}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white">{round.title}</h4>
                        <span className="text-[11px] text-slate-400 font-medium">
                          5-Round Technical Evaluation
                        </span>
                      </div>
                    </div>

                    {/* Score & Threshold Badge: 50+ Good / Less than 50 Weak */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isGood ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold text-xs shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Score: {round.score}/100 • Good (Strong Performance)</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 font-bold text-xs shadow-xs animate-pulse">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                          <span>Score: {round.score}/100 • Weak (Needs Improvement)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 1. Problem Identification */}
                  <div className="p-5 bg-rose-950/25 flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-xl bg-rose-900/60 border border-rose-700/60 text-rose-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      !
                    </div>
                    <div>
                      <span className="font-extrabold text-rose-300 uppercase tracking-wider text-[11px] block mb-1">
                        Identified Diagnostic Focus Area
                      </span>
                      <p className="text-white leading-relaxed font-semibold text-sm">{round.problem}</p>
                    </div>
                  </div>

                  {/* 2. Why It Matters to Interviewers */}
                  <div className="p-5 bg-amber-950/20 flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-xl bg-amber-900/60 border border-amber-700/60 text-amber-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-amber-300 uppercase tracking-wider text-[11px] block mb-1">
                        Why Top Tech Interviewers Care
                      </span>
                      <p className="text-slate-300 leading-relaxed font-medium">{round.whyItMatters}</p>
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
                        {round.betterExample}
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
                        How to Practice & Master Round {round.roundNumber}
                      </span>
                      <p className="text-slate-300 leading-relaxed font-medium">{round.howToPractice}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            improvements.map((item, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-indigo-500/30 bg-[#0f172a] shadow-xl overflow-hidden divide-y divide-slate-800 text-xs"
              >
                <div className="p-5 bg-rose-950/30 flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-xl bg-rose-900/60 border border-rose-700/60 text-rose-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <span className="font-extrabold text-rose-300 uppercase tracking-wider text-[11px] block mb-1">
                      Identified Problem
                    </span>
                    <p className="text-white leading-relaxed font-semibold text-sm">{item.problem}</p>
                  </div>
                </div>

                <div className="p-5 bg-amber-950/20 flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-900/60 border border-amber-700/60 text-amber-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-amber-300 uppercase tracking-wider text-[11px] block mb-1">
                      Why Interviewers Care
                    </span>
                    <p className="text-slate-300 leading-relaxed font-medium">{item.whyItMatters}</p>
                  </div>
                </div>

                <div className="p-5 bg-emerald-950/25 flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-xl bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-extrabold text-emerald-300 uppercase tracking-wider text-[11px] block mb-1.5">
                      Better Example Response
                    </span>
                    <div className="p-4 rounded-2xl bg-[#090d16] border border-emerald-500/30 text-emerald-200 font-mono text-xs leading-relaxed shadow-inner">
                      {item.betterExample}
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-indigo-950/25 flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-xl bg-indigo-900/60 border border-indigo-700/60 text-indigo-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-indigo-300 uppercase tracking-wider text-[11px] block mb-1">
                      How to Practice & Master
                    </span>
                    <p className="text-slate-300 leading-relaxed font-medium">{item.howToPractice}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
