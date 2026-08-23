"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  History as HistoryIcon,
  FileText,
  Target,
  Video,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Building2,
  TrendingUp,
  Award,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type HistoryTab = "resume" | "job-match" | "interview";

interface ResumeHistoryItem {
  id: string;
  title: string;
  fileName: string | null;
  overallScore: number;
  atsScore: number;
  contentScore: number;
  impactScore: number;
  skillsScore: number;
  experienceScore: number;
  projectsScore: number;
  createdAt: string;
  sections?: { sectionName: string; score: number }[];
}

interface JobMatchHistoryItem {
  id: string;
  jobTitle: string;
  companyName: string;
  resumeTitle: string;
  overallMatch: number;
  skillsMatch: number;
  experienceMatch: number;
  strongMatches: string[];
  missingSkills: string[];
  createdAt: string;
}

interface InterviewHistoryItem {
  id: string;
  title: string;
  targetRole: string;
  overallScore: number;
  createdAt: string;
  rounds: {
    roundNumber: number;
    title: string;
    score: number;
    roundType: string;
  }[];
}

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<HistoryTab>("resume");
  const [isLoading, setIsLoading] = useState(true);
  const [resumes, setResumes] = useState<ResumeHistoryItem[]>([]);
  const [jobMatches, setJobMatches] = useState<JobMatchHistoryItem[]>([]);
  const [interviews, setInterviews] = useState<InterviewHistoryItem[]>([]);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("/api/history");
        const data = await res.json();
        if (data.success) {
          setResumes(data.resumes || []);
          setJobMatches(data.jobMatches || []);
          setInterviews(data.interviews || []);
        }
      } catch (err) {
        console.warn("Failed to load history:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHistory();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 pb-12 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
            <HistoryIcon className="w-3.5 h-3.5" />
            <span>Activity Archive & Past Reports</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            History & Past Assessments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review your past resume analytics, job description matches, and mock interview performance records.
          </p>
        </div>
      </div>

      {/* 3 Interactive Tab Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 p-1.5 rounded-2xl bg-stone-100 dark:bg-slate-900/90 border border-stone-200 dark:border-slate-800 shadow-inner max-w-2xl">
        {/* Button 1: Resume Analytics */}
        <button
          type="button"
          onClick={() => setActiveTab("resume")}
          className={cn(
            "flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all",
            activeTab === "resume"
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 font-black scale-[1.02]"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
          )}
        >
          <FileText className="w-4 h-4" />
          <span>Resume Analytics</span>
          <span className={cn(
            "text-[10px] font-black px-2 py-0.5 rounded-full ml-1",
            activeTab === "resume"
              ? "bg-white/20 text-white"
              : "bg-stone-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          )}>
            {resumes.length}
          </span>
        </button>

        {/* Button 2: Resume + JD Match */}
        <button
          type="button"
          onClick={() => setActiveTab("job-match")}
          className={cn(
            "flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all",
            activeTab === "job-match"
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 font-black scale-[1.02]"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
          )}
        >
          <Target className="w-4 h-4" />
          <span>Resume + JD</span>
          <span className={cn(
            "text-[10px] font-black px-2 py-0.5 rounded-full ml-1",
            activeTab === "job-match"
              ? "bg-white/20 text-white"
              : "bg-stone-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          )}>
            {jobMatches.length}
          </span>
        </button>

        {/* Button 3: Mock Interview */}
        <button
          type="button"
          onClick={() => setActiveTab("interview")}
          className={cn(
            "flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all",
            activeTab === "interview"
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 font-black scale-[1.02]"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
          )}
        >
          <Video className="w-4 h-4" />
          <span>Mock Interview</span>
          <span className={cn(
            "text-[10px] font-black px-2 py-0.5 rounded-full ml-1",
            activeTab === "interview"
              ? "bg-white/20 text-white"
              : "bg-stone-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          )}>
            {interviews.length}
          </span>
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Loading your history records...</span>
        </div>
      )}

      {/* Tab 1: Resume Analytics History */}
      {!isLoading && activeTab === "resume" && (
        <div className="space-y-4">
          {resumes.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#0b0f19] rounded-3xl border border-stone-200 dark:border-slate-800 p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No Resumes Analyzed Yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Upload your resume to get instant ATS scoring, bullet-point improvements, and detailed section analytics.
              </p>
              <Link
                href="/resume-analyzer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/25"
              >
                <span>Upload &amp; Analyze Resume</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="bg-white dark:bg-[#0f172a] rounded-3xl border border-stone-200 dark:border-slate-800 p-5 sm:p-6 shadow-xl hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                            {resume.title || resume.fileName || "Resume Analysis"}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(resume.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Overall Score Badge */}
                      <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-black text-xs shrink-0">
                        {resume.overallScore}/100 Overall
                      </div>
                    </div>

                    {/* Breakdown Scores */}
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 text-center">
                        <span className="text-[10px] font-bold text-slate-400 block">ATS Score</span>
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{resume.atsScore}/100</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 text-center">
                        <span className="text-[10px] font-bold text-slate-400 block">Content</span>
                        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{resume.contentScore}/100</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 text-center">
                        <span className="text-[10px] font-bold text-slate-400 block">Skills</span>
                        <span className="text-xs font-black text-amber-600 dark:text-amber-400">{resume.skillsScore}/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Link */}
                  <Link
                    href={`/resume-analyzer?id=${resume.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-between group"
                  >
                    <span>View Detailed Analysis &amp; Bullet Fixes</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Resume + JD Match History */}
      {!isLoading && activeTab === "job-match" && (
        <div className="space-y-4">
          {jobMatches.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#0b0f19] rounded-3xl border border-stone-200 dark:border-slate-800 p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No Job Matches Analyzed Yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Compare your resume against any Job Description to uncover missing keywords, skill gaps, and ATS match ratings.
              </p>
              <Link
                href="/job-match"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/25"
              >
                <span>Run Resume + JD Match</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-white dark:bg-[#0f172a] rounded-3xl border border-stone-200 dark:border-slate-800 p-5 sm:p-6 shadow-xl hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                            {match.jobTitle}
                          </h4>
                          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                            {match.companyName}
                          </span>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(match.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Overall Match Badge */}
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-black text-xs shrink-0">
                        {match.overallMatch}% Match
                      </div>
                    </div>

                    {/* Matched & Missing Skills Badges */}
                    <div className="space-y-2 pt-2">
                      {match.strongMatches.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block mb-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Matched Skills ({match.strongMatches.length})
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {match.strongMatches.map((s, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-semibold"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {match.missingSkills.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block mb-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Missing Keyword Gaps
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {match.missingSkills.map((s, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-semibold"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Link */}
                  <Link
                    href="/job-match"
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-between group"
                  >
                    <span>View Full Match Breakdown</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Mock Interview History */}
      {!isLoading && activeTab === "interview" && (
        <div className="space-y-4">
          {interviews.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#0b0f19] rounded-3xl border border-stone-200 dark:border-slate-800 p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <Video className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No Mock Interviews Completed Yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Practice 5 technical rounds with live speech evaluations, filler word detection, and model answers.
              </p>
              <Link
                href="/mock-interview"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/25"
              >
                <span>Start AI Mock Interview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interviews.map((iv) => {
                const isGood = iv.overallScore >= 50;
                return (
                  <div
                    key={iv.id}
                    className="bg-white dark:bg-[#0f172a] rounded-3xl border border-stone-200 dark:border-slate-800 p-5 sm:p-6 shadow-xl hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-3">
                      {/* Header info */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                            <Video className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                              {iv.targetRole || iv.title}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(iv.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Overall Score Badge */}
                        <div className={cn(
                          "px-3 py-1.5 rounded-xl font-black text-xs shrink-0",
                          isGood
                            ? "bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                            : "bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-700 text-rose-700 dark:text-rose-300"
                        )}>
                          Score: {iv.overallScore}/100
                        </div>
                      </div>

                      {/* 5-Round Score progression pills */}
                      <div className="pt-2">
                        <span className="text-[10px] font-bold text-slate-400 block mb-1.5">
                          Round-by-Round Breakdown:
                        </span>
                        <div className="grid grid-cols-5 gap-1.5">
                          {iv.rounds.map((r) => {
                            const rGood = r.score >= 50;
                            return (
                              <div
                                key={r.roundNumber}
                                className={cn(
                                  "p-2 rounded-xl text-center border text-[10px] font-bold",
                                  rGood
                                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                                    : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300"
                                )}
                              >
                                <span className="block text-[9px] text-slate-400">R{r.roundNumber}</span>
                                <span>{r.score}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Action Link */}
                    <Link
                      href={`/interview/${iv.id}/results`}
                      className="w-full py-2.5 px-4 rounded-xl bg-stone-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-between group"
                    >
                      <span>Review Full Interview Feedback</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
