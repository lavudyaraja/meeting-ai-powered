import { supabase } from "@/integrations/supabase/client";

// Enhanced WebRTC configuration with better audio/video quality
const configuration: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ],
  iceCandidatePoolSize: 10,
  iceTransportPolicy: 'all',
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require'
};

// Enhanced media constraints for better face detection and audio quality
export const getMediaConstraints = (quality: 'low' | 'medium' | 'high' = 'high') => {
  const constraints = {
    low: {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48000,
        channelCount: 2,
        latency: 0
      },
      video: {
        facingMode: 'user',
        width: { ideal: 640, max: 640 },
        height: { ideal: 480, max: 480 },
        frameRate: { ideal: 30, max: 30 },
        aspectRatio: { ideal: 1.777 }
      }
    },
    medium: {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48000,
        channelCount: 2,
        latency: 0
      },
      video: {
        facingMode: 'user',
        width: { ideal: 1280, max: 1280 },
        height: { ideal: 720, max: 720 },
        frameRate: { ideal: 30, max: 30 },
        aspectRatio: { ideal: 1.777 }
      }
    },
    high: {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48000,
        channelCount: 2,
        latency: 0
      },
      video: {
        facingMode: 'user',
        width: { ideal: 1920, max: 1920 },
        height: { ideal: 1080, max: 1080 },
        frameRate: { ideal: 30, max: 30 },
        aspectRatio: { ideal: 1.777 }
      }
    }
  };
  
  return constraints[quality];
};

// Get user media with enhanced error handling and constraints
export const getUserMedia = async (quality: 'low' | 'medium' | 'high' = 'high') => {
  try {
    const constraints = getMediaConstraints(quality);
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (error) {
    console.error('Error accessing media devices:', error);
    throw error;
  }
};

// Enhanced peer connection with optimized settings
export const createPeerConnection = (localStream: MediaStream | null) => {
  const peerConnection = new RTCPeerConnection(configuration);
  
  // Add local stream tracks with proper settings
  if (localStream) {
    localStream.getTracks().forEach(track => {
      const sender = peerConnection.addTrack(track, localStream);
      
      // Configure encoding parameters for better quality
      if (track.kind === 'video') {
        const parameters = sender.getParameters();
        if (!parameters.encodings) {
          parameters.encodings = [{}];
        }
        // Set adaptive bitrate for video
        parameters.encodings[0].maxBitrate = 2500000; // 2.5 Mbps
        parameters.encodings[0].maxFramerate = 30;
        parameters.encodings[0].scaleResolutionDownBy = 1.0;
        sender.setParameters(parameters);
      }
      
      if (track.kind === 'audio') {
        const parameters = sender.getParameters();
        if (!parameters.encodings) {
          parameters.encodings = [{}];
        }
        parameters.encodings[0].maxBitrate = 128000; // 128 kbps
        sender.setParameters(parameters);
      }
    });
  }
  
  // Connection state monitoring
  peerConnection.onconnectionstatechange = () => {
    console.log('Connection state:', peerConnection.connectionState);
  };
  
  peerConnection.oniceconnectionstatechange = () => {
    console.log('ICE connection state:', peerConnection.iceConnectionState);
  };
  
  // Handle negotiation needed
  peerConnection.onnegotiationneeded = async () => {
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
    } catch (error) {
      console.error('Error during negotiation:', error);
    }
  };
  
  return peerConnection;
};

// Enhanced offer creation with better settings
export const createOffer = async (peerConnection: RTCPeerConnection) => {
  const offer = await peerConnection.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  });
  
  await peerConnection.setLocalDescription(offer);
  return offer;
};

// Enhanced answer creation
export const createAnswer = async (peerConnection: RTCPeerConnection, offer: RTCSessionDescriptionInit) => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  });
  await peerConnection.setLocalDescription(answer);
  return answer;
};

// Handle ICE candidate with error handling
export const handleIceCandidate = async (peerConnection: RTCPeerConnection, candidate: RTCIceCandidate) => {
  try {
    if (peerConnection.remoteDescription) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } else {
      console.warn('Remote description not set, queuing ICE candidate');
    }
  } catch (error) {
    console.error('Error adding ICE candidate:', error);
  }
};

// Handle incoming tracks with audio/video separation
export const handleTrackEvent = (
  peerConnection: RTCPeerConnection, 
  onTrack: (event: RTCTrackEvent) => void
) => {
  peerConnection.ontrack = (event) => {
    console.log('Received remote track:', event.track.kind);
    
    // Ensure audio tracks are properly configured
    if (event.track.kind === 'audio') {
      event.track.enabled = true;
    }
    
    onTrack(event);
  };
};

// Send signaling data through Supabase
export const sendSignalingData = async (
  meetingId: string, 
  targetUserId: string, 
  data: any, 
  currentUserId: string, 
  currentUserName: string
) => {
  try {
    const { error } = await supabase.from('meeting_messages').insert({
      meeting_id: meetingId,
      user_id: currentUserId,
      user_name: currentUserName,
      message: JSON.stringify({
        type: 'signal',
        target: targetUserId,
        data: data,
        from: currentUserId,
        timestamp: Date.now()
      }),
      timestamp: new Date().toISOString()
    });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error sending signaling data:', error);
    throw error;
  }
};

