"use client";

import { CheckCircle2, AlertTriangle, Key, BookOpen, ShieldAlert } from "lucide-react";
import { MissingSkillItem, MissingKeywordItem } from "@/types";

interface MissingSkillsCardProps {
  strongMatches: string[];
  missingSkills: MissingSkillItem[];
  missingKeywords: MissingKeywordItem[];
}

export function MissingSkillsCard({
  strongMatches,
  missingSkills,
  missingKeywords,
}: MissingSkillsCardProps) {
  return (
    <div className="space-y-6">
      {/* 1. Strong Matches Found */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider mb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Strong Matches Found in Your Resume</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          These verified skills in your resume directly satisfy explicit technical requirements in the job description:
        </p>
        <div className="flex flex-wrap gap-2">
          {strongMatches.map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{skill}</span>
            </span>
          ))}
        </div>
      </div>

      {/* 2. Missing Skills & Learning Advice */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Missing Target Skills & Guidance</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {missingSkills.length} skills to bridge
          </span>
        </div>

        <div className="mb-4 p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-800 dark:text-white font-semibold">Integrity Rule:</strong> Never falsely claim skills on your resume that you do not have. Instead, review the learning suggestions below or discuss your adaptability in interviews.
          </span>
        </div>

        <div className="space-y-4">
          {missingSkills.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {item.skill}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Not in resume
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">What the JD asks: </span>
                  <span className="text-slate-600 dark:text-slate-400">{item.reason}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Why it matters: </span>
                  <span className="text-slate-600 dark:text-slate-400">{item.relevance}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs flex items-start gap-1.5 text-indigo-700 dark:text-indigo-400 font-medium">
                <BookOpen className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span><strong className="font-bold">How to prepare: </strong>{item.whyToLearn}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Missing Keywords */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider mb-4">
          <Key className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>ATS Keyword Gaps</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          These industry phrases and architectural concepts are frequently scanned by ATS parsers for this position:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {missingKeywords.map((kw, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white">{kw.keyword}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    kw.importance === "High"
                      ? "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300"
                      : "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300"
                  }`}
                >
                  {kw.importance}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{kw.context}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
