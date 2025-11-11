import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Smile, 
  Frown, 
  Meh,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface SentimentDataPoint {
  time: string; // timestamp or time label
  positive: number; // 0-100
  negative: number; // 0-100
  neutral: number; // 0-100
  overall: 'positive' | 'negative' | 'neutral';
}

interface ParticipantSentiment {
  id: string;
  name: string;
  positive: number;
  negative: number;
  neutral: number;
  overall: 'positive' | 'negative' | 'neutral';
  sentimentTrend: 'improving' | 'declining' | 'stable';
}

interface SentimentAnalysisProps {
  meetingId: string;
  participants: Array<{ id: string; name: string }>;
  duration: number; // in seconds
  className?: string;
}

export const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({
  meetingId,
  participants,
  duration,
  className = ''
}) => {
  const [timeRange, setTimeRange] = useState<'15m' | '30m' | '1h' | 'all'>('all');

  // Mock data for demonstration
  const sentimentData: SentimentDataPoint[] = [
    { time: '00:00', positive: 60, negative: 20, neutral: 20, overall: 'positive' },
    { time: '05:00', positive: 70, negative: 15, neutral: 15, overall: 'positive' },
    { time: '10:00', positive: 50, negative: 30, neutral: 20, overall: 'negative' },
    { time: '15:00', positive: 40, negative: 40, neutral: 20, overall: 'negative' },
    { time: '20:00', positive: 65, negative: 20, neutral: 15, overall: 'positive' },
    { time: '25:00', positive: 80, negative: 10, neutral: 10, overall: 'positive' },
    { time: '30:00', positive: 75, negative: 15, neutral: 10, overall: 'positive' },
  ];

  const participantSentiments: ParticipantSentiment[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      positive: 75,
      negative: 10,
      neutral: 15,
      overall: 'positive',
      sentimentTrend: 'improving'
    },
    {
      id: '2',
      name: 'Sarah Chen',
      positive: 60,
      negative: 25,
      neutral: 15,
      overall: 'positive',
      sentimentTrend: 'stable'
    },
    {
      id: '3',
      name: 'Michael Rodriguez',
      positive: 40,
      negative: 45,
      neutral: 15,
      overall: 'negative',
      sentimentTrend: 'declining'
    },
    {
      id: '4',
      name: 'Emma Wilson',
      positive: 55,
      negative: 30,
      neutral: 15,
      overall: 'positive',
      sentimentTrend: 'stable'
    }
  ];

  const overallSentimentData = [
    { name: 'Positive', value: 65 },
    { name: 'Negative', value: 20 },
    { name: 'Neutral', value: 15 },
  ];

  const COLORS = ['#10B981', '#EF4444', '#94A3B8'];

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Smile className="w-4 h-4 text-green-500" />;
      case 'negative': return <Frown className="w-4 h-4 text-red-500" />;
      case 'neutral': return <Meh className="w-4 h-4 text-gray-500" />;
      default: return <Meh className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getOverallSentiment = () => {
    const positive = overallSentimentData.find(d => d.name === 'Positive')?.value || 0;
    const negative = overallSentimentData.find(d => d.name === 'Negative')?.value || 0;
    
    if (positive > negative) return 'positive';
    if (negative > positive) return 'negative';
    return 'neutral';
  };

  const overallSentiment = getOverallSentiment();

  return (
    <Card className={`bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Activity className="w-5 h-5 text-purple-400" />
            Sentiment Analysis
          </CardTitle>
          <Badge variant="outline" className="bg-purple-900/50 text-purple-300 border-purple-700">
            AI-Powered
          </Badge>
        </div>
        <p className="text-sm text-slate-400">
          Analyze the emotional tone of the meeting and detect team dynamics
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Sentiment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-slate-300">Overall Meeting Sentiment</h3>
              <div className="flex items-center gap-2">
                {getSentimentIcon(overallSentiment)}
                <span className="capitalize font-medium text-slate-200">{overallSentiment}</span>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sentimentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#94A3B8" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#94A3B8" 
                    domain={[0, 100]} 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderColor: '#334155',
                      borderRadius: '0.5rem'
                    }}
                    itemStyle={{ color: '#f1f5f9' }}
                    labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="positive" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ stroke: '#10B981', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 6, stroke: '#10B981' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="negative" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    dot={{ stroke: '#EF4444', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 6, stroke: '#EF4444' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="neutral" 
                    stroke="#94A3B8" 
                    strokeWidth={2}
                    dot={{ stroke: '#94A3B8', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 6, stroke: '#94A3B8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h3 className="font-medium text-slate-300 mb-4">Sentiment Distribution</h3>
            
            <div className="h-40 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={overallSentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {overallSentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderColor: '#334155',
                      borderRadius: '0.5rem'
                    }}
                    formatter={(value) => [`${value}%`, 'Percentage']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-slate-300">Positive</span>
                </div>
                <span className="text-sm font-medium text-slate-200">65%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-slate-300">Negative</span>
                </div>
                <span className="text-sm font-medium text-slate-200">20%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className="text-sm text-slate-300">Neutral</span>
                </div>
                <span className="text-sm font-medium text-slate-200">15%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Participant Sentiments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-200">Participant Sentiments</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className={`text-xs ${timeRange === '15m' ? 'bg-blue-500/20 border-blue-500' : ''}`}
                onClick={() => setTimeRange('15m')}
              >
                15m
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={`text-xs ${timeRange === '30m' ? 'bg-blue-500/20 border-blue-500' : ''}`}
                onClick={() => setTimeRange('30m')}
              >
                30m
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={`text-xs ${timeRange === '1h' ? 'bg-blue-500/20 border-blue-500' : ''}`}
                onClick={() => setTimeRange('1h')}
              >
                1h
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={`text-xs ${timeRange === 'all' ? 'bg-blue-500/20 border-blue-500' : ''}`}
                onClick={() => setTimeRange('all')}
              >
                All
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {participantSentiments.map((participant) => (
              <div 
                key={participant.id} 
                className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-slate-200">{participant.name}</h4>
                  <div className="flex items-center gap-2">
                    {getSentimentIcon(participant.overall)}
                    <span className="text-xs capitalize text-slate-400">{participant.overall}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Positive</p>
                    <p className="text-sm font-medium text-green-400">{participant.positive}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Negative</p>
                    <p className="text-sm font-medium text-red-400">{participant.negative}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Neutral</p>
                    <p className="text-sm font-medium text-gray-400">{participant.neutral}%</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Trend:</span>
                    {getTrendIcon(participant.sentimentTrend)}
                    <span className="text-xs capitalize text-slate-300">{participant.sentimentTrend}</span>
                  </div>
                  
                  <div className="flex gap-1">
                    {participant.overall === 'negative' && (
                      <Badge variant="outline" className="text-xs border-red-700 text-red-400">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Concern
                      </Badge>
                    )}
                    {participant.positive > 70 && (
                      <Badge variant="outline" className="text-xs border-green-700 text-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Positive
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Insights */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h3 className="font-medium text-slate-300 mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            Sentiment Insights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Smile className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-300">Positive Peak</span>
              </div>
              <p className="text-xs text-slate-300">
                Highest positive sentiment at 25:00 minute mark
              </p>
            </div>
            
            <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Frown className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-red-300">Negative Dip</span>
              </div>
              <p className="text-xs text-slate-300">
                Most negative sentiment between 10:00-20:00 minutes
              </p>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">Improvement</span>
              </div>
              <p className="text-xs text-slate-300">
                Overall sentiment improved by 15% in the last 10 minutes
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};