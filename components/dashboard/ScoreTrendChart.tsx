"use client";

import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Video, Sparkles } from "lucide-react";
import { ScoreTrendData } from "@/types";

interface ScoreTrendChartProps {
  data: ScoreTrendData[];
}

export function ScoreTrendChart({ data }: ScoreTrendChartProps) {
  const hasScores = data && data.length > 0;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between min-h-[360px] transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-2xs">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Interview Score Progression</h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Historical performance trajectory</span>
          </div>
        </div>

        {hasScores && data.length > 1 && (
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            {data[data.length - 1].score >= data[0].score ? "+" : ""}
            {data[data.length - 1].score - data[0].score} pts
          </span>
        )}
      </div>

      {hasScores ? (
        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  color: "#f8fafc",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#4f46e5" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="py-12 px-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1 max-w-sm">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">No mock interview trajectories recorded yet</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Practice your first 5-round video mock interview to start tracking your performance growth over time.
            </p>
          </div>
          <Link
            href="/mock-interview"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Start First Mock Session</span>
          </Link>
        </div>
      )}
    </div>
  );
}
