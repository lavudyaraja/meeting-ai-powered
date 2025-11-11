import React, { useState, useEffect } from "react";
import { Brain, X, LayoutDashboard, Calendar, CheckCircle, Video, MessageSquare, Film, Settings, User, CreditCard, HelpCircle, LogOut, Moon, Sun, Bell, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const DashboardLayout = ({ onPageChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userProfile, setUserProfile] = useState({
    full_name: "User",
    email: "",
    avatar_url: null
  });

  // Load user profile from Supabase
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, email, avatar_url")
          .eq("id", user.id)
          .single();

        if (data && !error) {
          setUserProfile({
            full_name: data.full_name || user.user_metadata?.full_name || "User",
            email: data.email || user.email || "",
            avatar_url: data.avatar_url || null
          });
        } else {
          setUserProfile({
            full_name: user.user_metadata?.full_name || "User",
            email: user.email || "",
            avatar_url: null
          });
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    };

    loadUserProfile();

    const profileChannel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          setUserProfile(prev => ({
            ...prev,
            full_name: payload.new.full_name || prev.full_name,
            email: payload.new.email || prev.email,
            avatar_url: payload.new.avatar_url || prev.avatar_url
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileChannel);
    };
  }, []);

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
    { id: "meetings", label: "Meetings", icon: Calendar, path: "/dashboard/meetings" },
    { id: "tasks", label: "Tasks", icon: CheckCircle, path: "/dashboard/tasks" },
    { id: "video", label: "Video Conference", icon: Video, path: "/dashboard/video-conference" },
    { id: "ai-assistant", label: "AI Assistant", icon: MessageSquare, path: "/dashboard/ai-assistant" },
    { id: "recordings", label: "Recordings", icon: Film, path: "/dashboard/recordings" },
  ];

  const profileMenuItems = [
    { id: "view-profile", label: "View Profile", icon: User, description: "Name, email, role", path: "/dashboard/profile" },
    { id: "settings", label: "Settings", icon: Settings, description: "Account & privacy", path: "/dashboard/settings" },
    { id: "billing", label: "Subscriptions", icon: CreditCard, description: "Plan & invoices", path: "/dashboard/billing" },
    { id: "support", label: "Support", icon: HelpCircle, description: "Help & feedback", path: "/dashboard/support" },
  ];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) setSidebarOpen(false);
    if (onPageChange) onPageChange(path);
  };

  const handleProfileAction = async (actionId, path) => {
    if (path) {
      navigate(path);
    } else if (actionId === "logout") {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error logging out:", error);
      } else {
        navigate("/auth/login");
      }
    } else if (actionId === "theme-toggle") {
      setDarkMode(!darkMode);
    }
    setProfileOpen(false);
    if (onPageChange) onPageChange(actionId);
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileOpen && !event.target.closest('.sidebar-footer')) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, sidebarOpen]);

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 overflow-hidden">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-slate-900/95 backdrop-blur-xl border-r border-cyan-400/30 transform transition-all duration-300 flex flex-col
          ${isMobile 
            ? `w-80 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
            : `${sidebarCollapsed ? 'w-20' : 'w-72'} translate-x-0`
          }`}
      >
        {/* Logo */}
        <div className={`flex items-center ${sidebarCollapsed && !isMobile ? "justify-center" : "justify-between"} px-4 py-4 border-b border-slate-800/50`}>
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              if (location.pathname !== "/dashboard") {
                handleNavigation("/dashboard");
              } else if (!isMobile) {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Brain className="w-6 h-6 text-white" />
            </div>
            {(!sidebarCollapsed || isMobile) && (
              <span className="text-xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                AI Meetings
              </span>
            )}
          </div>
          {isMobile && (
            <button 
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors" 
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5 text-slate-300" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden">
          <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <div key={item.id} className="relative group/item">
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200"
                      : "hover:bg-slate-800/50 text-slate-300 hover:text-cyan-300"
                  } ${sidebarCollapsed && !isMobile ? "justify-center" : ""}`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-cyan-400"}`} />
                  {(!sidebarCollapsed || isMobile) && (
                    <span className={`font-semibold text-sm truncate ${isActive ? "text-cyan-300" : "group-hover:text-cyan-300"}`}>
                      {item.label}
                    </span>
                  )}
                  {isActive && (!sidebarCollapsed || isMobile) && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </button>
                
                {/* Tooltip for collapsed sidebar */}
                {sidebarCollapsed && !isMobile && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-800 text-slate-200 text-sm font-semibold rounded-lg shadow-xl opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 whitespace-nowrap z-[60] pointer-events-none">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800"></div>
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4 border-t border-slate-800/50 pt-4 sidebar-footer relative">
          <button
            className={`w-full flex items-center gap-3 p-3 hover:bg-slate-800/50 rounded-xl transition-all duration-200 ${
              sidebarCollapsed && !isMobile ? "justify-center" : ""
            }`}
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center text-white font-bold">
                {userProfile.avatar_url ? (
                  <img 
                    src={userProfile.avatar_url} 
                    alt={userProfile.full_name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm">{getUserInitials(userProfile.full_name)}</span>
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
            </div>
            {(!sidebarCollapsed || isMobile) && (
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-semibold text-slate-200 truncate">
                  {userProfile.full_name}
                </div>
                <div className="text-xs text-slate-400">View Profile</div>
              </div>
            )}
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div 
              className={`absolute bg-slate-900/98 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-2xl shadow-black/50 z-[60] w-72
                ${sidebarCollapsed && !isMobile
                  ? "left-full ml-2 bottom-0" 
                  : "bottom-full mb-2 left-3 right-3"
                }`}
            >
              {/* User Profile Header */}
              <div className="p-4 border-b border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {userProfile.avatar_url ? (
                      <img 
                        src={userProfile.avatar_url} 
                        alt={userProfile.full_name} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-base">{getUserInitials(userProfile.full_name)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-200 truncate">
                      {userProfile.full_name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {userProfile.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2 space-y-1">
                {profileMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleProfileAction(item.id, item.path)}
                      className="w-full flex items-start gap-3 p-3 hover:bg-slate-800/50 rounded-xl transition-all duration-200 group text-left"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                          {item.label}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}

                {/* Theme Toggle */}
                <button
                  onClick={() => handleProfileAction("theme-toggle", undefined)}
                  className="w-full flex items-start gap-3 p-3 hover:bg-slate-800/50 rounded-xl transition-all duration-200 group text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                    {darkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-orange-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-200 group-hover:text-amber-300 transition-colors">
                      {darkMode ? "Dark Mode" : "Light Mode"}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Theme preference</p>
                  </div>
                </button>

                {/* Logout */}
                <button
                  onClick={() => handleProfileAction("logout", undefined)}
                  className="w-full flex items-start gap-3 p-3 hover:bg-rose-500/10 rounded-xl transition-all duration-200 group text-left border-t border-slate-800/50 mt-1 pt-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-500/20 to-red-500/20 flex items-center justify-center flex-shrink-0">
                    <LogOut className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-200 group-hover:text-rose-300 transition-colors">
                      Logout
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Sign out</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 overflow-hidden ${
          isMobile ? 'ml-0' : (sidebarCollapsed ? 'ml-20' : 'ml-72')
        }`}
      >
        {/* Navbar */}
        <header className="flex-shrink-0 bg-slate-900/80 backdrop-blur-xl border-b border-cyan-400/20 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
                >
                  <Menu className="w-6 h-6 text-slate-300" />
                </button>
              )}
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-slate-100 truncate">
                  {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 hidden sm:block truncate">
                  Welcome back, {userProfile.full_name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-slate-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              </button>
              <button 
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => handleNavigation("/dashboard/settings")}
              >
                <Settings className="w-5 h-5 text-slate-300" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        .overflow-y-auto::-webkit-scrollbar { width: 6px; }
        .overflow-y-auto::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.3); border-radius: 10px; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, rgb(34, 211, 238), rgb(59, 130, 246)); border-radius: 10px; }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, rgb(6, 182, 212), rgb(37, 99, 235)); }
      `}</style>
    </div>
  );
};

export default DashboardLayout;