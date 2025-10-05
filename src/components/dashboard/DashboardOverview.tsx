import { Calendar, Clock, CheckCircle, TrendingUp, Users, Video, Sparkles, Brain, Zap, Target, MessageSquare, BarChart2, AlertCircle, Star, FileText, Mic, Play } from "lucide-react";

const stats = [
  {
    label: "Meetings Today",
    value: "4",
    icon: Calendar,
    trend: "+12%",
    color: "from-cyan-400 to-blue-500",
    bgGradient: "from-cyan-500/20 via-blue-500/15 to-cyan-600/10",
    borderColor: "border-cyan-400/40",
    subtext: "2 upcoming"
  },
  {
    label: "Active Tasks",
    value: "12",
    icon: CheckCircle,
    trend: "-8%",
    color: "from-emerald-400 to-green-500",
    bgGradient: "from-emerald-500/20 via-green-500/15 to-emerald-600/10",
    borderColor: "border-emerald-400/40",
    subtext: "3 overdue"
  },
  {
    label: "Hours Saved",
    value: "8.5",
    icon: Clock,
    trend: "+45%",
    color: "from-orange-400 to-red-500",
    bgGradient: "from-orange-500/20 via-red-500/15 to-orange-600/10",
    borderColor: "border-orange-400/40",
    subtext: "This week"
  },
  {
    label: "Team Members",
    value: "24",
    icon: Users,
    trend: "+3",
    color: "from-pink-400 to-rose-500",
    bgGradient: "from-pink-500/20 via-rose-500/15 to-pink-600/10",
    borderColor: "border-pink-400/40",
    subtext: "5 active now"
  }
];

const upcomingMeetings = [
  {
    title: "Product Strategy Review",
    time: "10:00 AM - 11:00 AM",
    participants: 8,
    aiInsight: "High engagement expected",
    priority: "high",
    hasRecording: true
  },
  {
    title: "Design System Updates",
    time: "2:00 PM - 2:45 PM",
    participants: 5,
    aiInsight: "Perfect timing for team",
    priority: "medium",
    hasRecording: false
  },
  {
    title: "Sprint Planning",
    time: "4:00 PM - 5:00 PM",
    participants: 12,
    aiInsight: "Consider rescheduling",
    priority: "low",
    hasRecording: true
  }
];

const aiFeatures = [
  {
    icon: Brain,
    title: "Smart Summaries",
    description: "AI-generated meeting summaries with key points",
    color: "from-violet-400 to-purple-500",
    bgColor: "from-violet-500/15 to-purple-500/10",
    borderColor: "border-violet-400/40",
    stats: "15 created today"
  },
  {
    icon: Mic,
    title: "Live Transcription",
    description: "Real-time speech-to-text with speaker detection",
    color: "from-fuchsia-400 to-pink-500",
    bgColor: "from-fuchsia-500/15 to-pink-500/10",
    borderColor: "border-fuchsia-400/40",
    stats: "98% accuracy"
  },
  {
    icon: Target,
    title: "Action Items",
    description: "Automatically extract and assign tasks",
    color: "from-teal-400 to-cyan-500",
    bgColor: "from-teal-500/15 to-cyan-500/10",
    borderColor: "border-teal-400/40",
    stats: "23 extracted"
  },
  {
    icon: Sparkles,
    title: "Smart Scheduling",
    description: "AI finds the best time for everyone",
    color: "from-amber-400 to-orange-500",
    bgColor: "from-amber-500/15 to-orange-500/10",
    borderColor: "border-amber-400/40",
    stats: "5 suggestions"
  }
];

const recentActivity = [
  { type: "meeting", text: "Product Strategy Review completed", time: "2 hours ago", icon: Video },
  { type: "task", text: "5 new action items assigned", time: "3 hours ago", icon: CheckCircle },
  { type: "summary", text: "AI summary generated for Design Sync", time: "4 hours ago", icon: FileText },
  { type: "alert", text: "Meeting conflict detected - resolved", time: "5 hours ago", icon: AlertCircle }
];

const DashboardOverview = () => {
  return (
    // Updated background with grid and gradient
    <div className="min-h-screen ">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.15) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(59, 130, 246, 0.15) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }}></div>
      
      <div className="">
        <div className="space-y-8 max-w-[1600px] mx-auto p-8">
          {/* Header with AI Status */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="space-y-3">
                <h2 className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  Dashboard
                </h2>
                <p className="text-cyan-300 text-xl font-semibold tracking-wide">Welcome back! Here's your AI-powered overview.</p>
              </div>
              <div className="flex items-center gap-4 bg-slate-900/80 rounded-3xl px-8 py-4">
                <Sparkles className="w-7 h-7 text-cyan-400 animate-pulse" />
                <span className="text-cyan-200 font-black text-xl tracking-wide">AI Assistant Active</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const isPositive = stat.trend.startsWith('+');
              
              return (
                // Removed border and added hover border effect
                <div
                  key={index}
                  className={`bg-slate-900/80 backdrop-blur-xl rounded-3xl p-7 transition-all duration-300 cursor-pointer hover:scale-105 hover:border hover:border-cyan-400/70`}
                  style={{
                    animation: `slideUp 0.7s ease-out ${index * 0.15}s both`
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <span className={`text-lg font-black px-4 py-2.5 rounded-2xl ${
                      isPositive 
                        ? 'bg-gradient-to-r from-emerald-500/40 to-teal-500/40 text-emerald-300' 
                        : 'bg-gradient-to-r from-rose-500/40 to-red-500/40 text-rose-300'
                    }`}>
                      {stat.trend}
                    </span>
                  </div>
                  <div className="text-6xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">
                    {stat.value}
                  </div>
                  <div className="text-lg text-slate-300 font-bold mb-2">{stat.label}</div>
                  <div className="text-sm text-slate-400 font-semibold">{stat.subtext}</div>
                </div>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Upcoming Meetings */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Meetings */}
              {/* Removed border and added hover border effect */}
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 transition-all duration-300 hover:border hover:border-cyan-400/70">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                      Upcoming Meetings
                    </h3>
                    <p className="text-cyan-300 text-lg font-semibold">AI-optimized schedule for today</p>
                  </div>
                  <Calendar className="w-10 h-10 text-cyan-400" />
                </div>

                <div className="space-y-5">
                  {upcomingMeetings.map((meeting, index) => (
                    // Removed border and added hover border effect
                    <div
                      key={index}
                      className={`bg-slate-800/50 rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border hover:border-cyan-400/60`}
                    >
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex-1">
                          <h4 className="text-slate-100 font-bold text-xl mb-3 hover:text-cyan-300 transition-colors">
                            {meeting.title}
                          </h4>
                          <div className="flex items-center gap-6 text-base text-slate-400 font-semibold">
                            <span className="flex items-center gap-2">
                              <Clock className="w-5 h-5" />
                              {meeting.time}
                            </span>
                            <span className="flex items-center gap-2">
                              <Users className="w-5 h-5" />
                              {meeting.participants} people
                            </span>
                          </div>
                        </div>
                        {meeting.hasRecording && (
                          <div className="bg-cyan-500/20 rounded-xl p-3 hover:scale-110 transition-transform duration-300">
                            <Video className="w-6 h-6 text-cyan-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl px-5 py-3">
                        <Sparkles className="w-5 h-5 text-cyan-400" />
                        <span className="text-base text-cyan-200 font-bold">{meeting.aiInsight}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xl py-5 rounded-2xl transition-all duration-300 hover:scale-[1.02]">
                  Schedule New Meeting
                </button>
              </div>

              {/* AI Features Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {aiFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    // Removed border and added hover border effect
                    <div
                      key={index}
                      className={`bg-slate-900/80 backdrop-blur-xl rounded-3xl p-7 transition-all duration-300 cursor-pointer hover:scale-105 hover:border hover:border-violet-400/70`}
                    >
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-slate-100 font-bold text-xl mb-3 hover:text-cyan-300 transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-base text-slate-400 mb-5 font-medium">{feature.description}</p>
                      <div className="flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-cyan-400" />
                        <span className="text-sm text-cyan-300 font-bold">{feature.stats}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column - AI Insights & Activity */}
            <div className="space-y-8">
              {/* AI Insights */}
              {/* Removed border and added hover border effect */}
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-7 transition-all duration-300 hover:border hover:border-violet-400/70">
                <div className="flex items-start justify-between mb-7">
                  <div>
                    <h3 className="text-3xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-3">
                      AI Insights
                    </h3>
                    <div className="flex items-center gap-2 text-base text-violet-300 font-semibold">
                      <span className="w-3 h-3 rounded-full bg-violet-400 animate-pulse"></span>
                      <span>Real-time analysis</span>
                    </div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-violet-400" />
                </div>

                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-slate-800/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border hover:border-emerald-400/80">
                    <div className="flex items-start gap-4 mb-2">
                      <Zap className="w-7 h-7 text-emerald-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-lg font-bold text-slate-100 mb-2 hover:text-emerald-300 transition-colors">
                          Meeting Efficiency Up 45%
                        </p>
                        <p className="text-base text-slate-400 font-medium">
                          Your meetings are 12 minutes shorter on average this week
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-800/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border hover:border-rose-400/80">
                    <div className="flex items-start gap-4 mb-2">
                      <AlertCircle className="w-7 h-7 text-rose-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-lg font-bold text-slate-100 mb-2 hover:text-rose-300 transition-colors">
                          3 Tasks Need Attention
                        </p>
                        <p className="text-base text-slate-400 font-medium">
                          High-priority items due within 24 hours
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-800/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border hover:border-blue-400/80">
                    <div className="flex items-start gap-4 mb-2">
                      <Star className="w-7 h-7 text-blue-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-lg font-bold text-slate-100 mb-2 hover:text-blue-300 transition-colors">
                          Optimal Schedule Found
                        </p>
                        <p className="text-base text-slate-400 font-medium">
                          Best meeting time: Tomorrow 10 AM - 92% team availability
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              {/* Removed border and added hover border effect */}
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-7 transition-all duration-300 hover:border hover:border-orange-400/70">
                <h3 className="text-3xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-6">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      // Removed border and added hover border effect
                      <div
                        key={index}
                        className="flex items-start gap-4 p-5 rounded-xl bg-slate-800/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border hover:border-orange-400/60"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400/30 to-red-400/30 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-orange-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base text-slate-100 font-bold hover:text-orange-300 transition-colors">
                            {activity.text}
                          </p>
                          <p className="text-sm text-slate-400 mt-1.5 font-medium">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              {/* Removed border and added hover border effect */}
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-7 transition-all duration-300 hover:border hover:border-teal-400/70">
                <h3 className="text-3xl font-black bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-6">
                  Quick Actions
                </h3>
                <div className="space-y-4">
                  <button className="w-full flex items-center gap-4 bg-gradient-to-r from-cyan-500/40 to-blue-500/40 hover:from-cyan-400/50 hover:to-blue-400/50 text-cyan-200 font-black py-5 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02]">
                    <Play className="w-7 h-7" />
                    Start Instant Meeting
                  </button>
                  <button className="w-full flex items-center gap-4 bg-gradient-to-r from-fuchsia-500/40 to-pink-500/40 hover:from-fuchsia-400/50 hover:to-pink-400/50 text-fuchsia-200 font-black py-5 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02]">
                    <MessageSquare className="w-7 h-7" />
                    Ask AI Assistant
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom spacing for scroll */}
          <div className="h-8"></div>

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

            /* Custom scrollbar */
            .overflow-y-auto::-webkit-scrollbar {
              width: 8px;
            }

            .overflow-y-auto::-webkit-scrollbar-track {
              background: rgba(15, 23, 42, 0.5);
              border-radius: 10px;
            }

            .overflow-y-auto::-webkit-scrollbar-thumb {
              background: linear-gradient(to bottom, rgb(34, 211, 238), rgb(59, 130, 246));
              border-radius: 10px;
            }

            .overflow-y-auto::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(to bottom, rgb(6, 182, 212), rgb(37, 99, 235));
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;