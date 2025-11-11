import { useState, useCallback, useEffect } from "react";
import { TextToSpeechService } from "@/nlp/TextToSpeechService";
import { TranslationService } from "@/nlp/TranslationService";

interface MeetingSpeechOptions {
  defaultLanguage?: string;
  autoTranslate?: boolean;
  targetLanguage?: string;
  onSpeechStart?: (text: string) => void;
  onSpeechEnd?: () => void;
  onError?: (error: string) => void;
}

export const useMeetingSpeech = (options: MeetingSpeechOptions = {}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState(options.defaultLanguage || "en-US");
  const [error, setError] = useState<string | null>(null);

  const ttsService = TextToSpeechService.getInstance();

  // ✅ Initialize voices safely (handles Chrome delay)
  useEffect(() => {
    setIsSupported(ttsService.isSpeechSynthesisSupported());

    const loadVoices = () => {
      const availableVoices = ttsService.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    loadVoices();

    if (typeof speechSynthesis !== "undefined") {
      speechSynthesis.onvoiceschanged = () => loadVoices();
    }

    return () => {
      if (typeof speechSynthesis !== "undefined") {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [ttsService]);

  // ✅ Speak text with optional translation
  const speak = useCallback(
    async (text: string, language?: string) => {
      if (!ttsService.isSpeechSynthesisSupported()) {
        const errorMsg = "Text-to-speech not supported in this browser";
        setError(errorMsg);
        options.onError?.(errorMsg);
        return;
      }

      try {
        setIsSpeaking(true);
        setError(null);
        options.onSpeechStart?.(text);

        let finalText = text;
        let finalLanguage = language || currentLanguage;

        // 🔄 Optional translation
        if (
          options.autoTranslate &&
          options.targetLanguage &&
          finalLanguage !== options.targetLanguage
        ) {
          try {
            finalText = await TranslationService.translate(
              text,
              finalLanguage,
              options.targetLanguage
            );
            finalLanguage = options.targetLanguage;
          } catch (translationError) {
            console.warn("Translation failed, using original text:", translationError);
          }
        }

        // ✅ Pick proper voice (fallbacks)
        const allVoices = ttsService.getVoices();
        let voice =
          ttsService.getDefaultVoiceForLanguage(finalLanguage) ||
          allVoices.find((v) => v.lang.startsWith(finalLanguage.split("-")[0])) ||
          allVoices.find((v) => v.lang.startsWith("en")) ||
          allVoices[0];

        // ✅ Speak text (and ensure playback)
        const utterance = new SpeechSynthesisUtterance(finalText);
        utterance.lang = finalLanguage;
        utterance.voice = voice || null;

        utterance.onend = () => {
          setIsSpeaking(false);
          options.onSpeechEnd?.();
        };

        utterance.onerror = (e) => {
          const msg = e.error || "Speech synthesis error";
          setError(msg);
          setIsSpeaking(false);
          options.onError?.(msg);
        };

        // Ensure browser audio context is active before speaking
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        window.speechSynthesis.cancel(); // Stop any previous utterances
        window.speechSynthesis.speak(utterance);

      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to speak text";
        setError(errorMsg);
        setIsSpeaking(false);
        options.onError?.(errorMsg);
      }
    },
    [ttsService, currentLanguage, options]
  );

  // ✅ Stop, pause, resume
  const stop = useCallback(() => {
    ttsService.stop();
    setIsSpeaking(false);
    setIsPaused(false);
    options.onSpeechEnd?.();
  }, [ttsService, options]);

  const pause = useCallback(() => {
    ttsService.pause();
    setIsSpeaking(false);
    setIsPaused(true);
  }, [ttsService]);

  const resume = useCallback(() => {
    ttsService.resume();
    setIsSpeaking(true);
    setIsPaused(false);
  }, [ttsService]);

  // ✅ Change language
  const changeLanguage = useCallback((language: string) => {
    setCurrentLanguage(language);
  }, []);

  // ✅ Utilities
  const getVoicesByLanguage = useCallback(
    (language: string) => ttsService.getVoicesByLanguage(language),
    [ttsService]
  );

  const checkIsSpeaking = useCallback(() => ttsService.isSpeaking(), [ttsService]);
  const checkIsPaused = useCallback(() => ttsService.isPaused(), [ttsService]);

  return {
    isSupported,
    isSpeaking,
    isPaused,
    voices,
    currentLanguage,
    error,
    speak,
    stop,
    pause,
    resume,
    changeLanguage,
    getVoicesByLanguage,
    checkIsSpeaking,
    checkIsPaused,
  };
};
