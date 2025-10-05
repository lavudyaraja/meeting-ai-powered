import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import MeetingsList from "@/components/dashboard/MeetingsList";
import TasksManager from "@/components/dashboard/TasksManager";
import VideoConference from "@/components/dashboard/video-conference/VideoConference";
import AIAssistant from "@/components/dashboard/AIAssistant";
import AIMeetingDashboard from "@/components/ai-meeting-features/AIMeetingDashboard";
import Analytics from "@/components/dashboard/Analytics";
import { TeamManagement } from "@/components/dashboard/team";
import { TeamMemberProfile } from "@/components/dashboard/team";
import { TeamActivityFeed } from "@/components/dashboard/team";
import { DepartmentManagement } from "@/components/dashboard/team";
import { RoleManagement } from "@/components/dashboard/team";
import { TeamSetupGuide } from "@/components/dashboard/team";
import { TeamTest } from "@/components/dashboard/team";
import { RecordingsLibrary } from "@/components/dashboard/recordings";
import { RecordingPlayer } from "@/components/dashboard/recordings";
import { RecordingDetails } from "@/components/dashboard/recordings";
import { AIManagement } from "@/components/dashboard/ai-management";
import { useNavigate, useLocation } from "react-router-dom";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("overview");
  const navigate = useNavigate();
  const location = useLocation();

  // Update active page based on URL hash
  useEffect(() => {
    if (location.hash) {
      // Extract page from hash (e.g., #video?meetingId=123)
      const hashParts = location.hash.substring(1).split('?');
      const hashPage = hashParts[0];
      
      // Handle nested routes like recordings/player or recordings/details
      if (hashPage.startsWith("recordings/")) {
        setActivePage(hashPage);
      } else {
        setActivePage(hashPage);
      }
    } else {
      setActivePage("overview");
    }
  }, [location]);

  const handlePageChange = (page: string) => {
    if (page === "settings") {
      // Navigate to the dedicated settings page
      navigate("/settings");
    } else {
      // Handle other page changes normally
      setActivePage(page);
      // Update URL hash without reloading
      if (page === "overview") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate(`#${page}`, { replace: true });
      }
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "overview":
        return <DashboardOverview />;
      case "meetings":
        return <MeetingsList />;
      case "tasks":
        return <TasksManager />;
      case "video":
        return <VideoConference />;
      case "ai-assistant":
        return <AIAssistant />;
      case "ai-management":
        return <AIManagement />;
      case "ai-meeting-assistant":
        return <AIMeetingDashboard />;
      case "analytics":
        return <Analytics />;
      case "team":
        return <TeamSetupGuide />;
      case "team-management":
        return <TeamManagement />;
      case "team-test":
        return <TeamTest />;
      case "team-member":
        return <TeamMemberProfile />;
      case "activity":
        return <TeamActivityFeed />;
      case "departments":
        return <DepartmentManagement />;
      case "roles":
        return <RoleManagement />;
      case "recordings":
        return <RecordingsLibrary />;
      case "recordings/player":
        return <RecordingPlayer />;
      case "recordings/details":
        return <RecordingDetails />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <DashboardLayout activePage={activePage} onPageChange={handlePageChange}>
      {renderPage()}
    </DashboardLayout>
  );
};

export default Dashboard;