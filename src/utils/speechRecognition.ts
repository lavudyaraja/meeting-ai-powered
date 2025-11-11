export interface TranscriptSegment {
  id: string;
  text: string;
  timestamp: string;
  isFinal: boolean;
  confidence: number;
  speakerId?: string;
  speakerName?: string;
  language?: string;
}

export interface SpeechRecognitionConfig {
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  language?: string;
  autoRestart?: boolean;
  onTranscript?: (segment: TranscriptSegment) => void;
  onFinalTranscript?: (segment: TranscriptSegment) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export class SpeechRecognitionService {
  private recognition: any;
  private isListening: boolean = false;
  private isPaused: boolean = false;
  private config: SpeechRecognitionConfig;
  private restartAttempts: number = 0;
  private maxRestartAttempts: number = 5;
  private restartTimeout: any = null;
  private currentSpeakerId: string = '';
  private currentSpeakerName: string = 'Unknown Speaker';
  private silenceTimeout: any = null;
  private lastTranscriptTime: number = 0;

  constructor(config: SpeechRecognitionConfig) {
    this.config = {
      continuous: true,
      interimResults: true,
      maxAlternatives: 1,
      language: navigator.language || 'en-US',
      autoRestart: true,
      ...config
    };

    this.initializeRecognition();
  }

  private initializeRecognition() {
    // Check if browser supports speech recognition
    if (!this.isSpeechRecognitionSupported()) {
      console.error('Speech recognition is not supported in this browser');
      this.config.onError?.('Speech recognition is not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || 
                               (window as any).webkitSpeechRecognition;
    
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.maxAlternatives = this.config.maxAlternatives;
    this.recognition.lang = this.config.language;

    // Handle recognition results
    this.recognition.onresult = (event: any) => {
      this.handleResult(event);
    };

    // Handle recognition errors
    this.recognition.onerror = (event: any) => {
      this.handleError(event);
    };

    // Handle recognition start
    this.recognition.onstart = () => {
      this.isListening = true;
      this.isPaused = false;
      this.restartAttempts = 0;
      this.config.onStart?.();
      console.log('Speech recognition started');
    };

    // Handle recognition end
    this.recognition.onend = () => {
      this.isListening = false;
      this.config.onEnd?.();
      console.log('Speech recognition ended');

      // Auto-restart if enabled and not manually stopped
      if (this.config.autoRestart && !this.isPaused && this.restartAttempts < this.maxRestartAttempts) {
        this.restartAttempts++;
        this.restartTimeout = setTimeout(() => {
          console.log(`Auto-restarting speech recognition (attempt ${this.restartAttempts})`);
          this.start();
        }, 1000);
      }
    };

    // Handle audio start
    this.recognition.onaudiostart = () => {
      console.log('Audio capturing started');
    };

    // Handle audio end
    this.recognition.onaudioend = () => {
      console.log('Audio capturing ended');
    };

    // Handle sound start
    this.recognition.onsoundstart = () => {
      this.lastTranscriptTime = Date.now();
      this.clearSilenceTimeout();
    };

    // Handle sound end
    this.recognition.onsoundend = () => {
      this.startSilenceDetection();
    };

    // Handle speech start
    this.recognition.onspeechstart = () => {
      console.log('Speech detected');
    };

    // Handle speech end
    this.recognition.onspeechend = () => {
      console.log('Speech ended');
    };
  }

  private handleResult(event: any) {
    const results = event.results;
    const resultIndex = event.resultIndex;
    
    for (let i = resultIndex; i < results.length; i++) {
      const result = results[i];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence || 0;
      const isFinal = result.isFinal;

      const segment: TranscriptSegment = {
        id: `transcript-${Date.now()}-${i}`,
        text: transcript.trim(),
        timestamp: new Date().toISOString(),
        isFinal,
        confidence,
        speakerId: this.currentSpeakerId,
        speakerName: this.currentSpeakerName,
        language: this.config.language
      };

      // Only emit non-empty transcripts
      if (segment.text) {
        this.config.onTranscript?.(segment);

        if (isFinal) {
          this.config.onFinalTranscript?.(segment);
          this.lastTranscriptTime = Date.now();
        }
      }
    }
  }

  private handleError(event: any) {
    const error = event.error;
    console.error('Speech recognition error:', error);

    switch (error) {
      case 'no-speech':
        console.warn('No speech detected');
        break;
      case 'audio-capture':
        this.config.onError?.('Microphone not accessible. Please check permissions.');
        break;
      case 'not-allowed':
        this.config.onError?.('Microphone permission denied. Please allow microphone access.');
        this.isPaused = true; // Don't auto-restart
        break;
      case 'network':
        this.config.onError?.('Network error occurred during speech recognition.');
        break;
      case 'aborted':
        console.warn('Speech recognition aborted');
        break;
      case 'service-not-allowed':
        this.config.onError?.('Speech recognition service not allowed.');
        this.isPaused = true;
        break;
      default:
        this.config.onError?.(`Speech recognition error: ${error}`);
    }
  }

  private startSilenceDetection() {
    this.clearSilenceTimeout();
    
    // Detect long silence (no speech for 3 seconds)
    this.silenceTimeout = setTimeout(() => {
      const timeSinceLastTranscript = Date.now() - this.lastTranscriptTime;
      if (timeSinceLastTranscript > 5000 && this.isListening) {
        console.log('Long silence detected, keeping recognition active...');
      }
    }, 3000);
  }

  private clearSilenceTimeout() {
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
      this.silenceTimeout = null;
    }
  }

  // Public Methods

  start() {
    if (!this.recognition) {
      console.error('Speech recognition not initialized');
      return;
    }

    if (this.isListening) {
      console.warn('Speech recognition is already running');
      return;
    }

    try {
      this.isPaused = false;
      this.recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      this.config.onError?.('Failed to start speech recognition');
    }
  }

  stop() {
    if (!this.recognition) {
      return;
    }

    this.isPaused = true;
    this.clearSilenceTimeout();
    
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }

    if (this.isListening) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  }

  pause() {
    this.isPaused = true;
    this.stop();
  }

  resume() {
    this.isPaused = false;
    this.start();
  }

  changeLanguage(languageCode: string) {
    if (!this.recognition) {
      return;
    }

    const wasListening = this.isListening;
    
    if (wasListening) {
      this.stop();
    }

    this.config.language = languageCode;
    this.recognition.lang = languageCode;

    if (wasListening) {
      setTimeout(() => {
        this.start();
      }, 500);
    }
  }

  setSpeaker(speakerId: string, speakerName: string) {
    this.currentSpeakerId = speakerId;
    this.currentSpeakerName = speakerName;
  }

  updateConfig(config: Partial<SpeechRecognitionConfig>) {
    this.config = { ...this.config, ...config };
    
    if (this.recognition) {
      if (config.continuous !== undefined) {
        this.recognition.continuous = config.continuous;
      }
      if (config.interimResults !== undefined) {
        this.recognition.interimResults = config.interimResults;
      }
      if (config.maxAlternatives !== undefined) {
        this.recognition.maxAlternatives = config.maxAlternatives;
      }
      if (config.language !== undefined) {
        this.changeLanguage(config.language);
      }
    }
  }

  isSpeechRecognitionSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  getIsPaused(): boolean {
    return this.isPaused;
  }

  getCurrentLanguage(): string {
    return this.config.language || 'en-US';
  }

  getSupportedLanguages(): string[] {
    // Common languages supported by Web Speech API
    return [
      'en-US', 'en-GB', 'en-AU', 'en-CA', 'en-IN', 'en-NZ',
      'es-ES', 'es-MX', 'es-AR',
      'fr-FR', 'fr-CA',
      'de-DE',
      'it-IT',
      'pt-BR', 'pt-PT',
      'ru-RU',
      'zh-CN', 'zh-TW', 'zh-HK',
      'ja-JP',
      'ko-KR',
      'hi-IN',
      'ar-SA',
      'nl-NL',
      'tr-TR',
      'pl-PL',
      'sv-SE',
      'da-DK',
      'no-NO',
      'fi-FI'
    ];
  }

  destroy() {
    this.stop();
    this.clearSilenceTimeout();
    
    if (this.recognition) {
      this.recognition.onresult = null;
      this.recognition.onerror = null;
      this.recognition.onstart = null;
      this.recognition.onend = null;
      this.recognition = null;
    }
  }
}

// Utility function to format language code to readable name
export function getLanguageName(code: string): string {
  const languageNames: { [key: string]: string } = {
    'en-US': 'English (US)',
    'en-GB': 'English (UK)',
    'en-AU': 'English (Australia)',
    'en-CA': 'English (Canada)',
    'en-IN': 'English (India)',
    'es-ES': 'Spanish (Spain)',
    'es-MX': 'Spanish (Mexico)',
    'fr-FR': 'French (France)',
    'de-DE': 'German',
    'it-IT': 'Italian',
    'pt-BR': 'Portuguese (Brazil)',
    'pt-PT': 'Portuguese (Portugal)',
    'ru-RU': 'Russian',
    'zh-CN': 'Chinese (Simplified)',
    'zh-TW': 'Chinese (Traditional)',
    'ja-JP': 'Japanese',
    'ko-KR': 'Korean',
    'hi-IN': 'Hindi',
    'ar-SA': 'Arabic',
    'nl-NL': 'Dutch',
    'tr-TR': 'Turkish',
    'pl-PL': 'Polish',
    'sv-SE': 'Swedish',
    'da-DK': 'Danish',
    'no-NO': 'Norwegian',
    'fi-FI': 'Finnish'
  };

  return languageNames[code] || code;
}