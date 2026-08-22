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
        if (!pastedText.trim() || pastedText.trim().length < 20) {
          setError("Please enter your complete resume text (at least 20 characters).");
          setIsLoading(false);
          return;
        }

        res = await fetch("/api/resume/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rawText: pastedText, fileName: "Pasted Resume" }),
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data?.error || "Could not extract text from this file. Please use the 'Paste Text' tab to paste your resume content directly.");
        setIsLoading(false);
        return;
      }

      onAnalysisComplete(data.analysis, data.resumeId);
    } catch (err: unknown) {
      console.error(err);
      setError("Network or parsing error. You can also paste your resume text directly in the Paste Text tab.");
    } finally {
      setIsLoading(false);
    }
  };

  // Sample quick test resume filler
  const handleLoadSample = () => {
    setActiveTab("paste");
    setError(null);
    setPastedText(`ALEX CHEN
San Francisco, CA | alex.chen@example.com | (555) 234-5678 | github.com/alexchen | linkedin.com/in/alexchen

PROFESSIONAL SUMMARY
Hardworking software developer with knowledge of Java, React, TypeScript, and SQL. Looking for a challenging position to build web applications.

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, Java, SQL, HTML, CSS
Frameworks: React, Next.js, Node.js, Express, Tailwind CSS
Databases: PostgreSQL, MongoDB, Redis
Tools: Git, Docker, REST APIs, Jest, Agile

WORK EXPERIENCE
Frontend Software Engineer | TechSprint Solutions | June 2023 - Present
• Worked on web development tasks and built UI components using React and TypeScript.
• Fixed bugs and collaborated with team members in sprint meetings.
• Responsible for connecting frontend components to backend REST APIs.
• Handled state management and helped improve page performance.

Junior Developer Intern | CloudVenture Labs | Jan 2023 - May 2023
• Assisted senior engineers with database queries and API testing.
• Built internal dashboards and wrote unit tests in Jest.

KEY PROJECTS
Career Intelligence Platform | Next.js, React, Node.js, PostgreSQL
• Built a full-stack platform with user authentication, resume parsing, and interactive mock interview rounds.
• Integrated browser SpeechSynthesis and MediaRecorder APIs for live video interviews.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley | 2019 - 2023`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => {
            setActiveTab("upload");
            setError(null);
          }}
          className={`flex-1 py-3.5 px-6 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === "upload"
              ? "border-indigo-600 text-indigo-600 bg-indigo-50/40"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload PDF / DOCX</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("paste");
            setError(null);
          }}
          className={`flex-1 py-3.5 px-6 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === "paste"
              ? "border-indigo-600 text-indigo-600 bg-indigo-50/40"
              : "border-transparent text-slate-500 hover:text-slate-800"
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
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragOver
                ? "border-indigo-500 bg-indigo-50/60"
                : file
                ? "border-emerald-400 bg-emerald-50/30"
                : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
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
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="font-semibold text-slate-800">{file.name}</div>
                <div className="text-xs text-slate-500">
                  {(file.size / 1024).toFixed(1)} KB • Ready to analyze
                </div>
                <span className="text-xs text-indigo-600 font-medium hover:underline mt-1">
                  Click to choose a different file
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="font-semibold text-slate-800">
                  Click to upload or drag & drop your resume
                </div>
                <p className="text-xs text-slate-500">
                  Supports PDF, Word DOCX, and TXT files (Max 5MB)
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-600">Resume Plain Text</span>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
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
              className="w-full rounded-xl border border-slate-200 p-4 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        )}

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("paste")}
              className="font-bold underline text-indigo-700 hover:text-indigo-900 shrink-0 ml-2"
            >
              Switch to Paste Text
            </button>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleLoadSample}
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            Don&apos;t have a file ready? <span className="text-indigo-600 font-semibold underline">Load demo candidate resume</span>
          </button>

          <button
            onClick={handleAnalyze}
            disabled={isLoading || (activeTab === "upload" && !file) || (activeTab === "paste" && !pastedText.trim())}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs shadow-indigo-200"
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
