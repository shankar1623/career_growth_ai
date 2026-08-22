"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseInterviewMediaOptions {
  onSilenceTimeout?: () => void;
  onTranscriptUpdate?: (transcript: string) => void;
  enableSilenceDetection?: boolean;
}

export function useInterviewMedia(options: UseInterviewMediaOptions = {}) {
  const { onSilenceTimeout, onTranscriptUpdate, enableSilenceDetection = true } = options;

  const [hasPermissions, setHasPermissions] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isAiVoiceOn, setIsAiVoiceOn] = useState(true);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [silenceCountdown, setSilenceCountdown] = useState<number | null>(null);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const isAiSpeakingRef = useRef(false);
  const isMicOnRef = useRef(true);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const onSilenceTimeoutRef = useRef(onSilenceTimeout);
  const isCountingDownRef = useRef(false);
  const lastRecordedWordCountRef = useRef(0);

  useEffect(() => {
    onSilenceTimeoutRef.current = onSilenceTimeout;
  }, [onSilenceTimeout]);

  useEffect(() => {
    isMicOnRef.current = isMicOn;
  }, [isMicOn]);

  // Reset Silence Timers completely
  const resetSilenceDetection = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    isCountingDownRef.current = false;
    setSilenceCountdown(null);
  }, []);

  // Trigger silence countdown after user finishes speaking
  const startSilenceCountdown = useCallback((duration: number = 5) => {
    if (!enableSilenceDetection) return;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    isCountingDownRef.current = true;
    let timeLeft = duration;
    setSilenceCountdown(timeLeft);

    countdownIntervalRef.current = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
        isCountingDownRef.current = false;
        setSilenceCountdown(null);
        // Fire timeout callback to automatically advance
        if (onSilenceTimeoutRef.current) {
          onSilenceTimeoutRef.current();
        }
      } else {
        setSilenceCountdown(timeLeft);
      }
    }, 1000);
  }, [enableSilenceDetection]);

  // Initialize Media Stream
  const requestMediaPermissions = useCallback(async () => {
    try {
      setPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: true,
      });

      streamRef.current = stream;
      setMediaStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setHasPermissions(true);
      return true;
    } catch (err: unknown) {
      console.error("Media permission error:", err);
      const msg = err instanceof Error ? err.message : "Camera and microphone access was denied or not found.";
      setPermissionError(msg);
      return false;
    }
  }, []);

  // Ensure video element receives stream whenever mounted
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch(() => {});
    }
  }, [mediaStream]);

  // Toggle Camera
  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };

  // Toggle Microphone
  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
        isMicOnRef.current = audioTrack.enabled;
      }
    }
  };

  // Stop Listening immediately and abort speech recognition
  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    setIsUserSpeaking(false);
    resetSilenceDetection();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }
  }, [resetSilenceDetection]);

  // Start Listening strictly when AI is NOT speaking
  const startListening = useCallback(() => {
    resetSilenceDetection();
    lastRecordedWordCountRef.current = 0;
    if (isAiSpeakingRef.current || !isMicOnRef.current) return;

    isListeningRef.current = true;
    setIsListening(true);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch {
        // Recognition might already be running
      }
    }
  }, [resetSilenceDetection]);

  // Setup Web Speech API Recognition
  useEffect(() => {
    if (typeof window === "undefined") return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setSpeechRecognitionSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      // STRICT SAFETY: If AI is speaking or listening is disabled, discard all audio!
      if (isAiSpeakingRef.current || !isListeningRef.current) {
        return;
      }

      let finalStr = "";
      let interimStr = "";

      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalStr += event.results[i][0].transcript + " ";
        } else {
          interimStr += event.results[i][0].transcript;
        }
      }

      const fullText = (finalStr + interimStr).trim();
      if (fullText) {
        const currentWords = fullText.split(/\s+/).filter(Boolean).length;
        setLiveTranscript(fullText);
        if (onTranscriptUpdate) onTranscriptUpdate(fullText);

        setIsUserSpeaking(true);

        // If a countdown is actively running: only cancel it if the user spoke at least 2 NEW words
        if (isCountingDownRef.current) {
          if (currentWords >= lastRecordedWordCountRef.current + 2) {
            // User resumed answering with meaningful new content
            resetSilenceDetection();
            lastRecordedWordCountRef.current = currentWords;
          } else {
            // Minor background sound / interim flutter - keep countdown steady without blinking off!
            return;
          }
        }

        // Only start pause countdown if candidate has answered at least 4 words
        if (currentWords >= 4) {
          lastRecordedWordCountRef.current = currentWords;
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            setIsUserSpeaking(false);
            startSilenceCountdown(5);
          }, 5000);
        }
      }
    };

    // Auto-restart recognition only if listening is active and AI is NOT speaking
    recognition.onend = () => {
      if (isListeningRef.current && !isAiSpeakingRef.current) {
        try {
          recognition.start();
        } catch {}
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (e: any) => {
      if (e.error !== "no-speech" && e.error !== "aborted") {
        console.warn("Speech recognition note:", e.error);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.abort();
      } catch {}
      resetSilenceDetection();
    };
  }, [onTranscriptUpdate, resetSilenceDetection, startSilenceCountdown]);

  // Speak AI Question using browser SpeechSynthesis
  const speakQuestion = useCallback(
    (text: string, onComplete?: () => void) => {
      // 1. FORCIBLY STOP ALL MIC RECOGNITION BEFORE AI SPEAKS
      stopListening();
      setIsAiSpeaking(true);
      isAiSpeakingRef.current = true;
      setLiveTranscript("");
      lastRecordedWordCountRef.current = 0;

      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        setIsAiSpeaking(false);
        isAiSpeakingRef.current = false;
        if (onComplete) onComplete();
        startListening();
        return;
      }

      window.speechSynthesis.cancel();

      if (!isAiVoiceOn) {
        setIsAiSpeaking(false);
        isAiSpeakingRef.current = false;
        if (onComplete) onComplete();
        startListening();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = "en-US";

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          (v.name.includes("Natural") ||
            v.name.includes("Google") ||
            v.name.includes("Samantha") ||
            v.name.includes("Jenny") ||
            v.name.includes("Guy") ||
            v.name.includes("David")) &&
          v.lang.startsWith("en")
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        setIsAiSpeaking(false);
        isAiSpeakingRef.current = false;
        if (onComplete) onComplete();
        // Buffer 400ms before activating candidate's mic
        setTimeout(() => {
          if (!isAiSpeakingRef.current) {
            startListening();
          }
        }, 400);
      };

      utterance.onerror = (e) => {
        if (e.error !== "canceled" && e.error !== "interrupted") {
          console.warn("Speech synthesis notice:", e.error);
        }
        setIsAiSpeaking(false);
        isAiSpeakingRef.current = false;
        if (onComplete) onComplete();
        setTimeout(() => {
          if (!isAiSpeakingRef.current) {
            startListening();
          }
        }, 400);
      };

      window.speechSynthesis.speak(utterance);
    },
    [isAiVoiceOn, startListening, stopListening]
  );

  return {
    hasPermissions,
    permissionError,
    mediaStream,
    videoRef,
    isCameraOn,
    toggleCamera,
    isMicOn,
    toggleMic,
    isAiVoiceOn,
    setIsAiVoiceOn,
    isAiSpeaking,
    isUserSpeaking,
    isListening,
    liveTranscript,
    setLiveTranscript,
    silenceCountdown,
    speechRecognitionSupported,
    requestMediaPermissions,
    speakQuestion,
    stopListening,
    startListening,
    resetSilenceDetection,
  };
}
