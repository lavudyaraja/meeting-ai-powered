import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeam } from "@/hooks/use-team";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { 
  Building, 
  Shield, 
  Users, 
  Play,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const TeamTest = () => {
  const { refresh } = useTeam();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{success: boolean, message: string} | null>(null);

  const createTestTeam = async () => {
    if (!user) {
      setResult({success: false, message: "You must be logged in to create a team"});
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Step 1: Create a test department
      const { data: deptData, error: deptError } = await supabase
        .from("departments")
        .insert({
          name: "Test Department",
          description: "A test department for demonstration",
          color: "#3B82F6",
          created_by: user.id
        })
        .select()
        .single();

      if (deptError) throw new Error(`Department creation failed: ${deptError.message}`);

      // Step 2: Create test roles
      const testRoles = [
        {
          name: "Test Admin",
          description: "Test admin role with full permissions",
          is_system_role: true,
          permissions: { can_manage_team: true },
          created_by: user.id
        },
        {
          name: "Test Member",
          description: "Test member role with basic permissions",
          is_system_role: false,
          permissions: { can_view_team: true },
          created_by: user.id
        }
      ];

      const { data: rolesData, error: rolesError } = await supabase
        .from("roles")
        .insert(testRoles)
        .select();

      if (rolesError) throw new Error(`Role creation failed: ${rolesError.message}`);

      // Step 3: Add current user as team member
      const { error: memberError } = await supabase
        .from("team_members")
        .insert({
          user_id: user.id,
          department_id: deptData.id,
          role_id: rolesData[0].id,
          status: "active",
          joined_at: new Date().toISOString(),
          created_by: user.id
        });

      if (memberError) throw new Error(`Team member creation failed: ${memberError.message}`);

      setResult({
        success: true, 
        message: "Test team created successfully! Department: Test Department, Roles: Test Admin & Test Member"
      });
      
      // Refresh the team data
      setTimeout(() => {
        refresh();
      }, 1000);
    } catch (err) {
      console.error("Test team creation error:", err);
      setResult({
        success: false, 
        message: err instanceof Error ? err.message : "Failed to create test team"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team Test</h1>
        <p className="text-muted-foreground">Create a test team to verify the system works</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Create Test Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This will create a test department, roles, and add you as a team member to verify the system works correctly.
          </p>
          
          <Button 
            onClick={createTestTeam} 
            disabled={loading}
            className="w-full md:w-auto"
          >
            {loading ? (
              "Creating Test Team..."
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Create Test Team
              </>
            )}
          </Button>
          
          {result && (
            <div className={`mt-4 p-4 rounded-lg ${result.success ? 'bg-green-500/10 border border-green-500/50' : 'bg-red-500/10 border border-red-500/50'}`}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className={result.success ? 'text-green-500' : 'text-red-500'}>
                  {result.message}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">What This Does</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Creates a "Test Department" with you as a member
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles Created</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              "Test Admin" and "Test Member" roles
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Steps</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Navigate to Departments or Team Management to see your data
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamTest;