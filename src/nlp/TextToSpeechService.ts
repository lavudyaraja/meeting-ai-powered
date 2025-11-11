export interface SpeechSynthesisConfig {
  voice?: string;
  language?: string;
  rate?: number; // 0.1 to 10
  pitch?: number; // 0 to 2
  volume?: number; // 0 to 1
}

export class TextToSpeechService {
  private static instance: TextToSpeechService;
  private voices: SpeechSynthesisVoice[] = [];
  private isVoicesLoaded = false;
  private pendingSpeech: { text: string; config: SpeechSynthesisConfig }[] = [];

  private constructor() {
    this.loadVoices();
    // Chrome loads voices asynchronously, so we need to listen for the event
    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
        // Process any pending speech requests
        if (this.pendingSpeech.length > 0) {
          const pending = [...this.pendingSpeech];
          this.pendingSpeech = [];
          pending.forEach(({ text, config }) => {
            this.speak(text, config);
          });
        }
      };
    }
  }

  static getInstance(): TextToSpeechService {
    if (!TextToSpeechService.instance) {
      TextToSpeechService.instance = new TextToSpeechService();
    }
    return TextToSpeechService.instance;
  }

  private loadVoices() {
    if (typeof speechSynthesis !== 'undefined') {
      this.voices = speechSynthesis.getVoices();
      this.isVoicesLoaded = this.voices.length > 0;
    }
  }

  /**
   * Speak the given text with the specified configuration
   */
  speak(text: string, config: SpeechSynthesisConfig = {}): void {
    // Check if browser supports speech synthesis
    if (!this.isSpeechSynthesisSupported()) {
      console.error('Speech synthesis is not supported in this browser');
      return;
    }

    // If voices aren't loaded yet, queue the speech
    if (!this.isVoicesLoaded) {
      this.pendingSpeech.push({ text, config });
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply configuration with better defaults for meeting context
    utterance.rate = config.rate ?? 1.0; // Slightly faster for better comprehension
    utterance.pitch = config.pitch ?? 1.0;
    utterance.volume = config.volume ?? 1.0;
    
    // Set language if provided
    if (config.language) {
      utterance.lang = config.language;
    }
    
    // Find and set voice if specified
    if (config.voice) {
      const voice = this.voices.find(v => v.name === config.voice);
      if (voice) {
        utterance.voice = voice;
      }
    } else if (config.language) {
      // If no specific voice but language is provided, find the best voice for that language
      const voice = this.getDefaultVoiceForLanguage(config.language);
      if (voice) {
        utterance.voice = voice;
      }
    }
    
    // Add event listeners for better control
    utterance.onstart = () => {
      console.log('Speech started');
    };
    
    utterance.onend = () => {
      console.log('Speech ended');
    };
    
    utterance.onerror = (event) => {
      console.error('Speech error:', event);
    };
    
    // Try to resume speech synthesis if it's in a bad state
    if (typeof speechSynthesis !== 'undefined') {
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
      }
    }
    
    // Speak the utterance
    speechSynthesis.speak(utterance);
  }

  /**
   * Stop all ongoing speech
   */
  stop(): void {
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
  }

  /**
   * Pause current speech
   */
  pause(): void {
    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.speaking) {
      speechSynthesis.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.paused) {
      speechSynthesis.resume();
    }
  }

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    return [...this.voices];
  }

  /**
   * Get voices filtered by language
   */
  getVoicesByLanguage(language: string): SpeechSynthesisVoice[] {
    return this.voices.filter(voice => 
      voice.lang.startsWith(language) || language.startsWith(voice.lang.split('-')[0])
    );
  }

  /**
   * Get the default voice for a language
   */
  getDefaultVoiceForLanguage(language: string): SpeechSynthesisVoice | undefined {
    const langVoices = this.getVoicesByLanguage(language);
    if (langVoices.length > 0) {
      // Prefer local voices first, then default voices
      const localVoice = langVoices.find(v => v.localService);
      return localVoice || langVoices[0];
    }
    return undefined;
  }

  /**
   * Check if speech synthesis is supported
   */
  isSpeechSynthesisSupported(): boolean {
    return typeof speechSynthesis !== 'undefined';
  }

  /**
   * Check if speech is currently playing
   */
  isSpeaking(): boolean {
    return typeof speechSynthesis !== 'undefined' && speechSynthesis.speaking;
  }

  /**
   * Check if speech is currently paused
   */
  isPaused(): boolean {
    return typeof speechSynthesis !== 'undefined' && speechSynthesis.paused;
  }

  /**
   * Get supported languages from available voices
   */
  getSupportedLanguages(): string[] {
    const languages = new Set<string>();
    this.voices.forEach(voice => {
      languages.add(voice.lang);
    });
    return Array.from(languages);
  }

  /**
   * Speak with automatic language detection and voice selection
   */
  async speakWithAutoLanguage(text: string, config: SpeechSynthesisConfig = {}): Promise<void> {
    // For simplicity, we'll use a basic language detection approach
    // In a production app, you might want to use a more sophisticated language detection library
    let language = config.language;
    
    if (!language) {
      // Basic language detection based on text content
      if (/[\u4E00-\u9FFF]/.test(text)) language = 'zh-CN';
      else if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) language = 'ja-JP';
      else if (/[\uAC00-\uD7AF]/.test(text)) language = 'ko-KR';
      else if (/[\u0600-\u06FF]/.test(text)) language = 'ar-SA';
      else if (/[\u0900-\u097F]/.test(text)) language = 'hi-IN';
      else language = navigator.language || 'en-US';
    }
    
    const voice = this.getDefaultVoiceForLanguage(language);
    
    this.speak(text, {
      ...config,
      language,
      voice: voice?.name
    });
  }

  /**
   * Speak with enhanced clarity for meeting context
   */
  speakForMeeting(text: string, config: SpeechSynthesisConfig = {}): void {
    // Enhanced configuration for meeting context
    const enhancedConfig: SpeechSynthesisConfig = {
      rate: config.rate ?? 1.0, // Clear speaking rate
      pitch: config.pitch ?? 1.0,
      volume: config.volume ?? 1.0,
      language: config.language ?? 'en-US',
      ...config
    };
    
    this.speak(text, enhancedConfig);
  }
}