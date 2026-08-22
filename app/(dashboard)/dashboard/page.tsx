"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Target,
  Video,
  Compass,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  UploadCloud,
  TrendingUp,
  Cpu,
  Award,
} from "lucide-react";
import { ScoreTrendChart } from "@/components/dashboard/ScoreTrendChart";
import { CompetencyRadarChart } from "@/components/dashboard/CompetencyRadarChart";
import { RecentActivityList } from "@/components/dashboard/RecentActivityList";
import { DashboardAnalytics } from "@/types";
import { getScoreColor } from "@/lib/utils";

interface EnrichedDashboardAnalytics extends DashboardAnalytics {
  hasData?: boolean;
  targetRole?: string;
  interviewRoundsCompleted?: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<EnrichedDashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/analytics");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="text-xs font-bold text-slate-500">Loading your live performance metrics...</span>
      </div>
    );
  }

  const resumeColors = getScoreColor(data?.resumeScore || 0);
  const matchColors = getScoreColor(data?.latestMatchScore || 0);
  const interviewColors = getScoreColor(data?.latestInterviewScore || 0);

  return (
    <div className="space-y-8 pb-8">
      {/* Sleek Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-lg">
        {/* Ambient Glowing Orbs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5">
              <span>Career Growth Dashboard</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Your personalized AI command center to analyze resumes, identify technical skill gaps, rehearse webcam mock interviews, and master your career milestones.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <Link
              href="/resume-analyzer"
              className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
            >
              <UploadCloud className="w-4 h-4 text-indigo-600" />
              <span>Upload Resume</span>
            </Link>
            <Link
              href="/mock-interview"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-900/40 flex items-center gap-1.5 active:scale-95"
            >
              <Video className="w-4 h-4" />
              <span>Start Mock Interview</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Top 4 Performance Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Resume Overall Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              Resume ATS Score
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black ${data?.resumeScore ? resumeColors.text : "text-slate-400"}`}>
                {data?.resumeScore || 0}
              </span>
              <span className="text-xs font-semibold text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full transition-all duration-500"
                style={{ width: `${data?.resumeScore || 0}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px]">
              {data?.resumeScore ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ATS Verified
                </span>
              ) : (
                <Link href="/resume-analyzer" className="text-indigo-600 font-bold hover:underline">
                  Upload resume to score &rarr;
                </Link>
              )}
              <span className="text-slate-400 font-medium">ATS Target: 80+</span>
            </div>
          </div>
        </div>

        {/* 2. Target Job Match */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              Job Match Fit
            </span>
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black ${data?.latestMatchScore ? matchColors.text : "text-slate-400"}`}>
                {data?.latestMatchScore || 0}
              </span>
              <span className="text-xs font-semibold text-slate-400">%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${data?.latestMatchScore || 0}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px]">
              {data?.latestMatchScore ? (
                <span className="text-slate-700 font-bold truncate max-w-[140px]">
                  {data.targetRole || "Software Engineer"}
                </span>
              ) : (
                <Link href="/job-match" className="text-indigo-600 font-bold hover:underline">
                  Compare with JD &rarr;
                </Link>
              )}
              <span className="text-slate-400 font-medium">Target: 85%+</span>
            </div>
          </div>
        </div>

        {/* 3. Mock Interview Performance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              Interview Score
            </span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black ${data?.latestInterviewScore ? interviewColors.text : "text-slate-400"}`}>
                {data?.latestInterviewScore || 0}
              </span>
              <span className="text-xs font-semibold text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${data?.latestInterviewScore || 0}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px]">
              {data?.latestInterviewScore ? (
                <span className="text-emerald-700 font-bold">
                  {data.interviewRoundsCompleted || 5} Rounds Evaluated
                </span>
              ) : (
                <Link href="/mock-interview" className="text-indigo-600 font-bold hover:underline">
                  Start 5-round studio &rarr;
                </Link>
              )}
              <span className="text-slate-400 font-medium">Pass: 75+</span>
            </div>
          </div>
        </div>

        {/* 4. Learning Roadmap Progress */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              Roadmap Progress
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">
                {data?.roadmapCompletionPct || 0}
              </span>
              <span className="text-xs font-semibold text-slate-400">% completed</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${data?.roadmapCompletionPct || 0}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px]">
              <Link href="/roadmap" className="text-indigo-600 font-bold hover:underline">
                View 4-week milestones &rarr;
              </Link>
              <span className="text-slate-400 font-medium">4 Weeks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Visualization Grid: Radar & Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ScoreTrendChart data={data?.scoreTrends || []} />
        </div>
        <div className="lg:col-span-5">
          <CompetencyRadarChart data={data?.skillRadar || []} />
        </div>
      </div>

      {/* Verified Skills & Identified Improvement Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Verified Skills */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Verified Candidate Skills
              </h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              {data?.strongSkills?.length || 0} Detected
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {data?.strongSkills && data.strongSkills.length > 0 ? (
              data.strongSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4">
                Upload your resume to extract and verify your technical skills.
              </p>
            )}
          </div>
        </div>

        {/* Priority Focus Areas */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Priority Growth Areas
              </h3>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
              To Master
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {data?.needsImprovement && data.needsImprovement.length > 0 ? (
              data.needsImprovement.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-amber-50/50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-1.5"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>{skill}</span>
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4">
                Compare with a job posting or complete an interview to discover targeted areas to strengthen.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <RecentActivityList activities={data?.recentActivities || []} />
    </div>
  );
}
