"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Code2, Play, CheckCircle2, AlertCircle, RotateCcw, ArrowRight, Loader2, Sparkles, Cpu } from "lucide-react";
import { CodingEvaluationResult } from "@/types";
import { CODING_PROBLEMS, CodingProblem } from "@/lib/data/codingProblems";

interface MonacoCodingRoundProps {
  roundId: string;
  problemContext?: string;
  problemTitle?: string;
  onCodingComplete: (result: CodingEvaluationResult) => void;
}

// Function to resolve the active coding problem from context
function resolveProblemFromContext(context?: string, title?: string): CodingProblem {
  if (!context && !title) return CODING_PROBLEMS[0];
  const lower = ((context || "") + " " + (title || "")).toLowerCase();

  if (lower.includes("profit") || lower.includes("stock") || lower.includes("prices")) {
    return CODING_PROBLEMS.find((p) => p.id === "best-time-to-buy-and-sell-stock") || CODING_PROBLEMS[0];
  }
  if (lower.includes("parenthes") || lower.includes("brackets") || lower.includes("isvalid")) {
    return CODING_PROBLEMS.find((p) => p.id === "valid-parentheses") || CODING_PROBLEMS[0];
  }
  if (lower.includes("maximum subarray") || lower.includes("kadane") || lower.includes("maxsubarray")) {
    return CODING_PROBLEMS.find((p) => p.id === "maximum-subarray") || CODING_PROBLEMS[0];
  }
  if (lower.includes("longest substring") || lower.includes("lengthoflongestsubstring")) {
    return CODING_PROBLEMS.find((p) => p.id === "longest-substring-without-repeating-characters") || CODING_PROBLEMS[0];
  }
  if (lower.includes("duplicate") || lower.includes("containsduplicate")) {
    return CODING_PROBLEMS.find((p) => p.id === "contains-duplicate") || CODING_PROBLEMS[0];
  }
  if (lower.includes("stairs") || lower.includes("climbstairs") || lower.includes("staircase")) {
    return CODING_PROBLEMS.find((p) => p.id === "climbing-stairs") || CODING_PROBLEMS[0];
  }
  if (lower.includes("binary search") || lower.includes("search(nums")) {
    return CODING_PROBLEMS.find((p) => p.id === "binary-search") || CODING_PROBLEMS[0];
  }

  return CODING_PROBLEMS[0]; // Two Sum
}

