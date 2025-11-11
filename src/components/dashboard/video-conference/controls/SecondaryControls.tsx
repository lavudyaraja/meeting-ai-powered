import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Volume2,
  VolumeX,
  MessageSquare,
  Users,
  Settings,
  Maximize,
  Minimize,
//   Wifi,
  WifiOff
} from "lucide-react";

interface SecondaryControlsProps {
  isSpeakerMuted: boolean;
  isChatOpen: boolean;
  isParticipantsOpen: boolean;
  isFullscreen: boolean;
  showSettings: boolean;
  networkQuality: string;
  participantCount?: number;
  toggleSpeaker: () => void;
  setIsChatOpen: (open: boolean) => void;
  setIsParticipantsOpen: (open: boolean) => void;
  toggleFullscreen: () => void;
  setShowSettings: (show: boolean) => void;
}

export const SecondaryControls: React.FC<SecondaryControlsProps> = ({
  isSpeakerMuted,
  isChatOpen,
  isParticipantsOpen,
  isFullscreen,
  showSettings,
  networkQuality,
  participantCount = 1,
  toggleSpeaker,
  setIsChatOpen,
  setIsParticipantsOpen,
  toggleFullscreen,
  setShowSettings
}) => {
  const getNetworkIcon = () => {
    if (networkQuality === 'poor') return <WifiOff className="w-4 h-4 text-red-500" />;
    // return <Wifi className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
      {/* Speaker */}
      <Button
        variant={isSpeakerMuted ? "destructive" : "outline"}
        size="icon"
        onClick={toggleSpeaker}
        title={`${isSpeakerMuted ? 'Unmute' : 'Mute'} speaker`}
        className={`h-12 w-12 rounded-xl transition-all ${
          isSpeakerMuted 
            ? 'bg-red-600 hover:bg-red-700 border-red-500 text-white shadow-lg' 
            : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-300'
        }`}
      >
        {isSpeakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </Button>

      {/* Chat */}
      <Button
        variant={isChatOpen ? "default" : "outline"}
        size="icon"
        onClick={() => setIsChatOpen(!isChatOpen)}
        title="Toggle chat (Ctrl+M)"
        className={`h-12 w-12 rounded-xl transition-all ${
          isChatOpen 
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500 shadow-lg' 
            : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-300'
        }`}
      >
        <MessageSquare className="w-5 h-5" />
      </Button>

      {/* Participants */}
      <div className="relative">
        <Button
          variant={isParticipantsOpen ? "default" : "outline"}
          size="icon"
          onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
          title="Toggle participants (Ctrl+P)"
          className={`h-12 w-12 rounded-xl transition-all ${
            isParticipantsOpen 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500 shadow-lg' 
              : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-300'
          }`}
        >
          <Users className="w-5 h-5" />
        </Button>
        <Badge className="absolute -top-2 -right-2 bg-indigo-600 text-white border-slate-800 text-xs px-1.5 min-w-[1.25rem] h-5 flex items-center justify-center">
          {participantCount}
        </Badge>
      </div>

      {/* Settings */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setShowSettings(!showSettings)}
        title="Settings"
        className="h-12 w-12 rounded-xl bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-300 transition-all"
      >
        <Settings className="w-5 h-5" />
      </Button>

      {/* Fullscreen */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleFullscreen}
        title="Toggle fullscreen"
        className="h-12 w-12 rounded-xl bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-300 transition-all"
      >
        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
      </Button>

      {/* Network Quality */}
      <div className="flex items-center justify-center w-12 h-12">
        {getNetworkIcon()}
      </div>
    </div>
  );
};