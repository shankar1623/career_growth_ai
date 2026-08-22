"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, Loader2, AlertCircle, ArrowRight, Edit3, Sparkles } from "lucide-react";
import { ResumeOverallAnalysis } from "@/types";

interface ResumeUploadZoneProps {
  onAnalysisComplete: (analysis: ResumeOverallAnalysis, resumeId: string) => void;
}

export function ResumeUploadZone({ onAnalysisComplete }: ResumeUploadZoneProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const validExtensions = [".pdf", ".docx", ".txt"];
      const isValid = validExtensions.some((ext) => droppedFile.name.toLowerCase().endsWith(ext));
      if (isValid) {
        setFile(droppedFile);
        setError(null);
      } else {
        setError("Please upload a valid PDF, DOCX, or TXT file.");
      }
    }
  };

  const handleAnalyze = async () => {
    setError(null);
    setIsLoading(true);

    try {
      let res: Response;

      if (activeTab === "upload") {
        if (!file) {
          setError("Please select a resume file to upload.");
          setIsLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        res = await fetch("/api/resume/analyze", {
          method: "POST",
          body: formData,
        });
      } else {
        if (!pastedText.trim()) {
          setError("Please paste your resume text before analyzing.");
          setIsLoading(false);
          return;
        }

        res = await fetch("/api/resume/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rawText: pastedText }),
        });
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to analyze resume. Please try pasting raw text.");
      }

      onAnalysisComplete(data.analysis, data.resumeId);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error analyzing resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = () => {
    setActiveTab("paste");
    setError(null);
    setPastedText(`JOHN DOE
Software Engineer | San Francisco, CA | john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe | github.com/johndoe

SUMMARY
Results-oriented Full-Stack Engineer with 3+ years of experience architecting high-scale web applications with TypeScript, React, Next.js, and Node.js. Passionate about database optimization, clean code, and cloud infrastructure.

SKILLS
Languages: TypeScript, JavaScript, Python, SQL, HTML, CSS
Frameworks & Libraries: React, Next.js, Express, Tailwind CSS, Jest
Databases & Cloud: PostgreSQL, MongoDB, Redis, AWS (S3, EC2), Docker, Git, CI/CD

EXPERIENCE
Full-Stack Engineer | Apex Systems | San Francisco, CA | 2022 - Present
• Architected and deployed microservices backend in Node.js and PostgreSQL, serving 100,000+ daily active users with 99.9% uptime.
• Reduced database query latency by 42% by redesigning relational schema and implementing Redis caching layers.
• Led frontend redesign using Next.js 14 App Router and TypeScript, improving Google Core Web Vitals performance scores by 35 points.
• Automated CI/CD deployment pipelines with GitHub Actions and Docker, reducing release cycle time from 2 hours to 12 minutes.

Associate Developer | InnovateTech Labs | San Jose, CA | 2021 - 2022
• Developed reusable React UI component library used across 4 internal engineering teams, cutting UI bug reports by 28%.
• Integrated Stripe API payment gateway handling $500K+ monthly transaction volumes with zero reconciliation errors.
• Collaborated with Agile product managers and QA engineers in 2-week sprint cycles with 100% on-time milestone delivery.

PROJECTS
Career AI Platform (Next.js, TypeScript, PostgreSQL)
• Built an end-to-end career acceleration tool featuring automated ATS scoring, mock interview simulations, and tailored roadmaps.
• Integrated browser-native SpeechRecognition API and custom Monaco code editor for real-time live assessments.

Cloud Task Orchestrator (Python, Docker, AWS)
• Designed distributed background task worker queue processing 50,000 asynchronous jobs daily with dead-letter retry logic.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley | 2017 - 2021`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => {
            setActiveTab("upload");
            setError(null);
          }}
          className={`flex-1 py-3.5 px-6 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === "upload"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/40"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload File (PDF / DOCX)</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("paste");
            setError(null);
          }}
          className={`flex-1 py-3.5 px-6 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === "paste"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/40"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Paste Text</span>
        </button>
      </div>

      <div className="p-6">
        {activeTab === "upload" ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              isDragOver
                ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40"
                : file
                ? "border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20"
                : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt"
              className="hidden"
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="font-bold text-slate-800 dark:text-slate-100">{file.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {(file.size / 1024).toFixed(1)} KB • Ready to analyze
                </div>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline mt-1">
                  Click to choose a different file
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="font-bold text-slate-800 dark:text-slate-100">
                  Click to upload or drag & drop your resume
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Supports PDF, Word DOCX, and TXT files (Max 5MB)
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">Resume Plain Text</span>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Load Sample Candidate Resume</span>
              </button>
            </div>
            <textarea
              value={pastedText}
              onChange={(e) => {
                setPastedText(e.target.value);
                setError(null);
              }}
              placeholder="Paste your resume text here (Summary, Skills, Work Experience, Projects, Education)..."
              rows={10}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 p-4 text-xs font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {error && (
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("paste")}
              className="font-bold underline text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 shrink-0 ml-2"
            >
              Switch to Paste Text
            </button>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleLoadSample}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            Don&apos;t have a file ready? <span className="text-indigo-600 dark:text-indigo-400 font-semibold underline">Load demo candidate resume</span>
          </button>

          <button
            onClick={handleAnalyze}
            disabled={isLoading || (activeTab === "upload" && !file) || (activeTab === "paste" && !pastedText.trim())}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-500/25"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Sections & Scores...</span>
              </>
            ) : (
              <>
                <span>Analyze Resume</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
