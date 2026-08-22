"use client";

import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Award, FileText } from "lucide-react";
import { SkillRadarData } from "@/types";

interface CompetencyRadarChartProps {
  data: SkillRadarData[];
}

const BAR_COLORS = ["#4f46e5", "#6366f1", "#818cf8", "#10b981", "#059669", "#f59e0b"];

export function CompetencyRadarChart({ data }: CompetencyRadarChartProps) {
  const hasActiveScores = data && data.some((d) => d.level > 0);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between min-h-[360px] transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xs">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Competency Breakdown</h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">6-dimensional skills evaluation</span>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Target: 80%+</span>
      </div>

      {hasActiveScores ? (
        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="skill"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={90}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  borderRadius: "12px",
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  color: "#f8fafc",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
                formatter={(val: unknown) => [`${val}/100`, "Proficiency Level"]}
              />
              <Bar dataKey="level" radius={[0, 6, 6, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-60 w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 shadow-2xs">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">No Evaluation Radar Yet</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mt-1 mb-4">
            Upload your resume or practice a live interview round to map your 6-dimensional technical readiness.
          </p>
          <Link
            href="/resume-analyzer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Upload Resume Now</span>
          </Link>
        </div>
      )}

      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 text-center">
        Identifies specific focus areas for your upcoming interview rounds.
      </p>
    </div>
  );
}
