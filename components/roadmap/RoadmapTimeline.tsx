"use client";

import { useState } from "react";
import { Compass, Sparkles, RefreshCw, CheckCircle } from "lucide-react";
import { LearningRoadmapData } from "@/types";
import { RoadmapItemCard } from "./RoadmapItemCard";

interface RoadmapTimelineProps {
  initialRoadmap: LearningRoadmapData;
}

export function RoadmapTimeline({ initialRoadmap }: RoadmapTimelineProps) {
  const [roadmap, setRoadmap] = useState<LearningRoadmapData>(initialRoadmap);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole: roadmap.targetRole }),
      });
      const data = await res.json();
      if (data.roadmap) {
        setRoadmap(data.roadmap);
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
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-2xs">
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

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Curriculum Modules ({roadmap.totalWeeks} Weeks)</span>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ${isGenerating ? "animate-spin" : ""}`} />
          <span>{isGenerating ? "Synthesizing..." : "Regenerate Plan"}</span>
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
