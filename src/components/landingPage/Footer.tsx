import { useState } from "react";
import { Brain, Twitter, Linkedin, Github, Mail, Phone, MapPin, Send, CheckCircle, Sparkles, Video, Bot, Calendar, Users, Shield, Zap, TrendingUp, Award, Globe, FileText, MessageSquare, BarChart3, Clock, Target, Headphones, BookOpen, Download, Star } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubscribed(true);
    setIsSubmitting(false);
    setEmail("");
    
    // Reset after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  const aiFeatures = [
    { icon: Brain, text: "AI Summaries", link: "#ai-summaries" },
    { icon: Video, text: "Smart Recording", link: "#recording" },
    { icon: Bot, text: "AI Assistant", link: "#assistant" },
    { icon: Calendar, text: "Smart Scheduling", link: "#scheduling" },
    { icon: MessageSquare, text: "Live Transcription", link: "#transcription" },
    { icon: Target, text: "Action Items", link: "#action-items" }
  ];

  const resources = [
    { icon: BookOpen, text: "Documentation", link: "#docs" },
    { icon: FileText, text: "Case Studies", link: "#cases" },
    { icon: Download, text: "Download App", link: "#download" },
    { icon: Headphones, text: "Support Center", link: "#support" }
  ];

  const stats = [
    { icon: Users, value: "150K+", label: "Active Users" },
    { icon: Video, value: "5M+", label: "Meetings Hosted" },
    { icon: Zap, value: "99.9%", label: "Uptime" },
    { icon: Star, value: "4.9/5", label: "User Rating" }
  ];

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800 overflow-hidden">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(100, 116, 139, 0.08) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(100, 116, 139, 0.08) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>
      </div>

      {/* Subtle Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-5 hover:bg-slate-800/50 hover:border-slate-700 transition-all duration-300 cursor-pointer group"
              >
                <Icon className="w-7 h-7 text-blue-400 mb-3 transition-transform" />
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 font-medium mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          {/* Brand & Description */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transition-transform hover:scale-110">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Meetings
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Transform your workflow with AI-powered meeting automation. Smart summaries, transcriptions, and insights at your fingertips.
            </p>
            
            {/* Newsletter Signup */}
            <div>
              <h4 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                Stay Updated
              </h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-300 placeholder-slate-500 focus:outline-none focus:border-slate-700 transition-all"
                  disabled={isSubmitting || isSubscribed}
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting || isSubscribed}
                  className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center min-w-[60px]"
                >
                  {isSubscribed ? <CheckCircle className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                </button>
              </form>
              {isSubscribed && (
                <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Successfully subscribed!
                </p>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-3 pt-4">
              <a href="mailto:hello@aimeetings.com" className="flex items-center gap-3 text-slate-400 hover:text-slate-300 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-center group-hover:border-slate-700 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm">hello@aimeetings.com</span>
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-3 text-slate-400 hover:text-slate-300 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-center group-hover:border-slate-700 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm">+1 (234) 567-890</span>
              </a>
              <div className="flex items-center gap-3 text-slate-400">
                <div className="w-8 h-8 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>
          </div>
          
          {/* AI Features */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              AI Features
            </h4>
            <ul className="space-y-3">
              {aiFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <li key={index}>
                    <a
                      href={feature.link}
                      className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-all group"
                    >
                      <Icon className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                      <span className="text-sm">{feature.text}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          
          {/* Product */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold text-lg mb-5">Product</h4>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'Security', 'Enterprise', 'Integrations', 'API', 'Changelog', 'Roadmap'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-slate-400 hover:text-slate-300 transition-colors text-sm block hover:translate-x-1 transition-transform">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold text-lg mb-5">Resources</h4>
            <ul className="space-y-3">
              {resources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <li key={index}>
                    <a
                      href={resource.link}
                      className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-all group"
                    >
                      <Icon className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                      <span className="text-sm">{resource.text}</span>
                    </a>
                  </li>
                );
              })}
              <li>
                <a href="#blog" className="text-slate-400 hover:text-slate-300 transition-colors text-sm block">
                  Blog
                </a>
              </li>
              <li>
                <a href="#webinars" className="text-slate-400 hover:text-slate-300 transition-colors text-sm block">
                  Webinars
                </a>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold text-lg mb-5">Company</h4>
            <ul className="space-y-3">
              {['About', 'Careers', 'Contact', 'Press Kit', 'Partners', 'Investors', 'Events', 'Community'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-slate-400 hover:text-slate-300 transition-colors text-sm block hover:translate-x-1 transition-transform">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links & CTA */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 p-6 bg-slate-900/30 border border-slate-800 rounded-2xl">
          <div>
            <h4 className="text-white font-semibold text-lg mb-2">Connect With Us</h4>
            <p className="text-slate-400 text-sm">Join our community and stay updated</p>
          </div>
          <div className="flex gap-3">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-center hover:bg-slate-800/50 hover:border-slate-700 transition-all duration-300"
            >
              <Twitter className="w-5 h-5 text-slate-400" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-center hover:bg-slate-800/50 hover:border-slate-700 transition-all duration-300"
            >
              <Linkedin className="w-5 h-5 text-slate-400" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-center hover:bg-slate-800/50 hover:border-slate-700 transition-all duration-300"
            >
              <Github className="w-5 h-5 text-slate-400" />
            </a>
            <a
              href="mailto:hello@aimeetings.com"
              className="w-11 h-11 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-center hover:bg-slate-800/50 hover:border-slate-700 transition-all duration-300"
            >
              <Mail className="w-5 h-5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-12 p-6 bg-slate-900/30 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 text-slate-400">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="font-medium text-sm">SOC 2 Certified</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="font-medium text-sm">GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Shield className="w-5 h-5 text-purple-400" />
            <span className="font-medium text-sm">ISO 27001</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Award className="w-5 h-5 text-yellow-400" />
            <span className="font-medium text-sm">Best AI Tool 2025</span>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm text-center md:text-left">
            © 2025 AI Meetings. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#privacy" className="text-slate-400 hover:text-slate-300 transition-colors text-sm hover:underline">
              Privacy Policy
            </a>
            <a href="#terms" className="text-slate-400 hover:text-slate-300 transition-colors text-sm hover:underline">
              Terms of Service
            </a>
            <a href="#cookies" className="text-slate-400 hover:text-slate-300 transition-colors text-sm hover:underline">
              Cookie Policy
            </a>
            <a href="#accessibility" className="text-slate-400 hover:text-slate-300 transition-colors text-sm hover:underline">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;