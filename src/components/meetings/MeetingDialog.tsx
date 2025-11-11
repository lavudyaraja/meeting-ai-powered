import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, FileText, Sparkles, Edit } from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  status: string;
  meeting_url?: string;
  recording_url?: string;
  summary?: string;
  host_id?: string;
}

interface MeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editingMeeting?: Meeting | null;
}

const MeetingDialog = ({ open, onOpenChange, onSuccess, editingMeeting }: MeetingDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    if (editingMeeting) {
      setTitle(editingMeeting.title);
      setDescription(editingMeeting.description || "");
      setStartTime(editingMeeting.start_time);
      setEndTime(editingMeeting.end_time);
    } else {
      // Reset form when not editing
      setTitle("");
      setDescription("");
      setStartTime("");
      setEndTime("");
      setErrors({});
    }
  }, [editingMeeting, open]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "Meeting title is required";
    }

    if (!startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!endTime) {
      newErrors.endTime = "End time is required";
    }

    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      newErrors.endTime = "End time must be after start time";
    }

    if (startTime && new Date(startTime) < new Date()) {
      newErrors.startTime = "Start time cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (editingMeeting) {
        // Update existing meeting
        const { error: updateError } = await supabase
          .from("meetings")
          .update({
            title: title.trim(),
            description: description.trim() || null,
            start_time: startTime,
            end_time: endTime,
          })
          .eq("id", editingMeeting.id);

        if (updateError) throw new Error("Failed to update meeting: " + updateError.message);

        toast({ 
          title: "Success!",
          description: "Meeting updated successfully",
        });
      } else {
        // Create new meeting
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const insertData = {
          title: title.trim(),
          description: description.trim() || null,
          start_time: startTime,
          end_time: endTime,
          host_id: user.id,
          status: "scheduled",
        };

        const { data, error: insertError } = await supabase
          .from("meetings")
          .insert(insertData)
          .select();

        if (insertError) throw new Error("Failed to create meeting: " + insertError.message);

        // Only update meeting_url if data was inserted successfully
        if (data && data.length > 0) {
          const meetingId = data[0].id;
          const meetingUrl = `${window.location.origin}/join-meeting?meetingId=${meetingId}`;
          
          const { error: updateError } = await supabase
            .from("meetings")
            .update({ meeting_url: meetingUrl })
            .eq("id", meetingId);

          if (updateError) throw new Error("Failed to update meeting URL: " + updateError.message);
        }
      }

      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setTitle("");
      setDescription("");
      setStartTime("");
      setEndTime("");
      setErrors({});
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: editingMeeting ? "Error updating meeting" : "Error creating meeting",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setTitle("");
      setDescription("");
      setStartTime("");
      setEndTime("");
      setErrors({});
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-blue-500/30 max-w-2xl shadow-2xl shadow-blue-500/20">
        <DialogHeader className="space-y-3 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/30">
              {editingMeeting ? (
                <Edit className="w-6 h-6 text-white" />
              ) : (
                <Calendar className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <DialogTitle className="text-3xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                {editingMeeting ? "Edit Meeting" : "Schedule New Meeting"}
              </DialogTitle>
              <p className="text-slate-400 text-sm mt-1">
                {editingMeeting ? "Update your meeting details" : "Create and schedule your meeting"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Meeting Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-200 font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Meeting Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
              className={`bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all ${
                errors.title ? "border-red-500 focus:border-red-500" : ""
              }`}
              placeholder="e.g., Team Sync, Project Review, Client Meeting..."
            />
            {errors.title && (
              <p className="text-red-400 text-sm flex items-center gap-1">
                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-200 font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Description <span className="text-slate-500 text-xs font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 min-h-[100px] transition-all"
              placeholder="Meeting agenda, objectives, and key discussion points..."
            />
          </div>

          {/* Time Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Time */}
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-slate-200 font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-400" />
                Start Time
              </Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  if (errors.startTime) setErrors({ ...errors, startTime: "" });
                }}
                className={`bg-slate-800/50 border-slate-700 text-slate-100 focus:border-green-500 focus:ring-green-500/20 transition-all ${
                  errors.startTime ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.startTime && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.startTime}
                </p>
              )}
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-slate-200 font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                End Time
              </Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  if (errors.endTime) setErrors({ ...errors, endTime: "" });
                }}
                className={`bg-slate-800/50 border-slate-700 text-slate-100 focus:border-orange-500 focus:ring-orange-500/20 transition-all ${
                  errors.endTime ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.endTime && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.endTime}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-3 pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={handleClose}
              disabled={loading}
              className="bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-slate-100 border border-slate-700 transition-all"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 text-white font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  {editingMeeting ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  {editingMeeting ? (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Update Meeting
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 mr-2" />
                      Create Meeting
                    </>
                  )}
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingDialog;