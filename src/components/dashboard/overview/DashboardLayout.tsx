import React, { useState, useEffect, useCallback } from "react";
import {
  Brain,
  X,
  LayoutDashboard,
  Calendar,
  CheckCircle,
  Video,
  MessageSquare,
  Film,
  Bell,
  Menu,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  BarChart2,
  Sparkles,
} from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProfileDropdown from "@/components/dashboard/profile/ProfileDropdown";

interface DashboardLayoutProps {
  onPageChange?: (path: string) => void;
}

interface UserProfile {
  full_name: string;
  email: string;
  avatar_url: string | null;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onPageChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Data State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    full_name: "User",
    email: "",
    avatar_url: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);

  // Menu Items
  const menuItems: MenuItem[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
    { id: "meetings", label: "Meetings", icon: Calendar, path: "/dashboard/meetings", badge: 2 },
    { id: "tasks", label: "Tasks", icon: CheckCircle, path: "/dashboard/tasks", badge: 5 },
    { id: "video", label: "Video Conference", icon: Video, path: "/dashboard/video-conference" },
    { id: "ai-assistant", label: "AI Assistant", icon: MessageSquare, path: "/dashboard/ai-assistant" },
    { id: "ai-features", label: "AI Features", icon: Sparkles, path: "/dashboard/ai-features" },
    { id: "recordings", label: "Recordings", icon: Film, path: "/dashboard/recordings" },
    { id: "advanced-meetings", label: "Advanced Insights", icon: Brain, path: "/dashboard/advanced-meetings" },
  ];

  // Load User Profile
  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth/login");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, email, avatar_url")
          .eq("id", user.id)
          .single();

        if (data && !error) {
          setUserProfile({
            full_name: data.full_name || user.user_metadata?.full_name || "User",
            email: data.email || user.email || "",
            avatar_url: data.avatar_url || null,
          });
        } else {
          setUserProfile({
            full_name: user.user_metadata?.full_name || "User",
            email: user.email || "",
            avatar_url: null,
          });
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();

    // Real-time profile updates
    const profileChannel = supabase
      .channel("profile_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        (payload) => {
          setUserProfile((prev) => ({
            ...prev,
            full_name: payload.new.full_name || prev.full_name,
            email: payload.new.email || prev.email,
            avatar_url: payload.new.avatar_url || prev.avatar_url,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileChannel);
    };
  }, [navigate]);

  // Responsive handling
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
      // Auto-collapse on medium screens
      if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
        setSidebarCollapsed(true);
      }
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      // Cmd/Ctrl + B to toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        if (!isMobile) {
          setSidebarCollapsed(!sidebarCollapsed);
        }
      }
      // Escape to close modals
      if (e.key === "Escape") {
        setSearchOpen(false);
        if (isMobile) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, sidebarCollapsed]);

  // Navigation handler
  const handleNavigation = useCallback((path: string) => {
    navigate(path);
    if (isMobile) setSidebarOpen(false);
    if (onPageChange) onPageChange(path);
  }, [navigate, isMobile, onPageChange]);

  // Logout handler
  const handleLogout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
      throw error;
    }
    navigate("/auth/login");
  }, [navigate]);

  // Get user initials
  const getUserInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 overflow-hidden">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-slate-900/95 backdrop-blur-xl border-r border-cyan-400/30 transform transition-all duration-300 ease-in-out flex flex-col shadow-2xl shadow-black/50
          ${isMobile
            ? `w-80 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
            : `${sidebarCollapsed ? "w-20" : "w-72"} translate-x-0`
          }`}
      >
        {/* Sidebar gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-violet-500/5 pointer-events-none" />

        {/* Logo Header */}
        <div
          className={`relative flex items-center ${
            sidebarCollapsed && !isMobile ? "justify-center px-2" : "justify-between px-4"
          } py-4 border-b border-slate-800/50 bg-slate-900/50`}
        >
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-cyan-500/30">
              <Brain className="w-6 h-6 text-white" />
            </div>
            {(!sidebarCollapsed || isMobile) && (
              <span className="text-xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                AI Meetings
              </span>
            )}
          </div>
          
          {isMobile ? (
            <button
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5 text-slate-300" />
            </button>
          ) : (
            !sidebarCollapsed && (
              <button
                className="p-2 hover:bg-slate-800 rounded-lg transition-all duration-200 group"
                onClick={() => setSidebarCollapsed(true)}
                title="Collapse sidebar (Ctrl+B)"
              >
                <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              </button>
            )
          )}
        </div>

        {/* Expand Button (when collapsed) */}
        {!isMobile && sidebarCollapsed && (
          <button
            className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-cyan-400/30 rounded-full flex items-center justify-center hover:bg-slate-700 transition-all duration-200 hover:scale-110 z-10 shadow-lg"
            onClick={() => setSidebarCollapsed(false)}
            title="Expand sidebar (Ctrl+B)"
          >
            <ChevronRight className="w-3 h-3 text-cyan-400" />
          </button>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar relative">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                  ${isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 shadow-lg shadow-cyan-500/10"
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-cyan-300"
                  } ${sidebarCollapsed && !isMobile ? "justify-center" : ""}`}
                title={sidebarCollapsed && !isMobile ? item.label : undefined}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full" />
                )}
                
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                      isActive 
                        ? "text-cyan-400 scale-110" 
                        : "text-slate-400 group-hover:text-cyan-400 group-hover:scale-110"
                    }`}
                  />
                  {item.badge && item.badge > 0 && (!sidebarCollapsed || isMobile) && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                
                {(!sidebarCollapsed || isMobile) && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span
                      className={`font-semibold text-sm truncate transition-colors ${
                        isActive ? "text-cyan-300" : "group-hover:text-cyan-300"
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.badge && item.badge > 0 && (
                      <span className="ml-auto px-2 py-0.5 bg-rose-500/20 text-rose-400 text-xs font-bold rounded-full border border-rose-500/30">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="relative px-3 pb-4 border-t border-slate-800/50 pt-4 bg-slate-900/50">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className={`w-full flex items-center gap-3 p-3 hover:bg-slate-800/50 rounded-xl transition-all duration-200 group ${
              sidebarCollapsed && !isMobile ? "justify-center" : ""
            } ${profileOpen ? "bg-slate-800/50" : ""}`}
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center text-white font-bold ring-2 ring-cyan-400/30 ring-offset-2 ring-offset-slate-900 group-hover:ring-cyan-400/50 transition-all">
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
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 shadow-lg shadow-emerald-400/50" />
            </div>
            
            {(!sidebarCollapsed || isMobile) && (
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-semibold text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
                  {userProfile.full_name}
                </div>
                <div className="text-xs text-slate-400">View Profile</div>
              </div>
            )}
          </button>

          {/* Profile Dropdown */}
          <ProfileDropdown
            isOpen={profileOpen}
            onClose={() => setProfileOpen(false)}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            userProfile={userProfile}
            sidebarCollapsed={sidebarCollapsed}
            isMobile={isMobile}
            onNavigate={handleNavigation}
            onLogout={handleLogout}
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
          isMobile ? "ml-0" : sidebarCollapsed ? "ml-20" : "ml-72"
        }`}
      >
        {/* Top Navigation Bar */}
        <header className="flex-shrink-0 bg-slate-900/80 backdrop-blur-xl border-b border-cyan-400/20 px-4 sm:px-6 py-4 shadow-lg relative z-30">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-violet-500/5 pointer-events-none" />
          
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
                >
                  <Menu className="w-6 h-6 text-slate-300" />
                </button>
              )}
              
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-slate-100 truncate">
                  {menuItems.find((item) => item.path === location.pathname)?.label || "Dashboard"}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 hidden sm:block truncate">
                  Welcome back, {userProfile.full_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Search Button */}
              <button
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors group relative"
                onClick={() => setSearchOpen(true)}
                title="Search (Ctrl+K)"
              >
                <Search className="w-5 h-5 text-slate-300 group-hover:text-cyan-400 transition-colors" />
              </button>

              {/* Notifications */}
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors relative group">
                <Bell className="w-5 h-5 text-slate-300 group-hover:text-cyan-400 transition-colors" />
                {notificationCount > 0 && (
                  <>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                      {notificationCount}
                    </span>
                  </>
                )}
              </button>

              {/* Settings */}
              <button
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors group"
                onClick={() => handleNavigation("/dashboard/settings")}
              >
                <Settings className="w-5 h-5 text-slate-300 group-hover:text-cyan-400 group-hover:rotate-90 transition-all duration-300" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-cyan-400/30 rounded-2xl shadow-2xl w-full max-w-2xl animate-in slide-in-from-top-4 duration-200">
            <div className="p-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-xs text-slate-500 px-2 py-1 bg-slate-800 rounded"
                >
                  ESC
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-slate-400">Start typing to search...</p>
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.5);
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;