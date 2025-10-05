import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Workflow, 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  Edit,
  Clock,
  User,
  Sparkles,
  GitBranch,
  ArrowRight,
  Check
} from "lucide-react";
import { useTeam } from "@/hooks/use-team";
import { useAuth } from "@/hooks/use-auth";

const WorkflowAutomation = () => {
  const { departments, roles, teamMembers } = useTeam();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
    trigger: "manual",
    steps: [] as string[]
  });

  // Mock workflow automations
  const workflowAutomations = [
    { 
      id: 1, 
      name: "New Hire Onboarding", 
      steps: 5,
      trigger: "When new team member added",
      status: "Active",
      lastRun: "1 week ago"
    },
    { 
      id: 2, 
      name: "Project Approval Process", 
      steps: 3,
      trigger: "When project submitted",
      status: "Active",
      lastRun: "3 days ago"
    },
    { 
      id: 3, 
      name: "Client Onboarding", 
      steps: 7,
      trigger: "When new client added",
      status: "Paused",
      lastRun: "2 weeks ago"
    },
  ];

  const handleCreateWorkflow = () => {
    // In a real app, this would call an API to create the workflow
    console.log("Creating workflow:", newWorkflow);
    setIsCreating(false);
    setNewWorkflow({
      name: "",
      description: "",
      trigger: "manual",
      steps: []
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Workflow className="w-6 h-6 text-primary" />
            Workflow Automation
          </h2>
          <p className="text-muted-foreground">
            Create and manage multi-step automation workflows
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Workflow
        </Button>
      </div>

      {/* Create Workflow Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Workflow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Workflow Name</Label>
              <Input
                id="name"
                value={newWorkflow.name}
                onChange={(e) => setNewWorkflow({...newWorkflow, name: e.target.value})}
                placeholder="e.g., New Hire Onboarding"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="trigger">Trigger Event</Label>
                <select
                  id="trigger"
                  className="w-full p-2 border rounded-md bg-background"
                  value={newWorkflow.trigger}
                  onChange={(e) => setNewWorkflow({...newWorkflow, trigger: e.target.value})}
                >
                  <option value="manual">Manual Trigger</option>
                  <option value="new_member">When new team member added</option>
                  <option value="new_project">When new project created</option>
                  <option value="new_client">When new client added</option>
                  <option value="deadline">When deadline approaches</option>
                </select>
              </div>
              <div>
                <Label htmlFor="steps">Number of Steps</Label>
                <Input
                  id="steps"
                  type="number"
                  min="1"
                  max="20"
                  placeholder="Enter number of steps"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newWorkflow.description}
                onChange={(e) => setNewWorkflow({...newWorkflow, description: e.target.value})}
                placeholder="Describe what this workflow automation does"
              />
            </div>

            <div>
              <Label>Workflow Steps (AI Prompt)</Label>
              <div className="space-y-3 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium">1</span>
                  </div>
                  <Input placeholder="Describe the first step in the workflow" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <Input placeholder="Describe the second step in the workflow" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <Input placeholder="Describe the third step in the workflow" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWorkflow} className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Create Workflow
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Workflows */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active Workflows</h3>
        {workflowAutomations.map((workflow) => (
          <Card key={workflow.id}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Workflow className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">{workflow.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {workflow.steps} steps • Trigger: {workflow.trigger}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last run: {workflow.lastRun}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    workflow.status === "Active" 
                      ? "bg-green-500/20 text-green-500" 
                      : "bg-yellow-500/20 text-yellow-500"
                  }`}>
                    {workflow.status}
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

      {/* Workflow Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Workflow Builder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-muted/50 rounded-lg">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <span className="font-medium">1</span>
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <span className="font-medium">2</span>
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <span className="font-medium">3</span>
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Visualize and design your automation workflows with our drag-and-drop builder
              </p>
              <Button variant="outline" className="mt-4">
                Open Workflow Builder
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI-Powered Workflow Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
              <h4 className="font-medium">Approval Workflow</h4>
              <p className="text-sm text-muted-foreground">
                Automate document and decision approval processes
              </p>
            </div>
            <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
              <h4 className="font-medium">Incident Response</h4>
              <p className="text-sm text-muted-foreground">
                Create automated incident response workflows
              </p>
            </div>
            <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
              <h4 className="font-medium">Performance Review</h4>
              <p className="text-sm text-muted-foreground">
                Automate employee performance review processes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowAutomation;