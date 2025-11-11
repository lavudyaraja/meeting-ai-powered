import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Clock, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Volume2,
  Eye,
  Play,
  Pause,
  SkipForward,
  SkipBack
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface KeyMoment {
  id: string;
  timestamp: number; // in seconds
  type: 'decision' | 'question' | 'agreement' | 'conflict' | 'insight' | 'action-item';
  title: string;
  description: string;
  confidence: number; // 0-100
  participants: string[]; // participant IDs
  tags: string[];
  transcriptContext: string;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
}

interface KeyMomentsDetectorProps {
  meetingId: string;
  participants: Participant[];
  duration: number; // in seconds
  transcript: string;
  className?: string;
}

export const KeyMomentsDetector: React.FC<KeyMomentsDetectorProps> = ({
  meetingId,
  participants,
  duration,
  transcript,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'moments' | 'analytics'>('timeline');
  const [selectedMoment, setSelectedMoment] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock data for demonstration
  const keyMoments: KeyMoment[] = [
    {
      id: '1',
      timestamp: 120, // 2 minutes
      type: 'decision',
      title: 'Budget Approval',
      description: 'Team agrees to increase marketing budget by 15%',
      confidence: 92,
      participants: ['1', '2', '3'],
      tags: ['finance', 'marketing'],
      transcriptContext: 'Alex: "I think we should approve the additional budget for the marketing campaign." Sarah: "Agreed, the ROI projections look promising."'
    },
    {
      id: '2',
      timestamp: 300, // 5 minutes
      type: 'question',
      title: 'Technical Implementation',
      description: 'Sarah raises concerns about the proposed architecture',
      confidence: 87,
      participants: ['2', '4'],
      tags: ['technical', 'architecture'],
      transcriptContext: 'Sarah: "How do we plan to handle the data migration with the new architecture?" Emma: "That\'s a valid concern, we should discuss this in detail."'
    },
    {
      id: '3',
      timestamp: 540, // 9 minutes
      type: 'conflict',
      title: 'Timeline Disagreement',
      description: 'Team debates project timeline feasibility',
      confidence: 95,
      participants: ['1', '3', '4'],
      tags: ['timeline', 'conflict'],
      transcriptContext: 'Alex: "We need to deliver by next month." Michael: "That timeline is unrealistic given our current resources." Emma: "Perhaps we can adjust the scope instead?"'
    },
    {
      id: '4',
      timestamp: 720, // 12 minutes
      type: 'agreement',
      title: 'Resource Allocation',
      description: 'Consensus reached on additional developer allocation',
      confidence: 89,
      participants: ['1', '2', '3', '4'],
      tags: ['resources', 'team'],
      transcriptContext: 'Alex: "Let\'s allocate two more developers to the project." All: "Agreed."'
    },
    {
      id: '5',
      timestamp: 900, // 15 minutes
      type: 'insight',
      title: 'Market Opportunity',
      description: 'Emma identifies new market segment opportunity',
      confidence: 91,
      participants: ['4'],
      tags: ['market', 'opportunity'],
      transcriptContext: 'Emma: "Based on the customer feedback, I think we should consider expanding into the enterprise segment."'
    },
    {
      id: '6',
      timestamp: 1080, // 18 minutes
      type: 'action-item',
      title: 'Follow-up Research',
      description: 'Assign research task on enterprise market segment',
      confidence: 88,
      participants: ['1', '4'],
      tags: ['research', 'action'],
      transcriptContext: 'Alex: "Emma, please prepare a detailed analysis of the enterprise segment by Friday." Emma: "Will do."'
    }
  ];

  const getParticipantById = (id: string) => {
    return participants.find(p => p.id === id);
  };

  const getMomentTypeIcon = (type: string) => {
    switch (type) {
      case 'decision': return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'question': return <MessageCircle className="w-4 h-4 text-blue-400" />;
      case 'agreement': return <ThumbsUp className="w-4 h-4 text-green-400" />;
      case 'conflict': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'insight': return <Eye className="w-4 h-4 text-purple-400" />;
      case 'action-item': return <Play className="w-4 h-4 text-cyan-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getMomentTypeColor = (type: string) => {
    switch (type) {
      case 'decision': return 'text-yellow-400';
      case 'question': return 'text-blue-400';
      case 'agreement': return 'text-green-400';
      case 'conflict': return 'text-red-400';
      case 'insight': return 'text-purple-400';
      case 'action-item': return 'text-cyan-400';
      default: return 'text-slate-400';
    }
  };

  const getMomentTypeBg = (type: string) => {
    switch (type) {
      case 'decision': return 'bg-yellow-900/20 border-yellow-700';
      case 'question': return 'bg-blue-900/20 border-blue-700';
      case 'agreement': return 'bg-green-900/20 border-green-700';
      case 'conflict': return 'bg-red-900/20 border-red-700';
      case 'insight': return 'bg-purple-900/20 border-purple-700';
      case 'action-item': return 'bg-cyan-900/20 border-cyan-700';
      default: return 'bg-slate-800/50 border-slate-700';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getTypeCount = (type: string) => {
    return keyMoments.filter(moment => moment.type === type).length;
  };

  const getParticipantEngagement = (participantId: string) => {
    const involvedMoments = keyMoments.filter(moment => 
      moment.participants.includes(participantId)
    );
    return Math.round((involvedMoments.length / keyMoments.length) * 100);
  };

  return (
    <Card className={`bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Zap className="w-5 h-5 text-amber-400" />
            Key Moments Detector
          </CardTitle>
          <Badge variant="outline" className="bg-amber-900/50 text-amber-300 border-amber-700">
            AI-Powered
          </Badge>
        </div>
        <p className="text-sm text-slate-400">
          Automatically identify important moments and decisions from your meeting
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-slate-300">Key Moments</span>
            </div>
            <p className="text-xl font-bold text-white">{keyMoments.length}</p>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-slate-300">Participants</span>
            </div>
            <p className="text-xl font-bold text-white">{participants.length}</p>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-slate-300">Avg. Confidence</span>
            </div>
            <p className="text-xl font-bold text-white">
              {Math.round(keyMoments.reduce((sum, m) => sum + m.confidence, 0) / keyMoments.length)}%
            </p>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">Meeting Duration</span>
            </div>
            <p className="text-xl font-bold text-white">{formatTime(duration)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <Button
            variant="ghost"
            className={`rounded-none px-4 py-2 ${activeTab === 'timeline' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400'}`}
            onClick={() => setActiveTab('timeline')}
          >
            <Clock className="w-4 h-4 mr-2" />
            Timeline
          </Button>
          <Button
            variant="ghost"
            className={`rounded-none px-4 py-2 ${activeTab === 'moments' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-slate-400'}`}
            onClick={() => setActiveTab('moments')}
          >
            <Zap className="w-4 h-4 mr-2" />
            Moments
          </Button>
          <Button
            variant="ghost"
            className={`rounded-none px-4 py-2 ${activeTab === 'analytics' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400'}`}
            onClick={() => setActiveTab('analytics')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-200">Meeting Timeline</h3>
            
            <div className="relative pl-8 border-l-2 border-slate-700 ml-3">
              {keyMoments.map((moment, index) => {
                const participantsInvolved = moment.participants.map(id => getParticipantById(id)?.name).filter(Boolean);
                return (
                  <div key={moment.id} className="relative mb-8 last:mb-0">
                    {/* Timeline dot */}
                    <div className="absolute -left-11 top-0 w-6 h-6 rounded-full bg-slate-800 border-4 border-amber-400 flex items-center justify-center">
                      {getMomentTypeIcon(moment.type)}
                    </div>
                    
                    {/* Time marker */}
                    <div className="absolute -left-24 top-0 w-16 text-right">
                      <span className="text-sm font-mono text-slate-400">{formatTime(moment.timestamp)}</span>
                    </div>
                    
                    {/* Moment card */}
                    <div 
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedMoment === moment.id 
                          ? `${getMomentTypeBg(moment.type)} bg-opacity-30` 
                          : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                      }`}
                      onClick={() => setSelectedMoment(selectedMoment === moment.id ? null : moment.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className={`font-medium ${getMomentTypeColor(moment.type)}`}>
                              {moment.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {moment.type.replace('-', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-400 mt-1">
                            {moment.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">{moment.confidence}%</span>
                          <div className="w-16">
                            <Progress value={moment.confidence} className="h-1.5" indicatorClassName="bg-amber-500" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Participants */}
                      <div className="flex items-center gap-2 mt-3">
                        <Users className="w-4 h-4 text-slate-500" />
                        <div className="flex -space-x-2">
                          {moment.participants.slice(0, 3).map((participantId, idx) => {
                            const participant = getParticipantById(participantId);
                            return participant ? (
                              <div 
                                key={idx} 
                                className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-xs text-slate-300"
                                title={participant.name}
                              >
                                {participant.name.charAt(0)}
                              </div>
                            ) : null;
                          })}
                          {moment.participants.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-xs text-slate-300">
                              +{moment.participants.length - 3}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-slate-500">
                          {participantsInvolved.join(', ')}
                        </span>
                      </div>
                      
                      {/* Expanded Details */}
                      {selectedMoment === moment.id && (
                        <div className="mt-4 pt-4 border-t border-slate-700">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-sm font-medium text-slate-300 mb-2">Tags</h5>
                              <div className="flex flex-wrap gap-1">
                                {moment.tags.map((tag, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-slate-300 mb-2">Transcript Context</h5>
                              <p className="text-sm text-slate-400 bg-slate-900/50 p-3 rounded">
                                {moment.transcriptContext}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="outline" className="gap-2">
                              <Play className="w-4 h-4" />
                              Jump to Moment
                            </Button>
                            <Button size="sm" variant="outline" className="gap-2">
                              <MessageCircle className="w-4 h-4" />
                              Add Note
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Moments Tab */}
        {activeTab === 'moments' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-200">Key Moments by Type</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { type: 'decision', icon: Zap, color: 'yellow', count: getTypeCount('decision') },
                { type: 'question', icon: MessageCircle, color: 'blue', count: getTypeCount('question') },
                { type: 'agreement', icon: ThumbsUp, color: 'green', count: getTypeCount('agreement') },
                { type: 'conflict', icon: AlertTriangle, color: 'red', count: getTypeCount('conflict') },
                { type: 'insight', icon: Eye, color: 'purple', count: getTypeCount('insight') },
                { type: 'action-item', icon: Play, color: 'cyan', count: getTypeCount('action-item') }
              ].map(({ type, icon: Icon, color, count }) => (
                <div 
                  key={type} 
                  className={`p-4 rounded-lg border ${getMomentTypeBg(type)}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-${color}-500/20 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${color}-400`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-200 capitalize">
                        {type.replace('-', ' ')}s
                      </h4>
                      <p className="text-sm text-slate-400">
                        {count} identified moments
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="font-medium text-slate-200 mb-3">Top Key Moments</h4>
              <div className="space-y-3">
                {keyMoments
                  .sort((a, b) => b.confidence - a.confidence)
                  .slice(0, 3)
                  .map(moment => (
                    <div 
                      key={moment.id} 
                      className="p-3 rounded-lg border border-slate-700 hover:bg-slate-800 cursor-pointer"
                      onClick={() => setSelectedMoment(selectedMoment === moment.id ? null : moment.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            {getMomentTypeIcon(moment.type)}
                            <h5 className="font-medium text-slate-200">{moment.title}</h5>
                          </div>
                          <p className="text-sm text-slate-400 mt-1">
                            {moment.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-slate-300">
                            {formatTime(moment.timestamp)}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-slate-500">{moment.confidence}%</span>
                            <div className="w-12">
                              <Progress value={moment.confidence} className="h-1" indicatorClassName="bg-amber-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-200">Meeting Analytics</h3>
            
            {/* Participant Engagement */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="font-medium text-slate-200 mb-4">Participant Engagement</h4>
              <div className="space-y-4">
                {participants.map(participant => {
                  const engagement = getParticipantEngagement(participant.id);
                  return (
                    <div key={participant.id} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                        <span className="text-slate-300 font-medium">
                          {participant.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-slate-300">
                            {participant.name}
                          </span>
                          <span className="text-sm text-slate-400">
                            {engagement}%
                          </span>
                        </div>
                        <Progress value={engagement} className="h-2" indicatorClassName="bg-blue-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Moment Distribution */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="font-medium text-slate-200 mb-4">Moment Type Distribution</h4>
              <div className="space-y-3">
                {[
                  { type: 'decision', count: getTypeCount('decision'), color: 'bg-yellow-500' },
                  { type: 'question', count: getTypeCount('question'), color: 'bg-blue-500' },
                  { type: 'agreement', count: getTypeCount('agreement'), color: 'bg-green-500' },
                  { type: 'conflict', count: getTypeCount('conflict'), color: 'bg-red-500' },
                  { type: 'insight', count: getTypeCount('insight'), color: 'bg-purple-500' },
                  { type: 'action-item', count: getTypeCount('action-item'), color: 'bg-cyan-500' }
                ]
                  .filter(item => item.count > 0)
                  .map(item => (
                    <div key={item.type} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm text-slate-300 capitalize flex-1">
                        {item.type.replace('-', ' ')}s
                      </span>
                      <span className="text-sm font-medium text-slate-200">
                        {item.count}
                      </span>
                      <div className="w-24">
                        <Progress 
                          value={(item.count / keyMoments.length) * 100} 
                          className="h-1.5" 
                          indicatorClassName={item.color.replace('bg-', '')}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Meeting Insights */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="font-medium text-slate-200 mb-3">AI Insights</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-900/20 rounded-lg border border-green-800/50">
                  <ThumbsUp className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-200">High Agreement Rate</p>
                    <p className="text-sm text-green-400">
                      67% of key moments were agreements, indicating good team alignment.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-800/50">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-200">Conflict Resolution</p>
                    <p className="text-sm text-yellow-400">
                      The timeline conflict was resolved within 5 minutes, showing effective conflict management.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-purple-900/20 rounded-lg border border-purple-800/50">
                  <Eye className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-purple-200">Valuable Insight</p>
                    <p className="text-sm text-purple-400">
                      Emma's market opportunity insight could lead to 15% revenue growth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};