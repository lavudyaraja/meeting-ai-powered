import React, { useState, useEffect, useRef } from "react";
import { PrimaryControls } from "./PrimaryControls";
import { AIControls } from "./AIControls";
import { SecondaryControls } from "./SecondaryControls";
import { MobileMenu } from "./MobileMenu";
import { EndCallButton } from "./EndCallButton";
import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal";

interface VideoConferenceControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isSharingScreen: boolean;
  handRaised: boolean;
  isRecording: boolean;
  isChatOpen: boolean;
  isParticipantsOpen: boolean;
  isFullscreen: boolean;
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  toggleRaiseHand: () => void;
  toggleRecording: () => void;
  setIsChatOpen: (open: boolean) => void;
  setIsParticipantsOpen: (open: boolean) => void;
  toggleFullscreen: () => void;
  handleEndCall: () => void;
  showReactions: boolean;
  setShowReactions: (show: boolean) => void;
  sendReaction: (emoji: string) => void;
  participantCount?: number;
  isNoiseCancellationOn: boolean;
  toggleNoiseCancellation: () => void;
  isSpeakerMuted: boolean;
  toggleSpeaker: () => void;
  togglePictureInPicture: () => void;
  networkQuality: string;
  hasVirtualBackground: boolean;
  toggleVirtualBackground: () => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  aiFeatures?: {
    liveTranscription: boolean;
    autoSummary: boolean;
    smartFraming: boolean;
    translation: boolean;
    actionItems: boolean;
    speakerRecognition: boolean;
    sentimentAnalysis: boolean;
    autoHighlights: boolean;
    aiNotes: boolean;
    qaSuggestions: boolean;
  };
  toggleAiFeature?: (feature: string) => void;
  meetingId?: string;
  participants?: Array<{ id: string; name: string }>;
  // Add new props for free transcription
  localStreamRef?: React.RefObject<MediaStream>;
  currentUserId?: string;
  currentUserName?: string;
}

export const VideoConferenceControls: React.FC<VideoConferenceControlsProps> = ({
  isMuted,
  isVideoOff,
  isSharingScreen,
  handRaised,
  isRecording,
  isChatOpen,
  isParticipantsOpen,
  isFullscreen,
  toggleMute,
  toggleVideo,
  toggleScreenShare,
  toggleRaiseHand,
  toggleRecording,
  setIsChatOpen,
  setIsParticipantsOpen,
  toggleFullscreen,
  handleEndCall,
  showReactions,
  setShowReactions,
  sendReaction,
  participantCount = 1,
  isNoiseCancellationOn,
  toggleNoiseCancellation,
  isSpeakerMuted,
  toggleSpeaker,
  togglePictureInPicture,
  networkQuality,
  hasVirtualBackground,
  toggleVirtualBackground,
  showSettings,
  setShowSettings,
  aiFeatures = {
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
  },
  toggleAiFeature = () => {},
  meetingId = "default-meeting-id",
  participants = [],
  // Add new props for free transcription
  localStreamRef,
  currentUserId,
  currentUserName
}) => {
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showAutoSummary, setShowAutoSummary] = useState(false);

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
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
          case 'h':
            e.preventDefault();
            toggleRaiseHand();
            break;
          case 'm':
            e.preventDefault();
            setIsChatOpen(!isChatOpen);
            break;
          case 'p':
            e.preventDefault();
            setIsParticipantsOpen(!isParticipantsOpen);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isMuted, isVideoOff, isChatOpen, isParticipantsOpen, toggleMute, toggleVideo, toggleRaiseHand, setIsChatOpen, setIsParticipantsOpen]);

  return (
    <>
      <div className="flex flex-col gap-3 w-full">
        {/* Main Controls Container */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 w-full">
          <PrimaryControls
            isMuted={isMuted}
            isVideoOff={isVideoOff}
            isSharingScreen={isSharingScreen}
            handRaised={handRaised}
            isRecording={isRecording}
            isNoiseCancellationOn={isNoiseCancellationOn}
            hasVirtualBackground={hasVirtualBackground}
            toggleMute={toggleMute}
            toggleVideo={toggleVideo}
            toggleScreenShare={toggleScreenShare}
            toggleRaiseHand={toggleRaiseHand}
            toggleNoiseCancellation={toggleNoiseCancellation}
            toggleVirtualBackground={toggleVirtualBackground}
            showReactions={showReactions}
            setShowReactions={setShowReactions}
            sendReaction={sendReaction}
            participantCount={participantCount}
          />

          <AIControls
            aiFeatures={aiFeatures}
            toggleAiFeature={toggleAiFeature}
            meetingId={meetingId}
            participants={participants}
            showAutoSummary={showAutoSummary}
            setShowAutoSummary={setShowAutoSummary}
            // Pass new props for free transcription
            localStreamRef={localStreamRef}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
          />

          <EndCallButton handleEndCall={handleEndCall} />

          <SecondaryControls
            isSpeakerMuted={isSpeakerMuted}
            isChatOpen={isChatOpen}
            isParticipantsOpen={isParticipantsOpen}
            isFullscreen={isFullscreen}
            showSettings={showSettings}
            networkQuality={networkQuality}
            participantCount={participantCount}
            toggleSpeaker={toggleSpeaker}
            setIsChatOpen={setIsChatOpen}
            setIsParticipantsOpen={setIsParticipantsOpen}
            toggleFullscreen={toggleFullscreen}
            setShowSettings={setShowSettings}
          />

          <MobileMenu
            isSharingScreen={isSharingScreen}
            handRaised={handRaised}
            isSpeakerMuted={isSpeakerMuted}
            isChatOpen={isChatOpen}
            isParticipantsOpen={isParticipantsOpen}
            isRecording={isRecording}
            isNoiseCancellationOn={isNoiseCancellationOn}
            hasVirtualBackground={hasVirtualBackground}
            isFullscreen={isFullscreen}
            showSettings={showSettings}
            showReactions={showReactions}
            networkQuality={networkQuality}
            participantCount={participantCount}
            toggleScreenShare={toggleScreenShare}
            toggleRaiseHand={toggleRaiseHand}
            toggleSpeaker={toggleSpeaker}
            setIsChatOpen={setIsChatOpen}
            setIsParticipantsOpen={setIsParticipantsOpen}
            toggleRecording={toggleRecording}
            toggleNoiseCancellation={toggleNoiseCancellation}
            toggleVirtualBackground={toggleVirtualBackground}
            togglePictureInPicture={togglePictureInPicture}
            toggleFullscreen={toggleFullscreen}
            setShowSettings={setShowSettings}
            setShowReactions={setShowReactions}
            setShowKeyboardShortcuts={setShowKeyboardShortcuts}
          />
        </div>
      </div>

      <KeyboardShortcutsModal 
        showKeyboardShortcuts={showKeyboardShortcuts}
        setShowKeyboardShortcuts={setShowKeyboardShortcuts}
      />
    </>
  );
};