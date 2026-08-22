"use client";

import { useState } from "react";
import { CheckSquare, Square, ExternalLink, BookOpen, Target, Sparkles, Loader2 } from "lucide-react";
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

  return (
    <div
      className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
        isCompleted ? "border-emerald-200 bg-emerald-50/10" : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
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
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">{item.skill}</h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  item.priority === "HIGH"
                    ? "bg-rose-100 text-rose-800 border border-rose-200"
                    : item.priority === "MEDIUM"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                }`}
              >
                {item.priority} Priority
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
              <span>Current: <strong className="text-slate-700 font-semibold">{item.currentLevel}</strong></span>
              <span>&rarr;</span>
              <span>Target: <strong className="text-indigo-600 font-semibold">{item.targetLevel}</strong></span>
            </div>
          </div>
        </div>

        {/* Completion Checkbox Button */}
        <button
          onClick={handleToggle}
          disabled={isUpdating}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors shadow-xs ${
            isCompleted
              ? "bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          {isUpdating ? (
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
          ) : isCompleted ? (
            <CheckSquare className="w-4 h-4 text-emerald-600" />
          ) : (
            <Square className="w-4 h-4 text-slate-400" />
          )}
          <span>{isCompleted ? "Completed" : "Mark as Done"}</span>
        </button>
      </div>

      <div className="p-6 space-y-5 text-xs">
        {/* Core Topics */}
        <div>
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-2">
            Weekly Focus Topics
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {item.topics.map((top, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 font-medium flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                <span>{top}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Tasks */}
        <div>
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-2">
            Hands-On Practice Tasks
          </span>
          <ul className="space-y-1.5">
            {item.practiceTasks.map((task, idx) => (
              <li key={idx} className="p-2.5 rounded-lg bg-indigo-50/40 border border-indigo-100 text-indigo-950 font-medium flex items-start gap-2">
                <Target className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Free Resources */}
        {item.resources && item.resources.length > 0 && (
          <div>
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-2">
              Recommended Free Learning Resources
            </span>
            <div className="flex flex-wrap gap-2">
              {item.resources.map((res, idx) => (
                <a
                  key={idx}
                  href={res.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">{res.title}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
