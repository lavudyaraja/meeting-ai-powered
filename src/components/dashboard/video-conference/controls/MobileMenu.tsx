import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreVertical,
  MonitorUp,
  Hand,
  Smile,
  Volume2,
  VolumeX,
  MessageSquare,
  Users,
  Radio,
  Image,
  PictureInPicture,
  Maximize,
  Minimize,
  Settings,
  Keyboard,
  X
} from "lucide-react";

interface MobileMenuProps {
  isSharingScreen: boolean;
  handRaised: boolean;
  isSpeakerMuted: boolean;
  isChatOpen: boolean;
  isParticipantsOpen: boolean;
  isRecording: boolean;
  isNoiseCancellationOn: boolean;
  hasVirtualBackground: boolean;
  isFullscreen: boolean;
  showSettings: boolean;
  showReactions: boolean;
  networkQuality: string;
  participantCount?: number;
  toggleScreenShare: () => void;
  toggleRaiseHand: () => void;
  toggleSpeaker: () => void;
  setIsChatOpen: (open: boolean) => void;
  setIsParticipantsOpen: (open: boolean) => void;
  toggleRecording: () => void;
  toggleNoiseCancellation: () => void;
  toggleVirtualBackground: () => void;
  togglePictureInPicture: () => void;
  toggleFullscreen: () => void;
  setShowSettings: (show: boolean) => void;
  setShowReactions: (show: boolean) => void;
  setShowKeyboardShortcuts: (show: boolean) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isSharingScreen,
  handRaised,
  isSpeakerMuted,
  isChatOpen,
  isParticipantsOpen,
  isRecording,
  isNoiseCancellationOn,
  hasVirtualBackground,
  isFullscreen,
  showSettings,
  showReactions,
  networkQuality,
  participantCount = 1,
  toggleScreenShare,
  toggleRaiseHand,
  toggleSpeaker,
  setIsChatOpen,
  setIsParticipantsOpen,
  toggleRecording,
  toggleNoiseCancellation,
  toggleVirtualBackground,
  togglePictureInPicture,
  toggleFullscreen,
  setShowSettings,
  setShowReactions,
  setShowKeyboardShortcuts
}) => {
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const [showMoreMenu, setShowMoreMenu] = React.useState(false);

  return (
    <div className="lg:hidden relative" ref={moreMenuRef}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setShowMoreMenu(!showMoreMenu)}
        title="More options"
        className="h-12 w-12 rounded-xl bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-300 transition-all"
      >
        <MoreVertical className="w-5 h-5" />
      </Button>
      
      {showMoreMenu && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 sm:absolute sm:bottom-full sm:right-0 sm:left-auto sm:translate-x-0 sm:mb-2 bg-slate-800 border border-slate-700 rounded-xl p-2 shadow-2xl z-50 w-[calc(100vw-2rem)] sm:w-64 max-w-sm">
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700 mb-2 sm:hidden">
            <span className="text-sm font-semibold text-slate-100">More Options</span>
            <button 
              onClick={() => setShowMoreMenu(false)}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile-only options */}
          <button
            onClick={() => {
              toggleScreenShare();
              setShowMoreMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors text-left sm:hidden"
          >
            <MonitorUp className="w-5 h-5 text-slate-300" />
            <span className="text-sm text-slate-200">
              {isSharingScreen ? 'Stop' : 'Share'} Screen
            </span>
          </button>

          <button
            onClick={() => {
              toggleRaiseHand();
              setShowMoreMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors text-left md:hidden"
          >
            <Hand className="w-5 h-5 text-slate-300" />
            <span className="text-sm text-slate-200">
              {handRaised ? 'Lower' : 'Raise'} Hand
            </span>
          </button>

          <button
            onClick={() => {
              setShowReactions(!showReactions);
              setShowMoreMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors text-left md:hidden"
          >
            <Smile className="w-5 h-5 text-slate-300" />
            <span className="text-sm text-slate-200">Reactions</span>
          </button>

          {/* Common options */}
          <button
            onClick={() => {
              toggleSpeaker();
              setShowMoreMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors text-left"
          >
            {isSpeakerMuted ? <VolumeX className="w-5 h-5 text-slate-300" /> : <Volume2 className="w-5 h-5 text-slate-300" />}
            <span className="text-sm text-slate-200">
              {isSpeakerMuted ? 'Unmute' : 'Mute'} Speaker
            </span>
          </button>

          <button
            onClick={() => {
              setIsChatOpen(!isChatOpen);
              setShowMoreMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors text-left lg:hidden"
          >
            <MessageSquare className="w-5 h-5 text-slate-300" />
            <span className="text-sm text-slate-200">Chat</span>
          </button>

          <button
            onClick={() => {
              setIsParticipantsOpen(!isParticipantsOpen);
              setShowMoreMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors text-left lg:hidden"
          >
            <Users className="w-5 h-5 text-slate-300" />
            <span className="text-sm text-slate-200">Participants ({participantCount})</span>
          </button>
          
          <button
            onClick={() => {
              toggleRecording();
              setShowMoreMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors text-left"
          >
            <Radio className={`w-5 h-5 ${isRecording ? 'text-red-500' : 'text-slate-300'}`} />
            <span className="text-sm text-slate-200">
              {isRecording ? 'Stop' : 'Start'} Recording
            </span>
          </button>
          
          <button
            onClick={() => {
              toggleNoiseCancellation();
              setShowMoreMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors text-left"
          >
            <Volume2 className={`w-5 h-5 ${isNoiseCancellationOn ? 'text-blue-500' : 'text-slate-300'}`} />
            <span className="text-sm text-slate-200">
              {isNoiseCancellationOn ? 'Disable' : 'Enable'} Noise Cancellation
            </span>
          </button>
          
          <button
            onClick={() => {
              toggleVirtualBackground();
              setShowMoreMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors text-left"
          >
            <Image className={`w-5 h-5 ${hasVirtualBackground ? 'text-purple-500' : 'text-slate-300'}`} />
            <span className="text-sm text-slate-200">
              {hasVirtualBackground ? 'Remove' : 'Add'} Background
            </span>
          </button>
          
          <button
            onClick={() => {
              togglePictureInPicture();
              setShowMoreMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors text-left"
          >
            <PictureInPicture className="w-5 h-5 text-slate-300" />
            <span className="text-sm text-slate-200">Picture-in-Picture</span>
          </button>

          <button
            onClick={() => {
              toggleFullscreen();
              setShowMoreMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors text-left lg:hidden"
          >
            {isFullscreen ? <Minimize className="w-5 h-5 text-slate-300" /> : <Maximize className="w-5 h-5 text-slate-300" />}
            <span className="text-sm text-slate-200">Fullscreen</span>
          </button>

          <button
            onClick={() => {
              setShowSettings(!showSettings);
              setShowMoreMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors text-left lg:hidden"
          >
            <Settings className="w-5 h-5 text-slate-300" />
            <span className="text-sm text-slate-200">Settings</span>
          </button>

          <div className="h-px bg-slate-700 my-2" />
          
          <button
            onClick={() => {
              setShowKeyboardShortcuts(true);
              setShowMoreMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors text-left"
          >
            <Keyboard className="w-5 h-5 text-slate-300" />
            <span className="text-sm text-slate-200">Keyboard Shortcuts</span>
          </button>
        </div>
      )}
    </div>
  );
};