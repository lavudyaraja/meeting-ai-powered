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
  Play,
  Brain,
  MessageSquare,
  CheckCircle,
  Star,
  Zap,
  Shield,
  Globe,
  ChevronRight,
  BarChart3,
  Target,
  Clipboard
} from "lucide-react";

const upcomingMeetings = [
  {
    title: "Q4 Strategy Review",
    time: "2:00 PM",
    duration: "1h",
    participants: 8,
    status: "upcoming",
    aiSummary: "Budget planning & growth targets",
    tags: ["Strategy", "Finance"]
  },
  {
    title: "Product Design Sync",
    time: "3:30 PM", 
    duration: "30m",
    participants: 5,
    status: "upcoming",
    aiSummary: "New dashboard wireframes",
    tags: ["Design", "Product"]
  },
  {
    title: "Engineering Standup",
    time: "Tomorrow 9:00 AM",
    duration: "15m",
    participants: 12,
    status: "scheduled",
    aiSummary: "Sprint progress & blockers",
    tags: ["Engineering"]
  },
  {
    title: "Client Presentation",
    time: "Tomorrow 2:00 PM",
    duration: "45m",
    participants: 6,
    status: "scheduled",
    aiSummary: "Q4 results & proposals",
    tags: ["Sales", "Client"]
  }
];

const aiInsights = [
  { text: "Meeting prep complete - All documents ready", icon: FileText, color: "blue" },
  { text: "3 action items from last meeting pending", icon: TrendingUp, color: "purple" },
  { text: "Suggested agenda items detected from emails", icon: Sparkles, color: "pink" },
  { text: "Key stakeholders confirmed attendance", icon: CheckCircle, color: "green" }
];

const aiFeatures = [
  { icon: Brain, title: "Smart Summaries", description: "AI generates meeting summaries instantly" },
  { icon: MessageSquare, title: "Live Translation", description: "Real-time translation in 40+ languages" },
  { icon: Target, title: "Action Tracking", description: "Automatic action item extraction" },
  { icon: BarChart3, title: "Analytics", description: "Meeting productivity insights" }
];

const stats = [
  { value: "10M+", label: "Meetings Powered" },
  { value: "99.9%", label: "Uptime" },
  { value: "150+", label: "Countries" },
  { value: "4.9/5", label: "User Rating" }
];

const VideoConferencingLanding = () => {
  return (
    <div className="bg-slate-950 min-h-screen">
      <section className="relative py-12 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, rgba(100, 116, 139, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(100, 116, 139, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        </div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-0 md:left-10 w-64 h-64 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-0 md:right-10 w-64 h-64 md:w-96 md:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-16 space-y-4 md:space-y-6">
            <div className="inline-block animate-bounce" style={{ animationDuration: '2s' }}>
              <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm font-medium">
                ✨ Interactive AI Demo
              </Badge>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight px-4">
              Meet Smarter with{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br className="hidden md:block" />
              {" "}Video Conferencing
            </h1>
            <p className="text-base md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed px-4">
              Transform your meetings with intelligent transcription, real-time insights, and seamless collaboration
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-4 px-4">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105 border-0">
                Start Free Trial
              </Button>
              <Button className="w-full sm:w-auto bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white px-6 md:px-8 py-5 md:py-6 text-base md:text-lg transition-all duration-300 hover:scale-105">
                <Play className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Main Dashboard Demo */}
          <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
            {/* Video Conference Preview */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800 p-4 md:p-8 transition-all duration-500 hover:bg-slate-900/70 hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="aspect-video bg-slate-950 rounded-xl md:rounded-2xl mb-4 md:mb-6 relative overflow-hidden border border-slate-800 group">
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
                  <div className="absolute top-2 md:top-4 left-2 md:left-4 animate-slide-right">
                    <Badge className="bg-red-500/90 text-white border-0 flex items-center gap-1.5 md:gap-2 text-xs">
                      <span className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-white animate-pulse"></span>
                      LIVE
                    </Badge>
                  </div>

                  {/* AI Assistant Badge */}
                  <div className="absolute top-2 md:top-4 right-2 md:right-4 animate-slide-left">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 text-xs">
                      🤖 AI Transcribing
                    </Badge>
                  </div>

                  {/* Participant Grid */}
                  <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 flex -space-x-1 md:-space-x-2 animate-slide-up">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i} 
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 border-2 border-slate-900 flex items-center justify-center text-xs text-white font-medium transition-transform duration-300 hover:scale-110 hover:z-10"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs text-slate-400">
                      +8
                    </div>
                  </div>

                  {/* Real-time Transcription Preview - Hidden on mobile */}
                  <div className="hidden md:block absolute bottom-4 right-4 max-w-md animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="bg-slate-900/95 backdrop-blur-sm rounded-lg p-3 border border-slate-700 text-xs text-slate-300">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                        <span className="font-medium text-blue-400">Live Transcription</span>
                      </div>
                      <p className="opacity-75">"Let's review the Q4 roadmap and discuss our growth strategy..."</p>
                    </div>
                  </div>
                </div>
                
                {/* Meeting Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
                    <Button className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 px-3 md:px-4 py-2">
                      <Mic className="w-4 md:w-5 h-4 md:h-5" />
                    </Button>
                    <Button className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 px-3 md:px-4 py-2">
                      <Video className="w-4 md:w-5 h-4 md:h-5" />
                    </Button>
                    <Button className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 px-3 md:px-4 py-2">
                      <MonitorUp className="w-4 md:w-5 h-4 md:h-5" />
                    </Button>
                  </div>
                  
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 border-0">
                    Join Demo Meeting
                  </Button>
                </div>
              </Card>
              
              {/* AI Insights Panel */}
              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800 p-4 md:p-6 transition-all duration-500 hover:bg-slate-900/70 hover:border-slate-700 hover:shadow-2xl hover:shadow-purple-500/10">
                <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-5 flex items-center gap-2 text-white">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  AI Insights & Suggestions
                  <Badge className="ml-auto bg-blue-500/20 text-blue-300 border-0 text-xs">Real-time</Badge>
                </h3>
                <div className="space-y-3 md:space-y-4">
                  {aiInsights.map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                      <div 
                        key={index} 
                        className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 transition-all duration-300 hover:bg-slate-800 hover:border-slate-600 hover:translate-x-1 group cursor-pointer"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                          <Icon className="w-4 md:w-5 h-4 md:h-5 text-blue-400" />
                        </div>
                        <span className="text-xs md:text-sm text-slate-300 leading-relaxed pt-1 md:pt-2">{insight.text}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* AI Features Grid - Mobile Only */}
              <div className="grid grid-cols-2 gap-3 lg:hidden">
                {aiFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="bg-slate-900/50 backdrop-blur-xl border-slate-800 p-4 transition-all duration-300 hover:bg-slate-900/70 hover:border-slate-700">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <h4 className="text-sm font-semibold text-white">{feature.title}</h4>
                        <p className="text-xs text-slate-400">{feature.description}</p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
            
            {/* Sidebar - Upcoming & Quick Actions */}
            <div className="space-y-4 md:space-y-6">
              {/* Upcoming Meetings */}
              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800 p-4 md:p-6 transition-all duration-500 hover:bg-slate-900/70 hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/10">
                <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-5 flex items-center gap-2 text-white">
                  <Calendar className="w-4 md:w-5 h-4 md:h-5 text-blue-400" />
                  Today's Schedule
                  <Badge className="ml-auto bg-slate-800 text-slate-300 border-0 text-xs">{upcomingMeetings.length}</Badge>
                </h3>
                <div className="space-y-3 md:space-y-4">
                  {upcomingMeetings.map((meeting, index) => (
                    <div 
                      key={index} 
                      className="space-y-2 md:space-y-3 pb-3 md:pb-4 border-b border-slate-800 last:border-0 last:pb-0 transition-all duration-300 hover:translate-x-1 group cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm md:text-base text-white group-hover:text-blue-400 transition-colors">{meeting.title}</h4>
                        <Button variant="ghost" className="h-6 w-6 text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all duration-300 flex-shrink-0">
                          <MoreVertical className="w-3 md:w-4 h-3 md:h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {meeting.aiSummary}
                      </p>
                      <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-slate-400">
                        <span className="flex items-center gap-1 md:gap-1.5">
                          <Clock className="w-3 md:w-3.5 h-3 md:h-3.5" />
                          {meeting.time}
                        </span>
                        <span className="flex items-center gap-1 md:gap-1.5">
                          <Users className="w-3 md:w-3.5 h-3 md:h-3.5" />
                          {meeting.participants}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {meeting.tags.map((tag, i) => (
                          <Badge key={i} className="bg-slate-800/50 text-slate-400 border-0 text-xs">
                            {tag}
                          </Badge>
                        ))}
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
              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800 p-4 md:p-6 transition-all duration-500 hover:bg-slate-900/70 hover:border-slate-700 hover:shadow-2xl hover:shadow-purple-500/10">
                <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-5 text-white">Quick Actions</h3>
                <div className="space-y-2 md:space-y-3">
                  <Button className="w-full justify-start bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition-all duration-300 hover:translate-x-1 hover:shadow-lg hover:shadow-blue-500/20 text-sm md:text-base py-5 md:py-6">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule New Meeting
                  </Button>
                  <Button className="w-full justify-start bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition-all duration-300 hover:translate-x-1 hover:shadow-lg hover:shadow-purple-500/20 text-sm md:text-base py-5 md:py-6">
                    <Video className="w-4 h-4 mr-2" />
                    Start Instant Call
                  </Button>
                  <Button className="w-full justify-start bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/30 text-blue-300 transition-all duration-300 hover:translate-x-1 hover:shadow-lg hover:shadow-blue-500/30 text-sm md:text-base py-5 md:py-6">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Meeting Planner
                  </Button>
                  <Button className="w-full justify-start bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition-all duration-300 hover:translate-x-1 hover:shadow-lg hover:shadow-green-500/20 text-sm md:text-base py-5 md:py-6">
                    <Clipboard className="w-4 h-4 mr-2" />
                    View Past Summaries
                  </Button>
                </div>
              </Card>

              {/* Stats Card */}
              <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border-blue-500/30 p-4 md:p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20">
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-slate-400">This Week</span>
                    <TrendingUp className="w-4 h-4 text-green-400 animate-bounce" style={{ animationDuration: '2s' }} />
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-white">24</div>
                    <div className="text-xs md:text-sm text-slate-400 mt-1">Hours saved with AI</div>
                  </div>
                  <div className="pt-3 md:pt-4 border-t border-slate-700/50">
                    <div className="text-xs md:text-sm text-slate-300">
                      <span className="text-green-400 font-semibold">+35%</span> team productivity
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* AI Features Section - Desktop Only */}
          <div className="hidden lg:block mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-white">
              Powered by Advanced AI
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="bg-slate-900/50 backdrop-blur-xl border-slate-800 p-6 transition-all duration-500 hover:bg-slate-900/70 hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 group">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <Icon className="w-8 h-8 text-blue-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-white">{feature.title}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 md:mt-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-slate-900/50 backdrop-blur-xl border-slate-800 p-4 md:p-6 text-center transition-all duration-500 hover:bg-slate-900/70 hover:border-slate-700 hover:shadow-xl hover:-translate-y-1">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-slate-400 mt-2">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-12 md:mt-20 text-center">
            <div className="inline-flex flex-col md:flex-row items-center gap-4 md:gap-8 px-4 md:px-8 py-4 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl md:rounded-full">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs md:text-sm text-slate-300">AI-Powered Transcription</span>
              </div>
              <div className="hidden md:block w-px h-6 bg-slate-700"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-xs md:text-sm text-slate-300">Real-time Insights</span>
              </div>
              <div className="hidden md:block w-px h-6 bg-slate-700"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-xs md:text-sm text-slate-300">Smart Scheduling</span>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 md:mt-24 text-center">
            <Card className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border-blue-500/30 p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Meetings?
              </h2>
              <p className="text-base md:text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                Join thousands of teams using AI to make every meeting more productive
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 border-0">
                  Start Free Trial
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white px-8 py-6 text-lg transition-all duration-300 hover:scale-105">
                  Schedule Demo
                </Button>
              </div>
              <p className="text-sm text-slate-500 mt-6">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </Card>
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
            animation: slide-up 0.6s ease forwards;
          }

          .animate-slide-right {
            animation: slide-right 0.6s ease forwards;
          }

          .animate-slide-left {
            animation: slide-left 0.6s ease forwards;
          }
        `}</style>
      </section>
    </div>
  );
};

export default VideoConferencingLanding;
