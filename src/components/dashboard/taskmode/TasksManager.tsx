import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Circle, Plus, Calendar, Edit, Trash, Share2, Sparkles, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import TaskDialog from "@/components/dashboard/taskmode/TaskDialog";
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

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
}

const TasksManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Add state for AI suggestions
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks(data || []);
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

  const toggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", taskId);

      if (error) throw error;

      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
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
    const shareUrl = `${window.location.origin}/task/${task.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({ title: "Task link copied to clipboard" });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-500";
      case "high":
        return "bg-orange-500/20 text-orange-500";
      case "medium":
        return "bg-yellow-500/20 text-yellow-500";
      case "low":
        return "bg-green-500/20 text-green-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  // Add function for AI-powered task suggestions
  const generateTaskSuggestions = async () => {
    setGeneratingSuggestions(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [
            {
              role: "user",
              content: "Generate 3 actionable task suggestions based on common meeting outcomes. Return as a simple list with one task per line."
            }
          ]
        }
      });

      if (error) throw error;

      // Parse the suggestions (assuming they're returned as a list)
      const suggestions = data.message.split('\n').filter(line => line.trim() !== '');
      setAiSuggestions(suggestions.slice(0, 3)); // Take only first 3 suggestions

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

  return (
   <div className="space-y-6">
  {/* Header */}
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
    <div>
      <h2 className="text-3xl font-bold">Tasks</h2>
      <p className="text-muted-foreground">Manage your action items</p>
    </div>
    <div className="flex flex-col sm:flex-row lg:flex-row gap-2">
      <Button
        variant="outline"
        onClick={generateTaskSuggestions}
        disabled={generatingSuggestions}
      >
        {generatingSuggestions ? "Generating..." : "AI Suggestions"}
      </Button>
      <Button
        variant="hero"
        onClick={() => {
          setSelectedTask(null);
          setDialogOpen(true);
        }}
      >
        <Plus className="w-5 h-5" />
        New Task
      </Button>
    </div>
  </div>

  {/* AI Task Suggestions */}
  {aiSuggestions.length > 0 && (
    <Card className="glass-effect p-4 border-primary/20">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-3 gap-2">
        <h3 className="font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          AI Task Suggestions
        </h3>
        <Button variant="ghost" size="sm" onClick={() => setAiSuggestions([])}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row lg:flex-wrap gap-2">
        {aiSuggestions.map((suggestion, index) => (
          <div
            key={index}
            className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors gap-2 flex-1"
          >
            <span className="text-sm">{suggestion}</span>
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

  {/* Tasks Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {loading ? (
      <Card className="glass-effect p-8 text-center">
        <p className="text-muted-foreground">Loading tasks...</p>
      </Card>
    ) : tasks.length === 0 ? (
      <Card className="glass-effect p-12 text-center">
        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
        <p className="text-muted-foreground mb-6">
          AI will automatically create tasks from your meetings
        </p>
        <Button variant="hero">Create Task</Button>
      </Card>
    ) : (
      tasks.map((task, index) => (
        <Card
          key={task.id}
          className="glass-effect p-6 hover:shadow-glow transition-all animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
            <button onClick={() => toggleTask(task.id, task.status)} className="mt-1">
              {task.status === "completed" ? (
                <CheckCircle className="w-5 h-5 text-primary" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
              )}
            </button>

            <div className="flex-1 flex flex-col gap-2">
              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                <h3
                  className={`text-lg font-semibold ${
                    task.status === "completed"
                      ? "line-through text-muted-foreground"
                      : ""
                  }`}
                >
                  {task.title}
                </h3>
                <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
              </div>

              {task.description && <p className="text-muted-foreground">{task.description}</p>}

              {task.due_date && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Due: {format(new Date(task.due_date), "MMM dd, yyyy")}
                </div>
              )}
            </div>

            <div className="flex flex-row lg:flex-col gap-2 lg:gap-1">
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
        </Card>
      ))
    )}
  </div>

  {/* Dialogs */}
  <TaskDialog open={dialogOpen} onOpenChange={setDialogOpen} task={selectedTask} onSuccess={fetchTasks} />

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

export default TasksManager;
