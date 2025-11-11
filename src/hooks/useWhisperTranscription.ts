import { useState, useCallback, useRef } from 'react';
import { WhisperService, WhisperConfig } from '@/nlp/WhisperService';
import { TranscriptSegment } from '@/utils/speechRecognition';

interface UseWhisperTranscriptionOptions {
  apiKey: string;
  autoStart?: boolean;
  language?: string;
  onTranscript?: (segments: TranscriptSegment[]) => void;
  onError?: (error: string) => void;
}

export const useWhisperTranscription = (options: UseWhisperTranscriptionOptions) => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [transcripts, setTranscripts] = useState<TranscriptSegment[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const serviceRef = useRef<WhisperService | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize Whisper service
  const initializeService = useCallback(() => {
    try {
      const config: WhisperConfig = {
        apiKey: options.apiKey,
        language: options.language || 'en',
        model: 'whisper-1'
      };
      
      serviceRef.current = new WhisperService(config);
      setIsSupported(true);
    } catch (err) {
      console.error('Failed to initialize Whisper service:', err);
      setIsSupported(false);
      setError('Failed to initialize transcription service');
    }
  }, [options.apiKey, options.language]);

  // Start transcription from MediaStream
  const startTranscription = useCallback(async (stream: MediaStream) => {
    if (!serviceRef.current) {
      initializeService();
      if (!serviceRef.current) {
        setError('Transcription service not initialized');
        return;
      }
    }

    try {
      setIsTranscribing(true);
      setError(null);
      streamRef.current = stream;

      // Transcribe audio from stream
      const segments = await serviceRef.current.transcribeStream(stream, 5000);
      
      setTranscripts(prev => [...prev, ...segments]);
      options.onTranscript?.(segments);
    } catch (err: any) {
      console.error('Transcription error:', err);
      setError(err.message || 'Failed to transcribe audio');
      options.onError?.(err.message || 'Failed to transcribe audio');
    } finally {
      setIsTranscribing(false);
    }
  }, [initializeService, options]);

  // Transcribe audio blob directly
  const transcribeAudio = useCallback(async (audioBlob: Blob) => {
    if (!serviceRef.current) {
      initializeService();
      if (!serviceRef.current) {
        setError('Transcription service not initialized');
        throw new Error('Transcription service not initialized');
      }
    }

    try {
      setIsTranscribing(true);
      setError(null);

      const segments = await serviceRef.current.transcribeAudio(audioBlob);
      
      setTranscripts(prev => [...prev, ...segments]);
      options.onTranscript?.(segments);
      
      return segments;
    } catch (err: any) {
      console.error('Transcription error:', err);
      setError(err.message || 'Failed to transcribe audio');
      options.onError?.(err.message || 'Failed to transcribe audio');
      throw err;
    } finally {
      setIsTranscribing(false);
    }
  }, [initializeService, options]);

  // Update configuration
  const updateConfig = useCallback((config: Partial<WhisperConfig>) => {
    if (serviceRef.current) {
      serviceRef.current.updateConfig(config);
    }
  }, []);

  // Clear transcripts
  const clearTranscripts = useCallback(() => {
    setTranscripts([]);
  }, []);

  // Get full transcript text
  const getFullTranscript = useCallback(() => {
    return transcripts.map(t => t.text).join(' ');
  }, [transcripts]);

  return {
    // State
    isTranscribing,
    isSupported,
    transcripts,
    error,
    
    // Actions
    startTranscription,
    transcribeAudio,
    updateConfig,
    clearTranscripts,
    getFullTranscript,
    initializeService
  };
};