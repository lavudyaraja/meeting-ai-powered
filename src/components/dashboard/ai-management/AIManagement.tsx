import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
  Calendar, 
  CheckSquare, 
  Workflow, 
  Sparkles, 
  Zap,
  Brain,
  Settings,
  BarChart3
} from "lucide-react";
import  AutomationDashboard  from "./AutomationDashboard";
import  MeetingAutomation  from "./MeetingAutomation";
import  TaskAutomation  from "./TaskAutomation";
import  WorkflowAutomation  from "./WorkflowAutomation";
import  AIPromptLibrary  from "./AIPromptLibrary";

const AIManagement = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AutomationDashboard />;
      case "meetings":
        return <MeetingAutomation />;
      case "tasks":
        return <TaskAutomation />;
      case "workflows":
        return <WorkflowAutomation />;
      case "prompts":
        return <AIPromptLibrary />;
      default:
        return <AutomationDashboard />;
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "meetings", label: "Meeting Automation", icon: Calendar },
    { id: "tasks", label: "Task Automation", icon: CheckSquare },
    { id: "workflows", label: "Workflow Automation", icon: Workflow },
    { id: "prompts", label: "Prompt Library", icon: Brain },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bot className="w-8 h-8 text-primary" />
          AI Automation Management
        </h1>
        <p className="text-muted-foreground">
          Manage and configure AI-powered automation for meetings, tasks, and workflows
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              className="flex items-center gap-2"
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Content Area */}
      <Card>
        <CardContent className="p-6">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIManagement;