import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  Activity, 
  Hash, 
  Calendar, 
  Video,
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  Filter,
  Search,
  Grid,
  CheckCircle,
  Zap,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SpeakerDiarization } from './SpeakerDiarization';
import { SentimentAnalysis } from './SentimentAnalysis';
import { TopicClustering } from './TopicClustering';
import { SmartScheduling } from './SmartScheduling';
import { IntelligentRecording } from './IntelligentRecording';
import { DecisionMatrixAnalysis } from './DecisionMatrixAnalysis';
import { ActionItemsTracker } from './ActionItemsTracker';
import { KeyMomentsDetector } from './KeyMomentsDetector';
import { MeetingInsightsSummary } from './MeetingInsightsSummary';

interface Participant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AdvancedMeetingsDashboardProps {
  meetingId?: string;
  className?: string;
}

export const AdvancedMeetingsDashboard: React.FC<AdvancedMeetingsDashboardProps> = ({
  meetingId,
  className = ''
}) => {
  const [activeFeature, setActiveFeature] = useState<
    'diarization' | 'sentiment' | 'topics' | 'scheduling' | 'recording' | 'decision' | 'actions' | 'moments' | 'summary'
  >('diarization');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const participants: Participant[] = [
    { id: '1', name: 'Alex Johnson', email: 'alex@example.com' },
    { id: '2', name: 'Sarah Chen', email: 'sarah@example.com' },
    { id: '3', name: 'Michael Rodriguez', email: 'michael@example.com' },
    { id: '4', name: 'Emma Wilson', email: 'emma@example.com' }
  ];

  const meetingDuration = 1200; // 20 minutes in seconds

  const features = [
    { id: 'diarization', name: 'Speaker Diarization', icon: Mic, color: 'blue' },
    { id: 'sentiment', name: 'Sentiment Analysis', icon: Activity, color: 'purple' },
    { id: 'topics', name: 'Topic Clustering', icon: Hash, color: 'cyan' },
    { id: 'scheduling', name: 'Smart Scheduling', icon: Calendar, color: 'orange' },
    { id: 'recording', name: 'Intelligent Recording', icon: Video, color: 'pink' },
    { id: 'decision', name: 'Decision Matrix', icon: Grid, color: 'cyan' },
    { id: 'actions', name: 'Action Items', icon: CheckCircle, color: 'green' },
    { id: 'moments', name: 'Key Moments', icon: Zap, color: 'amber' },
    { id: 'summary', name: 'Insights Summary', icon: Brain, color: 'indigo' }
  ];

  const getFeatureIcon = (featureId: string) => {
    const feature = features.find(f => f.id === featureId);
    if (!feature) return null;
    const Icon = feature.icon;
    return <Icon className="w-5 h-5" />;
  };

  const getFeatureColor = (featureId: string) => {
    const feature = features.find(f => f.id === featureId);
    return feature ? feature.color : 'gray';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Advanced Meeting Insights</h1>
          <p className="text-slate-400">
            AI-powered analysis of your meetings with deep insights
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search insights..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-slate-200 w-64"
            />
          </div>
          
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Feature Navigation */}
      <div className="flex flex-wrap gap-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Button
              key={feature.id}
              variant="outline"
              className={`gap-2 ${
                activeFeature === feature.id
                  ? `bg-${feature.color}-500/20 border-${feature.color}-500 text-${feature.color}-300`
                  : 'border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
              onClick={() => setActiveFeature(feature.id as any)}
            >
              <Icon className="w-4 h-4" />
              {feature.name}
            </Button>
          );
        })}
      </div>

      {/* Feature Content */}
      <div>
        {activeFeature === 'diarization' && (
          <SpeakerDiarization 
            meetingId={meetingId || 'demo-meeting'} 
            participants={participants} 
            duration={meetingDuration}
          />
        )}
        
        {activeFeature === 'sentiment' && (
          <SentimentAnalysis 
            meetingId={meetingId || 'demo-meeting'} 
            participants={participants} 
            duration={meetingDuration}
          />
        )}
        
        {activeFeature === 'topics' && (
          <TopicClustering 
            meetingId={meetingId || 'demo-meeting'} 
            participants={participants} 
            duration={meetingDuration}
          />
        )}
        
        {activeFeature === 'scheduling' && (
          <SmartScheduling 
            meetingId={meetingId} 
            participants={participants}
          />
        )}
        
        {activeFeature === 'recording' && (
          <IntelligentRecording 
            meetingId={meetingId || 'demo-meeting'} 
            participants={participants} 
            duration={meetingDuration}
          />
        )}
        
        {activeFeature === 'decision' && (
          <DecisionMatrixAnalysis 
            meetingId={meetingId || 'demo-meeting'} 
            participants={participants}
          />
        )}
        
        {activeFeature === 'actions' && (
          <ActionItemsTracker 
            meetingId={meetingId || 'demo-meeting'} 
            participants={participants}
          />
        )}
        
        {activeFeature === 'moments' && (
          <KeyMomentsDetector 
            meetingId={meetingId || 'demo-meeting'} 
            participants={participants}
            duration={meetingDuration}
            transcript="Mock transcript data for the meeting"
          />
        )}
        
        {activeFeature === 'summary' && (
          <MeetingInsightsSummary 
            meetingId={meetingId || 'demo-meeting'} 
            participants={participants}
            duration={meetingDuration}
          />
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-blue-300">
              <Mic className="w-4 h-4" />
              Speakers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">4</div>
            <p className="text-xs text-blue-200">Active participants</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-purple-300">
              <Activity className="w-4 h-4" />
              Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Positive</div>
            <p className="text-xs text-purple-200">Overall tone</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 border-cyan-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-cyan-300">
              <Hash className="w-4 h-4" />
              Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">5</div>
            <p className="text-xs text-cyan-200">Key discussion areas</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border-orange-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-orange-300">
              <Clock className="w-4 h-4" />
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">20m</div>
            <p className="text-xs text-orange-200">Meeting length</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-pink-900/30 to-pink-800/20 border-pink-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-pink-300">
              <BarChart3 className="w-4 h-4" />
              Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">24</div>
            <p className="text-xs text-pink-200">Key moments identified</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};