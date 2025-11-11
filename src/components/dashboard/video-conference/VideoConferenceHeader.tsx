import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video,
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
  Settings,
  Keyboard,
  Wifi,
  WifiOff,
  X,
  Sparkles,
  Circle,
  Copy,
  Check,
  Volume2,
  Monitor,
  Camera,
  Info,
  Shield,
  Lock,
  Globe
} from "lucide-react";

const VideoConferenceHeader = ({
  toasts = [],
  setToasts = () => {},
  connectionStatus = 'disconnected',
  meetingDuration = 0,
  participants = [],
  isRecording = false,
  networkQuality = 'excellent',
  showKeyboardShortcuts = false,
  setShowKeyboardShortcuts = () => {},
  showSettings = false,
  setShowSettings = () => {},
  meetingId = '',
  formatDuration = (seconds) => `${seconds}`,
}: {
  toasts?: any[];
  setToasts?: Function;
  connectionStatus?: 'connecting' | 'connected' | 'disconnected';
  meetingDuration?: number;
  participants?: any[];
  isRecording?: boolean;
  networkQuality?: 'excellent' | 'good' | 'poor';
  showKeyboardShortcuts?: boolean;
  setShowKeyboardShortcuts?: Function;
  showSettings?: boolean;
  setShowSettings?: Function;
  meetingId?: string;
  formatDuration?: (seconds: number) => string;
}) => {
  // UI state
  const [showMeetingInfo, setShowMeetingInfo] = useState(false);
  const [copiedMeetingId, setCopiedMeetingId] = useState(false);
  
  // Settings state
  const [audioDevices, setAudioDevices] = useState(['Default Microphone', 'USB Headset']);
  const [videoDevices, setVideoDevices] = useState(['Integrated Camera', 'External Webcam']);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState(0);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState(0);
  const [speakerVolume, setSpeakerVolume] = useState(80);
  const [micVolume, setMicVolume] = useState(75);
  
  // Refs
  const durationIntervalRef = useRef(null);

  // Add toast notification
  const addToast = (title: string, description: string, variant: 'default' | 'success' | 'error' = 'default') => {
    const id = Date.now().toString();
    setToasts((prev: any[]) => [...prev, { id, title, description, variant }]);
    
    setTimeout(() => {
      setToasts((prev: any[]) => prev.filter((t: any) => t.id !== id));
    }, 5000);
  };

  // Copy meeting ID to clipboard
  const copyMeetingId = () => {
    if (meetingId) {
      navigator.clipboard.writeText(meetingId);
      setCopiedMeetingId(true);
      addToast('Copied!', 'Meeting ID copied to clipboard', 'success');
      
      setTimeout(() => {
        setCopiedMeetingId(false);
      }, 2000);
    }
  };

  return (
    <div className="w-full">
      {/* Toast Notifications Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        {toasts.map((toast: any) => (
          <div
            key={toast.id}
            className={`
              p-4 rounded-lg border backdrop-blur-md animate-in fade-in slide-in-from-right duration-300
              ${toast.variant === 'success' 
                ? 'bg-emerald-900/90 border-emerald-600' 
                : toast.variant === 'error' 
                ? 'bg-red-900/90 border-red-600' 
                : 'bg-slate-800/90 border-slate-600'
              }
            `}
          >
            <div className="flex items-start gap-3">
              {/* Toast icon based on variant */}
              {toast.variant === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              )}
              {toast.variant === 'error' && (
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              )}
              {toast.variant === 'default' && (
                <Sparkles className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              )}
              
              {/* Toast content */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm mb-1 text-slate-100">{toast.title}</p>
                <p className="text-xs text-slate-300">{toast.description}</p>
              </div>
              
              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setToasts((prev: any[]) => prev.filter((t: any) => t.id !== toast.id))}
                className="h-6 w-6 p-0 hover:bg-slate-700 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Main Header Card */}
      <Card className="p-4 border border-slate-700 bg-slate-800/95 backdrop-blur-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          
          {/* Left Section - Meeting Info */}
          <div className="flex items-center gap-3">
            {/* Video conference icon */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 rounded-lg">
              <Video className="w-6 h-6 text-white" />
            </div>
            
            {/* Meeting title and details */}
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Video Conference
                <Sparkles className="w-4 h-4 text-purple-400" />
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-slate-400 font-medium">AI-Enhanced Meeting</p>
                {meetingId && (
                  <button
                    onClick={copyMeetingId}
                    className="flex items-center gap-1 px-2 py-0.5 bg-slate-700/50 hover:bg-slate-700 rounded text-xs font-mono text-slate-300 transition-colors border border-slate-600"
                  >
                    ID: {meetingId.substring(0, 8)}...
                    {copiedMeetingId ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Section - Status Badges and Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Connection status badge */}
            {connectionStatus === 'connected' && (
              <Badge className="gap-1.5 bg-emerald-600 text-white border-0 px-2.5 py-1">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="font-semibold text-xs">Live</span>
              </Badge>
            )}
            
            {connectionStatus === 'connecting' && (
              <Badge className="gap-1.5 bg-amber-600 text-white border-0 px-2.5 py-1 animate-pulse">
                <Circle className="w-2 h-2 fill-white" />
                <span className="font-semibold text-xs">Connecting...</span>
              </Badge>
            )}
            
            {connectionStatus === 'disconnected' && (
              <Badge className="gap-1.5 bg-red-600 text-white border-0 px-2.5 py-1">
                <Circle className="w-2 h-2 fill-white" />
                <span className="font-semibold text-xs">Disconnected</span>
              </Badge>
            )}

            {/* Meeting duration timer */}
            {connectionStatus === 'connected' && (
              <Badge variant="outline" className="gap-1.5 border border-slate-600 bg-slate-700/50 px-2.5 py-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-mono font-semibold text-xs text-slate-200">
                  {formatDuration(meetingDuration)}
                </span>
              </Badge>
            )}

            {/* Recording indicator */}
            {isRecording && (
              <Badge className="gap-1.5 bg-red-600 text-white border-0 px-2.5 py-1 animate-pulse">
                <Circle className="w-2 h-2 fill-white animate-pulse" />
                <span className="font-semibold text-xs">RECORDING</span>
              </Badge>
            )}

            {/* Participants count */}
            {connectionStatus === 'connected' && (
              <Badge variant="outline" className="gap-1.5 border border-purple-600 bg-purple-600/20 px-2.5 py-1">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-semibold text-xs text-purple-300">
                  {participants.filter((p: any) => p.isPresent).length}
                </span>
              </Badge>
            )}

            {/* Network quality indicator */}
            {connectionStatus === 'connected' && (
              <Badge 
                variant="outline" 
                className={`gap-1.5 border px-2.5 py-1 ${
                  networkQuality === 'excellent' 
                    ? 'border-emerald-600 bg-emerald-600/20 text-emerald-300' 
                    : networkQuality === 'good' 
                    ? 'border-amber-600 bg-amber-600/20 text-amber-300' 
                    : 'border-red-600 bg-red-600/20 text-red-300'
                }`}
              >
                {networkQuality === 'poor' ? (
                  <WifiOff className="w-3.5 h-3.5" />
                ) : (
                  <Wifi className="w-3.5 h-3.5" />
                )}
                <span className="font-semibold text-xs capitalize">{networkQuality}</span>
              </Badge>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2 ml-2">
              {/* Meeting info button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowMeetingInfo(!showMeetingInfo)}
                className="gap-1.5 h-8 px-3 border border-slate-600 bg-slate-700/50 hover:bg-slate-700 text-slate-200 transition-all"
              >
                <Info className="w-4 h-4" />
                <span className="text-xs">Info</span>
              </Button>
              
              {/* Keyboard shortcuts button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                className="gap-1.5 h-8 px-3 border border-slate-600 bg-slate-700/50 hover:bg-slate-700 text-slate-200 transition-all"
              >
                <Keyboard className="w-4 h-4" />
                <span className="text-xs hidden sm:inline">Shortcuts</span>
              </Button>
              
              {/* Settings button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowSettings(!showSettings)}
                className="gap-1.5 h-8 px-3 border border-slate-600 bg-slate-700/50 hover:bg-slate-700 text-slate-200 transition-all"
              >
                <Settings className="w-4 h-4" />
                <span className="text-xs hidden sm:inline">Settings</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VideoConferenceHeader;