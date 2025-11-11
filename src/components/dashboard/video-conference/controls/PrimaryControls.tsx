import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MonitorOff,
  Smile,
  Hand,
  Volume2,
  Image,
  CircleDot
} from "lucide-react";

interface PrimaryControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isSharingScreen: boolean;
  handRaised: boolean;
  isRecording: boolean;
  isNoiseCancellationOn: boolean;
  hasVirtualBackground: boolean;
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  toggleRaiseHand: () => void;
  toggleNoiseCancellation: () => void;
  toggleVirtualBackground: () => void;
  showReactions: boolean;
  setShowReactions: (show: boolean) => void;
  sendReaction: (emoji: string) => void;
  participantCount?: number;
}

export const PrimaryControls: React.FC<PrimaryControlsProps> = ({
  isMuted,
  isVideoOff,
  isSharingScreen,
  handRaised,
  isRecording,
  isNoiseCancellationOn,
  hasVirtualBackground,
  toggleMute,
  toggleVideo,
  toggleScreenShare,
  toggleRaiseHand,
  toggleNoiseCancellation,
  toggleVirtualBackground,
  showReactions,
  setShowReactions,
  sendReaction,
  participantCount = 1
}) => {
  const reactionsRef = useRef<HTMLDivElement>(null);

  const handleSendReaction = (emoji: string) => {
    setShowReactions(false);
    sendReaction(emoji);
  };

  const reactions = ['👍', '❤️', '😂', '🎉', '👏', '🔥', '🤔', '👀', '💯', '✨', '🚀', '💪'];

  return (
    <>
      {/* Recording Indicator - Top on mobile */}
      {isRecording && (
        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 border border-red-600 rounded-xl">
          <CircleDot className="w-4 h-4 text-red-600 animate-pulse" />
          <span className="text-sm font-medium text-red-600">Recording in Progress</span>
        </div>
      )}

      {/* Primary Controls - Mobile First */}
      <div className="flex items-center justify-center gap-2 w-full lg:w-auto">
        {/* Microphone */}
        <div className="relative">
          <Button
            variant={isMuted ? "destructive" : "outline"}
            size="icon"
            onClick={toggleMute}
            title={`${isMuted ? 'Unmute' : 'Mute'} (Ctrl+D)`}
            className={`h-12 w-12 rounded-xl transition-all ${
              isMuted 
                ? 'bg-red-600 hover:bg-red-700 border-red-500 text-white shadow-lg' 
                : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>
          {isNoiseCancellationOn && !isMuted && (
            <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
              <Volume2 className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Video */}
        <div className="relative">
          <Button
            variant={isVideoOff ? "destructive" : "outline"}
            size="icon"
            onClick={toggleVideo}
            title={`${isVideoOff ? 'Start' : 'Stop'} video (Ctrl+E)`}
            className={`h-12 w-12 rounded-xl transition-all ${
              isVideoOff 
                ? 'bg-red-600 hover:bg-red-700 border-red-500 text-white shadow-lg' 
                : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200'
            }`}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </Button>
          {hasVirtualBackground && !isVideoOff && (
            <div className="absolute -top-1 -right-1 bg-purple-500 rounded-full p-1">
              <Image className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Screen Share - Hidden on small screens */}
        <Button
          variant={isSharingScreen ? "default" : "outline"}
          size="icon"
          onClick={toggleScreenShare}
          title="Share screen"
          className={`h-12 w-12 rounded-xl transition-all hidden sm:flex ${
            isSharingScreen 
              ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500 shadow-lg' 
              : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-300'
          }`}
        >
          {isSharingScreen ? <MonitorOff className="w-5 h-5" /> : <MonitorUp className="w-5 h-5" />}
        </Button>

        {/* Raise Hand - Hidden on small screens */}
        <Button
          variant={handRaised ? "default" : "outline"}
          size="icon"
          onClick={toggleRaiseHand}
          title="Raise hand (Ctrl+H)"
          className={`h-12 w-12 rounded-xl transition-all hidden md:flex ${
            handRaised 
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-500 shadow-lg' 
              : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-300'
          }`}
        >
          <Hand className="w-5 h-5" />
        </Button>

        {/* Reactions - Hidden on small screens */}
        <div className="relative hidden md:block" ref={reactionsRef}>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowReactions(!showReactions)}
            title="Send reaction"
            className="h-12 w-12 rounded-xl bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-300 transition-all"
          >
            <Smile className="w-5 h-5" />
          </Button>
          
          {showReactions && (
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-2xl z-50 min-w-[240px]">
              <div className="grid grid-cols-6 gap-2">
                {reactions.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleSendReaction(emoji)}
                    className="text-2xl hover:scale-125 transition-transform p-1 hover:bg-slate-700 rounded-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};