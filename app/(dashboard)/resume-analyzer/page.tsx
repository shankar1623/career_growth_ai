"use client";

import { useState } from "react";
import { ResumeUploadZone } from "@/components/resume/ResumeUploadZone";
import { ResumeScoreOverview } from "@/components/resume/ResumeScoreOverview";
import { SectionAnalysisCard } from "@/components/resume/SectionAnalysisCard";
import { ResumeOverallAnalysis } from "@/types";
import { Sparkles, FileText, ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function ResumeAnalyzerPage() {
  const [analysis, setAnalysis] = useState<ResumeOverallAnalysis | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);

  const handleAnalysisComplete = (newAnalysis: ResumeOverallAnalysis, newResumeId: string) => {
    setAnalysis(newAnalysis);
    setResumeId(newResumeId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setAnalysis(null);
    setResumeId(null);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>AI Resume Optimization Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Resume Analyzer & ATS Diagnostic
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload your resume to receive actionable section rewrites and 8-dimensional scoring.
          </p>
        </div>

        {analysis && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Analyze Another</span>
            </button>

            <Link
              href="/job-match"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white transition-colors shadow-xs shadow-indigo-200"
            >
              <span>Match With Job</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {!analysis ? (
        <ResumeUploadZone onAnalysisComplete={handleAnalysisComplete} />
      ) : (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top Score Overview */}
          <ResumeScoreOverview analysis={analysis} />

          {/* Section-by-Section Diagnostic Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Section Diagnostics & Actionable Replacements</span>
              </div>
              <span className="text-xs text-slate-500">
                {analysis.sections.length} sections analyzed
              </span>
            </div>

            <div className="space-y-6">
              {analysis.sections.map((section, idx) => (
                <SectionAnalysisCard key={idx} section={section} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
