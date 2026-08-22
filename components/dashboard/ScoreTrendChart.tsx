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
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[360px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Interview Score Progression</h3>
            <span className="text-[11px] text-slate-500">Historical performance trajectory</span>
          </div>
        </div>

        {hasScores && data.length > 1 && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {data[data.length - 1].score >= data[0].score ? "+" : ""}
            {data[data.length - 1].score - data[0].score} pts
          </span>
        )}
      </div>

      {hasScores ? (
        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
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
                  backgroundColor: "#ffffff",
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
                formatter={(val: unknown) => [`${val}/100`, "Overall Score"]}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 5, fill: "#4f46e5", strokeWidth: 2, stroke: "#ffffff" }}
                activeDot={{ r: 7, fill: "#4f46e5" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-60 w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <Video className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-800">No Interview Sessions Yet</h4>
          <p className="text-[11px] text-slate-500 max-w-xs mt-1 mb-4">
            Practice your first 5-round video mock interview to start tracking your performance growth over time.
          </p>
          <Link
            href="/mock-interview"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start First Mock Session</span>
          </Link>
        </div>
      )}

      <p className="text-[11px] text-slate-400 mt-2 text-center">
        Consistent mock interview practice increases offer rates by 3.4x.
      </p>
    </div>
  );
}
