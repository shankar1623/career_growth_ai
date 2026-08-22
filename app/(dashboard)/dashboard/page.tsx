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
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="text-xs font-semibold text-slate-500">Loading your live career metrics...</span>
      </div>
    );
  }

  const resumeColors = getScoreColor(data?.resumeScore || 0);
  const matchColors = getScoreColor(data?.latestMatchScore || 0);
  const interviewColors = getScoreColor(data?.latestInterviewScore || 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>AI Career Intelligence Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back to CareerGrowth AI
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl leading-relaxed">
            Your end-to-end workspace to polish resumes, match job descriptions, rehearse webcam mock interviews, and follow step-by-step roadmaps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link
            href="/resume-analyzer"
            className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <UploadCloud className="w-3.5 h-3.5 text-slate-700" />
            <span>Upload Resume</span>
          </Link>
          <Link
            href="/mock-interview"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-xs shadow-indigo-900 flex items-center gap-1.5"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Mock Interview</span>
          </Link>
        </div>
      </div>

      {/* Top 4 Performance Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Resume Overall Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Resume Score
            </span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-extrabold ${data?.resumeScore ? resumeColors.text : "text-slate-400"}`}>
                {data?.resumeScore || 0}
              </span>
              <span className="text-xs font-medium text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${data?.resumeScore || 0}%` }}
              />
            </div>
          </div>
          <span className="text-[11px] text-slate-500 mt-2">
            {data?.resumeScore ? (
              <>ATS Scan: <strong className="text-slate-800 font-semibold">{data?.atsScore}%</strong></>
            ) : (
              <Link href="/resume-analyzer" className="text-indigo-600 hover:underline font-medium">Upload resume to score</Link>
            )}
          </span>
        </div>

        {/* 2. Job Match Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Latest Job Match
            </span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-extrabold ${data?.latestMatchScore ? matchColors.text : "text-slate-400"}`}>
                {data?.latestMatchScore || 0}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${data?.latestMatchScore || 0}%` }}
              />
            </div>
          </div>
          <span className="text-[11px] text-slate-500 mt-2">
            {data?.latestMatchScore ? (
              <>Target: <strong className="text-slate-800 font-semibold">{data?.targetRole || "Software Engineer"}</strong></>
            ) : (
              <Link href="/job-match" className="text-emerald-600 hover:underline font-medium">Compare with a Job Posting</Link>
            )}
          </span>
        </div>

        {/* 3. Interview Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Latest Interview
            </span>
            <Video className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-extrabold ${data?.latestInterviewScore ? interviewColors.text : "text-slate-400"}`}>
                {data?.latestInterviewScore || 0}
              </span>
              <span className="text-xs font-medium text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${data?.latestInterviewScore || 0}%` }}
              />
            </div>
          </div>
          <span className="text-[11px] text-slate-500 mt-2">
            {data?.latestInterviewScore ? (
              <>Status: <strong className="text-slate-800 font-semibold">Completed</strong></>
            ) : (
              <Link href="/mock-interview" className="text-indigo-600 hover:underline font-medium">Start First Session</Link>
            )}
          </span>
        </div>

        {/* 4. Roadmap Progress */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Roadmap Progress
            </span>
            <Compass className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-extrabold ${data?.roadmapCompletionPct ? "text-slate-900" : "text-slate-400"}`}>
                {data?.roadmapCompletionPct || 0}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${data?.roadmapCompletionPct || 0}%` }}
              />
            </div>
          </div>
          <span className="text-[11px] text-slate-500 mt-2">
            <Link href="/roadmap" className="text-amber-700 hover:underline font-medium">View 4-Week Mastery</Link>
          </span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScoreTrendChart data={data?.scoreTrends || []} />
        <CompetencyRadarChart data={data?.skillRadar || []} />
      </div>

      {/* Skills Matrix: Strong Skills vs Needs Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Skills */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Verified Strong Skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {data?.strongSkills && data.strongSkills.length > 0 ? (
              data.strongSkills.map((s, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{s}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">Upload your resume to extract strong skills.</span>
            )}
          </div>
        </div>

        {/* Needs Improvement */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Target Areas For Growth</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {data?.needsImprovement && data.needsImprovement.length > 0 ? (
              data.needsImprovement.map((s, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{s}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">Match against a job description to discover skill gaps.</span>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity List */}
      <RecentActivityList activities={data?.recentActivities || []} />
    </div>
  );
}
