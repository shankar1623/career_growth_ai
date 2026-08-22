"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Compass, Sparkles, Loader2, FileText, Target, Video, ArrowRight, RefreshCw } from "lucide-react";
import { RoadmapTimeline } from "@/components/roadmap/RoadmapTimeline";
import { LearningRoadmapData } from "@/types";

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<LearningRoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function loadRoadmap() {
      try {
        const res = await fetch("/api/roadmap");
        if (res.ok) {
          const data = await res.json();
          setRoadmap(data.roadmap || null);
        }
      } catch (err) {
        console.error("Failed to load roadmap:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRoadmap();
  }, []);

  const handleGenerateNow = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole: "Full-Stack Software Engineer" }),
      });
      const data = await res.json();
      if (data.roadmap) {
        setRoadmap(data.roadmap);
      }
    } catch (err) {
      console.error("Generate roadmap error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="text-xs font-semibold text-slate-500">Checking candidate diagnostic milestones...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Curated Learning Pathway</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Personalized Learning Roadmap
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Targeted weekly skill milestones synthesized from your resume diagnostic, job description gap analysis, and mock interview performance.
        </p>
      </div>

      {roadmap ? (
        <RoadmapTimeline initialRoadmap={roadmap} />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 text-center max-w-3xl mx-auto shadow-xs space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-lg font-bold text-slate-900">
              No Learning Roadmap Generated Yet
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your personalized roadmap is synthesized dynamically by <strong>Groq AI</strong> from your verified diagnostics:
              resume ATS gaps, target job requirements, and mock interview weak areas.
            </p>
          </div>

          {/* Action Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-2">
            <Link
              href="/resume-analyzer"
              className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-400">Step 1</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Upload Resume
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Extracts your real skills and discovers ATS keyword gaps.
                </p>
              </div>
            </Link>

            <Link
              href="/job-match"
              className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Target className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-400">Step 2</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Match Job Posting
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Identifies missing technical requirements for your target role.
                </p>
              </div>
            </Link>

            <Link
              href="/mock-interview"
              className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Video className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-400">Step 3</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Mock Interview
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Evaluates spoken communication, live coding, and STAR behavior.
                </p>
              </div>
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleGenerateNow}
              disabled={isGenerating}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-xs font-bold text-white transition-colors shadow-xs shadow-indigo-200"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Custom Plan with Groq AI...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Synthesize My Roadmap from Diagnostics</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
