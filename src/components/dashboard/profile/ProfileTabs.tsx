import { User, Lock, Bell } from "lucide-react";

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProfileTabs = ({ activeTab, onTabChange }: ProfileTabsProps) => {
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="flex flex-wrap gap-2 border-b border-slate-800">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all duration-200 ${
              isActive
                ? "bg-cyan-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ProfileTabs;