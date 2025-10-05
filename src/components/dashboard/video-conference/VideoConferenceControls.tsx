import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  Hand,
  Smile,
  Play,
  Pause,
  MessageSquare,
  Users,
  Brain,
  PenTool,
  Maximize,
  Minimize,
  PhoneOff,
  Volume2,
  VolumeX
} from "lucide-react";

interface VideoConferenceControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isSharingScreen: boolean;
  handRaised: boolean;
  isRecording: boolean;
  isChatOpen: boolean;
  isParticipantsOpen: boolean;
  showAIInsights: boolean;
  showMeetingNotes: boolean;
  isFullscreen: boolean;
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  toggleRaiseHand: () => void;
  toggleRecording: () => void;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsParticipantsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAIInsights: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMeetingNotes: React.Dispatch<React.SetStateAction<boolean>>;
  toggleFullscreen: () => void;
  handleEndCall: () => void;
  showReactions: boolean;
  setShowReactions: React.Dispatch<React.SetStateAction<boolean>>;
  sendReaction: (emoji: string) => void;
}

export const VideoConferenceControls = ({
  isMuted,
  isVideoOff,
  isSharingScreen,
  handRaised,
  isRecording,
  isChatOpen,
  isParticipantsOpen,
  showAIInsights,
  showMeetingNotes,
  isFullscreen,
  toggleMute,
  toggleVideo,
  toggleScreenShare,
  toggleRaiseHand,
  toggleRecording,
  setIsChatOpen,
  setIsParticipantsOpen,
  setShowAIInsights,
  setShowMeetingNotes,
  toggleFullscreen,
  handleEndCall,
  showReactions,
  setShowReactions,
  sendReaction
}: VideoConferenceControlsProps) => {
  const [recordingDuration, setRecordingDuration] = React.useState(0);
  const [showHandAnimation, setShowHandAnimation] = React.useState(false);
  const recordingIntervalRef = React.useRef<number | null>(null);
  const reactionsRef = React.useRef<HTMLDivElement>(null);

  // Recording timer
  React.useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      setRecordingDuration(0);
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);

  // Format recording duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Hand raise animation
  React.useEffect(() => {
    if (handRaised) {
      setShowHandAnimation(true);
      const timer = setTimeout(() => setShowHandAnimation(false), 500);
      return () => clearTimeout(timer);
    }
  }, [handRaised]);

  // Close reactions on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (reactionsRef.current && !reactionsRef.current.contains(event.target as Node)) {
        setShowReactions(false);
      }
    };

    if (showReactions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReactions, setShowReactions]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
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

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [toggleMute, toggleVideo, toggleRaiseHand]);

  const handleReactionClick = (emoji: string) => {
    sendReaction(emoji);
    setShowReactions(false);
  };

  return (
    <Card className="p-4 shadow-2xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Primary Controls - Left Side */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant={isMuted ? "destructive" : "outline"}
              size="icon"
              onClick={toggleMute}
              title="Toggle microphone (Ctrl+D)"
              className={`
                h-12 w-12 rounded-full transition-all duration-200 
                hover:scale-110 active:scale-95 shadow-lg
                ${isMuted ? 'bg-red-500 hover:bg-red-600 border-red-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
              `}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            {isMuted && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>

          <div className="relative">
            <Button
              variant={isVideoOff ? "destructive" : "outline"}
              size="icon"
              onClick={toggleVideo}
              title="Toggle camera (Ctrl+E)"
              className={`
                h-12 w-12 rounded-full transition-all duration-200 
                hover:scale-110 active:scale-95 shadow-lg
                ${isVideoOff ? 'bg-red-500 hover:bg-red-600 border-red-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
              `}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </Button>
            {isVideoOff && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>

          <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          <Button
            variant={isSharingScreen ? "default" : "outline"}
            size="icon"
            onClick={toggleScreenShare}
            title="Share screen"
            className={`
              h-11 w-11 rounded-full transition-all duration-200 
              hover:scale-110 active:scale-95 shadow-md
              ${isSharingScreen ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
            `}
          >
            <MonitorUp className="w-5 h-5" />
          </Button>

          <Button
            variant={handRaised ? "default" : "outline"}
            size="icon"
            onClick={toggleRaiseHand}
            title="Raise hand (Ctrl+R)"
            className={`
              h-11 w-11 rounded-full transition-all duration-200 
              hover:scale-110 active:scale-95 shadow-md
              ${handRaised ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
              ${showHandAnimation ? 'animate-bounce' : ''}
            `}
          >
            <Hand className="w-5 h-5" />
          </Button>

          <div className="relative" ref={reactionsRef}>
            <Button
              variant={showReactions ? "default" : "outline"}
              size="icon"
              onClick={() => setShowReactions(!showReactions)}
              title="Send reaction"
              className="h-11 w-11 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 shadow-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Smile className="w-5 h-5" />
            </Button>
            {showReactions && (
              <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2  dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-3 flex gap-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 
                 dark:bg-gray-800 border-r-2 border-b-2 border-gray-200 dark:border-gray-700 rotate-45" />
                {['👍', '❤️', '😂', '🎉', '👏', '🔥'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleReactionClick(emoji)}
                    className="text-3xl hover:scale-125 active:scale-110 transition-transform duration-150 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    aria-label={`Send ${emoji} reaction`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center - Recording Indicator */}
        {isRecording && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full animate-in fade-in zoom-in duration-300">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-red-600 dark:text-red-400">
              REC {formatDuration(recordingDuration)}
            </span>
          </div>
        )}

        {/* Secondary Controls - Right Side */}
        <div className="flex items-center gap-2">
          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="icon"
            onClick={toggleRecording}
            title={isRecording ? "Stop recording" : "Start recording"}
            className={`
              h-11 w-11 rounded-full transition-all duration-200 
              hover:scale-110 active:scale-95 shadow-md
              ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
            `}
          >
            {isRecording ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>

          <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          <Button
            variant={isChatOpen ? "default" : "outline"}
            size="icon"
            onClick={() => setIsChatOpen(!isChatOpen)}
            title="Toggle chat"
            className={`
              h-11 w-11 rounded-full transition-all duration-200 
              hover:scale-110 active:scale-95 shadow-md
              ${isChatOpen ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
            `}
          >
            <MessageSquare className="w-5 h-5" />
          </Button>

          <Button
            variant={isParticipantsOpen ? "default" : "outline"}
            size="icon"
            onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
            title="Toggle participants"
            className={`
              h-11 w-11 rounded-full transition-all duration-200 
              hover:scale-110 active:scale-95 shadow-md
              ${isParticipantsOpen ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
            `}
          >
            <Users className="w-5 h-5" />
          </Button>

          <Button
            variant={showAIInsights ? "default" : "outline"}
            size="icon"
            onClick={() => setShowAIInsights(!showAIInsights)}
            title="AI Insights"
            className={`
              h-11 w-11 rounded-full transition-all duration-200 
              hover:scale-110 active:scale-95 shadow-md
              ${showAIInsights ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
            `}
          >
            <Brain className="w-5 h-5" />
          </Button>

          <Button
            variant={showMeetingNotes ? "default" : "outline"}
            size="icon"
            onClick={() => setShowMeetingNotes(!showMeetingNotes)}
            title="Meeting notes"
            className={`
              h-11 w-11 rounded-full transition-all duration-200 
              hover:scale-110 active:scale-95 shadow-md
              ${showMeetingNotes ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
            `}
          >
            <PenTool className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            title="Toggle fullscreen"
            className="h-11 w-11 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 shadow-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </Button>

          <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          <Button
            variant="destructive"
            onClick={handleEndCall}
            className="gap-2 h-11 px-6 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 bg-red-500 hover:bg-red-600"
          >
            <PhoneOff className="w-5 h-5" />
            <span className="font-semibold">End</span>
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400">
        {isMuted && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/20 rounded-full">
            <VolumeX className="w-3 h-3 text-red-500" />
            <span className="text-red-600 dark:text-red-400 font-medium">Microphone Off</span>
          </div>
        )}
        {isVideoOff && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/20 rounded-full">
            <VideoOff className="w-3 h-3 text-red-500" />
            <span className="text-red-600 dark:text-red-400 font-medium">Camera Off</span>
          </div>
        )}
        {isSharingScreen && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full">
            <MonitorUp className="w-3 h-3 text-blue-500" />
            <span className="text-blue-600 dark:text-blue-400 font-medium">Sharing Screen</span>
          </div>
        )}
        {handRaised && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-full">
            <Hand className="w-3 h-3 text-yellow-500" />
            <span className="text-yellow-600 dark:text-yellow-400 font-medium">Hand Raised</span>
          </div>
        )}
      </div>
    </Card>
  );
};