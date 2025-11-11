import { useState, useEffect, useRef } from "react";
import { 
  User, 
  Lock, 
  Settings, 
  CreditCard, 
  HelpCircle, 
  LogOut, 
  Moon, 
  Sun,
  Bell,
  ChevronRight,
  Loader2
} from "lucide-react";

interface ProfileDropdownProps {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  userProfile: {
    full_name: string;
    email: string;
    avatar_url: string | null;
  };
  sidebarCollapsed: boolean;
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
  onLogout?: () => Promise<void>;
}

const ProfileDropdown = ({ 
  darkMode, 
  setDarkMode, 
  userProfile, 
  sidebarCollapsed, 
  isMobile,
  isOpen,
  onClose,
  onNavigate,
  onLogout
}: ProfileDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const profileMenuItems = [
    { 
      id: "view-profile", 
      label: "View Profile", 
      icon: User, 
      description: "Name, email, role", 
      path: "/profile" 
    },
    { 
      id: "security", 
      label: "Security", 
      icon: Lock, 
      description: "Password, 2FA", 
      path: "/profile#security" 
    },
    { 
      id: "settings", 
      label: "Settings", 
      icon: Settings, 
      description: "Account & privacy", 
      path: "/settings" 
    },
    { 
      id: "notifications", 
      label: "Notifications", 
      icon: Bell, 
      description: "Alerts & reminders", 
      path: "/profile#notifications" 
    },
    { 
      id: "billing", 
      label: "Subscriptions", 
      icon: CreditCard, 
      description: "Plan & invoices", 
      path: "/profile#subscriptions" 
    },
    { 
      id: "support", 
      label: "Support", 
      icon: HelpCircle, 
      description: "Help & feedback", 
      path: "/profile#support" 
    },
  ];

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      const totalItems = profileMenuItems.length + 2; // +2 for theme toggle and logout

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % totalItems);
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => (prev - 1 + totalItems) % totalItems);
          break;
        case "Enter":
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < profileMenuItems.length) {
            handleProfileAction(profileMenuItems[focusedIndex].id, profileMenuItems[focusedIndex].path);
          } else if (focusedIndex === profileMenuItems.length) {
            handleProfileAction("theme-toggle");
          } else if (focusedIndex === profileMenuItems.length + 1) {
            handleProfileAction("logout");
          }
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, focusedIndex, onClose]);

  const handleProfileAction = async (actionId: string, path?: string) => {
    if (path && onNavigate) {
      onClose();
      onNavigate(path);
    } else if (actionId === "logout") {
      if (onLogout) {
        setIsLoggingOut(true);
        try {
          await onLogout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          setIsLoggingOut(false);
        }
      }
    } else if (actionId === "theme-toggle") {
      setDarkMode(!darkMode);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      <div 
        ref={dropdownRef}
        className={`absolute bg-white border border-gray-200 rounded-2xl shadow-xl z-[60] overflow-hidden
          ${sidebarCollapsed && !isMobile
            ? "left-full ml-3 bottom-0 w-80 animate-in slide-in-from-left-2 fade-in duration-200" 
            : "bottom-full mb-3 left-3 right-3 max-w-sm animate-in slide-in-from-bottom-2 fade-in duration-200"
          }`}
      >
        {/* User Profile Header */}
        <div className="relative p-5 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0 ring-4 ring-blue-100">
                {userProfile.avatar_url ? (
                  <img 
                    src={userProfile.avatar_url} 
                    alt={userProfile.full_name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg">{getUserInitials(userProfile.full_name)}</span>
                )}
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-gray-900 truncate mb-0.5">
                {userProfile.full_name}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {userProfile.email}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="relative p-2 space-y-1 max-h-[60vh] overflow-y-auto">
          {profileMenuItems.map((item, index) => {
            const Icon = item.icon;
            const isFocused = focusedIndex === index;
            
            return (
              <button
                key={item.id}
                onClick={() => handleProfileAction(item.id, item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-left
                  ${isFocused 
                    ? 'bg-blue-50 shadow-sm' 
                    : 'hover:bg-gray-50'
                  }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200
                  ${isFocused 
                    ? 'bg-blue-100' 
                    : 'bg-gray-100 group-hover:bg-blue-50'
                  }`}>
                  <Icon className={`w-5 h-5 transition-colors ${isFocused ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium transition-colors
                    ${isFocused ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'}`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {item.description}
                  </p>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 transition-all
                  ${isFocused ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
              </button>
            );
          })}

          {/* Theme Toggle */}
          <button
            onClick={() => handleProfileAction("theme-toggle")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-left mt-3 border-t border-gray-100 pt-3
              ${focusedIndex === profileMenuItems.length 
                ? 'bg-amber-50 shadow-sm' 
                : 'hover:bg-gray-50'
              }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200
              ${focusedIndex === profileMenuItems.length
                ? 'bg-amber-100' 
                : 'bg-gray-100 group-hover:bg-amber-50'
              }`}>
              {darkMode ? (
                <Moon className={`w-5 h-5 transition-colors ${focusedIndex === profileMenuItems.length ? 'text-amber-600' : 'text-gray-600 group-hover:text-amber-500'}`} />
              ) : (
                <Sun className={`w-5 h-5 transition-colors ${focusedIndex === profileMenuItems.length ? 'text-amber-600' : 'text-gray-600 group-hover:text-amber-500'}`} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium transition-colors
                ${focusedIndex === profileMenuItems.length ? 'text-amber-600' : 'text-gray-900 group-hover:text-amber-600'}`}>
                {darkMode ? "Dark Mode" : "Light Mode"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Toggle theme</p>
            </div>
            <div className={`w-11 h-6 rounded-full relative transition-colors duration-300
              ${darkMode ? 'bg-amber-500' : 'bg-gray-300'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300
                ${darkMode ? 'left-6' : 'left-1'}`} />
            </div>
          </button>

          {/* Logout */}
          <button
            onClick={() => handleProfileAction("logout")}
            disabled={isLoggingOut}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-left border-t border-gray-100 mt-1 pt-3
              ${focusedIndex === profileMenuItems.length + 1
                ? 'bg-red-50 shadow-sm' 
                : 'hover:bg-red-50'
              } ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200
              ${focusedIndex === profileMenuItems.length + 1
                ? 'bg-red-100' 
                : 'bg-gray-100 group-hover:bg-red-100'
              }`}>
              {isLoggingOut ? (
                <Loader2 className="w-5 h-5 text-red-600 animate-spin" />
              ) : (
                <LogOut className={`w-5 h-5 transition-colors ${focusedIndex === profileMenuItems.length + 1 ? 'text-red-600' : 'text-gray-600 group-hover:text-red-500'}`} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium transition-colors
                ${focusedIndex === profileMenuItems.length + 1 ? 'text-red-600' : 'text-gray-900 group-hover:text-red-600'}`}>
                {isLoggingOut ? "Logging out..." : "Logout"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Sign out of account</p>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileDropdown;