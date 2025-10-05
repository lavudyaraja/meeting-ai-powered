import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MessageSquare, Trello, Database, Cloud } from "lucide-react";

const Integrations = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<any[]>([]);

  const availableIntegrations = [
    {
      type: "calendar",
      name: "Google Calendar",
      icon: Calendar,
      description: "Sync meetings with Google Calendar",
      category: "Calendar",
    },
    {
      type: "calendar",
      name: "Outlook",
      icon: Calendar,
      description: "Sync meetings with Outlook",
      category: "Calendar",
    },
    {
      type: "communication",
      name: "Slack",
      icon: MessageSquare,
      description: "Send meeting summaries to Slack",
      category: "Communication",
    },
    {
      type: "communication",
      name: "Microsoft Teams",
      icon: MessageSquare,
      description: "Integrate with Teams channels",
      category: "Communication",
    },
    {
      type: "project",
      name: "Trello",
      icon: Trello,
      description: "Create tasks in Trello boards",
      category: "Project Management",
    },
    {
      type: "project",
      name: "Notion",
      icon: Database,
      description: "Sync notes and tasks to Notion",
      category: "Project Management",
    },
    {
      type: "storage",
      name: "Google Drive",
      icon: Cloud,
      description: "Store recordings in Google Drive",
      category: "Storage",
    },
    {
      type: "storage",
      name: "Dropbox",
      icon: Cloud,
      description: "Store recordings in Dropbox",
      category: "Storage",
    },
  ];

  useEffect(() => {
    loadIntegrations();

    // Set up real-time subscription for integration settings changes
    const channel = supabase
      .channel('integration_settings_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'integration_settings',
        },
        (payload) => {
          setIntegrations(prev => [...prev, payload.new]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'integration_settings',
        },
        (payload) => {
          setIntegrations(prev => 
            prev.map(int => 
              int.id === payload.new.id ? payload.new : int
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'integration_settings',
        },
        (payload) => {
          setIntegrations(prev => 
            prev.filter(int => int.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    // Clean up subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadIntegrations = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("integration_settings")
      .select("*")
      .eq("user_id", user.id);

    setIntegrations(data || []);
  };

  const toggleIntegration = async (integrationType: string, integrationName: string, enabled: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (enabled) {
        // In a real app, this would open OAuth flow
        const { error } = await supabase
          .from("integration_settings")
          .upsert({
            user_id: user.id,
            integration_type: integrationType,
            integration_name: integrationName,
            enabled: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,integration_type,integration_name'
          });

        if (error) throw error;
        toast({ title: `${integrationName} connected successfully` });
      } else {
        const { error } = await supabase
          .from("integration_settings")
          .delete()
          .eq("user_id", user.id)
          .eq("integration_type", integrationType)
          .eq("integration_name", integrationName);

        if (error) throw error;
        toast({ title: `${integrationName} disconnected` });
      }

      // Refresh integrations after change
      loadIntegrations();
    } catch (error: any) {
      toast({
        title: "Error updating integration",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isEnabled = (integrationType: string, integrationName: string) => {
    return integrations.some(
      (int) => int.integration_type === integrationType && int.integration_name === integrationName && int.enabled
    );
  };

  const groupedIntegrations = availableIntegrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, typeof availableIntegrations>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedIntegrations).map(([category, items]) => (
        <Card key={category} className="glass-effect p-6">
          <h2 className="text-2xl font-bold mb-4">{category}</h2>
          <div className="space-y-4">
            {items.map((integration) => {
              const Icon = integration.icon;
              const enabled = isEnabled(integration.type, integration.name);

              return (
                <div
                  key={integration.name}
                  className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Icon className="h-8 w-8 text-primary" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{integration.name}</h3>
                        {enabled && <Badge variant="secondary">Connected</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={enabled}
                    onCheckedChange={(checked) =>
                      toggleIntegration(integration.type, integration.name, checked)
                    }
                  />
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Integrations;