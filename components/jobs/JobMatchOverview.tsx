"use client";

import { Target, CheckCircle2, TrendingUp, Sparkles } from "lucide-react";
import { JobMatchAnalysis } from "@/types";
import { getScoreColor } from "@/lib/utils";

interface JobMatchOverviewProps {
  analysis: JobMatchAnalysis;
}

export function JobMatchOverview({ analysis }: JobMatchOverviewProps) {
  const overallColors = getScoreColor(analysis.overallMatch);

  const breakdown = [
    { label: "Skills Match", score: analysis.skillsMatch },
    { label: "Experience Match", score: analysis.experienceMatch },
    { label: "Keyword Match", score: analysis.keywordMatch },
    { label: "Project Relevance", score: analysis.projectRelevance },
    { label: "Responsibilities Match", score: analysis.responsibilitiesMatch },
    { label: "ATS Target Match", score: analysis.atsMatch },
  ];

  return (
    <div className="space-y-6">
      {/* Top Match Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Role Match Compatibility
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Overall Job Match Score: <span className={overallColors.text}>{analysis.overallMatch}%</span>
          </h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Calculated by cross-referencing your resume&apos;s verified technologies, work scope, and project accomplishments with the job posting requirements.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 border border-slate-200 min-w-[140px]">
          <span className={`text-4xl font-extrabold ${overallColors.text}`}>
            {analysis.overallMatch}%
          </span>
          <span className="text-[11px] font-semibold text-slate-500 mt-1">
            {analysis.overallMatch >= 75 ? "Strong Candidate" : analysis.overallMatch >= 60 ? "Competitive" : "Gap identified"}
          </span>
        </div>
      </div>

      {/* Breakdown Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {breakdown.map((item) => {
          const colors = getScoreColor(item.score);
          return (
            <div key={item.label} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500 block truncate">{item.label}</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className={`text-xl font-bold ${colors.text}`}>{item.score}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
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

      {/* Strategic Match Recommendations */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-indigo-900 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Strategic Recommendations For This Application</span>
          </div>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec, i) => (
              <li key={i} className="text-xs text-slate-700 font-medium flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
