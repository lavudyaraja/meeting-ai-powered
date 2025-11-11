import { useState, useCallback } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useTextToSpeech } from './useTextToSpeech';
import { TranslationService } from '@/nlp/TranslationService';

interface VoiceInteractionOptions {
  // Speech recognition options
  autoStartRecognition?: boolean;
  continuousRecognition?: boolean;
  interimResults?: boolean;
  recognitionLanguage?: string;
  
  // Text-to-speech options
  autoInitSpeech?: boolean;
  defaultSpeechConfig?: any;
  
  // Translation options
  enableTranslation?: boolean;
  defaultTargetLanguage?: string;
  
  // Callbacks
  onUserSpeech?: (text: string) => void;
  onAssistantResponse?: (text: string) => void;
  onTranslation?: (original: string, translated: string, sourceLang: string, targetLang: string) => void;
}

export const useVoiceInteraction = (options: VoiceInteractionOptions = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastUserSpeech, setLastUserSpeech] = useState<string>('');
  const [lastAssistantResponse, setLastAssistantResponse] = useState<string>('');
  
  // Use speech recognition hook
  const {
    isListening: isRecognizing,
    isSupported: isRecognitionSupported,
    transcripts,
    interimTranscript,
    currentLanguage: recognitionLanguage,
    error: recognitionError,
    startListening,
    stopListening,
    pauseListening,
    resumeListening,
    changeLanguage: changeRecognitionLanguage,
    clearTranscripts,
    getFullTranscript
  } = useSpeechRecognition({
    autoStart: options.autoStartRecognition,
    continuous: options.continuousRecognition,
    interimResults: options.interimResults,
    language: options.recognitionLanguage,
    onFinalTranscript: (segment) => {
      setLastUserSpeech(segment.text);
      options.onUserSpeech?.(segment.text);
    }
  });
  
  // Use text-to-speech hook
  const {
    isSupported: isSpeechSupported,
    isSpeaking,
    isPaused: isSpeechPaused,
    speak,
    speakWithAutoLanguage,
    stop: stopSpeaking,
    pause: pauseSpeaking,
    resume: resumeSpeaking,
    updateConfig: updateSpeechConfig
  } = useTextToSpeech({
    autoInit: options.autoInitSpeech,
    defaultConfig: options.defaultSpeechConfig,
    onSpeak: (text) => {
      setLastAssistantResponse(text);
      options.onAssistantResponse?.(text);
    }
  });
  
  // Handle user speech with optional translation
  const handleUserSpeech = useCallback(async (text: string) => {
    setIsProcessing(true);
    
    try {
      // If translation is enabled and we have a target language
      if (options.enableTranslation && options.defaultTargetLanguage) {
        // Detect the source language
        const sourceLanguage = await TranslationService.detectLanguage(text);
        const targetLanguage = options.defaultTargetLanguage;
        
        // Translate if languages are different
        if (sourceLanguage !== targetLanguage) {
          const translatedText = await TranslationService.translate(text, sourceLanguage, targetLanguage);
          options.onTranslation?.(text, translatedText, sourceLanguage, targetLanguage);
          return translatedText;
        }
      }
      
      return text;
    } catch (error) {
      console.error('Error processing user speech:', error);
      return text;
    } finally {
      setIsProcessing(false);
    }
  }, [options.enableTranslation, options.defaultTargetLanguage, options.onTranslation]);
  
  // Speak response with optional translation
  const speakResponse = useCallback(async (text: string) => {
    setIsProcessing(true);
    
    try {
      // If translation is enabled and we have a target language
      if (options.enableTranslation && options.defaultTargetLanguage) {
        // Detect the source language
        const sourceLanguage = await TranslationService.detectLanguage(text);
        const targetLanguage = options.defaultTargetLanguage;
        
        // Translate if languages are different
        if (sourceLanguage !== targetLanguage) {
          const translatedText = await TranslationService.translate(text, sourceLanguage, targetLanguage);
          options.onTranslation?.(text, translatedText, sourceLanguage, targetLanguage);
          speakWithAutoLanguage(translatedText);
          return;
        }
      }
      
      // Speak the original text
      speakWithAutoLanguage(text);
    } catch (error) {
      console.error('Error processing assistant response:', error);
      // Fallback to speaking original text
      speakWithAutoLanguage(text);
    } finally {
      setIsProcessing(false);
    }
  }, [options.enableTranslation, options.defaultTargetLanguage, options.onTranslation, speakWithAutoLanguage]);
  
  // Toggle speech recognition
  const toggleRecognition = useCallback(() => {
    if (isRecognizing) {
      stopListening();
    } else {
      startListening();
    }
  }, [isRecognizing, startListening, stopListening]);
  
  // Combined language change (for both recognition and speech)
  const changeLanguage = useCallback((languageCode: string) => {
    changeRecognitionLanguage(languageCode);
    // Update speech config to use the same language
    updateSpeechConfig({ language: languageCode });
  }, [changeRecognitionLanguage, updateSpeechConfig]);
  
  return {
    // Voice interaction state
    isProcessing,
    lastUserSpeech,
    lastAssistantResponse,
    
    // Speech recognition
    isRecognizing,
    isRecognitionSupported,
    transcripts,
    interimTranscript,
    recognitionLanguage,
    recognitionError,
    startListening,
    stopListening,
    pauseListening,
    resumeListening,
    clearTranscripts,
    getFullTranscript,
    
    // Text-to-speech
    isSpeaking,
    isSpeechSupported,
    isSpeechPaused,
    speak,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    updateSpeechConfig,
    
    // Combined functions
    handleUserSpeech,
    speakResponse,
    toggleRecognition,
    changeLanguage
  };
};