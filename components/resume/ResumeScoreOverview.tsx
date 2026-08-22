"use client";

import { CheckCircle2, AlertTriangle, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { ResumeOverallAnalysis } from "@/types";
import { getScoreColor } from "@/lib/utils";

interface ResumeScoreOverviewProps {
  analysis: ResumeOverallAnalysis;
}

export function ResumeScoreOverview({ analysis }: ResumeScoreOverviewProps) {
  const overallColors = getScoreColor(analysis.overallScore);
  const atsColors = getScoreColor(analysis.atsScore);

  const subScores = [
    { label: "ATS Compatibility", score: analysis.atsScore, weight: "High Priority" },
    { label: "Content Quality", score: analysis.contentScore, weight: "Action Verbs" },
    { label: "Impact & Metrics", score: analysis.impactScore, weight: "Numbers & Scale" },
    { label: "Technical Skills", score: analysis.skillsScore, weight: "Tech Stack" },
    { label: "Experience", score: analysis.experienceScore, weight: "Scope & Depth" },
    { label: "Projects", score: analysis.projectsScore, weight: "Architecture" },
    { label: "Formatting", score: analysis.formattingScore, weight: "Scanability" },
    { label: "Grammar & Tone", score: analysis.grammarScore, weight: "Active Voice" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Overall Score & ATS Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall Score */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Overall Resume Score
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${overallColors.badge}`}>
                {analysis.overallScore >= 80 ? "Excellent" : analysis.overallScore >= 65 ? "Good" : "Needs Polish"}
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {analysis.overallScore}
              </span>
              <span className="text-sm font-medium text-slate-400 dark:text-slate-500">/ 100</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  analysis.overallScore >= 80 ? "bg-emerald-500" : analysis.overallScore >= 60 ? "bg-indigo-500" : "bg-amber-500"
                }`}
                style={{ width: `${analysis.overallScore}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              Aggregated across 8 core resume dimensions and ATS parsing algorithms.
            </p>
          </div>
        </div>

        {/* ATS Compatibility */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                ATS Compatibility
              </span>
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                {analysis.atsScore}%
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Industry benchmark: 75%+</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-500"
                style={{ width: `${analysis.atsScore}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              Measures keyword density, standard header naming, and parser scanability.
            </p>
          </div>
        </div>

        {/* Quick Summary / Status */}
        <div className="bg-gradient-to-br from-indigo-50/70 to-slate-50 dark:from-indigo-950/40 dark:to-slate-900 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-900/60 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>AI Executive Review</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-2.5 leading-relaxed font-medium">
              Your resume has strong foundations in technical vocabulary. Addressing the top 5 suggested fixes below can elevate your ATS score to the top 10% of applicants.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Zap className="w-3.5 h-3.5" />
            <span>Review section replacements below</span>
          </div>
        </div>
      </div>

      {/* 8 Sub-score Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {subScores.map((item) => {
          const colors = getScoreColor(item.score);
          return (
            <div
              key={item.label}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{item.label}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{item.weight}</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className={`text-xl font-bold ${colors.text}`}>{item.score}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">/ 100</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className={`h-full ${
                    item.score >= 80 ? "bg-emerald-500" : item.score >= 60 ? "bg-indigo-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Top 5 Things To Fix Card */}
      {analysis.topFixes && analysis.topFixes.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shadow-2xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Top 5 Things To Fix</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Highest-impact revisions to increase interview callback rates</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {analysis.topFixes.map((fix, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{fix}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
