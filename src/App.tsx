import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import AIMeetingAssistant from "./pages/AIMeetingAssistant";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { TeamTest } from "@/components/dashboard/team";
import MeetingShowcase from "./components/meetings/MeetingShowcase";
import ParticipantJoinPage from "./pages/ParticipantJoinPage";
// Dashboard components
import DashboardOverview from "./components/dashboard/DashboardOverview";
import MeetingsList from "./components/dashboard/MeetingsList";
import TasksManager from "./components/dashboard/TasksManager";
import VideoConference from "./components/dashboard/video-conference/VideoConference";
import AIManagement from "./components/dashboard/ai-management/AIManagement";
import Analytics from "./components/dashboard/Analytics";
import TeamManagement from "./components/dashboard/team/TeamManagement";
import TeamActivityFeed from "./components/dashboard/team/TeamActivityFeed";
import DepartmentManagement from "./components/dashboard/team/DepartmentManagement";
import RoleManagement from "./components/dashboard/team/RoleManagement";
import RecordingsLibrary from "./components/dashboard/recordings/RecordingsLibrary";
import AIAssistant from "./components/dashboard/AIAssistant";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/*" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="overview" element={<DashboardOverview />} />
            <Route path="meetings" element={<MeetingsList />} />
            <Route path="tasks" element={<TasksManager />} />
            <Route path="ai-assistant" element={<AIAssistant />} />
            <Route path="video-conference" element={<VideoConference />} />
            <Route path="ai-management" element={<AIManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="team" element={<TeamManagement />} />
            <Route path="activity" element={<TeamActivityFeed />} />
            <Route path="departments" element={<DepartmentManagement />} />
            <Route path="roles" element={<RoleManagement />} />
            <Route path="recordings" element={<RecordingsLibrary />} />
          </Route>
          <Route
            path="/team-test"
            element={
              <ProtectedRoute>
                <TeamTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-meeting-assistant"
            element={
              <ProtectedRoute>
                <AIMeetingAssistant />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meeting-showcase"
            element={
              <ProtectedRoute>
                <MeetingShowcase />
              </ProtectedRoute>
            }
          />
          <Route
            path="/join-meeting"
            element={<ParticipantJoinPage />}
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;