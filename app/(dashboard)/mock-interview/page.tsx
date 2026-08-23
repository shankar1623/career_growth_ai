"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Video,
  Bot,
  Camera,
  ArrowRight,
  Loader2,
  FileText,
  UploadCloud,
  Briefcase,
  Target,
  AlertCircle,
} from "lucide-react";

interface SavedResume {
  id: string;
  title: string;
  fileName: string;
  overallScore: number;
}

const PRESET_ROLES = [
  "Full-Stack Software Engineer",
  "Frontend Developer (React/TypeScript)",
  "Backend Developer (Node.js/SQL)",
  "Python / Data Engineer",
  "DevOps & Cloud Engineer",
  "AI / Machine Learning Engineer",
  "Mobile App Developer (React Native / iOS / Android)",
  "Cybersecurity Engineer",
];

export default function MockInterviewSetupPage() {
  const router = useRouter();
  const [role, setRole] = useState("Full-Stack Software Engineer");
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState("");
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Entry / Mid Level (1-3 years)");
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleStartInterview = async () => {
    setErrorMessage(null);

    // Validate resume presence (Strictly Mandatory)
    if (resumes.length === 0 || !selectedResumeId) {
      setErrorMessage("Resume upload is mandatory. Please upload your resume in Resume Analyzer first to start your 5-round mock interview.");
      return;
    }

    setIsCreating(true);
    const finalRole = isCustomRole ? (customRoleInput.trim() || "Software Engineer") : role;

    try {
      const res = await fetch("/api/interview/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: finalRole,
          experienceLevel,
          resumeId: selectedResumeId,
          jobDescriptionText: jobDescriptionText.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.interviewId) {
        throw new Error(data.error || "Failed to initialize interview session");
      }

      router.push(`/interview/${data.interviewId}`);
    } catch (err: unknown) {
      console.error("Start interview error:", err);
      const msg = err instanceof Error ? err.message : "Failed to start interview.";
      setErrorMessage(msg);
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
          <Video className="w-3.5 h-3.5" />
          <span>Live AI Video Studio</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Configure Your Mock Interview
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Type any custom role or paste a Job Description. AI will generate 5 customized interview rounds tailored specifically to your resume and requirements.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl flex items-center gap-3 text-xs text-rose-800 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Setup Form Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 sm:p-8 space-y-6 transition-colors">
        {/* Role Selection & Custom Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Target Engineering Role</span>
            </label>
            <button
              type="button"
              onClick={() => setIsCustomRole(!isCustomRole)}
              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {isCustomRole ? "← Select from Presets" : "+ Type Custom Role"}
            </button>
          </div>

          {isCustomRole ? (
            <div>
              <input
                type="text"
                value={customRoleInput}
                onChange={(e) => setCustomRoleInput(e.target.value)}
                placeholder="e.g. Golang Backend Developer, AI Engineer, iOS Engineer, Data Analyst..."
                className="w-full text-xs font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 p-3.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Type any specific engineering title. AI will synthesize interview questions matching this exact domain.
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-xs font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 p-3.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {PRESET_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full text-xs font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Fresher / Intern (0-1 years)">Fresher / Intern (0-1 years)</option>
              <option value="Entry / Mid Level (1-3 years)">Entry / Mid Level (1-3 years)</option>
              <option value="Mid / Senior Level (3+ years)">Mid / Senior Level (3+ years)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">Interview Format</label>
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Full 5-Round Simulation</span>
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md font-bold">
                2 Min / Q
              </span>
            </div>
          </div>
        </div>

        {/* Optional Target Job Description Textarea */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Target Job Description (Optional)</span>
            </label>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
              Generates JD-Specific Questions
            </span>
          </div>
          <textarea
            value={jobDescriptionText}
            onChange={(e) => setJobDescriptionText(e.target.value)}
            placeholder="Paste target job description, tech stack requirements, or company qualifications to generate questions aligned with this specific job..."
            rows={3}
            className="w-full text-xs font-normal rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
          />
        </div>

        {/* Selected Resume for Round 2 Deep-Dive */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Resume for Project Deep-Dive (Round 2)</span>
            </label>
            <Link
              href="/resume-analyzer"
              className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload New Resume</span>
            </Link>
          </div>

          {isLoadingResumes ? (
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Loading your resumes...</span>
            </div>
          ) : resumes.length > 0 ? (
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
          ) : (
            <div className="p-4 bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-2xl space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <strong className="text-rose-900 dark:text-rose-200 font-bold block">
                    Resume Upload Required to Start Interview
                  </strong>
                  <p className="text-rose-800/90 dark:text-rose-300/90 leading-relaxed">
                    To deliver an authentic 5-round simulation tailored to your real projects, architecture decisions, and tech stack in Round 2, uploading your resume is mandatory.
                  </p>
                </div>
              </div>
              <div className="pt-1">
                <Link
                  href="/resume-analyzer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Resume in Resume Analyzer</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 5-Round Roadmap Summary */}
        <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Interview Curriculum: 5 Structured Rounds</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block">Round 1</span>
              <strong className="text-slate-900 dark:text-white block mt-0.5">Self Intro</strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Direct pitch</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block">Round 2</span>
              <strong className="text-slate-900 dark:text-white block mt-0.5">Resume Deep-Dive</strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Your real projects</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block">Round 3</span>
              <strong className="text-slate-900 dark:text-white block mt-0.5">Technical Qs</strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Tailored to Role & JD</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block">Round 4</span>
              <strong className="text-slate-900 dark:text-white block mt-0.5">Coding Round</strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Monaco editor</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block">Round 5</span>
              <strong className="text-slate-900 dark:text-white block mt-0.5">Behavioral HR</strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Randomized STAR</span>
            </div>
          </div>
        </div>

        {/* Camera & Mic Permission Notice */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
            <Camera className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-indigo-950 dark:text-indigo-200">Camera & Microphone Access</h4>
            <p className="text-indigo-900/80 dark:text-indigo-300/80 leading-relaxed">
              Your camera and microphone will be requested when you enter the studio. Each question has a 2-minute live response timer.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Estimated duration: ~10-15 minutes
          </span>

          {resumes.length > 0 ? (
            <button
              onClick={handleStartInterview}
              disabled={isCreating}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-bold text-white disabled:opacity-50 transition-all shadow-md shadow-indigo-500/25 active:scale-95"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Interview Questions...</span>
                </>
              ) : (
                <>
                  <Video className="w-4 h-4" />
                  <span>Start Mock Interview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          ) : (
            <Link
              href="/resume-analyzer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-md shadow-indigo-500/25 active:scale-95"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Resume First to Start</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

