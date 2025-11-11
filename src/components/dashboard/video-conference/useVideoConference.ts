import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMeetingSpeech } from "./useMeetingSpeech";
import {
  createPeerConnection,
  createOffer,
  createAnswer,
  handleIceCandidate,
  handleTrackEvent,
  sendSignalingData,
  listenForSignalingData,
  getUserMedia,
  ensureAudioUnlocked,
} from "@/utils/webrtc";

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
  stream?: MediaStream;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
}

interface Toast {
  id: string;
  title: string;
  description: string;
  type: string;
}

export const useVideoConference = () => {
  /* --------------------------------------------------
     🎛️ States
  -------------------------------------------------- */
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectionStatus, setConnectionStatus] =
    useState<"connecting" | "connected" | "disconnected">("disconnected");
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUserName, setCurrentUserName] = useState<string>("User");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState<{[key: string]: string}>({});
  const [networkQuality, setNetworkQuality] = useState<"excellent" | "good" | "poor">("excellent");
  const [isMeetingLocked, setIsMeetingLocked] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [pinnedParticipant, setPinnedParticipant] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  /* --------------------------------------------------
     🎥 Refs
  -------------------------------------------------- */
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const signalingChannelRef = useRef<any>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  /* --------------------------------------------------
     🧠 Meeting Speech (Assistant)
  -------------------------------------------------- */
  const {
    isSupported: isSpeechSupported,
    isSpeaking,
    isPaused: isSpeechPaused,
    speak: speakText,
    stop: stopSpeaking,
    pause: pauseSpeaking,
    resume: resumeSpeaking,
    error: speechError
  } = useMeetingSpeech({
    defaultLanguage: "en-US",
  });

  /* --------------------------------------------------
     🧩 Utilities
  -------------------------------------------------- */
  const showToast = useCallback((title: string, description: string, type = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getMeetingId = useCallback(() => {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    if (pathParts.length >= 2) return pathParts[1];
    return null;
  }, []);

  const getCurrentUser = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentUserId(data.user.id);
        setCurrentUserName(data.user.email || "User");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  /* --------------------------------------------------
     🎧 Initialize Audio/Video Stream
  -------------------------------------------------- */
  const initializeMedia = async () => {
    try {
      ensureAudioUnlocked(); // 🧩 ensures playback allowed after click
      setConnectionStatus("connecting");

      const stream = await getUserMedia("high");
      localStreamRef.current = stream;

      // Enable tracks
      stream.getTracks().forEach((t) => {
        t.enabled = true;
        console.log(`Enabled track: ${t.kind} - ${t.id}`);
      });
      
      // Set up local audio monitoring
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioSource = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      audioSource.connect(analyser);
      
      // Monitor audio levels
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateAudioLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        setAudioLevel(average);
        requestAnimationFrame(updateAudioLevel);
      };
      
      updateAudioLevel();
      
      console.log("🎤 Local stream ready", {
        audio: stream.getAudioTracks().length,
        video: stream.getVideoTracks().length,
        audioTracks: stream.getAudioTracks().map(t => ({id: t.id, enabled: t.enabled})),
        videoTracks: stream.getVideoTracks().map(t => ({id: t.id, enabled: t.enabled}))
      });

      // Log stream info before adding participant
      console.log("Stream info before adding participant:", {
        audioTracks: stream.getAudioTracks().map(t => ({enabled: t.enabled})),
        videoTracks: stream.getVideoTracks().map(t => ({enabled: t.enabled}))
      });
      
      // Add self
      setParticipants([
        {
          id: currentUserId || "local",
          name: currentUserName,
          isModerator: true,
          joinedAt: new Date().toISOString(),
          isPresent: true,
          stream,
          isMuted: false,
          isVideoOff: false,
        },
      ]);

      // Connect meeting
      if (meetingId) {
        await joinMeeting(meetingId, stream);
      }

      setConnectionStatus("connected");
      showToast("Connected", "You joined the meeting successfully", "success");
    } catch (err) {
      console.error("Media init failed:", err);
      showToast("Error", "Please allow microphone and camera access", "error");
      setConnectionStatus("disconnected");
    }
  };

  /* --------------------------------------------------
     🤝 Join Meeting
  -------------------------------------------------- */
  const joinMeeting = async (id: string, localStream: MediaStream) => {
    try {
      const { error } = await supabase.from("meeting_participants").insert({
        meeting_id: id,
        user_id: currentUserId,
        user_name: currentUserName,
        joined_at: new Date().toISOString(),
      });
      if (error) throw error;

      const { data: others } = await supabase
        .from("meeting_participants")
        .select("*")
        .eq("meeting_id", id)
        .neq("user_id", currentUserId);

      for (const p of others || []) {
        await createPeerForParticipant(p.user_id, localStream, true);
      }

      // 🔄 Listen for new participants
      signalingChannelRef.current = listenForSignalingData(
        id,
        currentUserId,
        handleSignalingData
      );
    } catch (error) {
      console.error("Join meeting failed:", error);
      showToast("Error", "Failed to join meeting", "error");
    }
  };

  /* --------------------------------------------------
     🔗 Create Peer Connection
  -------------------------------------------------- */
  const createPeerForParticipant = async (
    participantId: string,
    localStream: MediaStream,
    isExisting: boolean
  ) => {
    const pc = createPeerConnection(localStream);

    // Handle remote track
    handleTrackEvent(pc, (event) => {
      const stream = event.streams[0];
      if (!stream) return;

      let audioEl = audioElementsRef.current.get(participantId);
      if (!audioEl) {
        audioEl = document.createElement("audio");
        audioEl.autoplay = true;
        audioEl.muted = false;
        audioEl.volume = 1.0;
        document.body.appendChild(audioEl);
        audioElementsRef.current.set(participantId, audioEl);
      }

      audioEl.srcObject = stream;
      const tryPlay = async () => {
        try {
          await audioEl.play();
          console.log(`🔊 Remote audio started for ${participantId}`);
        } catch (e) {
          console.warn("⚠️ Autoplay blocked. Tap to enable audio.");
          document.addEventListener(
            "click",
            async () => {
              await audioEl!.play();
              console.log("✅ Audio unlocked via user click");
            },
            { once: true }
          );
        }
      };
      tryPlay();

      setParticipants((prev) =>
        prev.map((p) => (p.id === participantId ? { ...p, stream, isSpeaking: false, isPinned: false } : p))
      );
    });

    // Handle track changes (important for audio transmission)
    pc.onnegotiationneeded = async () => {
      console.log("Negotiation needed for peer connection");
      try {
        if (pc.signalingState === "stable") {
          const offer = await createOffer(pc);
          sendSignalingData(meetingId!, participantId, { type: "offer", offer }, currentUserId, currentUserName);
        }
      } catch (err) {
        console.error("Error during negotiation:", err);
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && meetingId && currentUserId)
        sendSignalingData(
          meetingId,
          participantId,
          { type: "ice", candidate: event.candidate },
          currentUserId,
          currentUserName
        );
    };

    // Handle track events (for dynamic track additions/removals)
    pc.ontrack = (event) => {
      console.log("Track added to peer connection:", event.track.kind);
    };

    peerConnections.current.set(participantId, pc);

    if (isExisting) {
      const offer = await createOffer(pc);
      sendSignalingData(meetingId!, participantId, { type: "offer", offer }, currentUserId, currentUserName);
    }

    return pc;
  };

  /* --------------------------------------------------
     🛰️ Handle Signaling Data
  -------------------------------------------------- */
  const handleSignalingData = useCallback(
    async (data: any, from: string) => {
      if (!localStreamRef.current || !meetingId || !currentUserId) return;

      let pc = peerConnections.current.get(from);
      if (!pc) {
        pc = await createPeerForParticipant(from, localStreamRef.current, false);
      }

      switch (data.type) {
        case "offer": {
          const answer = await createAnswer(pc!, data.offer);
          sendSignalingData(meetingId, from, { type: "answer", answer }, currentUserId, currentUserName);
          break;
        }
        case "answer": {
          await pc!.setRemoteDescription(new RTCSessionDescription(data.answer));
          break;
        }
        case "ice": {
          await handleIceCandidate(pc!, data.candidate);
          break;
        }
        case "trackUpdate": {
          // Handle track updates (mute/unmute)
          console.log("Received track update from:", from, data);
          // Update UI to reflect track state change
          setParticipants(prev => prev.map(p => {
            if (p.id === from) {
              if (data.trackKind === "audio") {
                return { ...p, isMuted: !data.enabled };
              }
            }
            return p;
          }));
          break;
        }
      }
    },
    [meetingId, currentUserId, currentUserName]
  );

  /* --------------------------------------------------
     🔴 Leave Meeting
  -------------------------------------------------- */
  const leaveMeeting = useCallback(() => {
    peerConnections.current.forEach((pc) => pc.close());
    peerConnections.current.clear();

    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    audioElementsRef.current.forEach((a) => a.remove());
    audioElementsRef.current.clear();

    if (signalingChannelRef.current) {
      supabase.removeChannel(signalingChannelRef.current);
    }

    setParticipants([]);
    setConnectionStatus("disconnected");
    showToast("Disconnected", "You left the meeting", "info");
  }, [showToast]);

  /* --------------------------------------------------
     🎙 Toggle Mute
  -------------------------------------------------- */
  const toggleMute = useCallback(() => {
    console.log('Toggle Mute called. Current state:', { isMuted, localStream: localStreamRef.current });
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      console.log('Audio tracks found:', audioTracks.map(t => ({id: t.id, enabled: t.enabled})));
      if (audioTracks.length > 0) {
        const audioTrack = audioTracks[0];
        const newMuted = !isMuted;  // Toggle based on current state
        audioTrack.enabled = !newMuted;  // enabled is opposite of muted
        
        // Also update all peer connections to reflect the mute state
        peerConnections.current.forEach((pc, participantId) => {
          const senders = pc.getSenders();
          senders.forEach(sender => {
            if (sender.track?.kind === 'audio') {
              sender.track.enabled = !newMuted;
              console.log(`Updated sender track enabled: ${sender.track.enabled}`);
            }
          });
          
          // Notify participant of track update
          if (meetingId && currentUserId) {
            sendSignalingData(
              meetingId,
              participantId,
              { 
                type: "trackUpdate", 
                trackKind: "audio",
                enabled: !newMuted,
                userId: currentUserId
              },
              currentUserId,
              currentUserName
            );
          }
        });
        
        setIsMuted(newMuted);
        console.log(`Toggle Mute: track enabled = ${audioTrack.enabled}, isMuted = ${newMuted}`);
        showToast(
          newMuted ? "Muted" : "Unmuted",
          newMuted ? "Your mic is off" : "Your mic is on",
          "success"
        );
      } else {
        console.log('No audio tracks found');
      }
    } else {
      console.log('No local stream found');
    }
  }, [isMuted, localStreamRef, showToast, meetingId, currentUserId, currentUserName]);

  /* --------------------------------------------------
     🎥 Toggle Video
  -------------------------------------------------- */
  const toggleVideo = useCallback(() => {
    console.log('Toggle Video called. Current state:', { isVideoOff, localStream: localStreamRef.current });
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      console.log('Video tracks found:', videoTracks.map(t => ({id: t.id, enabled: t.enabled})));
      if (videoTracks.length > 0) {
        const videoTrack = videoTracks[0];
        const newVideoOff = !isVideoOff;  // Toggle based on current state
        videoTrack.enabled = !newVideoOff;  // enabled is opposite of videoOff
        setIsVideoOff(newVideoOff);
        console.log(`Toggle Video: track enabled = ${videoTrack.enabled}, isVideoOff = ${newVideoOff}`);
        showToast(
          newVideoOff ? "Video Off" : "Video On",
          newVideoOff ? "Your camera is off" : "Your camera is on",
          "success"
        );
      } else {
        console.log('No video tracks found');
      }
    } else {
      console.log('No local stream found');
    }
  }, [isVideoOff, localStreamRef, showToast]);

  /* --------------------------------------------------
     🖥️ Toggle Screen Share
  -------------------------------------------------- */
  const toggleScreenShare = useCallback(async () => {
    try {
      if (!isSharingScreen) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setIsSharingScreen(true);
        showToast("Screen Sharing", "You are now sharing your screen", "success");
        
        // Handle when screen sharing stops
        stream.getVideoTracks()[0].onended = () => {
          setIsSharingScreen(false);
          showToast("Screen Sharing", "You stopped sharing your screen", "info");
        };
      } else {
        setIsSharingScreen(false);
        showToast("Screen Sharing", "You stopped sharing your screen", "info");
      }
    } catch (error) {
      console.error("Error sharing screen:", error);
      showToast("Screen Sharing", "Could not share screen", "error");
    }
  }, [isSharingScreen, showToast]);

  /* --------------------------------------------------
     ✋ Toggle Raise Hand
  -------------------------------------------------- */
  const toggleRaiseHand = useCallback(() => {
    setHandRaised(prev => !prev);
    showToast(
      handRaised ? "Hand Lowered" : "Hand Raised",
      handRaised ? "Your hand has been lowered" : "Your hand is raised",
      "success"
    );
  }, [handRaised, showToast]);

  /* --------------------------------------------------
     📝 Send Message
  -------------------------------------------------- */
  const sendMessage = useCallback(() => {
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUserId,
      userName: currentUserName,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage("");
  }, [newMessage, currentUserId, currentUserName]);

  /* --------------------------------------------------
     ⌨️ Handle Key Press
  -------------------------------------------------- */
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  /* --------------------------------------------------
     😄 Send Reaction
  -------------------------------------------------- */
  const sendReaction = useCallback((emoji: string) => {
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
  }, []);

  /* --------------------------------------------------
     📹 Toggle Recording
  -------------------------------------------------- */
  const toggleRecording = useCallback(() => {
    setIsRecording(prev => !prev);
    showToast(
      isRecording ? "Recording Stopped" : "Recording Started",
      isRecording ? "Meeting recording has stopped" : "Meeting is now being recorded",
      "success"
    );
  }, [isRecording, showToast]);

  /* --------------------------------------------------
     🔒 Toggle Meeting Lock
  -------------------------------------------------- */
  const toggleMeetingLock = useCallback(() => {
    setIsMeetingLocked(prev => !prev);
    showToast(
      isMeetingLocked ? "Meeting Unlocked" : "Meeting Locked",
      isMeetingLocked ? "New participants can now join" : "No new participants can join",
      "success"
    );
  }, [isMeetingLocked, showToast]);

  /* --------------------------------------------------
     🔗 Copy Meeting Link
  -------------------------------------------------- */
  const copyMeetingLink = useCallback(() => {
    navigator.clipboard.writeText(meetingLink);
    showToast("Link Copied", "Meeting link copied to clipboard", "success");
  }, [meetingLink, showToast]);

  /* --------------------------------------------------
     📤 Share Meeting
  -------------------------------------------------- */
  const shareMeeting = useCallback(async () => {
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
  }, [meetingLink, copyMeetingLink]);

  /* --------------------------------------------------
     📌 Pin Participant
  -------------------------------------------------- */
  const pinParticipant = useCallback((participantId: string) => {
    setPinnedParticipant(prev => prev === participantId ? null : participantId);
  }, []);

  /* --------------------------------------------------
     🖥️ Toggle Fullscreen
  -------------------------------------------------- */
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  /* --------------------------------------------------
     🔊 Ensure Audio Playback
  -------------------------------------------------- */
  const ensureAudioPlayback = useCallback(async () => {
    // This is a simplified version - in a real implementation, you would ensure
    // all audio elements are properly configured and playing
    console.log("Ensuring audio playback for all participants");
  }, []);

  /* --------------------------------------------------
     🔊 Set Audio Output
  -------------------------------------------------- */
  const setAudioOutput = useCallback(async (deviceId: string) => {
    // This is a simplified version - in a real implementation, you would set
    // the audio output device for all audio elements
    console.log("Setting audio output device:", deviceId);
  }, []);

  /* --------------------------------------------------
     🔊 Check Audio Transmission
  -------------------------------------------------- */
  const checkAudioTransmission = useCallback(() => {
    if (!localStreamRef.current) {
      console.log("No local stream available for audio transmission check");
      return false;
    }

    const audioTracks = localStreamRef.current.getAudioTracks();
    if (audioTracks.length === 0) {
      console.log("No audio tracks found in local stream");
      return false;
    }

    const audioTrack = audioTracks[0];
    const isTransmitting = audioTrack.enabled && !isMuted;
    
    console.log("Audio transmission check:", {
      trackEnabled: audioTrack.enabled,
      isMuted: isMuted,
      isTransmitting: isTransmitting,
      trackId: audioTrack.id
    });
    
    return isTransmitting;
  }, [localStreamRef, isMuted]);

  /* --------------------------------------------------
     🧩 Lifecycle
  -------------------------------------------------- */
  useEffect(() => {
    const id = getMeetingId();
    if (id) {
      setMeetingId(id);
      setMeetingLink(`${window.location.origin}/video/${id}`);
    }
    getCurrentUser();
  }, [getMeetingId]);

  useEffect(() => {
    if (meetingId && currentUserId && connectionStatus === "disconnected") {
      initializeMedia();
    }
  }, [meetingId, currentUserId, connectionStatus]);

  // Meeting duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (connectionStatus === "connected") {
      interval = setInterval(() => {
        setMeetingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [connectionStatus]);

  /* --------------------------------------------------
     🔍 Debug logging
  -------------------------------------------------- */
  useEffect(() => {
    console.log('State changed: isMuted =', isMuted, 'isVideoOff =', isVideoOff);
    
    // Ensure tracks match state
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      const videoTracks = localStreamRef.current.getVideoTracks();
      
      if (audioTracks.length > 0) {
        const audioTrack = audioTracks[0];
        audioTrack.enabled = !isMuted;
        console.log(`Audio track updated: enabled = ${audioTrack.enabled}, isMuted = ${isMuted}`);
      }
      
      if (videoTracks.length > 0) {
        const videoTrack = videoTracks[0];
        videoTrack.enabled = !isVideoOff;
        console.log(`Video track updated: enabled = ${videoTrack.enabled}, isVideoOff = ${isVideoOff}`);
      }
    }
  }, [isMuted, isVideoOff, localStreamRef]);

  /* --------------------------------------------------
     🔚 Cleanup
  -------------------------------------------------- */
  useEffect(() => {
    return () => {
      leaveMeeting();
    };
  }, [leaveMeeting]);

  return {
    // State
    participants,
    chatMessages,
    newMessage,
    isMuted,
    isVideoOff,
    isSharingScreen,
    connectionStatus,
    meetingDuration,
    isRecording,
    handRaised,
    toasts,
    showReactions,
    reactions,
    networkQuality,
    isMeetingLocked,
    meetingId,
    showSettings,
    setShowSettings,
    showKeyboardShortcuts,
    setShowKeyboardShortcuts,
    isChatOpen,
    setIsChatOpen,
    isParticipantsOpen,
    setIsParticipantsOpen,
    isFullscreen,
    toggleFullscreen,
    meetingLink,
    pinnedParticipant,
    audioLevel,
    setToasts,
    // Add these
    currentUserId,
    currentUserName,
    
    // Speech functions
    isSpeechSupported,
    isSpeaking,
    isSpeechPaused,
    speechError,
    speakText,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    
    // Refs
    chatContainerRef,
    videoRef,
    localStreamRef,
    videoContainerRef,
    
    // Functions
    setNewMessage,
    setShowReactions,
    showToast,
    formatDuration,
    handleEndCall: leaveMeeting,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    toggleRaiseHand,
    sendMessage,
    handleKeyPress,
    sendReaction,
    toggleRecording,
    toggleMeetingLock,
    copyMeetingLink,
    shareMeeting,
    pinParticipant,
    setAudioOutput,
    ensureAudioPlayback,
    checkAudioTransmission, // Add this new function
  };
};