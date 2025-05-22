"use client";

import { useState, useEffect, useCallback } from "react";

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
    item(index: number): SpeechRecognitionResult;
    length: number;
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
  browserSupportsSpeechRecognition: boolean;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [browserSupportsSpeechRecognition, setBrowserSupportsSpeechRecognition] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionAPI = (window as unknown as {
        SpeechRecognition?: new () => SpeechRecognition;
        webkitSpeechRecognition?: new () => SpeechRecognition;
      }).SpeechRecognition || (window as unknown as {
        SpeechRecognition?: new () => SpeechRecognition;
        webkitSpeechRecognition?: new () => SpeechRecognition;
      }).webkitSpeechRecognition;
      
      if (SpeechRecognitionAPI) {
        setBrowserSupportsSpeechRecognition(true);
        const recognitionInstance = new SpeechRecognitionAPI() as SpeechRecognition;
        
        recognitionInstance.lang = "ja-JP";
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        
        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript;
          setTranscript(prev => prev + transcript);
        };
        
        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
          setError(`音声認識エラー: ${event.error}`);
          setIsListening(false);
        };
        
        recognitionInstance.onend = () => {
          if (isListening) {
            recognitionInstance.start();
          }
        };
        
        setRecognition(recognitionInstance);
      } else {
        setError("お使いのブラウザは音声認識をサポートしていません。");
      }
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
        setIsListening(true);
        setError(null);
      } catch (err) {
        console.error("音声認識開始エラー:", err);
        setError("音声認識の開始に失敗しました。");
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error,
    browserSupportsSpeechRecognition
  };
}
