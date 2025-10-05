import { useState, useEffect, useRef } from "react";

// Define interfaces
interface Participant {
  id: string;
  name: string;
  isModerator: boolean;
  joinedAt: string;
  isPresent: boolean;
  isSpeaking?: boolean;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isPinned?: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  isAI?: boolean;
}

interface AIInsight {
  id: string;
  type: 'summary' | 'action-item' | 'question' | 'topic' | 'decision';
  content: string;
  timestamp: string;
  priority?: 'high' | 'medium' | 'low';
}

interface Toast {
  id: string;
  title: string;
  description: string;
  variant: 'success' | 'error' | 'default';
}

export const useVideoConference = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(true);
  const [impromptuMeeting, setImpromptuMeeting] = useState(false);
  const [impromptuMeetingId, setImpromptuMeetingId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [meetingLink, setMeetingLink] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [showTranscription, setShowTranscription] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState<{[key: string]: string}>({});
  const [showMeetingNotes, setShowMeetingNotes] = useState(false);
  const [meetingNotes, setMeetingNotes] = useState("");
  const [networkQuality, setNetworkQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [isMeetingLocked, setIsMeetingLocked] = useState(false);
  const [pinnedParticipant, setPinnedParticipant] = useState<string | null>(null);
  const [autoTranscription, setAutoTranscription] = useState(true);
  const [autoSummarization, setAutoSummarization] = useState(true);
  const [isHostStarting, setIsHostStarting] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const durationIntervalRef = useRef<any>(null);
  const transcriptionIntervalRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Extract meeting ID from URL or sessionStorage
  const getMeetingId = () => {
    // First check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const meetingIdFromUrl = urlParams.get('meetingId');
    
    if (meetingIdFromUrl) {
      return meetingIdFromUrl;
    }
    
    // Then check sessionStorage (for join meeting flow)
    const meetingIdFromStorage = sessionStorage.getItem('meetingId');
    
    if (meetingIdFromStorage) {
      // Don't clear the sessionStorage here as multiple users might join
      return meetingIdFromStorage;
    }
    
    // If no meeting ID found, return null
    return null;
  };

  const [meetingId, setMeetingId] = useState<string | null>(null);

  // Add effect to listen for hash changes and sessionStorage updates
  useEffect(() => {
    const handleLocationChange = () => {
      const newMeetingId = getMeetingId();
      if (newMeetingId && newMeetingId !== meetingId) {
        setMeetingId(newMeetingId);
        setImpromptuMeeting(false);
        // Set flag to indicate host is starting the meeting
        setIsHostStarting(true);
      }
    };

    // Check for meeting ID on component mount
    handleLocationChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleLocationChange);
    
    // Also check periodically in case sessionStorage was updated
    const interval = setInterval(handleLocationChange, 500);

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      clearInterval(interval);
    };
  }, [meetingId]);

  useEffect(() => {
    // Initialize meeting ID when component mounts
    const initialMeetingId = getMeetingId();
    if (initialMeetingId) {
      setMeetingId(initialMeetingId);
      // Don't set impromptu meeting if we have a specific meeting ID
      setImpromptuMeeting(false);
    } else if (impromptuMeeting && !impromptuMeetingId) {
      const newImpromptuId = `impromptu-${Date.now()}`;
      setImpromptuMeetingId(newImpromptuId);
      setMeetingId(newImpromptuId);
    }
  }, [impromptuMeeting, impromptuMeetingId]);

  const showToast = (title: string, description: string, variant: 'default' | 'success' | 'error' = 'default') => {
    const id = Date.now().toString();
    const toast: Toast = { id, title, description, variant: variant === 'default' ? 'success' : variant };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Initialize media devices
  const initializeMedia = async () => {
    try {
      const constraints = {
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true 
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      localStreamRef.current = stream;
      
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
      
      setParticipants(prev => [...prev, localParticipant]);
      setConnectionStatus('connected');
      setIsVideoOff(false); // Ensure video state is reset
      
      if (isHostStarting) {
        showToast("Meeting Started", "Your meeting has started successfully", "success");
        setIsHostStarting(false);
      } else {
        showToast("Connected", "You've joined the meeting successfully", "success");
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      showToast("Media Error", "Could not access camera or microphone. Please check permissions.", "error");
      setConnectionStatus('disconnected');
    }
  };

  useEffect(() => {
    if (connectionStatus === 'connected') {
      durationIntervalRef.current = setInterval(() => {
        setMeetingDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      setMeetingDuration(0);
    }
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [connectionStatus]);

  useEffect(() => {
    if (connectionStatus === 'connected' && autoTranscription) {
      transcriptionIntervalRef.current = setInterval(() => {
        const sampleTranscripts = [
          "Discussing project requirements and deliverables",
          "Reviewing the quarterly goals and KPIs",
          "Addressing customer feedback and concerns",
          "Planning next sprint activities",
          "Analyzing market trends and opportunities",
          "Coordinating team responsibilities",
        ];
        const randomTranscript = sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)];
        setTranscription(prev => [...prev.slice(-20), `${new Date().toLocaleTimeString()}: ${randomTranscript}`]);
      }, 15000);
    } else {
      if (transcriptionIntervalRef.current) {
        clearInterval(transcriptionIntervalRef.current);
      }
    }
    return () => {
      if (transcriptionIntervalRef.current) {
        clearInterval(transcriptionIntervalRef.current);
      }
    };
  }, [connectionStatus, autoTranscription]);

  useEffect(() => {
    if (connectionStatus === 'connected' && autoSummarization) {
      const insightInterval = setInterval(() => {
        const insights: AIInsight[] = [
          { id: Date.now().toString(), type: 'action-item', content: 'Schedule follow-up meeting for next week', timestamp: new Date().toISOString(), priority: 'high' },
          { id: (Date.now() + 1).toString(), type: 'topic', content: 'Main discussion: Q4 Strategy Planning', timestamp: new Date().toISOString(), priority: 'medium' },
          { id: (Date.now() + 2).toString(), type: 'question', content: 'Who will lead the marketing initiative?', timestamp: new Date().toISOString(), priority: 'high' },
          { id: (Date.now() + 3).toString(), type: 'decision', content: 'Approved budget increase for Q4', timestamp: new Date().toISOString(), priority: 'high' },
          { id: (Date.now() + 4).toString(), type: 'summary', content: 'Team agreed on new product timeline', timestamp: new Date().toISOString(), priority: 'medium' },
        ];
        setAiInsights(prev => [...prev.slice(-15), insights[Math.floor(Math.random() * insights.length)]]);
      }, 25000);
      return () => clearInterval(insightInterval);
    }
  }, [connectionStatus, autoSummarization]);

  useEffect(() => {
    if (connectionStatus === 'connected') {
      const qualityInterval = setInterval(() => {
        const qualities: Array<'excellent' | 'good' | 'poor'> = ['excellent', 'excellent', 'good', 'excellent'];
        setNetworkQuality(qualities[Math.floor(Math.random() * qualities.length)]);
      }, 10000);
      return () => clearInterval(qualityInterval);
    }
  }, [connectionStatus]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (connectionStatus !== 'connected') return;
      if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
          case 'd':
            e.preventDefault();
            toggleMute();
            break;
          case 'e':
            e.preventDefault();
            toggleVideo();
            break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [connectionStatus, isMuted, isVideoOff]);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (meetingId) {
      const link = `${window.location.origin}/meeting/${meetingId}`;
      setMeetingLink(link);
    }
  }, [meetingId]);

  useEffect(() => {
    if (meetingId && (isHostStarting || connectionStatus === 'disconnected')) {
      // Set to connecting state
      if (!isHostStarting) {
        setConnectionStatus('connecting');
      }
      
      // Initialize media after a short delay
      const timer = setTimeout(() => {
        initializeMedia();
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [meetingId, isHostStarting, connectionStatus]);

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(meetingLink);
    showToast("Link Copied", "Meeting link copied to clipboard", "success");
  };

  const shareMeeting = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my meeting',
          text: 'You are invited to join my meeting',
          url: meetingLink,
        });
      } catch (error) {
        copyMeetingLink();
      }
    } else {
      copyMeetingLink();
    }
  };

  const handleEndCall = () => {
    // Stop all media tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Clear participants
    setParticipants([]);
    setConnectionStatus('disconnected');
    showToast("Disconnected", "You've left the meeting", "default");
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        setIsMuted(!audioTracks[0].enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        const newState = !videoTracks[0].enabled;
        videoTracks[0].enabled = newState;
        setIsVideoOff(!newState);
        
        showToast(
          newState ? "Camera Enabled" : "Camera Disabled", 
          newState ? "Your camera is now on" : "Your camera is now off", 
          "success"
        );
      }
    }
  };

  const toggleScreenShare = () => {
    setIsSharingScreen(!isSharingScreen);
    showToast(
      isSharingScreen ? "Screen Sharing Stopped" : "Screen Sharing Started",
      isSharingScreen ? "You stopped sharing your screen" : "You are now sharing your screen",
      "success"
    );
  };

  const toggleRaiseHand = () => {
    setHandRaised(!handRaised);
    showToast(handRaised ? "Hand Lowered" : "Hand Raised", handRaised ? "Your hand has been lowered" : "Your hand is raised", "success");
  };

  const toggleFullscreen = () => {
    // This function will be overridden by the parent component
    // We're keeping it here for backward compatibility
    setIsFullscreen(prev => !prev);
  };

  // Function to update fullscreen state from outside
  const updateFullscreenState = (state: boolean) => {
    setIsFullscreen(state);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      message: newMessage,
      timestamp: new Date().toISOString(),
    };
    setChatMessages(prev => [...prev, msg]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendReaction = (emoji: string) => {
    setReactions(prev => ({ ...prev, [Date.now()]: emoji }));
    setTimeout(() => {
      setReactions(prev => {
        const newReactions = { ...prev };
        const keys = Object.keys(newReactions);
        if (keys.length > 0) {
          delete newReactions[keys[0]];
        }
        return newReactions;
      });
    }, 3000);
    setShowReactions(false);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    showToast(
      isRecording ? "Recording Stopped" : "Recording Started",
      isRecording ? "Meeting recording has stopped" : "Meeting is now being recorded",
      "success"
    );
  };

  const toggleMeetingLock = () => {
    setIsMeetingLocked(!isMeetingLocked);
    showToast(
      isMeetingLocked ? "Meeting Unlocked" : "Meeting Locked",
      isMeetingLocked ? "New participants can now join" : "No new participants can join",
      "success"
    );
  };

  const pinParticipant = (participantId: string) => {
    setPinnedParticipant(pinnedParticipant === participantId ? null : participantId);
    showToast("Pin Updated", pinnedParticipant === participantId ? "Participant unpinned" : "Participant pinned", "success");
  };

  const downloadTranscript = () => {
    const content = transcription.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-transcript-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Download Started", "Transcript is downloading", "success");
  };

  const downloadSummary = () => {
    const summary = aiInsights.map(i => `[${i.type}] ${i.content}`).join('\n');
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-summary-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Download Started", "Summary is downloading", "success");
  };

  return {
    // State variables
    participants,
    chatMessages,
    newMessage,
    isMuted,
    isVideoOff,
    isSharingScreen,
    isChatOpen,
    isParticipantsOpen,
    impromptuMeeting,
    impromptuMeetingId,
    connectionStatus,
    meetingDuration,
    meetingLink,
    isRecording,
    showSettings,
    showAIInsights,
    aiInsights,
    transcription,
    showTranscription,
    isFullscreen,
    handRaised,
    toasts,
    showReactions,
    reactions,
    showMeetingNotes,
    meetingNotes,
    networkQuality,
    showKeyboardShortcuts,
    isMeetingLocked,
    pinnedParticipant,
    autoTranscription,
    autoSummarization,
    meetingId,
    isHostStarting,
    
    // Refs
    chatContainerRef,
    videoRef,
    localStreamRef,
    videoContainerRef,
    
    // Functions
    setNewMessage,
    setShowSettings,
    setShowAIInsights,
    setAiInsights,
    setTranscription,
    setShowTranscription,
    setMeetingNotes,
    setAutoTranscription,
    setAutoSummarization,
    setImpromptuMeeting,
    setImpromptuMeetingId,
    setConnectionStatus,
    setMeetingDuration,
    setMeetingLink,
    setParticipants,
    setChatMessages,
    setIsMuted,
    setIsVideoOff,
    setIsSharingScreen,
    setIsChatOpen,
    setIsParticipantsOpen,
    setIsRecording,
    setToasts,
    setShowReactions,
    setReactions,
    setShowMeetingNotes,
    setNetworkQuality,
    setShowKeyboardShortcuts,
    setIsMeetingLocked,
    setPinnedParticipant,
    setIsHostStarting,
    showToast,
    formatDuration,
    copyMeetingLink,
    shareMeeting,
    handleEndCall,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    toggleRaiseHand,
    toggleFullscreen,
    updateFullscreenState, // New function to update fullscreen state
    sendMessage,
    handleKeyPress,
    sendReaction,
    toggleRecording,
    toggleMeetingLock,
    pinParticipant,
    downloadTranscript,
    downloadSummary,
    getMeetingId
  };
};