export function MonacoCodingRound({
  roundId,
  problemContext,
  problemTitle,
  onCodingComplete,
}: MonacoCodingRoundProps) {
  const activeProblem = resolveProblemFromContext(problemContext, problemTitle);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(activeProblem.starterCode.javascript);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"problem" | "results">("problem");
  const [evaluation, setEvaluation] = useState<CodingEvaluationResult | null>(null);

  // Sync starter code whenever language or active problem changes
  useEffect(() => {
    const starters = activeProblem.starterCode as Record<string, string>;
    setCode(starters[language] || starters.javascript);
  }, [language, activeProblem]);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    const starters = activeProblem.starterCode as Record<string, string>;
    setCode(starters[newLang] || starters.javascript);
  };

  const handleResetCode = () => {
    const starters = activeProblem.starterCode as Record<string, string>;
    setCode(starters[language] || starters.javascript);
    setEvaluation(null);
  };

  const handleRunAndReview = async () => {
    setIsRunning(true);
    setActiveTab("results");

    try {
      const res = await fetch("/api/interview/coding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roundId,
          code,
          language,
          problemContext: problemContext || activeProblem.context,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.evaluation) {
        throw new Error(data.error || "Failed to analyze code");
      }

      setEvaluation(data.evaluation);
    } catch (err) {
      console.error("Coding evaluation error:", err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
      {/* Left Panel: Problem Statement & Test Results */}
      <div className="lg:col-span-5 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Left Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <button
            onClick={() => setActiveTab("problem")}
            className={`flex-1 py-3 px-4 text-xs font-bold transition-colors ${
              activeTab === "problem"
                ? "bg-white text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Problem Description
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`flex-1 py-3 px-4 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "results"
                ? "bg-white text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>Test Results</span>
            {evaluation && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  evaluation.correctnessScore >= 70
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {evaluation.correctnessScore}/100
              </span>
            )}
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {activeTab === "problem" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {activeProblem.category}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    activeProblem.difficulty === "Easy"
                      ? "bg-emerald-50 text-emerald-700"
                      : activeProblem.difficulty === "Medium"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {activeProblem.difficulty}
                </span>
              </div>

              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                {activeProblem.title}
              </h2>

              <div className="prose prose-xs max-w-none text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-3.5 rounded-xl border border-slate-100 font-mono text-[11px]">
                {problemContext || activeProblem.context}
              </div>

              {/* What Interviewers Look For */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Evaluation Focus</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {activeProblem.idealAnswerPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {isRunning ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                  <span className="text-xs font-bold text-slate-700">
                    Running Test Cases & Analyzing Big-O Complexity...
                  </span>
                </div>
              ) : evaluation ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {/* Scores Banner */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Correctness</span>
                      <div className="text-lg font-black text-slate-900">
                        {evaluation.correctnessScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Code Quality</span>
                      <div className="text-lg font-black text-slate-900">
                        {evaluation.codeQualityScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
                      </div>
                    </div>
                  </div>

                  {/* Complexity Tags */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-indigo-50 border border-indigo-200 rounded-xl p-2.5 text-center">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase block">Time Complexity</span>
                      <span className="text-xs font-black text-indigo-950">{evaluation.complexityTime}</span>
                    </div>
                    <div className="flex-1 bg-indigo-50 border border-indigo-200 rounded-xl p-2.5 text-center">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase block">Space Complexity</span>
                      <span className="text-xs font-black text-indigo-950">{evaluation.complexitySpace}</span>
                    </div>
                  </div>

                  {/* Test Cases List */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Automated Test Results
                    </h4>
                    {evaluation.testResults.map((tc) => (
                      <div
                        key={tc.testCaseNumber}
                        className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                          tc.passed
                            ? "bg-emerald-50/60 border-emerald-200 text-emerald-950"
                            : "bg-rose-50/60 border-rose-200 text-rose-950"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="flex items-center gap-1.5">
                            {tc.passed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            )}
                            <span>Test Case #{tc.testCaseNumber}</span>
                          </span>
                          <span className={tc.passed ? "text-emerald-700" : "text-rose-700"}>
                            {tc.passed ? "PASSED" : "FAILED"}
                          </span>
                        </div>
                        <div className="font-mono text-[11px] opacity-90">
                          <div>Input: {tc.input}</div>
                          <div>Expected: {tc.expectedOutput}</div>
                          {!tc.passed && <div>Actual: {tc.actualOutput}</div>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Feedback */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Code Reviewer Feedback</span>
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">{evaluation.feedback}</p>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                  <Play className="w-6 h-6 mx-auto text-slate-300" />
                  <p>Click "Run Code & Validate" to execute test cases and review Big-O complexity.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Monaco Code Editor */}
      <div className="lg:col-span-7 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 shadow-xs overflow-hidden">
        {/* Editor Controls Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>

            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="javascript">JavaScript (ES6+)</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python 3</option>
              <option value="java">Java</option>
              <option value="cpp">C++ (std::vector)</option>
              <option value="go">Go (Golang)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetCode}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Reset Code Template"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Monaco Editor Canvas */}
        <div className="flex-1 min-h-[300px] overflow-hidden">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: "on",
              roundedSelection: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 12, bottom: 12 },
              tabSize: 2,
              wordWrap: "on",
            }}
          />
        </div>

        {/* Action Bottom Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {code.length} characters written • Language: <span className="text-slate-200 font-semibold">{language}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAndReview}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-xs font-bold text-white transition-colors shadow-xs shadow-indigo-900"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Run Code & Validate</span>
                </>
              )}
            </button>

            <button
              onClick={() => onCodingComplete(evaluation || {
                correctnessScore: 80,
                complexityTime: "O(n)",
                complexitySpace: "O(n)",
                codeQualityScore: 85,
                feedback: "Coding round completed.",
                testResults: [],
                optimizationSuggestions: [],
              })}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-colors shadow-xs shadow-emerald-900"
            >
              <span>Submit & Next Round</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
