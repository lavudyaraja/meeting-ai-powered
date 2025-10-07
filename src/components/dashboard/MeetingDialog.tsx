import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const MeetingDialog = ({ open, onOpenChange, onSuccess }: MeetingDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Let Supabase generate the UUID automatically
      // Generate meeting URL - we'll update this after getting the meeting ID
      const { data, error: insertError } = await supabase
        .from("meetings")
        .insert({
          title,
          description: description || null,
          start_time: startTime,
          end_time: endTime,
          host_id: user.id,
          status: "scheduled",
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Now update the meeting with the generated URL
      const meetingUrl = `${window.location.origin}/join-meeting?meetingId=${data.id}`;
      
      const { error: updateError } = await supabase
        .from("meetings")
        .update({ meeting_url: meetingUrl })
        .eq("id", data.id);

      if (updateError) throw updateError;

      toast({ title: "Meeting created successfully" });
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setTitle("");
      setDescription("");
      setStartTime("");
      setEndTime("");
    } catch (error: any) {
      toast({
        title: "Error creating meeting",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect">
        <DialogHeader>
          <DialogTitle>Schedule New Meeting</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Meeting Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="glass-effect"
              placeholder="Team Sync, Project Review..."
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="glass-effect"
              placeholder="Meeting agenda and objectives..."
            />
          </div>
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="glass-effect"
            />
          </div>
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="glass-effect"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="hero" disabled={loading}>
              {loading ? "Creating..." : "Create Meeting"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingDialog;