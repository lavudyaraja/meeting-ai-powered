import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  Mic,
  MonitorUp,
  MoreVertical,
  Sparkles,
  TrendingUp,
  FileText,
  Play
} from "lucide-react";

const upcomingMeetings = [
  {
    title: "Q4 Strategy Review",
    time: "2:00 PM",
    duration: "1h",
    participants: 8,
    status: "upcoming"
  },
  {
    title: "Product Design Sync",
    time: "3:30 PM", 
    duration: "30m",
    participants: 5,
    status: "upcoming"
  },
  {
    title: "Engineering Standup",
    time: "Tomorrow 9:00 AM",
    duration: "15m",
    participants: 12,
    status: "scheduled"
  }
];

const aiInsights = [
  { text: "Meeting prep complete - All documents ready", icon: FileText },
  { text: "3 action items from last meeting pending", icon: TrendingUp },
  { text: "Suggested agenda items detected from emails", icon: Sparkles }
];

const VideoConferencingLanding = () => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(to right, rgba(100, 116, 139, 0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(100, 116, 139, 0.1) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      </div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-block animate-bounce" style={{ animationDuration: '2s' }}>
            <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-4 py-1.5 text-sm font-medium">
              ✨ Interactive Demo
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Meet Smarter with{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI-Powered
            </span>
            {" "}Video
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Transform your meetings with intelligent transcription, real-time insights, and seamless collaboration
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 border-0">
              Start Free Trial
            </Button>
            <Button className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white px-8 py-6 text-lg transition-all duration-300 hover:scale-105">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Main Dashboard Demo */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Conference Preview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800 p-8 transition-all duration-500 hover:bg-slate-900/70 hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="aspect-video bg-slate-950 rounded-2xl mb-6 relative overflow-hidden border border-slate-800 group">
                {/* Demo Video */}
                <video 
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                >
                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                </video>
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/60 group-hover:from-slate-900/70 transition-all duration-300"></div>
                
                {/* Live Recording Badge */}
                <div className="absolute top-4 left-4 animate-slide-right">
                  <Badge className="bg-red-500/90 text-white border-0 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    LIVE
                  </Badge>
                </div>

                {/* AI Assistant Badge */}
                <div className="absolute top-4 right-4 animate-slide-left">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                    🤖 AI Transcribing
                  </Badge>
                </div>

                {/* Participant Grid */}
                <div className="absolute bottom-4 left-4 flex -space-x-2 animate-slide-up">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 border-2 border-slate-900 flex items-center justify-center text-xs text-white font-medium transition-transform duration-300 hover:scale-110 hover:z-10"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs text-slate-400">
                    +8
                  </div>
                </div>

                {/* Real-time Transcription Preview */}
                <div className="absolute bottom-4 right-4 max-w-md animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <div className="bg-slate-900/95 backdrop-blur-sm rounded-lg p-3 border border-slate-700 text-xs text-slate-300">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                      <span className="font-medium text-blue-400">Live Transcription</span>
                    </div>
                    <p className="opacity-75">"Let's review the Q4 roadmap..."</p>
                  </div>
                </div>
              </div>
              
              {/* Meeting Controls */}
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <Button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                    <Mic className="w-5 h-5" />
                  </Button>
                  <Button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                    <MonitorUp className="w-5 h-5" />
                  </Button>
                </div>
                
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 border-0">
                  Join Demo Meeting
                </Button>
              </div>
            </Card>
            
            {/* AI Insights Panel */}
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800 p-6 transition-all duration-500 hover:bg-slate-900/70 hover:border-slate-700 hover:shadow-2xl hover:shadow-purple-500/10">
              <h3 className="text-lg font-semibold mb-5 flex items-center gap-2 text-white">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                AI Insights & Suggestions
                <Badge className="ml-auto bg-blue-500/20 text-blue-300 border-0 text-xs">Real-time</Badge>
              </h3>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => {
                  const Icon = insight.icon;
                  return (
                    <div 
                      key={index} 
                      className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 transition-all duration-300 hover:bg-slate-800 hover:border-slate-600 hover:translate-x-1 group cursor-pointer"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <Icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-sm text-slate-300 leading-relaxed pt-2">{insight.text}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
          
          {/* Sidebar - Upcoming & Quick Actions */}
          <div className="space-y-6">
            {/* Upcoming Meetings */}
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800 p-6 transition-all duration-500 hover:bg-slate-900/70 hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/10">
              <h3 className="text-lg font-semibold mb-5 flex items-center gap-2 text-white">
                <Calendar className="w-5 h-5 text-blue-400" />
                Today's Schedule
                <Badge className="ml-auto bg-slate-800 text-slate-300 border-0 text-xs">{upcomingMeetings.length}</Badge>
              </h3>
              <div className="space-y-4">
                {upcomingMeetings.map((meeting, index) => (
                  <div 
                    key={index} 
                    className="space-y-3 pb-4 border-b border-slate-800 last:border-0 last:pb-0 transition-all duration-300 hover:translate-x-1 group cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors">{meeting.title}</h4>
                      <Button variant="ghost" className="h-6 w-6 text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all duration-300">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {meeting.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {meeting.participants}
                      </span>
                    </div>
                    {index === 0 && (
                      <Badge className="bg-blue-500/20 text-blue-300 border-0 text-xs animate-pulse">
                        Starting in 15 min
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Quick Actions */}
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800 p-6 transition-all duration-500 hover:bg-slate-900/70 hover:border-slate-700 hover:shadow-2xl hover:shadow-purple-500/10">
              <h3 className="text-lg font-semibold mb-5 text-white">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition-all duration-300 hover:translate-x-1 hover:shadow-lg hover:shadow-blue-500/20">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule New Meeting
                </Button>
                <Button className="w-full justify-start bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition-all duration-300 hover:translate-x-1 hover:shadow-lg hover:shadow-purple-500/20">
                  <Video className="w-4 h-4 mr-2" />
                  Start Instant Call
                </Button>
                <Button className="w-full justify-start bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/30 text-blue-300 transition-all duration-300 hover:translate-x-1 hover:shadow-lg hover:shadow-blue-500/30">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Meeting Planner
                </Button>
              </div>
            </Card>

            {/* Stats Card */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border-blue-500/30 p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">This Week</span>
                  <TrendingUp className="w-4 h-4 text-green-400 animate-bounce" style={{ animationDuration: '2s' }} />
                </div>
                <div>
                  <div className="text-4xl font-bold text-white">24</div>
                  <div className="text-sm text-slate-400 mt-1">Hours saved with AI</div>
                </div>
                <div className="pt-4 border-t border-slate-700/50">
                  <div className="text-sm text-slate-300">
                    <span className="text-green-400 font-semibold">+35%</span> team productivity
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-8 px-8 py-4 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-full">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-slate-300">AI-Powered Transcription</span>
            </div>
            <div className="w-px h-6 bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-sm text-slate-300">Real-time Insights</span>
            </div>
            <div className="w-px h-6 bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="text-sm text-slate-300">Smart Scheduling</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-right {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-left {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-slide-right {
          animation: slide-right 0.6s ease-out;
        }

        .animate-slide-left {
          animation: slide-left 0.6s ease-out;
        }
      `}</style>
    </section>
  );
};

export default VideoConferencingLanding;