import { useState } from "react";
import { useTeam } from "@/hooks/use-team";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building, 
  Plus, 
  Edit, 
  Trash, 
  Users, 
  Search,
  Filter,
  MoreHorizontal,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks";
import DepartmentSetup from "./DepartmentSetup";

const DepartmentManagement = () => {
  const { departments, teamMembers, createDepartment, updateDepartment, deleteDepartment, loading, error, refresh } = useTeam();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
    lead_id: ""
  });

  // If there are no departments and no errors, show the setup component
  if (departments.length === 0 && !loading && !error) {
    return <DepartmentSetup />;
  }

  // Filter departments based on search term
  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dept.description && dept.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateDepartment = async () => {
    try {
      if (!newDepartment.name.trim()) {
        alert("Department name is required");
        return;
      }
      
      await createDepartment({
        name: newDepartment.name,
        description: newDepartment.description,
        color: newDepartment.color,
        lead_id: newDepartment.lead_id || null,
        created_by: user?.id || ''
      });
      setIsCreateDialogOpen(false);
      setNewDepartment({
        name: "",
        description: "",
        color: "#3B82F6",
        lead_id: ""
      });
    } catch (err) {
      console.error("Error creating department:", err);
      alert("Failed to create department. Please try again.");
    }
  };

  const handleEditDepartment = async () => {
    if (!selectedDepartment) return;
    
    try {
      if (!newDepartment.name.trim()) {
        alert("Department name is required");
        return;
      }
      
      await updateDepartment(selectedDepartment, {
        name: newDepartment.name,
        description: newDepartment.description,
        color: newDepartment.color,
        lead_id: newDepartment.lead_id || null
      });
      setIsEditDialogOpen(false);
      setSelectedDepartment(null);
    } catch (err) {
      console.error("Error editing department:", err);
      alert("Failed to update department. Please try again.");
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this department?")) {
      return;
    }
    
    try {
      await deleteDepartment(id);
    } catch (err) {
      console.error("Error deleting department:", err);
      alert("Failed to delete department. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-medium text-red-500">Error Loading Department Data</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>
          <div className="mt-6">
            <Button onClick={refresh} className="mr-2">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-muted-foreground">Manage your team departments and organization</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Department</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Department Name *</Label>
                <Input
                  id="name"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                  placeholder="e.g., Engineering"
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
              <div>
                <Label htmlFor="lead">Department Lead</Label>
                <Select value={newDepartment.lead_id} onValueChange={(value) => setNewDepartment({...newDepartment, lead_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map(member => (
                      <SelectItem key={member.user_id || member.id} value={member.user_id || ''}>
                        {member.user_profiles?.full_name || member.user_profiles?.email || 'Unknown User'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateDepartment}>
                  Create Department
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {departments.length > 0 
                ? Math.round(teamMembers.length / departments.length) 
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Members per department</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Largest Department</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {departments.length > 0 
                ? departments.reduce((prev, current) => {
                    const prevCount = teamMembers.filter(m => m.department_id === prev.id).length;
                    const currentCount = teamMembers.filter(m => m.department_id === current.id).length;
                    return prevCount > currentCount ? prev : current;
                  }).name
                : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {departments.length > 0 
                ? teamMembers.filter(m => m.department_id === departments.reduce((prev, current) => {
                    const prevCount = teamMembers.filter(m => m.department_id === prev.id).length;
                    const currentCount = teamMembers.filter(m => m.department_id === current.id).length;
                    return prevCount > currentCount ? prev : current;
                  }).id).length + ' members'
                : '0 members'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search departments..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Select>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="members">Member Count</SelectItem>
                  <SelectItem value="recent">Recently Created</SelectItem>
                </SelectContent>
              </Select>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                  <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((department) => {
          // Count members in this department
          const memberCount = teamMembers.filter(m => m.department_id === department.id).length;
          
          // Find department lead
          const lead = teamMembers.find(m => m.user_id === department.lead_id);
          
          return (
            <Card key={department.id} className="overflow-hidden">
              <div 
                className="h-2 w-full" 
                style={{ backgroundColor: department.color || '#3B82F6' }}
              ></div>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: department.color || '#3B82F6' }}
                    ></div>
                    {department.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {department.description}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => {
                        setSelectedDepartment(department.id);
                        setNewDepartment({
                          name: department.name,
                          description: department.description || '',
                          color: department.color || '#3B82F6',
                          lead_id: department.lead_id || ''
                        });
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDeleteDepartment(department.id)}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Members</span>
                    <Badge variant="secondary">{memberCount}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Lead</span>
                    {lead ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={lead.user_profiles?.avatar_url || ''} alt={lead.user_profiles?.full_name || ''} />
                          <AvatarFallback>
                            {lead.user_profiles?.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{lead.user_profiles?.full_name || 'Unknown User'}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No lead assigned</span>
                    )}
                  </div>
                  
                  <div className="pt-2">
                    <Button variant="outline" className="w-full" size="sm">
                      View Members
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredDepartments.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <Building className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-medium">No departments found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or create a new department.
            </p>
            <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Department
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Department Name *</Label>
              <Input
                id="edit-name"
                value={newDepartment.name}
                onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                placeholder="e.g., Engineering"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={newDepartment.description}
                onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                placeholder="Describe the department's purpose and responsibilities"
              />
            </div>
            <div>
              <Label htmlFor="edit-color">Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="edit-color"
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
            <div>
              <Label htmlFor="edit-lead">Department Lead</Label>
              <Select value={newDepartment.lead_id} onValueChange={(value) => setNewDepartment({...newDepartment, lead_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map(member => (
                    <SelectItem key={member.user_id || member.id} value={member.user_id || ''}>
                      {member.user_profiles?.full_name || member.user_profiles?.email || 'Unknown User'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditDepartment}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentManagement;