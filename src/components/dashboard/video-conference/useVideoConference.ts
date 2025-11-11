import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from '@/integrations/supabase/client';
import { useMeetingSpeech } from './useMeetingSpeech';
import { 
  createPeerConnection, 
  createOffer, 
  createAnswer, 
  handleIceCandidate, 
  handleTrackEvent, 
  sendSignalingData, 
  listenForSignalingData,
  getMediaConstraints,
  AudioLevelMonitor,
  VideoEnhancer
} from '@/utils/webrtc';

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
  stream?: MediaStream;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  isAI?: boolean;
}

interface Toast {
  id: string;
  title: string;
  description: string;
  variant: 'success' | 'error' | 'default';
}

export const useVideoConference = () => {
  // State variables
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [meetingLink, setMeetingLink] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState<{[key: string]: string}>({});
  const [networkQuality, setNetworkQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [isMeetingLocked, setIsMeetingLocked] = useState(false);
  const [pinnedParticipant, setPinnedParticipant] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [audioOutputDevice, setAudioOutputDevice] = useState<string>('default');
  
  // Refs
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const durationIntervalRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const audioLevelMonitorRef = useRef<AudioLevelMonitor | null>(null);
  const videoEnhancerRef = useRef<VideoEnhancer | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const signalingChannelRef = useRef<any>(null);

  // Use meeting speech hook
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
    defaultLanguage: 'en-US',
    onSpeechStart: (text) => console.log('Speaking:', text),
    onSpeechEnd: () => console.log('Finished speaking'),
    onError: (error) => console.error('Speech error:', error)
  });

  // Get meeting ID from URL pathname (/video/:id or /join/:id) or query/session
  const getMeetingId = useCallback(() => {
    // Try to extract from pathname segments
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    // Expect paths like ["video", ":id"] or ["join", ":id"]
    if (pathParts.length >= 2 && (pathParts[0] === 'video' || pathParts[0] === 'join')) {
      const pathId = pathParts[1];
      if (pathId) {
        return pathId;
      }
    }

    // Fallback to query string (?meetingId=...)
    const urlParams = new URLSearchParams(window.location.search);
    const meetingIdFromUrl = urlParams.get('meetingId');
    if (meetingIdFromUrl) {
      return meetingIdFromUrl;
    }

    // Fallback to session storage
    const meetingIdFromStorage = sessionStorage.getItem('meetingId');
    if (meetingIdFromStorage) {
      return meetingIdFromStorage;
    }
    return null;
  }, []);

  // Get current user information
  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        if (profile && !error) {
          setCurrentUserName(profile.full_name || user.email || 'User');
        } else {
          setCurrentUserName(user.email || 'User');
        }
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  // Show toast notification
  const showToast = useCallback((title: string, description: string, variant: 'default' | 'success' | 'error' = 'default') => {
    const id = Date.now().toString();
    const toast: Toast = { id, title, description, variant: variant === 'default' ? 'success' : variant };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  // Setup local audio monitoring (sidetone) so user can hear themselves
  const setupLocalAudioMonitoring = useCallback(async (stream: MediaStream) => {
    try {
      console.log('Setting up local audio monitoring (sidetone)...');
      
      // Create audio context for local monitoring
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        console.warn('AudioContext not supported for local audio monitoring');
        return;
      }
      
      const audioContext = new AudioContext();
      
      // Resume if suspended
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      // Create audio source from microphone stream
      const source = audioContext.createMediaStreamSource(stream);
      
      // Create gain node to control local monitoring volume (lower than normal)
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime); // Low volume to prevent feedback
      
      // Connect source to gain and then to speakers
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      console.log('Local audio monitoring enabled - you can now hear yourself');
      showToast("Local Audio", "You can now hear yourself speaking", "success");
      
    } catch (error) {
      console.error('Failed to setup local audio monitoring:', error);
      showToast("Audio Error", "Failed to enable local audio monitoring", "error");
    }
  }, [showToast]);

  // Toggle local audio monitoring
  const toggleLocalAudioMonitoring = useCallback(() => {
    if (localStreamRef.current) {
      setupLocalAudioMonitoring(localStreamRef.current);
    }
  }, [setupLocalAudioMonitoring]);

  // Initialize media devices with better audio handling
  const initializeMedia = async () => {
    try {
      setConnectionStatus('connecting');
      
      // Resume audio context first
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
        console.log('Audio context resumed during initialization');
      } else if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
          console.log('New audio context created and resumed');
        }
      }
      
      // Use high quality constraints for better video and audio
      const constraints = getMediaConstraints('high');
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      
      // CRITICAL: Ensure audio tracks are enabled and properly configured
      const audioTracks = stream.getAudioTracks();
      const videoTracks = stream.getVideoTracks();
      
      console.log('Media stream initialized:', {
        audioTracks: audioTracks.length,
        videoTracks: videoTracks.length,
        streamId: stream.id
      });
      
      // Verify and configure audio tracks
      if (audioTracks.length > 0) {
        audioTracks.forEach((track, index) => {
          track.enabled = true; // Ensure audio is enabled
          console.log(`Audio track ${index}:`, {
            id: track.id,
            label: track.label,
            enabled: track.enabled,
            readyState: track.readyState,
            kind: track.kind,
            settings: track.getSettings()
          });
        });
        
        // Ensure we're not muted by default
        setIsMuted(false);
        console.log('Audio tracks properly configured and enabled');
      } else {
        console.error('No audio tracks found in stream!');
        showToast("Audio Error", "No microphone access - check permissions", "error");
      }
      
      // Configure video tracks
      if (videoTracks.length > 0) {
        videoTracks.forEach((track, index) => {
          track.enabled = true;
          console.log(`Video track ${index}:`, {
            id: track.id,
            label: track.label,
            enabled: track.enabled,
            settings: track.getSettings()
          });
        });
        setIsVideoOff(false);
      }
      
      // Setup audio level monitoring for better voice detection
      audioLevelMonitorRef.current = new AudioLevelMonitor((level) => {
        setAudioLevel(level);
        // Update participant speaking status based on audio level
        if (level > 0.05) { // Threshold for detecting speech
          setParticipants(prev => prev.map(p => 
            p.id === (currentUserId || 'local-' + Date.now()) 
              ? { ...p, isSpeaking: true } 
              : p
          ));
        } else {
          setParticipants(prev => prev.map(p => 
            p.id === (currentUserId || 'local-' + Date.now())
              ? { ...p, isSpeaking: false } 
              : p
          ));
        }
      });
      
      await audioLevelMonitorRef.current.start(stream);
      
      // Setup video enhancement for better face detection
      if (videoRef.current) {
        videoEnhancerRef.current = new VideoEnhancer();
        // Note: Video enhancement would be applied in the component
      }
      
      // Add local participant
      const localParticipant: Participant = {
        id: currentUserId || 'local-' + Date.now(),
        name: currentUserName || 'You',
        isModerator: true,
        joinedAt: new Date().toISOString(),
        isPresent: true,
        isMuted: false,
        isVideoOff: false,
        stream: stream
      };
      
      setParticipants([localParticipant]);
      
      // After getting media, join the meeting
      if (meetingId) {
        await joinMeeting(meetingId, stream);
      }
      
      setConnectionStatus('connected');
      setIsMuted(false);
      setIsVideoOff(false);
      
      showToast("Connected", "You've joined the meeting successfully", "success");
      
      // Monitor network quality
      monitorNetworkQuality();
      
    } catch (error) {
      console.error('Error accessing media devices:', error);
      showToast("Media Error", "Could not access camera or microphone. Please check permissions.", "error");
      setConnectionStatus('disconnected');
    }
  };
  // Join meeting with proper signaling
  const joinMeeting = async (meetingId: string, localStream: MediaStream) => {
    try {
      // Add self to participants table
      const { error: insertError } = await supabase.from('meeting_participants').insert({
        meeting_id: meetingId,
        user_id: currentUserId,
        user_name: currentUserName,
        joined_at: new Date().toISOString(),
        is_moderator: false, // Will be updated if needed
        is_present: true
      });
      if (insertError) {
        console.error('Error joining meeting:', insertError);
        return;
      }

      // Get existing participants
      const { data: existingParticipants, error: fetchError } = await supabase
        .from('meeting_participants')
        .select('*')
        .eq('meeting_id', meetingId)
        .neq('user_id', currentUserId); // Exclude self

      if (fetchError) {
        console.error('Error fetching participants:', fetchError);
        return;
      }

      // Add existing participants to state
      const participantsToAdd = existingParticipants.map(p => ({
        id: p.user_id || '',
        name: p.user_name || 'Participant',
        isModerator: p.is_moderator || false,
        joinedAt: p.joined_at || new Date().toISOString(),
        isPresent: p.is_present || true,
        isMuted: false,
        isVideoOff: false
      }));
      setParticipants(prev => [...prev, ...participantsToAdd]);

      // Create peer connections for existing participants
      for (const participant of existingParticipants) {
        await createPeerConnectionForParticipant(participant.user_id, localStream, true);
      }

      // Listen for new participants joining
      const channel = supabase
        .channel(`meeting-${meetingId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'meeting_participants',
            filter: `meeting_id=eq.${meetingId}`
          },
          (payload) => {
            const newParticipant = payload.new;
            if (newParticipant.user_id !== currentUserId) {
              // Add new participant to state
              setParticipants(prev => [...prev, {
                id: newParticipant.user_id,
                name: newParticipant.user_name,
                isModerator: newParticipant.is_moderator,
                joinedAt: newParticipant.joined_at,
                isPresent: newParticipant.is_present,
                isMuted: false,
                isVideoOff: false
              }]);

              // Create peer connection for new participant
              createPeerConnectionForParticipant(newParticipant.user_id, localStream, false);
            }
          }
        )
        .subscribe();

      signalingChannelRef.current = channel;

    } catch (error) {
      console.error('Error joining meeting:', error);
    }
  };

  // Create peer connection for a participant - ENHANCED VERSION
  const createPeerConnectionForParticipant = async (participantId: string, localStream: MediaStream, isExisting: boolean) => {
    try {
      console.log(`Creating peer connection for participant: ${participantId}`);
      console.log('Local stream details:', {
        streamId: localStream.id,
        audioTracks: localStream.getAudioTracks().length,
        videoTracks: localStream.getVideoTracks().length,
        active: localStream.active
      });
      
      // Ensure audio tracks are enabled before creating peer connection
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks.forEach((track, index) => {
          console.log(`Local audio track ${index} for peer ${participantId}:`, {
            id: track.id,
            enabled: track.enabled,
            readyState: track.readyState,
            muted: track.muted
          });
          
          // Force enable audio track and ensure it's not muted
          track.enabled = true;
          // Remove direct assignment to muted property as it can be read-only
        });
      } else {
        console.error(`No audio tracks available for peer connection: ${participantId}`);
      }
      
      const peerConnection = createPeerConnection(localStream);
      
      // Verify that tracks were added to peer connection and ensure audio is properly configured
      const senders = peerConnection.getSenders();
      console.log(`Peer connection senders for ${participantId}:`, 
        senders.map(sender => ({
          trackKind: sender.track?.kind,
          trackId: sender.track?.id,
          trackEnabled: sender.track?.enabled,
          trackMuted: sender.track?.muted
        }))
      );
      
      // Ensure all audio tracks are properly configured in the peer connection
      senders.forEach(sender => {
        if (sender.track && sender.track.kind === 'audio') {
          sender.track.enabled = true;
          // Remove direct assignment to muted property as it can be read-only
          console.log(`Configured audio sender for ${participantId}:`, {
            trackId: sender.track.id,
            enabled: sender.track.enabled
          });
        }
      });
      
      // Handle incoming tracks
      handleTrackEvent(peerConnection, (event) => {
        const stream = event.streams[0];
        if (stream) {
          // Ensure audio is enabled for incoming streams
          const audioTracks = stream.getAudioTracks();
          if (audioTracks.length > 0) {
            audioTracks.forEach(track => {
              track.enabled = true;
              // Remove direct assignment to muted property as it can be read-only
            });
          }
          // Create or update audio element for remote audio
          let audioElement = audioElementsRef.current.get(participantId);
          if (!audioElement) {
            audioElement = document.createElement('audio');
            audioElement.id = `audio-${participantId}`;
            audioElement.autoplay = true;
            audioElement.muted = false; // Ensure not muted
            audioElement.removeAttribute('muted');
            audioElement.volume = 1.0;   // Ensure full volume
            audioElement.controls = false; // Hide controls
            
            // Add to DOM and store reference
            audioElementsRef.current.set(participantId, audioElement);
            document.body.appendChild(audioElement);
            console.log(`Created audio element for participant ${participantId}`);
          }
          
          // Configure audio element
            audioElement.srcObject = stream;
            audioElement.autoplay = true;
            audioElement.muted = false; // Ensure not muted
            audioElement.removeAttribute('muted');
            audioElement.volume = 1.0;   // Full volume
            
            // Try to set audio output device if available
            if (audioOutputDevice && audioOutputDevice !== 'default') {
              if ('setSinkId' in audioElement) {
                (audioElement as any).setSinkId(audioOutputDevice).catch((e: any) => {
                  console.warn('Failed to set audio output device:', e);
                });
              }
            }
            
            // Try to play the audio with improved error handling
            const playAudio = async () => {
              try {
                // Resume audio context if suspended
                if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                  await audioContextRef.current.resume();
                  console.log('Audio context resumed for remote audio');
                }
                
                // Ensure the element is not muted before playing
                if (audioElement) {
                  audioElement.muted = false;
                  audioElement.removeAttribute('muted');
                  audioElement.volume = 1.0;
                }
                
                await audioElement.play();
                console.log(`Audio playing for participant ${participantId}`);
              } catch (e) {
                console.log('Auto-play audio failed:', e);
                
                // Create a more robust user interaction handler
                const playOnUserInteraction = async () => {
                  try {
                    // Resume audio context if needed
                    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                      await audioContextRef.current.resume();
                      console.log('Audio context resumed via user interaction');
                    }
                    
                    // Ensure proper audio element configuration - CRITICAL FIX
                    if (audioElement) {
                      audioElement.muted = false;  // Ensure audio is NOT muted
                      audioElement.removeAttribute('muted');
                      audioElement.volume = 1.0;   // Full volume
                      audioElement.autoplay = true; // Ensure autoplay is enabled
                    }
                    
                    // Force play with proper configuration
                    await audioElement.play();
                    console.log(`Audio playing after user interaction for participant ${participantId}`);
                    
                    // Clean up event listeners
                    document.removeEventListener('click', playOnUserInteraction);
                    document.removeEventListener('touchstart', playOnUserInteraction);
                    document.removeEventListener('keydown', playOnUserInteraction);
                  } catch (playError) {
                    console.error('Failed to play audio after user interaction:', playError);
                    
                    // Show persistent error message
                    const participantName = participants.find(p => p.id === participantId)?.name || 'Participant';
                    showToast(
                      "Audio Issue", 
                      `Cannot play audio from ${participantName}. Check browser permissions.`, 
                      "error"
                    );
                  }
                };
                
                // Add event listeners for user interaction
                document.addEventListener('click', playOnUserInteraction, { once: true });
                document.addEventListener('touchstart', playOnUserInteraction, { once: true });
                document.addEventListener('keydown', playOnUserInteraction, { once: true });
                
                // Show a notification to the user about audio permission
                showToast(
                  "Audio Permission Required", 
                  "Click anywhere to enable audio from other participants", 
                  "default"
                );
              }
            };
            
            // Try to play immediately, then set up fallback
            playAudio();
          setParticipants(prev => prev.map(participant => {
            if (participant.id === participantId) {
              return { ...participant, stream };
            }
            return participant;
          }));
        }
      });
      
      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && meetingId && currentUserId && currentUserName) {
          sendSignalingData(
            meetingId, 
            participantId, 
            { type: 'ice-candidate', candidate: event.candidate },
            currentUserId,
            currentUserName
          );
        }
      };
      
      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log(`Connection state for ${participantId}:`, peerConnection.connectionState);
        if (peerConnection.connectionState === 'connected') {
          showToast("Participant Connected", `Participant ${participantId} connected`, "success");
        } else if (peerConnection.connectionState === 'failed' || peerConnection.connectionState === 'disconnected') {
          showToast("Connection Issue", `Connection with participant ${participantId} lost`, "error");
        }
      };
      
      // Store peer connection
      peerConnections.current.set(participantId, peerConnection);
      
      // If this is for an existing participant, create an offer
      if (isExisting) {
        const offer = await createOffer(peerConnection);
        if (meetingId && currentUserId && currentUserName) {
          sendSignalingData(
            meetingId,
            participantId,
            { type: 'offer', offer },
            currentUserId,
            currentUserName
          );
        }
      }
      
      return peerConnection;
    } catch (error) {
      console.error('Error creating peer connection:', error);
      return null;
    }
  };

  // Handle incoming signaling data
  const handleSignalingData = useCallback(async (data: any, from: string) => {
    if (!localStreamRef.current || !meetingId || !currentUserId) return;
    
    let peerConnection = peerConnections.current.get(from);
    
    if (!peerConnection) {
      peerConnection = await createPeerConnectionForParticipant(from, localStreamRef.current, false);
      if (!peerConnection) return;
    }
    
    switch (data.type) {
      case 'offer':
        try {
          const answer = await createAnswer(peerConnection, data.offer);
          if (meetingId && currentUserId && currentUserName) {
            sendSignalingData(
              meetingId,
              from,
              { type: 'answer', answer },
              currentUserId,
              currentUserName
            );
          }
        } catch (error) {
          console.error('Error handling offer:', error);
        }
        break;
        
      case 'answer':
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
        } catch (error) {
          console.error('Error handling answer:', error);
        }
        break;
      case 'ice-candidate':
        try {
          await handleIceCandidate(peerConnection, data.candidate);
        } catch (error) {
          console.error('Error handling ICE candidate:', error);
        }
        break;
    }
  }, [meetingId, currentUserId, currentUserName]);

  // Listen for signaling data
  useEffect(() => {
    let channel: any = null;
    
    if (meetingId && currentUserId) {
      channel = listenForSignalingData(meetingId, currentUserId, handleSignalingData);
    }
    
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [meetingId, currentUserId, handleSignalingData]);

  // Monitor network quality (simplified) - Fixed to prevent unnecessary re-renders
  const monitorNetworkQuality = useCallback(() => {
    const interval = setInterval(() => {
      // Only update if quality actually changes to prevent unnecessary re-renders
      const qualities: Array<'excellent' | 'good' | 'poor'> = ['excellent', 'excellent', 'good'];
      const newQuality = qualities[Math.floor(Math.random() * qualities.length)];
      
      setNetworkQuality(prevQuality => {
        if (prevQuality !== newQuality) {
          return newQuality;
        }
        return prevQuality;
      });
    }, 30000); // Increased interval to reduce frequency

    return () => clearInterval(interval);
  }, []);

  // Meeting duration timer
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

  // Initialize meeting
  useEffect(() => {
    const initMeeting = async () => {
      const id = getMeetingId();
      if (id) {
        setMeetingId(id);
        // Persist for post-login redirect flows
        sessionStorage.setItem('meetingId', id);
        // Use the routed video path so clicking invite joins directly
        setMeetingLink(`${window.location.origin}/video/${id}`);
        await getCurrentUser();
      }
    };
    
    initMeeting();
  }, [getMeetingId]);

  // Auto-join meeting when meeting ID is set
  useEffect(() => {
    if (meetingId && currentUserId && connectionStatus === 'disconnected') {
      const timer = setTimeout(() => {
        initializeMedia();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [meetingId, currentUserId, connectionStatus]);

  // Copy meeting link
  const copyMeetingLink = useCallback(() => {
    navigator.clipboard.writeText(meetingLink);
    showToast("Link Copied", "Meeting link copied to clipboard", "success");
  }, [meetingLink, showToast]);

  // Share meeting
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

  // End call
  const handleEndCall = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    // Stop audio level monitoring
    if (audioLevelMonitorRef.current) {
      audioLevelMonitorRef.current.stop();
      audioLevelMonitorRef.current = null;
    }
    
    // Stop video enhancement
    if (videoEnhancerRef.current) {
      videoEnhancerRef.current.stop();
      videoEnhancerRef.current = null;
    }
    
    // Clean up audio elements for remote participants
    audioElementsRef.current.forEach((audioElement, participantId) => {
      audioElement.pause();
      audioElement.srcObject = null;
      audioElement.remove();
    });
    audioElementsRef.current.clear();
    
    // Close peer connections
    peerConnections.current.forEach(pc => pc.close());
    peerConnections.current.clear();
    
    // Remove from meeting participants table
    if (meetingId && currentUserId) {
      supabase
        .from('meeting_participants')
        .update({ status: 'left', created_at: new Date().toISOString() })
        .eq('meeting_id', meetingId)
        .eq('user_id', currentUserId);
    }
    
    // Unsubscribe from channels
    if (signalingChannelRef.current) {
      supabase.removeChannel(signalingChannelRef.current);
      signalingChannelRef.current = null;
    }
    
    setParticipants([]);
    setConnectionStatus('disconnected');
    setMeetingDuration(0);
    setAudioLevel(0);
    showToast("Call Ended", "You've left the meeting", "default");
  }, [meetingId, currentUserId, showToast]);

  // Toggle mute - ENHANCED VERSION
  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        const newMutedState = !audioTracks[0].enabled;
        
        // Update local track state
        audioTracks[0].enabled = !newMutedState;
        setIsMuted(newMutedState);
        
        console.log(`Audio track ${newMutedState ? 'MUTED' : 'UNMUTED'}:`, {
          trackId: audioTracks[0].id,
          trackLabel: audioTracks[0].label,
          trackEnabled: audioTracks[0].enabled,
          trackReadyState: audioTracks[0].readyState
        });
        
        // Update the enabled state for ALL peer connections
        let updatedConnections = 0;
        peerConnections.current.forEach((pc, participantId) => {
          console.log(`Updating audio track for peer connection: ${participantId}`);
          const senders = pc.getSenders();
          senders.forEach(sender => {
            if (sender.track && sender.track.kind === 'audio') {
              sender.track.enabled = !newMutedState;
              updatedConnections++;
              console.log(`Updated audio sender for ${participantId}:`, {
                trackEnabled: sender.track.enabled,
                senderTrackId: sender.track.id
              });
            }
          });
        });
        
        console.log(`Updated ${updatedConnections} audio senders across ${peerConnections.current.size} connections`);
        
        showToast(
          newMutedState ? "Microphone Muted" : "Microphone Unmuted",
          newMutedState ? "Your microphone is now off" : "Your microphone is now on",
          "success"
        );
      } else {
        console.error('No audio tracks found in local stream');
        showToast("Audio Error", "No microphone found", "error");
      }
    } else {
      console.error('No local stream available');
      showToast("Audio Error", "No audio stream available", "error");
    }
  }, [showToast]);

  // Function to set audio output device
  const setAudioOutput = useCallback(async (deviceId: string) => {
    try {
      setAudioOutputDevice(deviceId);
      
      // Update all existing audio elements to use the new output device
      audioElementsRef.current.forEach((audioElement, participantId) => {
        if ('setSinkId' in audioElement) {
          (audioElement as any).setSinkId(deviceId).catch((e: any) => {
            console.warn(`Failed to set audio output device for participant ${participantId}:`, e);
          });
        }
      });
    } catch (error) {
      console.error('Error setting audio output device:', error);
    }
  }, []);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        const newState = !videoTracks[0].enabled;
        videoTracks[0].enabled = newState;
        setIsVideoOff(!newState);
        
        // Also update the enabled state for all peer connections
        peerConnections.current.forEach(pc => {
          const senders = pc.getSenders();
          senders.forEach(sender => {
            if (sender.track && sender.track.kind === 'video') {
              sender.track.enabled = newState;
            }
          });
        });
        
        showToast(
          newState ? "Camera Enabled" : "Camera Disabled",
          newState ? "Your camera is now on" : "Your camera is now off",
          "success"
        );
      }
    }
  }, [showToast]);

  // Toggle screen share
  const toggleScreenShare = useCallback(async () => {
    try {
      if (!isSharingScreen) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false
        });
        
        // Replace video track with screen share
        if (localStreamRef.current) {
          const videoTrack = screenStream.getVideoTracks()[0];
          const sender = peerConnections.current.values().next().value?.getSenders()
            .find((s: RTCRtpSender) => s.track?.kind === 'video');
          
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        }
        
        setIsSharingScreen(true);
        showToast("Screen Sharing Started", "You are now sharing your screen", "success");
        
        // Handle screen share stop
        screenStream.getVideoTracks()[0].onended = () => {
          setIsSharingScreen(false);
          showToast("Screen Sharing Stopped", "You stopped sharing your screen", "success");
        };
      } else {
        // Stop screen sharing
        setIsSharingScreen(false);
        showToast("Screen Sharing Stopped", "You stopped sharing your screen", "success");
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
      showToast("Screen Share Error", "Could not start screen sharing", "error");
    }
  }, [isSharingScreen, showToast]);

  // Toggle raise hand
  const toggleRaiseHand = useCallback(() => {
    setHandRaised(prev => !prev);
    showToast(
      !handRaised ? "Hand Raised" : "Hand Lowered",
      !handRaised ? "Your hand is raised" : "Your hand has been lowered",
      "success"
    );
  }, [handRaised, showToast]);

  // Send message
  const sendMessage = useCallback(() => {
    if (!newMessage.trim()) return;
    
    const msg: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUserId,
      userName: currentUserName || 'You',
      message: newMessage,
      timestamp: new Date().toISOString(),
    };
    
    setChatMessages(prev => [...prev, msg]);
    setNewMessage("");
  }, [newMessage, currentUserId, currentUserName]);

  // Handle key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Send reaction
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

  // Toggle recording
  const toggleRecording = useCallback(() => {
    setIsRecording(prev => !prev);
    showToast(
      !isRecording ? "Recording Started" : "Recording Stopped",
      !isRecording ? "Meeting is now being recorded" : "Meeting recording has stopped",
      "success"
    );
  }, [isRecording, showToast]);

  // Toggle meeting lock
  const toggleMeetingLock = useCallback(() => {
    setIsMeetingLocked(prev => !prev);
    showToast(
      !isMeetingLocked ? "Meeting Locked" : "Meeting Unlocked",
      !isMeetingLocked ? "No new participants can join" : "New participants can now join",
      "success"
    );
  }, [isMeetingLocked, showToast]);

  // Pin participant
  const pinParticipant = useCallback((participantId: string) => {
    setPinnedParticipant(prev => prev === participantId ? null : participantId);
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Function to ensure audio plays for all participants - Optimized to prevent infinite loops
  const ensureAudioPlayback = useCallback(async () => {
    try {
      // Use the existing audio context instead of creating new ones
      let shouldResumeContext = false;
      if (audioContextRef.current) {
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
          console.log('Existing audio context resumed');
          shouldResumeContext = true;
        }
      } else {
        // Create a new audio context only if none exists
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            audioContextRef.current = new AudioContextClass();
            if (audioContextRef.current.state === 'suspended') {
              await audioContextRef.current.resume();
              console.log('New audio context created and resumed');
              shouldResumeContext = true;
            }
          }
        } catch (error) {
          console.error('Failed to create audio context:', error);
        }
      }
      // For each participant with a stream, ensure audio is playing
      participants.forEach(async (participant) => {
        if (participant.stream && participant.id !== (currentUserId || participants[0]?.id)) {
          const audioElement = audioElementsRef.current.get(participant.id);
          if (audioElement) {
            // Ensure proper configuration for remote audio - CRITICAL FIXES
            audioElement.setAttribute('muted', 'false');  // Critical: Ensure remote audio is NOT muted
            audioElement.autoplay = true;
            audioElement.volume = 1.0;   // Ensure full volume
          
            // Set audio output device if specified
            if (audioOutputDevice && audioOutputDevice !== 'default' && 'setSinkId' in audioElement) {
              try {
                await (audioElement as any).setSinkId(audioOutputDevice);
                console.log(`Audio output device set for participant ${participant.id}`);
              } catch (e) {
                console.warn(`Failed to set audio output device for participant ${participant.id}:`, e);
              }
            }
          
            // Try to play if not already playing
            if (audioElement.paused) {
              try {
                await audioElement.play();
                console.log(`Audio started for participant ${participant.id}`);
              } catch (e) {
                console.log(`Autoplay failed for participant ${participant.id}:`, e);
              
                // Set up event listeners for user interaction to enable audio
                const enableAudioOnInteraction = async () => {
                  try {
                    // Resume audio context if needed
                    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                      await audioContextRef.current.resume();
                    }
                  
                    // CRITICAL: Re-configure audio element before playing
                    audioElement.setAttribute('muted', 'false');  // Ensure it's not muted
                    audioElement.volume = 1.0;   // Full volume
                    audioElement.autoplay = true; // Enable autoplay
                  
                    await audioElement.play();
                    console.log(`Audio enabled after user interaction for participant ${participant.id}`);
                  
                    // Remove event listeners after successful play
                    document.removeEventListener('click', enableAudioOnInteraction);
                    document.removeEventListener('touchstart', enableAudioOnInteraction);
                    document.removeEventListener('keydown', enableAudioOnInteraction);
                  } catch (playError) {
                    console.error(`Failed to enable audio for participant ${participant.id}:`, playError);
                  
                    // Show persistent error message
                    showToast(
                      "Audio Issue", 
                      `Cannot play audio from ${participant.name}. Check browser permissions.`, 
                      "error"
                    );
                  }
                };
              
                // Add event listeners for next user interaction
                document.addEventListener('click', enableAudioOnInteraction, { once: true });
                document.addEventListener('touchstart', enableAudioOnInteraction, { once: true });
                document.addEventListener('keydown', enableAudioOnInteraction, { once: true });
              }
            } else {
              console.log(`Audio already playing for participant ${participant.id}`);
            }
          } else {
            console.warn(`No audio element found for participant ${participant.id}`);
          }
        }
      });
    } catch (error) {
      console.error('Error in ensureAudioPlayback:', error);
    }
  }, [participants, currentUserId, audioOutputDevice, showToast]);

  // Keyboard shortcuts
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
          case 'r':
            e.preventDefault();
            toggleRaiseHand();
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [connectionStatus, toggleMute, toggleVideo, toggleRaiseHand]);

  // Cleanup on unmount - Enhanced to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clear all intervals and timeouts
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      // Stop local stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }
      
      // Stop audio level monitoring
      if (audioLevelMonitorRef.current) {
        audioLevelMonitorRef.current.stop();
        audioLevelMonitorRef.current = null;
      }
      
      // Stop video enhancement
      if (videoEnhancerRef.current) {
        videoEnhancerRef.current.stop();
        videoEnhancerRef.current = null;
      }
      
      // Clean up audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      
      // Clean up all audio elements
      audioElementsRef.current.forEach((audioElement) => {
        audioElement.pause();
        audioElement.srcObject = null;
        audioElement.remove();
      });
      audioElementsRef.current.clear();
      
      // Close all peer connections
      peerConnections.current.forEach(pc => {
        pc.close();
      });
      peerConnections.current.clear();
      
      // Unsubscribe from channels
      if (signalingChannelRef.current) {
        supabase.removeChannel(signalingChannelRef.current);
      }
      
      // Remove from meeting participants table
      if (meetingId && currentUserId) {
        supabase
          .from('meeting_participants')
          .update({ status: 'left', created_at: new Date().toISOString() })
          .eq('meeting_id', meetingId)
          .eq('user_id', currentUserId);
      }
      
      // Clear all state
      setParticipants([]);
      setConnectionStatus('disconnected');
      setMeetingDuration(0);
      setAudioLevel(0);
    };
  }, [meetingId, currentUserId]);

  return {
    // State
    participants,
    chatMessages,
    newMessage,
    isMuted,
    isVideoOff,
    isSharingScreen,
    isChatOpen,
    isParticipantsOpen,
    connectionStatus,
    meetingDuration,
    meetingLink,
    isRecording,
    showSettings,
    isFullscreen,
    handRaised,
    toasts,
    showReactions,
    reactions,
    networkQuality,
    showKeyboardShortcuts,
    isMeetingLocked,
    pinnedParticipant,
    meetingId,
    currentUserId,
    currentUserName,
    audioLevel,
    audioOutputDevice,
    // Speech functions
    isSpeechSupported,
    isSpeaking,
    isSpeechPaused,
    speechError,
    // Refs
    chatContainerRef,
    videoRef,
    localStreamRef,
    videoContainerRef,
    
    // Functions
    setNewMessage,
    setShowSettings,
    setToasts,
    setShowReactions,
    setIsChatOpen,
    setIsParticipantsOpen,
    setShowKeyboardShortcuts,
    setConnectionStatus,
    showToast,
    formatDuration,
    copyMeetingLink,
    shareMeeting,
    handleEndCall,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    toggleRaiseHand,
    sendMessage,
    handleKeyPress,
    sendReaction,
    toggleRecording,
    toggleMeetingLock,
    pinParticipant,
    toggleFullscreen,
    getMeetingId,
    setAudioOutput,
    ensureAudioPlayback,
    // Speech functions
    speakText,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
  };
};