// Listen for signaling data
export const listenForSignalingData = (
  meetingId: string, 
  userId: string, 
  callback: (data: any, from: string) => void
) => {
  const channel = supabase
    .channel(`signaling-${meetingId}-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'meeting_messages',
        filter: `meeting_id=eq.${meetingId}`
      },
      (payload) => {
        const message = payload.new;
        try {
          const parsedMessage = JSON.parse(message.message);
          if (parsedMessage.type === 'signal' && parsedMessage.target === userId) {
            callback(parsedMessage.data, parsedMessage.from);
          }
        } catch (e) {
          // Not a signaling message
        }
      }
    )
    .subscribe();

  return channel;
};

// ============================================
// AI-POWERED MEETING FEATURES
// ============================================

// Real-time speech-to-text transcription
export class MeetingTranscription {
  private recognition: any;
  private transcript: string = '';
  private onTranscriptCallback: (text: string) => void;
  
  constructor(language: string = 'en-US', onTranscript: (text: string) => void) {
    this.onTranscriptCallback = onTranscript;
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = language;
      this.recognition.maxAlternatives = 1;
      this.recognition.interimResults = true;
      
      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          this.transcript += finalTranscript;
          this.onTranscriptCallback(this.transcript);
        }
      };
      
      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };
    }
  }
  
  start() {
    if (this.recognition) {
      this.recognition.start();
    }
  }
  
  stop() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
  
  getTranscript() {
    return this.transcript;
  }
  
  clearTranscript() {
    this.transcript = '';
  }
}

// Save meeting transcript to Supabase
export const saveMeetingTranscript = async (
  meetingId: string,
  transcript: string,
  userId: string,
  userName: string
) => {
  try {
    // Use meeting_summaries table which has a transcript field
    const { error } = await supabase.from('meeting_summaries').insert({
      meeting_id: meetingId,
      transcript: transcript,
      summary: '', // Empty summary for now
      created_at: new Date().toISOString()
    });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error saving transcript:', error);
  }
};

// Generate AI meeting summary using LibreTranslate API as proxy
export const generateMeetingSummary = async (transcript: string): Promise<string> => {
  try {
    // Simple extractive summarization
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const keywords = extractKeywords(transcript);
    
    // Score sentences based on keyword frequency
    const scoredSentences = sentences.map(sentence => {
      let score = 0;
      keywords.forEach(keyword => {
        if (sentence.toLowerCase().includes(keyword.toLowerCase())) {
          score++;
        }
      });
      return { sentence: sentence.trim(), score };
    });
    
    // Get top 5 sentences
    const topSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => s.sentence);
    
    const summary = `Meeting Summary:\n\n${topSentences.join('. ')}.`;
    return summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    return 'Unable to generate summary';
  }
};

// Extract keywords from text
const extractKeywords = (text: string): string[] => {
  const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by']);
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const wordFreq: { [key: string]: number } = {};
  
  words.forEach(word => {
    if (word.length > 3 && !stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  
  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
};

// Extract action items from transcript
export const extractActionItems = (transcript: string): string[] => {
  const actionKeywords = ['need to', 'should', 'must', 'will', 'todo', 'action item', 'task', 'follow up', 'deadline', 'assign'];
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  const actionItems = sentences.filter(sentence => {
    return actionKeywords.some(keyword => 
      sentence.toLowerCase().includes(keyword)
    );
  });
  
  return actionItems.map(item => item.trim());
};

// Save action items to Supabase
export const saveActionItems = async (
  meetingId: string,
  actionItems: string[],
  userId: string
) => {
  try {
    const items = actionItems.map(item => ({
      meeting_id: meetingId,
      assigned_to: userId,
      title: item,
      description: item,
      status: 'pending',
      priority: 'medium',
      created_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    const { error } = await supabase.from('tasks').insert(items);
    if (error) throw error;
  } catch (error) {
    console.error('Error saving action items:', error);
  }
};

// Real-time subtitle generation
export class RealtimeSubtitles {
  private recognition: any;
  private onSubtitleCallback: (text: string, language: string) => void;
  private targetLanguage: string;
  
  constructor(
    sourceLanguage: string,
    targetLanguage: string,
    onSubtitle: (text: string, language: string) => void
  ) {
    this.targetLanguage = targetLanguage;
    this.onSubtitleCallback = onSubtitle;
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = sourceLanguage;
      this.recognition.maxAlternatives = 1;
      
      this.recognition.onresult = async (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            const transcript = event.results[i][0].transcript;
            
            // Translate if needed
            if (sourceLanguage !== targetLanguage) {
              const translated = await this.translate(transcript, sourceLanguage.split('-')[0], targetLanguage);
              this.onSubtitleCallback(translated, targetLanguage);
            } else {
              this.onSubtitleCallback(transcript, sourceLanguage);
            }
          }
        }
      };
    }
  }
  
  private async translate(text: string, from: string, to: string): Promise<string> {
    try {
      const response = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, source: from, target: to, format: 'text' })
      });
      const data = await response.json();
      return data.translatedText || text;
    } catch {
      return text;
    }
  }
  
  start() {
    if (this.recognition) {
      this.recognition.start();
    }
  }
  
  stop() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}

// Meeting recording
export class MeetingRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  
  async startRecording(stream: MediaStream) {
    try {
      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus',
        videoBitsPerSecond: 2500000,
        audioBitsPerSecond: 128000
      });
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };
      
      this.mediaRecorder.start(1000); // Collect data every second
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }
  
  stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (this.mediaRecorder) {
        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
          resolve(blob);
        };
        this.mediaRecorder.stop();
      }
    });
  }
}

// Save meeting recording to Supabase Storage
export const saveMeetingRecording = async (
  meetingId: string,
  recordingBlob: Blob
) => {
  try {
    const fileName = `${meetingId}-${Date.now()}.webm`;
    const { error: storageError } = await supabase.storage
      .from('meeting-recordings')
      .upload(fileName, recordingBlob);
    
    if (storageError) throw storageError;
    
    // Save metadata to the recordings table
    const { error: dbError } = await supabase.from('recordings').insert({
      meeting_id: meetingId,
      title: `Recording ${meetingId}`,
      file_url: fileName,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    if (dbError) throw dbError;
    
    return fileName;
  } catch (error) {
    console.error('Error saving recording:', error);
  }
};

// Meeting analytics
export const getMeetingAnalytics = async (meetingId: string) => {
  try {
    // Get transcripts from meeting_summaries table
    const { data: summaries, error: summariesError } = await supabase
      .from('meeting_summaries')
      .select('*')
      .eq('meeting_id', meetingId);
    
    if (summariesError) throw summariesError;
    
    // Get action items from tasks table
    const { data: actionItems, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('meeting_id', meetingId);
    
    if (tasksError) throw tasksError;
    
    const totalTranscript = summaries?.map(s => s.transcript || '').join(' ') || '';
    const keywords = extractKeywords(totalTranscript);
    
    return {
      duration: 0, // Calculate from timestamps
      participantCount: 0, // Would need to calculate from other data
      totalWords: totalTranscript.split(/\s+/).filter(word => word.length > 0).length,
      actionItemsCount: actionItems?.length || 0,
      keywords: keywords
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    return null;
  }
};

// Audio level monitoring for better voice detection
export class AudioLevelMonitor {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private animationFrameId: number | null = null;
  private onLevelChange: (level: number) => void;
  private isActive: boolean = false;

  constructor(onLevelChange: (level: number) => void) {
    this.onLevelChange = onLevelChange;
  }

  async start(stream: MediaStream) {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      
      this.analyser.smoothingTimeConstant = 0.8;
      this.analyser.fftSize = 1024;
      
      this.microphone.connect(this.analyser);
      this.isActive = true;
      this.monitorAudioLevel();
    } catch (error) {
      console.error('Error initializing audio level monitor:', error);
    }
  }

  private monitorAudioLevel = () => {
    if (!this.isActive || !this.analyser) return;
    
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    
    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    
    // Normalize to 0-1 range
    const normalizedLevel = average / 255;
    this.onLevelChange(normalizedLevel);
    
    this.animationFrameId = requestAnimationFrame(this.monitorAudioLevel);
  }

  stop() {
    this.isActive = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.microphone) {
      this.microphone.disconnect();
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}

// Video enhancement for better face detection
export class VideoEnhancer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private video: HTMLVideoElement | null = null;
  private isActive: boolean = false;

  async enhanceVideo(videoElement: HTMLVideoElement) {
    this.video = videoElement;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    if (!this.ctx) {
      console.error('Could not get canvas context');
      return;
    }
    
    this.canvas.width = videoElement.videoWidth;
    this.canvas.height = videoElement.videoHeight;
    this.isActive = true;
    
    // Apply video enhancements
    this.applyEnhancements();
  }

  private applyEnhancements = () => {
    if (!this.isActive || !this.video || !this.ctx || !this.canvas) return;
    
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
      
      // Draw video frame to canvas
      this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
      
      // Apply image enhancements for better face visibility
      const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const data = imageData.data;
      
      // Simple brightness and contrast enhancement
      const brightness = 10;
      const contrast = 1.1;
      
      for (let i = 0; i < data.length; i += 4) {
        // Adjust brightness
        data[i] = Math.min(255, data[i] + brightness);     // Red
        data[i + 1] = Math.min(255, data[i + 1] + brightness); // Green
        data[i + 2] = Math.min(255, data[i + 2] + brightness); // Blue
        
        // Adjust contrast
        data[i] = ((data[i] - 128) * contrast) + 128;
        data[i + 1] = ((data[i + 1] - 128) * contrast) + 128;
        data[i + 2] = ((data[i + 2] - 128) * contrast) + 128;
      }
      
      this.ctx.putImageData(imageData, 0, 0);
    }
    
    requestAnimationFrame(this.applyEnhancements);
  }

  stop() {
    this.isActive = false;
  }
}