"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Compass, Sparkles, Loader2, FileText, Target, Video, ArrowRight, RefreshCw, Zap } from "lucide-react";
import { RoadmapTimeline } from "@/components/roadmap/RoadmapTimeline";
import { LearningRoadmapData } from "@/types";

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<LearningRoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetRole, setTargetRole] = useState("Full-Stack Software Engineer");
  const [jobDescriptionText, setJobDescriptionText] = useState("");

  useEffect(() => {
    async function loadRoadmap() {
      try {
        const res = await fetch("/api/roadmap");
        if (res.ok) {
          const data = await res.json();
          setRoadmap(data.roadmap || null);
          if (data.roadmap?.targetRole) {
            setTargetRole(data.roadmap.targetRole);
          }
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
        body: JSON.stringify({
          targetRole,
          jobDescriptionText: jobDescriptionText.trim() || undefined,
        }),
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
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Checking candidate diagnostic milestones...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Curated Learning Pathway</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Personalized Learning Roadmap
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Targeted weekly skill milestones synthesized from your resume diagnostic, job description gap analysis, and mock interview performance with free YouTube & course links.
        </p>
      </div>

      {roadmap ? (
        <RoadmapTimeline
          initialRoadmap={roadmap}
          onRoadmapUpdated={(updated) => setRoadmap(updated)}
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 md:p-12 text-center max-w-3xl mx-auto shadow-xs space-y-6 transition-colors">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xs">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              No Learning Roadmap Generated Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your personalized roadmap is synthesized dynamically by <strong>Groq AI</strong> from your verified diagnostics:
              resume ATS gaps, target job requirements, and mock interview weak areas.
            </p>
          </div>

          {/* Quick Config Form */}
          <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-left space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-white block mb-1">
                  Target Role:
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Full-Stack Software Engineer">Full-Stack Software Engineer</option>
                  <option value="Frontend Developer (React/TypeScript)">Frontend Developer (React/TypeScript)</option>
                  <option value="Backend Developer (Node.js/SQL)">Backend Developer (Node.js/SQL)</option>
                  <option value="Python / Data Engineer">Python / Data Engineer</option>
                  <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-white block mb-1">
                  Target Job Description (Optional):
                </label>
                <textarea
                  value={jobDescriptionText}
                  onChange={(e) => setJobDescriptionText(e.target.value)}
                  placeholder="Paste JD requirements to calculate exact missing skills..."
                  rows={2}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-2">
            <Link
              href="/resume-analyzer"
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-slate-850 hover:bg-indigo-50/40 dark:hover:bg-slate-800 transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-400">Step 1</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Upload Resume
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Extracts your real skills and discovers ATS keyword gaps.
                </p>
              </div>
            </Link>

            <Link
              href="/job-match"
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-slate-850 hover:bg-indigo-50/40 dark:hover:bg-slate-800 transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Target className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-400">Step 2</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Match Job Posting
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Identifies missing technical requirements for your target role.
                </p>
              </div>
            </Link>

            <Link
              href="/mock-interview"
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-slate-850 hover:bg-indigo-50/40 dark:hover:bg-slate-800 transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Video className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-400">Step 3</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Mock Interview
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Evaluates spoken communication, live coding, and behavioral responses.
                </p>
              </div>
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleGenerateNow}
              disabled={isGenerating}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-xs font-bold text-white transition-all shadow-md shadow-indigo-500/25 active:scale-95"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Custom Plan with Groq AI...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
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
