import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Star, 
  Target, 
  Award, 
  Zap, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle,
  Medal,
  Crown,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  level: number;
  badges: string[];
  streak: number;
  achievements: string[];
}

interface GamificationMetric {
  id: string;
  name: string;
  description: string;
  points: number;
  icon: React.ElementType;
  color: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

interface MeetingGamificationProps {
  meetingId: string;
  participants: Array<{ id: string; name: string; avatar?: string }>;
  duration: number; // in seconds
  className?: string;
}

export const MeetingGamification: React.FC<MeetingGamificationProps> = ({
  meetingId,
  participants,
  duration,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'achievements' | 'metrics'>('leaderboard');
  const [participantsData, setParticipantsData] = useState<Participant[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);

  // Mock data for demonstration
  const gamificationMetrics: GamificationMetric[] = [
    {
      id: 'participation',
      name: 'Active Participation',
      description: 'Points for speaking and contributing',
      points: 10,
      icon: Users,
      color: 'blue'
    },
    {
      id: 'questions',
      name: 'Asking Questions',
      description: 'Points for engaging with others',
      points: 15,
      icon: Target,
      color: 'green'
    },
    {
      id: 'answers',
      name: 'Providing Answers',
      description: 'Points for helping others',
      points: 20,
      icon: Award,
      color: 'purple'
    },
    {
      id: 'punctuality',
      name: 'Punctuality',
      description: 'Points for joining on time',
      points: 5,
      icon: Clock,
      color: 'yellow'
    },
    {
      id: 'completion',
      name: 'Task Completion',
      description: 'Points for completing action items',
      points: 25,
      icon: CheckCircle,
      color: 'pink'
    }
  ];

  const achievements: Achievement[] = [
    {
      id: 'first-meeting',
      name: 'First Meeting',
      description: 'Attend your first meeting',
      icon: Medal,
      unlocked: true
    },
    {
      id: 'team-player',
      name: 'Team Player',
      description: 'Participate in 5 meetings',
      icon: Users,
      unlocked: false,
      progress: 3,
      target: 5
    },
    {
      id: 'knowledge-sharer',
      name: 'Knowledge Sharer',
      description: 'Answer 10 questions',
      icon: Award,
      unlocked: false,
      progress: 7,
      target: 10
    },
    {
      id: 'early-bird',
      name: 'Early Bird',
      description: 'Join 3 meetings early',
      icon: Clock,
      unlocked: true
    },
    {
      id: 'streak-master',
      name: 'Streak Master',
      description: 'Attend meetings for 7 days in a row',
      icon: Flame,
      unlocked: false,
      progress: 4,
      target: 7
    },
    {
      id: 'top-contributor',
      name: 'Top Contributor',
      description: 'Be the top participant in 3 meetings',
      icon: Crown,
      unlocked: false,
      progress: 1,
      target: 3
    }
  ];

  // Initialize participants with mock data
  useEffect(() => {
    const mockParticipants: Participant[] = participants.map((participant, index) => ({
      id: participant.id,
      name: participant.name,
      avatar: participant.avatar,
      points: [125, 98, 87, 65][index] || 50,
      level: [3, 2, 2, 1][index] || 1,
      badges: index === 0 ? ['Top Contributor', 'Early Bird'] : index === 1 ? ['Team Player'] : [],
      streak: [5, 3, 2, 1][index] || 0,
      achievements: index === 0 ? ['first-meeting', 'early-bird'] : index === 1 ? ['first-meeting'] : ['first-meeting']
    }));
    
    setParticipantsData(mockParticipants);
  }, [participants]);

  const getParticipantById = (id: string) => {
    return participantsData.find(p => p.id === id);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'text-slate-400';
      case 2: return 'text-green-400';
      case 3: return 'text-blue-400';
      case 4: return 'text-purple-400';
      case 5: return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const getPointsColor = (points: number) => {
    if (points > 100) return 'text-yellow-400';
    if (points > 75) return 'text-blue-400';
    if (points > 50) return 'text-green-400';
    return 'text-slate-400';
  };

  return (
    <Card className={`bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Meeting Gamification
          </CardTitle>
          <Badge variant="outline" className="bg-yellow-900/50 text-yellow-300 border-yellow-700">
            AI-Powered
          </Badge>
        </div>
        <p className="text-sm text-slate-400">
          Track participation, earn points, and unlock achievements
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <Button
            variant="ghost"
            className={`rounded-none px-4 py-2 ${activeTab === 'leaderboard' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-slate-400'}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            <Trophy className="w-4 h-4 mr-2" />
            Leaderboard
          </Button>
          <Button
            variant="ghost"
            className={`rounded-none px-4 py-2 ${activeTab === 'achievements' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-slate-400'}`}
            onClick={() => setActiveTab('achievements')}
          >
            <Star className="w-4 h-4 mr-2" />
            Achievements
          </Button>
          <Button
            variant="ghost"
            className={`rounded-none px-4 py-2 ${activeTab === 'metrics' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400'}`}
            onClick={() => setActiveTab('metrics')}
          >
            <Zap className="w-4 h-4 mr-2" />
            Metrics
          </Button>
        </div>

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-300">Participants</span>
                </div>
                <p className="text-2xl font-bold text-white">{participantsData.length}</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-slate-300">Avg. Points</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {Math.round(participantsData.reduce((sum, p) => sum + p.points, 0) / participantsData.length)}
                </p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium text-slate-300">Top Streak</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {Math.max(...participantsData.map(p => p.streak))}
                </p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Medal className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-slate-300">Total Badges</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {participantsData.reduce((sum, p) => sum + p.badges.length, 0)}
                </p>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">Participant Rankings</h3>
              
              {participantsData
                .sort((a, b) => b.points - a.points)
                .map((participant, index) => (
                  <div 
                    key={participant.id}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedParticipant === participant.id 
                        ? 'bg-yellow-900/20 border-yellow-500' 
                        : index === 0 
                          ? 'bg-gradient-to-r from-yellow-900/30 to-transparent border-yellow-700' 
                          : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                    }`}
                    onClick={() => setSelectedParticipant(selectedParticipant === participant.id ? null : participant.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-600">
                          {index === 0 && <Crown className="w-5 h-5 text-yellow-400" />}
                          {index === 1 && <Medal className="w-5 h-5 text-gray-400" />}
                          {index === 2 && <Medal className="w-5 h-5 text-amber-600" />}
                          {index > 2 && <span className="text-slate-300 font-bold">{index + 1}</span>}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold">
                            {participant.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-100 flex items-center gap-2">
                            {participant.name}
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelColor(participant.level)}`}>
                              Level {participant.level}
                            </span>
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs ${getPointsColor(participant.points)}`}>
                              {participant.points} points
                            </span>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                            <span className="text-xs text-slate-500">
                              {participant.streak} day streak
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {participant.badges.slice(0, 3).map((badge, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs px-1.5 py-0.5">
                              {badge}
                            </Badge>
                          ))}
                          {participant.badges.length > 3 && (
                            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                              +{participant.badges.length - 3}
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-300">#{index + 1}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded Details */}
                    {selectedParticipant === participant.id && (
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Badges</p>
                            <div className="flex flex-wrap gap-1">
                              {participant.badges.length > 0 ? (
                                participant.badges.map((badge, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {badge}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-xs text-slate-500">No badges yet</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Achievements</p>
                            <div className="flex flex-wrap gap-1">
                              {participant.achievements.length > 0 ? (
                                participant.achievements.map((achievementId, idx) => {
                                  const achievement = achievements.find(a => a.id === achievementId);
                                  return achievement ? (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {achievement.name}
                                    </Badge>
                                  ) : null;
                                })
                              ) : (
                                <span className="text-xs text-slate-500">No achievements yet</span>
                              )}
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

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-200">Achievements</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div 
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700' 
                        : 'bg-slate-800/50 border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        achievement.unlocked 
                          ? 'bg-purple-500/20 text-purple-300' 
                          : 'bg-slate-700 text-slate-500'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          achievement.unlocked ? 'text-purple-200' : 'text-slate-400'
                        }`}>
                          {achievement.name}
                        </h4>
                        <p className="text-sm text-slate-500 mt-1">
                          {achievement.description}
                        </p>
                        
                        {!achievement.unlocked && achievement.progress !== undefined && achievement.target && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-400">
                                Progress: {achievement.progress}/{achievement.target}
                              </span>
                              <span className="text-slate-400">
                                {Math.round((achievement.progress / achievement.target) * 100)}%
                              </span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.target) * 100} 
                              className="h-2" 
                              indicatorClassName="bg-purple-500"
                            />
                          </div>
                        )}
                      </div>
                      {achievement.unlocked && (
                        <Star className="w-5 h-5 text-yellow-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-200">Gamification Metrics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gamificationMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div 
                    key={metric.id}
                    className="p-4 rounded-lg border bg-slate-800/50 border-slate-700"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${metric.color}-500/20 text-${metric.color}-300`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-200">
                          {metric.name}
                        </h4>
                        <p className="text-sm text-slate-500 mt-1">
                          {metric.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <Award className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm font-medium text-slate-300">
                            +{metric.points} points
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="font-medium text-slate-200 mb-3">How It Works</h4>
              <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Participants earn points for various activities during meetings</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Accumulate points to level up and unlock achievements</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Maintain streaks by attending meetings regularly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Earn badges for special accomplishments</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};