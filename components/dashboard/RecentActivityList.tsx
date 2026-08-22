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
        return <Video className="w-4 h-4 text-indigo-600" />;
      case "JOB_MATCH":
        return <Target className="w-4 h-4 text-emerald-600" />;
      case "ROADMAP":
        return <Compass className="w-4 h-4 text-amber-600" />;
      default:
        return <FileText className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900">Recent Career Milestones</h3>
        <span className="text-xs font-medium text-slate-500">Real-time Activity</span>
      </div>

      <div className="space-y-3">
        {activities.map((act) => (
          <Link
            key={act.id}
            href={act.link}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                {getIcon(act.type)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {act.title}
                </h4>
                <span className="text-[10px] text-slate-400 font-medium">{act.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {act.score !== undefined && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {formatScore(act.score)}%
                </span>
              )}
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
