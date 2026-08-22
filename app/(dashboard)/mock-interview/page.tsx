"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Video, Bot, Camera, ArrowRight, Loader2, FileText, UploadCloud, CheckCircle2 } from "lucide-react";

interface SavedResume {
  id: string;
  title: string;
  fileName: string;
  overallScore: number;
}

export default function MockInterviewSetupPage() {
  const router = useRouter();
  const [role, setRole] = useState("Full-Stack Software Engineer");
  const [experienceLevel, setExperienceLevel] = useState("Entry / Mid Level (0-3 years)");
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

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
    setIsCreating(true);
    try {
      const res = await fetch("/api/interview/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          experienceLevel,
          resumeId: selectedResumeId || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initialize interview");

      router.push(`/interview/${data.interviewId}`);
    } catch (err) {
      console.error(err);
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
          <Video className="w-3.5 h-3.5" />
          <span>Live AI Video Studio</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Start AI Video Mock Interview
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Practice interactive mock interview rounds with speech recognition, AI voice questions, and in-browser coding.
        </p>
      </div>

      {/* Setup Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">Target Engineering Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full text-xs font-semibold rounded-xl border border-slate-200 p-3 text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Full-Stack Software Engineer">Full-Stack Software Engineer</option>
              <option value="Frontend Developer (React/TypeScript)">Frontend Developer (React/TypeScript)</option>
              <option value="Backend Developer (Node.js/SQL)">Backend Developer (Node.js/SQL)</option>
              <option value="Python / Data Engineer">Python / Data Engineer</option>
              <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full text-xs font-semibold rounded-xl border border-slate-200 p-3 text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Fresher / Intern (0-1 years)">Fresher / Intern (0-1 years)</option>
              <option value="Entry / Mid Level (1-3 years)">Entry / Mid Level (1-3 years)</option>
              <option value="Mid / Senior Level (3+ years)">Mid / Senior Level (3+ years)</option>
            </select>
          </div>
        </div>

        {/* Selected Resume for Round 2 Deep-Dive */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Resume for Project Deep-Dive (Round 2)</span>
            </label>
            <Link
              href="/resume-analyzer"
              className="text-[11px] text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload New Resume</span>
            </Link>
          </div>

          {isLoadingResumes ? (
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Loading your resumes...</span>
            </div>
          ) : resumes.length > 0 ? (
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
          ) : (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center justify-between">
              <span>No resume uploaded yet. Default software engineering questions will be used.</span>
              <Link href="/resume-analyzer" className="font-bold underline text-indigo-700 ml-2">
                Upload Resume First
              </Link>
            </div>
          )}
        </div>

        {/* 5-Round Roadmap Summary */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Bot className="w-4 h-4 text-indigo-600" />
            <span>Interview Curriculum: 5 Structured Rounds</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs">
              <span className="text-[10px] font-bold text-indigo-600 block">Round 1</span>
              <strong className="text-slate-900 block mt-0.5">Self Intro</strong>
              <span className="text-[10px] text-slate-500">Elevator pitch</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs">
              <span className="text-[10px] font-bold text-indigo-600 block">Round 2</span>
              <strong className="text-slate-900 block mt-0.5">Resume Deep-Dive</strong>
              <span className="text-[10px] text-slate-500">Your real projects</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs">
              <span className="text-[10px] font-bold text-indigo-600 block">Round 3</span>
              <strong className="text-slate-900 block mt-0.5">Technical Qs</strong>
              <span className="text-[10px] text-slate-500">APIs & Concurrency</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs">
              <span className="text-[10px] font-bold text-indigo-600 block">Round 4</span>
              <strong className="text-slate-900 block mt-0.5">Coding Round</strong>
              <span className="text-[10px] text-slate-500">Monaco editor</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs">
              <span className="text-[10px] font-bold text-indigo-600 block">Round 5</span>
              <strong className="text-slate-900 block mt-0.5">Behavioral HR</strong>
              <span className="text-[10px] text-slate-500">STAR questions</span>
            </div>
          </div>
        </div>

        {/* Camera & Mic Permission Notice */}
        <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Camera className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-indigo-950">Camera & Microphone Access</h4>
            <p className="text-indigo-900/80 leading-relaxed">
              Your camera and microphone will be requested when you enter the room. Uses 100% browser-native media with 10-second pause detection.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-500 font-medium">
            Estimated duration: ~10-15 minutes
          </span>

          <button
            onClick={handleStartInterview}
            disabled={isCreating}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md shadow-indigo-200"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Initializing Interview Studio...</span>
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                <span>Start Mock Interview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
