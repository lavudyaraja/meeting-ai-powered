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
  Sparkles,
  X
} from "lucide-react";

interface Toast {
  id: string;
  title: string;
  description: string;
  variant: 'success' | 'error' | 'default';
}

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
}

interface VideoConferenceHeaderProps {
  toasts: Toast[];
  setToasts: React.Dispatch<React.SetStateAction<Toast[]>>;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  meetingDuration: number;
  participants: Participant[];
  isRecording: boolean;
  networkQuality: 'excellent' | 'good' | 'poor';
  showKeyboardShortcuts: boolean;
  setShowKeyboardShortcuts: React.Dispatch<React.SetStateAction<boolean>>;
  showSettings: boolean;
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
  meetingId: string | null;
  isHostStarting: boolean;
  formatDuration: (seconds: number) => string;
  autoTranscription: boolean;
  setAutoTranscription: React.Dispatch<React.SetStateAction<boolean>>;
  autoSummarization: boolean;
  setAutoSummarization: React.Dispatch<React.SetStateAction<boolean>>;
}

export const VideoConferenceHeader = ({
  toasts,
  setToasts,
  connectionStatus,
  meetingDuration,
  participants,
  isRecording,
  networkQuality,
  showKeyboardShortcuts,
  setShowKeyboardShortcuts,
  showSettings,
  setShowSettings,
  meetingId,
  isHostStarting,
  formatDuration,
  autoTranscription,
  setAutoTranscription,
  autoSummarization,
  setAutoSummarization
}: VideoConferenceHeaderProps) => {
  return (
    <>
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg border-2 backdrop-blur-sm ${
              toast.variant === 'success' ? 'bg-green-50 border-green-500 dark:bg-green-900/20' :
              toast.variant === 'error' ? 'bg-red-50 border-red-500 dark:bg-red-900/20' :
              'bg-blue-50 border-blue-500 dark:bg-blue-900/20'
            }`}
          >
            <div className="flex items-start gap-3">
              {toast.variant === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />}
              {toast.variant === 'error' && <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />}
              <div className="flex-1">
                <p className="font-semibold text-sm">{toast.title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{toast.description}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Video Conference
            </h2>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-sm text-gray-700">
                AI-powered meeting
              </p>
              {connectionStatus === 'connected' && (
                <Badge className="gap-1 animate-pulse bg-gradient-to-r from-green-500 to-green-600">
                  <div className="w-2 h-2 rounded-full bg-white" />
                  Live
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {connectionStatus === 'connected' && (
            <>
              <Badge variant="outline" className="gap-2 text-sm px-3 py-2 border-2 text-black">
                <Clock className="w-4 h-4 text-black" />
                {formatDuration(meetingDuration)}
              </Badge>
              {isRecording && (
                <Badge className="gap-2 animate-pulse bg-red-500">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  REC
                </Badge>
              )}
              <Badge variant="outline" className="gap-2 border-2 text-black">
                <Users className="w-4 h-4 text-black" />
                {participants.filter(p => p.isPresent).length}
              </Badge>
              <Badge 
                variant="outline" 
                className={`gap-2 border-2 ${
                  networkQuality === 'excellent' ? 'border-green-500 text-green-600' :
                  networkQuality === 'good' ? 'border-yellow-500 text-yellow-600' :
                  'border-red-500 text-red-600'
                }`}
              >
                {networkQuality === 'poor' ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                {networkQuality}
              </Badge>
            </>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
            className="gap-2"
          >
            <Keyboard className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowSettings(!showSettings)}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showKeyboardShortcuts && (
        <Card className="p-4 border-2 border-blue-500/50 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              Keyboard Shortcuts
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setShowKeyboardShortcuts(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border">Ctrl+D</kbd>
              <span>Toggle Mute</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border">Ctrl+E</kbd>
              <span>Toggle Video</span>
            </div>
          </div>
        </Card>
      )}

      {showSettings && (
        <Card className="p-4 border-2 border-purple-500/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Meeting Settings
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto Transcription</span>
              <Button
                variant={autoTranscription ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoTranscription(!autoTranscription)}
              >
                {autoTranscription ? "On" : "Off"}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">AI Summarization</span>
              <Button
                variant={autoSummarization ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoSummarization(!autoSummarization)}
              >
                {autoSummarization ? "On" : "Off"}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};