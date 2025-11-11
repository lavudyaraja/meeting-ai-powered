import { TranscriptSegment } from "@/utils/speechRecognition";

export interface WhisperConfig {
  apiKey: string;
  model?: string;
  language?: string;
  prompt?: string;
  response_format?: string;
  temperature?: number;
  timestamp_granularities?: string[];
}

export class WhisperService {
  private static readonly API_BASE_URL = 'https://api.openai.com/v1/audio/transcriptions';
  private config: WhisperConfig;

  constructor(config: WhisperConfig) {
    this.config = {
      model: 'whisper-1',
      language: 'en',
      response_format: 'verbose_json',
      temperature: 0,
      timestamp_granularities: ['segment'],
      ...config
    };
  }

  /**
   * Transcribe audio file using Whisper API
   */
  async transcribeAudio(audioBlob: Blob): Promise<TranscriptSegment[]> {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', this.config.model || 'whisper-1');
      formData.append('language', this.config.language || 'en');
      formData.append('response_format', this.config.response_format || 'verbose_json');
      formData.append('temperature', String(this.config.temperature || 0));
      
      if (this.config.timestamp_granularities) {
        formData.append('timestamp_granularities[]', this.config.timestamp_granularities.join(','));
      }
      
      if (this.config.prompt) {
        formData.append('prompt', this.config.prompt);
      }

      const response = await fetch(WhisperService.API_BASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Whisper API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return this.parseWhisperResponse(data);
    } catch (error) {
      console.error('Whisper transcription error:', error);
      throw error;
    }
  }

  /**
   * Parse Whisper API response into TranscriptSegment format
   */
  private parseWhisperResponse(data: any): TranscriptSegment[] {
    if (!data.segments) {
      return [{
        id: 'transcript-0',
        text: data.text || '',
        timestamp: new Date().toISOString(),
        isFinal: true,
        confidence: 0.95, // Default confidence
        language: this.config.language
      }];
    }

    return data.segments.map((segment: any, index: number) => ({
      id: `transcript-${segment.id || index}`,
      text: segment.text || '',
      timestamp: new Date().toISOString(),
      isFinal: true,
      confidence: segment.avg_logprob ? Math.exp(segment.avg_logprob) : 0.95,
      language: this.config.language,
      speakerId: segment.speaker || undefined
    }));
  }

  /**
   * Transcribe from MediaStream by recording and sending to Whisper
   */
  async transcribeStream(stream: MediaStream, duration: number = 5000): Promise<TranscriptSegment[]> {
    try {
      // Record audio from stream
      const audioBlob = await this.recordAudioFromStream(stream, duration);
      return await this.transcribeAudio(audioBlob);
    } catch (error) {
      console.error('Stream transcription error:', error);
      throw error;
    }
  }

  /**
   * Record audio from MediaStream for specified duration
   */
  private async recordAudioFromStream(stream: MediaStream, duration: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          resolve(audioBlob);
        };

        mediaRecorder.onerror = (event) => {
          reject(new Error(`MediaRecorder error: ${event}`));
        };

        mediaRecorder.start();
        
        // Stop recording after specified duration
        setTimeout(() => {
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
          }
        }, duration);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<WhisperConfig>) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): WhisperConfig {
    return { ...this.config };
  }
}