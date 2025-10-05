import React, { useState, useEffect } from "react";
import { Brain, X, LayoutDashboard, Calendar, CheckCircle, Video, MessageSquare, BarChart3, Settings, Users, Activity, Building, Shield, Film, Sparkles, CreditCard, Bell, HelpCircle, LogOut, Moon, Sun, User, Play, Bot } from "lucide-react";
import DashboardNavbar from "./DashboardNavbar";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activePage: string;
  onPageChange: (page: string) => void;
}

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
}

const menuItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "meetings", label: "Meetings", icon: Calendar },
  { id: "tasks", label: "Tasks", icon: CheckCircle },
  { id: "video", label: "Video Conference", icon: Video },
  { id: "ai-assistant", label: "AI Assistant", icon: MessageSquare },
  { id: "ai-management", label: "AI Management", icon: Bot },
  { id: "ai-meeting-assistant", label: "AI Meeting Features", icon: Sparkles },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "team", label: "Team Management", icon: Users },
  { id: "team-test", label: "Team Test", icon: Play },
  { id: "activity", label: "Team Activity", icon: Activity },
  { id: "departments", label: "Departments", icon: Building },
  { id: "roles", label: "Roles & Permissions", icon: Shield },
  { id: "recordings", label: "Recordings", icon: Film },
];

const DashboardLayout = ({ children, activePage, onPageChange }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { user, loading } = useAuth();

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleNavigation = (pageId: string) => {
    onPageChange(pageId);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const profileMenuItems = [
    { id: "view-profile", label: "View Profile", icon: User, description: "Name, email, role, organization" },
    { id: "settings", label: "Settings", icon: Settings, description: "Account, team, privacy, integrations" },
    { id: "billing", label: "My Subscriptions", icon: CreditCard, description: "Plan info, upgrade, invoices" },
    // { id: "ai-preferences", label: "AI Preferences", icon: Sparkles, description: "Voice, tone, summary style" },
    // { id: "notifications", label: "Notification Settings", icon: Bell, description: "Email & in-app alerts" },
    { id: "support", label: "Feedback & Support", icon: HelpCircle, description: "Report issue or contact" },
  ];

  const handleProfileAction = (actionId: string) => {
    if (actionId === "logout") {
      supabase.auth.signOut();
    } else if (actionId === "theme-toggle") {
      setDarkMode(!darkMode);
    } else if (actionId === "settings") {
      // Navigate to settings page
      handleNavigation("settings");
    } else {
      console.log(`Navigate to: ${actionId}`);
    }
    setProfileOpen(false);
  };

  // Fetch user profile data
  useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          // Fallback to auth user data if profile not found
          setUserProfile({
            id: user.id,
            full_name: user.user_metadata?.full_name || null,
            email: user.email || '',
            avatar_url: user.user_metadata?.avatar_url || null
          });
        } else {
          setUserProfile(data);
        }
      };

      fetchUserProfile();
    }
  }, [user]);

  // Get user initials for avatar if no avatar URL
  const getUserInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const sidebarFooter = document.querySelector('.sidebar-footer');
      if (profileOpen && sidebarFooter && !sidebarFooter.contains(target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileOpen]);

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Animated Grid Background */}
      {/* <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.15) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(59, 130, 246, 0.15) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      ></div> */}

      {/* Floating Orbs */}
      {/* <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div> */}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-slate-900/90 backdrop-blur-xl border-r-2 border-cyan-400/30 transform transition-all duration-300 flex flex-col
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${sidebarCollapsed ? "w-20" : "w-72"}`}
        style={{ height: "100vh" }}
      >
        {/* Logo */}
        <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"} mb-4 mt-2 flex-shrink-0 px-4`}>
          <div className="flex items-center gap-3 cursor-pointer group" onClick={toggleSidebar}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
              <Brain className="w-7 h-7 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                AI Meetings
              </span>
            )}
          </div>
          {!sidebarCollapsed && (
            <button className="lg:hidden p-2 hover:bg-slate-800 rounded-xl transition-colors" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5 text-slate-300" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-200 border-2 border-cyan-400/50 scale-105"
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-cyan-300 border-2 border-transparent hover:border-slate-700"
                } ${sidebarCollapsed ? "justify-center" : ""}`}
                style={{ animation: `fadeIn 0.4s ease-out ${index * 0.04}s both` }}
              >
                <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-cyan-400"}`} />
                {!sidebarCollapsed && (
                  <span className={`font-bold transition-colors duration-300 truncate ${isActive ? "text-cyan-300" : "text-slate-300 group-hover:text-cyan-300"}`}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 mt-6 px-4 pb-4 border-t border-slate-700/40 relative sidebar-footer">
          <div 
            className={`flex items-center gap-3 cursor-pointer group ${sidebarCollapsed ? "justify-center" : ""}`}
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center text-white font-bold">
                {userProfile?.avatar_url ? (
                  <img 
                    src={userProfile.avatar_url} 
                    alt={userProfile.full_name || 'User'} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-black">
                    {getUserInitials(userProfile?.full_name)}
                  </span>
                )}
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-slate-200 font-semibold text-sm">
                  {loading ? 'Loading...' : (userProfile?.full_name || userProfile?.email?.split('@')[0] || 'User')}
                </span>
                <span className="text-slate-400 text-xs">View Profile</span>
              </div>
            )}
          </div>

          {/* Profile Dropdown - Position based on sidebar state */}
          {profileOpen && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setProfileOpen(false)}
              />

              {/* Menu */}
              <div 
                className={`absolute bg-slate-900/95 backdrop-blur-xl border-2 border-cyan-400/40 rounded-3xl overflow-hidden z-50 transition-all duration-300 md:w-80 lg:w-[300px] 
                  ${sidebarCollapsed 
                    ? "right-6 bottom-16 origin-bottom-right" 
                    : "left-1/2 bottom-full mb-2 ml-4 origin-bottom -translate-x-1/2"}`}
              >
                {/* Profile Header */}
                {/* <div className="p-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b-2 border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center">
                      {userProfile?.avatar_url ? (
                        <img 
                          src={userProfile.avatar_url} 
                          alt={userProfile.full_name || 'User'} 
                          className="w-full h-full rounded-2xl object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-black text-white">
                          {getUserInitials(userProfile?.full_name)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-100">
                        {loading ? 'Loading...' : (userProfile?.full_name || userProfile?.email?.split('@')[0] || 'User')}
                      </h3>
                      <p className="text-sm text-slate-400 font-medium">
                        {loading ? 'Loading...' : (userProfile?.email || user?.email || 'user@example.com')}
                      </p>
                      <span className="inline-block mt-1 px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 rounded-lg text-xs font-bold">
                        Premium Plan
                      </span>
                    </div>
                  </div>
                </div> */}

                {/* Menu Items */}
                <div className="p-3 space-y-1">
                  {profileMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleProfileAction(item.id)}
                        className="w-full flex items-start gap-3 p-3 hover:bg-slate-800/50 rounded-2xl transition-all duration-300 group text-left border-2 border-transparent hover:border-slate-700"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                            {item.label}
                          </p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}

                  {/* Theme Toggle */}
                  <button
                    onClick={() => handleProfileAction("theme-toggle")}
                    className="w-full flex items-start gap-3 p-3 hover:bg-slate-800/50 rounded-2xl transition-all duration-300 group text-left border-2 border-transparent hover:border-slate-700"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {darkMode ? (
                        <Moon className="w-5 h-5 text-amber-400" />
                      ) : (
                        <Sun className="w-5 h-5 text-orange-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-200 group-hover:text-amber-300 transition-colors">
                        {darkMode ? "Dark Mode" : "Light Mode"}
                      </p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Theme toggle
                      </p>
                    </div>
                  </button>

                  {/* Logout */}
                  <button
                    onClick={() => handleProfileAction("logout")}
                    className="w-full flex items-start gap-3 p-3 hover:bg-rose-500/10 rounded-2xl transition-all duration-300 group text-left border-2 border-transparent hover:border-rose-500/40"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-red-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <LogOut className="w-5 h-5 text-rose-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-200 group-hover:text-rose-300 transition-colors">
                        Logout
                      </p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Sign out of account
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Main content - Fixed positioning to prevent navbar from scrolling */}
      <div className="flex-1 flex flex-col relative z-10" style={{ marginLeft: sidebarCollapsed ? "5rem" : "18rem" }}>
        <DashboardNavbar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .overflow-y-auto::-webkit-scrollbar { width: 6px; }
        .overflow-y-auto::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.3); border-radius: 10px; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, rgb(34, 211, 238), rgb(59, 130, 246)); border-radius: 10px; }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, rgb(6, 182, 212), rgb(37, 99, 235)); }
      `}</style>
    </div>
  );
};

export default DashboardLayout;