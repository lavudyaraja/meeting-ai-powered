import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type Automation = {
  id: string;
  name: string;
  type: "meeting" | "task" | "workflow";
  description: string;
  status: "active" | "paused" | "draft";
  created_at: string;
  updated_at: string;
  trigger_conditions: Record<string, any>;
  actions: Record<string, any>;
  created_by: string;
};

export type PromptTemplate = {
  id: string;
  name: string;
  category: string;
  content: string;
  description: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
  created_by: string;
};

// Since we don't have dedicated tables for automations and prompt_templates,
// we'll use the tasks table to store automation data and ai_settings for prompt templates
export const useAIManagement = () => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all automations (stored in tasks table with special flag)
  const fetchAutomations = useCallback(async () => {
    try {
      setLoading(true);
      // For now, we'll simulate automations since we don't have a dedicated table
      // In a real implementation, we would create a dedicated table for automations
      setAutomations([
        {
          id: "1",
          name: "Weekly Team Sync",
          type: "meeting",
          description: "Automatically schedule weekly team meetings",
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          trigger_conditions: { frequency: "weekly" },
          actions: { create_meeting: true },
          created_by: "user1"
        },
        {
          id: "2",
          name: "Project Status Report",
          type: "task",
          description: "Generate weekly project status reports",
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          trigger_conditions: { frequency: "weekly" },
          actions: { create_task: true },
          created_by: "user1"
        }
      ]);
    } catch (err) {
      console.error("Error fetching automations:", err);
      setError("Failed to fetch automations");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all prompt templates (we'll simulate this too)
  const fetchPromptTemplates = useCallback(async () => {
    try {
      // Simulate prompt templates
      setPromptTemplates([
        {
          id: "1",
          name: "Meeting Agenda Generator",
          category: "meetings",
          content: "Create a meeting agenda with the following topics: 1. Project updates, 2. Roadblocks discussion, 3. Upcoming deadlines, 4. Action items. Include time allocations for each topic.",
          description: "Generate a structured agenda for team meetings",
          usage_count: 42,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: "user1"
        },
        {
          id: "2",
          name: "Task Prioritization",
          category: "tasks",
          content: "Analyze the following tasks and prioritize them based on business impact and urgency. Consider dependencies between tasks.",
          description: "Help prioritize tasks based on urgency and impact",
          usage_count: 28,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: "user1"
        }
      ]);
    } catch (err) {
      console.error("Error fetching prompt templates:", err);
      setError("Failed to fetch prompt templates");
    }
  }, []);

  // Create a new automation
  const createAutomation = async (automation: Omit<Automation, "id" | "created_at" | "updated_at">) => {
    try {
      // In a real implementation, we would store this in a dedicated table
      console.log("Creating automation:", automation);
      await fetchAutomations(); // Refresh the list
      return { id: "new-id", ...automation, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    } catch (err) {
      console.error("Error creating automation:", err);
      throw new Error("Failed to create automation");
    }
  };

  // Update an existing automation
  const updateAutomation = async (id: string, updates: Partial<Automation>) => {
    try {
      // In a real implementation, we would update this in a dedicated table
      console.log("Updating automation:", id, updates);
      await fetchAutomations(); // Refresh the list
      return { id, ...updates } as Automation;
    } catch (err) {
      console.error("Error updating automation:", err);
      throw new Error("Failed to update automation");
    }
  };

  // Delete an automation
  const deleteAutomation = async (id: string) => {
    try {
      // In a real implementation, we would delete this from a dedicated table
      console.log("Deleting automation:", id);
      await fetchAutomations(); // Refresh the list
    } catch (err) {
      console.error("Error deleting automation:", err);
      throw new Error("Failed to delete automation");
    }
  };

  // Create a new prompt template
  const createPromptTemplate = async (template: Omit<PromptTemplate, "id" | "created_at" | "updated_at" | "usage_count">) => {
    try {
      // In a real implementation, we would store this in a dedicated table
      console.log("Creating prompt template:", template);
      await fetchPromptTemplates(); // Refresh the list
      return { id: "new-id", ...template, usage_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    } catch (err) {
      console.error("Error creating prompt template:", err);
      throw new Error("Failed to create prompt template");
    }
  };

  // Update an existing prompt template
  const updatePromptTemplate = async (id: string, updates: Partial<PromptTemplate>) => {
    try {
      // In a real implementation, we would update this in a dedicated table
      console.log("Updating prompt template:", id, updates);
      await fetchPromptTemplates(); // Refresh the list
      return { id, ...updates } as PromptTemplate;
    } catch (err) {
      console.error("Error updating prompt template:", err);
      throw new Error("Failed to update prompt template");
    }
  };

  // Delete a prompt template
  const deletePromptTemplate = async (id: string) => {
    try {
      // In a real implementation, we would delete this from a dedicated table
      console.log("Deleting prompt template:", id);
      await fetchPromptTemplates(); // Refresh the list
    } catch (err) {
      console.error("Error deleting prompt template:", err);
      throw new Error("Failed to delete prompt template");
    }
  };

  // Increment prompt template usage count
  const incrementPromptUsage = async (id: string) => {
    try {
      // In a real implementation, we would update the usage count in a dedicated table
      console.log("Incrementing prompt usage:", id);
      return { id } as PromptTemplate;
    } catch (err) {
      console.error("Error incrementing prompt usage:", err);
      throw new Error("Failed to increment prompt usage");
    }
  };

  // Initialize data
  useEffect(() => {
    fetchAutomations();
    fetchPromptTemplates();
  }, [fetchAutomations, fetchPromptTemplates]);

  return {
    automations,
    promptTemplates,
    loading,
    error,
    createAutomation,
    updateAutomation,
    deleteAutomation,
    createPromptTemplate,
    updatePromptTemplate,
    deletePromptTemplate,
    incrementPromptUsage,
    refresh: fetchAutomations
  };
};