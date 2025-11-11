import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play,
  Pause,
  Square,
  Download,
  Share2,
  Bookmark,
  Clock,
  Hash,
  Mic,
  Video,
  BarChart3,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  Users,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface Chapter {
  id: string;
  title: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  duration: number; // in seconds
  keyMoments: KeyMoment[];
  participants: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
}

interface KeyMoment {
  id: string;
  time: number; // in seconds
  speaker: string;
  content: string;
  type: 'decision' | 'action-item' | 'question' | 'highlight';
  importance: number; // 1-5
}

interface VisualSummary {
  id: string;
  time: number; // in seconds
  type: 'sentiment' | 'topic' | 'speaker' | 'activity';
  data: any;
  description: string;
}

interface IntelligentRecordingProps {
  meetingId: string;
  participants: Array<{ id: string; name: string }>;
  duration: number; // in seconds
  className?: string;
}

export const IntelligentRecording: React.FC<IntelligentRecordingProps> = ({
  meetingId,
  participants,
  duration,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [highlightedMoment, setHighlightedMoment] = useState<string | null>(null);

  // Mock data for demonstration
  const chapters: Chapter[] = [
    {
      id: '1',
      title: 'Project Kickoff & Timeline Discussion',
      startTime: 0,
      endTime: 300, // 5 minutes
      duration: 300,
      sentiment: 'positive',
      participants: ['Alex Johnson', 'Sarah Chen'],
      keyMoments: [
        {
          id: '1-1',
          time: 45,
          speaker: 'Alex Johnson',
          content: 'We need to finalize the Q3 deliverables by next Friday.',
          type: 'decision',
          importance: 5
        },
        {
          id: '1-2',
          time: 120,
          speaker: 'Sarah Chen',
          content: 'The technical team can accommodate that timeline with additional resources.',
          type: 'action-item',
          importance: 4
        }
      ]
    },
    {
      id: '2',
      title: 'Budget Allocation & Resource Planning',
      startTime: 300,
      endTime: 600, // 10 minutes
      duration: 300,
      sentiment: 'neutral',
      participants: ['Michael Rodriguez', 'Emma Wilson', 'Alex Johnson'],
      keyMoments: [
        {
          id: '2-1',
          time: 360,
          speaker: 'Michael Rodriguez',
          content: 'The marketing budget needs to be increased by 15% for the new campaign.',
          type: 'highlight',
          importance: 3
        },
        {
          id: '2-2',
          time: 480,
          speaker: 'Emma Wilson',
          content: 'We need to ensure compliance with financial regulations.',
          type: 'question',
          importance: 4
        }
      ]
    },
    {
      id: '3',
      title: 'Technical Requirements Deep Dive',
      startTime: 600,
      endTime: 1020, // 17 minutes
      duration: 420,
      sentiment: 'positive',
      participants: ['Sarah Chen', 'Alex Johnson', 'Emma Wilson'],
      keyMoments: [
        {
          id: '3-1',
          time: 720,
          speaker: 'Sarah Chen',
          content: 'We\'ll need additional resources to meet the timeline constraints.',
          type: 'action-item',
          importance: 5
        },
        {
          id: '3-2',
          time: 840,
          speaker: 'Alex Johnson',
          content: 'The client has approved the additional resource allocation.',
          type: 'decision',
          importance: 5
        }
      ]
    },
    {
      id: '4',
      title: 'Risk Assessment & Mitigation',
      startTime: 1020,
      endTime: 1200, // 20 minutes
      duration: 180,
      sentiment: 'negative',
      participants: ['Emma Wilson', 'Michael Rodriguez'],
      keyMoments: [
        {
          id: '4-1',
          time: 1080,
          speaker: 'Emma Wilson',
          content: 'There are potential compliance risks with the proposed approach.',
          type: 'highlight',
          importance: 4
        },
        {
          id: '4-2',
          time: 1140,
          speaker: 'Michael Rodriguez',
          content: 'We should consider alternative solutions to mitigate these risks.',
          type: 'question',
          importance: 3
        }
      ]
    }
  ];

  const visualSummaries: VisualSummary[] = [
    {
      id: 'vs1',
      time: 120,
      type: 'sentiment',
      data: { positive: 70, neutral: 20, negative: 10 },
      description: 'Positive sentiment spike during timeline discussion'
    },
    {
      id: 'vs2',
      time: 480,
      type: 'topic',
      data: { topic: 'Budget Allocation' },
      description: 'Topic shift to financial planning'
    },
    {
      id: 'vs3',
      time: 840,
      type: 'speaker',
      data: { speaker: 'Alex Johnson', activity: 'high' },
      description: 'Alex Johnson becomes most active participant'
    },
    {
      id: 'vs4',
      time: 1080,
      type: 'activity',
      data: { level: 'high' },
      description: 'Meeting activity peaks during risk assessment'
    }
  ];

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      case 'neutral': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getMomentTypeIcon = (type: string) => {
    switch (type) {
      case 'decision': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'action-item': return <Bookmark className="w-4 h-4 text-blue-400" />;
      case 'question': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'highlight': return <Hash className="w-4 h-4 text-purple-400" />;
      default: return <Hash className="w-4 h-4 text-gray-400" />;
    }
  };

  const jumpToTime = (time: number) => {
    setCurrentTime(time);
    // In a real implementation, this would seek the video/audio player
  };

  return (
    <Card className={`bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Video className="w-5 h-5 text-pink-400" />
            Intelligent Meeting Recording
          </CardTitle>
          <Badge variant="outline" className="bg-pink-900/50 text-pink-300 border-pink-700">
            AI-Powered
          </Badge>
        </div>
        <p className="text-sm text-slate-400">
          Automatically highlight important moments and create chapters for different topics
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Player Controls */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Button 
                size="icon" 
                className="rounded-full bg-pink-600 hover:bg-pink-700"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-1" />
                )}
              </Button>
              
              <div className="text-sm text-slate-300">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
          
          <div className="mb-2">
            <Progress 
              value={(currentTime / duration) * 100} 
              className="h-2 cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                setCurrentTime(Math.floor(percent * duration));
              }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-slate-400">
            <span>00:00</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search in recording, chapters, or key moments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-slate-200"
            />
          </div>
          
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {/* Chapters and Key Moments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chapters List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-slate-200">Chapters</h3>
            
            <div className="space-y-3">
              {chapters.map((chapter) => (
                <div 
                  key={chapter.id}
                  className={`bg-slate-800/50 rounded-lg border transition-all ${
                    selectedChapter === chapter.id 
                      ? 'border-pink-500 bg-pink-900/10' 
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => {
                      setSelectedChapter(selectedChapter === chapter.id ? null : chapter.id);
                      jumpToTime(chapter.startTime);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Bookmark className="w-4 h-4 text-pink-400" />
                          <h4 className="font-medium text-slate-100">{chapter.title}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getSentimentColor(chapter.sentiment)}`}
                          >
                            {chapter.sentiment}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(chapter.duration)}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{chapter.participants.length} participants</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-slate-300">
                          {formatTime(chapter.startTime)} - {formatTime(chapter.endTime)}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-1 h-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            jumpToTime(chapter.startTime);
                          }}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Chapter Details */}
                  {selectedChapter === chapter.id && (
                    <div className="px-4 pb-4 border-t border-slate-700 pt-4">
                      <h5 className="text-sm font-medium text-slate-300 mb-3">Key Moments</h5>
                      
                      <div className="space-y-3">
                        {chapter.keyMoments.map((moment) => (
                          <div 
                            key={moment.id}
                            className={`p-3 rounded border ${
                              highlightedMoment === moment.id
                                ? 'border-blue-500 bg-blue-900/20'
                                : 'border-slate-700 bg-slate-700/30'
                            }`}
                            onClick={() => {
                              setHighlightedMoment(moment.id);
                              jumpToTime(moment.time);
                            }}
                          >
                            <div className="flex items-start gap-3">
                              {getMomentTypeIcon(moment.type)}
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-slate-400">
                                    {formatTime(moment.time)}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-slate-300">{moment.speaker}</span>
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <div 
                                          key={i} 
                                          className={`w-2 h-2 rounded-full ${
                                            i < moment.importance ? 'bg-yellow-400' : 'bg-slate-600'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <p className="text-sm text-slate-200">{moment.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Visual Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-200">Visual Summary</h3>
            
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="space-y-4">
                {visualSummaries.map((summary) => (
                  <div 
                    key={summary.id}
                    className="p-3 rounded border border-slate-700 bg-slate-700/30 cursor-pointer hover:bg-slate-700/50 transition-colors"
                    onClick={() => jumpToTime(summary.time)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {summary.type === 'sentiment' && (
                          <BarChart3 className="w-4 h-4 text-green-400" />
                        )}
                        {summary.type === 'topic' && (
                          <Hash className="w-4 h-4 text-purple-400" />
                        )}
                        {summary.type === 'speaker' && (
                          <Users className="w-4 h-4 text-blue-400" />
                        )}
                        {summary.type === 'activity' && (
                          <Activity className="w-4 h-4 text-orange-400" />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-slate-400">
                            {formatTime(summary.time)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-200">{summary.description}</p>
                        
                        {summary.type === 'sentiment' && (
                          <div className="mt-2 flex gap-1">
                            <div className="flex-1 h-1.5 bg-green-500 rounded-full" style={{ width: '70%' }}></div>
                            <div className="flex-1 h-1.5 bg-yellow-500 rounded-full" style={{ width: '20%' }}></div>
                            <div className="flex-1 h-1.5 bg-red-500 rounded-full" style={{ width: '10%' }}></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recording Stats */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <h4 className="font-medium text-slate-300 mb-3">Recording Statistics</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Total Duration</span>
                  <span className="text-sm text-slate-200">{formatTime(duration)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Chapters</span>
                  <span className="text-sm text-slate-200">{chapters.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Key Moments</span>
                  <span className="text-sm text-slate-200">
                    {chapters.reduce((acc, chapter) => acc + chapter.keyMoments.length, 0)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Participants</span>
                  <span className="text-sm text-slate-200">{participants.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};