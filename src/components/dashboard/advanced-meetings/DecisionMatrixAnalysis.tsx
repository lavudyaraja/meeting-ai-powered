import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Grid, 
  CheckSquare, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Award,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface DecisionOption {
  id: string;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  score: number;
  confidence: number;
}

interface EvaluationCriteria {
  id: string;
  name: string;
  weight: number; // 1-10 scale
  description: string;
}

interface ParticipantVote {
  participantId: string;
  participantName: string;
  optionId: string;
  score: number; // 1-5 scale
  comment?: string;
}

interface DecisionMatrixAnalysisProps {
  meetingId: string;
  participants: Array<{ id: string; name: string; avatar?: string }>;
  className?: string;
}

export const DecisionMatrixAnalysis: React.FC<DecisionMatrixAnalysisProps> = ({
  meetingId,
  participants,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'options' | 'results'>('matrix');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [votes, setVotes] = useState<ParticipantVote[]>([]);

  // Mock data for demonstration
  const evaluationCriteria: EvaluationCriteria[] = [
    {
      id: 'cost',
      name: 'Cost Efficiency',
      weight: 8,
      description: 'How cost-effective is this option?'
    },
    {
      id: 'time',
      name: 'Implementation Time',
      weight: 7,
      description: 'How quickly can this be implemented?'
    },
    {
      id: 'impact',
      name: 'Business Impact',
      weight: 9,
      description: 'What is the potential business impact?'
    },
    {
      id: 'risk',
      name: 'Risk Level',
      weight: 6,
      description: 'What are the associated risks?'
    },
    {
      id: 'resources',
      name: 'Resource Requirements',
      weight: 7,
      description: 'How many resources are needed?'
    }
  ];

  const decisionOptions: DecisionOption[] = [
    {
      id: '1',
      title: 'Cloud Migration',
      description: 'Migrate all services to cloud infrastructure',
      pros: [
        'Scalability and flexibility',
        'Reduced maintenance costs',
        'Improved disaster recovery'
      ],
      cons: [
        'Initial migration complexity',
        'Potential downtime during transition',
        'Vendor lock-in concerns'
      ],
      score: 8.2,
      confidence: 75
    },
    {
      id: '2',
      title: 'Hybrid Approach',
      description: 'Combine on-premise and cloud solutions',
      pros: [
        'Gradual transition with less risk',
        'Maintain control over sensitive data',
        'Flexible resource allocation'
      ],
      cons: [
        'Complex management of two environments',
        'Higher operational overhead',
        'Integration challenges'
      ],
      score: 7.6,
      confidence: 82
    },
    {
      id: '3',
      title: 'On-Premise Upgrade',
      description: 'Upgrade existing on-premise infrastructure',
      pros: [
        'Full control over data and systems',
        'No vendor dependency',
        'Leverage existing investments'
      ],
      cons: [
        'High upfront costs',
        'Limited scalability',
        'Outdated technology risks'
      ],
      score: 6.4,
      confidence: 68
    }
  ];

  const participantVotes: ParticipantVote[] = [
    { participantId: '1', participantName: 'Alex Johnson', optionId: '1', score: 5, comment: 'Best long-term solution' },
    { participantId: '2', participantName: 'Sarah Chen', optionId: '1', score: 4, comment: 'Good but complex' },
    { participantId: '3', participantName: 'Michael Rodriguez', optionId: '2', score: 5, comment: 'Safest approach' },
    { participantId: '4', participantName: 'Emma Wilson', optionId: '2', score: 4, comment: 'Balanced option' },
    { participantId: '1', participantName: 'Alex Johnson', optionId: '3', score: 2, comment: 'Too expensive' },
    { participantId: '2', participantName: 'Sarah Chen', optionId: '3', score: 3, comment: 'Familiar but limiting' }
  ];

  const getOptionById = (id: string) => {
    return decisionOptions.find(option => option.id === id);
  };

  const getVotesForOption = (optionId: string) => {
    return participantVotes.filter(vote => vote.optionId === optionId);
  };

  const getAverageScore = (optionId: string) => {
    const votes = getVotesForOption(optionId);
    if (votes.length === 0) return 0;
    return votes.reduce((sum, vote) => sum + vote.score, 0) / votes.length;
  };

  const getRecommendation = () => {
    const scores = decisionOptions.map(option => ({
      id: option.id,
      title: option.title,
      avgScore: getAverageScore(option.id),
      aiScore: option.score
    }));
    
    return scores.sort((a, b) => b.aiScore - a.aiScore)[0];
  };

  const recommendation = getRecommendation();

  return (
    <Card className={`bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Grid className="w-5 h-5 text-cyan-400" />
            Decision Matrix Analysis
          </CardTitle>
          <Badge variant="outline" className="bg-cyan-900/50 text-cyan-300 border-cyan-700">
            AI-Powered
          </Badge>
        </div>
        <p className="text-sm text-slate-400">
          Evaluate options based on weighted criteria with team input
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <Button
            variant="ghost"
            className={`rounded-none px-4 py-2 ${activeTab === 'matrix' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400'}`}
            onClick={() => setActiveTab('matrix')}
          >
            <Grid className="w-4 h-4 mr-2" />
            Matrix
          </Button>
          <Button
            variant="ghost"
            className={`rounded-none px-4 py-2 ${activeTab === 'options' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400'}`}
            onClick={() => setActiveTab('options')}
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            Options
          </Button>
          <Button
            variant="ghost"
            className={`rounded-none px-4 py-2 ${activeTab === 'results' ? 'text-green-400 border-b-2 border-green-400' : 'text-slate-400'}`}
            onClick={() => setActiveTab('results')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Results
          </Button>
        </div>

        {/* Matrix Tab */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            {/* Recommendation */}
            <div className="bg-gradient-to-r from-cyan-900/30 to-cyan-800/20 border border-cyan-700/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-cyan-200">AI Recommendation</h3>
                  <p className="text-sm text-cyan-100 mt-1">
                    Based on analysis, <span className="font-semibold">{recommendation.title}</span> is the optimal choice with a score of {recommendation.aiScore}/10.
                  </p>
                </div>
              </div>
            </div>

            {/* Criteria Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Criteria</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Weight</th>
                    {decisionOptions.map(option => (
                      <th key={option.id} className="text-center py-3 px-4 text-slate-300 font-medium">
                        <div className="flex flex-col items-center">
                          <span className="font-medium">{option.title}</span>
                          <span className="text-xs text-slate-400 mt-1">Score: {option.score}/10</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {evaluationCriteria.map(criteria => (
                    <tr key={criteria.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-slate-200">{criteria.name}</div>
                          <div className="text-xs text-slate-400 mt-1">{criteria.description}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300">{criteria.weight}/10</span>
                          <Progress value={criteria.weight * 10} className="w-20 h-1.5" indicatorClassName="bg-cyan-500" />
                        </div>
                      </td>
                      {decisionOptions.map(option => (
                        <td key={`${criteria.id}-${option.id}`} className="py-3 px-4 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-medium">
                              {Math.floor(Math.random() * 3) + 3}
                            </div>
                            <span className="text-xs text-slate-400 mt-1">/5</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Voting Summary */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Team Voting Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {decisionOptions.map(option => {
                  const votes = getVotesForOption(option.id);
                  const avgScore = getAverageScore(option.id);
                  return (
                    <div key={option.id} className="border border-slate-700 rounded-lg p-3">
                      <div className="font-medium text-slate-200">{option.title}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-slate-400">Avg. Score</span>
                        <span className="font-medium text-slate-200">{avgScore.toFixed(1)}/5</span>
                      </div>
                      <div className="mt-2">
                        <Progress value={(avgScore / 5) * 100} className="h-2" indicatorClassName="bg-cyan-500" />
                      </div>
                      <div className="text-xs text-slate-400 mt-2">{votes.length} votes</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Options Tab */}
        {activeTab === 'options' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-200">Decision Options</h3>
            
            {decisionOptions.map(option => (
              <div 
                key={option.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedOption === option.id 
                    ? 'bg-cyan-900/20 border-cyan-500' 
                    : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                }`}
                onClick={() => setSelectedOption(selectedOption === option.id ? null : option.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-100">{option.title}</h4>
                    <p className="text-sm text-slate-400 mt-1">{option.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium text-slate-300">{option.score}/10</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">AI Score</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-slate-300">{option.confidence}%</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Confidence</div>
                    </div>
                  </div>
                </div>
                
                {/* Expanded Details */}
                {selectedOption === option.id && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                          <ThumbsUp className="w-4 h-4 text-green-400" />
                          Pros
                        </h5>
                        <ul className="text-sm text-slate-400 space-y-1">
                          {option.pros.map((pro, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0"></div>
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                          <ThumbsDown className="w-4 h-4 text-red-400" />
                          Cons
                        </h5>
                        <ul className="text-sm text-slate-400 space-y-1">
                          {option.cons.map((con, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0"></div>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {/* Participant Votes */}
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        Team Votes
                      </h5>
                      <div className="space-y-2">
                        {getVotesForOption(option.id).map((vote, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm">
                            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-xs">
                              {vote.participantName.charAt(0)}
                            </div>
                            <span className="text-slate-300">{vote.participantName}</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <div 
                                  key={i} 
                                  className={`w-2 h-2 rounded-full ${i < vote.score ? 'bg-cyan-400' : 'bg-slate-600'}`}
                                ></div>
                              ))}
                            </div>
                            {vote.comment && (
                              <span className="text-slate-500 italic">"{vote.comment}"</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-200">Decision Analysis Results</h3>
            
            {/* Final Recommendation */}
            <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 border border-cyan-700/50 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-cyan-200">Recommended Option</h4>
                  <h5 className="text-lg font-semibold text-white mt-1">{recommendation.title}</h5>
                  <p className="text-slate-300 mt-2">
                    Based on the weighted criteria analysis and team voting, this option provides the best balance 
                    of cost efficiency, implementation time, and business impact.
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-300">AI Score: <span className="font-medium">{recommendation.aiScore}/10</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-300">Team Avg: <span className="font-medium">{getAverageScore(recommendation.id).toFixed(1)}/5</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Comparison Chart */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="font-medium text-slate-200 mb-4">Option Comparison</h4>
              <div className="space-y-4">
                {decisionOptions
                  .sort((a, b) => b.score - a.score)
                  .map((option, index) => {
                    const avgScore = getAverageScore(option.id);
                    return (
                      <div key={option.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-sm">
                              {index + 1}
                            </div>
                            <span className="font-medium text-slate-200">{option.title}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm text-slate-400">AI Score</div>
                              <div className="font-medium text-slate-200">{option.score}/10</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-slate-400">Team Avg</div>
                              <div className="font-medium text-slate-200">{avgScore.toFixed(1)}/5</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <div className="text-xs text-slate-400 mb-1">AI Analysis</div>
                            <Progress value={option.score * 10} className="h-2" indicatorClassName="bg-cyan-500" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-slate-400 mb-1">Team Voting</div>
                            <Progress value={(avgScore / 5) * 100} className="h-2" indicatorClassName="bg-blue-500" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            
            {/* Decision Confidence */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="font-medium text-slate-200 mb-3">Decision Confidence</h4>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Overall Confidence</span>
                    <span className="text-slate-200 font-medium">82%</span>
                  </div>
                  <Progress value={82} className="h-2" indicatorClassName="bg-green-500" />
                  <div className="text-xs text-slate-500 mt-2">
                    Based on criteria alignment and team consensus
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};