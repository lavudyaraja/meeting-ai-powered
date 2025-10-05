import { useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  Calendar, 
  Brain, 
  MessageSquare, 
  Video, 
  Clock, 
  Target,
  Zap,
  LineChart,
  Shield,
  Globe,
  Users,
  FileText,
  Mic,
  BarChart3,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "AI analyzes calendars and suggests optimal meeting times across time zones",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Brain,
    title: "AI Assistant",
    description: "Real-time meeting support with instant answers and document retrieval",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Video,
    title: "HD Video Platform",
    description: "Enterprise-grade video with 4K streaming, virtual backgrounds, and noise cancellation",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: MessageSquare,
    title: "Live Transcription",
    description: "Real-time transcription with speaker identification in 40+ languages",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Clock,
    title: "Auto Summaries",
    description: "Instant meeting recaps, action items, and highlights delivered automatically",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Target,
    title: "Smart Tasks",
    description: "AI detects and assigns action items with automatic deadline tracking",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Zap,
    title: "Workflow Automation",
    description: "Automate repetitive tasks with intelligent prioritization and routing",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: LineChart,
    title: "Predictive Analytics",
    description: "Forecast bottlenecks and get AI-powered insights for optimization",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "End-to-end encryption, SSO, and compliance with SOC2, GDPR, HIPAA",
    gradient: "from-slate-500 to-gray-600",
  },
  {
    icon: Globe,
    title: "Real-time Translation",
    description: "Break language barriers with instant translation and subtitle generation",
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Shared workspaces, collaborative docs, and integrated team chat",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: FileText,
    title: "Smart Documents",
    description: "AI-powered note-taking with automatic formatting and organization",
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    icon: Mic,
    title: "Voice Commands",
    description: "Control meetings hands-free with natural language voice recognition",
    gradient: "from-red-500 to-pink-500",
  },
  {
    icon: BarChart3,
    title: "Meeting Analytics",
    description: "Track engagement, participation metrics, and productivity insights",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    icon: Sparkles,
    title: "AI Meeting Coach",
    description: "Get real-time feedback on speaking pace, clarity, and engagement",
    gradient: "from-amber-500 to-yellow-500",
  },
  {
    icon: CheckCircle2,
    title: "Follow-up Automation",
    description: "Auto-send meeting notes, action items, and reminders to attendees",
    gradient: "from-lime-500 to-green-500",
  }
];

const Features = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-slate-950">
      {/* Grid Background */}
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(to right, rgba(100, 116, 139, 0.08) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(100, 116, 139, 0.08) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }}>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_0%,rgba(2,6,23,0.8)_100%)]"></div>
      </div>

      {/* Subtle Floating Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/3 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 px-6 py-3 rounded-full">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">
              Powered by Advanced AI
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold">
            <span className="block text-white mb-2">Everything You Need</span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              In One Platform
            </span>
          </h2>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Every feature is designed to minimize manual effort and maximize productivity with 
            cutting-edge AI technology
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-12 pt-12">
            {[
              { value: "40+", label: "Languages Supported" },
              { value: "99.9%", label: "Uptime Guarantee" },
              { value: "SOC2", label: "Certified Secure" },
              { value: "24/7", label: "AI Support" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <Card 
                key={index}
                className="relative bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 p-6 hover:bg-slate-900/50 hover:border-slate-700/50 transition-all duration-300 cursor-pointer overflow-hidden group"
              >
                {/* Subtle Corner Accent */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 blur-2xl transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className="relative mb-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative space-y-2">
                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Arrow Indicator */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                </div>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-10">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }}></div>
            
            {/* Gradient Orbs */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-left flex-1">
                <h3 className="text-3xl font-bold text-white mb-3">Ready to transform your meetings?</h3>
                <p className="text-slate-400 text-lg">Start your free trial today. No credit card required.</p>
              </div>
              <button className="whitespace-nowrap bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 group">
                Get Started Free 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Features;