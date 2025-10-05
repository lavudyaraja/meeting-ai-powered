import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckSquare, 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  Edit,
  Clock,
  User,
  Sparkles,
  Calendar
} from "lucide-react";
import { useTeam } from "@/hooks/use-team";
import { useAuth } from "@/hooks/use-auth";

const TaskAutomation = () => {
  const { departments, roles, teamMembers } = useTeam();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    description: "",
    assignee: "",
    dueDate: "",
    priority: "medium",
    trigger: "manual",
    condition: ""
  });

  // Mock task automations
  const taskAutomations = [
    { 
      id: 1, 
      name: "Weekly Report Generation", 
      assignee: "All Team Members", 
      due: "Every Friday",
      priority: "High",
      status: "Active",
      lastRun: "2 days ago"
    },
    { 
      id: 2, 
      name: "Client Follow-up", 
      assignee: "Sales Team", 
      due: "2 days after contact",
      priority: "Medium",
      status: "Active",
      lastRun: "1 week ago"
    },
    { 
      id: 3, 
      name: "Project Status Update", 
      assignee: "Project Managers", 
      due: "Every Monday",
      priority: "High",
      status: "Paused",
      lastRun: "3 weeks ago"
    },
  ];

  const handleCreateAutomation = () => {
    // In a real app, this would call an API to create the automation
    console.log("Creating task automation:", newAutomation);
    setIsCreating(false);
    setNewAutomation({
      name: "",
      description: "",
      assignee: "",
      dueDate: "",
      priority: "medium",
      trigger: "manual",
      condition: ""
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-primary" />
            Task Automation
          </h2>
          <p className="text-muted-foreground">
            Automate task creation and assignment
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Automation
        </Button>
      </div>

      {/* Create Automation Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Task Automation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Automation Name</Label>
                <Input
                  id="name"
                  value={newAutomation.name}
                  onChange={(e) => setNewAutomation({...newAutomation, name: e.target.value})}
                  placeholder="e.g., Weekly Report Generation"
                />
              </div>
              <div>
                <Label htmlFor="assignee">Assignee</Label>
                <select
                  id="assignee"
                  className="w-full p-2 border rounded-md bg-background"
                  value={newAutomation.assignee}
                  onChange={(e) => setNewAutomation({...newAutomation, assignee: e.target.value})}
                >
                  <option value="">Select assignee</option>
                  <option value="self">Myself</option>
                  <option value="team">All Team Members</option>
                  {teamMembers.map(member => (
                    <option key={member.user_id} value={member.user_id}>
                      {member.user_profiles?.full_name || member.user_profiles?.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  className="w-full p-2 border rounded-md bg-background"
                  value={newAutomation.priority}
                  onChange={(e) => setNewAutomation({...newAutomation, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="text"
                  value={newAutomation.dueDate}
                  onChange={(e) => setNewAutomation({...newAutomation, dueDate: e.target.value})}
                  placeholder="e.g., Every Friday"
                />
              </div>
              <div>
                <Label htmlFor="trigger">Trigger</Label>
                <select
                  id="trigger"
                  className="w-full p-2 border rounded-md bg-background"
                  value={newAutomation.trigger}
                  onChange={(e) => setNewAutomation({...newAutomation, trigger: e.target.value})}
                >
                  <option value="manual">Manual</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="event">Event-based</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newAutomation.description}
                onChange={(e) => setNewAutomation({...newAutomation, description: e.target.value})}
                placeholder="Describe what this task automation does"
              />
            </div>

            <div>
              <Label htmlFor="condition">Automation Condition (AI Prompt)</Label>
              <Textarea
                id="condition"
                value={newAutomation.condition}
                onChange={(e) => setNewAutomation({...newAutomation, condition: e.target.value})}
                placeholder="Describe the conditions under which this task should be created"
                className="min-h-[120px]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAutomation} className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Create Automation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Automations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active Automations</h3>
        {taskAutomations.map((automation) => (
          <Card key={automation.id}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckSquare className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">{automation.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Assignee: {automation.assignee} • Due: {automation.due}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        automation.priority === "High" 
                          ? "bg-red-500/20 text-red-500" 
                          : automation.priority === "Medium"
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-blue-500/20 text-blue-500"
                      }`}>
                        {automation.priority} Priority
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Last run: {automation.lastRun}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    automation.status === "Active" 
                      ? "bg-green-500/20 text-green-500" 
                      : "bg-yellow-500/20 text-yellow-500"
                  }`}>
                    {automation.status}
                  </span>
                  <Button variant="ghost" size="icon">
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI-Powered Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
              <h4 className="font-medium">Task Prioritization</h4>
              <p className="text-sm text-muted-foreground">
                Automatically prioritize tasks based on deadlines and project importance
              </p>
            </div>
            <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
              <h4 className="font-medium">Workload Balancing</h4>
              <p className="text-sm text-muted-foreground">
                Distribute tasks evenly across team members based on current workload
              </p>
            </div>
            <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
              <h4 className="font-medium">Dependency Tracking</h4>
              <p className="text-sm text-muted-foreground">
                Automatically identify and manage task dependencies
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskAutomation;