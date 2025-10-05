import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  Edit,
  Clock,
  Users,
  Sparkles
} from "lucide-react";
import { useTeam } from "@/hooks/use-team";
import { useAuth } from "@/hooks/use-auth";

const MeetingAutomation = () => {
  const { departments, roles, teamMembers } = useTeam();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    description: "",
    frequency: "weekly",
    dayOfWeek: "monday",
    time: "10:00",
    participants: [] as string[],
    agenda: ""
  });

  // Mock meeting automations
  const meetingAutomations = [
    { 
      id: 1, 
      name: "Weekly Team Sync", 
      frequency: "Weekly", 
      time: "Mon 10:00 AM", 
      participants: 8,
      status: "Active",
      nextRun: "2 days"
    },
    { 
      id: 2, 
      name: "Project Standup", 
      frequency: "Daily", 
      time: "Mon-Fri 9:00 AM", 
      participants: 5,
      status: "Active",
      nextRun: "Tomorrow"
    },
    { 
      id: 3, 
      name: "Client Review", 
      frequency: "Monthly", 
      time: "1st of month 2:00 PM", 
      participants: 3,
      status: "Paused",
      nextRun: "3 weeks"
    },
  ];

  const handleCreateAutomation = () => {
    // In a real app, this would call an API to create the automation
    console.log("Creating meeting automation:", newAutomation);
    setIsCreating(false);
    setNewAutomation({
      name: "",
      description: "",
      frequency: "weekly",
      dayOfWeek: "monday",
      time: "10:00",
      participants: [],
      agenda: ""
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            Meeting Automation
          </h2>
          <p className="text-muted-foreground">
            Automate recurring meetings and scheduling
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
            <CardTitle>Create New Meeting Automation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Automation Name</Label>
                <Input
                  id="name"
                  value={newAutomation.name}
                  onChange={(e) => setNewAutomation({...newAutomation, name: e.target.value})}
                  placeholder="e.g., Weekly Team Sync"
                />
              </div>
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <select
                  id="frequency"
                  className="w-full p-2 border rounded-md bg-background"
                  value={newAutomation.frequency}
                  onChange={(e) => setNewAutomation({...newAutomation, frequency: e.target.value})}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dayOfWeek">Day</Label>
                <select
                  id="dayOfWeek"
                  className="w-full p-2 border rounded-md bg-background"
                  value={newAutomation.dayOfWeek}
                  onChange={(e) => setNewAutomation({...newAutomation, dayOfWeek: e.target.value})}
                >
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newAutomation.time}
                  onChange={(e) => setNewAutomation({...newAutomation, time: e.target.value})}
                />
              </div>
              <div>
                <Label>Participants</Label>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {teamMembers.length} team members
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newAutomation.description}
                onChange={(e) => setNewAutomation({...newAutomation, description: e.target.value})}
                placeholder="Describe what this meeting automation does"
              />
            </div>

            <div>
              <Label htmlFor="agenda">Meeting Agenda (AI Prompt)</Label>
              <Textarea
                id="agenda"
                value={newAutomation.agenda}
                onChange={(e) => setNewAutomation({...newAutomation, agenda: e.target.value})}
                placeholder="Describe the agenda for AI to generate meeting structure"
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
        {meetingAutomations.map((automation) => (
          <Card key={automation.id}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">{automation.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {automation.frequency} • {automation.time} • {automation.participants} participants
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Next run: {automation.nextRun}
                    </p>
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
              <h4 className="font-medium">Optimize Meeting Schedule</h4>
              <p className="text-sm text-muted-foreground">
                Analyze team availability to suggest optimal meeting times
              </p>
            </div>
            <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
              <h4 className="font-medium">Automate Agenda Creation</h4>
              <p className="text-sm text-muted-foreground">
                Generate meeting agendas based on project updates and tasks
              </p>
            </div>
            <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
              <h4 className="font-medium">Meeting Summary Automation</h4>
              <p className="text-sm text-muted-foreground">
                Automatically create and distribute meeting summaries
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingAutomation;