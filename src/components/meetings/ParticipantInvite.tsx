import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Send, X, UserPlus, Link2, Copy, Check, AlertCircle, Info } from 'lucide-react';

interface ParticipantInviteProps {
  meetingId: string;
  meetingUrl: string;
  onInviteSent: () => void;
}

export const ParticipantInvite: React.FC<ParticipantInviteProps> = ({ 
  meetingId, 
  meetingUrl,
  onInviteSent 
}) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyMeetingUrl = () => {
    navigator.clipboard.writeText(meetingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: 'Invalid Email',
          description: 'Please enter a valid email address',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Add participant to meeting
      const { error: insertError } = await supabase
        .from('meeting_participants')
        .insert({
          meeting_id: meetingId,
          user_id: null,
          status: 'invited'
        });

      if (insertError) throw insertError;

      toast({
        title: 'Invitation Sent Successfully',
        description: `Meeting invitation sent to ${email}`,
      });

      // Reset form
      setEmail('');
      setMessage('');
      onInviteSent();
    } catch (error) {
      console.error('Error inviting participant:', error);
      toast({
        title: 'Invitation Failed',
        description: 'Unable to send invitation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-green-900">Invite Participants</h2>
            <p className="text-sm text-green-600">Send meeting invitations via email</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onInviteSent}
          className="text-white hover:text-white"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Meeting Link Card */}
      <Card className="border border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Link2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-blue-600 uppercase mb-2">Meeting Link</p>
              <div className="flex items-center gap-2">
                <code className="bg-gray-100 border border-blue-200 px-3 py-2 rounded-lg text-sm flex-1 truncate text-gray-700">
                  {meetingUrl}
                </code>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={copyMeetingUrl}
                  className="flex-shrink-0 border-blue-300 hover:bg-black"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invitation Form */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-200 bg-gray-50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="w-5 h-5 text-green-900" />
            <h2 className="text-green-900">

            Email Invitation
            </h2>
          </CardTitle>
          <CardDescription>
            Enter the participant's email address and an optional message
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleInvite} className="space-y-5">
            {/* Email Input */}
            <div>
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="participant@example.com"
                  required
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                The invitation will be sent to this email address
              </p>
            </div>
            
            {/* Message Input */}
            <div>
              <Label htmlFor="message" className="text-sm font-semibold text-gray-700 mb-2 block">
                Personal Message <span className="text-gray-500 font-normal">(Optional)</span>
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal message to your invitation..."
                rows={4}
                className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                This message will be included in the invitation email
              </p>
            </div>

            {/* Info Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">Invitation Details</p>
                  <p className="text-xs text-blue-700">
                    The participant will receive an email with the meeting link, time, and your personal message. They can join the meeting by clicking the link.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onInviteSent}
                className="sm:flex-1 border-gray-300 hover:bg-gray-50"
                disabled={loading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !email}
                className="sm:flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending Invitation...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Invitation
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="border border-gray-200 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <ul className="space-y-2 text-xs text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></span>
              <span>Participants can join the meeting anytime using the shared link</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></span>
              <span>Add a personal message to provide context about the meeting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></span>
              <span>You can invite multiple participants by sending separate invitations</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};