import { ReactNode, useState } from "react";
import { 
  User, 
  Calendar, 
  Bot, 
  Puzzle, 
  Bell, 
  Mic, 
  Shield, 
  Users, 
  Code, 
  Settings as SettingsIcon,
  Search
} from "lucide-react";

interface SettingsLayoutProps {
  children?: ReactNode;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const SettingsLayout = ({ children, activeSection = "profile", onSectionChange = () => {} }: SettingsLayoutProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const sections = [
    { id: "profile", label: "Profile & Account", icon: User },
    { id: "meeting-preferences", label: "Meeting Preferences", icon: Calendar },
    { id: "ai-automation", label: "AI & Automation", icon: Bot },
    { id: "integrations", label: "Integrations", icon: Puzzle },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "voice-audio", label: "Voice & Audio", icon: Mic },
    { id: "privacy-security", label: "Privacy & Security", icon: Shield },
    { id: "team", label: "Team Settings", icon: Users },
    { id: "developer", label: "Developer", icon: Code },
    { id: "system", label: "System & Performance", icon: SettingsIcon },
  ];

  const filteredSections = sections.filter(section =>
    section.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }}>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 h-screen flex flex-col p-8">
        {/* Header */}
        <div className="mb-8 flex-shrink-0">
          <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent mb-3">
            Settings
          </h1>
          <p className="text-cyan-300 text-xl font-semibold">Manage your account and application preferences</p>
        </div>

        {/* Main Layout */}
        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Fixed Sidebar */}
          <div className="w-80 flex-shrink-0 flex flex-col bg-slate-900/80 backdrop-blur-xl border-2 border-cyan-400/40 rounded-3xl p-6">
            {/* Search Box */}
            <div className="mb-6 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input
                  type="text"
                  placeholder="Search settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border-2 border-slate-700 rounded-2xl text-slate-200 placeholder-slate-500 font-medium focus:outline-none focus:border-cyan-400/60 transition-all duration-300"
                />
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto space-y-2 pr-2">
              {filteredSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => onSectionChange(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-base transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-200 border-2 border-cyan-400/50 scale-105"
                        : "hover:bg-slate-800/50 text-slate-300 hover:text-cyan-300 border-2 border-transparent hover:border-slate-700 hover:scale-105"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="truncate">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col bg-slate-900/80 backdrop-blur-xl border-2 border-blue-400/40 rounded-3xl overflow-hidden">
            {/* Content Header */}
            <div className="flex-shrink-0 px-8 py-6 border-b-2 border-slate-800">
              <h2 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {sections.find(s => s.id === activeSection)?.label || "Settings"}
              </h2>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8">
              {children || (
                <div className="space-y-6">
                  {/* Demo Content */}
                  <div className="bg-slate-800/50 border-2 border-slate-700 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-slate-200 mb-4">
                      {sections.find(s => s.id === activeSection)?.label}
                    </h3>
                    <p className="text-slate-400 text-lg font-medium mb-6">
                      Configure your settings for this section. Content will be displayed here.
                    </p>
                    
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-6 bg-slate-900/50 border-2 border-slate-700 rounded-2xl hover:border-cyan-400/60 transition-all duration-300">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-lg font-bold text-slate-200 mb-2">Setting Option {i}</h4>
                              <p className="text-slate-400 font-medium">Description for this setting option</p>
                            </div>
                            <button className="relative w-14 h-7 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300">
                              <div className="absolute top-0.5 right-0.5 w-6 h-6 bg-white rounded-full"></div>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-slate-800/50 border-2 border-slate-700 rounded-2xl p-6 hover:border-blue-400/60 transition-all duration-300 hover:scale-105">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-4">
                          <SettingsIcon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-200 mb-2">Feature {i}</h4>
                        <p className="text-slate-400 text-sm font-medium">Quick access feature card</p>
                      </div>
                    ))}
                  </div>

                  <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xl py-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] border-2 border-cyan-400/50">
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Custom Scrollbar */
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
  );
};

export default SettingsLayout;