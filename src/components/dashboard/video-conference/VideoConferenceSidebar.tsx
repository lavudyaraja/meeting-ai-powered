import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  Share2,
  Copy,
  UserPlus,
  Users,
  MessageSquare,
  Brain,
  FileText,
  Download,
  PenTool,
  Lightbulb,
  AlertCircle,
  Lock,
  Unlock,
  Pin,
  Send,
  Mic,
  MicOff,
  Video,
  VideoOff,
  CheckCircle2,
  Clock,
  TrendingUp,
  Sparkles,
  Check
} from "lucide-react";

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

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  isAI?: boolean;
}

interface AIInsight {
  id: string;
  type: 'summary' | 'action-item' | 'question' | 'topic' | 'decision';
  content: string;
  timestamp: string;
  priority?: 'high' | 'medium' | 'low';
}

interface VideoConferenceSidebarProps {
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  isParticipantsOpen: boolean;
  isChatOpen: boolean;
  showAIInsights: boolean;
  showTranscription: boolean;
  showMeetingNotes: boolean;
  participants: Participant[];
  chatMessages: ChatMessage[];
  aiInsights: AIInsight[];
  transcription: string[];
  meetingNotes: string;
  chatContainerRef: React.RefObject<HTMLDivElement>;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  setMeetingNotes: React.Dispatch<React.SetStateAction<string>>;
  downloadTranscript: () => void;
  downloadSummary: () => void;
  pinParticipant: (participantId: string) => void;
  pinnedParticipant: string | null;
  meetingLink: string;
  copyMeetingLink: () => void;
  shareMeeting: () => void;
  toggleMeetingLock: () => void;
  isMeetingLocked: boolean;
}

