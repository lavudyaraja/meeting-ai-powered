import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, Mail, Copy } from "lucide-react";

interface ParticipantInviteProps {
    meetingId: string;
    meetingUrl: string;
    onInviteSent: () => void;
}

const ParticipantInvite = ({ meetingId, meetingUrl, onInviteSent }: ParticipantInviteProps) => {
    const [emails, setEmails] = useState(""); // now multiple emails
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const copyMeetingLink = () => {
        navigator.clipboard.writeText(meetingUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({ title: "Meeting link copied to clipboard" });
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!emails) return;

        setLoading(true);

        try {
            // Split multiple emails by comma or newline
            const emailList = emails
                .split(/[\n,]+/)
                .map((e) => e.trim())
                .filter((e) => e);

            // In a real implementation, send email to each participant
            // Here, we just mock success
            emailList.forEach((email) => {
                console.log(`Invite sent to: ${email}`);
            });

            toast({
                title: "Invitations Sent",
                description: `Meeting invitations sent to ${emailList.length} participants`,
            });

            setEmails("");
            setMessage("");
            onInviteSent();
        } catch (error: any) {
            toast({
                title: "Error sending invitations",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const inviteMessage = `You've been invited to join a meeting!\n\nJoin using this link: ${meetingUrl}\n\n${message}`;

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Meeting Link Card */}
            <Card className="p-6 bg-gradient-to-br from-purple-200 to-pink-200 border-none rounded-xl w-full">
                <div className="flex items-center gap-2 mb-4">
                    <Copy className="w-5 h-5 text-purple-700" />
                    <h3 className="text-lg font-semibold text-purple-900">Meeting Link</h3>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Input
                        value={meetingUrl}
                        readOnly
                        className="flex-1 bg-purple-100 text-purple-900 border-none focus:ring-2 focus:ring-purple-500"
                    />
                    <Button
                        onClick={copyMeetingLink}
                        variant="outline"
                        className="text-purple-700 border-purple-700 hover:bg-purple-300 hover:text-white transition"
                    >
                        {copied ? "Copied!" : "Copy"}
                    </Button>
                </div>

                <p className="text-sm text-purple-800 mt-2">
                    Share this link with all participants.
                </p>
            </Card>

            {/* Bulk Invitation Form Card */}
            <Card className="p-6 bg-gradient-to-br from-blue-200 to-indigo-200 border-none rounded-xl w-full">
                <div className="flex items-center gap-2 mb-4">
                    <Mail className="w-5 h-5 text-blue-700" />
                    <h3 className="text-lg font-semibold text-blue-900">Send Invitations</h3>
                </div>

                <form onSubmit={handleInvite} className="flex flex-col gap-4">
                    {/* Email Addresses */}
                    <div className="flex flex-col mt-4">
                        <Label htmlFor="emails" className="text-blue-900 font-medium">
                            Email Addresses (comma or newline separated)
                        </Label>
                        <Textarea
                            id="emails"
                            value={emails}
                            onChange={(e) => setEmails(e.target.value)}
                            placeholder="participant1@example.com, participant2@example.com"
                            required
                            rows={4}
                            className="bg-blue-100 text-blue-900 border-none focus:ring-2 focus:ring-blue-500 resize-none mt-2"
                        />
                    </div>

                    {/* Message (Optional) */}
                    <div className="flex flex-col mt-6">
                        <Label htmlFor="message" className="text-blue-900 font-medium">
                            Message (Optional)
                        </Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Add a personal message..."
                            rows={3}
                            className="bg-blue-100 text-blue-900 border-none focus:ring-2 focus:ring-blue-500 resize-none mt-2"
                        />
                    </div>


                    <div className="bg-blue-100 p-3 rounded-lg">
                        <p className="text-sm text-blue-800 font-medium mb-1">Preview:</p>
                        <p className="text-xs text-blue-900 whitespace-pre-wrap">{inviteMessage}</p>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Sending...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <Send className="w-4 h-4" />
                                Send Invitations
                            </div>
                        )}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default ParticipantInvite;
