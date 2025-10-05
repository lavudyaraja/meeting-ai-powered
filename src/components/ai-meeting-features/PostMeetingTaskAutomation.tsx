import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  Calendar, 
  User, 
  Link, 
  MessageSquare, 
  Settings,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface TaskAutomationSettings {
  enabled: boolean;
  autoCreateTasks: boolean;
  autoAssignTasks: boolean;
  sendReminders: boolean;
  defaultProjectTool: string;
  reminderTime: string; // e.g., "1 day before"
}

interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  assignee: string;
  dueDateOffset: number; // days from meeting
  priority: "low" | "medium" | "high";
}

const PostMeetingTaskAutomation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<TaskAutomationSettings>({
    enabled: false,
    autoCreateTasks: true,
    autoAssignTasks: true,
    sendReminders: true,
    defaultProjectTool: "jira",
    reminderTime: "1 day before"
  });
  const [templates, setTemplates] = useState<TaskTemplate[]>([
    {
      id: "1",
      name: "Action Item Follow-up",
      description: "Follow up on action items discussed in the meeting",
      assignee: "meeting_participant",
      dueDateOffset: 3,
      priority: "medium"
    },
    {
      id: "2",
      name: "Decision Implementation",
      description: "Implement decisions made during the meeting",
      assignee: "meeting_owner",
      dueDateOffset: 5,
      priority: "high"
    }
  ]);
  const [newTemplate, setNewTemplate] = useState<Omit<TaskTemplate, "id">>({
    name: "",
    description: "",
    assignee: "",
    dueDateOffset: 3,
    priority: "medium"
  });

  const handleToggleChange = (field: keyof TaskAutomationSettings, checked: boolean) => {
    const newSettings = { ...settings, [field]: checked };
    setSettings(newSettings);
    // In a real implementation, we would save to database here
  };

  const handleToolChange = (tool: string) => {
    const newSettings = { ...settings, defaultProjectTool: tool };
    setSettings(newSettings);
    // In a real implementation, we would save to database here
  };

  const handleAddTemplate = () => {
    if (!newTemplate.name || !newTemplate.assignee) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const template: TaskTemplate = {
      ...newTemplate,
      id: Date.now().toString()
    };

    setTemplates([...templates, template]);
    setNewTemplate({
      name: "",
      description: "",
      assignee: "",
      dueDateOffset: 3,
      priority: "medium"
    });

    toast({
      title: "Success",
      description: "Task template added successfully"
    });
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
    toast({
      title: "Success",
      description: "Task template deleted"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Post-Meeting Task Automation
        </CardTitle>
        <CardDescription>
          Automatically create and assign tasks from meeting action items
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Enable Task Automation</h3>
            <p className="text-sm text-muted-foreground">
              Automatically create tasks from meeting action items
            </p>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(checked) => handleToggleChange("enabled", checked)}
          />
        </div>

        {settings.enabled && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Auto-Create Tasks</h3>
                <p className="text-sm text-muted-foreground">
                  Create tasks from action items in meeting transcripts
                </p>
              </div>
              <Switch
                checked={settings.autoCreateTasks}
                onCheckedChange={(checked) => handleToggleChange("autoCreateTasks", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Auto-Assign Tasks</h3>
                <p className="text-sm text-muted-foreground">
                  Assign tasks based on who committed to them
                </p>
              </div>
              <Switch
                checked={settings.autoAssignTasks}
                onCheckedChange={(checked) => handleToggleChange("autoAssignTasks", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Send Reminders</h3>
                <p className="text-sm text-muted-foreground">
                  Send reminders before task deadlines
                </p>
              </div>
              <Switch
                checked={settings.sendReminders}
                onCheckedChange={(checked) => handleToggleChange("sendReminders", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label>Default Project Management Tool</Label>
              <div className="grid grid-cols-3 gap-2">
                {["jira", "asana", "monday"].map((tool) => (
                  <Button
                    key={tool}
                    variant={settings.defaultProjectTool === tool ? "default" : "outline"}
                    className="capitalize"
                    onClick={() => handleToolChange(tool)}
                  >
                    {tool}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Reminder Time</Label>
              <Input
                value={settings.reminderTime}
                onChange={(e) => setSettings({...settings, reminderTime: e.target.value})}
                placeholder="e.g., 1 day before, 2 hours before"
              />
            </div>

            <div className="pt-4">
              <h3 className="font-medium mb-2">Task Templates</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Define templates for common task types
              </p>
              
              <div className="space-y-3">
                {templates.map((template) => (
                  <div key={template.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{template.name}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        Delete
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                    <div className="flex gap-4 mt-2 text-xs">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {template.assignee}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {template.dueDateOffset} days
                      </span>
                      <span className="capitalize">{template.priority}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 border rounded-lg">
                <h4 className="font-medium mb-2">Add New Template</h4>
                <div className="space-y-2">
                  <Input
                    placeholder="Template name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  />
                  <Textarea
                    placeholder="Template description"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Assignee"
                      value={newTemplate.assignee}
                      onChange={(e) => setNewTemplate({...newTemplate, assignee: e.target.value})}
                    />
                    <Input
                      type="number"
                      placeholder="Due date offset (days)"
                      value={newTemplate.dueDateOffset}
                      onChange={(e) => setNewTemplate({...newTemplate, dueDateOffset: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <Button onClick={handleAddTemplate} className="w-full">
                    Add Template
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4">
          <Button className="w-full" variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Advanced Task Automation Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostMeetingTaskAutomation;