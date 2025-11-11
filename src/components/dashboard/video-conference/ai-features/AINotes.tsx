import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Play, 
  Square,
  Download,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Plus,
  Edit3,
  Save,
  X
} from "lucide-react";

interface AINote {
  id: string;
  content: string;
  timestamp: Date;
  isEditing: boolean;
  isNew: boolean;
}

interface AINotesProps {
  meetingId: string;
  participants: Array<{ id: string; name: string }>;
  className?: string;
  onNotesUpdate?: (notes: string) => void;
}

export const AINotes: React.FC<AINotesProps> = ({
  meetingId,
  participants,
  className = "",
  onNotesUpdate
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [notes, setNotes] = useState<AINote[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new notes are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [notes]);

  // Function to generate AI notes
  const generateAINotes = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      
      // Call the Supabase function to generate AI notes
      console.log("Generating AI notes for meeting:", meetingId);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-notes`, {
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
        throw new Error(`AI Notes generation failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Parse the notes and add them to the UI
      // For simplicity, we'll treat the entire response as one note
      // In a more complex implementation, you might parse structured notes
      const newNote: AINote = {
        id: Date.now().toString(),
        content: data.notes,
        timestamp: new Date(),
        isEditing: false,
        isNew: true
      };
      
      setNotes(prev => [...prev, newNote]);
      onNotesUpdate?.(data.notes);
    } catch (err) {
      console.error("Error generating AI notes:", err);
      setError(err.message || 'Failed to generate AI notes. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const stopGeneration = () => {
    setIsGenerating(false);
  };

  const handleCopy = () => {
    if (notes.length === 0) return;
    
    const textToCopy = notes
      .map(note => `[${note.timestamp.toLocaleTimeString()}] ${note.content}`)
      .join('\n\n');
      
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (notes.length === 0) return;
    
    const header = `AI Meeting Notes
Meeting ID: ${meetingId}
Participants: ${participants.map(p => p.name).join(', ')}
Generated: ${new Date().toLocaleString()}

`;
    
    const textToDownload = notes
      .map(note => `[${note.timestamp.toLocaleTimeString()}] ${note.content}`)
      .join('\n\n');
      
    const blob = new Blob([header + textToDownload], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-meeting-notes-${meetingId}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const addNewNote = () => {
    const newNote: AINote = {
      id: Date.now().toString(),
      content: "",
      timestamp: new Date(),
      isEditing: true,
      isNew: true
    };
    
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = (id: string, content: string) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === id ? { ...note, content } : note
      )
    );
  };

  const saveNote = (id: string) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === id ? { ...note, isEditing: false, isNew: false } : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const startEditing = (id: string) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === id ? { ...note, isEditing: true } : note
      )
    );
  };

  return (
    <Card className={`p-4 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold text-slate-100">AI Meeting Notes</h3>
          <Badge variant="outline" className="text-xs bg-purple-900/50 text-purple-300 border-purple-700">
            {notes.length} notes
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
          onClick={generateAINotes}
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
              Generate AI Notes
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
        
        <Button
          variant="outline"
          size="sm"
          onClick={addNewNote}
          className="gap-1.5 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
        >
          <Plus className="w-3 h-3" />
          Add Note
        </Button>
        
        {notes.length > 0 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={notes.length === 0}
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
              disabled={notes.length === 0}
              className="gap-1.5 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
            >
              <Download className="w-3 h-3" />
              Download
            </Button>
          </>
        )}
      </div>

      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 max-h-60 overflow-y-auto">
        {notes.length > 0 ? (
          <div className="space-y-3">
            {notes.map((note) => (
              <div 
                key={note.id} 
                className={`border border-slate-700 rounded-lg p-3 ${note.isNew ? 'bg-purple-900/20' : 'bg-slate-800/50'}`}
              >
                {note.isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={note.content}
                      onChange={(e) => updateNote(note.id, e.target.value)}
                      className="w-full bg-slate-700 text-slate-200 rounded-lg px-3 py-2 border border-slate-600 focus:border-purple-500 focus:outline-none text-sm"
                      rows={3}
                      placeholder="Enter your note here..."
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => saveNote(note.id)}
                        className="gap-1.5 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200 text-xs"
                      >
                        <Save className="w-3 h-3" />
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteNote(note.id)}
                        className="gap-1.5 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200 text-xs"
                      >
                        <X className="w-3 h-3" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-slate-500">
                        {note.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => startEditing(note.id)}
                          className="text-slate-400 hover:text-slate-200"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => deleteNote(note.id)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 mt-1">{note.content}</p>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-500 text-sm mb-3">
              {isGenerating 
                ? "AI is analyzing the meeting to generate notes..." 
                : "Generate AI notes or add your own notes"}
            </p>
            {!isGenerating && (
              <Button
                variant="outline"
                size="sm"
                onClick={addNewNote}
                className="gap-1.5 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
              >
                <Plus className="w-3 h-3" />
                Add First Note
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};