import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, TrendingUp, Users, Video, Sparkles, Brain, Zap, Target, MessageSquare, BarChart2, AlertCircle, Star, FileText, Mic, Play, ArrowUpRight, TrendingDown, Presentation, BookOpen, Activity, Headphones, Hash, Bell, Search, Filter, Download, Share2, Settings, ChevronRight, PieChart, Globe, Shield, Workflow, Database, Code, Rocket } from "lucide-react";

const DashboardOverview = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      label: "Today's Meetings",
      value: "8",
      icon: Calendar,
      trend: "+12%",
      isPositive: true,
      color: "blue",
      subtext: "3 upcoming",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      label: "Completed Tasks",
      value: "24",
      icon: CheckCircle,
      trend: "+18%",
      isPositive: true,
      color: "emerald",
      subtext: "6 in progress",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200"
    },
    {
      label: "Hours Saved",
      value: "12.5",
      icon: Clock,
      trend: "+45%",
      isPositive: true,
      color: "purple",
      subtext: "This week",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      borderColor: "border-purple-200"
    },
    {
      label: "Team Members",
      value: "32",
      icon: Users,
      trend: "+5",
      isPositive: true,
      color: "orange",
      subtext: "8 active now",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      borderColor: "border-orange-200"
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
      category: "Strategy",
      color: "red"
    },
    {
      id: 2,
      title: "Design System Updates",
      time: "2:00 PM - 2:45 PM",
      participants: 5,
      aiInsight: "Optimal timing detected",
      hasRecording: false,
      priority: "medium",
      category: "Design",
      color: "blue"
    },
    {
      id: 3,
      title: "Sprint Planning Session",
      time: "4:00 PM - 5:00 PM",
      participants: 12,
      aiInsight: "Peak productivity window",
      hasRecording: true,
      priority: "high",
      category: "Development",
      color: "emerald"
    }
  ];

  const aiFeatures = [
    {
      icon: Brain,
      title: "Smart Summaries",
      description: "AI-generated meeting notes with actionable insights",
      color: "purple",
      stats: "28 generated",
      percentage: "98%",
      trend: "+15%"
    },
    {
      icon: Mic,
      title: "Live Transcription",
      description: "Real-time speech-to-text with speaker identification",
      color: "blue",
      stats: "99% accuracy",
      percentage: "100%",
      trend: "+2%"
    },
    {
      icon: Target,
      title: "Action Extraction",
      description: "Automatically detect and assign tasks from discussions",
      color: "emerald",
      stats: "47 extracted",
      percentage: "92%",
      trend: "+8%"
    },
    {
      icon: BarChart2,
      title: "Analytics Engine",
      description: "Comprehensive metrics and participation tracking",
      color: "orange",
      stats: "Real-time data",
      percentage: "95%",
      trend: "+12%"
    }
  ];

  const insights = [
    {
      icon: TrendingUp,
      title: "Productivity Increased 45%",
      description: "Meetings are 15 minutes shorter on average",
      color: "emerald",
      impact: "positive"
    },
    {
      icon: AlertCircle,
      title: "5 Priority Items",
      description: "High-priority tasks requiring immediate attention",
      color: "red",
      impact: "warning"
    },
    {
      icon: Star,
      title: "Optimal Schedule Detected",
      description: "Best meeting slot: Tomorrow 9 AM (87% team availability)",
      color: "blue",
      impact: "info"
    },
    {
      icon: Activity,
      title: "Peak Performance Hours",
      description: "Team most productive 9 AM - 11 AM daily",
      color: "purple",
      impact: "positive"
    }
  ];

  const recentActivity = [
    { type: "meeting", text: "Quarterly Review completed with 12 action items", time: "45 min ago", icon: Video, color: "blue" },
    { type: "task", text: "Design sprint tasks distributed to 6 team members", time: "1 hour ago", icon: CheckCircle, color: "emerald" },
    { type: "summary", text: "AI summary generated for Engineering Sync", time: "2 hours ago", icon: FileText, color: "purple" },
    { type: "alert", text: "Schedule conflict resolved automatically", time: "3 hours ago", icon: AlertCircle, color: "orange" }
  ];

  const advancedFeatures = [
    {
      icon: Mic,
      title: "Speaker Diarization",
      description: "Identify individual speakers throughout conversations",
      color: "blue",
      badge: "AI"
    },
    {
      icon: Activity,
      title: "Sentiment Analysis",
      description: "Track emotional tone and engagement levels",
      color: "purple",
      badge: "AI"
    },
    {
      icon: Hash,
      title: "Topic Clustering",
      description: "Automatically categorize discussion themes",
      color: "emerald",
      badge: "AI"
    },
    {
      icon: PieChart,
      title: "Participation Metrics",
      description: "Measure individual and team contribution",
      color: "orange",
      badge: "Analytics"
    },
    {
      icon: Workflow,
      title: "Workflow Automation",
      description: "Trigger actions based on meeting outcomes",
      color: "red",
      badge: "Pro"
    },
    {
      icon: Globe,
      title: "Multi-language Support",
      description: "Transcribe and translate in 50+ languages",
      color: "blue",
      badge: "Global"
    },
    {
      icon: Shield,
      title: "Compliance & Security",
      description: "Enterprise-grade encryption and audit logs",
      color: "slate",
      badge: "Security"
    },
    {
      icon: Database,
      title: "Data Integration",
      description: "Connect with CRM, PM tools, and databases",
      color: "purple",
      badge: "Integration"
    }
  ];

  const newFeatures = [
    {
      icon: Code,
      title: "API Access",
      description: "Build custom integrations with our REST API",
      color: "blue",
      status: "New"
    },
    {
      icon: Rocket,
      title: "Meeting Rooms",
      description: "Virtual spaces with persistent history",
      color: "purple",
      status: "Beta"
    },
    {
      icon: Brain,
      title: "AI Coach",
      description: "Personal assistant for meeting preparation",
      color: "emerald",
      status: "New"
    },
    {
      icon: Share2,
      title: "Team Collaboration",
      description: "Real-time co-editing and annotations",
      color: "orange",
      status: "Coming Soon"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MeetingAI</h1>
                <p className="text-xs text-gray-500">Professional Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                JD
              </div>
            </div>
          </div>
        </div>
      </header> */}

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
              <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-gray-700">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium">
                <Play className="w-4 h-4" />
                Start Meeting
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.isPositive ? ArrowUpRight : TrendingDown;
            
            return (
              <div
                key={index}
                className={`bg-white border ${stat.borderColor} rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                    stat.isPositive 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'bg-red-50 text-red-600'
                  }`}>
                    <TrendIcon className="w-3 h-3" />
                    <span className="text-xs font-semibold">{stat.trend}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.subtext}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Meetings */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Today's Schedule</h3>
                  <p className="text-sm text-gray-600">AI-optimized meeting lineup</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            meeting.priority === 'high' 
                              ? 'bg-red-50 text-red-600' 
                              : 'bg-blue-50 text-blue-600'
                          }`}>
                            {meeting.priority.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {meeting.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {meeting.participants} people
                          </span>
                        </div>
                      </div>
                      {meeting.hasRecording && (
                        <div className="bg-blue-50 rounded-lg p-2">
                          <Video className="w-5 h-5 text-blue-600" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 bg-purple-50 rounded-lg px-3 py-1.5">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-medium text-purple-700">{meeting.aiInsight}</span>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        Join
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {aiFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    <div className={`w-12 h-12 bg-${feature.color}-50 rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 text-${feature.color}-600`} />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600 font-medium">{feature.stats}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">{feature.percentage}</span>
                        <span className="text-xs text-emerald-600 font-medium">{feature.trend}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Advanced Features */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Advanced Features</h3>
                  <p className="text-sm text-gray-600">Enterprise-grade capabilities</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {advancedFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 bg-${feature.color}-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-5 h-5 text-${feature.color}-600`} />
                        </div>
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {feature.badge}
                        </span>
                      </div>
                      <h5 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h5>
                      <p className="text-xs text-gray-600">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* AI Insights */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">AI Insights</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs text-gray-600">Live</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {insights.map((insight, index) => {
                  const Icon = insight.icon;
                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 text-${insight.color}-600 mt-0.5 flex-shrink-0`} />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm mb-1">{insight.title}</p>
                          <p className="text-xs text-gray-600">{insight.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className={`w-9 h-9 bg-${activity.color}-50 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 text-${activity.color}-600`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* New Features */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">What's New</h3>
              </div>

              <div className="space-y-3">
                {newFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 bg-${feature.color}-50 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 text-${feature.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold text-gray-900 text-sm">{feature.title}</h5>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                              feature.status === 'New' ? 'bg-emerald-100 text-emerald-700' :
                              feature.status === 'Beta' ? 'bg-blue-100 text-blue-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {feature.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;