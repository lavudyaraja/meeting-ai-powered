import React, { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Video, VideoOff, Mic, MicOff, Loader2, User } from "lucide-react";

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

interface VideoConferenceMainProps {
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  videoRef: React.RefObject<HTMLVideoElement>;
  isVideoOff: boolean;
  reactions: { [key: string]: string };
  localStreamRef: React.RefObject<MediaStream>;
  videoContainerRef: React.RefObject<HTMLDivElement>;
  showToast: (title: string, description: string, variant?: 'default' | 'success' | 'error') => void;
  participants: Participant[];
  pinnedParticipant: string | null;
  audioLevel: number;
}

export const VideoConferenceMain = ({
  connectionStatus,
  videoRef,
  isVideoOff,
  reactions,
  localStreamRef,
  videoContainerRef,
  showToast,
  participants,
  pinnedParticipant,
  audioLevel
}: VideoConferenceMainProps) => {
  const [videoError, setVideoError] = useState(false);
  const videoElementsRef = useRef<{[key: string]: HTMLVideoElement | null}>({});
  const audioElementsRef = useRef<{[key: string]: HTMLAudioElement | null}>({});

  // Set up video stream when connected
  useEffect(() => {
    const setupVideo = async () => {
      if (videoRef.current && localStreamRef.current && connectionStatus === 'connected') {
        try {
          videoRef.current.srcObject = localStreamRef.current;
          // Ensure audio is also enabled for local stream
          const audioTracks = localStreamRef.current.getAudioTracks();
          if (audioTracks.length > 0) {
            audioTracks[0].enabled = true;
          }
          // Ensure video is also enabled for local stream
          const videoTracks = localStreamRef.current.getVideoTracks();
          if (videoTracks.length > 0) {
            videoTracks[0].enabled = true;
          }
          await videoRef.current.play();
          setVideoError(false);
          console.log('Local video playback started successfully');
        } catch (error) {
          console.error('Error playing video:', error);
          setVideoError(true);
        }
      }
    };
    
    setupVideo();
  }, [connectionStatus, localStreamRef, videoRef]);

  // Setup local audio monitoring
  useEffect(() => {
    let localAudioElement: HTMLAudioElement | null = null;
    
    const setupLocalAudioMonitoring = async () => {
      if (localStreamRef.current && connectionStatus === 'connected') {
        // Create a separate audio element for local audio monitoring
        // This allows users to hear their own audio
        localAudioElement = document.createElement('audio');
        localAudioElement.srcObject = localStreamRef.current;
        localAudioElement.muted = false; // Enable local audio monitoring
        localAudioElement.volume = 0.1; // Low volume to avoid feedback
        localAudioElement.autoplay = true;
        document.body.appendChild(localAudioElement);
        
        // Try to play the local audio
        try {
          await localAudioElement.play();
          console.log('Local audio monitoring started');
        } catch (error) {
          console.log('Local audio monitoring requires user interaction');
          // Set up user interaction handler
          const enableAudioOnInteraction = async () => {
            try {
              await localAudioElement!.play();
              console.log('Local audio monitoring enabled after user interaction');
            } catch (e) {
              console.error('Failed to enable local audio monitoring:', e);
            }
            document.removeEventListener('click', enableAudioOnInteraction);
          };
          document.addEventListener('click', enableAudioOnInteraction, { once: true });
        }
      }
    };
    
    setupLocalAudioMonitoring();
    
    // Cleanup function
    return () => {
      if (localAudioElement) {
        localAudioElement.pause();
        localAudioElement.srcObject = null;
        localAudioElement.remove();
      }
    };
  }, [connectionStatus, localStreamRef]);

  // Setup video and audio elements for participants
  useEffect(() => {
    participants.forEach(participant => {
      if (participant.stream) {
        // Setup video element
        if (videoElementsRef.current[participant.id]) {
          const videoElement = videoElementsRef.current[participant.id];
          if (videoElement && videoElement.srcObject !== participant.stream) {
            videoElement.srcObject = participant.stream;
            
            // For remote participants, mute video element to avoid audio duplication
            // Audio is handled separately through dedicated audio elements
            if (participant.id !== participants[0]?.id) {
              videoElement.muted = true; // Mute video element, audio handled separately
              videoElement.play().catch(e => console.log('Auto-play video:', e));
            }
          }
        }
        
        // Setup audio element for remote participants
        if (participant.id !== participants[0]?.id) {
          let audioElement = audioElementsRef.current[participant.id];
          
          // Create audio element if it doesn't exist
          if (!audioElement) {
            audioElement = document.createElement('audio');
            audioElement.id = `audio-${participant.id}`;
            // Set additional attributes to improve autoplay
            audioElement.autoplay = true;
            audioElement.muted = false;  // Critical: Remote audio should NOT be muted
            audioElement.volume = 1.0;   // Full volume
            audioElement.controls = false;
            audioElementsRef.current[participant.id] = audioElement;
            document.body.appendChild(audioElement);
            
            console.log(`Audio element created for participant ${participant.id}`);
          }
          
          // Update audio element source
          if (audioElement.srcObject !== participant.stream) {
            audioElement.srcObject = participant.stream;
            audioElement.autoplay = true;
            audioElement.muted = false;  // Ensure remote audio is NOT muted
            audioElement.volume = 1.0;   // Ensure full volume
            
            // Try to play the audio with better error handling
            const playAudio = async () => {
              try {
                // Resume audio context if needed
                if (typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined') {
                  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                  const context = new AudioContext();
                  if (context.state === 'suspended') {
                    await context.resume();
                    console.log('Audio context resumed in VideoConferenceMain');
                  }
                }
                
                // Ensure audio element is properly configured
                audioElement.muted = false;
                audioElement.volume = 1.0;
                
                await audioElement.play();
                console.log(`Audio playing for participant ${participant.id}`);
              } catch (e) {
                console.log('Auto-play audio failed:', e);
                
                // Request user interaction to play audio
                const playOnInteraction = async () => {
                  try {
                    // Ensure proper configuration before playing
                    audioElement.muted = false;
                    audioElement.volume = 1.0;
                    
                    await audioElement.play();
                    console.log(`Audio playing after user interaction for participant ${participant.id}`);
                  } catch (playError) {
                    console.error('Failed to play audio after user interaction:', playError);
                    
                    // Create a visual indicator for audio issues
                    const indicator = document.createElement('div');
                    indicator.style.cssText = `
                      position: fixed;
                      top: 20px;
                      right: 20px;
                      background: #ef4444;
                      color: white;
                      padding: 10px 15px;
                      border-radius: 8px;
                      z-index: 10000;
                      font-size: 14px;
                      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    `;
                    indicator.textContent = `Audio issue with ${participant.name}`;
                    document.body.appendChild(indicator);
                    
                    // Remove indicator after 5 seconds
                    setTimeout(() => {
                      if (indicator.parentNode) {
                        indicator.parentNode.removeChild(indicator);
                      }
                    }, 5000);
                  }
                  document.removeEventListener('click', playOnInteraction);
                  document.removeEventListener('touchstart', playOnInteraction);
                  document.removeEventListener('keydown', playOnInteraction);
                };
                document.addEventListener('click', playOnInteraction, { once: true });
                document.addEventListener('touchstart', playOnInteraction, { once: true });
                document.addEventListener('keydown', playOnInteraction, { once: true });
              }
            };
            
            playAudio();
          }
        }
      }
    });
    
    // Cleanup function - only clean up audio elements, not video elements as they're managed separately
    return () => {
      Object.values(audioElementsRef.current).forEach(audioElement => {
        if (audioElement) {
          audioElement.pause();
          audioElement.srcObject = null;
          audioElement.remove();
        }
      });
      audioElementsRef.current = {};
    };
  }, [participants]);

  // Render single participant video
  const renderParticipantVideo = (participant: Participant, isLarge: boolean = false) => {
    const hasVideo = participant.stream && !participant.isVideoOff;
    const isLocalParticipant = participant.id === participants[0]?.id;
    
    return (
      <div
        key={participant.id}
        className={`
          relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900
          ${isLarge ? 'col-span-2 row-span-2' : ''}
          shadow-2xl border-2 border-slate-700/50
          transition-all duration-300 hover:border-blue-500/50
          ${participant.isSpeaking ? 'ring-4 ring-green-500 ring-opacity-70' : ''}
        `}
      >
        {hasVideo ? (
          <video
            autoPlay
            playsInline
            // Only mute local participant's video element to avoid feedback
            muted={isLocalParticipant}
            className="w-full h-full object-cover"
            ref={(video) => {
              if (video) {
                videoElementsRef.current[participant.id] = video;
                if (participant.stream && video.srcObject !== participant.stream) {
                  video.srcObject = participant.stream;
                  
                  // For remote participants, mute video element to avoid audio duplication
                  // Audio is handled separately through dedicated audio elements
                  if (!isLocalParticipant) {
                    video.muted = true; // Mute video element, audio handled separately
                    video.play().catch(e => console.log('Auto-play video:', e));
                  } else {
                    // For local participant, ensure video plays
                    video.muted = true; // Mute to avoid feedback
                    const playVideo = async () => {
                      try {
                        await video.play();
                        console.log('Local video playback started');
                      } catch (error) {
                        console.log('Local video playback requires user interaction:', error);
                      }
                    };
                    playVideo();
                  }
                }
              }
            }}
            onPlay={() => {
              // Ensure video plays properly
              const video = videoElementsRef.current[participant.id];
              if (video && video.paused) {
                video.play().catch(e => console.log('Auto-play prevented:', e));
              }
            }}
            style={{
              // Apply CSS enhancements for better face visibility
              filter: 'brightness(1.05) contrast(1.1) saturate(1.1)',
              transform: 'scaleX(-1)', // Mirror effect for better self-view
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto shadow-2xl">
                <User className="w-12 h-12 text-white" />
              </div>
              <p className="text-white font-semibold text-lg">{participant.name}</p>
              {participant.isVideoOff && (
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <VideoOff className="w-5 h-5" />
                  <span className="text-sm">Camera off</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Audio level indicator */}
        {isLocalParticipant && audioLevel > 0 && (
          <div className="absolute top-4 left-4">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-4 rounded-full ${
                    i < Math.floor(audioLevel * 5) 
                      ? 'bg-green-500' 
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Participant info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm drop-shadow-lg">
                {participant.name}
              </span>
              {participant.isModerator && (
                <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">
                  Host
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {participant.isMuted ? (
                <div className="p-1.5 bg-red-500/90 rounded-full">
                  <MicOff className="w-3 h-3 text-white" />
                </div>
              ) : (
                <div className={`p-1.5 rounded-full ${participant.isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-700/90'}`}>
                  <Mic className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render participant grid
  const renderParticipantGrid = () => {
    if (participants.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto animate-pulse">
              <User className="w-10 h-10 text-blue-500" />
            </div>
            <p className="text-gray-500 font-medium">Waiting for participants to join...</p>
          </div>
        </div>
      );
    }

    // Find pinned participant
    const pinnedPart = participants.find(p => p.id === pinnedParticipant);
    const otherParticipants = participants.filter(p => p.id !== pinnedParticipant);
    
    // If there's a pinned participant, show them large
    if (pinnedPart) {
      return (
        <div className="grid grid-cols-4 grid-rows-4 gap-3 h-full">
          {/* Pinned participant takes center stage */}
          <div className="col-span-3 row-span-4">
            {renderParticipantVideo(pinnedPart, true)}
          </div>
          
          {/* Other participants in sidebar */}
          <div className="col-span-1 row-span-4 space-y-3 overflow-y-auto">
            {otherParticipants.map((participant) => (
              <div key={participant.id} className="aspect-video">
                {renderParticipantVideo(participant, false)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Default grid layout based on participant count
    const gridClass = 
      participants.length === 1 ? 'grid-cols-1' :
      participants.length === 2 ? 'grid-cols-2' :
      participants.length <= 4 ? 'grid-cols-2' :
      participants.length <= 6 ? 'grid-cols-3' :
      'grid-cols-4';

    return (
      <div className={`grid ${gridClass} gap-3 h-full auto-rows-fr`}>
        {participants.map((participant) => renderParticipantVideo(participant, false))}
      </div>
    );
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow-2xl bg-slate-900">
      <div 
        ref={videoContainerRef} 
        className="w-full h-[calc(100vh-320px)] min-h-[500px] rounded-xl overflow-hidden relative bg-slate-900"
      >
        {/* Connecting state */}
        {connectionStatus === 'connecting' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900/50 to-indigo-900/50 backdrop-blur-sm z-10">
            <div className="text-center space-y-6 text-white p-8 rounded-2xl bg-black/30 backdrop-blur-md">
              <div className="relative">
                <Loader2 className="w-20 h-20 animate-spin mx-auto text-blue-400" />
                <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-blue-400/20 animate-ping" />
              </div>
              <h3 className="text-2xl font-bold">Connecting to meeting...</h3>
              <p className="text-blue-200">Setting up audio and video</p>
            </div>
          </div>
        )}

        {/* Video grid */}
        {connectionStatus === 'connected' && renderParticipantGrid()}

        {/* Disconnected state */}
        {connectionStatus === 'disconnected' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900/50 to-red-900/50 backdrop-blur-sm z-10">
            <div className="text-center space-y-6 text-white p-8 rounded-2xl bg-black/30 backdrop-blur-md">
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                <VideoOff className="w-10 h-10 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold">Disconnected</h3>
              <p className="text-red-200">You are not connected to the meeting</p>
            </div>
          </div>
        )}

        {/* Video error state */}
        {videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900/50 to-red-900/50 backdrop-blur-sm z-10">
            <div className="text-center space-y-6 text-white p-8 rounded-2xl bg-black/30 backdrop-blur-md">
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                <VideoOff className="w-10 h-10 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold">Video Error</h3>
              <p className="text-red-200">Could not access camera. Please check permissions.</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};