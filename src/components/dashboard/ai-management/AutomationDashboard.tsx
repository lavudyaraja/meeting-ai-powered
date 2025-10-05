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
  BarChart3,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { useTeam } from "@/hooks/use-team";
import { useAuth } from "@/hooks/use-auth";
import { useAIManagement } from "@/hooks/use-ai-management";

const AutomationDashboard = () => {
  const { departments, roles, teamMembers } = useTeam();
  const { user } = useAuth();
  const { automations, promptTemplates } = useAIManagement();
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock automation stats
  const automationStats = [
    { name: "Active Automations", value: automations.length.toString(), change: "+2" },
    { name: "Tasks Automated", value: "142", change: "+18" },
    { name: "Meetings Scheduled", value: "24", change: "+3" },
    { name: "Time Saved", value: "18h", change: "+2.5h" },
  ];

  // Use actual automations data
  const recentAutomations = automations.map(automation => ({
    id: automation.id,
    name: automation.name,
    type: automation.type,
    status: automation.status,
    lastRun: "2 hours ago"
  }));

  const handleRunAutomation = async () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Automation Dashboard
          </h2>
          <p className="text-muted-foreground">
            Overview of your AI-powered automations
          </p>
        </div>
        <Button 
          onClick={handleRunAutomation} 
          disabled={isProcessing}
          className="flex items-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run All Automations
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {automationStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Automations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Recent Automations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAutomations.map((automation) => (
              <div key={automation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{automation.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {automation.type} • Last run: {automation.lastRun}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    automation.status === "active" 
                      ? "bg-green-500/20 text-green-500" 
                      : automation.status === "paused"
                      ? "bg-blue-500/20 text-blue-500"
                      : "bg-yellow-500/20 text-yellow-500"
                  }`}>
                    {automation.status}
                  </span>
                  <Button variant="ghost" size="icon">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:bg-accent transition-colors cursor-pointer">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium">Schedule Meeting</h3>
              <p className="text-sm text-muted-foreground">Automate recurring meetings</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:bg-accent transition-colors cursor-pointer">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium">Create Task</h3>
              <p className="text-sm text-muted-foreground">Automate task assignments</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:bg-accent transition-colors cursor-pointer">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Workflow className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h3 className="font-medium">Build Workflow</h3>
              <p className="text-sm text-muted-foreground">Create custom automation workflows</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutomationDashboard;