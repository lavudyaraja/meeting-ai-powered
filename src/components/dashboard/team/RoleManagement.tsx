import { useState } from "react";
import { useTeam } from "@/hooks/use-team";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash, 
  Search,
  Filter,
  MoreHorizontal,
  Check,
  X,
  Users
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
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks";

const RoleManagement = () => {
  const { roles, teamMembers, createRole, updateRole, deleteRole, loading, error } = useTeam();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: {
      meetings: { create: false, edit: false, delete: false, view: false },
      recordings: { access: false, download: false, delete: false },
      ai: { use: false, view: false },
      analytics: { view: false, export: false },
      team: { invite: false, remove: false, edit: false },
      billing: { view: false, edit: false }
    }
  });

  // Filter roles based on search term
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateRole = async () => {
    try {
      await createRole({
        name: newRole.name,
        description: newRole.description,
        permissions: newRole.permissions,
        created_by: user?.id || '',
        is_system_role: false
      });
      setIsCreateDialogOpen(false);
      setNewRole({
        name: "",
        description: "",
        permissions: {
          meetings: { create: false, edit: false, delete: false, view: false },
          recordings: { access: false, download: false, delete: false },
          ai: { use: false, view: false },
          analytics: { view: false, export: false },
          team: { invite: false, remove: false, edit: false },
          billing: { view: false, edit: false }
        }
      });
    } catch (err) {
      console.error("Error creating role:", err);
    }
  };

  const handleEditRole = async () => {
    if (!selectedRole) return;
    
    try {
      await updateRole(selectedRole, {
        name: newRole.name,
        description: newRole.description,
        permissions: newRole.permissions
      });
      setIsEditDialogOpen(false);
      setSelectedRole(null);
    } catch (err) {
      console.error("Error editing role:", err);
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      await deleteRole(id);
    } catch (err) {
      console.error("Error deleting role:", err);
    }
  };

  const togglePermission = (category: string, permission: string) => {
    setNewRole({
      ...newRole,
      permissions: {
        ...newRole.permissions,
        [category]: {
          ...newRole.permissions[category as keyof typeof newRole.permissions],
          [permission]: !newRole.permissions[category as keyof typeof newRole.permissions][permission as keyof typeof newRole.permissions.meetings]
        }
      }
    });
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
        <div className="text-center text-red-500">
          <p>Error loading role data: {error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Roles & Permissions</h1>
          <p className="text-muted-foreground">Manage access control for your team</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="role-name">Role Name</Label>
                  <Input
                    id="role-name"
                    value={newRole.name}
                    onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                    placeholder="e.g., Project Manager"
                  />
                </div>
                <div>
                  <Label htmlFor="role-description">Description</Label>
                  <Textarea
                    id="role-description"
                    value={newRole.description}
                    onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                    placeholder="Describe the role's purpose and responsibilities"
                  />
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Permissions</h3>
                  <div className="space-y-6">
                    {/* Meetings */}
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Meetings
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Create</span>
                          <Switch 
                            checked={newRole.permissions.meetings.create}
                            onCheckedChange={() => togglePermission('meetings', 'create')}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Edit</span>
                          <Switch 
                            checked={newRole.permissions.meetings.edit}
                            onCheckedChange={() => togglePermission('meetings', 'edit')}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Delete</span>
                          <Switch 
                            checked={newRole.permissions.meetings.delete}
                            onCheckedChange={() => togglePermission('meetings', 'delete')}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">View</span>
                          <Switch 
                            checked={newRole.permissions.meetings.view}
                            onCheckedChange={() => togglePermission('meetings', 'view')}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Recordings */}
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Recordings
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Access</span>
                          <Switch 
                            checked={newRole.permissions.recordings.access}
                            onCheckedChange={() => togglePermission('recordings', 'access')}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Download</span>
                          <Switch 
                            checked={newRole.permissions.recordings.download}
                            onCheckedChange={() => togglePermission('recordings', 'download')}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Delete</span>
                          <Switch 
                            checked={newRole.permissions.recordings.delete}
                            onCheckedChange={() => togglePermission('recordings', 'delete')}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* AI Features */}
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        AI Features
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Use Assistant</span>
                          <Switch 
                            checked={newRole.permissions.ai.use}
                            onCheckedChange={() => togglePermission('ai', 'use')}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">View Insights</span>
                          <Switch 
                            checked={newRole.permissions.ai.view}
                            onCheckedChange={() => togglePermission('ai', 'view')}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Analytics */}
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        Analytics
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">View Reports</span>
                          <Switch 
                            checked={newRole.permissions.analytics.view}
                            onCheckedChange={() => togglePermission('analytics', 'view')}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Export Data</span>
                          <Switch 
                            checked={newRole.permissions.analytics.export}
                            onCheckedChange={() => togglePermission('analytics', 'export')}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Team Management */}
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        Team Management
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Invite Members</span>
                          <Switch 
                            checked={newRole.permissions.team.invite}
                            onCheckedChange={() => togglePermission('team', 'invite')}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Edit Members</span>
                          <Switch 
                            checked={newRole.permissions.team.edit}
                            onCheckedChange={() => togglePermission('team', 'edit')}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Remove Members</span>
                          <Switch 
                            checked={newRole.permissions.team.remove}
                            onCheckedChange={() => togglePermission('team', 'remove')}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Billing & Settings */}
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        Billing & Settings
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">View Settings</span>
                          <Switch 
                            checked={newRole.permissions.billing.view}
                            onCheckedChange={() => togglePermission('billing', 'view')}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Edit Settings</span>
                          <Switch 
                            checked={newRole.permissions.billing.edit}
                            onCheckedChange={() => togglePermission('billing', 'edit')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRole}>
                    Create Role
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">Active roles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.filter(r => !r.is_system_role).length}</div>
            <p className="text-xs text-muted-foreground">User-defined roles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Used Role</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roles.length > 0 
                ? roles.reduce((prev, current) => {
                    const prevCount = teamMembers.filter(m => m.role_id === prev.id).length;
                    const currentCount = teamMembers.filter(m => m.role_id === current.id).length;
                    return prevCount > currentCount ? prev : current;
                  }).name
                : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {roles.length > 0 
                ? teamMembers.filter(m => m.role_id === roles.reduce((prev, current) => {
                    const prevCount = teamMembers.filter(m => m.role_id === prev.id).length;
                    const currentCount = teamMembers.filter(m => m.role_id === current.id).length;
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
                placeholder="Search roles..."
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
                  <SelectItem value="custom">Custom First</SelectItem>
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

      {/* Roles List */}
      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {filteredRoles.map((role) => {
                // Count members with this role
                const memberCount = teamMembers.filter(m => m.role_id === role.id).length;
                
                return (
                  <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${role.is_system_role ? 'bg-blue-100' : 'bg-purple-100'}`}>
                        <Shield className={`h-5 w-5 ${role.is_system_role ? 'text-blue-600' : 'text-purple-600'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{role.name}</h3>
                          {!role.is_system_role && (
                            <Badge variant="secondary">Custom</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{memberCount} members</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {role.permissions ? Object.values(role.permissions).flatMap(cat => Object.values(cat as Record<string, boolean>)).filter(Boolean).length : 0} permissions
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedRole(role.id);
                              setNewRole({
                                name: role.name,
                                description: role.description || '',
                                permissions: role.permissions ? JSON.parse(JSON.stringify(role.permissions)) : {
                                  meetings: { create: false, edit: false, delete: false, view: false },
                                  recordings: { access: false, download: false, delete: false },
                                  ai: { use: false, view: false },
                                  analytics: { view: false, export: false },
                                  team: { invite: false, remove: false, edit: false },
                                  billing: { view: false, edit: false }
                                }
                              });
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {!role.is_system_role && (
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              <Trash className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {filteredRoles.length === 0 && (
              <div className="text-center py-12">
                <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No roles found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or create a new role.
                </p>
                <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Role
                </Button>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6">
              <div>
                <Label htmlFor="edit-role-name">Role Name</Label>
                <Input
                  id="edit-role-name"
                  value={newRole.name}
                  onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                  placeholder="e.g., Project Manager"
                />
              </div>
              <div>
                <Label htmlFor="edit-role-description">Description</Label>
                <Textarea
                  id="edit-role-description"
                  value={newRole.description}
                  onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                  placeholder="Describe the role's purpose and responsibilities"
                />
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Permissions</h3>
                <div className="space-y-6">
                  {/* Meetings */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      Meetings
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Create</span>
                        <Switch 
                          checked={newRole.permissions.meetings.create}
                          onCheckedChange={() => togglePermission('meetings', 'create')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Edit</span>
                        <Switch 
                          checked={newRole.permissions.meetings.edit}
                          onCheckedChange={() => togglePermission('meetings', 'edit')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Delete</span>
                        <Switch 
                          checked={newRole.permissions.meetings.delete}
                          onCheckedChange={() => togglePermission('meetings', 'delete')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">View</span>
                        <Switch 
                          checked={newRole.permissions.meetings.view}
                          onCheckedChange={() => togglePermission('meetings', 'view')}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Recordings */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Recordings
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Access</span>
                        <Switch 
                          checked={newRole.permissions.recordings.access}
                          onCheckedChange={() => togglePermission('recordings', 'access')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Download</span>
                        <Switch 
                          checked={newRole.permissions.recordings.download}
                          onCheckedChange={() => togglePermission('recordings', 'download')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Delete</span>
                        <Switch 
                          checked={newRole.permissions.recordings.delete}
                          onCheckedChange={() => togglePermission('recordings', 'delete')}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Features */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      AI Features
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Use Assistant</span>
                        <Switch 
                          checked={newRole.permissions.ai.use}
                          onCheckedChange={() => togglePermission('ai', 'use')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">View Insights</span>
                        <Switch 
                          checked={newRole.permissions.ai.view}
                          onCheckedChange={() => togglePermission('ai', 'view')}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Analytics */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      Analytics
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">View Reports</span>
                        <Switch 
                          checked={newRole.permissions.analytics.view}
                          onCheckedChange={() => togglePermission('analytics', 'view')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Export Data</span>
                        <Switch 
                          checked={newRole.permissions.analytics.export}
                          onCheckedChange={() => togglePermission('analytics', 'export')}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Team Management */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      Team Management
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Invite Members</span>
                        <Switch 
                          checked={newRole.permissions.team.invite}
                          onCheckedChange={() => togglePermission('team', 'invite')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Edit Members</span>
                        <Switch 
                          checked={newRole.permissions.team.edit}
                          onCheckedChange={() => togglePermission('team', 'edit')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Remove Members</span>
                        <Switch 
                          checked={newRole.permissions.team.remove}
                          onCheckedChange={() => togglePermission('team', 'remove')}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Billing & Settings */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      Billing & Settings
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">View Settings</span>
                        <Switch 
                          checked={newRole.permissions.billing.view}
                          onCheckedChange={() => togglePermission('billing', 'view')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Edit Settings</span>
                        <Switch 
                          checked={newRole.permissions.billing.edit}
                          onCheckedChange={() => togglePermission('billing', 'edit')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditRole}>
                  Save Changes
                </Button>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagement;