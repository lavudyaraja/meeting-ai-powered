import React, { useEffect, useRef, useState } from "react";
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
  Lock,
  Unlock,
  Pin,
  Send,
  MicOff,
  VideoOff,
  Check,
  Clock,
  Sparkles
} from "lucide-react";
import ParticipantBio from "./ParticipantBio";

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

interface VideoConferenceSidebarProps {
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  isParticipantsOpen: boolean;
  isChatOpen: boolean;
  participants: Participant[];
  chatMessages: ChatMessage[];
  chatContainerRef: React.RefObject<HTMLDivElement>;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
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
  participants,
  chatMessages,
  chatContainerRef,
  newMessage,
  setNewMessage,
  sendMessage,
  handleKeyPress,
  pinParticipant,
  pinnedParticipant,
  meetingLink,
  copyMeetingLink,
  shareMeeting,
  toggleMeetingLock,
  isMeetingLocked
}: VideoConferenceSidebarProps) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleCopyLink = () => {
    copyMeetingLink();
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage();
    }
  };

  return (
    <div className="space-y-4">
      {/* Share Meeting Card */}
      {connectionStatus === 'connected' && (
        <Card className="p-5 border-2 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Share Meeting
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMeetingLock}
              title={isMeetingLocked ? "Unlock meeting" : "Lock meeting"}
              className="hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors h-8 w-8 p-0"
            >
              {isMeetingLocked ? (
                <Lock className="w-4 h-4 text-red-600 dark:text-red-400" />
              ) : (
                <Unlock className="w-4 h-4 text-green-600 dark:text-green-400" />
              )}
            </Button>
          </div>
          
          {isMeetingLocked && (
            <div className="mb-3 px-3 py-2 bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700 rounded-lg text-xs text-red-800 dark:text-red-200 flex items-center gap-2">
              <Lock className="w-3 h-3" />
              Meeting is locked
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="flex-1 gap-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 border-2 border-blue-300 dark:border-blue-700 transition-all hover:scale-105 text-blue-900 dark:text-blue-100 font-semibold"
            >
              {linkCopied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  Copied!
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
              className="flex-1 gap-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 border-2 border-indigo-300 dark:border-indigo-700 transition-all hover:scale-105 text-indigo-900 dark:text-indigo-100 font-semibold"
            >
              <UserPlus className="w-4 h-4" />
              Invite
            </Button>
          </div>
        </Card>
      )}

      {/* Participants List */}
      {isParticipantsOpen && (
        <Card className="p-5 border-2 border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2 text-purple-900 dark:text-purple-100">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Participants
            </h3>
            <Badge className="bg-purple-200 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 border-2 border-purple-400 font-semibold">
              {participants.filter(p => p.isPresent).length} Online
            </Badge>
          </div>
          
          <ScrollArea className="h-[320px] pr-3">
            <div className="space-y-3">
              {participants.filter(p => p.isPresent).length === 0 ? (
                <div className="text-center py-8 text-purple-600 dark:text-purple-300">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No participants yet</p>
                </div>
              ) : (
                participants.filter(p => p.isPresent).map((participant) => (
                  <div
                    key={participant.id}
                    className={`
                      flex items-center justify-between p-3 rounded-xl 
                      transition-all duration-200 border-2
                      ${pinnedParticipant === participant.id 
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 border-purple-400 dark:border-purple-600 shadow-md scale-105' 
                        : 'bg-purple-50/70 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800 hover:border-pink-400 dark:hover:border-pink-600 hover:shadow-md hover:scale-102'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {participant.name[0].toUpperCase()}
                        </div>
                        {participant.isSpeaking && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-purple-900 animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <ParticipantBio participantId={participant.id} fallbackName={participant.name} />
                          {participant.isModerator && (
                            <Badge variant="outline" className="text-xs bg-purple-200 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 border-purple-400 flex-shrink-0">
                              Host
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-purple-700 dark:text-purple-300 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(participant.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {participant.isMuted && (
                            <MicOff className="w-3 h-3 text-red-600 dark:text-red-400" />
                          )}
                          {participant.isVideoOff && (
                            <VideoOff className="w-3 h-3 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => pinParticipant(participant.id)}
                      className={`h-9 w-9 p-0 transition-all flex-shrink-0 ${
                        pinnedParticipant === participant.id 
                          ? 'text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200 bg-purple-200 dark:bg-purple-900/50' 
                          : 'hover:bg-pink-200 dark:hover:bg-pink-900/50 text-purple-600 dark:text-purple-400'
                      }`}
                      title={pinnedParticipant === participant.id ? 'Unpin' : 'Pin participant'}
                    >
                      <Pin className={`w-4 h-4 transition-transform ${pinnedParticipant === participant.id ? 'rotate-45' : ''}`} />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>
      )}

      {/* Chat */}
      {isChatOpen && (
        <Card className="p-5 border-2 border-indigo-200 dark:border-indigo-800 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
              <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Chat
            </h3>
            {chatMessages.length > 0 && (
              <Badge className="bg-indigo-200 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 border-2 border-indigo-400 font-semibold">
                {chatMessages.length}
              </Badge>
            )}
          </div>
          
          <ScrollArea className="h-[320px] mb-4 pr-3" ref={chatContainerRef}>
            <div className="space-y-3">
              {chatMessages.length === 0 ? (
                <div className="text-center py-12 text-indigo-600 dark:text-indigo-300">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-medium">No messages yet</p>
                  <p className="text-xs mt-1 opacity-70">Start the conversation!</p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`p-3 rounded-xl transition-all hover:shadow-md border-2 ${
                      msg.isAI 
                        ? 'bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 border-indigo-300 dark:border-indigo-700' 
                        : 'bg-blue-50/70 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {msg.userName[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-xs text-indigo-900 dark:text-indigo-100">
                        {msg.userName}
                      </span>
                      {msg.isAI && (
                        <Badge variant="outline" className="text-xs bg-indigo-200 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 border-indigo-400">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI
                        </Badge>
                      )}
                      <span className="text-xs text-indigo-700 dark:text-indigo-300 ml-auto">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-indigo-900 dark:text-indigo-100 leading-relaxed break-words">
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
              className="flex-1 border-2 border-indigo-300 dark:border-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors bg-indigo-50/50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100 placeholder:text-indigo-500 dark:placeholder:text-indigo-400"
            />
            <Button 
              onClick={handleSendMessage} 
              size="icon"
              className="bg-indigo-500 hover:bg-indigo-600 transition-all hover:scale-105 shadow-lg h-10 w-10"
              disabled={!newMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {connectionStatus === 'connected' && 
       !isParticipantsOpen && 
       !isChatOpen && (
        <Card className="p-12 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-indigo-400 animate-pulse" />
          <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-slate-100">
            Open Panels
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            Use the controls below to view participants or open the chat
          </p>
        </Card>
      )}
    </div>
  );
};