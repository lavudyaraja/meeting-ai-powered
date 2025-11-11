import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Edit, 
  Trash,
  CheckCircle,
  Circle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, isPast, isToday, isTomorrow } from "date-fns";
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
import { EnhancedTaskDialog } from "@/components/dashboard/taskmode/enhanced";

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

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTask(id);
    }
  }, [id]);

  const fetchTask = async (taskId: string) => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", taskId)
        .single();

      if (error) throw error;
      setTask(data);
    } catch (error: any) {
      toast({
        title: "Error fetching task",
        description: error.message,
        variant: "destructive",
      });
      navigate("/dashboard/tasks");
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", taskId);

      if (error) throw error;

      if (task) {
        setTask({ ...task, status: newStatus, updated_at: new Date().toISOString() });
      }

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

  const handleDelete = async () => {
    if (!task?.id) return;

    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", task.id);

      if (error) throw error;

      toast({ title: "Task deleted successfully" });
      navigate("/dashboard/tasks");
    } catch (error: any) {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <Card className="glass-effect p-8 text-center">
        <p className="text-muted-foreground">Task not found</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate("/dashboard/tasks")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tasks
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard/tasks")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tasks
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setDeleteDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Trash className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Task Details */}
      <Card className="glass-effect p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <button onClick={() => toggleTask(task.id, task.status)} className="mt-1">
                {task.status === "completed" ? (
                  <CheckCircle className="w-6 h-6 text-primary" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                )}
              </button>
              
              <div>
                <h1 className={`text-2xl font-bold ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </h1>
                
                {task.description && (
                  <p className="text-muted-foreground mt-2 whitespace-pre-wrap">
                    {task.description}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge className={getPriorityColor(task.priority)} variant="outline">
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
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
        </div>
        
        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="text-sm">{format(new Date(task.created_at), "MMM dd, yyyy HH:mm")}</p>
            </div>
          </div>
          
          {task.updated_at && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm">{format(new Date(task.updated_at), "MMM dd, yyyy HH:mm")}</p>
              </div>
            </div>
          )}
          
          {task.meeting_id && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Linked to Meeting</p>
                <p className="text-sm">Meeting #{task.meeting_id.substring(0, 8)}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Dialogs */}
      <EnhancedTaskDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        task={task} 
        onSuccess={() => {
          if (id) fetchTask(id);
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

export default TaskDetail;