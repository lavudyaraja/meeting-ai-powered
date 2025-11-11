import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  MicOff, 
  Play, 
  Square, 
  Download, 
  Copy, 
  Check,
  AlertCircle,
  Loader2,
  Info,
  Settings
} from "lucide-react";
import { useWhisperTranscription } from "@/hooks/useWhisperTranscription";
import { TranscriptSegment } from "@/utils/speechRecognition";

interface WhisperTranscriptionProps {
  localStreamRef: React.RefObject<MediaStream>;
  meetingId: string;
  onTranscriptUpdate?: (segments: TranscriptSegment[]) => void;
  className?: string;
}

export const WhisperTranscription: React.FC<WhisperTranscriptionProps> = ({
  localStreamRef,
  meetingId,
  onTranscriptUpdate,
  className = ""
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [language, setLanguage] = useState("en");
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use Whisper transcription hook
  const {
    isTranscribing,
    isSupported,
    transcripts,
    error: whisperError,
    startTranscription,
    clearTranscripts,
    getFullTranscript
  } = useWhisperTranscription({
    apiKey,
    language,
    onTranscript: (segments) => {
      onTranscriptUpdate?.(segments);
    },
    onError: (err) => {
      setError(err);
    }
  });

  // Handle recording toggle
  const toggleRecording = useCallback(async () => {
    if (!apiKey) {
      setError("Please enter your OpenAI API key");
      return;
    }

    if (!localStreamRef.current) {
      setError("No audio stream available");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
    } else {
      try {
        setIsRecording(true);
        setError(null);
        await startTranscription(localStreamRef.current);
      } catch (err: any) {
        setError(err.message || "Failed to start transcription");
        setIsRecording(false);
      }
    }
  }, [apiKey, localStreamRef, isRecording, startTranscription]);

  // Handle copy transcript
  const handleCopy = useCallback(() => {
    const transcript = getFullTranscript();
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [getFullTranscript]);

  // Handle download transcript
  const handleDownload = useCallback(() => {
    const transcript = getFullTranscript();
    if (!transcript) return;
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meeting-transcript-${meetingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [getFullTranscript, meetingId]);

  // Clear error when API key is entered
  useEffect(() => {
    if (apiKey && error?.includes("API key")) {
      setError(null);
    }
  }, [apiKey, error]);

  // Update error state when whisperError changes
  useEffect(() => {
    if (whisperError) {
      setError(whisperError);
    }
  }, [whisperError]);

  return (
    <Card className={`p-4 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-slate-100">Whisper Transcription</h3>
          <Badge variant="outline" className="text-xs bg-blue-900/50 text-blue-300 border-blue-700">
            Powered by OpenAI
          </Badge>
        </div>
        
        {(isRecording || isTranscribing) && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-red-400">Recording...</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-sm text-red-300">{error}</span>
        </div>
      )}

      {/* API Key Input */}
      {!apiKey && (
        <div className="mb-4 p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            OpenAI API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-...your-api-key..."
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-400 mt-2">
            Your API key is stored locally and never sent to any server except OpenAI.
          </p>
        </div>
      )}

      {/* Settings */}
      {showSettings && (
        <div className="mb-4 p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Transcription Settings</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-slate-200 text-sm"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="ru">Russian</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleRecording}
          disabled={!apiKey || isTranscribing}
          className={`gap-1.5 ${
            isRecording
              ? "bg-red-600 hover:bg-red-700 text-white border-red-500"
              : "bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
          }`}
        >
          {isRecording ? (
            <>
              <Square className="w-3 h-3" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-3 h-3" />
              Start Recording
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="gap-1.5 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
        >
          <Settings className="w-3 h-3" />
          Settings
        </Button>
        
        {transcripts.length > 0 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!getFullTranscript()}
              className="gap-1.5 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-green-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!getFullTranscript()}
              className="gap-1.5 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
            >
              <Download className="w-3 h-3" />
              Download
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={clearTranscripts}
              className="gap-1.5 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
            >
              <Square className="w-3 h-3" />
              Clear
            </Button>
          </>
        )}
      </div>

      {isTranscribing && (
        <div className="mb-4 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
          <span className="text-sm text-blue-400">Transcribing audio with Whisper...</span>
        </div>
      )}

      {transcripts.length > 0 ? (
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 max-h-60 overflow-y-auto">
          <div className="space-y-3">
            {transcripts.map((segment) => (
              <div key={segment.id} className="text-sm text-slate-300">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span>{new Date(segment.timestamp).toLocaleTimeString()}</span>
                  {segment.confidence && (
                    <span className="bg-slate-700 px-1.5 py-0.5 rounded">
                      {(segment.confidence * 100).toFixed(0)}% confidence
                    </span>
                  )}
                </div>
                <p className="whitespace-pre-wrap">{segment.text}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/30 border-2 border-dashed border-slate-700 rounded-lg p-6 text-center">
          <Mic className="w-8 h-8 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-500 text-sm mb-3">
            {isTranscribing 
              ? "Recording and transcribing audio..." 
              : "Click 'Start Recording' to begin transcription"}
          </p>
          
          {!isTranscribing && (
            <div className="text-xs text-slate-400 mt-3 p-3 bg-slate-800/50 rounded-lg text-left">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-300 mb-1">How it works:</p>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    <li>Records audio from your microphone</li>
                    <li>Sends audio to OpenAI Whisper for transcription</li>
                    <li>Provides accurate, timestamped transcripts</li>
                    <li>Supports multiple languages</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};