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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Text Answer Fallback</h3>
              <p className="text-[11px] text-slate-500">Provide or edit your answer transcript manually</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <span className="font-bold text-slate-900 block mb-1">Current Question:</span>
            <span>&ldquo;{questionText}&rdquo;</span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Your Spoken / Written Response:
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your detailed answer here using the STAR method (Situation, Task, Action, Result)..."
              rows={6}
              className="w-full text-xs rounded-xl border border-slate-200 p-3.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              {text.trim().split(/\s+/).filter(Boolean).length} words
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!text.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-xs shadow-indigo-200"
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
