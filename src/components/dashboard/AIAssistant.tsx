import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Send, Sparkles, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI assistant. I can help you schedule meetings, manage tasks, and answer questions about your workflow. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        role: "assistant",
        content: data.message,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('AI chat error:', error);
      const errorMessage: Message = {
        role: "assistant",
        content: error.message || "Sorry, I'm having trouble connecting right now. Please check that the AI integration is properly configured.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="w-8 h-8 text-primary" />
          AI Assistant
        </h2>
        <p className="text-muted-foreground">Your intelligent meeting companion</p>
      </div>

      <Card className="glass-effect p-6 h-[600px] flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.role === "user"
                    ? "bg-gradient-primary text-white"
                    : "glass-effect"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">AI Assistant</span>
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="glass-effect p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">AI Assistant</span>
                </div>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything..."
            className="glass-effect"
            disabled={isLoading}
          />
          <Button onClick={handleSend} variant="hero" disabled={isLoading}>
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Suggestions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setInput("Schedule a meeting for tomorrow")}
            className="text-xs px-3 py-1 rounded-full glass-effect hover:bg-primary/20 transition-colors"
            disabled={isLoading}
          >
            Schedule meeting
          </button>
          <button
            onClick={() => setInput("Show my tasks")}
            className="text-xs px-3 py-1 rounded-full glass-effect hover:bg-primary/20 transition-colors"
            disabled={isLoading}
          >
            Show tasks
          </button>
          <button
            onClick={() => setInput("Meeting summary")}
            className="text-xs px-3 py-1 rounded-full glass-effect hover:bg-primary/20 transition-colors"
            disabled={isLoading}
          >
            Meeting summary
          </button>
        </div>
        
        {/* Configuration Notice */}
        <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-yellow-500">AI Integration Setup Required</p>
            <p className="text-muted-foreground">
              To use this feature, ensure the OpenAI API key is properly configured in your Supabase project settings.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIAssistant;