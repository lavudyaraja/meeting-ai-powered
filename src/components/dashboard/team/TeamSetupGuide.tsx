import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Building, 
  Shield, 
  UserPlus, 
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
  ArrowRight
} from "lucide-react";
import { useTeam } from "@/hooks/use-team";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const TeamSetupGuide = () => {
  const { departments, roles, teamMembers, refresh } = useTeam();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1: Department, 2: Roles, 3: Team Members

  const [newDepartment, setNewDepartment] = useState({
    name: "General",
    description: "Default department for all team members",
    color: "#3B82F6"
  });

  const createInitialSetup = async () => {
    if (!user) {
      setError("You must be logged in to create team setup");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Step 1: Create default department
      const { data: deptData, error: deptError } = await supabase
        .from("departments")
        .insert({
          name: newDepartment.name,
          description: newDepartment.description,
          color: newDepartment.color,
          created_by: user.id
        })
        .select()
        .single();

      if (deptError) throw deptError;

      // Step 2: Create default roles
      const defaultRoles = [
        {
          name: "Admin",
          description: "Full access to all system features",
          is_system_role: true,
          permissions: {
            can_manage_team: true,
            can_manage_departments: true,
            can_manage_roles: true
          },
          created_by: user.id
        },
        {
          name: "Member",
          description: "Standard team member with basic access",
          is_system_role: false,
          permissions: {
            can_view_team: true,
            can_view_departments: true
          },
          created_by: user.id
        }
      ];

      const { data: rolesData, error: rolesError } = await supabase
        .from("roles")
        .insert(defaultRoles)
        .select();

      if (rolesError) throw rolesError;

      // Step 3: Add current user as team member with Admin role
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

      if (memberError) throw memberError;

      setSuccess("Team setup completed successfully!");
      setTimeout(() => {
        refresh();
      }, 1500);
    } catch (err) {
      console.error("Setup error:", err);
      setError(err instanceof Error ? err.message : "Failed to setup team");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDepartment = async () => {
    if (!user) {
      setError("You must be logged in to create a department");
      return;
    }

    if (!newDepartment.name.trim()) {
      setError("Department name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: deptData, error: deptError } = await supabase
        .from("departments")
        .insert({
          name: newDepartment.name,
          description: newDepartment.description,
          color: newDepartment.color,
          created_by: user.id
        })
        .select()
        .single();

      if (deptError) throw deptError;

      setSuccess("Department created successfully!");
      setTimeout(() => {
        refresh();
        setStep(2); // Move to roles step
      }, 1500);
    } catch (err) {
      console.error("Department creation error:", err);
      setError(err instanceof Error ? err.message : "Failed to create department");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team Setup Guide</h1>
        <p className="text-muted-foreground">Get started with team management</p>
      </div>

      {error && (
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-500">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {success && (
        <Card className="border-green-500/50 bg-green-500/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-500">{success}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step-by-step setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Setup Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-500' : 'bg-muted'} text-white`}>
                1
              </div>
              <div className="ml-3">
                <p className={`font-medium ${step === 1 ? 'text-blue-500' : 'text-muted-foreground'}`}>Create Department</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-500' : 'bg-muted'} text-white`}>
                2
              </div>
              <div className="ml-3">
                <p className={`font-medium ${step === 2 ? 'text-blue-500' : 'text-muted-foreground'}`}>Create Roles</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-blue-500' : 'bg-muted'} text-white`}>
                3
              </div>
              <div className="ml-3">
                <p className={`font-medium ${step === 3 ? 'text-blue-500' : 'text-muted-foreground'}`}>Add Team Members</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Create Department */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Step 1: Create Your First Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Departments help organize your team members into logical groups. Create your first department to get started.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Department Name *</Label>
                <Input
                  id="name"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                  placeholder="e.g., Engineering, Marketing, Sales"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newDepartment.description}
                  onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                  placeholder="Describe the department's purpose and responsibilities"
                />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={newDepartment.color}
                    onChange={(e) => setNewDepartment({...newDepartment, color: e.target.value})}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={newDepartment.color}
                    onChange={(e) => setNewDepartment({...newDepartment, color: e.target.value})}
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
              <Button 
                onClick={handleCreateDepartment} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  "Creating Department..."
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Department
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Create Roles */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Step 2: Create Basic Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Roles define permissions and responsibilities for team members. Let's create basic roles for your team.
            </p>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Admin Role</h3>
                <p className="text-sm text-muted-foreground">Full access to all features</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Member Role</h3>
                <p className="text-sm text-muted-foreground">Standard access for team members</p>
              </div>
              
              <Button 
                onClick={() => setStep(3)} 
                className="w-full"
              >
                Create These Roles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Add Team Members */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Step 3: Add Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Add team members to your department with appropriate roles.
            </p>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Add Yourself</h3>
                <p className="text-sm text-muted-foreground">As Admin in General department</p>
              </div>
              
              <Button 
                onClick={createInitialSetup} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  "Setting up..."
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Complete Setup
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Setup Option */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Quick Setup (One Click)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Skip the step-by-step process and create everything at once:
          </p>
          <Button 
            onClick={createInitialSetup} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              "Setting up..."
            ) : (
              "Create Complete Team Setup"
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            This will create a "General" department, "Admin" and "Member" roles, and add you as an admin team member.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamSetupGuide;