import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Brain, Sparkles, Video, Users, Clock, Zap, FileText, MessageSquare, BarChart3, Shield, Globe, ArrowRight, Play } from "lucide-react";

const Hero = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const features = [
    { icon: Video, title: "HD Video Calls", description: "Crystal clear quality" },
    { icon: FileText, title: "Smart Transcription", description: "Real-time notes" },
    { icon: Brain, title: "AI Insights", description: "Action item detection" },
    { icon: Users, title: "Team Collaboration", description: "Seamless workflow" }
  ];

  const stats = [
    { value: "50%", label: "Time Saved", icon: Clock },
    { value: "95%", label: "Accuracy", icon: BarChart3 },
    { value: "24/7", label: "AI Support", icon: Zap },
    { value: "150K+", label: "Users", icon: Users }
  ];

  const userAvatars = [
    "https://i.pravatar.cc/150?img=1",
    "https://i.pravatar.cc/150?img=2",
    "https://i.pravatar.cc/150?img=3",
    "https://i.pravatar.cc/150?img=4"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 pt-24 pb-12 md:pt-32 md:pb-20">
      {/* Advanced Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div 
          className="absolute w-64 h-64 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            top: '10%',
            left: '10%',
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        ></div>
        <div 
          className="absolute w-64 h-64 md:w-96 md:h-96 bg-purple-500/10 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            bottom: '10%',
            right: '10%',
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`
          }}
        ></div>
        <div 
          className="absolute w-48 h-48 md:w-72 md:h-72 bg-cyan-500/5 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            top: '50%',
            left: '50%',
            transform: `translate(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px)`
          }}
        ></div>
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(100, 116, 139, 0.08) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(100, 116, 139, 0.08) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 px-4 py-2 rounded-full transition-transform hover:scale-105 cursor-pointer">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-slate-300">
                AI-Powered Meeting Platform
              </span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="block text-white mb-2">Transform Your</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Meetings
              </span>
              <span className="block text-white">with AI</span>
            </h1>
            
            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Automate scheduling, enhance collaboration, and unlock insights with intelligent transcription, 
              real-time translation, and AI-powered action items.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 text-base rounded-xl transition-all duration-300 hover:scale-105 group border-0">
                <Calendar className="w-5 h-5 mr-2" />
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 text-white px-8 py-6 text-base rounded-xl hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 group">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img 
                    key={i}
                    src={`https://i.pravatar.cc/150?img=${i + 10}`}
                    alt={`User ${i}`}
                    className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover"
                  />
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-sm text-slate-400">Trusted by 150K+ teams worldwide</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-xl mx-auto lg:mx-0">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index}
                    className="bg-slate-900/30 backdrop-blur-xl border border-slate-800 p-4 rounded-xl hover:bg-slate-800/50 hover:border-slate-700 transition-all duration-300 cursor-pointer group"
                  >
                    <Icon className="w-5 h-5 text-blue-400 mb-2 transition-transform" />
                    <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Right Interactive Section */}
          <div className="relative mt-8 lg:mt-0 max-w-xl mx-auto lg:max-w-none w-full">
            {/* Main Card */}
            <div className="relative bg-slate-900/50 backdrop-blur-2xl border border-slate-800 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-5 md:mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Video className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm md:text-base">Team Standup</h3>
                    <p className="text-slate-400 text-xs md:text-sm">Today at 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-medium">Live</span>
                </div>
              </div>

              {/* Video Grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-5 md:mb-6">
                {userAvatars.map((avatar, i) => (
                  <div key={i} className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden relative group">
                    <img 
                      src={avatar} 
                      alt={`User ${i + 1}`}
                      className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-white font-medium border border-white/10">
                      User {i + 1}
                    </div>
                    {/* Audio Wave Indicator */}
                    {i === 0 && (
                      <div className="absolute top-2 right-2 flex gap-0.5">
                        {[1, 2, 3].map((bar) => (
                          <div 
                            key={bar}
                            className="w-1 bg-green-400 rounded-full animate-pulse"
                            style={{ 
                              height: `${Math.random() * 12 + 8}px`,
                              animationDelay: `${bar * 0.1}s`
                            }}
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Live Features */}
              <div className="space-y-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  const isActive = index === activeFeature;
                  return (
                    <div 
                      key={index}
                      className={`flex items-center gap-3 p-3 md:p-4 rounded-xl transition-all duration-500 ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/50' 
                          : 'bg-slate-800/30 border border-slate-700/50'
                      }`}
                    >
                      <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        isActive ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-slate-700/50'
                      }`}>
                        <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium text-sm md:text-base">{feature.title}</div>
                        <div className="text-slate-400 text-xs md:text-sm truncate">{feature.description}</div>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* AI Processing Indicator */}
              <div className="mt-5 md:mt-6 p-4 md:p-5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium text-sm md:text-base">AI Processing</span>
                  <span className="ml-auto text-xs text-slate-400">70%</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
            
            {/* Floating Feature Cards - Hidden on mobile */}
            <div className="hidden md:block absolute -top-4 -right-6 bg-gradient-to-br from-blue-500 to-blue-600 backdrop-blur-xl p-3 rounded-xl border border-blue-400/30 shadow-xl animate-float">
              <MessageSquare className="w-5 h-5 text-white mb-1" />
              <div className="text-sm font-semibold text-white">Live Transcription</div>
              <div className="text-xs text-blue-100">99% accuracy</div>
            </div>
            
            <div className="hidden md:block absolute -bottom-6 -left-6 bg-gradient-to-br from-purple-500 to-pink-600 backdrop-blur-xl p-3 rounded-xl border border-purple-400/30 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
              <Shield className="w-5 h-5 text-white mb-1" />
              <div className="text-sm font-semibold text-white">Enterprise Security</div>
              <div className="text-xs text-purple-100">End-to-end encrypted</div>
            </div>

            <div className="hidden lg:block absolute top-1/3 -right-8 bg-gradient-to-br from-cyan-500 to-blue-600 backdrop-blur-xl p-3 rounded-xl border border-cyan-400/30 shadow-xl animate-float" style={{ animationDelay: '0.5s' }}>
              <Globe className="w-5 h-5 text-white mb-1" />
              <div className="text-sm font-semibold text-white">40+ Languages</div>
              <div className="text-xs text-cyan-100">Real-time translation</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;