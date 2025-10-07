import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
// import DashboardOverview from "@/components/dashboard/DashboardOverview";
// import MeetingsList from "@/components/dashboard/MeetingsList";
// import TasksManager from "@/components/dashboard/TasksManager";
// import VideoConference from "@/components/dashboard/video-conference/VideoConference";
// import AIAssistant from "@/components/dashboard/AIAssistant";
// import AIMeetingDashboard from "@/components/ai-meeting-features/AIMeetingDashboard";
// import Analytics from "@/components/dashboard/Analytics";
// import { TeamManagement } from "@/components/dashboard/team";
// import { TeamMemberProfile } from "@/components/dashboard/team";
// import { TeamActivityFeed } from "@/components/dashboard/team";
// import { DepartmentManagement } from "@/components/dashboard/team";
// import { RoleManagement } from "@/components/dashboard/team";
// import { TeamSetupGuide } from "@/components/dashboard/team";
// import { TeamTest } from "@/components/dashboard/team";
// import { RecordingsLibrary } from "@/components/dashboard/recordings";
// import { RecordingPlayer } from "@/components/dashboard/recordings";
// import { RecordingDetails } from "@/components/dashboard/recordings";
// import { AIManagement } from "@/components/dashboard/ai-management";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handlePageChange = (page: string) => {
    if (page === "settings") {
      // Navigate to the dedicated settings page
      navigate("/settings");
    } else {
      // Handle other page changes normally
      // Navigation is now handled by React Router
    }
  };

  return (
    <DashboardLayout onPageChange={handlePageChange}>
      <Outlet />
    </DashboardLayout>
  );
};

export default Dashboard;