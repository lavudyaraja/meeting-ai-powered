import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Add participant to meeting
      const { error: insertError } = await supabase
        .from('meeting_participants')
        .insert({
          meeting_id: meetingId,
          user_id: null, // We don't have user_id for email invites
          status: 'invited'
        });

      if (insertError) throw insertError;

      // In a real application, you would send an email here
      // For now, we'll just show a success message
      toast({
        title: 'Invitation Sent',
        description: `Invitation sent to ${email}`,
      });

      // Reset form and close modal
      setEmail('');
      setMessage('');
      onInviteSent();
    } catch (error) {
      console.error('Error inviting participant:', error);
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleInvite} className="space-y-4 mt-4">
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="participant@example.com"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="message">Message (Optional)</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a personal message to your invitation..."
          rows={3}
        />
      </div>
      
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onInviteSent}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Invitation'}
        </Button>
      </div>
    </form>
  );
};