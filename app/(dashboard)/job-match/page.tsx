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
    } catch (err: unknown) {
      console.error(err);
      setError("An unexpected network error occurred while running the match analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedResume = resumes.find((r) => r.id === selectedResumeId) || resumes[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>Job Description Gap Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Resume & Job Description Matcher
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compare your resume with any job posting to uncover missing skills, ATS keywords, and company intelligence.
          </p>
        </div>

        {analysis && (
          <Link
            href="/mock-interview"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white transition-colors shadow-xs shadow-indigo-200"
          >
            <span>Practice Live Mock Interview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Dual Column Setup: Resume on Left, Job Description on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Candidate Resume */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>1. Select Candidate Resume</span>
              </h3>
              <Link
                href="/resume-analyzer"
                className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload New</span>
              </Link>
            </div>

            {isLoadingResumes ? (
              <div className="p-6 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                <span>Loading your saved resumes...</span>
              </div>
            ) : resumes.length > 0 ? (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 block">Choose Active Resume</label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full text-xs font-medium rounded-xl border border-slate-200 p-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title || r.fileName} (Score: {r.overallScore}/100)
                    </option>
                  ))}
                </select>

                {selectedResume && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {selectedResume.title || selectedResume.fileName}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center pt-1">
                      <div className="p-2 rounded-lg bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Overall Score</span>
                        <strong className="text-sm font-extrabold text-indigo-600">
                          {selectedResume.overallScore}/100
                        </strong>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">ATS Score</span>
                        <strong className="text-sm font-extrabold text-emerald-600">
                          {selectedResume.atsScore}%
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                <p className="font-semibold">No resume uploaded yet.</p>
                <p className="text-[11px] text-amber-800">
                  Upload your resume first to cross-reference skills and keywords with job descriptions.
                </p>
                <Link
                  href="/resume-analyzer"
                  className="inline-flex items-center gap-1 font-bold underline text-indigo-700 hover:text-indigo-900 pt-1"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Resume Now</span>
                </Link>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-indigo-900">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Cross-Referencing Engine</span>
            </div>
            <p className="text-[11px] text-indigo-900/80 leading-relaxed">
              Analyzes your verified technical background against role requirements to detect missing skills and ATS keywords.
            </p>
          </div>
        </div>

        {/* Right Column: Target Job Description Input */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>2. Target Job Details & Description</span>
            </h3>
            <button
              type="button"
              onClick={handleLoadSampleJD}
              className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Load Sample Stripe JD</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Target Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Frontend Developer, Full-Stack Engineer"
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Stripe, Airbnb, Google"
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Full Job Description</label>
            <textarea
              value={jdText}
              onChange={(e) => {
                setJdText(e.target.value);
                setError(null);
              }}
              placeholder="Paste the requirements, responsibilities, and qualifications from the job posting (or click 'Load Sample Stripe JD' above)..."
              rows={8}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed font-mono"
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={handleLoadSampleJD}
                className="font-bold underline text-indigo-700 hover:text-indigo-900 shrink-0"
              >
                Fill Sample JD
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleLoadSampleJD}
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              Need a test template? <span className="text-indigo-600 font-semibold underline">Load sample Stripe JD</span>
            </button>

            <button
              onClick={handleRunMatch}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xs shadow-indigo-200"
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
