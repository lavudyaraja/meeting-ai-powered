import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type Department = Tables<"departments">;
export type Role = Tables<"roles">;
export type TeamMember = Tables<"team_members"> & {
  user_profiles?: {
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  } | null;
  departments?: {
    name: string;
    color: string | null;
  } | null;
  roles?: {
    name: string;
  } | null;
};

// Type for the data returned from Supabase with relationships
type TeamMemberWithRelations = Tables<"team_members"> & {
  user_profiles?: {
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  } | null | { error: true };
  departments?: {
    name: string;
    color: string | null;
  } | null;
  roles?: {
    name: string;
  } | null;
};

export type TeamData = {
  departments: Department[];
  roles: Role[];
  teamMembers: TeamMember[];
};

export const useTeam = () => {
  const [teamData, setTeamData] = useState<TeamData>({
    departments: [],
    roles: [],
    teamMembers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to clean up team member data
  const cleanTeamMemberData = (member: TeamMemberWithRelations): TeamMember => {
    // Handle potential error objects in relationships
    const cleanedMember: TeamMember = {
      ...member,
      user_profiles: member.user_profiles && !('error' in member.user_profiles) ? member.user_profiles : null,
      departments: member.departments || null,
      roles: member.roles || null
    };
    
    return cleanedMember;
  };

  // Fetch all team data
  const fetchTeamData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if Supabase client is properly configured
      if (!supabase) {
        throw new Error("Supabase client is not properly configured");
      }
      
      // Fetch departments
      console.log("Fetching departments...");
      const { data: departments, error: deptError } = await supabase
        .from("departments")
        .select("*")
        .order("name");
      
      if (deptError) {
        console.error("Department fetch error:", deptError);
        throw new Error(`Failed to fetch departments: ${deptError.message}`);
      }
      console.log("Departments fetched:", departments?.length || 0);
      
      // Fetch roles
      console.log("Fetching roles...");
      const { data: roles, error: roleError } = await supabase
        .from("roles")
        .select("*")
        .order("name");
      
      if (roleError) {
        console.error("Role fetch error:", roleError);
        throw new Error(`Failed to fetch roles: ${roleError.message}`);
      }
      console.log("Roles fetched:", roles?.length || 0);
      
      // Fetch team members with user profiles
      console.log("Fetching team members...");
      const { data: teamMembers, error: memberError } = await supabase
        .from("team_members")
        .select(`
          *,
          user_profiles:profiles(full_name, email, avatar_url),
          departments(name, color),
          roles(name)
        `)
        .order("created_at");
      
      if (memberError) {
        console.error("Team member fetch error:", memberError);
        throw new Error(`Failed to fetch team members: ${memberError.message}`);
      }
      console.log("Team members fetched:", teamMembers?.length || 0);
      
      // Clean up the team member data to handle potential errors in relationships
      const cleanedTeamMembers = teamMembers ? teamMembers.map(cleanTeamMemberData) : [];
      
      setTeamData({
        departments: departments || [],
        roles: roles || [],
        teamMembers: cleanedTeamMembers
      });
    } catch (err) {
      console.error("Error fetching team data:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch team data. Please check your Supabase configuration and database tables.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to real-time changes
  useEffect(() => {
    fetchTeamData();
    
    // Subscribe to departments changes
    const departmentsChannel = supabase
      .channel('departments-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'departments',
        },
        (payload) => {
          setTeamData(prev => ({
            ...prev,
            departments: [...prev.departments, payload.new as Department]
          }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'departments',
        },
        (payload) => {
          setTeamData(prev => ({
            ...prev,
            departments: prev.departments.map(dept => 
              dept.id === payload.new.id ? payload.new as Department : dept
            )
          }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'departments',
        },
        (payload) => {
          setTeamData(prev => ({
            ...prev,
            departments: prev.departments.filter(dept => dept.id !== payload.old.id)
          }));
        }
      )
      .subscribe();
    
    // Subscribe to roles changes
    const rolesChannel = supabase
      .channel('roles-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'roles',
        },
        (payload) => {
          setTeamData(prev => ({
            ...prev,
            roles: [...prev.roles, payload.new as Role]
          }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'roles',
        },
        (payload) => {
          setTeamData(prev => ({
            ...prev,
            roles: prev.roles.map(role => 
              role.id === payload.new.id ? payload.new as Role : role
            )
          }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'roles',
        },
        (payload) => {
          setTeamData(prev => ({
            ...prev,
            roles: prev.roles.filter(role => role.id !== payload.old.id)
          }));
        }
      )
      .subscribe();
    
    // Subscribe to team members changes
    const teamMembersChannel = supabase
      .channel('team-members-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'team_members',
        },
        (payload) => {
          // Fetch the full team member data with relationships
          supabase
            .from("team_members")
            .select(`
              *,
              user_profiles:profiles(full_name, email, avatar_url),
              departments(name, color),
              roles(name)
            `)
            .eq("id", payload.new.id)
            .single()
            .then(({ data, error }) => {
              if (!error && data) {
                setTeamData(prev => ({
                  ...prev,
                  teamMembers: [...prev.teamMembers, cleanTeamMemberData(data)]
                }));
              }
            });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'team_members',
        },
        (payload) => {
          // Fetch the updated team member data with relationships
          supabase
            .from("team_members")
            .select(`
              *,
              user_profiles:profiles(full_name, email, avatar_url),
              departments(name, color),
              roles(name)
            `)
            .eq("id", payload.new.id)
            .single()
            .then(({ data, error }) => {
              if (!error && data) {
                setTeamData(prev => ({
                  ...prev,
                  teamMembers: prev.teamMembers.map(member => 
                    member.id === data.id ? cleanTeamMemberData(data) : member
                  )
                }));
              }
            });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'team_members',
        },
        (payload) => {
          setTeamData(prev => ({
            ...prev,
            teamMembers: prev.teamMembers.filter(member => member.id !== payload.old.id)
          }));
        }
      )
      .subscribe();
    
    // Cleanup function
    return () => {
      departmentsChannel.unsubscribe();
      rolesChannel.unsubscribe();
      teamMembersChannel.unsubscribe();
    };
  }, [fetchTeamData]);

  // Create a new department
  const createDepartment = async (department: Omit<Department, "id" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase
        .from("departments")
        .insert(department)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error creating department:", err);
      throw new Error(`Failed to create department: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Update a department
  const updateDepartment = async (id: string, updates: Partial<Department>) => {
    try {
      const { data, error } = await supabase
        .from("departments")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error updating department:", err);
      throw new Error(`Failed to update department: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Delete a department
  const deleteDepartment = async (id: string) => {
    try {
      const { error } = await supabase
        .from("departments")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    } catch (err) {
      console.error("Error deleting department:", err);
      throw new Error(`Failed to delete department: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Create a new role
  const createRole = async (role: Omit<Role, "id" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase
        .from("roles")
        .insert(role)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error creating role:", err);
      throw new Error(`Failed to create role: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Update a role
  const updateRole = async (id: string, updates: Partial<Role>) => {
    try {
      const { data, error } = await supabase
        .from("roles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error updating role:", err);
      throw new Error(`Failed to update role: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Delete a role
  const deleteRole = async (id: string) => {
    try {
      const { error } = await supabase
        .from("roles")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    } catch (err) {
      console.error("Error deleting role:", err);
      throw new Error(`Failed to delete role: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Add a team member
  const addTeamMember = async (teamMember: Omit<TeamMember, "id" | "created_at" | "updated_at" | "invited_at" | "joined_at">) => {
    try {
      const { data, error } = await supabase
        .from("team_members")
        .insert({
          ...teamMember,
          invited_at: new Date().toISOString(),
          joined_at: new Date().toISOString()
        })
        .select(`
          *,
          user_profiles:profiles(full_name, email, avatar_url),
          departments(name, color),
          roles(name)
        `)
        .single();
      
      if (error) throw error;
      return cleanTeamMemberData(data);
    } catch (err) {
      console.error("Error adding team member:", err);
      throw new Error(`Failed to add team member: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Update a team member
  const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    try {
      const { data, error } = await supabase
        .from("team_members")
        .update(updates)
        .eq("id", id)
        .select(`
          *,
          user_profiles:profiles(full_name, email, avatar_url),
          departments(name, color),
          roles(name)
        `)
        .single();
      
      if (error) throw error;
      return cleanTeamMemberData(data);
    } catch (err) {
      console.error("Error updating team member:", err);
      throw new Error(`Failed to update team member: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Remove a team member
  const removeTeamMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    } catch (err) {
      console.error("Error removing team member:", err);
      throw new Error(`Failed to remove team member: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return {
    ...teamData,
    loading,
    error,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    createRole,
    updateRole,
    deleteRole,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    refresh: fetchTeamData
  };
};