"use client";

import { useState } from "react";
import { CheckSquare, Square, ExternalLink, BookOpen, Target, Sparkles, Loader2, Video, PlayCircle } from "lucide-react";
import { RoadmapItemData } from "@/types";

interface RoadmapItemCardProps {
  item: RoadmapItemData;
  onToggleComplete: (itemId: string, currentStatus: boolean) => Promise<void>;
}

export function RoadmapItemCard({ item, onToggleComplete }: RoadmapItemCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(item.isCompleted || false);

  const handleToggle = async () => {
    if (!item.id || isUpdating) return;
    setIsUpdating(true);
    const nextStatus = !isCompleted;
    setIsCompleted(nextStatus);
    try {
      await onToggleComplete(item.id, nextStatus);
    } catch {
      setIsCompleted(!nextStatus); // revert on failure
    } finally {
      setIsUpdating(false);
    }
  };

  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    item.skill + " full course tutorial freecodecamp"
  )}`;

  return (
    <div
      className={`rounded-3xl border transition-all shadow-xs overflow-hidden ${
        isCompleted
          ? "border-emerald-200 dark:border-emerald-900 bg-emerald-50/20 dark:bg-emerald-950/20"
          : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center ${
              isCompleted
                ? "bg-emerald-600 text-white"
                : "bg-indigo-600 text-white shadow-xs shadow-indigo-200"
            }`}
          >
            W{item.weekNumber}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.skill}</h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  item.priority === "HIGH"
                    ? "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                    : item.priority === "MEDIUM"
                    ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                    : "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                }`}
              >
                {item.priority} Priority
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              <span>Current: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{item.currentLevel}</strong></span>
              <span>&rarr;</span>
              <span>Target: <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">{item.targetLevel}</strong></span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <a
            href={youtubeSearchUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 transition-all shadow-xs"
          >
            <PlayCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Watch on YouTube</span>
            <ExternalLink className="w-3 h-3 text-rose-500" />
          </a>

          {/* Completion Checkbox Button */}
          <button
            onClick={handleToggle}
            disabled={isUpdating}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors shadow-xs ${
              isCompleted
                ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
            ) : isCompleted ? (
              <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Square className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            )}
            <span>{isCompleted ? "Completed" : "Mark as Done"}</span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-5 text-xs">
        {/* Core Topics */}
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] block mb-2">
            Weekly Focus Topics
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {item.topics.map((top, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 shrink-0" />
                <span>{top}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Tasks */}
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] block mb-2">
            Hands-On Practice Tasks
          </span>
          <ul className="space-y-1.5">
            {item.practiceTasks.map((task, idx) => (
              <li key={idx} className="p-2.5 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 text-indigo-950 dark:text-indigo-200 font-medium flex items-start gap-2">
                <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Free Resources */}
        {item.resources && item.resources.length > 0 && (
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] block mb-2">
              Free Learning Resources & YouTube Courses
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {item.resources.map((res, idx) => {
                const isVideo = res.type === "Video" || res.title.toLowerCase().includes("youtube");
                const isCourse = res.type === "Course" || res.title.toLowerCase().includes("course");
                const isDoc = res.type === "Documentation" || res.title.toLowerCase().includes("doc");
                
                const targetUrl =
                  res.url && res.url !== "#"
                    ? res.url
                    : isVideo
                    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(res.title || item.skill + " full course")}`
                    : `https://www.google.com/search?q=${encodeURIComponent(res.title || item.skill + " tutorial")}`;

                return (
                  <a
                    key={idx}
                    href={targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-xs transition-all flex items-center justify-between gap-2 group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                        isVideo
                          ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                          : isCourse
                          ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          : isDoc
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          : "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                      }`}>
                        {isVideo ? "🔴 YouTube" : isCourse ? "📘 Free Course" : isDoc ? "📄 Docs" : "💻 Practice"}
                      </span>
                      <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {res.title}
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
