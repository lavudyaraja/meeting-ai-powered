import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Languages, 
  Play, 
  Pause, 
  Square,
  Download,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Settings,
  X
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TranslationPanelProps {
  meetingId: string;
  participants: Array<{ id: string; name: string }>;
  className?: string;
  onTranslationUpdate?: (translation: string) => void;
}

interface TranslationSegment {
  id: string;
  speaker: string;
  originalText: string;
  translatedText: string;
  timestamp: Date;
}

export const TranslationPanel: React.FC<TranslationPanelProps> = ({
  meetingId,
  participants,
  className = "",
  onTranslationUpdate
}) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [translatedSegments, setTranslatedSegments] = useState<TranslationSegment[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState("es"); // Default to Spanish
  const [sourceLanguage, setSourceLanguage] = useState("en"); // Default to English
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const translationChannelRef = useRef<any>(null);
  const processedMessageIdsRef = useRef<Set<string>>(new Set());

  // Scroll to bottom when new translations are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [translatedSegments]);

  // Listen for real-time meeting messages
  useEffect(() => {
    if (!meetingId || !isTranslating || isPaused) {
      if (translationChannelRef.current) {
        supabase.removeChannel(translationChannelRef.current);
        translationChannelRef.current = null;
      }
      return;
    }

    // Subscribe to real-time meeting messages
    const channel = supabase
      .channel(`translation-${meetingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'meeting_messages',
          filter: `meeting_id=eq.${meetingId}`
        },
        async (payload) => {
          const message = payload.new;
          
          // Skip if already processed
          if (processedMessageIdsRef.current.has(message.id)) {
            return;
          }
          
          // Skip signaling messages (they're JSON strings)
          try {
            JSON.parse(message.message);
            // If it parses, it's likely a signaling message, skip it
            return;
          } catch (e) {
            // Not JSON, it's a regular chat message
          }
          
          // Mark as processed
          processedMessageIdsRef.current.add(message.id);
          
          // Translate the message
          try {
            const translatedText = await translateText(message.message, message.user_name);
            
            const translatedSegment: TranslationSegment = {
              id: message.id,
              speaker: message.user_name,
              originalText: message.message,
              translatedText: translatedText,
              timestamp: new Date(message.timestamp)
            };
            
            setTranslatedSegments(prev => {
              const updated = [...prev, translatedSegment];
              onTranslationUpdate?.(JSON.stringify(updated));
              return updated;
            });
          } catch (error) {
            console.error("Error translating message:", error);
          }
        }
      )
      .subscribe();

    translationChannelRef.current = channel;

    return () => {
      if (translationChannelRef.current) {
        supabase.removeChannel(translationChannelRef.current);
        translationChannelRef.current = null;
      }
    };
  }, [meetingId, isTranslating, isPaused]);

  // Function to start real-time translation
  const startTranslation = async () => {
    try {
      setIsTranslating(true);
      setIsPaused(false);
      setError(null);
      processedMessageIdsRef.current.clear();
      
      // Fetch existing messages and translate them
      const { data: existingMessages, error: fetchError } = await supabase
        .from('meeting_messages')
        .select('*')
        .eq('meeting_id', meetingId)
        .order('timestamp', { ascending: true });

      if (fetchError) {
        console.error("Error fetching existing messages:", fetchError);
      } else if (existingMessages && existingMessages.length > 0) {
        // Translate existing messages
        for (const message of existingMessages) {
          // Skip signaling messages
          try {
            JSON.parse(message.message);
            continue;
          } catch (e) {
            // Not JSON, it's a regular message
          }
          
          if (processedMessageIdsRef.current.has(message.id)) {
            continue;
          }
          
          processedMessageIdsRef.current.add(message.id);
          
          try {
            const translatedText = await translateText(message.message, message.user_name);
            
            const translatedSegment: TranslationSegment = {
              id: message.id,
              speaker: message.user_name,
              originalText: message.message,
              translatedText: translatedText,
              timestamp: new Date(message.timestamp)
            };
            
            setTranslatedSegments(prev => [...prev, translatedSegment]);
          } catch (error) {
            console.error("Error translating existing message:", error);
          }
        }
      }
      
      console.log("Real-time translation started for meeting:", meetingId);
    } catch (err: any) {
      console.error("Error starting translation:", err);
      setError(err.message || 'Failed to start translation. Please try again.');
      setIsTranslating(false);
    }
  };

  // Function to translate text using the Supabase function
  const translateText = async (text: string, speaker: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-translation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          meetingId,
          sourceText: text,
          sourceLanguage,
          targetLanguage,
          speaker
        })
      });
      
      if (!response.ok) {
        throw new Error(`Translation failed with status ${response.status}`);
      }
      
      const data = await response.json();
      return data.translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      return `Translation failed: ${error.message}`;
    }
  };

  const pauseTranslation = () => {
    setIsPaused(true);
  };

  const resumeTranslation = () => {
    setIsPaused(false);
  };

  const stopTranslation = () => {
    setIsTranslating(false);
    setIsPaused(false);
    if (translationChannelRef.current) {
      supabase.removeChannel(translationChannelRef.current);
      translationChannelRef.current = null;
    }
  };

  const handleCopy = () => {
    if (translatedSegments.length === 0) return;
    
    const textToCopy = translatedSegments
      .map(segment => `[${segment.speaker}] ${segment.translatedText}`)
      .join('\n\n');
      
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (translatedSegments.length === 0) return;
    
    const textToDownload = translatedSegments
      .map(segment => `[${segment.timestamp.toLocaleTimeString()}] ${segment.speaker}: ${segment.translatedText}`)
      .join('\n\n');
      
    const blob = new Blob([textToDownload], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meeting-translation-${meetingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const languageOptions = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" }
  ];

  return (
    <Card className={`p-4 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Languages className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-slate-100">Live Translation</h3>
          <Badge variant="outline" className="text-xs bg-blue-900/50 text-blue-300 border-blue-700">
            {languageOptions.find(lang => lang.code === sourceLanguage)?.name} → {languageOptions.find(lang => lang.code === targetLanguage)?.name}
          </Badge>
        </div>
        
        {isTranslating && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs text-blue-400">
              {isPaused ? "Paused" : "Translating..."}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-sm text-red-300">{error}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {!isTranslating ? (
          <Button
            variant="outline"
            size="sm"
            onClick={startTranslation}
            className="gap-1.5 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
          >
            <Play className="w-3 h-3" />
            Start Translation
          </Button>
        ) : (
          <>
            {isPaused ? (
              <Button
                variant="outline"
                size="sm"
                onClick={resumeTranslation}
                className="gap-1.5 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
              >
                <Play className="w-3 h-3" />
                Resume
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={pauseTranslation}
                className="gap-1.5 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
              >
                <Pause className="w-3 h-3" />
                Pause
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={stopTranslation}
              className="gap-1.5 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
            >
              <Square className="w-3 h-3" />
              Stop
            </Button>
          </>
        )}
        
        {translatedSegments.length > 0 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={translatedSegments.length === 0}
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
              disabled={translatedSegments.length === 0}
              className="gap-1.5 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
            >
              <Download className="w-3 h-3" />
              Download
            </Button>
          </>
        )}
      </div>

      {isTranslating && (
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">From:</span>
            <select 
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="bg-slate-700 text-slate-200 text-xs rounded px-2 py-1"
              disabled={isTranslating}
            >
              {languageOptions.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">To:</span>
            <select 
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="bg-slate-700 text-slate-200 text-xs rounded px-2 py-1"
              disabled={isTranslating}
            >
              {languageOptions.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 max-h-60 overflow-y-auto">
        {translatedSegments.length > 0 ? (
          <div className="space-y-3">
            {translatedSegments.map((segment) => (
              <div key={segment.id} className="border-b border-slate-700 pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-blue-400">{segment.speaker}</span>
                  <span className="text-xs text-slate-500">
                    {segment.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-slate-300">{segment.originalText}</p>
                  <p className="text-sm text-slate-400 italic">{segment.translatedText}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="text-center py-8">
            <Languages className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">
              {isTranslating 
                ? "Listening for speech to translate..." 
                : "Start translation to see real-time translations"}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};