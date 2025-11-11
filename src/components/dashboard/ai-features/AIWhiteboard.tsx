import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Pen, 
  Square, 
  Circle, 
  Move, 
  Eraser, 
  Download, 
  Upload, 
  Sparkles, 
  Loader2, 
  Copy, 
  Check,
  Save,
  Trash2,
  ZoomIn,
  ZoomOut,
  Redo,
  Undo,
  Type,
  Brain,
  FileText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WhiteboardObject {
  id: string;
  type: 'freehand' | 'rectangle' | 'circle' | 'text' | 'eraser';
  points?: { x: number; y: number }[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  text?: string;
  color: string;
  strokeWidth: number;
}

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

const AIWhiteboard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'freehand' | 'rectangle' | 'circle' | 'text' | 'eraser' | 'move'>('freehand');
  const [currentColor, setCurrentColor] = useState('#ffffff');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [objects, setObjects] = useState<WhiteboardObject[]>([]);
  const [textInput, setTextInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw existing objects
    drawObjects(ctx);
  }, [objects]);

  const drawObjects = (ctx: CanvasRenderingContext2D) => {
    objects.forEach(obj => {
      ctx.strokeStyle = obj.color;
      ctx.lineWidth = obj.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (obj.type === 'freehand' && obj.points) {
        ctx.beginPath();
        obj.points.forEach((point, i) => {
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      } else if (obj.type === 'rectangle' && obj.x !== undefined && obj.y !== undefined && obj.width !== undefined && obj.height !== undefined) {
        ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
      } else if (obj.type === 'circle' && obj.x !== undefined && obj.y !== undefined && obj.width !== undefined && obj.height !== undefined) {
        const radius = Math.sqrt(obj.width * obj.width + obj.height * obj.height) / 2;
        ctx.beginPath();
        ctx.arc(obj.x + obj.width / 2, obj.y + obj.height / 2, Math.abs(radius), 0, Math.PI * 2);
        ctx.stroke();
      } else if (obj.type === 'text' && obj.text && obj.x !== undefined && obj.y !== undefined) {
        ctx.fillStyle = obj.color;
        ctx.font = `${obj.strokeWidth * 8}px Arial`;
        ctx.fillText(obj.text, obj.x, obj.y);
      }
    });
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'move') return;

    setIsDrawing(true);
    const pos = getMousePos(e);
    
    const newObject: WhiteboardObject = {
      id: Date.now().toString(),
      type: currentTool,
      color: currentColor,
      strokeWidth: strokeWidth,
      points: currentTool === 'freehand' ? [pos] : undefined,
      x: pos.x,
      y: pos.y
    };

    setObjects([...objects, newObject]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentTool === 'move') return;

    const pos = getMousePos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updatedObjects = [...objects];
    const currentObject = updatedObjects[updatedObjects.length - 1];

    if (currentTool === 'freehand' && currentObject.points) {
      currentObject.points.push(pos);
    } else if ((currentTool === 'rectangle' || currentTool === 'circle') && currentObject.x !== undefined && currentObject.y !== undefined) {
      currentObject.width = pos.x - currentObject.x;
      currentObject.height = pos.y - currentObject.y;
    }

    setObjects(updatedObjects);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    setObjects([]);
    toast({
      title: "Canvas cleared",
      description: "All drawings have been removed",
    });
  };

  const generateAIContent = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "You need to specify what you want the AI to help with",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [
            {
              role: "user",
              content: aiPrompt
            }
          ]
        }
      });

      if (error) throw error;

      // Create a new text object with AI response
      const newTextObject: WhiteboardObject = {
        id: Date.now().toString(),
        type: 'text',
        text: data.message,
        x: 50,
        y: 50,
        color: '#ffffff',
        strokeWidth: 2
      };

      setObjects([...objects, newTextObject]);
      setAiPrompt("");

      toast({
        title: "Success",
        description: "AI content generated and added to whiteboard",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate AI content",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveNote = async () => {
    if (!textInput.trim()) {
      toast({
        title: "Note is empty",
        description: "Please add some content to save",
        variant: "destructive",
      });
      return;
    }

    try {
      const newNote: Note = {
        id: Date.now().toString(),
        title: `Note ${notes.length + 1}`,
        content: textInput,
        created_at: new Date().toISOString()
      };

      setNotes([...notes, newNote]);
      setTextInput("");
      
      toast({
        title: "Note saved",
        description: "Your note has been saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save note",
        variant: "destructive",
      });
    }
  };

  const copyNote = () => {
    if (selectedNote) {
      navigator.clipboard.writeText(selectedNote.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied",
        description: "Note content copied to clipboard",
      });
    }
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const tools = [
    { id: 'freehand', icon: Pen, label: 'Pen' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'move', icon: Move, label: 'Move' }
  ];

  const colors = [
    '#ffffff', '#ff0000', '#00ff00', '#0000ff', 
    '#ffff00', '#ff00ff', '#00ffff', '#ff8000'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            AI Whiteboard
          </h2>
          <p className="text-muted-foreground">
            Collaborative whiteboard with AI assistance for problem solving
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - Tools */}
        <div className="lg:col-span-1 space-y-6">
          {/* Drawing Tools */}
          <Card className="glass-effect p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Pen className="w-4 h-4" />
              Drawing Tools
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Button
                    key={tool.id}
                    variant={currentTool === tool.id ? "default" : "outline"}
                    size="icon"
                    className="h-12 w-12"
                    onClick={() => setCurrentTool(tool.id as any)}
                    title={tool.label}
                  >
                    <Icon className="w-5 h-5" />
                  </Button>
                );
              })}
            </div>
          </Card>

          {/* Colors */}
          <Card className="glass-effect p-4">
            <h3 className="font-semibold mb-3">Colors</h3>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <Button
                  key={color}
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full p-0"
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                />
              ))}
            </div>
          </Card>

          {/* Stroke Width */}
          <Card className="glass-effect p-4">
            <h3 className="font-semibold mb-3">Stroke Width</h3>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="20"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm">{strokeWidth}px</div>
            </div>
          </Card>

          {/* Actions */}
          <Card className="glass-effect p-4">
            <h3 className="font-semibold mb-3">Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearCanvas}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportCanvas}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
              >
                <Undo className="w-4 h-4 mr-2" />
                Undo
              </Button>
              <Button
                variant="outline"
                size="sm"
              >
                <Redo className="w-4 h-4 mr-2" />
                Redo
              </Button>
            </div>
          </Card>

          {/* AI Assistant */}
          <Card className="glass-effect p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Assistant
            </h3>
            <div className="space-y-3">
              <Textarea
                placeholder="Ask AI to help with your problem..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="min-h-[100px]"
              />
              <Button
                className="w-full"
                onClick={generateAIContent}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Center Panel - Whiteboard */}
        <div className="lg:col-span-2">
          <Card className="glass-effect p-4 h-full">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Whiteboard</h3>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon">
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="border border-primary/30 rounded-lg overflow-hidden bg-slate-900 h-[500px]">
              <canvas
                ref={canvasRef}
                className="w-full h-full cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
          </Card>
        </div>

        {/* Right Panel - Notes */}
        <div className="lg:col-span-1 space-y-6">
          {/* Notes Editor */}
          <Card className="glass-effect p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Notes
            </h3>
            <div className="space-y-3">
              <Textarea
                placeholder="Write your notes here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-[150px]"
              />
              <Button
                className="w-full"
                onClick={saveNote}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Note
              </Button>
            </div>
          </Card>

          {/* Saved Notes */}
          <Card className="glass-effect p-4">
            <h3 className="font-semibold mb-3">Saved Notes</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {notes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No saved notes
                </p>
              ) : (
                notes.map((note) => (
                  <Button
                    key={note.id}
                    variant="ghost"
                    className="w-full justify-start h-auto py-2 px-3 text-left"
                    onClick={() => setSelectedNote(note)}
                  >
                    <div>
                      <p className="font-medium text-sm truncate">{note.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {new Date(note.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </Button>
                ))
              )}
            </div>
          </Card>

          {/* Selected Note */}
          {selectedNote && (
            <Card className="glass-effect p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-sm truncate">{selectedNote.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyNote}
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <div className="text-sm whitespace-pre-wrap max-h-32 overflow-y-auto">
                {selectedNote.content}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIWhiteboard;