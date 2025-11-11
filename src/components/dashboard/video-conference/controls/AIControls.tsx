import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles,
  FileText,
  Languages,
  Mic2,
  Target,
  Brain,
  ListChecks,
  MessageCircle,
  Zap,
  X
} from "lucide-react";
import { AutoSummary } from "../ai-features";
import { FreeTranscription } from "../ai-features/FreeTranscription";

interface AIControlsProps {
  aiFeatures: {
    liveTranscription: boolean;
    autoSummary: boolean;
    smartFraming: boolean;
    translation: boolean;
    actionItems: boolean;
    speakerRecognition: boolean;
    sentimentAnalysis: boolean;
    autoHighlights: boolean;
    aiNotes: boolean;
    qaSuggestions: boolean;
  };
  toggleAiFeature?: (feature: string) => void;
  meetingId?: string;
  participants?: Array<{ id: string; name: string }>;
  showAutoSummary: boolean;
  setShowAutoSummary: (show: boolean) => void;
  // Add new props for free transcription
  localStreamRef?: React.RefObject<MediaStream>;
  currentUserId?: string;
  currentUserName?: string;
}

export const AIControls: React.FC<AIControlsProps> = ({
  aiFeatures = {
    liveTranscription: false,
    autoSummary: false,
    smartFraming: false,
    translation: false,
    actionItems: false,
    speakerRecognition: false,
    sentimentAnalysis: false,
    autoHighlights: false,
    aiNotes: false,
    qaSuggestions: false
  },
  toggleAiFeature = () => {},
  meetingId = "default-meeting-id",
  participants = [],
  showAutoSummary,
  setShowAutoSummary,
  localStreamRef,
  currentUserId,
  currentUserName
}) => {
  const aiMenuRef = useRef<HTMLDivElement>(null);
  const [showAiMenu, setShowAiMenu] = React.useState(false);
  const [showFreeTranscription, setShowFreeTranscription] = React.useState(false); // Add state for free transcription

  const handleAutoSummaryClick = () => {
    // Only open the AutoSummary panel when user clicks on it
    setShowAutoSummary(true);
    setShowAiMenu(false);
  };

  // Handle free transcription click
  const handleFreeTranscriptionClick = () => {
    setShowFreeTranscription(true);
    setShowAiMenu(false);
  };

  const activeAiFeaturesCount = Object.values(aiFeatures).filter(Boolean).length;

  interface AiFeatureItem {
    key: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    description: string;
    active: boolean;
    onClick?: () => void;
  }

  const aiFeaturesList: AiFeatureItem[] = [
    {
      key: 'liveTranscription',
      icon: FileText,
      label: 'Live Transcription',
      description: 'Real-time speech-to-text captions',
      active: aiFeatures.liveTranscription,
      onClick: handleFreeTranscriptionClick // Use free transcription for live transcription
    },
    {
      key: 'autoSummary',
      icon: Brain,
      label: 'Meeting Summary',
      description: 'AI-generated meeting summaries',
      active: aiFeatures.autoSummary,
      onClick: handleAutoSummaryClick
    },
    {
      key: 'actionItems',
      icon: ListChecks,
      label: 'Action Items',
      description: 'Extract tasks automatically',
      active: aiFeatures.actionItems
    },
    {
      key: 'translation',
      icon: Languages,
      label: 'Real-time Translation',
      description: 'Translate conversations live',
      active: aiFeatures.translation
    },
    {
      key: 'smartFraming',
      icon: Target,
      label: 'Smart Framing',
      description: 'AI-powered auto-framing',
      active: aiFeatures.smartFraming
    },
    {
      key: 'speakerRecognition',
      icon: Mic2,
      label: 'Speaker Recognition',
      description: 'Identify who is speaking',
      active: aiFeatures.speakerRecognition
    },
    {
      key: 'sentimentAnalysis',
      icon: MessageCircle,
      label: 'Sentiment Analysis',
      description: 'Analyze meeting mood and engagement',
      active: aiFeatures.sentimentAnalysis
    },
    {
      key: 'autoHighlights',
      icon: Zap,
      label: 'Auto Highlights',
      description: 'Capture important moments',
      active: aiFeatures.autoHighlights
    },
    {
      key: 'aiNotes',
      icon: FileText,
      label: 'AI Meeting Notes',
      description: 'Smart note-taking assistant',
      active: aiFeatures.aiNotes
    },
    {
      key: 'qaSuggestions',
      icon: FileText,
      label: 'Q&A Suggestions',
      description: 'AI-powered question suggestions',
      active: aiFeatures.qaSuggestions
    }
  ];

  return (
    <div className="relative" ref={aiMenuRef}>
      <Button
        variant={activeAiFeaturesCount > 0 ? "default" : "outline"}
        size="icon"
        onClick={() => setShowAiMenu(!showAiMenu)}
        title="AI Features"
        className={`h-12 w-12 rounded-xl transition-all ${
          activeAiFeaturesCount > 0
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-purple-500 shadow-lg'
            : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-300'
        }`}
      >
        <Sparkles className="w-5 h-5" />
      </Button>
      {activeAiFeaturesCount > 0 && (
        <Badge className="absolute -top-2 -right-2 bg-purple-600 text-white border-slate-800 text-xs px-1.5 min-w-[1.25rem] h-5 flex items-center justify-center">
          {activeAiFeaturesCount}
        </Badge>
      )}

      {/* AI Features Menu */}
      {showAiMenu && (
        <div className="fixed sm:absolute bottom-20 left-1/2 sm:bottom-full sm:left-0 transform -translate-x-1/2 sm:translate-x-0 sm:mb-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-md">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold text-base text-slate-100">AI Features</h3>
            </div>
            <button 
              onClick={() => setShowAiMenu(false)}
              className="text-slate-400 hover:text-slate-200 sm:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="max-h-80 overflow-y-auto p-2 custom-scrollbar">
            {aiFeaturesList.map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.key}
                  onClick={() => {
                    if (feature.onClick) {
                      feature.onClick();
                    } else if (toggleAiFeature) {
                      toggleAiFeature(feature.key);
                    }
                  }}
                  className={`w-full flex items-start gap-3 px-3 py-3 hover:bg-slate-700 rounded-lg transition-all mb-1 ${
                    feature.active ? 'bg-slate-700/50' : ''
                  }`}
                >
                  <div className={`mt-0.5 ${feature.active ? 'text-purple-400' : 'text-slate-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-medium ${feature.active ? 'text-purple-400' : 'text-slate-200'}`}>
                        {feature.label}
                      </span>
                      <div className={`w-10 h-5 rounded-full transition-colors flex-shrink-0 relative ${
                        feature.active ? 'bg-purple-600' : 'bg-slate-600'
                      }`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                          feature.active ? 'left-5' : 'left-0.5'
                        }`}></div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{feature.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Free Transcription Panel */}
      {showFreeTranscription && localStreamRef && currentUserId && currentUserName && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowFreeTranscription(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl animate-in w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100">Free Live Transcription</h3>
              <button 
                onClick={() => setShowFreeTranscription(false)} 
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <FreeTranscription 
                localStreamRef={localStreamRef}
                meetingId={meetingId}
                currentUserId={currentUserId}
                currentUserName={currentUserName}
                className="border-0 bg-transparent p-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* Auto Summary Panel */}
      {showAutoSummary && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowAutoSummary(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl animate-in w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100">AI Meeting Summary</h3>
              <button 
                onClick={() => setShowAutoSummary(false)} 
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <AutoSummary 
                meetingId={meetingId}
                participants={participants}
                className="border-0 bg-transparent p-0"
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-in {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};