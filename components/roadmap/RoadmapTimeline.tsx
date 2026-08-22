"use client";

import { useState } from "react";
import { Compass, Sparkles, RefreshCw, CheckCircle, ChevronDown, ChevronUp, FileText, Target, Zap } from "lucide-react";
import { LearningRoadmapData } from "@/types";
import { RoadmapItemCard } from "./RoadmapItemCard";

interface RoadmapTimelineProps {
  initialRoadmap: LearningRoadmapData;
  onRoadmapUpdated?: (newRoadmap: LearningRoadmapData) => void;
}

export function RoadmapTimeline({ initialRoadmap, onRoadmapUpdated }: RoadmapTimelineProps) {
  const [roadmap, setRoadmap] = useState<LearningRoadmapData>(initialRoadmap);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showJdCustomizer, setShowJdCustomizer] = useState(false);
  const [targetRole, setTargetRole] = useState(initialRoadmap.targetRole || "Full-Stack Software Engineer");
  const [customJdText, setCustomJdText] = useState("");

  const handleToggleComplete = async (itemId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/roadmap/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, isCompleted: currentStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setRoadmap((prev) => ({
          ...prev,
          overallProgress: data.overallProgress,
          items: prev.items.map((it) =>
            it.id === itemId ? { ...it, isCompleted: currentStatus } : it
          ),
        }));
      }
    } catch (err) {
      console.error("Failed to toggle item:", err);
      throw err;
    }
  };

  const handleRegenerate = async (overrideJd?: string, overrideRole?: string) => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: overrideRole || targetRole,
          jobDescriptionText: overrideJd !== undefined ? overrideJd : customJdText,
        }),
      });
      const data = await res.json();
      if (data.roadmap) {
        setRoadmap(data.roadmap);
        if (onRoadmapUpdated) onRoadmapUpdated(data.roadmap);
      }
    } catch (err) {
      console.error("Regenerate roadmap error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const completedCount = roadmap.items.filter((i) => i.isCompleted).length;

  return (
    <div className="space-y-6">
      {/* Header & Progress Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Career Trajectory Plan
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{roadmap.title}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
            A structured, week-by-week technical curriculum synthesized from your resume gaps, target JD requirements, and mock interview performance.
          </p>
        </div>

        {/* Progress Display */}
        <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 min-w-[180px] w-full md:w-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
              {roadmap.overallProgress}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">completed</span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full transition-all duration-500"
              style={{ width: `${roadmap.overallProgress}%` }}
            />
          </div>

          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {completedCount} of {roadmap.items.length} weekly milestones completed
          </span>
        </div>
      </div>

      {/* Target Role & JD Customizer Dropdown Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Target Role & Job Description Synthesis
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Pasting a new JD recalculates missing skills against your resume to produce a new 4-week roadmap.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowJdCustomizer(!showJdCustomizer)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
          >
            <span>{showJdCustomizer ? "Hide Customizer" : "Customize JD & Role"}</span>
            {showJdCustomizer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showJdCustomizer && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Select Target Role:
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
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Paste Target Job Description (Optional):
                </label>
                <textarea
                  value={customJdText}
                  onChange={(e) => setCustomJdText(e.target.value)}
                  placeholder="Paste requirements, required skills, and responsibilities..."
                  rows={3}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => handleRegenerate()}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/25 active:scale-95 disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isGenerating ? "Synthesizing New Roadmap..." : "Generate Roadmap from this JD + Resume"}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Curriculum Modules ({roadmap.totalWeeks} Weeks)</span>
        </div>

        <button
          onClick={() => handleRegenerate()}
          disabled={isGenerating}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ${isGenerating ? "animate-spin" : ""}`} />
          <span>{isGenerating ? "Synthesizing..." : "Refresh Roadmap"}</span>
        </button>
      </div>

      {/* Weekly Items List */}
      <div className="space-y-4">
        {roadmap.items.map((item) => (
          <RoadmapItemCard
            key={item.id || item.weekNumber}
            item={item}
            onToggleComplete={handleToggleComplete}
          />
        ))}
      </div>
    </div>
  );
}
