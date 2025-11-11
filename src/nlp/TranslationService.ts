interface LanguageDetectionResponse {
  language: string;
  confidence: number;
}

interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export class TranslationService {
  private static readonly API_BASE_URL = 'https://libretranslate.com/translate';
  
  // Language codes mapping
  private static readonly LANGUAGE_CODES: Record<string, string> = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh': 'Chinese',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'bn': 'Bengali',
    'pa': 'Punjabi'
  };

  /**
   * Detects the language of the given text
   */
  static async detectLanguage(text: string): Promise<string> {
    try {
      // Using browser's built-in language detection or a simple heuristic
      const userLang = navigator.language.split('-')[0];
      
      // Simple character-based detection
      if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
      if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja';
      if (/[\uAC00-\uD7AF]/.test(text)) return 'ko';
      if (/[\u0600-\u06FF]/.test(text)) return 'ar';
      if (/[\u0900-\u097F]/.test(text)) return 'hi';
      if (/[\u0980-\u09FF]/.test(text)) return 'bn';
      
      // Fallback to user's browser language
      return userLang in this.LANGUAGE_CODES ? userLang : 'en';
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en';
    }
  }

  /**
   * Translates text from source language to target language
   */
  static async translate(
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<string> {
    // If source and target are the same, return original text
    if (sourceLanguage === targetLanguage) {
      return text;
    }

    try {
      // Using LibreTranslate API (free and open-source)
      const response = await fetch(this.API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLanguage,
          target: targetLanguage,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      return data.translatedText || text;
    } catch (error) {
      console.error('Translation error:', error);
      
      // Fallback: Return original text with language indicator
      return `[${sourceLanguage}→${targetLanguage}] ${text}`;
    }
  }

  /**
   * Translates text with automatic language detection
   */
  static async translateAuto(
    text: string,
    targetLanguage: string
  ): Promise<string> {
    const sourceLanguage = await this.detectLanguage(text);
    return this.translate(text, sourceLanguage, targetLanguage);
  }

  /**
   * Gets the language name from language code
   */
  static getLanguageName(code: string): string {
    return this.LANGUAGE_CODES[code] || code;
  }

  /**
   * Gets all supported languages
   */
  static getSupportedLanguages(): Record<string, string> {
    return { ...this.LANGUAGE_CODES };
  }

  /**
   * Batch translate multiple messages
   */
  static async translateBatch(
    messages: { text: string; sourceLang: string }[],
    targetLanguage: string
  ): Promise<string[]> {
    return Promise.all(
      messages.map(msg => this.translate(msg.text, msg.sourceLang, targetLanguage))
    );
  }
}