import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Brain, 
  Send, 
  Calendar, 
  FileText, 
  Users, 
  Copy,
  ThumbsUp,
  ThumbsDown,
  Check,
  Sparkles,
  Video,
  BarChart3,
  ListTodo,
  Target
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  liked?: boolean;
  disliked?: boolean;
  copied?: boolean;
}

interface Template {
  id: string;
  title: string;
  description: string;
  icon: any;
  prompt: string;
  color: string;
}

const AIMeetingAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI Meeting Management Assistant. I can help you schedule meetings, create agendas, take notes, track action items, and analyze meeting effectiveness. Choose a template below or ask me anything!",
      timestamp: new Date()
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const templates: Template[] = [
    {
      id: "1",
      title: "Schedule Team Meeting",
      description: "Create a meeting with agenda",
      icon: Calendar,
      prompt: "Help me schedule a team meeting for next week. I need to discuss Q4 planning, budget review, and team objectives. The meeting should be 1 hour long.",
      color: "from-blue-600 to-cyan-600"
    },
    {
      id: "2",
      title: "Create Meeting Agenda",
      description: "Generate structured agenda",
      icon: FileText,
      prompt: "Create a detailed meeting agenda for a project kickoff meeting. Include time allocations for introductions, project overview, timeline discussion, and Q&A.",
      color: "from-purple-600 to-pink-600"
    },
    {
      id: "3",
      title: "Meeting Minutes",
      description: "Take and organize notes",
      icon: ListTodo,
      prompt: "Help me create meeting minutes template with sections for attendees, discussion points, decisions made, and action items with owners and deadlines.",
      color: "from-emerald-600 to-teal-600"
    },
    {
      id: "4",
      title: "Action Items Tracker",
      description: "Track tasks and follow-ups",
      icon: Target,
      prompt: "Create an action items tracker from our last meeting. I need to organize tasks by priority, assign owners, set deadlines, and track completion status.",
      color: "from-orange-600 to-red-600"
    },
    {
      id: "5",
      title: "1-on-1 Meeting",
      description: "Structure one-on-one discussions",
      icon: Users,
      prompt: "Help me prepare for a 1-on-1 meeting with my team member. Include discussion topics like performance review, career development, and current challenges.",
      color: "from-indigo-600 to-blue-600"
    },
    {
      id: "6",
      title: "Meeting Analytics",
      description: "Analyze meeting effectiveness",
      icon: BarChart3,
      prompt: "Provide insights on how to make our team meetings more effective. Analyze common issues like meeting length, participation, and follow-through on action items.",
      color: "from-violet-600 to-purple-600"
    }
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { 
      id: Date.now().toString(),
      role: "user", 
      content: input,
      timestamp: new Date()
    };
    
    // Add new message to the beginning of the array
    setMessages(prev => [userMessage, ...prev]);
    setInput("");
    setIsLoading(true);

    try {
      console.log("Sending message to AI chat function:", input);
      
      // Use Supabase Edge Function instead of calling OpenAI directly
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [
            {
              role: "user",
              content: input
            }
          ]
        }
      });

      console.log("Received response from AI chat function:", { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        let errorMessage = error.message || "Failed to get response from AI service";
        
        // Check if we have more details about the error
        if (error.hasOwnProperty('context')) {
          // @ts-ignore - accessing context property
          errorMessage += ` - ${error.context}`;
        }
        
        // Handle specific error cases
        if (errorMessage.includes("insufficient_quota")) {
          throw new Error("OpenAI API quota exceeded. Please check your OpenAI plan and billing details.");
        } else if (errorMessage.includes("rate_limit_exceeded")) {
          throw new Error("Rate limit exceeded. Please wait a moment and try again.");
        } else if (errorMessage.includes("invalid_api_key")) {
          throw new Error("Invalid OpenAI API key. Please check your API key configuration.");
        }
        
        // If function not found (404) or network, try fallback direct fetch
        if (String(errorMessage).includes('404') || String(errorMessage).toLowerCase().includes('not found')) {
          const functionsBase = (import.meta as any).env?.VITE_SUPABASE_FUNCTIONS_URL || `${(import.meta as any).env?.VITE_SUPABASE_URL}/functions/v1`;
          const fallbackUrl = `${functionsBase}/ai-chat`;
          try {
            const resp = await fetch(fallbackUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                messages: [
                  { role: 'user', content: input }
                ]
              })
            });
            if (!resp.ok) {
              const text = await resp.text();
              throw new Error(`Fallback failed (${resp.status}): ${text}`);
            }
            const json = await resp.json();
            const aiResponse = json.message || json.response || JSON.stringify(json);
            const aiMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: aiResponse,
              timestamp: new Date()
            };
            setMessages(prev => [aiMessage, ...prev]);
            return;
          } catch (fbErr: any) {
            throw new Error(`Function error: ${errorMessage}. Fallback also failed: ${fbErr?.message || fbErr}`);
          }
        }

        throw new Error(`Function error: ${errorMessage}`);
      }

      // Check if we received valid data
      if (!data) {
        throw new Error("No data received from AI service");
      }

      // Extract the message from the response
      const aiResponse = data.message || data.response || JSON.stringify(data);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date()
      };

      // Add AI message to the beginning of the array
      setMessages(prev => [aiMessage, ...prev]);
    } catch (error: any) {
      console.error('AI chat error:', error);
      
      const errorMessage = error.message || "Unknown error";
      const fallbackMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: `I encountered an error: ${errorMessage}. Please check your OpenAI API key configuration in Supabase secrets and try again. If the problem persists, check the Supabase function logs for more details.`,
        timestamp: new Date()
      };
      setMessages(prev => [fallbackMessage, ...prev]);
      
      toast.error("AI service connection issue.", {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content);
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, copied: true } : msg
    ));
    
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, copied: false } : msg
      ));
    }, 2000);
  };

  const handleLike = (messageId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return { 
          ...msg, 
          liked: !msg.liked,
          disliked: msg.liked ? msg.disliked : false
        };
      }
      return msg;
    }));
  };

  const handleDislike = (messageId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return { 
          ...msg, 
          disliked: !msg.disliked,
          liked: msg.disliked ? msg.liked : false
        };
      }
      return msg;
    }));
  };

  const handleTemplateClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex flex-col overflow-hidden">
      
      {/* Fixed Header */}
      <div className="flex-none border-b border-blue-500/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-100">AI Meeting Assistant</h1>
              <p className="text-xs text-blue-300/70">Your intelligent meeting companion</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="border-blue-500/30 text-blue-300 hover:bg-blue-500/20 transition-all"
          >
            <Video className="w-4 h-4 mr-2" />
            Join Meeting
          </Button>
        </div>
      </div>

      {/* Main Content - Fixed Height with Scroll */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full p-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
            
            {/* Templates Sidebar - Scrollable */}
            <div className="lg:col-span-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-transparent">
              <Card className="bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur-xl border-blue-500/20 p-4 sticky top-0">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-lg font-semibold text-blue-100">Quick Templates</h2>
                </div>
                
                <div className="space-y-3">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateClick(template.prompt)}
                      disabled={isLoading}
                      className="w-full text-left p-3 rounded-xl bg-gradient-to-br from-slate-800/80 to-blue-900/80 border border-blue-500/20 hover:border-blue-400/50 "
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${template.color} group-hover:scale-110 transition-transform`}>
                          <template.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-blue-100 mb-1 truncate">{template.title}</h3>
                          <p className="text-xs text-blue-300/70 line-clamp-2">{template.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Chat Area - Fixed Height with Internal Scroll */}
            {/* Chat Area - Fixed Height with Separate Scroll + Fixed Input */}
      <div className="lg:col-span-3 flex flex-col h-[calc(100vh-100px)]">
        <Card className="relative flex flex-col flex-1 bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur-xl border-blue-500/20 overflow-hidden">

    {/* ✅ Scrollable Messages Area */}
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 space-y-4 scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-transparent"
      id="messages-container"
    >
      {/* Reverse the order of messages to display newest at the top */}
      {[...messages].reverse().map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} `}
          onMouseEnter={() => setHoveredMessageId(message.id)}
          onMouseLeave={() => setHoveredMessageId(null)}
        >
          <div
            className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-lg transition-all ${
              message.role === "user"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "bg-gradient-to-r from-slate-800/90 to-blue-900/90 backdrop-blur-sm border border-blue-500/30 text-blue-100"
            }`}
          >
            {message.role === "assistant" && (
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-blue-500/20">
                <Brain className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-blue-300">AI Assistant</span>
              </div>
            )}
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            {message.timestamp && (
              <p className="text-xs mt-2 opacity-60">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}

            {/* Action Buttons */}
            {message.role === "assistant" && (
              <div
                className={`flex items-center gap-2 mt-3 transition-opacity duration-200 ${
                  hoveredMessageId === message.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 hover:bg-blue-500/20 text-blue-300"
                  onClick={() => handleCopy(message.content, message.id)}
                >
                  {message.copied ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 hover:bg-blue-500/20 text-blue-300"
                  onClick={() => handleLike(message.id)}
                >
                  <ThumbsUp
                    className={`w-3 h-3 transition-all ${
                      message.liked ? "text-emerald-400 fill-emerald-400" : ""
                    }`}
                  />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 hover:bg-blue-500/20 text-blue-300"
                  onClick={() => handleDislike(message.id)}
                >
                  <ThumbsDown
                    className={`w-3 h-3 transition-all ${
                      message.disliked ? "text-red-400 fill-red-400" : ""
                    }`}
                  />
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gradient-to-r from-slate-800/90 to-blue-900/90 backdrop-blur-sm border border-blue-500/30 p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-blue-500/20">
              <Brain className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-300">AI Assistant</span>
            </div>
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <div className="w-2 h-2 rounded-full bg-pink-400"></div>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* ✅ Fixed Input Area */}
    <div className="sticky bottom-0 p-4 md:p-6 bg-gradient-to-r from-slate-800/80 to-blue-900/80 backdrop-blur-sm border-t border-blue-500/20">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ask about meeting management..."
          className="flex-1 bg-slate-800/50 border-blue-500/30 text-blue-100 placeholder:text-blue-300/50 focus:border-blue-400 focus:ring-blue-400/20"
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full " />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>
      <p className="text-xs text-blue-300/50 mt-2 text-center">
        Press Enter to send • Shift + Enter for new line
      </p>
    </div>
  </Card>
</div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMeetingAssistant;