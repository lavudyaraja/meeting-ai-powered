import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Clock,
  Zap,
  CheckCircle,
  BarChart3,
  AlertTriangle,
  ThumbsUp
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface MeetingInsightsSummaryProps {
  meetingId: string;
  participants: Array<{ id: string; name: string; avatar?: string }>;
  duration: number; // in seconds
  className?: string;
}

export const MeetingInsightsSummary: React.FC<MeetingInsightsSummaryProps> = ({
  meetingId,
  participants,
  duration,
  className = ''
}) => {
  // Mock data for demonstration
  const insights = {
    participation: {
      totalSpeakers: participants.length,
      avgTalkTime: Math.floor(duration / participants.length),
      mostActiveSpeaker: 'Alex Johnson',
      participationBalance: 78 // 0-100 scale
    },
    sentiment: {
      overall: 'Positive',
      positive: 65, // percentage
      neutral: 25,
      negative: 10,
      keyMoments: 12
    },
    topics: {
      total: 5,
      primary: 'Project Planning',
      secondary: 'Resource Allocation',
      transitions: 8
    },
    decisions: {
      total: 3,
      pending: 1,
      implemented: 2
    },
    actionItems: {
      total: 4,
      completed: 1,
      inProgress: 2,
      pending: 1
    },
    keyMoments: {
      total: 24,
      decisions: 3,
      questions: 7,
      agreements: 8,
      conflicts: 1,
      insights: 5
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Card className={`bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Brain className="w-5 h-5 text-indigo-400" />
            Meeting Insights Summary
          </CardTitle>
          <Badge variant="outline" className="bg-indigo-900/50 text-indigo-300 border-indigo-700">
            AI-Powered
          </Badge>
        </div>
        <p className="text-sm text-slate-400">
          Comprehensive overview of key meeting insights and metrics
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Meeting Score */}
        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-700/50 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-indigo-200">Meeting Effectiveness</h3>
              <p className="text-slate-400 text-sm">Overall AI assessment</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">84%</div>
              <div className="text-sm text-green-400">Highly Effective</div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={84} className="h-2" indicatorClassName="bg-indigo-500" />
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-slate-300">Participants</span>
            </div>
            <p className="text-2xl font-bold text-white">{insights.participation.totalSpeakers}</p>
            <p className="text-xs text-slate-500 mt-1">
              {insights.participation.mostActiveSpeaker} most active
            </p>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-slate-300">Duration</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatTime(duration)}</p>
            <p className="text-xs text-slate-500 mt-1">
              Avg. talk time: {formatTime(insights.participation.avgTalkTime)}
            </p>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-slate-300">Topics</span>
            </div>
            <p className="text-2xl font-bold text-white">{insights.topics.total}</p>
            <p className="text-xs text-slate-500 mt-1">
              Primary: {insights.topics.primary}
              </p>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-slate-300">Key Moments</span>
            </div>
            <p className="text-2xl font-bold text-white">{insights.keyMoments.total}</p>
            <p className="text-xs text-slate-500 mt-1">
              {insights.keyMoments.agreements} agreements
            </p>
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h3 className="font-medium text-slate-200 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            Sentiment Analysis
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Overall Sentiment</span>
              <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-700">
                {insights.sentiment.overall}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-400 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  Positive
                </span>
                <span className="text-slate-300">{insights.sentiment.positive}%</span>
              </div>
              <Progress value={insights.sentiment.positive} className="h-2" indicatorClassName="bg-green-500" />
              
              <div className="flex justify-between text-sm">
                <span className="text-yellow-400 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  Neutral
                </span>
                <span className="text-slate-300">{insights.sentiment.neutral}%</span>
              </div>
              <Progress value={insights.sentiment.neutral} className="h-2" indicatorClassName="bg-yellow-500" />
              
              <div className="flex justify-between text-sm">
                <span className="text-red-400 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  Negative
                </span>
                <span className="text-slate-300">{insights.sentiment.negative}%</span>
              </div>
              <Progress value={insights.sentiment.negative} className="h-2" indicatorClassName="bg-red-500" />
            </div>
          </div>
        </div>

        {/* Action Items & Decisions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h3 className="font-medium text-slate-200 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Action Items
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Total</span>
                <span className="text-sm font-medium text-slate-200">{insights.actionItems.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Completed</span>
                <span className="text-sm font-medium text-green-400">{insights.actionItems.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">In Progress</span>
                <span className="text-sm font-medium text-blue-400">{insights.actionItems.inProgress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Pending</span>
                <span className="text-sm font-medium text-yellow-400">{insights.actionItems.pending}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h3 className="font-medium text-slate-200 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Key Decisions
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Total</span>
                <span className="text-sm font-medium text-slate-200">{insights.decisions.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Implemented</span>
                <span className="text-sm font-medium text-green-400">{insights.decisions.implemented}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Pending</span>
                <span className="text-sm font-medium text-yellow-400">{insights.decisions.pending}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Moments Breakdown */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h3 className="font-medium text-slate-200 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Key Moments Breakdown
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="text-center p-2 bg-green-900/20 rounded-lg">
              <div className="text-lg font-bold text-green-400">{insights.keyMoments.agreements}</div>
              <div className="text-xs text-slate-400">Agreements</div>
            </div>
            <div className="text-center p-2 bg-blue-900/20 rounded-lg">
              <div className="text-lg font-bold text-blue-400">{insights.keyMoments.questions}</div>
              <div className="text-xs text-slate-400">Questions</div>
            </div>
            <div className="text-center p-2 bg-purple-900/20 rounded-lg">
              <div className="text-lg font-bold text-purple-400">{insights.keyMoments.insights}</div>
              <div className="text-xs text-slate-400">Insights</div>
            </div>
            <div className="text-center p-2 bg-amber-900/20 rounded-lg">
              <div className="text-lg font-bold text-amber-400">{insights.keyMoments.decisions}</div>
              <div className="text-xs text-slate-400">Decisions</div>
            </div>
            <div className="text-center p-2 bg-red-900/20 rounded-lg">
              <div className="text-lg font-bold text-red-400">{insights.keyMoments.conflicts}</div>
              <div className="text-xs text-slate-400">Conflicts</div>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h3 className="font-medium text-slate-200 mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-400" />
            AI Recommendations
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-900/20 rounded-lg border border-green-800/50">
              <ThumbsUp className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-200">High Engagement</p>
                <p className="text-sm text-green-400">
                  Participation balance is healthy at {insights.participation.participationBalance}%. 
                  Continue encouraging equal participation.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-900/20 rounded-lg border border-blue-800/50">
              <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-200">Follow Up on Actions</p>
                <p className="text-sm text-blue-400">
                  {insights.actionItems.pending} action items are pending. 
                  Schedule a follow-up to ensure completion.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-purple-900/20 rounded-lg border border-purple-800/50">
              <BarChart3 className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-purple-200">Document Decisions</p>
                <p className="text-sm text-purple-400">
                  {insights.decisions.pending} decisions need implementation tracking. 
                  Add these to your project management system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};