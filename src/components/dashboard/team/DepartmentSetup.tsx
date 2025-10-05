import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building, Plus, AlertCircle, CheckCircle } from "lucide-react";
import { useTeam } from "@/hooks/use-team";
import { useAuth } from "@/hooks";

const DepartmentSetup = () => {
  const { createDepartment, refresh } = useTeam();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newDepartment, setNewDepartment] = useState({
    name: "General",
    description: "Default department for all team members",
    color: "#3B82F6"
  });

  const handleCreateFirstDepartment = async () => {
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
    setSuccess(null);

    try {
      await createDepartment({
        name: newDepartment.name,
        description: newDepartment.description,
        color: newDepartment.color,
        created_by: user.id
      } as any); // Type assertion to bypass strict typing for initialization
      
      setSuccess("Department created successfully!");
      setTimeout(() => {
        refresh();
      }, 1500);
    } catch (err) {
      console.error("Error creating department:", err);
      setError(err instanceof Error ? err.message : "Failed to create department");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Department Setup</h1>
        <p className="text-muted-foreground">Create your first department to get started</p>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Create Your First Department
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Departments help organize your team members into logical groups. Create your first department to get started with team management.
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
              onClick={handleCreateFirstDepartment} 
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

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>After creating your department, you'll be able to add team members</li>
            <li>Create additional departments as needed for your organization</li>
            <li>Assign team members to departments</li>
            <li>Create roles and permissions for your team</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentSetup;