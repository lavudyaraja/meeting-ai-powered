import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Clock,
  Users,
  TrendingUp,
  BarChart3,
  Filter,
  Search,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface ParticipantAvailability {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  timezone: string;
  availability: {
    date: string; // YYYY-MM-DD
    timeSlots: TimeSlot[];
  }[];
}

interface TimeSlot {
  start: string; // HH:MM
  end: string; // HH:MM
  available: boolean;
  preferred: boolean;
}

interface MeetingRecommendation {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // in minutes
  participantsAvailable: number;
  totalParticipants: number;
  confidence: number; // 0-100
  conflicts: string[];
  timezone: string;
}

interface SmartSchedulingProps {
  meetingId?: string;
  participants: Array<{ id: string; name: string; email: string }>;
  className?: string;
}

export const SmartScheduling: React.FC<SmartSchedulingProps> = ({
  meetingId,
  participants,
  className = ''
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'calendar' | 'recommendations'>('recommendations');
  const [selectedTimezone, setSelectedTimezone] = useState('UTC');

  // Mock data for demonstration
  const participantAvailabilities: ParticipantAvailability[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      timezone: 'America/New_York',
      availability: [
        {
          date: '2023-06-15',
          timeSlots: [
            { start: '09:00', end: '12:00', available: true, preferred: true },
            { start: '13:00', end: '17:00', available: true, preferred: false }
          ]
        },
        {
          date: '2023-06-16',
          timeSlots: [
            { start: '10:00', end: '12:00', available: true, preferred: true },
            { start: '14:00', end: '18:00', available: true, preferred: false }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      timezone: 'America/Los_Angeles',
      availability: [
        {
          date: '2023-06-15',
          timeSlots: [
            { start: '12:00', end: '15:00', available: true, preferred: true },
            { start: '16:00', end: '19:00', available: true, preferred: false }
          ]
        },
        {
          date: '2023-06-16',
          timeSlots: [
            { start: '09:00', end: '11:00', available: true, preferred: false },
            { start: '13:00', end: '17:00', available: true, preferred: true }
          ]
        }
      ]
    },
    {
      id: '3',
      name: 'Michael Rodriguez',
      email: 'michael@example.com',
      timezone: 'Europe/London',
      availability: [
        {
          date: '2023-06-15',
          timeSlots: [
            { start: '15:00', end: '18:00', available: true, preferred: true },
            { start: '19:00', end: '22:00', available: true, preferred: false }
          ]
        },
        {
          date: '2023-06-16',
          timeSlots: [
            { start: '10:00', end: '12:00', available: true, preferred: false },
            { start: '14:00', end: '18:00', available: true, preferred: true }
          ]
        }
      ]
    }
  ];

  const recommendations: MeetingRecommendation[] = [
    {
      id: '1',
      date: '2023-06-15',
      time: '15:00',
      duration: 60,
      participantsAvailable: 3,
      totalParticipants: 3,
      confidence: 95,
      conflicts: [],
      timezone: 'UTC'
    },
    {
      id: '2',
      date: '2023-06-15',
      time: '16:00',
      duration: 90,
      participantsAvailable: 2,
      totalParticipants: 3,
      confidence: 75,
      conflicts: ['Michael Rodriguez'],
      timezone: 'UTC'
    },
    {
      id: '3',
      date: '2023-06-16',
      time: '14:00',
      duration: 60,
      participantsAvailable: 3,
      totalParticipants: 3,
      confidence: 90,
      conflicts: [],
      timezone: 'UTC'
    },
    {
      id: '4',
      date: '2023-06-16',
      time: '15:30',
      duration: 45,
      participantsAvailable: 2,
      totalParticipants: 3,
      confidence: 65,
      conflicts: ['Alex Johnson'],
      timezone: 'UTC'
    }
  ];

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];

  const getAvailabilityForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return participantAvailabilities.map(participant => ({
      ...participant,
      availability: participant.availability.filter(a => a.date === dateStr)
    }));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    return hour > 12 ? `${hour - 12}:${minutes} PM` : `${hour}:${minutes} AM`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className={`bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-5 h-5 text-orange-400" />
            Smart Meeting Scheduling
          </CardTitle>
          <Badge variant="outline" className="bg-orange-900/50 text-orange-300 border-orange-700">
            AI-Powered
          </Badge>
        </div>
        <p className="text-sm text-slate-400">
          Recommend optimal meeting times based on participant availability
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search participants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-slate-200"
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Clock className="w-4 h-4" />
                {selectedTimezone}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 bg-slate-800 border-slate-700">
              <div className="p-2">
                {timezones.map((tz) => (
                  <Button
                    key={tz}
                    variant="ghost"
                    className="w-full justify-start text-slate-200 hover:bg-slate-700"
                    onClick={() => setSelectedTimezone(tz)}
                  >
                    {tz === selectedTimezone && <Check className="w-4 h-4 mr-2 text-green-400" />}
                    {tz}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className={viewMode === 'recommendations' ? 'bg-blue-500/20 border-blue-500' : ''}
              onClick={() => setViewMode('recommendations')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Recommendations
            </Button>
            <Button 
              variant="outline" 
              className={viewMode === 'calendar' ? 'bg-blue-500/20 border-blue-500' : ''}
              onClick={() => setViewMode('calendar')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </Button>
          </div>
        </div>

        {/* Recommendations View */}
        {viewMode === 'recommendations' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-200">Recommended Meeting Times</h3>
            
            <div className="space-y-3">
              {recommendations.map((recommendation) => (
                <div 
                  key={recommendation.id} 
                  className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-orange-400" />
                        <span className="font-medium text-slate-100">
                          {format(new Date(recommendation.date), 'EEEE, MMMM d, yyyy')}
                        </span>
                        <span className="text-slate-400">at</span>
                        <span className="font-medium text-slate-100">
                          {formatTime(recommendation.time)}
                        </span>
                        <span className="text-slate-400">({recommendation.duration} min)</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span className="text-slate-300">
                            {recommendation.participantsAvailable}/{recommendation.totalParticipants} participants
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <TrendingUp className={`w-4 h-4 ${getConfidenceColor(recommendation.confidence)}`} />
                          <span className={getConfidenceColor(recommendation.confidence)}>
                            {recommendation.confidence}% confidence
                          </span>
                        </div>
                      </div>
                      
                      {recommendation.conflicts.length > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs text-yellow-300">
                            Conflicts: {recommendation.conflicts.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button size="sm" className="gap-2">
                        <Check className="w-4 h-4" />
                        Schedule
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border border-slate-700 bg-slate-800"
                classNames={{
                  months: "space-y-4",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium text-slate-200",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-slate-400 rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-slate-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-slate-200",
                  day_selected: "bg-blue-500 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-500 focus:text-white",
                  day_today: "bg-slate-700 text-white",
                  day_outside: "text-slate-500 opacity-50",
                  day_disabled: "text-slate-500 opacity-50",
                  day_range_end: "day-range-end",
                  day_hidden: "invisible",
                }}
              />
            </div>
            
            {selectedDate && (
              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-4">
                  Availability for {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getAvailabilityForDate(selectedDate).map((participant) => (
                    <div 
                      key={participant.id} 
                      className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-100">{participant.name}</h4>
                          <p className="text-xs text-slate-400">{participant.timezone}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {participant.availability.length > 0 ? (
                          participant.availability[0].timeSlots.map((slot, idx) => (
                            <div 
                              key={idx} 
                              className={`p-2 rounded text-sm ${
                                slot.available 
                                  ? slot.preferred 
                                    ? 'bg-green-900/30 border border-green-800/50' 
                                    : 'bg-slate-700/50 border border-slate-600'
                                  : 'bg-red-900/20 border border-red-800/50 opacity-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-slate-200">
                                  {formatTime(slot.start)} - {formatTime(slot.end)}
                                </span>
                                {slot.preferred && (
                                  <Badge variant="outline" className="text-xs bg-green-900/50 border-green-700 text-green-300">
                                    Preferred
                                  </Badge>
                                )}
                                {slot.available ? (
                                  <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                  <X className="w-4 h-4 text-red-400" />
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-slate-500">
                            No availability data
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scheduling Insights */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h3 className="font-medium text-slate-300 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            Scheduling Insights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-300">Best Time Slot</span>
              </div>
              <p className="text-xs text-slate-300">
                June 15, 15:00 UTC - All participants available
              </p>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">Average Availability</span>
              </div>
              <p className="text-xs text-slate-300">
                85% of participants available for recommended times
              </p>
            </div>
            
            <div className="bg-purple-900/20 border border-purple-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">Meeting Duration</span>
              </div>
              <p className="text-xs text-slate-300">
                Recommended 60-minute meetings for optimal engagement
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};