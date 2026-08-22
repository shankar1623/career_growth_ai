"use client";

import Link from "next/link";
import { FileText, Target, Video, Compass, ArrowRight } from "lucide-react";
import { formatScore } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "RESUME" | "JOB_MATCH" | "INTERVIEW" | "ROADMAP";
  title: string;
  score?: number;
  date: string;
  link: string;
}

interface RecentActivityListProps {
  activities: ActivityItem[];
}

export function RecentActivityList({ activities }: RecentActivityListProps) {
  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "INTERVIEW":
        return <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case "JOB_MATCH":
        return <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "ROADMAP":
        return <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-slate-900 dark:text-white">Recent Career Milestones</h3>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Real-time Activity</span>
      </div>

      <div className="space-y-3">
        {activities.map((act) => (
          <Link
            key={act.id}
            href={act.link}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-2xs">
                {getIcon(act.type)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {act.title}
                </h4>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{act.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {act.score !== undefined && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {formatScore(act.score)}%
                </span>
              )}
              <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
