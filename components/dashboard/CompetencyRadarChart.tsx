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
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[360px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Competency Breakdown</h3>
            <span className="text-[11px] text-slate-500">6-dimensional skills evaluation</span>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-500">Target: 80%+</span>
      </div>

      {hasActiveScores ? (
        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
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
                  backgroundColor: "#ffffff",
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
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
        <div className="h-60 w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-800">No Evaluation Radar Yet</h4>
          <p className="text-[11px] text-slate-500 max-w-xs mt-1 mb-4">
            Upload your resume or practice a live interview round to map your 6-dimensional technical readiness.
          </p>
          <Link
            href="/resume-analyzer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Upload Resume Now</span>
          </Link>
        </div>
      )}

      <p className="text-[11px] text-slate-400 mt-2 text-center">
        Identifies specific focus areas for your upcoming interview rounds.
      </p>
    </div>
  );
}
