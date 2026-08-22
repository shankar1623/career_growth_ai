"use client";

import { useState } from "react";
import { Copy, Check, AlertCircle, CheckCircle2, ArrowRight, Sparkles, ShieldAlert } from "lucide-react";
import { SectionAnalysis } from "@/types";
import { getScoreColor } from "@/lib/utils";

interface SectionAnalysisCardProps {
  section: SectionAnalysis;
}

export function SectionAnalysisCard({ section }: SectionAnalysisCardProps) {
  const [copied, setCopied] = useState(false);
  const scoreColors = getScoreColor(section.score);

  const handleCopy = () => {
    navigator.clipboard.writeText(section.suggestedReplacement);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      {/* Section Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{section.sectionName}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Diagnostic breakdown & ATS optimization analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Section Score:</span>
          <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${scoreColors.badge}`}>
            {section.score} / 100
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Strengths & Weaknesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Observed Strengths</span>
            </div>
            <ul className="space-y-1.5">
              {section.strengths.map((st, i) => (
                <li key={i} className="text-xs text-emerald-900/90 dark:text-emerald-200 flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses / Concerns */}
          <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/60">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-2.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Areas for Improvement</span>
            </div>
            <ul className="space-y-1.5">
              {section.weaknesses.map((wk, i) => (
                <li key={i} className="text-xs text-amber-900/90 dark:text-amber-200 flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{wk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ATS & Grammar Concerns if present */}
        {((section.atsConcerns && section.atsConcerns.length > 0) || (section.grammarConcerns && section.grammarConcerns.length > 0)) && (
          <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            {section.atsConcerns && section.atsConcerns.length > 0 && (
              <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <ShieldAlert className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">ATS Parsing Note: </span>
                  {section.atsConcerns.join(" ")}
                </div>
              </div>
            )}
            {section.grammarConcerns && section.grammarConcerns.length > 0 && (
              <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Tone & Grammar: </span>
                  {section.grammarConcerns.join(" ")}
                </div>
              </div>
            )}
          </div>
        )}

        {/* The Exact Comparison: Original -> Problems -> Suggested Replacement */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-850 overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
          {/* 1. Original Content */}
          <div className="p-4 bg-rose-50/20 dark:bg-rose-950/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
                Current Original Content
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">As extracted from your resume</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/60 text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
              {section.originalText || "(Section text not found or empty)"}
            </div>
          </div>

          {/* 2. Identified Problems */}
          {section.problems && section.problems.length > 0 && (
            <div className="p-4 bg-amber-50/20 dark:bg-amber-950/20">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block mb-2">
                Identified Problems & Deficiencies
              </span>
              <ul className="space-y-1">
                {section.problems.map((prob, i) => (
                  <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 font-medium">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>{prob}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 3. Suggested Replacement */}
          <div className="p-4 bg-emerald-50/30 dark:bg-emerald-950/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Suggested Action-Driven Replacement</span>
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed shadow-xs">
              {section.suggestedReplacement}
            </div>

            {section.explanation && (
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2.5 italic">
                <span className="font-semibold text-slate-700 dark:text-slate-300 not-italic">Why this works: </span>
                {section.explanation}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
