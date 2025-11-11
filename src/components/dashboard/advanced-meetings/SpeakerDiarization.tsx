import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
// Refresh import to recognize updated Progress component
import { 
  Mic, 
  User, 
  Users, 
  BarChart3, 
  Clock, 
  Calendar,
  Activity,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Speaker {
  id: string;
  name: string;
  avatar?: string;
  talkTime: number; // in seconds
  talkPercentage: number;
  interruptions: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
}

interface SpeakerSegment {
  id: string;
  speakerId: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  text: string;
  confidence: number;
}

interface SpeakerDiarizationProps {
  meetingId: string;
  participants: Array<{ id: string; name: string; avatar?: string }>;
  duration: number; // in seconds
  className?: string;
}

export const SpeakerDiarization: React.FC<SpeakerDiarizationProps> = ({
  meetingId,
  participants,
  duration,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transcript'>('overview');
  const [selectedSpeaker, setSelectedSpeaker] = useState<string | null>(null);

  // Mock data for demonstration
  const speakers: Speaker[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      talkTime: 420, // 7 minutes
      talkPercentage: 35,
      interruptions: 3,
      sentiment: 'positive',
      topics: ['Project Timeline', 'Budget Allocation']
    },
    {
      id: '2',
      name: 'Sarah Chen',
      talkTime: 360, // 6 minutes
      talkPercentage: 30,
      interruptions: 1,
      sentiment: 'neutral',
      topics: ['Technical Requirements', 'Resource Planning']
    },
    {
      id: '3',
      name: 'Michael Rodriguez',
      talkTime: 240, // 4 minutes
      talkPercentage: 20,
      interruptions: 2,
      sentiment: 'positive',
      topics: ['Marketing Strategy', 'Client Feedback']
    },
    {
      id: '4',
      name: 'Emma Wilson',
      talkTime: 180, // 3 minutes
      talkPercentage: 15,
      interruptions: 0,
      sentiment: 'negative',
      topics: ['Risk Assessment', 'Compliance']
    }
  ];

  const transcriptSegments: SpeakerSegment[] = [
    {
      id: '1',
      speakerId: '1',
      startTime: 0,
      endTime: 120,
      text: 'Good morning everyone. Let\'s start with the project timeline. We need to finalize the Q3 deliverables by next Friday.',
      confidence: 0.95
    },
    {
      id: '2',
      speakerId: '2',
      startTime: 125,
      endTime: 240,
      text: 'From a technical perspective, we\'ll need additional resources to meet that timeline. The current team is already at capacity.',
      confidence: 0.92
    },
    {
      id: '3',
      speakerId: '3',
      startTime: 245,
      endTime: 360,
      text: 'I\'ve spoken with the client and they\'re willing to adjust the marketing campaign timeline to accommodate the technical constraints.',
      confidence: 0.89
    }
  ];

  const getSpeakerById = (id: string) => {
    return speakers.find(speaker => speaker.id === id) || participants.find(p => p.id === id);
  };

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

  return (
    <Card className={`bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Mic className="w-5 h-5 text-blue-400" />
            Speaker Diarization & Recognition
          </CardTitle>
          <Badge variant="outline" className="bg-blue-900/50 text-blue-300 border-blue-700">
            AI-Powered
          </Badge>
        </div>
        <p className="text-sm text-slate-400">
          Identify who is speaking and track participation statistics
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <Button
            variant="ghost"
            className={`rounded-none px-4 py-2 ${activeTab === 'overview' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400'}`}
            onClick={() => setActiveTab('overview')}
          >
            <Users className="w-4 h-4 mr-2" />
            Overview
          </Button>
          <Button
            variant="ghost"
            className={`rounded-none px-4 py-2 ${activeTab === 'transcript' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400'}`}
            onClick={() => setActiveTab('transcript')}
          >
            <Activity className="w-4 h-4 mr-2" />
            Transcript
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Participation Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-300">Total Speakers</span>
                </div>
                <p className="text-2xl font-bold text-white">{speakers.length}</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-slate-300">Meeting Duration</span>
                </div>
                <p className="text-2xl font-bold text-white">{formatTime(duration)}</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-slate-300">Avg. Talk Time</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatTime(duration / speakers.length)}
                </p>
              </div>
            </div>

            {/* Speaker List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">Speaker Participation</h3>
              
              {speakers.map((speaker) => (
                <div 
                  key={speaker.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedSpeaker === speaker.id 
                      ? 'bg-blue-900/20 border-blue-500' 
                      : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                  }`}
                  onClick={() => setSelectedSpeaker(selectedSpeaker === speaker.id ? null : speaker.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-100">{speaker.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-400">
                            {formatTime(speaker.talkTime)} talk time
                          </span>
                          <div className={`w-2 h-2 rounded-full ${getSentimentColor(speaker.sentiment)}`}></div>
                          <span className="text-xs text-slate-400 capitalize">{speaker.sentiment}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-300">{speaker.talkPercentage}%</p>
                        <p className="text-xs text-slate-500">of meeting</p>
                      </div>
                      <div className="w-24">
                        <Progress 
                          value={speaker.talkPercentage} 
                          className="h-2" 
                          indicatorClassName={getSentimentColor(speaker.sentiment).replace('bg-', '')}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {selectedSpeaker === speaker.id && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Interruptions</p>
                          <p className="text-sm font-medium text-slate-200">{speaker.interruptions}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Topics Discussed</p>
                          <div className="flex flex-wrap gap-1">
                            {speaker.topics.map((topic, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transcript Tab */}
        {activeTab === 'transcript' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-200">Meeting Transcript</h3>
            
            <div className="bg-slate-800/50 rounded-lg p-4 max-h-96 overflow-y-auto">
              {transcriptSegments.map((segment) => {
                const speaker = getSpeakerById(segment.speakerId);
                return (
                  <div key={segment.id} className="mb-4 last:mb-0">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-200">
                            {speaker?.name || 'Unknown Speaker'}
                          </span>
                          <span className="text-xs text-slate-500">
                            {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
                          </span>
                          <Badge 
                            variant="outline" 
                            className="text-xs border-slate-600"
                          >
                            {Math.round(segment.confidence * 100)}% confidence
                          </Badge>
                        </div>
                        <p className="text-slate-300 text-sm">{segment.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" size="sm" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Export Transcript
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};