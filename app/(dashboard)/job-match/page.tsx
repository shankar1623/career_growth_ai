"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Target,
  Sparkles,
  Loader2,
  ArrowRight,
  Building2,
  FileText,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Layers,
  BarChart3,
} from "lucide-react";
import { JobMatchOverview } from "@/components/jobs/JobMatchOverview";
import { MissingSkillsCard } from "@/components/jobs/MissingSkillsCard";
import { CompanyIntelCard } from "@/components/jobs/CompanyIntelCard";
import { JobMatchAnalysis } from "@/types";

interface SavedResume {
  id: string;
  title: string;
  fileName: string;
  overallScore: number;
  atsScore: number;
}

export default function JobMatchPage() {
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);

  const [jobTitle, setJobTitle] = useState("Full-Stack Software Engineer");
  const [companyName, setCompanyName] = useState("Stripe");
  const [jdText, setJdText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<JobMatchAnalysis | null>(null);

  // Fetch user's saved resumes
  useEffect(() => {
    async function loadResumes() {
      try {
        const res = await fetch("/api/resume/list");
        const data = await res.json();
        if (data.resumes && data.resumes.length > 0) {
          setResumes(data.resumes);
          setSelectedResumeId(data.resumes[0].id);
        }
      } catch (err) {
        console.warn("Could not fetch resumes:", err);
      } finally {
        setIsLoadingResumes(false);
      }
    }
    loadResumes();
  }, []);

  const handleLoadSampleJD = () => {
    setJobTitle("Full-Stack Software Engineer");
    setCompanyName("Stripe");
    setError(null);
    setJdText(`Role: Full-Stack Software Engineer
Company: Stripe
Location: San Francisco, CA / Remote

About The Role:
We are looking for a Software Engineer to help build our next-generation payment infrastructure. You will work across our React/Next.js frontend and Node.js/PostgreSQL microservices backend.

Requirements & Core Qualifications:
• 1+ years of experience building modern web applications with React, TypeScript, and Node.js.
• Strong foundation in PostgreSQL, database indexing, and RESTful API architecture.
• Experience with cloud deployments (AWS or GCP), Docker containerization, and automated CI/CD pipelines.
• Familiarity with Microservices, caching with Redis, and writing clean unit tests in Jest.
• Passion for clean code, system performance, and Agile team collaboration.`);
  };

  const handleRunMatch = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: selectedResumeId || undefined,
          jobTitle,
          companyName,
          jdText,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data?.error || "Could not complete match analysis. Please provide more details from the job description.");
        setIsLoading(false);
        return;
      }

      setAnalysis(data.analysis);
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred while analyzing the job posting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedResume = resumes.find((r) => r.id === selectedResumeId);

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Job Description Matching & Skill Gap Analysis
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare your active resume against target job postings to reveal qualification fit, missing keywords, and role expectations.
          </p>
        </div>

        {analysis && (
          <Link
            href="/mock-interview"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-bold text-white transition-all shadow-md shadow-indigo-500/25"
          >
            <span>Practice Live Mock Interview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Dual Column Setup: Resume on Left, Job Description on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Candidate Resume */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 flex flex-col justify-between space-y-4 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>1. Select Candidate Resume</span>
              </h3>
              <Link
                href="/resume-analyzer"
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload New</span>
              </Link>
            </div>

            {isLoadingResumes ? (
              <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600 dark:text-indigo-400" />
                <span>Loading your saved resumes...</span>
              </div>
            ) : resumes.length > 0 ? (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Choose Active Resume</label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title || r.fileName} (Score: {r.overallScore}/100)
                    </option>
                  ))}
                </select>

                {selectedResume && (
                  <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {selectedResume.title || selectedResume.fileName}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Active
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center pt-1">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Overall Score</span>
                        <strong className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                          {selectedResume.overallScore}/100
                        </strong>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">ATS Score</span>
                        <strong className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                          {selectedResume.atsScore}%
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                <p className="font-semibold">No resume uploaded yet.</p>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  Upload your resume first to cross-reference skills and keywords with job descriptions.
                </p>
                <Link
                  href="/resume-analyzer"
                  className="inline-flex items-center gap-1 font-bold underline text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 pt-1"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Resume Now</span>
                </Link>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-950 dark:text-indigo-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-indigo-900 dark:text-indigo-300">
              <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Cross-Referencing Engine</span>
            </div>
            <p className="text-[11px] text-indigo-900/80 dark:text-indigo-300/80 leading-relaxed">
              Analyzes your verified technical background against role requirements to detect missing skills and ATS keywords.
            </p>
          </div>
        </div>

        {/* Right Column: Target Job Description Input */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>2. Target Job Details & Description</span>
            </h3>
            <button
              type="button"
              onClick={handleLoadSampleJD}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Load Sample Stripe JD</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Target Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Frontend Developer, Full-Stack Engineer"
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Stripe, Airbnb, Google"
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Full Job Description</label>
            <textarea
              value={jdText}
              onChange={(e) => {
                setJdText(e.target.value);
                setError(null);
              }}
              placeholder="Paste the requirements, responsibilities, and qualifications from the job posting (or click 'Load Sample Stripe JD' above)..."
              rows={8}
              className="w-full text-xs rounded-2xl border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed font-mono"
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={handleLoadSampleJD}
                className="font-bold underline text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 shrink-0"
              >
                Fill Sample JD
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleLoadSampleJD}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Need a test template? <span className="text-indigo-600 dark:text-indigo-400 font-semibold underline">Load sample Stripe JD</span>
            </button>

            <button
              onClick={handleRunMatch}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-bold text-white disabled:opacity-50 transition-all shadow-md shadow-indigo-500/25"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Cross-Referencing Gaps & Analytics...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4" />
                  <span>Run Match Analytics</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Match Analytics & Gap Results */}
      {analysis && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <JobMatchOverview analysis={analysis} />
          <MissingSkillsCard
            strongMatches={analysis.strongMatches}
            missingSkills={analysis.missingSkills}
            missingKeywords={analysis.missingKeywords}
          />
          <CompanyIntelCard defaultCompanyName={companyName} />
        </div>
      )}
    </div>
  );
}
