"use client";

import { useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkles,
  HelpCircle,
  Video,
} from "lucide-react";
import { RoundFeedbackItem, ImprovementItem } from "@/types";

interface StrengthsWeaknessesCardProps {
  roundsFeedback?: RoundFeedbackItem[];
  improvements?: ImprovementItem[];
}

export function StrengthsWeaknessesCard({
  roundsFeedback = [],
  improvements = [],
}: StrengthsWeaknessesCardProps) {
  // Track expanded state for each round (default all expanded to true)
  const [expandedRounds, setExpandedRounds] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });

  const toggleRound = (roundNumber: number) => {
    setExpandedRounds((prev) => ({
      ...prev,
      [roundNumber]: !prev[roundNumber],
    }));
  };

  const hasRounds = roundsFeedback && roundsFeedback.length > 0;

  return (
    <div className="space-y-6">
      <div className="bg-[#0b0f19] dark:bg-[#0b0f19] p-4 sm:p-7 rounded-3xl border border-slate-800 shadow-2xl transition-colors">
        {/* Main Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5 text-indigo-400 font-extrabold text-sm uppercase tracking-wider">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>5-Round Performance Review & Question Analysis</span>
          </div>
          <span className="text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
            All 5 Rounds (Click to Expand / Collapse)
          </span>
        </div>

        {/* 5-Round Diagnostic Cards */}
        <div className="space-y-6">
          {hasRounds ? (
            roundsFeedback.map((round) => {
              const isGood = round.score >= 50;
              const isExpanded = expandedRounds[round.roundNumber] ?? true;
              const questions = round.questions || [];

              return (
                <div
                  key={round.roundNumber}
                  className="rounded-3xl border border-indigo-500/30 bg-[#0f172a] shadow-xl overflow-hidden text-xs transition-all"
                >
                  {/* Round Top Header Bar with Clickable Toggle */}
                  <div
                    onClick={() => toggleRound(round.roundNumber)}
                    className="p-4 sm:p-5 bg-slate-900/90 hover:bg-slate-900 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-indigo-500/30 shrink-0">
                        R{round.roundNumber}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white flex items-center gap-2">
                          <span>{round.title}</span>
                        </h4>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {questions.length > 0 ? `${questions.length} Question(s) Evaluated` : "Technical Round Evaluation"}
                        </span>
                      </div>
                    </div>

                    {/* Score & Threshold Badge (50+ Good / 1-49 Weak / 0 Skipped) + Chevron */}
                    <div className="flex items-center gap-3 shrink-0">
                      {round.score >= 50 ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold text-xs shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Score: {round.score}/100 • Good (Strong Performance)</span>
                        </div>
                      ) : round.score > 0 ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 font-bold text-xs shadow-xs">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                          <span>Score: {round.score}/100 • Needs Improvement</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300/80 font-bold text-xs shadow-xs">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                          <span>Score: 0/100 • Skipped / Not Attempted</span>
                        </div>
                      )}

                      <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                  </div>

                  {/* Expandable Round Content */}
                  {isExpanded && (
                    <div className="divide-y divide-slate-800 animate-in fade-in duration-200">
                      {/* 1. Coach Observation */}
                      <div className="p-5 bg-rose-950/25 flex items-start gap-3.5">
                        <div className="w-7 h-7 rounded-xl bg-rose-900/60 border border-rose-700/60 text-rose-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          💬
                        </div>
                        <div>
                          <span className="font-extrabold text-rose-300 uppercase tracking-wider text-[11px] block mb-1">
                            Coach&apos;s Direct Observation
                          </span>
                          <p className="text-white leading-relaxed font-semibold text-sm">{round.problem}</p>
                        </div>
                      </div>

                      {/* 2. Why Interviewers Care */}
                      <div className="p-5 bg-amber-950/20 flex items-start gap-3.5">
                        <div className="w-7 h-7 rounded-xl bg-amber-900/60 border border-amber-700/60 text-amber-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          💡
                        </div>
                        <div>
                          <span className="font-extrabold text-amber-300 uppercase tracking-wider text-[11px] block mb-1">
                            Why Interviewers Look for This
                          </span>
                          <p className="text-slate-300 leading-relaxed font-medium">{round.whyItMatters}</p>
                        </div>
                      </div>

                      {/* 3. Actionable Practice */}
                      <div className="p-5 bg-indigo-950/25 flex items-start gap-3.5">
                        <div className="w-7 h-7 rounded-xl bg-indigo-900/60 border border-indigo-700/60 text-indigo-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          🎯
                        </div>
                        <div>
                          <span className="font-extrabold text-indigo-300 uppercase tracking-wider text-[11px] block mb-1">
                            How to Practice for Next Time
                          </span>
                          <p className="text-slate-300 leading-relaxed font-medium">{round.howToPractice}</p>
                        </div>
                      </div>

                      {/* 4. Questions, Spoken Answers & Humanized Model Answers */}
                      {questions.length > 0 && (
                        <div className="p-5 bg-[#090d16] space-y-4">
                          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Round {round.roundNumber} Questions & Humanized Model Answers</span>
                          </div>

                          <div className="space-y-4">
                            {questions.map((q, qIdx) => {
                              const isSkipped = q.score === 0 || q.transcript.includes("Skipped") || q.transcript.includes("No answer");

                              return (
                                <div
                                  key={qIdx}
                                  className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4 shadow-md text-xs"
                                >
                                  {/* Question Title & Score */}
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                                    <div className="flex items-start gap-2.5">
                                      <span className="w-6 h-6 rounded-lg bg-indigo-900/60 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                        Q{qIdx + 1}
                                      </span>
                                      <h5 className="text-xs sm:text-sm font-bold text-white leading-snug">
                                        {q.questionText}
                                      </h5>
                                    </div>
                                    <span className={`px-3 py-1 rounded-xl font-bold text-xs shrink-0 ${
                                      q.score >= 50
                                        ? "bg-emerald-950/80 border border-emerald-700 text-emerald-300"
                                        : "bg-rose-950/80 border border-rose-700 text-rose-300"
                                    }`}>
                                      Score: {q.score}/100
                                    </span>
                                  </div>

                                  {/* Candidate's Spoken Answer */}
                                  <div className="p-3.5 rounded-xl bg-[#090d16] border border-slate-800 space-y-1">
                                    <div className="flex items-center justify-between text-slate-400 font-semibold text-[11px]">
                                      <span>Your Spoken Answer:</span>
                                      {q.fillerWordCount > 0 && (
                                        <span className="text-rose-400 font-bold">
                                          {q.fillerWordCount} filler words detected
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-slate-200 font-medium leading-relaxed italic">
                                      &ldquo;{q.transcript}&rdquo;
                                    </p>
                                  </div>

                                  {/* Strengths & Opportunities (Hide fake strengths if skipped) */}
                                  <div className={`grid gap-3 ${!isSkipped && q.strengths.length > 0 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
                                    {!isSkipped && q.strengths.length > 0 && (
                                      <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-900/60 space-y-1">
                                        <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                          What You Did Well
                                        </span>
                                        <ul className="space-y-0.5 text-emerald-200">
                                          {q.strengths.map((s, i) => (
                                            <li key={i}>• {s}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-900/60 space-y-1">
                                      <span className="font-bold text-amber-300 flex items-center gap-1.5">
                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                        Areas to Sharpen
                                      </span>
                                      <ul className="space-y-0.5 text-amber-200">
                                        {isSkipped ? (
                                          <li>• You skipped this question without speaking. Giving even a 30-second answer gives the interviewer something positive to evaluate.</li>
                                        ) : (
                                          q.weaknesses.map((w, i) => <li key={i}>• {w}</li>)
                                        )}
                                      </ul>
                                    </div>
                                  </div>

                                  {/* Humanized Recommended Model Answer */}
                                  <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/40 space-y-2">
                                    <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                                      <Sparkles className="w-4 h-4 text-indigo-400" />
                                      <span>Recommended Model Answer (Natural &amp; Conversational):</span>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-[#090d16] border border-indigo-500/30 text-emerald-200 text-xs leading-relaxed whitespace-pre-wrap shadow-inner font-sans">
                                      {q.improvedExample}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
