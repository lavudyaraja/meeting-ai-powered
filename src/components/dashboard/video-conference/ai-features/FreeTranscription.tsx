import React, { useState, useCallback } from "react";
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
  Settings,
  Zap
} from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { TranscriptSegment } from "@/utils/speechRecognition";

interface FreeTranscriptionProps {
  localStreamRef: React.RefObject<MediaStream>;
  meetingId: string;
  currentUserId: string;
  currentUserName: string;
  onTranscriptUpdate?: (segments: TranscriptSegment[]) => void;
  className?: string;
}

export const FreeTranscription: React.FC<FreeTranscriptionProps> = ({
  localStreamRef,
  meetingId,
  currentUserId,
  currentUserName,
  onTranscriptUpdate,
  className = ""
}) => {
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [isProcessing, setIsProcessing] = useState(false);

  // Use speech recognition hook
  const {
    isListening,
    isSupported,
    transcripts,
    interimTranscript,
    error,
    startListening,
    stopListening,
    clearTranscripts,
    getFullTranscript,
    changeLanguage,
    getSupportedLanguages
  } = useSpeechRecognition({
    autoStart: false,
    continuous: true,
    interimResults: true,
    language,
    speakerId: currentUserId,
    speakerName: currentUserName,
    onTranscript: (segment) => {
      // Only send final transcripts to parent
      if (segment.isFinal) {
        onTranscriptUpdate?.([segment]);
      }
    },
    onError: (err) => {
      console.error("Speech recognition error:", err);
    }
  });

  // Handle recording toggle
  const toggleRecording = useCallback(async () => {
    if (isListening) {
      stopListening();
    } else {
      try {
        // Ensure we have microphone access
        if (!localStreamRef.current) {
          // Note: We can't directly assign to ref.current, but we can check if it exists
          console.warn("Local stream not available in ref");
        }
        
        // Change language if needed
        changeLanguage(language);
        startListening();
      } catch (err: any) {
        console.error("Microphone access error:", err);
      }
    }
  }, [isListening, startListening, stopListening, localStreamRef, language, changeLanguage]);

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

  // Handle language change
  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
    if (isListening) {
      stopListening();
      setTimeout(() => {
        changeLanguage(newLanguage);
        startListening();
      }, 500);
    } else {
      changeLanguage(newLanguage);
    }
  }, [isListening, startListening, stopListening, changeLanguage]);

  // Supported languages for the dropdown
  const supportedLanguages = getSupportedLanguages();

  return (
    <Card className={`p-4 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-green-400" />
          <h3 className="font-semibold text-slate-100">Free Transcription</h3>
          <Badge variant="outline" className="text-xs bg-green-900/50 text-green-300 border-green-700">
            Browser-Powered
          </Badge>
        </div>
        
        {isListening && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-400">Listening...</span>
          </div>
        )}
      </div>

      {!isSupported && (
        <div className="mb-4 p-3 bg-amber-900/20 border border-amber-800 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-sm text-amber-300">
            Speech recognition is not supported in your browser. Try Chrome, Edge, or Safari.
          </span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-sm text-red-300">{error}</span>
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
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-slate-200 text-sm"
                disabled={isListening}
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
                <option value="de-DE">German</option>
                <option value="it-IT">Italian</option>
                <option value="pt-BR">Portuguese</option>
                <option value="zh-CN">Chinese (Simplified)</option>
                <option value="ja-JP">Japanese</option>
                <option value="ko-KR">Korean</option>
                {supportedLanguages
                  .filter(lang => !['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 'pt-BR', 'zh-CN', 'ja-JP', 'ko-KR'].includes(lang))
                  .map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
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
          disabled={!isSupported || isProcessing}
          className={`gap-1.5 ${
            isListening
              ? "bg-green-600 hover:bg-green-700 text-white border-green-500"
              : "bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
          }`}
        >
          {isListening ? (
            <>
              <Square className="w-3 h-3" />
              Stop Transcription
            </>
          ) : (
            <>
              <Mic className="w-3 h-3" />
              Start Transcription
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

      {(isListening || interimTranscript) && (
        <div className="mb-4 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-green-400" />
          <span className="text-sm text-green-400">
            {interimTranscript 
              ? "Processing speech..." 
              : "Listening for speech..."}
          </span>
        </div>
      )}

      {transcripts.length > 0 || interimTranscript ? (
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 max-h-60 overflow-y-auto">
          <div className="space-y-3">
            {/* Show interim transcript at the top */}
            {interimTranscript && (
              <div className="text-sm text-slate-400 italic">
                <div className="flex items-center gap-2 text-xs mb-1">
                  <span>Processing...</span>
                </div>
                <p className="whitespace-pre-wrap">{interimTranscript}</p>
              </div>
            )}
            
            {/* Show final transcripts */}
            {[...transcripts].reverse().map((segment) => (
              <div key={segment.id} className="text-sm text-slate-300">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span>{new Date(segment.timestamp).toLocaleTimeString()}</span>
                  {segment.confidence && (
                    <span className={`px-1.5 py-0.5 rounded text-xs ${
                      segment.confidence > 0.8 
                        ? 'bg-green-900/50 text-green-300' 
                        : segment.confidence > 0.6 
                          ? 'bg-yellow-900/50 text-yellow-300' 
                          : 'bg-red-900/50 text-red-300'
                    }`}>
                      {(segment.confidence * 100).toFixed(0)}% confidence
                    </span>
                  )}
                  <span className="bg-slate-700 px-1.5 py-0.5 rounded">
                    {segment.speakerName || 'Speaker'}
                  </span>
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
            {isListening 
              ? "Listening for speech..." 
              : "Click 'Start Transcription' to begin free speech-to-text"}
          </p>
          
          {!isListening && (
            <div className="text-xs text-slate-400 mt-3 p-3 bg-slate-800/50 rounded-lg text-left">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-300 mb-1">How it works:</p>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    <li>Uses your browser's built-in speech recognition</li>
                    <li>Works completely free with no API keys required</li>
                    <li>Real-time transcription with confidence scoring</li>
                    <li>Supports multiple languages</li>
                    <li>No audio is sent to external servers</li>
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