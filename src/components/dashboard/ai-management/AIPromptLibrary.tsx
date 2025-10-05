import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  Plus, 
  Copy, 
  Edit,
  Trash2,
  Sparkles,
  Search,
  Folder,
  Tag
} from "lucide-react";

const AIPromptLibrary = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newPrompt, setNewPrompt] = useState({
    name: "",
    description: "",
    category: "general",
    content: ""
  });

  // Mock prompt categories
  const categories = [
    { id: "general", name: "General", count: 12 },
    { id: "meetings", name: "Meetings", count: 8 },
    { id: "tasks", name: "Tasks", count: 6 },
    { id: "workflows", name: "Workflows", count: 4 },
    { id: "team", name: "Team Management", count: 5 },
  ];

  // Mock prompts
  const prompts = [
    { 
      id: 1, 
      name: "Meeting Agenda Generator", 
      category: "meetings",
      description: "Generate a structured agenda for team meetings",
      content: "Create a meeting agenda with the following topics: 1. Project updates, 2. Roadblocks discussion, 3. Upcoming deadlines, 4. Action items. Include time allocations for each topic.",
      usage: 42
    },
    { 
      id: 2, 
      name: "Task Prioritization", 
      category: "tasks",
      description: "Help prioritize tasks based on urgency and impact",
      content: "Analyze the following tasks and prioritize them based on business impact and urgency. Consider dependencies between tasks.",
      usage: 28
    },
    { 
      id: 3, 
      name: "Team Onboarding", 
      category: "team",
      description: "Create a comprehensive onboarding plan for new team members",
      content: "Generate a 30-60-90 day onboarding plan for a new team member. Include key milestones, training requirements, and success metrics.",
      usage: 15
    },
    { 
      id: 4, 
      name: "Project Status Update", 
      category: "workflows",
      description: "Generate a professional project status update",
      content: "Create a project status update including: 1. Overall progress percentage, 2. Key accomplishments this week, 3. Upcoming milestones, 4. Risks and blockers, 5. Resource needs.",
      usage: 36
    },
  ];

  const handleCreatePrompt = () => {
    // In a real app, this would call an API to create the prompt
    console.log("Creating prompt:", newPrompt);
    setIsCreating(false);
    setNewPrompt({
      name: "",
      description: "",
      category: "general",
      content: ""
    });
  };

  const filteredPrompts = prompts.filter(prompt => 
    prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            AI Prompt Library
          </h2>
          <p className="text-muted-foreground">
            Manage and organize your AI prompts for automation
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Prompt
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search prompts..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button 
                  key={category.id} 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  {category.name}
                  <span className="bg-muted text-muted-foreground text-xs rounded-full px-1.5">
                    {category.count}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Prompt Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Prompt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prompt-name">Prompt Name</Label>
                <Input
                  id="prompt-name"
                  value={newPrompt.name}
                  onChange={(e) => setNewPrompt({...newPrompt, name: e.target.value})}
                  placeholder="e.g., Meeting Agenda Generator"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full p-2 border rounded-md bg-background"
                  value={newPrompt.category}
                  onChange={(e) => setNewPrompt({...newPrompt, category: e.target.value})}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newPrompt.description}
                onChange={(e) => setNewPrompt({...newPrompt, description: e.target.value})}
                placeholder="Brief description of what this prompt does"
              />
            </div>

            <div>
              <Label htmlFor="content">Prompt Content</Label>
              <Textarea
                id="content"
                value={newPrompt.content}
                onChange={(e) => setNewPrompt({...newPrompt, content: e.target.value})}
                placeholder="Enter your AI prompt here..."
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePrompt} className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Create Prompt
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prompt List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Saved Prompts</h3>
          <p className="text-sm text-muted-foreground">
            {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {filteredPrompts.map((prompt) => (
          <Card key={prompt.id}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{prompt.name}</h3>
                    <span className="px-2 py-1 rounded-full text-xs bg-primary/20 text-primary">
                      {categories.find(c => c.id === prompt.category)?.name}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {prompt.description}
                  </p>
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="text-xs whitespace-pre-wrap font-mono">
                      {prompt.content}
                    </pre>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Copy className="w-3 h-3" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                  <div className="text-xs text-muted-foreground text-center mt-2">
                    Used {prompt.usage} times
                  </div>
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
            AI-Powered Prompt Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
              <h4 className="font-medium">Conflict Resolution</h4>
              <p className="text-sm text-muted-foreground">
                Generate strategies for resolving team conflicts
              </p>
            </div>
            <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
              <h4 className="font-medium">Performance Feedback</h4>
              <p className="text-sm text-muted-foreground">
                Create constructive performance feedback templates
              </p>
            </div>
            <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
              <h4 className="font-medium">Resource Allocation</h4>
              <p className="text-sm text-muted-foreground">
                Optimize team resource allocation based on project needs
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPromptLibrary;