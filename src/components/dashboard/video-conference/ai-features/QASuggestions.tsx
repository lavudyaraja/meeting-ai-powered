import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Play, 
  Square,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  RotateCcw
} from "lucide-react";

interface QASuggestion {
  id: string;
  question: string;
  answer: string;
  category: string;
  timestamp: Date;
  liked: boolean | null;
}

interface QASuggestionsProps {
  meetingId: string;
  participants: Array<{ id: string; name: string }>;
  className?: string;
  onSuggestionsUpdate?: (suggestions: string) => void;
}

export const QASuggestions: React.FC<QASuggestionsProps> = ({
  meetingId,
  participants,
  className = "",
  onSuggestionsUpdate
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<QASuggestion[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to generate QA suggestions
  const generateQASuggestions = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      
      // Call the Supabase function to generate QA suggestions
      console.log("Generating QA suggestions for meeting:", meetingId);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-qa-suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          meetingId,
          participants
        })
      });
      
      if (!response.ok) {
        throw new Error(`QA Suggestions generation failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the suggestions into the expected format
      const newSuggestions: QASuggestion[] = data.suggestions.map((suggestion: any, index: number) => ({
        id: Date.now().toString() + index,
        question: suggestion.question,
        answer: suggestion.answer,
        category: suggestion.category,
        timestamp: new Date(),
        liked: null
      }));
      
      setSuggestions(prev => [...prev, ...newSuggestions]);
      onSuggestionsUpdate?.(JSON.stringify(data.suggestions));
    } catch (err) {
      console.error("Error generating QA suggestions:", err);
      setError(err.message || 'Failed to generate QA suggestions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const stopGeneration = () => {
    setIsGenerating(false);
  };

  const handleCopy = () => {
    if (suggestions.length === 0) return;
    
    const textToCopy = suggestions
      .map(suggestion => `Q: ${suggestion.question}\nA: ${suggestion.answer}\nCategory: ${suggestion.category}\n`)
      .join('\n---\n\n');
      
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const likeSuggestion = (id: string) => {
    setSuggestions(prev => 
      prev.map(suggestion => 
        suggestion.id === id ? { ...suggestion, liked: true } : suggestion
      )
    );
  };

  const dislikeSuggestion = (id: string) => {
    setSuggestions(prev => 
      prev.map(suggestion => 
        suggestion.id === id ? { ...suggestion, liked: false } : suggestion
      )
    );
  };

  const resetFeedback = (id: string) => {
    setSuggestions(prev => 
      prev.map(suggestion => 
        suggestion.id === id ? { ...suggestion, liked: null } : suggestion
      )
    );
  };

  const regenerateSuggestions = () => {
    setSuggestions([]);
    generateQASuggestions();
  };

  return (
    <Card className={`p-4 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-green-400" />
          <h3 className="font-semibold text-slate-100">QA Suggestions</h3>
          <Badge variant="outline" className="text-xs bg-green-900/50 text-green-300 border-green-700">
            {suggestions.length} suggestions
          </Badge>
        </div>
        
        {isGenerating && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-400">Generating...</span>
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
        <Button
          variant="outline"
          size="sm"
          onClick={generateQASuggestions}
          disabled={isGenerating}
          className="gap-1.5 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Play className="w-3 h-3" />
              Generate QA Suggestions
            </>
          )}
        </Button>
        
        {isGenerating && (
          <Button
            variant="outline"
            size="sm"
            onClick={stopGeneration}
            className="gap-1.5 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
          >
            <Square className="w-3 h-3" />
            Stop
          </Button>
        )}
        
        {suggestions.length > 0 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={suggestions.length === 0}
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
              onClick={regenerateSuggestions}
              className="gap-1.5 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
            >
              <RotateCcw className="w-3 h-3" />
              Regenerate
            </Button>
          </>
        )}
      </div>

      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 max-h-60 overflow-y-auto">
        {suggestions.length > 0 ? (
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div 
                key={suggestion.id} 
                className="border border-slate-700 rounded-lg p-4 bg-slate-800/50"
              >
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-xs bg-slate-700 text-slate-300 border-slate-600">
                    {suggestion.category}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    {suggestion.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="mb-3">
                  <h4 className="font-medium text-slate-200 mb-1">Q: {suggestion.question}</h4>
                  <p className="text-sm text-slate-400">A: {suggestion.answer}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => suggestion.liked === true ? resetFeedback(suggestion.id) : likeSuggestion(suggestion.id)}
                      className={`flex items-center gap-1 text-xs ${suggestion.liked === true ? 'text-green-400' : 'text-slate-400 hover:text-green-400'}`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Helpful</span>
                    </button>
                    <button 
                      onClick={() => suggestion.liked === false ? resetFeedback(suggestion.id) : dislikeSuggestion(suggestion.id)}
                      className={`flex items-center gap-1 text-xs ${suggestion.liked === false ? 'text-red-400' : 'text-slate-400 hover:text-red-400'}`}
                    >
                      <ThumbsDown className="w-3 h-3" />
                      <span>Not Helpful</span>
                    </button>
                  </div>
                  
                  {suggestion.liked !== null && (
                    <span className={`text-xs ${suggestion.liked ? 'text-green-400' : 'text-red-400'}`}>
                      {suggestion.liked ? 'Thanks for the feedback!' : 'Thanks, we\'ll improve'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">
              {isGenerating 
                ? "AI is analyzing the meeting to generate QA suggestions..." 
                : "Generate QA suggestions to get helpful questions and answers"}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};