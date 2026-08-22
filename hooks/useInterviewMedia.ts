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
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const silencePauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const onSilenceTimeoutRef = useRef(onSilenceTimeout);
  const isCountingDownRef = useRef(false);
  const hasSpokenThisQuestionRef = useRef(false);

  useEffect(() => {
    onSilenceTimeoutRef.current = onSilenceTimeout;
  }, [onSilenceTimeout]);

  useEffect(() => {
    isMicOnRef.current = isMicOn;
  }, [isMicOn]);

  // Reset Silence Timers & Countdown
  const resetSilenceDetection = useCallback(() => {
    if (silencePauseTimerRef.current) {
      clearTimeout(silencePauseTimerRef.current);
      silencePauseTimerRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    isCountingDownRef.current = false;
    setSilenceCountdown(null);
  }, []);

  // Trigger 5-second countdown to auto-advance
  const startSilenceCountdown = useCallback(() => {
    if (!enableSilenceDetection || isCountingDownRef.current || isAiSpeakingRef.current) return;

    if (silencePauseTimerRef.current) {
      clearTimeout(silencePauseTimerRef.current);
      silencePauseTimerRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    isCountingDownRef.current = true;
    let timeLeft = 5;
    setSilenceCountdown(5);

    countdownTimerRef.current = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        isCountingDownRef.current = false;
        setSilenceCountdown(null);
        hasSpokenThisQuestionRef.current = false;

        // Auto-advance to next question
        if (onSilenceTimeoutRef.current) {
          onSilenceTimeoutRef.current();
        }
      } else {
        setSilenceCountdown(timeLeft);
      }
    }, 1000);
  }, [enableSilenceDetection]);

  // Handle user speech activity detected (either via speech recognition or audio volume)
  const handleUserActivity = useCallback(
    (transcriptText?: string) => {
      if (isAiSpeakingRef.current || !isListeningRef.current) return;

      setIsUserSpeaking(true);
      hasSpokenThisQuestionRef.current = true;

      if (transcriptText) {
        setLiveTranscript(transcriptText);
        if (onTranscriptUpdate) onTranscriptUpdate(transcriptText);
      }

      // If countdown was active and user started speaking again, cancel countdown
      if (isCountingDownRef.current) {
        resetSilenceDetection();
      }

      // Schedule silence countdown after 3.5 seconds of quiet
      if (silencePauseTimerRef.current) clearTimeout(silencePauseTimerRef.current);
      silencePauseTimerRef.current = setTimeout(() => {
        setIsUserSpeaking(false);
        if (hasSpokenThisQuestionRef.current && !isAiSpeakingRef.current && isListeningRef.current) {
          startSilenceCountdown();
        }
      }, 3500);
    },
    [onTranscriptUpdate, resetSilenceDetection, startSilenceCountdown]
  );

  // Setup Web Audio Analyser for reliable voice activity / volume detection
  const setupAudioAnalyser = useCallback(
    (stream: MediaStream) => {
      try {
        if (typeof window === "undefined") return;
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;

        const audioCtx = new AudioContextClass();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);

        audioIntervalRef.current = setInterval(() => {
          if (!isListeningRef.current || isAiSpeakingRef.current || !isMicOnRef.current) {
            return;
          }

          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;

          // If volume exceeds threshold (user speaking into mic)
          if (average > 14) {
            handleUserActivity();
          }
        }, 300);
      } catch (err) {
        console.warn("Audio analyser initialization notice:", err);
      }
    },
    [handleUserActivity]
  );

  // Request Permissions & Initialize Media
  const requestMediaPermissions = useCallback(async () => {
    try {
      setPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: true,
      });

      streamRef.current = stream;
      setMediaStream(stream);
      setupAudioAnalyser(stream);

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
  }, [setupAudioAnalyser]);

  // Ensure video element receives stream
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

  // Stop Listening
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

  // Start Listening
  const startListening = useCallback(() => {
    resetSilenceDetection();
    hasSpokenThisQuestionRef.current = false;
    if (isAiSpeakingRef.current || !isMicOnRef.current) return;

    isListeningRef.current = true;
    setIsListening(true);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch {
        // Recognition might already be active
      }
    }
  }, [resetSilenceDetection]);

  // Speech Recognition Hook
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
      if (isAiSpeakingRef.current || !isListeningRef.current) return;

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
        handleUserActivity(fullText);
      }
    };

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
        console.warn("Speech recognition notice:", e.error);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.abort();
      } catch {}
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
      resetSilenceDetection();
    };
  }, [handleUserActivity, resetSilenceDetection]);

  // Speak AI Question using browser SpeechSynthesis
  const speakQuestion = useCallback(
    (text: string, onComplete?: () => void) => {
      // Forcibly stop mic & reset state before AI speaks
      stopListening();
      setIsAiSpeaking(true);
      isAiSpeakingRef.current = true;
      setLiveTranscript("");
      hasSpokenThisQuestionRef.current = false;
      resetSilenceDetection();

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
    [isAiVoiceOn, resetSilenceDetection, startListening, stopListening]
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