export const VideoConferenceSidebar = ({
  connectionStatus,
  isParticipantsOpen,
  isChatOpen,
  showAIInsights,
  showTranscription,
  showMeetingNotes,
  participants,
  chatMessages,
  aiInsights,
  transcription,
  meetingNotes,
  chatContainerRef,
  newMessage,
  setNewMessage,
  sendMessage,
  handleKeyPress,
  setMeetingNotes,
  downloadTranscript,
  downloadSummary,
  pinParticipant,
  pinnedParticipant,
  meetingLink,
  copyMeetingLink,
  shareMeeting,
  toggleMeetingLock,
  isMeetingLocked
}: VideoConferenceSidebarProps) => {
  const [linkCopied, setLinkCopied] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  React.useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleCopyLink = () => {
    copyMeetingLink();
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      setIsSending(true);
      await sendMessage();
      setIsSending(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'action-item':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'decision':
        return <Check className="w-4 h-4" />;
      case 'question':
        return <AlertCircle className="w-4 h-4" />;
      case 'topic':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'action-item':
        return 'border-red-500 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/30';
      case 'decision':
        return 'border-green-500 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/30';
      case 'question':
        return 'border-yellow-500 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/30';
      case 'topic':
        return 'border-blue-500 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/30';
      default:
        return 'border-purple-500 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/30';
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
      {connectionStatus === 'connected' && (
        <Card className="p-4 space-y-3 border-2 border-purple-300 dark:border-purple-600 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-950">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2 text-purple-900 dark:text-purple-100">
              <Share2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Share Meeting
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMeetingLock}
              title={isMeetingLocked ? "Unlock meeting" : "Lock meeting"}
              className="hover:bg-purple-200 dark:hover:bg-purple-900 transition-colors"
            >
              {isMeetingLocked ? (
                <Lock className="w-4 h-4 text-red-600 dark:text-red-400" />
              ) : (
                <Unlock className="w-4 h-4 text-green-600 dark:text-green-400" />
              )}
            </Button>
          </div>
          {isMeetingLocked && (
            <div className="px-3 py-2 bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700 rounded-lg text-xs text-red-800 dark:text-red-200 flex items-center gap-2">
              <Lock className="w-3 h-3" />
              Meeting is locked - No new participants can join
            </div>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="flex-1 gap-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 border-purple-400 dark:border-purple-600 transition-all hover:scale-105 text-purple-900 dark:text-purple-100"
            >
              {linkCopied ? (
                <>
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-green-700 dark:text-green-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Link
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareMeeting}
              className="flex-1 gap-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 border-indigo-400 dark:border-indigo-600 transition-all hover:scale-105 text-indigo-900 dark:text-indigo-100"
            >
              <UserPlus className="w-4 h-4" />
              Invite
            </Button>
          </div>
        </Card>
      )}

      {isParticipantsOpen && (
        <Card className="p-4 border-2 border-blue-300 dark:border-blue-600 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-cyan-950">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Participants
            </h3>
            <Badge variant="secondary" className="bg-blue-200 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border border-blue-400">
              {participants.filter(p => p.isPresent).length} Online
            </Badge>
          </div>
          <ScrollArea className="h-[250px] pr-4">
            <div className="space-y-2">
              {participants.filter(p => p.isPresent).map((participant) => (
                <div
                  key={participant.id}
                  className={`
                    flex items-center justify-between p-3 rounded-xl 
                    transition-all duration-200 border-2
                    ${pinnedParticipant === participant.id 
                      ? 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 border-blue-400 dark:border-blue-600 shadow-md' 
                      : 'bg-blue-100/50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 hover:border-cyan-400 dark:hover:border-cyan-600 hover:shadow-md'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-yellow-50 font-bold text-sm shadow-lg">
                        {participant.name[0].toUpperCase()}
                      </div>
                      {participant.isSpeaking && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-cyan-100 dark:border-cyan-900 animate-pulse" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                          {participant.name}
                        </p>
                        <div className="flex gap-1">
                          {participant.isMuted && (
                            <MicOff className="w-3 h-3 text-red-600 dark:text-red-400" />
                          )}
                          {participant.isVideoOff && (
                            <VideoOff className="w-3 h-3 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {participant.isModerator && (
                          <Badge variant="outline" className="text-xs bg-purple-200 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 border-purple-400">
                            Host
                          </Badge>
                        )}
                        <span className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(participant.joinedAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => pinParticipant(participant.id)}
                    className={`h-9 w-9 p-0 transition-all ${
                      pinnedParticipant === participant.id 
                        ? 'text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 bg-blue-200 dark:bg-blue-900/50' 
                        : 'hover:bg-cyan-200 dark:hover:bg-cyan-900/50 text-blue-600 dark:text-blue-400'
                    }`}
                    title={pinnedParticipant === participant.id ? 'Unpin participant' : 'Pin participant'}
                  >
                    <Pin className={`w-4 h-4 transition-transform ${pinnedParticipant === participant.id ? 'rotate-45' : ''}`} />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}

      {isChatOpen && (
        <Card className="p-4 border-2 border-purple-300 dark:border-purple-600 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-950">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-purple-900 dark:text-purple-100">
            <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Chat
            {chatMessages.length > 0 && (
              <Badge variant="secondary" className="bg-purple-200 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 border border-purple-400">
                {chatMessages.length}
              </Badge>
            )}
          </h3>
          <ScrollArea className="h-[250px] mb-3 pr-4" ref={chatContainerRef}>
            <div className="space-y-2">
              {chatMessages.length === 0 ? (
                <div className="text-center py-8 text-purple-600 dark:text-purple-300">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`p-3 rounded-xl transition-all hover:shadow-md border-2 ${
                      msg.isAI 
                        ? 'bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 border-purple-300 dark:border-purple-700' 
                        : 'bg-pink-100/70 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-yellow-50 text-xs font-bold">
                        {msg.userName[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-xs text-purple-900 dark:text-purple-100">
                        {msg.userName}
                      </span>
                      {msg.isAI && (
                        <Badge variant="outline" className="text-xs bg-purple-200 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 border-purple-400">
                          AI
                        </Badge>
                      )}
                      <span className="text-xs text-purple-700 dark:text-purple-300 ml-auto">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-purple-900 dark:text-purple-100 leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 border-2 border-purple-300 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 transition-colors bg-purple-100/50 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 placeholder:text-purple-500 dark:placeholder:text-purple-400"
              disabled={isSending}
            />
            <Button 
              onClick={handleSendMessage} 
              size="icon"
              className="bg-purple-500 hover:bg-purple-600 transition-all hover:scale-105 shadow-lg"
              disabled={!newMessage.trim() || isSending}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {showAIInsights && (
        <Card className="p-4 border-2 border-purple-400 dark:border-purple-600 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2 text-purple-900 dark:text-purple-100">
              <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              AI Insights
              {aiInsights.length > 0 && (
                <Badge variant="secondary" className="bg-purple-200 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 border border-purple-400">
                  {aiInsights.length}
                </Badge>
              )}
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={downloadSummary}
              className="hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-purple-700 dark:text-purple-300"
              title="Download AI summary"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <ScrollArea className="h-[280px] pr-4">
            <div className="space-y-3">
              {aiInsights.length === 0 ? (
                <div className="text-center py-8 text-purple-600 dark:text-purple-300">
                  <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">AI insights will appear here as the meeting progresses</p>
                </div>
              ) : (
                aiInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-xl border-l-4 shadow-md transition-all hover:shadow-lg hover:scale-[1.02] ${getInsightColor(insight.type)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getInsightIcon(insight.type)}
                        <Badge variant="outline" className="text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 border-indigo-400">
                          {insight.type.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      {insight.priority === 'high' && (
                        <Badge variant="destructive" className="text-xs flex items-center gap-1 bg-red-500 hover:bg-red-600">
                          <AlertCircle className="w-3 h-3" />
                          High Priority
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-indigo-900 dark:text-indigo-100 leading-relaxed mb-2">
                      {insight.content}
                    </p>
                    <p className="text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(insight.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>
      )}

      {showTranscription && (
        <Card className="p-4 border-2 border-blue-400 dark:border-blue-600 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950 dark:to-cyan-950">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Live Transcription
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={downloadTranscript}
              className="hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-blue-700 dark:text-blue-300"
              title="Download transcript"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <ScrollArea className="h-[250px] pr-4">
            <div className="space-y-2">
              {transcription.length === 0 ? (
                <div className="text-center py-8 text-blue-600 dark:text-blue-300">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Transcription will appear here as people speak</p>
                </div>
              ) : (
                transcription.map((line, idx) => (
                  <p 
                    key={idx} 
                    className="text-sm text-blue-900 dark:text-blue-100 p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 leading-relaxed border border-cyan-300 dark:border-cyan-700"
                  >
                    {line}
                  </p>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>
      )}

      {showMeetingNotes && (
        <Card className="p-4 border-2 border-green-400 dark:border-green-600 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950 dark:to-emerald-950">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2 text-green-900 dark:text-green-100">
              <PenTool className="w-5 h-5 text-green-600 dark:text-green-400" />
              Meeting Notes
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                const blob = new Blob([meetingNotes], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `meeting-notes-${new Date().toISOString().split('T')[0]}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-green-700 dark:text-green-300"
              title="Download notes"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <textarea
            value={meetingNotes}
            onChange={(e) => setMeetingNotes(e.target.value)}
            placeholder="Take notes during the meeting..."
            className="w-full h-[250px] p-3 border-2 border-green-300 dark:border-green-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-all bg-emerald-100/70 dark:bg-emerald-900/30 text-green-900 dark:text-green-100 placeholder:text-green-600 dark:placeholder:text-green-400"
          />
          <p className="text-xs text-green-700 dark:text-green-300 mt-2">
            {meetingNotes.length} characters
          </p>
        </Card>
      )}

      {connectionStatus === 'connected' && 
       !isParticipantsOpen && 
       !isChatOpen && 
       !showAIInsights && 
       !showMeetingNotes && 
       !showTranscription && (
        <Card className="p-12 text-center border-2 border-dashed border-indigo-400 dark:border-indigo-600 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950">
          <Lightbulb className="w-16 h-16 mx-auto mb-4 text-yellow-500 animate-pulse" />
          <h4 className="font-semibold text-lg mb-2 text-indigo-900 dark:text-indigo-100">
            Get Started
          </h4>
          <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
            Open panels from the control bar to view participants, chat with others, 
            see AI-powered insights, or take meeting notes
          </p>
        </Card>
      )}
    </div>
  );
};