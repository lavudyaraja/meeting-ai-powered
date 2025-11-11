import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Hash,
  Clock,
  TrendingUp,
  BarChart3,
  Calendar,
  Tag,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Topic {
  id: string;
  name: string;
  frequency: number;
  duration: number; // in seconds
  sentiment: 'positive' | 'negative' | 'neutral';
  participants: string[];
  keyMoments: KeyMoment[];
  timeline: TopicTimelinePoint[];
}

interface KeyMoment {
  id: string;
  time: number; // in seconds
  speaker: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

interface TopicTimelinePoint {
  time: number; // in seconds
  intensity: number; // 0-100
}

interface TopicClusteringProps {
  meetingId: string;
  participants: Array<{ id: string; name: string }>;
  duration: number; // in seconds
  className?: string;
}

export const TopicClustering: React.FC<TopicClusteringProps> = ({
  meetingId,
  participants,
  duration,
  className = ''
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'frequency' | 'duration' | 'sentiment'>('frequency');

  // Mock data for demonstration
  const topics: Topic[] = [
    {
      id: '1',
      name: 'Project Timeline',
      frequency: 12,
      duration: 300, // 5 minutes
      sentiment: 'positive',
      participants: ['Alex Johnson', 'Sarah Chen'],
      keyMoments: [
        {
          id: '1-1',
          time: 45,
          speaker: 'Alex Johnson',
          content: 'We need to finalize the Q3 deliverables by next Friday.',
          sentiment: 'positive'
        },
        {
          id: '1-2',
          time: 180,
          speaker: 'Sarah Chen',
          content: 'The technical team can accommodate that timeline with additional resources.',
          sentiment: 'positive'
        }
      ],
      timeline: [
        { time: 0, intensity: 20 },
        { time: 60, intensity: 80 },
        { time: 120, intensity: 90 },
        { time: 180, intensity: 70 },
        { time: 240, intensity: 30 },
        { time: 300, intensity: 10 }
      ]
    },
    {
      id: '2',
      name: 'Budget Allocation',
      frequency: 8,
      duration: 240, // 4 minutes
      sentiment: 'neutral',
      participants: ['Michael Rodriguez', 'Emma Wilson'],
      keyMoments: [
        {
          id: '2-1',
          time: 360,
          speaker: 'Michael Rodriguez',
          content: 'The marketing budget needs to be increased by 15% for the new campaign.',
          sentiment: 'neutral'
        },
        {
          id: '2-2',
          time: 420,
          speaker: 'Emma Wilson',
          content: 'We need to ensure compliance with financial regulations.',
          sentiment: 'neutral'
        }
      ],
      timeline: [
        { time: 300, intensity: 30 },
        { time: 360, intensity: 70 },
        { time: 420, intensity: 85 },
        { time: 480, intensity: 60 },
        { time: 540, intensity: 20 }
      ]
    },
    {
      id: '3',
      name: 'Technical Requirements',
      frequency: 15,
      duration: 420, // 7 minutes
      sentiment: 'positive',
      participants: ['Sarah Chen', 'Alex Johnson', 'Emma Wilson'],
      keyMoments: [
        {
          id: '3-1',
          time: 600,
          speaker: 'Sarah Chen',
          content: 'We\'ll need additional resources to meet the timeline constraints.',
          sentiment: 'neutral'
        },
        {
          id: '3-2',
          time: 720,
          speaker: 'Alex Johnson',
          content: 'The client has approved the additional resource allocation.',
          sentiment: 'positive'
        }
      ],
      timeline: [
        { time: 540, intensity: 40 },
        { time: 600, intensity: 80 },
        { time: 660, intensity: 95 },
        { time: 720, intensity: 85 },
        { time: 780, intensity: 60 },
        { time: 840, intensity: 25 },
        { time: 900, intensity: 10 }
      ]
    },
    {
      id: '4',
      name: 'Risk Assessment',
      frequency: 6,
      duration: 180, // 3 minutes
      sentiment: 'negative',
      participants: ['Emma Wilson', 'Michael Rodriguez'],
      keyMoments: [
        {
          id: '4-1',
          time: 960,
          speaker: 'Emma Wilson',
          content: 'There are potential compliance risks with the proposed approach.',
          sentiment: 'negative'
        },
        {
          id: '4-2',
          time: 1020,
          speaker: 'Michael Rodriguez',
          content: 'We should consider alternative solutions to mitigate these risks.',
          sentiment: 'neutral'
        }
      ],
      timeline: [
        { time: 900, intensity: 20 },
        { time: 960, intensity: 70 },
        { time: 1020, intensity: 85 },
        { time: 1080, intensity: 40 }
      ]
    }
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      case 'neutral': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredTopics = topics.filter(topic => 
    topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedTopics = [...filteredTopics].sort((a, b) => {
    if (sortBy === 'frequency') return b.frequency - a.frequency;
    if (sortBy === 'duration') return b.duration - a.duration;
    // For sentiment, positive > neutral > negative
    const sentimentOrder = { positive: 3, neutral: 2, negative: 1 };
    return (sentimentOrder[b.sentiment] || 0) - (sentimentOrder[a.sentiment] || 0);
  });

  return (
    <Card className={`bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Hash className="w-5 h-5 text-cyan-400" />
            Meeting Topic Clustering
          </CardTitle>
          <Badge variant="outline" className="bg-cyan-900/50 text-cyan-300 border-cyan-700">
            AI-Powered
          </Badge>
        </div>
        <p className="text-sm text-slate-400">
          Automatically identify main topics and create a timeline of topic changes
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search topics or participants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-slate-200"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className={`gap-2 ${sortBy === 'frequency' ? 'bg-blue-500/20 border-blue-500' : ''}`}
              onClick={() => setSortBy('frequency')}
            >
              <BarChart3 className="w-4 h-4" />
              Frequency
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={`gap-2 ${sortBy === 'duration' ? 'bg-blue-500/20 border-blue-500' : ''}`}
              onClick={() => setSortBy('duration')}
            >
              <Clock className="w-4 h-4" />
              Duration
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={`gap-2 ${sortBy === 'sentiment' ? 'bg-blue-500/20 border-blue-500' : ''}`}
              onClick={() => setSortBy('sentiment')}
            >
              <TrendingUp className="w-4 h-4" />
              Sentiment
            </Button>
          </div>
        </div>

        {/* Topics Overview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-200">Identified Topics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedTopics.map((topic) => (
              <div 
                key={topic.id}
                className={`bg-slate-800/50 rounded-lg p-4 border transition-all cursor-pointer ${
                  selectedTopic === topic.id 
                    ? 'border-cyan-500 bg-cyan-900/10' 
                    : 'border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-slate-100 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-cyan-400" />
                      {topic.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs border-slate-600 ${getSentimentColor(topic.sentiment).replace('bg-', 'text-')}`}
                      >
                        {topic.sentiment}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        {topic.frequency} mentions
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatTime(topic.duration)}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`w-3 h-3 rounded-full ${getSentimentColor(topic.sentiment)}`}></div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {topic.participants.slice(0, 3).map((participant, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-slate-700/50 border-slate-600">
                      {participant}
                    </Badge>
                  ))}
                  {topic.participants.length > 3 && (
                    <Badge variant="outline" className="text-xs bg-slate-700/50 border-slate-600">
                      +{topic.participants.length - 3} more
                    </Badge>
                  )}
                </div>
                
                {/* Timeline Visualization */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>00:00</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full flex">
                      {topic.timeline.map((point, idx) => (
                        <div
                          key={idx}
                          className={`${getSentimentColor(topic.sentiment)} opacity-${Math.min(100, Math.max(20, point.intensity))}`}
                          style={{ 
                            width: `${100 / topic.timeline.length}%`,
                            opacity: point.intensity / 100
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Expanded Details */}
                {selectedTopic === topic.id && (
                  <div className="mt-4 pt-4 border-t border-slate-700 space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-slate-300 mb-2">Key Moments</h5>
                      <div className="space-y-3">
                        {topic.keyMoments.map((moment) => (
                          <div key={moment.id} className="bg-slate-700/30 rounded p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-slate-400">{formatTime(moment.time)}</span>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-slate-300">{moment.speaker}</span>
                                <div className={`w-2 h-2 rounded-full ${getSentimentColor(moment.sentiment)}`}></div>
                              </div>
                            </div>
                            <p className="text-sm text-slate-200">{moment.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" className="gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Export Topic Analysis
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Topic Insights */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h3 className="font-medium text-slate-300 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Topic Insights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">Longest Discussion</span>
              </div>
              <p className="text-xs text-slate-300">
                "Technical Requirements" dominated 7 minutes of discussion
              </p>
            </div>
            
            <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-300">Most Positive</span>
              </div>
              <p className="text-xs text-slate-300">
                "Project Timeline" had the most positive sentiment
              </p>
            </div>
            
            <div className="bg-purple-900/20 border border-purple-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">Most Mentioned</span>
              </div>
              <p className="text-xs text-slate-300">
                "Technical Requirements" was mentioned 15 times
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};