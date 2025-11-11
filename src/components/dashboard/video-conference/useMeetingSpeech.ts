import { useState, useCallback, useEffect } from 'react';
import { TextToSpeechService } from '@/nlp/TextToSpeechService';
import { TranslationService } from '@/nlp/TranslationService';

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
  const [currentLanguage, setCurrentLanguage] = useState(options.defaultLanguage || 'en-US');
  const [error, setError] = useState<string | null>(null);
  
  const ttsService = TextToSpeechService.getInstance();

  // Initialize text-to-speech service
  useEffect(() => {
    setIsSupported(ttsService.isSpeechSynthesisSupported());
    
    // Load voices
    const loadVoices = () => {
      const availableVoices = ttsService.getVoices();
      setVoices(availableVoices);
    };
    
    loadVoices();
    
    // Set up voice change listener
    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      if (typeof speechSynthesis !== 'undefined') {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [ttsService]);

  // Speak text with optional translation
  const speak = useCallback(async (text: string, language?: string) => {
    if (!ttsService.isSpeechSynthesisSupported()) {
      const errorMsg = 'Text-to-speech is not supported in this browser';
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
      
      // If translation is enabled and we have a target language
      if (options.autoTranslate && options.targetLanguage && finalLanguage !== options.targetLanguage) {
        try {
          finalText = await TranslationService.translate(text, finalLanguage, options.targetLanguage);
          finalLanguage = options.targetLanguage;
        } catch (translationError) {
          console.warn('Translation failed, using original text:', translationError);
        }
      }
      
      // Get appropriate voice for the language
      const voice = ttsService.getDefaultVoiceForLanguage(finalLanguage);
      
      // Speak the text with enhanced meeting context
      ttsService.speakForMeeting(finalText, {
        language: finalLanguage,
        voice: voice?.name
      });
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to speak text';
      setError(errorMsg);
      options.onError?.(errorMsg);
    }
  }, [ttsService, currentLanguage, options]);

  // Stop speaking
  const stop = useCallback(() => {
    ttsService.stop();
    setIsSpeaking(false);
    setIsPaused(false);
    options.onSpeechEnd?.();
  }, [ttsService, options]);

  // Pause speaking
  const pause = useCallback(() => {
    ttsService.pause();
    setIsSpeaking(false);
    setIsPaused(true);
  }, [ttsService]);

  // Resume speaking
  const resume = useCallback(() => {
    ttsService.resume();
    setIsSpeaking(true);
    setIsPaused(false);
  }, [ttsService]);

  // Change language
  const changeLanguage = useCallback((language: string) => {
    setCurrentLanguage(language);
  }, []);

  // Get voices by language
  const getVoicesByLanguage = useCallback((language: string) => {
    return ttsService.getVoicesByLanguage(language);
  }, [ttsService]);

  // Check if currently speaking
  const checkIsSpeaking = useCallback(() => {
    return ttsService.isSpeaking();
  }, [ttsService]);

  // Check if currently paused
  const checkIsPaused = useCallback(() => {
    return ttsService.isPaused();
  }, [ttsService]);

  return {
    // State
    isSupported,
    isSpeaking,
    isPaused,
    voices,
    currentLanguage,
    error,
    
    // Actions
    speak,
    stop,
    pause,
    resume,
    changeLanguage,
    
    // Utility methods
    getVoicesByLanguage,
    checkIsSpeaking,
    checkIsPaused
  };
};