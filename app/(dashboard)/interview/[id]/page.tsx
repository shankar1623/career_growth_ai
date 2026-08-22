"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Video,
  Loader2,
  AlertCircle,
  Play,
} from "lucide-react";
import { useInterviewMedia } from "@/hooks/useInterviewMedia";
import { UserWebcamStream } from "@/components/interview/UserWebcamStream";
import { AIInterviewerAvatar } from "@/components/interview/AIInterviewerAvatar";
import { SilenceDetector } from "@/components/interview/SilenceDetector";
import { InterviewControlsBar } from "@/components/interview/InterviewControlsBar";
import { SpeechFallbackModal } from "@/components/interview/SpeechFallbackModal";
import { MonacoCodingRound } from "@/components/interview/MonacoCodingRound";
import { InterviewRoundData } from "@/types";

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
  } = useInterviewMedia({
    enableSilenceDetection: true,
    onSilenceTimeout: () => {
      // Auto move after 10-sec silence
      handleSubmitAnswer();
    },
  });

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

  // Trigger AI Voice when moving to a new question
  useEffect(() => {
    if (hasStarted && currentQuestion && !isCodingRound) {
      speakQuestion(currentQuestion.questionText);
    }
  }, [hasStarted, currentRoundIdx, currentQuestionIdx, currentQuestion, isCodingRound, speakQuestion]);

  // Request permissions & Start Interview
  const handleStartSession = async () => {
    const granted = await requestMediaPermissions();
    if (granted) {
      setHasStarted(true);
    }
  };

  // Submit Answer & Transition
  const handleSubmitAnswer = useCallback(async (customText?: string) => {
    if (!currentQuestion || isEvaluating) return;
    setIsEvaluating(true);
    resetSilenceDetection();
    stopListening();

    const answerText = (customText || liveTranscript || "").trim();
    const finalTranscript = answerText.length > 0 ? answerText : "(Question Skipped / No answer provided)";

    try {
      await fetch("/api/interview/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          transcript: finalTranscript,
          roundType: currentRound?.roundType,
        }),
      });

      // Clear transcript for next question
      setLiveTranscript("");

      // Move to next question or next round
      if (currentRound && currentQuestionIdx < currentRound.questions.length - 1) {
        setCurrentQuestionIdx((prev) => prev + 1);
      } else if (session && currentRoundIdx < session.rounds.length - 1) {
        setCurrentRoundIdx((prev) => prev + 1);
        setCurrentQuestionIdx(0);
      } else {
        // All 5 rounds completed! Complete interview & route to results
        await fetch(`/api/interview/${id}/complete`, { method: "POST" });
        router.push(`/interview/${id}/results`);
      }
    } catch (err) {
      console.error("Failed to submit answer:", err);
    } finally {
      setIsEvaluating(false);
    }
  }, [currentQuestion, isEvaluating, resetSilenceDetection, stopListening, liveTranscript, currentRound, session, currentRoundIdx, currentQuestionIdx, setLiveTranscript, id, router]);

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

  if (isLoadingSession) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="text-xs font-semibold text-slate-500">Preparing Interview Room...</span>
      </div>
    );
  }

  if (sessionError || !session) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl max-w-lg mx-auto text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
        <h3 className="text-base font-bold text-rose-900">Unable to Start Session</h3>
        <p className="text-xs text-rose-700">{sessionError || "Session not found."}</p>
      </div>
    );
  }

  // Pre-interview device check & start screen
  if (!hasStarted) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
            <Video className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {session.jobTitle} Live Mock Interview
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              5 comprehensive rounds (Self-Intro, Resume, Tech, Monaco Coding, HR)
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 text-slate-600">
            <div className="font-bold text-slate-800">Before you begin:</div>
            <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
              <li>Ensure your webcam and microphone permissions are enabled.</li>
              <li>Your voice will be transcribed in real time.</li>
              <li>A 10-second pause detector helps advance questions smoothly.</li>
              <li>You can pause or manually submit answers at any time.</li>
            </ul>
          </div>

          {permissionError && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{permissionError} (Check browser camera permissions)</span>
            </div>
          )}

          <button
            onClick={handleStartSession}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-sm text-white transition-all shadow-md shadow-indigo-200"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Enable Camera & Enter Room</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Session Progress Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-indigo-600 uppercase">
            Round {currentRoundIdx + 1} of {session.rounds.length}: {currentRound?.title}
          </div>
          <div className="text-sm font-extrabold text-slate-800">{session.jobTitle} Mock Session</div>
        </div>

        {/* 5-Round Progress Badges */}
        <div className="flex items-center gap-1.5">
          {session.rounds.map((r: SessionRound, idx: number) => (
            <div
              key={r.id}
              className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                idx === currentRoundIdx
                  ? "bg-indigo-600 text-white shadow-xs"
                  : idx < currentRoundIdx
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-400"
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

          {/* User Live Webcam Feed */}
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

      {/* 10-Second Silence Detector Banner */}
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
