import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  MonitorUp,
  Users,
  MessageSquare,
  PhoneOff,
  Sparkles,
  Send,
  Copy,
  Share2,
  X,
  CheckCircle2,
  Clock,
  Settings,
  Download,
  FileText,
  Lightbulb,
  Maximize,
  Minimize,
  Hand,
  Brain,
  Languages,
  Activity,
  Smile,
  Wifi,
  Play,
  Pause,
  Lock,
  Unlock,
  Pin,
  ChevronDown,
  ChevronUp,
  Camera,
  Volume2
} from "lucide-react";

// Interfaces
interface Participant {
  id: string;
  name: string;
  isModerator: boolean;
  joinedAt: string;
  isPresent: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  stream?: MediaStream;
}

interface ChatMessage {
  id: string;
  userName: string;
  message: string;
  timestamp: string;
}

interface AIInsight {
  id: string;
  type: 'summary' | 'action-item' | 'question' | 'topic' | 'decision';
  content: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

const VideoConference = () => {
  // State
  const [meetingStarted, setMeetingStarted] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(true);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showTranscription, setShowTranscription] = useState(false);
  const [showMeetingNotes, setShowMeetingNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [meetingNotes, setMeetingNotes] = useState("");
  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState<{[key: string]: string}>({});
  const [networkQuality, setNetworkQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');
  const [isMeetingLocked, setIsMeetingLocked] = useState(false);
  const [pinnedParticipant, setPinnedParticipant] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{title: string, description: string, type: string} | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [showCCDropdown, setShowCCDropdown] = useState(false); // For CC language dropdown
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null); // Selected subtitle language
  const [translatedTranscripts, setTranslatedTranscripts] = useState<{[key: string]: string}>({}); // Translated transcripts
  const [isHost, setIsHost] = useState(true); // Track if current user is host

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const durationInterval = useRef<NodeJS.Timeout>();
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  // Check for meeting ID in URL or sessionStorage when component mounts
  useEffect(() => {
    // First check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const meetingIdFromUrl = urlParams.get('meetingId');
    
    if (meetingIdFromUrl) {
      setMeetingId(meetingIdFromUrl);
      setIsJoining(true);
      return;
    }
    
    // Then check sessionStorage (for join meeting flow)
    const meetingIdFromStorage = sessionStorage.getItem('meetingId');
    
    if (meetingIdFromStorage) {
      setMeetingId(meetingIdFromStorage);
      setIsJoining(true);
      // Clear the sessionStorage so it's not used again
      sessionStorage.removeItem('meetingId');
      return;
    }
  }, []);

  // Initialize local media
  const startMeeting = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });

      setLocalStream(stream);
      // Add local participant
      const localParticipant: Participant = {
        id: 'local-' + Date.now(),
        name: 'You',
        isModerator: true,
        joinedAt: new Date().toISOString(),
        isPresent: true,
        isMuted: false,
        isVideoOff: false
      };
      
      // Set host status
      setIsHost(true);
      
      setParticipants([localParticipant]);
      setMeetingStarted(true);
      
      // Initialize speech recognition
      initializeSpeechRecognition();
      
      showToast("Meeting Started", "Your meeting has started successfully", "success");
    } catch (error) {
      showToast("Error", "Could not access camera/microphone", "error");
    }
  };

  // Join existing meeting
  const joinMeeting = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });

      setLocalStream(stream);
      const localParticipant: Participant = {
        id: 'local',
        name: 'You',
        isModerator: false, // Not the host when joining
        joinedAt: new Date().toISOString(),
        isPresent: true,
        isMuted: false,
        isVideoOff: false,
        stream
      };

      // Set host status
      setIsHost(false);
      
      setParticipants([localParticipant]);
      setMeetingStarted(true);
      
      // Initialize speech recognition
      initializeSpeechRecognition();
      
      showToast("Joined Meeting", "You've successfully joined the meeting", "success");
    } catch (error) {
      showToast("Error", "Could not access camera/microphone", "error");
    }
  };

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
            // Add to transcription with timestamp
            const text = `${new Date().toLocaleTimeString()}: ${transcript}`;
            setTranscription(prev => [...prev, text].slice(-20));
            
            // If a language is selected for subtitles, translate the text
            if (selectedLanguage) {
              translateText(text, selectedLanguage);
            }
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript + interimTranscript);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        showToast("Speech Recognition Error", `Error: ${event.error}`, "error");
      };
      
      recognition.onend = () => {
        if (isListening) {
          recognition.start();
        }
      };
      
      setSpeechRecognition(recognition);
    } else {
      console.warn('Speech recognition not supported in this browser');
      showToast("Feature Not Supported", "Speech recognition is not supported in your browser", "error");
    }
  };

  // Toggle speech recognition
  const toggleSpeechRecognition = () => {
    if (!speechRecognition) return;
    
    if (isListening) {
      speechRecognition.stop();
      setIsListening(false);
      showToast("Speech Recognition", "Stopped listening", "success");
    } else {
      speechRecognition.start();
      setIsListening(true);
      showToast("Speech Recognition", "Started listening", "success");
    }
  };

  // Effect to update video element when stream changes
  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
      
      // Try to play the video
      const playVideo = async () => {
        try {
          await videoRef.current?.play();
        } catch (e) {
          console.warn('Autoplay prevented:', e);
        }
      };
      
      playVideo();
    }
  }, [localStream, videoRef]);

  // Auto-generate AI insights
  useEffect(() => {
    // Note: We're disabling auto-generated AI insights to focus on real meeting content
    // In a real implementation, AI insights would be generated based on actual meeting content
    if (meetingStarted) {
      // This is now disabled to avoid confusion with real meeting content
    }
  }, [meetingStarted]);

  // Auto-generate transcription
  useEffect(() => {
    // Note: We're now using real speech recognition instead of auto-generated text
    // This effect is kept for backward compatibility but doesn't generate text
    if (meetingStarted) {
      // Speech recognition is handled by the browser API now
      // Transcription is updated in the speech recognition callbacks
    }
  }, [meetingStarted]);

  // Function to translate text using OpenAI
  const translateText = async (text: string, targetLanguage: string) => {
    try {
      // Extract the actual text content (remove timestamp)
      const textContent = text.split(': ').slice(1).join(': ');
      
      // Skip translation if text is empty
      if (!textContent.trim()) return;
      
      // Map language codes to full names
      const languageMap: {[key: string]: string} = {
        'en': 'English',
        'hi': 'Hindi',
        'te': 'Telugu'
      };
      
      // Create a prompt for translation
      const prompt = `Translate the following English text to ${languageMap[targetLanguage] || targetLanguage}:
      
"${textContent}"
      
Return only the translated text without any additional formatting or explanation.`;
      
      // Call OpenAI API through Supabase Edge Functions
      const response = await fetch('/functions/v1/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const translatedText = data.message || data.choices?.[0]?.message?.content || textContent;
        
        // Store the translated text with a timestamp-based key
        const timestamp = text.split(': ')[0];
        setTranslatedTranscripts(prev => ({
          ...prev,
          [text]: timestamp + ': ' + translatedText
        }));
      } else {
        console.error('Translation API error:', response.status, response.statusText);
        // If translation fails, keep the original text
        setTranslatedTranscripts(prev => ({
          ...prev,
          [text]: text
        }));
      }
    } catch (error) {
      console.error('Translation error:', error);
      // If translation fails, keep the original text
      setTranslatedTranscripts(prev => ({
        ...prev,
        [text]: text
      }));
    }
  };

  // Toast notification
  const showToast = (title: string, description: string, type: string) => {
    setToastMessage({ title, description, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle mute
  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        showToast(audioTrack.enabled ? "Unmuted" : "Muted", audioTrack.enabled ? "Your microphone is on" : "Your microphone is off", "success");
      }
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
        showToast(videoTrack.enabled ? "Camera On" : "Camera Off", videoTrack.enabled ? "Your camera is on" : "Your camera is off", "success");
      }
    }
  };

  // Toggle screen share
  const toggleScreenShare = async () => {
    if (!isSharingScreen) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setIsSharingScreen(true);
        showToast("Screen Sharing", "You are now sharing your screen", "success");
        
        screenStream.getVideoTracks()[0].onended = () => {
          setIsSharingScreen(false);
          showToast("Screen Sharing Stopped", "Screen sharing has ended", "success");
        };
      } catch (error) {
        showToast("Error", "Could not start screen sharing", "error");
      }
    } else {
      setIsSharingScreen(false);
      showToast("Screen Sharing Stopped", "Screen sharing has ended", "success");
    }
  };

  // Send message
  const sendMessage = () => {
    if (newMessage.trim()) {
      const msg: ChatMessage = {
        id: Date.now().toString(),
        userName: 'You',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, msg]);
      setNewMessage("");
      setTimeout(() => {
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  // Send reaction
  const sendReaction = (emoji: string) => {
    const id = Date.now().toString();
    setReactions(prev => ({ ...prev, [id]: emoji }));
    setTimeout(() => {
      setReactions(prev => {
        const newReactions = { ...prev };
        delete newReactions[id];
        return newReactions;
      });
    }, 3000);
    setShowReactions(false);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && fullscreenRef.current) {
      fullscreenRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // End call
  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setMeetingStarted(false);
    setLocalStream(null);
    setParticipants([]);
    setMeetingDuration(0);
    showToast("Meeting Ended", "You have left the meeting", "success");
  };

  // Download transcript
  const downloadTranscript = () => {
    const content = transcription.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded", "Transcript downloaded", "success");
  };

  // Handle click outside to close CC dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCCDropdown && !(event.target as Element).closest('.cc-dropdown')) {
        setShowCCDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCCDropdown]);

  // Auto-start speech recognition when meeting starts
  useEffect(() => {
    if (meetingStarted && speechRecognition && !isListening) {
      try {
        speechRecognition.start();
        setIsListening(true);
        showToast("Speech Recognition", "Started listening automatically", "success");
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  }, [meetingStarted, speechRecognition, isListening]);

  // Show join meeting UI if user is joining through a link
  if (!meetingStarted && isJoining) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <Card className="max-w-4xl w-full p-12 border-2 border-purple-200 shadow-2xl bg-white/90 backdrop-blur">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-40 animate-pulse" />
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-8 shadow-2xl">
                  <Video className="w-20 h-20 text-white" />
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                Join Meeting
              </h2>
              <p className="text-lg text-indigo-700">
                You've been invited to join a meeting
              </p>
              {meetingId && (
                <p className="text-md text-gray-600 mt-2">
                  Meeting ID: {meetingId}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg">
                <Brain className="w-8 h-8 text-blue-700 mx-auto mb-2" />
                <p className="font-semibold text-blue-900">AI Insights</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 shadow-lg">
                <FileText className="w-8 h-8 text-purple-700 mx-auto mb-2" />
                <p className="font-semibold text-purple-900">Transcription</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-lg">
                <Languages className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
                <p className="font-semibold text-emerald-900">Translation</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 shadow-lg">
                <Lightbulb className="w-8 h-8 text-amber-700 mx-auto mb-2" />
                <p className="font-semibold text-amber-900">Action Items</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={joinMeeting}
                className="gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all text-lg px-10 py-6"
              >
                <Sparkles className="w-6 h-6" />
                Join Meeting
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleEndCall}
                className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-50 text-lg px-10 py-6"
              >
                <X className="w-6 h-6" />
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!meetingStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <Card className="max-w-4xl w-full p-12 border-2 border-purple-200 shadow-2xl bg-white/90 backdrop-blur">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-40 animate-pulse" />
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-8 shadow-2xl">
                  <Video className="w-20 h-20 text-white" />
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                AI-Powered Video Conference
              </h2>
              <p className="text-lg text-indigo-700">
                Experience real-time AI transcription, smart insights, and seamless collaboration
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg">
                <Brain className="w-8 h-8 text-blue-700 mx-auto mb-2" />
                <p className="font-semibold text-blue-900">AI Insights</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 shadow-lg">
                <FileText className="w-8 h-8 text-purple-700 mx-auto mb-2" />
                <p className="font-semibold text-purple-900">Transcription</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-lg">
                <Languages className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
                <p className="font-semibold text-emerald-900">Translation</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 shadow-lg">
                <Lightbulb className="w-8 h-8 text-amber-700 mx-auto mb-2" />
                <p className="font-semibold text-amber-900">Action Items</p>
              </div>
            </div>

            <div className="bg-purple-100 rounded-lg p-4 max-w-2xl mx-auto mt-4">
              <p className="text-sm text-purple-800 text-center">
                <Languages className="w-4 h-4 inline mr-1" />
                <span className="font-medium">New:</span> Real-time subtitles available during meetings. 
                All participants can view subtitles in their preferred language (Telugu, Hindi, or English).
              </p>
            </div>

            <Button
              size="lg"
              onClick={startMeeting}
              className="gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all text-lg px-10 py-6"
            >
              <Sparkles className="w-6 h-6" />
              Start Meeting
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <Card className={`p-4 shadow-xl border-2 ${
            toastMessage.type === 'success' ? 'border-emerald-400 bg-emerald-50' :
            toastMessage.type === 'error' ? 'border-red-400 bg-red-50' :
            'border-blue-400 bg-blue-50'
          }`}>
            <div className="flex items-start gap-3">
              <CheckCircle2 className={`w-5 h-5 mt-0.5 ${
                toastMessage.type === 'success' ? 'text-emerald-600' :
                toastMessage.type === 'error' ? 'text-red-600' :
                'text-blue-600'
              }`} />
              <div>
                <p className="font-semibold text-sm">{toastMessage.title}</p>
                <p className="text-sm text-gray-600">{toastMessage.description}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Header */}
      <Card className="mb-4 bg-white/80 backdrop-blur border-purple-200 shadow-lg">
        <div className="p-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <Activity className="w-3 h-3 mr-1" />
              Live
            </Badge>
            <div className="flex items-center gap-2 text-sm text-indigo-700">
              <Clock className="w-4 h-4" />
              <span className="font-mono font-semibold">{formatDuration(meetingDuration)}</span>
            </div>
            {networkQuality && (
              <Badge variant="outline" className={`${
                networkQuality === 'excellent' ? 'border-emerald-400 text-emerald-700' :
                networkQuality === 'good' ? 'border-amber-400 text-amber-700' :
                'border-red-400 text-red-700'
              }`}>
                <Wifi className="w-3 h-3 mr-1" />
                {networkQuality}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {isRecording && (
              <Badge className="bg-red-500 text-white animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mr-2" />
                Recording
              </Badge>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsRecording(!isRecording)}
              className="border-purple-300"
            >
              {isRecording ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-4 gap-4">
        {/* Main Video Area */}
        <div className="lg:col-span-3 space-y-4">
          <div ref={fullscreenRef}>
            <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-purple-300 shadow-2xl">
              <div className="aspect-video relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {isVideoOff && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900">
                    <div className="text-center">
                      <VideoOff className="w-20 h-20 text-white/50 mx-auto mb-4" />
                      <p className="text-white/70 text-lg">Camera is off</p>
                    </div>
                  </div>
                )}

                {/* Reactions Overlay */}
                {Object.entries(reactions).map(([id, emoji]) => (
                  <div
                    key={id}
                    className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-6xl animate-bounce"
                    style={{ animationDuration: '2s' }}
                  >
                    {emoji}
                  </div>
                ))}

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {isMuted && (
                    <Badge className="bg-red-500/90 text-white backdrop-blur">
                      <MicOff className="w-3 h-3 mr-1" />
                      Muted
                    </Badge>
                  )}
                  {isSharingScreen && (
                    <Badge className="bg-blue-500/90 text-white backdrop-blur">
                      <MonitorUp className="w-3 h-3 mr-1" />
                      Sharing
                    </Badge>
                  )}
                  {handRaised && (
                    <Badge className="bg-amber-500/90 text-white backdrop-blur animate-pulse">
                      <Hand className="w-3 h-3 mr-1" />
                      Hand Raised
                    </Badge>
                  )}
                  {isListening && (
                    <Badge className="bg-green-500/90 text-white backdrop-blur">
                      <Volume2 className="w-3 h-3 mr-1" />
                      Listening
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Controls */}
          <Card className="bg-white/80 backdrop-blur border-purple-200 shadow-lg">
            <div className="p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex gap-2">
                <Button
                  variant={isMuted ? "destructive" : "outline"}
                  size="lg"
                  onClick={toggleMute}
                  className={!isMuted ? "border-purple-300 hover:bg-purple-50" : ""}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                <Button
                  variant={isVideoOff ? "destructive" : "outline"}
                  size="lg"
                  onClick={toggleVideo}
                  className={!isVideoOff ? "border-purple-300 hover:bg-purple-50" : ""}
                >
                  {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </Button>
                <Button
                  variant={isSharingScreen ? "default" : "outline"}
                  size="lg"
                  onClick={toggleScreenShare}
                  className={isSharingScreen ? "bg-blue-600 hover:bg-blue-700" : "border-purple-300 hover:bg-purple-50"}
                >
                  <MonitorUp className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setHandRaised(!handRaised)}
                  className={handRaised ? "bg-amber-100 border-amber-400" : "border-purple-300"}
                >
                  <Hand className="w-5 h-5" />
                </Button>
                <div className="relative">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowReactions(!showReactions)}
                    className="border-purple-300"
                  >
                    <Smile className="w-5 h-5" />
                  </Button>
                  {showReactions && (
                    <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-xl border-2 border-purple-200 p-2 flex gap-2">
                      {['👍', '❤️', '😂', '🎉', '👏'].map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => sendReaction(emoji)}
                          className="text-2xl hover:scale-125 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  variant={isListening ? "default" : "outline"}
                  size="lg"
                  onClick={toggleSpeechRecognition}
                  className={isListening ? "bg-green-600 hover:bg-green-700" : "border-purple-300"}
                >
                  <Volume2 className="w-5 h-5" />
                  {isListening && <span className="ml-2">Listening</span>}
                </Button>
                {/* CC (Subtitle) Button */}
                <div className="relative cc-dropdown">
                  <Button
                    variant={selectedLanguage ? "default" : "outline"}
                    size="lg"
                    onClick={() => setShowCCDropdown(!showCCDropdown)}
                    className={selectedLanguage ? "bg-purple-600 hover:bg-purple-700" : "border-purple-300"}
                  >
                    <Languages className="w-5 h-5" />
                    {selectedLanguage && (
                      <span className="ml-2 text-xs">{selectedLanguage.substring(0, 2).toUpperCase()}</span>
                    )}
                    {selectedLanguage && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </Button>
                  {showCCDropdown && (
                    <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-xl border-2 border-purple-200 p-2 w-48 z-50">
                      <div className="px-3 py-2 text-sm font-semibold text-purple-900 border-b border-purple-100">
                        Subtitle Language
                      </div>
                      {[
                        { code: 'en', name: 'English' },
                        { code: 'hi', name: 'Hindi' },
                        { code: 'te', name: 'Telugu' }
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setSelectedLanguage(lang.code);
                            setShowCCDropdown(false);
                            showToast("Subtitles Enabled", `Subtitles will be shown in ${lang.name}`, "success");
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-purple-50 rounded ${
                            selectedLanguage === lang.code ? 'bg-purple-100 text-purple-700 font-medium' : 'text-gray-700'
                          }`}
                        >
                          {lang.name}
                        </button>
                      ))}
                      {selectedLanguage && (
                        <button
                          onClick={() => {
                            setSelectedLanguage(null);
                            setShowCCDropdown(false);
                            showToast("Subtitles Disabled", "Subtitles have been turned off", "success");
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                        >
                          Disable Subtitles
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleFullscreen}
                  className="border-purple-300"
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </Button>
              </div>

              <Button
                variant="destructive"
                size="lg"
                onClick={handleEndCall}
                className="bg-red-600 hover:bg-red-700"
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                End Call
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Tabs */}
          <Card className="bg-white/80 backdrop-blur border-purple-200">
            <div className="flex border-b border-purple-200">
              <button
                onClick={() => {
                  setIsChatOpen(true);
                  setIsParticipantsOpen(false);
                  setShowAIInsights(false);
                }}
                className={`flex-1 p-3 text-sm font-medium transition-colors ${
                  isChatOpen ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-600' : 'text-gray-600 hover:bg-purple-50'
                }`}
              >
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Chat
              </button>
              <button
                onClick={() => {
                  setIsChatOpen(false);
                  setIsParticipantsOpen(true);
                  setShowAIInsights(false);
                }}
                className={`flex-1 p-3 text-sm font-medium transition-colors ${
                  isParticipantsOpen ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-600' : 'text-gray-600 hover:bg-purple-50'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                People
              </button>
              <button
                onClick={() => {
                  setIsChatOpen(false);
                  setIsParticipantsOpen(false);
                  setShowAIInsights(true);
                }}
                className={`flex-1 p-3 text-sm font-medium transition-colors ${
                  showAIInsights ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-600' : 'text-gray-600 hover:bg-purple-50'
                }`}
              >
                <Brain className="w-4 h-4 inline mr-2" />
                AI
              </button>
            </div>

            <div className="p-4 h-[500px] flex flex-col">
              {/* Chat */}
              {isChatOpen && (
                <>
                  <ScrollArea className="flex-1 pr-4 mb-4" ref={chatScrollRef}>
                    <div className="space-y-3">
                      {chatMessages.map(msg => (
                        <div key={msg.id} className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-sm text-purple-900">{msg.userName}</span>
                            <span className="text-xs text-purple-600">{msg.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-700">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="border-purple-300 focus:border-purple-500"
                    />
                    <Button onClick={sendMessage} className="bg-purple-600 hover:bg-purple-700">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}

              {/* Participants */}
              {isParticipantsOpen && (
                <ScrollArea className="flex-1">
                  <div className="space-y-2">
                    {participants.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {p.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-purple-900">{p.name}</p>
                            {p.isModerator && <Badge className="text-xs bg-amber-100 text-amber-700">Host</Badge>}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {p.isMuted && <MicOff className="w-4 h-4 text-red-500" />}
                          {p.isVideoOff && <VideoOff className="w-4 h-4 text-red-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {/* AI Insights */}
              {showAIInsights && (
                <ScrollArea className="flex-1">
                  <div className="space-y-3">
                    <Button
                      onClick={downloadTranscript}
                      variant="outline"
                      size="sm"
                      className="w-full border-purple-300 mb-4"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Transcript
                    </Button>
                    {aiInsights.map(insight => (
                      <div key={insight.id} className={`p-3 rounded-lg border-2 ${
                        insight.type === 'action-item' ? 'bg-amber-50 border-amber-300' :
                        insight.type === 'decision' ? 'bg-emerald-50 border-emerald-300' :
                        insight.type === 'question' ? 'bg-blue-50 border-blue-300' :
                        'bg-purple-50 border-purple-300'
                      }`}>
                        <div className="flex items-start gap-2 mb-2">
                          {insight.type === 'action-item' && <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5" />}
                          {insight.type === 'decision' && <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />}
                          {insight.type === 'question' && <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5" />}
                          {insight.type === 'topic' && <Brain className="w-4 h-4 text-purple-600 mt-0.5" />}
                          {insight.type === 'summary' && <FileText className="w-4 h-4 text-indigo-600 mt-0.5" />}
                          <div className="flex-1">
                            <Badge className={`text-xs mb-1 ${
                              insight.priority === 'high' ? 'bg-red-100 text-red-700' :
                              insight.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {insight.type.replace('-', ' ')}
                            </Badge>
                            <p className="text-sm text-gray-700">{insight.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(insight.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {aiInsights.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">AI insights will appear here during the meeting</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>
          </Card>

          {/* Transcription Card */}
          <Card className="bg-white/80 backdrop-blur border-purple-200">
            <button
              onClick={() => setShowTranscription(!showTranscription)}
              className="w-full p-4 flex items-center justify-between hover:bg-purple-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900">Live Transcription</span>
                <Badge className="bg-emerald-500 text-white text-xs">
                  Active
                </Badge>
              </div>
              {showTranscription ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {showTranscription && (
              <div className="border-t border-purple-200 p-4">
                <ScrollArea className="h-40">
                  <div className="space-y-2">
                    {transcription.map((text, idx) => (
                      <p key={idx} className="text-sm text-gray-700 bg-purple-50 p-2 rounded">
                        {selectedLanguage && translatedTranscripts[text] 
                          ? translatedTranscripts[text] 
                          : text}
                      </p>
                    ))}
                    {transcription.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        Transcription will appear here...
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </Card>

          {/* Meeting Notes */}
          <Card className="bg-white/80 backdrop-blur border-purple-200">
            <button
              onClick={() => setShowMeetingNotes(!showMeetingNotes)}
              className="w-full p-4 flex items-center justify-between hover:bg-purple-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900">Meeting Notes</span>
              </div>
              {showMeetingNotes ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {showMeetingNotes && (
              <div className="border-t border-purple-200 p-4">
                <textarea
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  placeholder="Take notes during the meeting..."
                  className="w-full h-32 p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none text-sm"
                />
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200 shadow-lg">
            <div className="p-4 space-y-2">
              <p className="text-sm font-semibold text-purple-900 mb-3">Quick Actions</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-purple-300 bg-white hover:bg-purple-50"
                onClick={() => {
                  navigator.clipboard.writeText(`Meeting Link: ${window.location.href}`);
                  showToast("Copied", "Meeting link copied to clipboard", "success");
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Meeting Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-purple-300 bg-white hover:bg-purple-50"
                onClick={() => setIsMeetingLocked(!isMeetingLocked)}
              >
                {isMeetingLocked ? <Unlock className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                {isMeetingLocked ? 'Unlock Meeting' : 'Lock Meeting'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-purple-300 bg-white hover:bg-purple-50"
                onClick={downloadTranscript}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Transcript
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoConference;