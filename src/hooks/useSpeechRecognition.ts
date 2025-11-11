import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  SpeechRecognitionService, 
  TranscriptSegment,
  SpeechRecognitionConfig 
} from '@/utils/speechRecognition';

interface UseSpeechRecognitionOptions {
  autoStart?: boolean;
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  speakerId?: string;
  speakerName?: string;
  onTranscript?: (segment: TranscriptSegment) => void;
  onFinalTranscript?: (segment: TranscriptSegment) => void;
  onError?: (error: string) => void;
}

export const useSpeechRecognition = (options: UseSpeechRecognitionOptions = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptSegment[]>([]);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [currentLanguage, setCurrentLanguage] = useState(options.language || 'en-US');
  const [error, setError] = useState<string | null>(null);
  const [confidenceThreshold] = useState(0.7); // Minimum confidence threshold
  
  const serviceRef = useRef<SpeechRecognitionService | null>(null);

  // Initialize speech recognition service
  useEffect(() => {
    const config: SpeechRecognitionConfig = {
      continuous: options.continuous ?? true,
      interimResults: options.interimResults ?? true,
      language: options.language || 'en-US',
      autoRestart: true,
      onTranscript: (segment) => {
        // Only show interim results with reasonable confidence or final results
        if (segment.isFinal || segment.confidence >= confidenceThreshold) {
          if (segment.isFinal) {
            setTranscripts(prev => [...prev, segment]);
            setInterimTranscript('');
            options.onFinalTranscript?.(segment);
          } else {
            setInterimTranscript(segment.text);
          }
          options.onTranscript?.(segment);
        }
      },
      onFinalTranscript: (segment) => {
        // Apply confidence threshold for final transcripts as well
        if (segment.confidence >= confidenceThreshold) {
          options.onFinalTranscript?.(segment);
        }
      },
      onError: (errorMsg) => {
        setError(errorMsg);
        options.onError?.(errorMsg);
      },
      onStart: () => {
        setIsListening(true);
        setIsPaused(false);
        setError(null);
      },
      onEnd: () => {
        setIsListening(false);
      }
    };

    const service = new SpeechRecognitionService(config);
    serviceRef.current = service;
    
    setIsSupported(service.isSpeechRecognitionSupported());

    if (options.speakerId && options.speakerName) {
      service.setSpeaker(options.speakerId, options.speakerName);
    }

    // Auto-start if enabled
    if (options.autoStart && service.isSpeechRecognitionSupported()) {
      service.start();
    }

    return () => {
      service.destroy();
    };
  }, []); // Only run once on mount

  // Update speaker when it changes
  useEffect(() => {
    if (serviceRef.current && options.speakerId && options.speakerName) {
      serviceRef.current.setSpeaker(options.speakerId, options.speakerName);
    }
  }, [options.speakerId, options.speakerName]);

  // Start listening
  const startListening = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.start();
      setError(null);
    }
  }, []);

  // Stop listening
  const stopListening = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.stop();
    }
  }, []);

  // Pause listening
  const pauseListening = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  // Resume listening
  const resumeListening = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.resume();
      setIsPaused(false);
    }
  }, []);

  // Change language
  const changeLanguage = useCallback((languageCode: string) => {
    if (serviceRef.current) {
      serviceRef.current.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
    }
  }, []);

  // Clear transcripts
  const clearTranscripts = useCallback(() => {
    setTranscripts([]);
    setInterimTranscript('');
  }, []);

  // Get full transcript text
  const getFullTranscript = useCallback(() => {
    return transcripts.map(t => t.text).join(' ');
  }, [transcripts]);

  // Get transcripts by speaker
  const getTranscriptsBySpeaker = useCallback((speakerId: string) => {
    return transcripts.filter(t => t.speakerId === speakerId);
  }, [transcripts]);

  // Get transcripts with confidence filtering
  const getFilteredTranscripts = useCallback((minConfidence: number = confidenceThreshold) => {
    return transcripts.filter(t => t.confidence >= minConfidence);
  }, [transcripts, confidenceThreshold]);

  // Get full transcript text with confidence filtering
  const getFilteredFullTranscript = useCallback((minConfidence: number = confidenceThreshold) => {
    return transcripts
      .filter(t => t.confidence >= minConfidence)
      .map(t => t.text)
      .join(' ');
  }, [transcripts, confidenceThreshold]);

  // Get supported languages
  const getSupportedLanguages = useCallback(() => {
    if (serviceRef.current) {
      return serviceRef.current.getSupportedLanguages();
    }
    return [];
  }, []);

  // Export transcript as text
  const exportTranscript = useCallback((format: 'txt' | 'json' = 'txt') => {
    if (format === 'json') {
      return JSON.stringify(transcripts, null, 2);
    }
    
    return transcripts
      .map(t => {
        const time = new Date(t.timestamp).toLocaleTimeString();
        return `[${time}] ${t.speakerName || 'Speaker'}: ${t.text}`;
      })
      .join('\n');
  }, [transcripts]);

  // Download transcript
  const downloadTranscript = useCallback((filename: string = 'transcript', format: 'txt' | 'json' = 'txt') => {
    const content = exportTranscript(format);
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportTranscript]);

  return {
    // State
    isListening,
    isPaused,
    isSupported,
    transcripts,
    interimTranscript,
    currentLanguage,
    error,
    
    // Actions
    startListening,
    stopListening,
    pauseListening,
    resumeListening,
    changeLanguage,
    clearTranscripts,
    
    // Getters
    getFullTranscript,
    getFilteredTranscript: getFilteredFullTranscript,
    getTranscriptsBySpeaker,
    getFilteredTranscripts,
    getSupportedLanguages,
    exportTranscript,
    downloadTranscript,
  };
};