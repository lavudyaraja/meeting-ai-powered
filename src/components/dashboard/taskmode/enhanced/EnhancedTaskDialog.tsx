import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, AlertCircle, TrendingUp, Target, Clock, Sparkles } from "lucide-react";
import { format } from "date-fns";

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

interface EnhancedTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSuccess: () => void;
}

const EnhancedTaskDialog = ({ open, onOpenChange, task, onSuccess }: EnhancedTaskDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      setStatus(task.status);
      setDueDate(task.due_date ? task.due_date.split("T")[0] : "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("pending");
      setDueDate("");
    }
  }, [task, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const taskData = {
        title,
        description: description || null,
        priority,
        status,
        due_date: dueDate || null,
        created_by: user.id,
        assigned_to: user.id,
      };

      if (task) {
        const { error } = await supabase
          .from("tasks")
          .update({ ...taskData, updated_at: new Date().toISOString() })
          .eq("id", task.id);

        if (error) throw error;
        toast({ title: "Task updated successfully" });
      } else {
        const { error } = await supabase.from("tasks").insert(taskData);
        if (error) throw error;
        toast({ title: "Task created successfully" });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // AI-powered task title enhancement
  const enhanceTaskWithAI = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title first",
        variant: "destructive",
      });
      return;
    }

    setAiGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [
            {
              role: "user",
              content: `Enhance this task title to make it more specific and actionable: "${title}". Return only the improved title.`
            }
          ]
        }
      });

      if (error) throw error;

      setTitle(data.message);
      toast({
        title: "Success",
        description: "Task title enhanced with AI",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to enhance task with AI",
        variant: "destructive",
      });
    } finally {
      setAiGenerating(false);
    }
  };

  // AI-powered task description generation
  const generateDescriptionWithAI = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title first",
        variant: "destructive",
      });
      return;
    }

    setAiGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [
            {
              role: "user",
              content: `Generate a detailed description for this task: "${title}". Include key steps or considerations for completing this task. Return only the description.`
            }
          ]
        }
      });

      if (error) throw error;

      setDescription(data.message);
      toast({
        title: "Success",
        description: "Task description generated with AI",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate description with AI",
        variant: "destructive",
      });
    } finally {
      setAiGenerating(false);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent": return <AlertCircle className="w-4 h-4" />;
      case "high": return <TrendingUp className="w-4 h-4" />;
      case "medium": return <Target className="w-4 h-4" />;
      case "low": return <Clock className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          glass-effect 
          w-[95vw] 
          max-w-md 
          sm:max-w-lg 
          p-4 sm:p-6 
          overflow-y-auto 
          max-h-[90vh] 
          rounded-2xl
          border border-primary/20
        "
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary flex items-center gap-2">
            {task ? "Edit Task" : "Create New Task"}
            <Sparkles className="w-5 h-5 text-primary" />
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-primary font-medium flex items-center gap-2">
              Title
            </Label>
            <div className="flex gap-2">
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-transparent border-primary/30 focus:border-primary w-full mt-1"
                placeholder="Enter task title..."
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={enhanceTaskWithAI}
                disabled={aiGenerating || !title.trim()}
                className="flex items-center gap-1"
              >
                {aiGenerating ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">AI</span>
              </Button>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-primary font-medium flex items-center gap-2">
              Description
            </Label>
            <div className="flex gap-2">
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-transparent border-primary/30 focus:border-primary w-full mt-1"
                placeholder="Add details about the task..."
                rows={4}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateDescriptionWithAI}
                disabled={aiGenerating || !title.trim()}
                className="flex flex-col h-auto py-2 px-2"
              >
                {aiGenerating ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span className="text-xs mt-1 hidden sm:inline">AI</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <Label htmlFor="status" className="text-primary font-medium">
                Status
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-transparent border-primary/30 focus:border-primary w-full mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-background/70 backdrop-blur-md border-primary/20">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div>
              <Label htmlFor="priority" className="text-primary font-medium flex items-center gap-2">
                Priority
              </Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="bg-transparent border-primary/30 focus:border-primary w-full mt-1">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-background/70 backdrop-blur-md border-primary/20">
                  <SelectItem value="low">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Low
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Medium
                    </span>
                  </SelectItem>
                  <SelectItem value="high">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      High
                    </span>
                  </SelectItem>
                  <SelectItem value="urgent">
                    <span className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Urgent
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <Label htmlFor="dueDate" className="text-primary font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-transparent border-primary/30 focus:border-primary w-full mt-1"
            />
            
            {dueDate && (
              <div className="mt-2 text-sm text-muted-foreground">
                Due: {format(new Date(dueDate), "EEEE, MMMM d, yyyy")}
              </div>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="hero"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : task ? (
                "Update Task"
              ) : (
                "Create Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedTaskDialog;