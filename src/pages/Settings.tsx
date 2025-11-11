import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/overview/DashboardLayout";
import SettingsLayout from "@/components/settings/SettingsLayout";
import ProfileSettings from "@/components/settings/ProfileSettings";
import MeetingPreferences from "@/components/settings/MeetingPreferences";
import AIAutomation from "@/components/settings/AIAutomation";
import Integrations from "@/components/settings/Integrations";
import Notifications from "@/components/settings/Notifications";
import VoiceAudio from "@/components/settings/VoiceAudio";
import PrivacySecurity from "@/components/settings/PrivacySecurity";
import TeamSettings from "@/components/settings/TeamSettings";
import DeveloperSettings from "@/components/settings/DeveloperSettings";
import SystemPerformance from "@/components/settings/SystemPerformance";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const navigate = useNavigate();

  const handlePageChange = (page: string) => {
    if (page === "settings") {
      // Stay on settings page
      return;
    } else {
      // Navigate to other dashboard pages
      navigate(`/dashboard#${page}`);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSettings />;
      case "meeting-preferences":
        return <MeetingPreferences />;
      case "ai-automation":
        return <AIAutomation />;
      case "integrations":
        return <Integrations />;
      case "notifications":
        return <Notifications />;
      case "voice-audio":
        return <VoiceAudio />;
      case "privacy-security":
        return <PrivacySecurity />;
      case "team":
        return <TeamSettings />;
      case "developer":
        return <DeveloperSettings />;
      case "system":
        return <SystemPerformance />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <DashboardLayout activePage="settings" onPageChange={handlePageChange}>
      <div className="h-full">
        <SettingsLayout activeSection={activeSection} onSectionChange={setActiveSection}>
          {renderSection()}
        </SettingsLayout>
      </div>
    </DashboardLayout>
  );
};

export default Settings;