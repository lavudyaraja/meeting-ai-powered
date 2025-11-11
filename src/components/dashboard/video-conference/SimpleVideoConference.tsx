import React, { useEffect, useState, useRef } from "react";
import { useVideoConference } from "./useVideoConference";
import VideoConferenceHeader from "./VideoConferenceHeader";
import { VideoConferenceMain } from "./VideoConferenceMain";
import { VideoConferenceSidebar } from "./VideoConferenceSidebar";
import { VideoConferenceControls } from "./controls";
import AudioDebugger from "./AudioDebugger";
import AudioTransmissionTest from "./AudioTransmissionTest";

const SimpleVideoConference = () => {
  const {
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
    copyMeetingLink,
    shareMeeting,
    pinParticipant,
    setAudioOutput,
    ensureAudioPlayback,
    checkAudioTransmission, // Add this new function
  } = useVideoConference();

  // Get localStream from the ref
  const localStream = localStreamRef?.current;

  // Effect to ensure video plays when stream is available
  useEffect(() => {
    if (localStream && videoRef.current && connectionStatus === 'connected') {
      const playVideo = async () => {
        try {
          videoRef.current!.srcObject = localStream;
          await videoRef.current!.play();
          console.log('Video playback started successfully');
        } catch (error) {
          console.error('Error playing video:', error);
        }
      };
      
      playVideo();
    }
  }, [localStream, connectionStatus, videoRef]);

  // Effect to ensure audio tracks are enabled
  useEffect(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      const videoTracks = localStream.getVideoTracks();
      
      console.log('Local stream tracks:', {
        audioTracks: audioTracks.map(t => ({id: t.id, enabled: t.enabled, kind: t.kind})),
        videoTracks: videoTracks.map(t => ({id: t.id, enabled: t.enabled, kind: t.kind}))
      });
      
      // Ensure tracks are enabled
      audioTracks.forEach(track => {
        if (!track.enabled) {
          track.enabled = true;
          console.log('Enabled audio track:', track.id);
        }
      });
      
      videoTracks.forEach(track => {
        if (!track.enabled) {
          track.enabled = true;
          console.log('Enabled video track:', track.id);
        }
      });
    }
  }, [localStream]);

  const [showAudioTest, setShowAudioTest] = useState(false);
  const [audioPermissionRequested, setAudioPermissionRequested] = useState(false);
  const [showAudioDebugger, setShowAudioDebugger] = useState(false);
  const [showAudioTransmissionTest, setShowAudioTransmissionTest] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const participantCountRef = useRef(0);
  const [audioElementCount, setAudioElementCount] = useState(0);

  // AI Features state - all deactivated by default
  const [aiFeatures, setAiFeatures] = useState({
    liveTranscription: false,
    autoSummary: false,
    smartFraming: false,
    translation: false,
    actionItems: false,
    speakerRecognition: false,
    sentimentAnalysis: false,
    autoHighlights: false,
    aiNotes: false,
    qaSuggestions: false
  });

  // Toggle AI feature
  const toggleAiFeature = (feature: string) => {
    setAiFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature as keyof typeof aiFeatures]
    }));
  };

  // Handle user interaction to enable audio
  const handleAudioPermissionClick = async () => {
    try {
      console.log('User clicked Enable Audio button');
      
      // Create a temporary audio context to trigger user interaction
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      await audioContext.resume();
      audioContext.close();
      
      // Trigger audio playback for all participants
      await ensureAudioPlayback();
      setAudioPermissionRequested(true);
      
      showToast("Audio Enabled", "Audio playback has been enabled for all participants", "success");
      
      // Also try to resume the main audio context
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
        console.log('Main audio context resumed');
      }
    } catch (error) {
      console.error('Error enabling audio:', error);
      showToast("Audio Error", "Could not enable audio playback", "error");
    }
  };

  // Ensure audio playback when participants change - Fixed to prevent infinite loops
  useEffect(() => {
    if (connectionStatus === 'connected' && participants.length > 0) {
      // Use a ref to track if we've already called ensureAudioPlayback for this participant count
      if (participantCountRef.current !== participants.length) {
        participantCountRef.current = participants.length;
        
        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
          ensureAudioPlayback();
        }, 200); // Increased delay to prevent rapid calls
        return () => clearTimeout(timer);
      }
    }
  }, [participants.length, connectionStatus, ensureAudioPlayback]);

  // Also ensure audio playback when the component mounts or when audio devices change
  useEffect(() => {
    // Ensure audio context is resumed if suspended
    const resumeAudioContext = async () => {
      if (typeof AudioContext !== 'undefined') {
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        if (audioContext.state === 'suspended') {
          try {
            await audioContext.resume();
            console.log('Audio context resumed');
          } catch (e) {
            console.log('Failed to resume audio context:', e);
          }
        }
      }
    };
    
    resumeAudioContext();
    
    // Also try to ensure audio playback after a short delay
    const timer = setTimeout(() => {
      ensureAudioPlayback();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [ensureAudioPlayback]);

  // Update audio element count efficiently - only when participants change
  useEffect(() => {
    const count = document.querySelectorAll('audio').length;
    setAudioElementCount(count);
  }, [participants.length]); // Only update when participant count changes

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      // Update state based on actual fullscreen status
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      if (isCurrentlyFullscreen !== isFullscreen) {
        toggleFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isFullscreen, toggleFullscreen]);

  // Effect to check audio transmission status periodically
  useEffect(() => {
    if (connectionStatus === 'connected') {
      const interval = setInterval(() => {
        const isTransmitting = checkAudioTransmission();
        if (!isTransmitting && !isMuted) {
          // Audio should be transmitting but isn't
          console.log("Warning: Audio should be transmitting but appears to be inactive");
        }
      }, 5000); // Check every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [connectionStatus, isMuted, checkAudioTransmission]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-6 max-w-[1920px]">
        {/* Header */}
        <VideoConferenceHeader
          toasts={toasts}
          setToasts={setToasts}
          connectionStatus={connectionStatus}
          meetingDuration={meetingDuration}
          participants={participants}
          isRecording={isRecording}
          networkQuality={networkQuality}
          showKeyboardShortcuts={showKeyboardShortcuts}
          setShowKeyboardShortcuts={setShowKeyboardShortcuts}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          meetingId={meetingId || "default-meeting-id"}
          formatDuration={formatDuration}
        />
        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Audio Permission Notification */}
          {!audioPermissionRequested && connectionStatus === 'connected' && participants.length > 1 && (
            <div className="lg:col-span-12 mb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-blue-900">Enable Audio for Other Participants</h3>
                      <p className="text-sm text-blue-700">
                        To hear other participants, you may need to enable audio playback.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleAudioPermissionClick}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Enable Audio
                    </button>
                    <button 
                      onClick={() => setShowAudioDebugger(true)}
                      className="border-blue-300 text-blue-700 hover:bg-blue-50 px-4 py-2 rounded border"
                    >
                      Audio Issues?
                    </button>
                    <button 
                      onClick={() => setShowAudioTransmissionTest(true)}
                      className="border-green-300 text-green-700 hover:bg-green-50 px-4 py-2 rounded border"
                    >
                      Test Audio
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Audio Transmission Warning */}
          {connectionStatus === 'connected' && isMuted && (
            <div className="lg:col-span-12 mb-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 text-yellow-600" />
                  <div>
                    <h3 className="font-medium text-yellow-900">Microphone Muted</h3>
                    <p className="text-sm text-yellow-700">
                      Your microphone is currently muted. Other participants cannot hear you.
                    </p>
                  </div>
                  <button 
                    onClick={toggleMute}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
                  >
                    Unmute
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Audio Debugger Modal */}
          {showAudioDebugger && (
            <AudioDebugger
              onClose={() => setShowAudioDebugger(false)}
              localStreamRef={localStreamRef}
              participants={participants}
            />
          )}
        
          {/* Audio Transmission Test Modal */}
          {showAudioTransmissionTest && (
            <AudioTransmissionTest
              onClose={() => setShowAudioTransmissionTest(false)}
              localStreamRef={localStreamRef}
              onTestComplete={(result) => {
                showToast(
                  result.success ? "Test Successful" : "Test Failed", 
                  result.message, 
                  result.success ? "success" : "error"
                );
              }}
            />
          )}

          {/* Main Video Area - Takes 8 columns on large screens */}
          <div className="lg:col-span-8 space-y-4">
            <VideoConferenceMain
              connectionStatus={connectionStatus}
              videoRef={videoRef}
              isVideoOff={isVideoOff}
              reactions={reactions}
              localStreamRef={localStreamRef}
              videoContainerRef={videoContainerRef}
              showToast={showToast}
              participants={participants}
              pinnedParticipant={pinnedParticipant}
              audioLevel={audioLevel}
            />
            
            {/* Controls */}
            <VideoConferenceControls
              isMuted={isMuted}
              isVideoOff={isVideoOff}
              isSharingScreen={isSharingScreen}
              handRaised={handRaised}
              isRecording={isRecording}
              isChatOpen={isChatOpen}
              isParticipantsOpen={isParticipantsOpen}
              isFullscreen={isFullscreen}
              toggleMute={toggleMute}
              toggleVideo={toggleVideo}
              toggleScreenShare={toggleScreenShare}
              toggleRaiseHand={toggleRaiseHand}
              toggleRecording={toggleRecording}
              setIsChatOpen={setIsChatOpen}
              setIsParticipantsOpen={setIsParticipantsOpen}
              toggleFullscreen={toggleFullscreen}
              handleEndCall={handleEndCall}
              showReactions={showReactions}
              setShowReactions={setShowReactions}
              sendReaction={sendReaction}
              participantCount={participants.length}
              isNoiseCancellationOn={false}
              toggleNoiseCancellation={() => {}}
              isSpeakerMuted={false}
              toggleSpeaker={() => {}}
              togglePictureInPicture={() => {}}
              networkQuality={networkQuality}
              hasVirtualBackground={false}
              toggleVirtualBackground={() => {}}
              showSettings={showSettings}
              setShowSettings={setShowSettings}
              meetingId={meetingId || "default-meeting-id"}
              participants={participants.map(p => ({ id: p.id, name: p.name }))}
              aiFeatures={aiFeatures}
              toggleAiFeature={toggleAiFeature}
              // Add new props for free transcription
              localStreamRef={localStreamRef}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
            />
          </div>
          
          {/* Sidebar - Takes 4 columns on large screens */}
          <div className="lg:col-span-4 space-y-4">
            <VideoConferenceSidebar
              connectionStatus={connectionStatus}
              isParticipantsOpen={isParticipantsOpen}
              isChatOpen={isChatOpen}
              participants={participants}
              chatMessages={chatMessages}
              chatContainerRef={chatContainerRef}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              sendMessage={sendMessage}
              handleKeyPress={handleKeyPress}
              pinParticipant={pinParticipant}
              pinnedParticipant={pinnedParticipant}
              meetingLink={meetingLink}
              copyMeetingLink={copyMeetingLink}
              shareMeeting={shareMeeting}
              toggleMeetingLock={toggleMeetingLock}
              isMeetingLocked={isMeetingLocked}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleVideoConference;

