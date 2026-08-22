"use client";

import { useState } from "react";
import { X, Send, MessageSquare, AlertCircle } from "lucide-react";

interface SpeechFallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionText: string;
  currentTranscript: string;
  onSubmit: (text: string) => void;
}

export function SpeechFallbackModal({
  isOpen,
  onClose,
  questionText,
  currentTranscript,
  onSubmit,
}: SpeechFallbackModalProps) {
  const [text, setText] = useState(currentTranscript);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-2xs">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Text Answer Fallback</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Provide or edit your answer transcript manually</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">Current Question:</span>
            <span>&ldquo;{questionText}&rdquo;</span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Your Spoken / Written Response:
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your detailed answer here..."
              rows={6}
              className="w-full text-xs rounded-2xl border border-slate-200 dark:border-slate-700 p-3.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              {text.trim().split(/\s+/).filter(Boolean).length} words
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!text.trim()}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-bold text-white disabled:opacity-50 transition-all shadow-md shadow-indigo-500/25 active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit & Evaluate</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
