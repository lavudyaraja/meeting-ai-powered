import { createClient } from '@supabase/supabase-js';

// Use Vite's import.meta.env for environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ewsiwbxjjhjqhbgemkxo.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3c2l3YnhqamhqcWhiZ2Vta3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MDAxMzksImV4cCI6MjA3NTA3NjEzOX0.4hwd8EMVjhYsf1MmPegxLYSNNfsOin5MgrNUVBmOgUM"
// VITE_SUPABASE_URL="https://ewsiwbxjjhjqhbgemkxo.supabase.co";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};