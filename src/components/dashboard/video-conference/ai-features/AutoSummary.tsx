import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Play, 
  Download, 
  Copy, 
  Check,
  AlertCircle,
  Loader2,
  Info,
  ExternalLink
} from "lucide-react";

interface AutoSummaryProps {
  meetingId: string;
  participants: Array<{ id: string; name: string }>;
  onSummaryUpdate?: (summary: string) => void;
  className?: string;
}

export const AutoSummary: React.FC<AutoSummaryProps> = ({
  meetingId,
  participants,
  onSummaryUpdate,
  className = ""
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Function to generate real summary using OpenAI API
  const generateRealSummary = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      setProgress(0);
      setSummary("");
      
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + 10, 90);
          return newProgress;
        });
      }, 300);
      
      // Call the Supabase function to generate summary
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-summary`, {
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
      
      clearInterval(interval);
      setProgress(100);
      
      // Log response for debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Get response text first
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      // Check if response is empty
      if (!responseText) {
        throw new Error('Empty response from server. The AI function may not be deployed.');
      }
      
      // Try to parse JSON first (even if response is not OK, it might contain error details)
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        // If parsing fails and response is not OK, throw with the raw text
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${responseText || 'Failed to generate summary'}`);
        }
        console.error('JSON parse error:', parseError);
        throw new Error(`Invalid response format: ${responseText.substring(0, 100)}...`);
      }
      
      // Check for errors in response (check before checking response.ok)
      if (data.error) {
        // Handle quota exceeded error specifically - check multiple ways
        const errorStr = String(data.error || '').toLowerCase();
        const detailsStr = String(data.details || '').toLowerCase();
        
        if (data.errorType === 'quota_exceeded' || 
            data.statusCode === 429 || 
            response.status === 429 ||
            errorStr.includes('quota exceeded') ||
            errorStr.includes('429') ||
            detailsStr.includes('429') ||
            detailsStr.includes('exceeded your current quota') ||
            detailsStr.includes('insufficient_quota')) {
          throw new Error(
            'OpenAI API quota exceeded. Please add credits to your OpenAI account to continue using AI features. ' +
            'Visit https://platform.openai.com/account/billing to add credits.'
          );
        }
        throw new Error(data.error || 'Failed to generate summary');
      }
      
      // Check if response is OK (after checking for errors in data)
      if (!response.ok) {
        // Special handling for 404 errors (function not found)
        if (response.status === 404) {
          throw new Error('AI function not found. Please deploy the ai-summary function to Supabase.');
        }
        throw new Error(`HTTP ${response.status}: ${data.error || responseText || 'Failed to generate summary'}`);
      }
      
      // Check if we have a summary
      if (!data.summary) {
        throw new Error('No summary in response');
      }
      
      setSummary(data.summary);
      onSummaryUpdate?.(data.summary);
    } catch (err: any) {
      console.error("Error generating summary:", err);
      setError(err.message || 'Failed to generate summary. Please try again.');
      setProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSummary = async () => {
    await generateRealSummary();
  };

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!summary) return;
    const blob = new Blob([summary], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meeting-summary-${meetingId}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className={`p-4 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold text-slate-100">AI Meeting Summary</h3>
          <Badge variant="outline" className="text-xs bg-purple-900/50 text-purple-300 border-purple-700">
            {participants.length} participants
          </Badge>
        </div>
        
        {isGenerating && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-xs text-purple-400">Generating...</span>
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
          onClick={handleGenerateSummary}
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
              Generate Summary
            </>
          )}
        </Button>
        
        {summary && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!summary}
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
              disabled={!summary}
              className="gap-1.5 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
            >
              <Download className="w-3 h-3" />
              Download
            </Button>
          </>
        )}
      </div>

      {isGenerating && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>AI Processing</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {summary ? (
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 max-h-60 overflow-y-auto">
          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans">
            {summary}
          </pre>
        </div>
      ) : (
        <div className="bg-slate-900/30 border-2 border-dashed border-slate-700 rounded-lg p-6 text-center">
          <Brain className="w-8 h-8 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-500 text-sm mb-3">
            {isGenerating 
              ? "AI is analyzing the meeting..." 
              : "Click 'Generate Summary' to create an AI-powered meeting summary"}
          </p>
          
          {!isGenerating && (
            <div className="text-xs text-slate-400 mt-3 p-3 bg-slate-800/50 rounded-lg text-left">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-300 mb-1">How it works:</p>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    <li>AI analyzes meeting chat transcript</li>
                    <li>Generates structured summary with key points</li>
                    <li>Identifies action items and decisions</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className={`mt-3 p-3 rounded-lg text-left ${
              error.includes('quota exceeded') || error.includes('429')
                ? 'bg-red-900/20 border border-red-800'
                : 'bg-amber-900/20 border border-amber-800'
            }`}>
              <div className="flex items-start gap-2">
                <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                  error.includes('quota exceeded') || error.includes('429')
                    ? 'text-red-400'
                    : 'text-amber-400'
                }`} />
                <div>
                  <p className={`font-medium mb-1 ${
                    error.includes('quota exceeded') || error.includes('429')
                      ? 'text-red-300'
                      : 'text-amber-300'
                  }`}>
                    {error.includes('quota exceeded') || error.includes('429')
                      ? 'OpenAI Quota Exceeded'
                      : 'Troubleshooting Tips'}
                  </p>
                  {error.includes('quota exceeded') || error.includes('429') ? (
                    <div className="text-xs space-y-2">
                      <p className="text-red-200 mb-2">{error}</p>
                      <ul className="list-disc list-inside space-y-1 text-red-200">
                        <li>Add credits to your OpenAI account at <a href="https://platform.openai.com/account/billing" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/account/billing</a></li>
                        <li>Check your usage limits and billing settings</li>
                        <li>Consider upgrading your OpenAI plan for higher quotas</li>
                      </ul>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="mt-2 p-0 h-auto text-red-300 hover:text-red-200"
                        onClick={() => window.open('https://platform.openai.com/account/billing', '_blank')}
                      >
                        Open OpenAI Billing <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <ul className="list-disc list-inside space-y-1 text-xs text-amber-200">
                        <li>Ensure the AI function is deployed to Supabase</li>
                        <li>Check that OPENAI_API_KEY is set in Supabase secrets</li>
                        <li>Verify meeting has chat messages for analysis</li>
                      </ul>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="mt-2 p-0 h-auto text-amber-300 hover:text-amber-200"
                        onClick={() => window.open('DEPLOYMENT_GUIDE.md', '_blank')}
                      >
                        View Deployment Guide <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};