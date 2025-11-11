import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Circle, 
  Plus, 
  Calendar, 
  Edit, 
  Trash, 
  Share2, 
  Sparkles, 
  X, 
  Filter,
  Search,
  Clock,
  User,
  TrendingUp,
  BarChart3,
  Brain,
  Lightbulb,
  Target,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import EnhancedTaskDialog from "./EnhancedTaskDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  created_by: string;
  assigned_to: string | null;
  meeting_id: string | null;
  created_at: string;
  updated_at: string | null;
}

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  overdue: number;
}

const EnhancedTasksManager = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [stats, setStats] = useState<TaskStats>({ total: 0, completed: 0, pending: 0, inProgress: 0, overdue: 0 });
  const { toast } = useToast();

  // AI features
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [generatingInsights, setGeneratingInsights] = useState(false);

  // Filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("due_date");

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterAndSortTasks();
  }, [tasks, searchTerm, statusFilter, priorityFilter, sortBy]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setTasks(data || []);
      calculateStats(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching tasks",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (tasks: Task[]) => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === "completed").length;
    const inProgress = tasks.filter(task => task.status === "in_progress").length;
    const pending = tasks.filter(task => task.status === "pending").length;
    const overdue = tasks.filter(task => 
      task.due_date && isPast(new Date(task.due_date)) && task.status !== "completed"
    ).length;

    setStats({ total, completed, pending, inProgress, overdue });
  };

  const filterAndSortTasks = () => {
    let result = [...tasks];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(task => task.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      result = result.filter(task => task.priority === priorityFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "due_date":
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        case "priority":
          const priorityOrder: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "created_at":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    setFilteredTasks(result);
  };

  const toggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", taskId);

      if (error) throw error;

      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus, updated_at: new Date().toISOString() } : task
        )
      );

      toast({
        title: "Task updated",
        description: `Task marked as ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!taskToDelete) return;

    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskToDelete);

      if (error) throw error;

      setTasks(tasks.filter((task) => task.id !== taskToDelete));
      toast({ title: "Task deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleShare = (task: Task) => {
    const shareUrl = `${window.location.origin}/dashboard/tasks/${task.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({ title: "Task link copied to clipboard" });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-500 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-500 border-orange-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-500 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-500 border-green-500/30";
      case "in_progress":
        return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      case "pending":
        return "bg-gray-500/20 text-gray-500 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/30";
    }
  };

  const getDueDateStatus = (dueDate: string | null) => {
    if (!dueDate) return { text: "No due date", color: "text-gray-500" };
    
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) {
      return { text: `Overdue ${format(date, "MMM dd")}`, color: "text-red-500" };
    } else if (isToday(date)) {
      return { text: "Today", color: "text-orange-500" };
    } else if (isTomorrow(date)) {
      return { text: "Tomorrow", color: "text-blue-500" };
    } else {
      return { text: format(date, "MMM dd"), color: "text-gray-500" };
    }
  };

  // AI-powered task suggestions
  const generateTaskSuggestions = async () => {
    setGeneratingSuggestions(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [
            {
              role: "user",
              content: "Generate 5 actionable task suggestions based on common meeting outcomes. Each task should be specific and actionable. Return as a simple list with one task per line."
            }
          ]
        }
      });

      if (error) throw error;

      // Parse the suggestions (assuming they're returned as a list)
      const suggestions = data.message.split('\n').filter(line => line.trim() !== '');
      setAiSuggestions(suggestions.slice(0, 5)); // Take only first 5 suggestions

      toast({
        title: "Success",
        description: "AI task suggestions generated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate task suggestions",
        variant: "destructive",
      });
    } finally {
      setGeneratingSuggestions(false);
    }
  };

  // AI-powered insights and recommendations
  const generateAiInsights = async () => {
    setGeneratingInsights(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [
            {
              role: "user",
              content: `Analyze these tasks and provide 3 insights or recommendations for improving productivity. Tasks: ${tasks.map(t => t.title).join(', ')}. Return as a simple list with one insight per line.`
            }
          ]
        }
      });

      if (error) throw error;

      // Parse the insights
      const insights = data.message.split('\n').filter(line => line.trim() !== '');
      setAiInsights(insights.slice(0, 3)); // Take only first 3 insights

      toast({
        title: "Success",
        description: "AI insights generated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate AI insights",
        variant: "destructive",
      });
    } finally {
      setGeneratingInsights(false);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent": return <AlertCircle className="w-4 h-4" />;
      case "high": return <TrendingUp className="w-4 h-4" />;
      case "medium": return <Target className="w-4 h-4" />;
      case "low": return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Task Management</h2>
          <p className="text-muted-foreground">Manage your action items and track progress</p>
        </div>
        <div className="flex flex-col sm:flex-row lg:flex-row gap-2">
          <Button
            variant="outline"
            onClick={generateAiInsights}
            disabled={generatingInsights}
          >
            {generatingInsights ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Generating Insights...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                AI Insights
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={generateTaskSuggestions}
            disabled={generatingSuggestions}
          >
            {generatingSuggestions ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                AI Suggestions
              </>
            )}
          </Button>
          <Button
            variant="hero"
            onClick={() => {
              setSelectedTask(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="w-5 h-5 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <Card className="glass-effect p-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.inProgress}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-500">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{stats.overdue}</div>
            <div className="text-sm text-muted-foreground">Overdue</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Completion Rate</span>
            <span>{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </Card>

      {/* AI Insights */}
      {aiInsights.length > 0 && (
        <Card className="glass-effect p-6 border-primary/20">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 gap-2">
            <h3 className="font-semibold flex items-center gap-2 text-lg">
              <Lightbulb className="w-5 h-5 text-primary" />
              AI Insights & Recommendations
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setAiInsights([])}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <p className="text-sm">{insight}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* AI Task Suggestions */}
      {aiSuggestions.length > 0 && (
        <Card className="glass-effect p-6 border-primary/20">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 gap-2">
            <h3 className="font-semibold flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Task Suggestions
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setAiSuggestions([])}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex flex-col p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors gap-3"
              >
                <p className="text-sm flex-1">{suggestion}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedTask({
                      id: "",
                      title: suggestion,
                      description: "",
                      status: "pending",
                      priority: "medium",
                      due_date: null,
                      created_by: "",
                      assigned_to: null,
                      meeting_id: null,
                      created_at: new Date().toISOString(),
                      updated_at: null,
                    });
                    setDialogOpen(true);
                  }}
                >
                  Add Task
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Filters and Search */}
      <Card className="glass-effect p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search tasks..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Statuses</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("in_progress")}>In Progress</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("completed")}>Completed</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Priority
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setPriorityFilter("all")}>All Priorities</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("urgent")}>Urgent</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("high")}>High</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>Medium</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("low")}>Low</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("due_date")}>Due Date</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("priority")}>Priority</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("created_at")}>Creation Date</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <Card className="glass-effect p-8 text-center col-span-full">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-muted-foreground">Loading tasks...</p>
            </div>
          </Card>
        ) : filteredTasks.length === 0 ? (
          <Card className="glass-effect p-12 text-center col-span-full">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all" 
                ? "Try adjusting your filters" 
                : "Create your first task to get started"}
            </p>
            <Button 
              variant="hero"
              onClick={() => {
                setSelectedTask(null);
                setDialogOpen(true);
              }}
            >
              Create Task
            </Button>
          </Card>
        ) : (
          filteredTasks.map((task, index) => (
            <Card
              key={task.id}
              className="glass-effect p-6 hover:shadow-glow transition-all animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => navigate(`/dashboard/tasks/${task.id}`)}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <button onClick={() => toggleTask(task.id, task.status)} className="mt-1">
                    {task.status === "completed" ? (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <h3
                      className={`font-semibold ${
                        task.status === "completed"
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(task)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleShare(task)}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setTaskToDelete(task.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge className={getPriorityColor(task.priority)} variant="outline">
                    <span className="flex items-center gap-1">
                      {getPriorityIcon(task.priority)}
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </Badge>
                  
                  <Badge className={getStatusColor(task.status)} variant="outline">
                    {task.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Badge>
                  
                  {task.due_date && (
                    <Badge 
                      variant="outline" 
                      className={getDueDateStatus(task.due_date).color}
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      {getDueDateStatus(task.due_date).text}
                    </Badge>
                  )}
                </div>
                
                {task.meeting_id && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="w-3 h-3" />
                    <span>Linked to meeting</span>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Dialogs */}
      <EnhancedTaskDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        task={selectedTask} 
        onSuccess={() => {
          fetchTasks();
          generateAiInsights(); // Regenerate insights when tasks change
        }} 
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="glass-effect">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EnhancedTasksManager;