import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export interface AIMeetingSettings {
  autoCalendarBlocking: boolean;
  taskAutomation: boolean;
  documentGeneration: boolean;
  participantAutoInvite: boolean;
  expenseBooking: boolean;
  liveTranslation: boolean;
  recordingDistribution: boolean;
  vendorPortal: boolean;
  costTracking: boolean;
  autoCancel: boolean;
  hardwareIntegration: boolean;
}

export const useAIMeeting = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AIMeetingSettings>({
    autoCalendarBlocking: false,
    taskAutomation: false,
    documentGeneration: false,
    participantAutoInvite: false,
    expenseBooking: false,
    liveTranslation: false,
    recordingDistribution: false,
    vendorPortal: false,
    costTracking: false,
    autoCancel: false,
    hardwareIntegration: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load AI meeting settings
  const loadSettings = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from("ai_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }
      
      if (data) {
        setSettings({
          autoCalendarBlocking: data.ai_followup_enabled || false,
          taskAutomation: data.ai_summarizer_enabled || false,
          documentGeneration: data.voice_command_enabled || false,
          participantAutoInvite: data.voice_keyword === "invite" || false,
          expenseBooking: false,
          liveTranslation: false,
          recordingDistribution: false,
          vendorPortal: false,
          costTracking: false,
          autoCancel: false,
          hardwareIntegration: false
        });
      }
    } catch (err) {
      console.error("Error loading AI meeting settings:", err);
      setError("Failed to load AI meeting settings");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Save AI meeting settings
  const saveSettings = useCallback(async (newSettings: Partial<AIMeetingSettings>) => {
    if (!user) return;
    
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const { error: upsertError } = await supabase
        .from("ai_settings")
        .upsert({
          user_id: user.id,
          ai_followup_enabled: updatedSettings.autoCalendarBlocking,
          ai_summarizer_enabled: updatedSettings.taskAutomation,
          voice_command_enabled: updatedSettings.documentGeneration,
          voice_keyword: updatedSettings.participantAutoInvite ? "invite" : null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: "user_id"
        });
      
      if (upsertError) throw upsertError;
      
      setSettings(updatedSettings as AIMeetingSettings);
      return { success: true };
    } catch (err) {
      console.error("Error saving AI meeting settings:", err);
      setError("Failed to save AI meeting settings");
      return { success: false, error: err };
    }
  }, [user, settings]);

  // Toggle a specific AI feature
  const toggleFeature = useCallback(async (feature: keyof AIMeetingSettings, enabled: boolean) => {
    return await saveSettings({ [feature]: enabled });
  }, [saveSettings]);

  // Initialize settings
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    isLoading,
    error,
    saveSettings,
    toggleFeature,
    refresh: loadSettings
  };
};