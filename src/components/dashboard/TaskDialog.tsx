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

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
}

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSuccess: () => void;
}

const TaskDialog = ({ open, onOpenChange, task, onSuccess }: TaskDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      setDueDate(task.due_date ? task.due_date.split("T")[0] : "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
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
        due_date: dueDate || null,
        created_by: user.id,
        assigned_to: user.id,
      };

      if (task) {
        const { error } = await supabase
          .from("tasks")
          .update(taskData)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          glass-effect 
          w-[90vw] 
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
          <DialogTitle className="text-xl font-semibold text-primary">
            {task ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-primary font-medium">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-transparent border-primary/30 focus:border-primary w-full mt-1"
              placeholder="Enter task title..."
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-primary font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-transparent border-primary/30 focus:border-primary w-full mt-1"
              placeholder="Add details about the task..."
              rows={3}
            />
          </div>

          {/* Priority */}
          <div>
            <Label htmlFor="priority" className="text-primary font-medium">
              Priority
            </Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="bg-transparent border-primary/30 focus:border-primary w-full mt-1">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-background/70 backdrop-blur-md border-primary/20">
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div>
            <Label htmlFor="dueDate" className="text-primary font-medium">
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-transparent border-primary/30 focus:border-primary w-full mt-1"
            />
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
              {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
