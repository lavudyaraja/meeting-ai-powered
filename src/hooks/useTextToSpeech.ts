import { useState, useEffect, useCallback } from 'react';
import { TextToSpeechService, SpeechSynthesisConfig } from '@/nlp/TextToSpeechService';

interface UseTextToSpeechOptions {
  autoInit?: boolean;
  defaultConfig?: SpeechSynthesisConfig;
  onSpeak?: (text: string) => void;
  onStop?: () => void;
  onPause?: () => void;
  onResume?: () => void;
}

export const useTextToSpeech = (options: UseTextToSpeechOptions = {}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentConfig, setCurrentConfig] = useState<SpeechSynthesisConfig>(options.defaultConfig || {});
  
  const ttsService = TextToSpeechService.getInstance();

  // Initialize text-to-speech service
  useEffect(() => {
    setIsSupported(ttsService.isSpeechSynthesisSupported());
    
    if (options.autoInit !== false) {
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
    }
  }, []);

  // Speak text
  const speak = useCallback((text: string, config?: SpeechSynthesisConfig) => {
    if (!ttsService.isSpeechSynthesisSupported()) {
      console.error('Text-to-speech is not supported in this browser');
      return;
    }
    
    const finalConfig = { ...currentConfig, ...config };
    ttsService.speak(text, finalConfig);
    setIsSpeaking(true);
    setIsPaused(false);
    options.onSpeak?.(text);
  }, [currentConfig, options.onSpeak]);

  // Speak text with automatic language detection
  const speakWithAutoLanguage = useCallback((text: string, config?: SpeechSynthesisConfig) => {
    if (!ttsService.isSpeechSynthesisSupported()) {
      console.error('Text-to-speech is not supported in this browser');
      return;
    }
    
    const finalConfig = { ...currentConfig, ...config };
    ttsService.speakWithAutoLanguage(text, finalConfig);
    setIsSpeaking(true);
    setIsPaused(false);
    options.onSpeak?.(text);
  }, [currentConfig, options.onSpeak]);

  // Stop speaking
  const stop = useCallback(() => {
    ttsService.stop();
    setIsSpeaking(false);
    setIsPaused(false);
    options.onStop?.();
  }, [options.onStop]);

  // Pause speaking
  const pause = useCallback(() => {
    ttsService.pause();
    setIsSpeaking(false);
    setIsPaused(true);
    options.onPause?.();
  }, [options.onPause]);

  // Resume speaking
  const resume = useCallback(() => {
    ttsService.resume();
    setIsSpeaking(true);
    setIsPaused(false);
    options.onResume?.();
  }, [options.onResume]);

  // Update configuration
  const updateConfig = useCallback((config: SpeechSynthesisConfig) => {
    setCurrentConfig(prev => ({ ...prev, ...config }));
  }, []);

  // Get voices by language
  const getVoicesByLanguage = useCallback((language: string) => {
    return ttsService.getVoicesByLanguage(language);
  }, []);

  // Set voice by name
  const setVoice = useCallback((voiceName: string) => {
    updateConfig({ voice: voiceName });
  }, [updateConfig]);

  // Set language
  const setLanguage = useCallback((language: string) => {
    updateConfig({ language });
  }, [updateConfig]);

  // Set speech rate
  const setRate = useCallback((rate: number) => {
    updateConfig({ rate });
  }, [updateConfig]);

  // Set pitch
  const setPitch = useCallback((pitch: number) => {
    updateConfig({ pitch });
  }, [updateConfig]);

  // Set volume
  const setVolume = useCallback((volume: number) => {
    updateConfig({ volume });
  }, [updateConfig]);

  return {
    // State
    isSupported,
    isSpeaking,
    isPaused,
    voices,
    currentConfig,
    
    // Actions
    speak,
    speakWithAutoLanguage,
    stop,
    pause,
    resume,
    updateConfig,
    
    // Configuration methods
    setVoice,
    setLanguage,
    setRate,
    setPitch,
    setVolume,
    
    // Utility methods
    getVoicesByLanguage,
  };
};