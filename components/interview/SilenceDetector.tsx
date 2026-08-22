"use client";

import { Clock, ArrowRight, X } from "lucide-react";

interface SilenceDetectorProps {
  countdown: number | null;
  onCancel: () => void;
  onSkipNow: () => void;
}

export function SilenceDetector({ countdown, onCancel, onSkipNow }: SilenceDetectorProps) {
  if (countdown === null) return null;

  const pct = Math.min(100, Math.max(0, ((5 - countdown) / 5) * 100));

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl border border-slate-700 shadow-xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-200 max-w-md w-full mx-4">
      <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
        <Clock className="w-4 h-4 animate-pulse" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-xs font-semibold mb-1">
          <span>Pause detected</span>
          <span className="text-indigo-400 font-bold">Auto-advancing in {countdown}s</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-1000 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onCancel}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
          title="Keep answering"
        >
          <span>Cancel</span>
        </button>
        <button
          onClick={onSkipNow}
          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white transition-colors flex items-center gap-1"
        >
          <span>Next</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
