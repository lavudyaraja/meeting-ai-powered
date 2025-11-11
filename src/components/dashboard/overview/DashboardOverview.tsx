import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, TrendingUp, Users, Video, Sparkles, Brain, Zap, Target, MessageSquare, BarChart2, AlertCircle, Star, FileText, Mic, Play, ArrowUpRight, TrendingDown, Presentation, BookOpen, Activity, Headphones, Menu } from "lucide-react";

const DashboardOverview = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      label: "Meetings Today",
      value: "4",
      icon: Calendar,
      trend: "+12%",
      isPositive: true,
      color: "from-cyan-500 to-blue-600",
      subtext: "2 upcoming"
    },
    {
      label: "Active Tasks",
      value: "12",
      icon: CheckCircle,
      trend: "-8%",
      isPositive: false,
      color: "from-emerald-500 to-teal-600",
      subtext: "3 overdue"
    },
    {
      label: "Hours Saved",
      value: "8.5",
      icon: Clock,
      trend: "+45%",
      isPositive: true,
      color: "from-violet-500 to-purple-600",
      subtext: "This week"
    },
    {
      label: "Team Members",
      value: "24",
      icon: Users,
      trend: "+3",
      isPositive: true,
      color: "from-fuchsia-500 to-pink-600",
      subtext: "5 active now"
    }
  ];

  const upcomingMeetings = [
    {
      id: 1,
      title: "Product Strategy Review",
      time: "10:00 AM - 11:30 AM",
      participants: 8,
      aiInsight: "High engagement expected",
      hasRecording: true,
      priority: "high",
      category: "Strategy"
    },
    {
      id: 2,
      title: "Design System Updates",
      time: "2:00 PM - 2:45 PM",
      participants: 5,
      aiInsight: "Optimal timing",
      hasRecording: false,
      priority: "medium",
      category: "Design"
    },
    {
      id: 3,
      title: "Sprint Planning",
      time: "4:00 PM - 5:00 PM",
      participants: 12,
      aiInsight: "Consider rescheduling",
      hasRecording: true,
      priority: "high",
      category: "Development"
    }
  ];

  const aiFeatures = [
    {
      icon: Brain,
      title: "Smart Summaries",
      description: "AI-generated meeting summaries with key points",
      color: "from-violet-500 to-purple-600",
      stats: "15 created today",
      percentage: "98%"
    },
    {
      icon: Mic,
      title: "Live Transcription",
      description: "Real-time speech-to-text with speaker detection",
      color: "from-fuchsia-500 to-pink-600",
      stats: "98% accuracy",
      percentage: "100%"
    },
    {
      icon: Target,
      title: "Action Items",
      description: "Automatically extract and assign tasks",
      color: "from-teal-500 to-cyan-600",
      stats: "23 extracted",
      percentage: "85%"
    },
    {
      icon: Presentation,
      title: "Meeting Analytics",
      description: "Track engagement and participation metrics",
      color: "from-orange-500 to-red-600",
      stats: "Real-time data",
      percentage: "92%"
    }
  ];

  const insights = [
    {
      icon: Zap,
      title: "Meeting Efficiency Up 45%",
      description: "Your meetings are 12 minutes shorter on average this week",
      color: "emerald",
      impact: "positive"
    },
    {
      icon: AlertCircle,
      title: "3 Tasks Need Attention",
      description: "High-priority items due within 24 hours",
      color: "rose",
      impact: "warning"
    },
    {
      icon: Star,
      title: "Optimal Schedule Found",
      description: "Best meeting time: Tomorrow 10 AM - high availability",
      color: "blue",
      impact: "info"
    },
    {
      icon: Activity,
      title: "Productivity Peak",
      description: "Most active between 10 AM - 12 PM",
      color: "violet",
      impact: "positive"
    }
  ];

  const recentActivity = [
    { type: "meeting", text: "Product Strategy Review completed", time: "2 hours ago", icon: Video, color: "cyan" },
    { type: "task", text: "5 new action items assigned", time: "3 hours ago", icon: CheckCircle, color: "emerald" },
    { type: "summary", text: "AI summary generated for Design Sync", time: "4 hours ago", icon: FileText, color: "violet" },
    { type: "alert", text: "Meeting conflict detected - resolved", time: "5 hours ago", icon: AlertCircle, color: "rose" }
  ];

  const quickActions = [
    { icon: Play, label: "Start Meeting", color: "from-cyan-500 to-blue-600" },
    { icon: MessageSquare, label: "Ask AI", color: "from-fuchsia-500 to-pink-600" },
    { icon: BookOpen, label: "Transcripts", color: "from-violet-500 to-purple-600" },
    { icon: Headphones, label: "Audio Only", color: "from-teal-500 to-cyan-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>



      <div className="relative z-10 max-w-[1800px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <div className="px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm">
                <span className="text-emerald-400 font-bold text-xs sm:text-sm">LIVE</span>
              </div>
            </div>
            <p className="text-cyan-300/80 text-sm sm:text-lg lg:text-xl font-medium">AI-powered insights at your fingertips</p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 sm:gap-3 bg-slate-900/60 backdrop-blur-xl rounded-xl sm:rounded-2xl px-3 py-2 sm:px-6 sm:py-4 shadow-lg shadow-cyan-500/10">
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-cyan-400 animate-pulse" />
              <span className="text-cyan-300 font-bold text-sm sm:text-lg">AI Active</span>
            </div>
            <button className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 hover:from-violet-500/30 hover:to-fuchsia-500/30 transition-all duration-300 backdrop-blur-xl shadow-lg shadow-violet-500/10">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" />
            </button>
          </div>
        </div>

        {/* Stats Grid - Now 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.isPositive ? ArrowUpRight : TrendingDown;
            
            return (
              <div
                key={index}
                className="group relative bg-slate-900/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition-all duration-500 hover:scale-105 hover:bg-slate-900/60 cursor-pointer overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className={`w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl ${
                      stat.isPositive 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      <TrendIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-bold">{stat.trend}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-slate-400 font-semibold text-sm sm:text-base lg:text-lg">{stat.label}</div>
                    <div className="text-slate-500 text-xs sm:text-sm font-medium">{stat.subtext}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content - Stacked on mobile, side-by-side on desktop */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Full width on mobile */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Upcoming Meetings */}
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:bg-slate-900/60 transition-all duration-300">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1 sm:mb-2">
                    Today's Meetings
                  </h2>
                  <p className="text-cyan-300/70 text-sm sm:text-base lg:text-lg font-medium">AI-optimized schedule</p>
                </div>
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-cyan-400" />
              </div>

              <div className="space-y-3 sm:space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="group relative bg-slate-800/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-slate-800/60 transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
                            <h3 className="text-slate-100 font-bold text-base sm:text-lg lg:text-xl group-hover:text-cyan-300 transition-colors truncate">
                              {meeting.title}
                            </h3>
                            <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                              meeting.priority === 'high' 
                                ? 'bg-rose-500/20 text-rose-400' 
                                : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {meeting.priority.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-slate-400 font-medium text-sm">
                            <span className="flex items-center gap-2">
                              <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                              <span className="truncate">{meeting.time}</span>
                            </span>
                            <span className="flex items-center gap-2">
                              <Users className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                              {meeting.participants} people
                            </span>
                          </div>
                        </div>
                        {meeting.hasRecording && (
                          <div className="bg-cyan-500/20 rounded-lg sm:rounded-xl p-2 sm:p-3 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                            <Video className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-cyan-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mt-4 pt-4 border-t border-slate-700/50">
                        <div className="flex items-center gap-2 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-lg sm:rounded-xl px-3 py-2 flex-1 sm:flex-initial">
                          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-violet-400 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-violet-300 font-bold truncate">{meeting.aiInsight}</span>
                        </div>
                        <button className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/20 text-sm sm:text-base">
                          Join
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm sm:text-base lg:text-lg py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-cyan-500/20">
                Schedule New Meeting
              </button>
            </div>

            {/* AI Features Grid - 2 columns on all screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {aiFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-slate-900/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:bg-slate-900/60 transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    <div className="relative z-10">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <h3 className="text-slate-100 font-bold text-lg sm:text-xl mb-2 group-hover:text-cyan-300 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 mb-3 sm:mb-4 font-medium text-sm sm:text-base">{feature.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BarChart2 className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs sm:text-sm text-cyan-300 font-bold">{feature.stats}</span>
                        </div>
                        <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                          {feature.percentage}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Full width on mobile */}
          <div className="space-y-6 lg:space-y-8">
            {/* AI Insights */}
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:bg-slate-900/60 transition-all duration-300">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-1 sm:mb-2">
                    AI Insights
                  </h2>
                  <div className="flex items-center gap-2 text-violet-300 font-medium">
                    <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
                    <span className="text-xs sm:text-sm">Real-time</span>
                  </div>
                </div>
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-violet-400" />
              </div>

              <div className="space-y-2 sm:space-y-3">
                {insights.map((insight, index) => {
                  const Icon = insight.icon;
                  return (
                    <div
                      key={index}
                      className="group p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-800/40 hover:bg-slate-800/60 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${insight.color}-400 flex-shrink-0 mt-0.5 sm:mt-1 group-hover:scale-110 transition-transform duration-300`} />
                        <div className="min-w-0">
                          <p className={`text-slate-100 font-bold mb-1 text-sm sm:text-base group-hover:text-${insight.color}-300 transition-colors`}>
                            {insight.title}
                          </p>
                          <p className="text-slate-400 text-xs sm:text-sm font-medium">
                            {insight.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:bg-slate-900/60 transition-all duration-300">
              <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-4 sm:mb-6">
                Recent Activity
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-slate-800/40 hover:bg-slate-800/60 transition-all duration-300 cursor-pointer group"
                    >
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-${activity.color}-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${activity.color}-400`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-slate-100 font-bold text-xs sm:text-sm group-hover:text-${activity.color}-300 transition-colors`}>
                          {activity.text}
                        </p>
                        <p className="text-slate-500 text-xs mt-1 font-medium">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:bg-slate-900/60 transition-all duration-300">
              <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-4 sm:mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      className="group relative flex flex-col items-center gap-2 sm:gap-3 bg-slate-800/40 hover:bg-slate-800/60 backdrop-blur-sm p-4 sm:p-5 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                      
                      <div className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${action.color} bg-opacity-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-100" />
                      </div>
                      <span className="relative z-10 text-slate-200 font-bold text-xs sm:text-sm text-center leading-tight">
                        {action.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardOverview;