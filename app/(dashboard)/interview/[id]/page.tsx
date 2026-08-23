"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Video,
  Loader2,
  AlertCircle,
  Play,
  Mic,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Timer,
} from "lucide-react";
import { useInterviewMedia } from "@/hooks/useInterviewMedia";
import { UserWebcamStream } from "@/components/interview/UserWebcamStream";
import { AIInterviewerAvatar } from "@/components/interview/AIInterviewerAvatar";
import { SilenceDetector } from "@/components/interview/SilenceDetector";
import { InterviewControlsBar } from "@/components/interview/InterviewControlsBar";
import { SpeechFallbackModal } from "@/components/interview/SpeechFallbackModal";
import { MonacoCodingRound } from "@/components/interview/MonacoCodingRound";

interface SessionQuestion {
  id: string;
  questionText: string;
  orderIndex: number;
  category?: string;
  difficulty?: string;
  context?: string;
}

interface SessionRound {
  id: string;
  roundNumber: number;
  roundType: string;
  title: string;
  description: string;
  questions: SessionQuestion[];
}

interface SessionData {
  id: string;
  title: string;
  jobTitle: string;
  rounds: SessionRound[];
}

export default function LiveInterviewRoomPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [session, setSession] = useState<SessionData | null>(null);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  // 2-Minute Question Answer Timer (120 seconds per question)
  const [questionTimeLeft, setQuestionTimeLeft] = useState(120);

  const spokenQuestionIdRef = useRef<string | null>(null);
  const sessionRef = useRef<SessionData | null>(null);
  const roundIdxRef = useRef(0);
  const questionIdxRef = useRef(0);
  const liveTranscriptRef = useRef("");
  const isEvaluatingRef = useRef(false);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    roundIdxRef.current = currentRoundIdx;
  }, [currentRoundIdx]);

  useEffect(() => {
    questionIdxRef.current = currentQuestionIdx;
  }, [currentQuestionIdx]);

  // Forward declaration ref for submitAnswer to avoid stale closures in hook
  const submitAnswerRef = useRef<(customText?: string) => Promise<void>>(() => Promise.resolve());

  // Custom Media Hook
  const {
    videoRef,
    mediaStream,
    permissionError,
    requestMediaPermissions,
    isCameraOn,
    toggleCamera,
    isMicOn,
    toggleMic,
    isAiVoiceOn,
    setIsAiVoiceOn,
    isAiSpeaking,
    isUserSpeaking,
    liveTranscript,
    setLiveTranscript,
    silenceCountdown,
    resetSilenceDetection,
    speakQuestion,
    stopListening,
    startListening,
  } = useInterviewMedia({
    enableSilenceDetection: true,
    onSilenceTimeout: () => {
      // Automatically advance when silence countdown expires
      if (submitAnswerRef.current) {
        submitAnswerRef.current();
      }
    },
  });

  useEffect(() => {
    liveTranscriptRef.current = liveTranscript;
  }, [liveTranscript]);

  // Fetch Interview Details
  useEffect(() => {
    async function loadInterview() {
      try {
        const res = await fetch(`/api/interview/${id}`);
        const data = await res.json();
        if (!res.ok || !data.interview) {
          throw new Error(data.error || "Failed to load interview session");
        }
        setSession(data.interview);
      } catch (err: unknown) {
        console.error(err);
        setSessionError(err instanceof Error ? err.message : "Error loading interview.");
      } finally {
        setIsLoadingSession(false);
      }
    }
    if (id) {
      loadInterview();
    }
  }, [id]);

  const currentRound = session?.rounds[currentRoundIdx];
  const currentQuestion = currentRound?.questions[currentQuestionIdx];
  const isCodingRound = currentRound?.roundType === "CODING";

  // Trigger AI Voice & Reset 2-Minute Timer on question change
  useEffect(() => {
    if (hasStarted && currentQuestion && !isCodingRound) {
      if (spokenQuestionIdRef.current !== currentQuestion.id) {
        spokenQuestionIdRef.current = currentQuestion.id;
        setLiveTranscript("");
        setQuestionTimeLeft(120); // Reset to 2 minutes
        speakQuestion(currentQuestion.questionText);
      }
    }
  }, [hasStarted, currentQuestion, isCodingRound, speakQuestion, setLiveTranscript]);

  // 2-Minute Timer Tick (starts only AFTER AI finishes speaking question)
  useEffect(() => {
    if (!hasStarted || isAiSpeaking || isCodingRound || isEvaluating) return;

    const timer = setInterval(() => {
      setQuestionTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit when 2 minutes run out
          if (submitAnswerRef.current) {
            submitAnswerRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, isAiSpeaking, isCodingRound, isEvaluating]);

  // Request permissions & Start Interview
  const handleStartSession = async () => {
    const granted = await requestMediaPermissions();
    if (granted) {
      setHasStarted(true);
    }
  };

  // Submit Answer & Transition to Next Question
  const handleSubmitAnswer = useCallback(async (customText?: string) => {
    const activeSession = sessionRef.current;
    if (!activeSession) return;

    const rIdx = roundIdxRef.current;
    const qIdx = questionIdxRef.current;
    const activeRound = activeSession.rounds[rIdx];
    const activeQuestion = activeRound?.questions[qIdx];

    if (!activeQuestion || isEvaluatingRef.current) return;

    isEvaluatingRef.current = true;
    setIsEvaluating(true);
    resetSilenceDetection();
    stopListening();

    const answerText = (customText !== undefined ? customText : liveTranscriptRef.current).trim();
    const finalTranscript = answerText.length > 0 ? answerText : "(Candidate proceeded to next question)";

    // Clear transcript for upcoming question & reset timer
    setLiveTranscript("");
    setQuestionTimeLeft(120);

    // Advance question/round state
    if (activeRound && qIdx < activeRound.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else if (activeSession && rIdx < activeSession.rounds.length - 1) {
      setCurrentRoundIdx((prev) => prev + 1);
      setCurrentQuestionIdx(0);
    } else {
      // Final round completed
      await fetch(`/api/interview/${id}/complete`, { method: "POST" });
      router.push(`/interview/${id}/results`);
      return;
    }

    // Persist answer asynchronously
    try {
      await fetch("/api/interview/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: activeQuestion.id,
          transcript: finalTranscript,
          roundType: activeRound?.roundType,
        }),
      });
    } catch (err) {
      console.error("Failed to save answer:", err);
    } finally {
      isEvaluatingRef.current = false;
      setIsEvaluating(false);
    }
  }, [id, resetSilenceDetection, router, setLiveTranscript, stopListening]);

  // Keep ref up to date
  useEffect(() => {
    submitAnswerRef.current = handleSubmitAnswer;
  }, [handleSubmitAnswer]);

  // Coding Round Completion Handler
  const handleCodingComplete = async () => {
    if (session && currentRoundIdx < session.rounds.length - 1) {
      setCurrentRoundIdx((prev) => prev + 1);
      setCurrentQuestionIdx(0);
    } else {
      await fetch(`/api/interview/${id}/complete`, { method: "POST" });
      router.push(`/interview/${id}/results`);
    }
  };

  const handleEndInterview = async () => {
    if (confirm("Are you sure you want to end this interview session? Your completed rounds will be scored.")) {
      await fetch(`/api/interview/${id}/complete`, { method: "POST" });
      router.push(`/interview/${id}/results`);
    }
  };

  // Format 120 seconds into mm:ss
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoadingSession) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Preparing Interview Room...</span>
      </div>
    );
  }

  if (sessionError || !session) {
    return (
      <div className="p-6 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-3xl max-w-lg mx-auto text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 mx-auto" />
        <h3 className="text-base font-bold text-rose-900 dark:text-rose-200">Unable to Start Session</h3>
        <p className="text-xs text-rose-700 dark:text-rose-300">{sessionError || "Session not found."}</p>
      </div>
    );
  }

  // Pre-interview device check & start screen
  if (!hasStarted) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-8 text-center space-y-6 transition-colors">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xs">
            <Video className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>5-Round Live Simulation</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {session.jobTitle} Mock Interview
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Self-Intro • Resume Deep-Dive • Core Tech • Monaco Coding • Behavioral HR
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2 text-slate-600 dark:text-slate-300">
            <div className="font-bold text-slate-800 dark:text-white">How this studio works:</div>
            <ul className="space-y-1.5 list-disc pl-4 text-slate-600 dark:text-slate-400">
              <li>The AI interviewer speaks each question aloud in natural voice.</li>
              <li>Your microphone automatically activates after the AI finishes speaking.</li>
              <li>You have <strong>2 minutes per question</strong> to deliver your response.</li>
              <li>Click <strong>&ldquo;Next Question&rdquo;</strong> anytime when finished to submit.</li>
            </ul>
          </div>

          {permissionError && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>{permissionError} (Check browser camera/microphone permissions)</span>
            </div>
          )}

          <button
            onClick={handleStartSession}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 font-bold text-sm text-white transition-all shadow-md shadow-indigo-500/25 active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Enable Camera & Enter Interview Studio</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Top Session Progress Bar & 2-Minute Timer */}
      <div className="flex flex-wrap items-center justify-between bg-white dark:bg-slate-900 p-4 px-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs gap-3 transition-colors">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
            Round {currentRoundIdx + 1} of {session.rounds.length}: {currentRound?.title}
          </div>
          <div className="text-sm font-black text-slate-800 dark:text-white">{session.jobTitle} Mock Session</div>
        </div>

        {/* Center: 2-Minute Live Answer Timer */}
        {!isCodingRound && (
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border text-xs font-bold transition-all ${
            isAiSpeaking
              ? "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
              : questionTimeLeft <= 15
              ? "bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 animate-pulse"
              : questionTimeLeft <= 45
              ? "bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300"
              : "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
          }`}>
            <Timer className="w-4 h-4 shrink-0" />
            <span>
              {isAiSpeaking ? "2:00 (Starts after AI speaks)" : `Answer Time: ${formatTimer(questionTimeLeft)} / 02:00`}
            </span>
          </div>
        )}

        {/* 5-Round Progress Badges */}
        <div className="flex items-center gap-1.5">
          {session.rounds.map((r: SessionRound, idx: number) => (
            <div
              key={r.id}
              className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                idx === currentRoundIdx
                  ? "bg-indigo-600 text-white shadow-xs"
                  : idx < currentRoundIdx
                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
              }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Main Studio Viewport */}
      {isCodingRound ? (
        <MonacoCodingRound
          roundId={currentRound?.id || ""}
          problemContext={currentQuestion?.context}
          onCodingComplete={handleCodingComplete}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Interviewer Avatar & Live Question Card */}
          <AIInterviewerAvatar
            isAiSpeaking={isAiSpeaking}
            isListening={!isAiSpeaking && isMicOn}
            isEvaluating={isEvaluating}
            questionText={currentQuestion?.questionText || ""}
            roundTitle={currentRound?.title || "Mock Interview"}
            questionIndex={currentQuestionIdx + 1}
            totalQuestions={currentRound?.questions.length || 1}
          />

          {/* User Live Webcam Feed & Live Transcript */}
          <UserWebcamStream
            videoRef={videoRef}
            mediaStream={mediaStream}
            isCameraOn={isCameraOn}
            isMicOn={isMicOn}
            isUserSpeaking={isUserSpeaking}
            liveTranscript={liveTranscript}
          />
        </div>
      )}

      {/* Live Mic Listening Status Indicator Banner */}
      {!isCodingRound && (
        <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
          isAiSpeaking
            ? "bg-indigo-950/70 border-indigo-500/50 text-indigo-200"
            : isUserSpeaking
            ? "bg-emerald-950/70 border-emerald-500/50 text-emerald-200"
            : "bg-[#0f172a] border-indigo-500/30 text-white"
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              isAiSpeaking
                ? "bg-indigo-900/80 text-indigo-300"
                : isUserSpeaking
                ? "bg-emerald-900/80 text-emerald-300 animate-pulse"
                : "bg-indigo-950 text-indigo-400 border border-indigo-800"
            }`}>
              <Mic className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-white block">
                {isAiSpeaking
                  ? "AI Interviewer is asking the question..."
                  : isUserSpeaking
                  ? "Transcribing your voice in real time..."
                  : "Microphone Active (2-min timer running): Speak your answer clearly"}
              </span>
              <span className="text-[11px] text-slate-300">
                {liveTranscript
                  ? `${liveTranscript.split(/\s+/).filter(Boolean).length} words recorded`
                  : "Your transcribed words will appear on your webcam screen."}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSubmitAnswer()}
            disabled={isEvaluating}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/25 active:scale-95 shrink-0"
          >
            <span>{isEvaluating ? "Saving..." : "Next Question"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Silence Detector Banner (Shows when user pauses after speaking) */}
      {!isCodingRound && (
        <SilenceDetector
          countdown={silenceCountdown}
          onCancel={resetSilenceDetection}
          onSkipNow={() => handleSubmitAnswer()}
        />
      )}

      {/* Controls Bar */}
      {!isCodingRound && (
        <InterviewControlsBar
          isMicOn={isMicOn}
          onToggleMic={toggleMic}
          isCameraOn={isCameraOn}
          onToggleCamera={toggleCamera}
          isAiVoiceOn={isAiVoiceOn}
          onToggleAiVoice={() => setIsAiVoiceOn(!isAiVoiceOn)}
          onReplayQuestion={() => currentQuestion && speakQuestion(currentQuestion.questionText)}
          onOpenTextInput={() => setIsTextModalOpen(true)}
          onSubmitAnswer={() => handleSubmitAnswer()}
          onEndInterview={handleEndInterview}
          isEvaluating={isEvaluating}
          canSubmit={true}
        />
      )}

      {/* Text Fallback Modal for typed answers */}
      <SpeechFallbackModal
        isOpen={isTextModalOpen}
        onClose={() => setIsTextModalOpen(false)}
        questionText={currentQuestion?.questionText || ""}
        currentTranscript={liveTranscript}
        onSubmit={(text) => {
          setIsTextModalOpen(false);
          handleSubmitAnswer(text);
        }}
      />
    </div>
  );
}
