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
import Meetings from "./pages/Meetings";
import ParticipantJoinPage from "./pages/ParticipantJoinPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
// Dashboard components
import DashboardOverview from "./components/dashboard/overview/DashboardOverview";
import MeetingsList from "./components/dashboard/MeetingsList";
import TasksManager from "./components/dashboard/taskmode/TasksManager";
// import  VideoConference  from "./components/dashboard/video-conference";
import SimpleVideoConference from "./components/dashboard/video-conference/SimpleVideoConference";
import RecordingsLibrary from "./components/dashboard/recordings/RecordingsLibrary";
import AIAssistant from "./components/dashboard/AIAssistant";
// Meetings components
import { MeetingViewer } from "./components/meetings";
import MeetingDialog from "./components/dashboard/MeetingDialog";

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
            <Route path="video-conference" element={<SimpleVideoConference />} />
            <Route path="recordings" element={<RecordingsLibrary />} />
          </Route>
          {/* Meetings Routes */}
          <Route
            path="/meetings"
            element={
              <ProtectedRoute>
                <Meetings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meetings/create"
            element={
              <ProtectedRoute>
                <MeetingDialog open={true} onOpenChange={() => {}} onSuccess={() => {}} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meetings/:id"
            element={
              <ProtectedRoute>
                <MeetingViewer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/join/:id"
            element={<ParticipantJoinPage />}
          />
          <Route
            path="/video/:id"
            element={
              <ProtectedRoute>
                <SimpleVideoConference />
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;