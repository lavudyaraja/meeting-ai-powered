import { useState, useEffect } from "react";
import { useTeam } from "@/hooks/use-team";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  UserPlus, 
  Search, 
  Calendar, 
  Clock, 
  Filter,
  Upload,
  MoreHorizontal,
  Grid,
  List,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks";

const TeamManagement = () => {
  const { teamMembers, roles, departments, loading, error, refresh } = useTeam();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  // Filter and sort team members
  const filteredMembers = teamMembers
    .filter(member => {
      try {
        const fullName = `${member.user_profiles?.full_name || ''}`;
        const matchesSearch = 
          fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (member.user_profiles?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = selectedRole === "all" || (member.roles?.name?.toLowerCase() === selectedRole);
        const matchesDepartment = selectedDepartment === "all" || (member.departments?.name?.toLowerCase() === selectedDepartment);
        
        return matchesSearch && matchesRole && matchesDepartment;
      } catch (e) {
        console.error("Error filtering member:", e);
        return false;
      }
    })
    .sort((a, b) => {
      try {
        switch (sortBy) {
          case "name":
            const nameA = `${a.user_profiles?.full_name || ''}`;
            const nameB = `${b.user_profiles?.full_name || ''}`;
            return nameA.localeCompare(nameB);
          case "recent":
            return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
          case "active":
            // We don't have meeting stats in real data, so we'll sort by join date
            return new Date(b.joined_at || '').getTime() - new Date(a.joined_at || '').getTime();
          default:
            return 0;
        }
      } catch (e) {
        console.error("Error sorting members:", e);
        return 0;
      }
    });

  // Calculate team statistics
  const totalMembers = teamMembers.length;
  const activeMembers = teamMembers.filter(m => m.status === "active").length;
  const newMembers = teamMembers.filter(m => {
    try {
      const joinedDate = new Date(m.joined_at || '');
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return joinedDate >= thirtyDaysAgo;
    } catch (e) {
      console.error("Error calculating new members:", e);
      return false;
    }
  }).length;

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
          <h3 className="mt-4 text-lg font-medium text-red-500">Error Loading Team Data</h3>
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
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">Manage your team members and departments</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">All team members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMembers}</div>
            <p className="text-xs text-muted-foreground">Online now</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newMembers}</div>
            <p className="text-xs text-muted-foreground">Joined recently</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">Meeting participation</p>
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
                placeholder="Search members..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.name?.toLowerCase() || 'unknown'}>
                      {role.name || 'Unknown Role'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.name?.toLowerCase() || 'unknown'}>
                      {dept.name || 'Unknown Department'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="recent">Recently Added</SelectItem>
                  <SelectItem value="active">Most Active</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="rounded-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="rounded-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.user_profiles?.avatar_url || ''} alt={member.user_profiles?.full_name || ''} />
                      <AvatarFallback>
                        {member.user_profiles?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {member.user_profiles?.full_name || 'Unknown User'}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {member.departments?.name || 'No Department'}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Message</DropdownMenuItem>
                      <DropdownMenuItem>Schedule Meeting</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={member.roles?.name === "Admin" ? "default" : "secondary"}
                      className={member.roles?.name === "Admin" ? "bg-red-500" : ""}
                    >
                      {member.roles?.name || 'Member'}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      style={{ borderColor: member.departments?.color || '#3B82F6' }}
                      className="text-xs"
                    >
                      {member.departments?.name || 'No Department'}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Joined {new Date(member.joined_at || '').toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span>Status:</span>
                    <span className="font-medium capitalize">{member.status || 'active'}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    Message
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="divide-y">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.user_profiles?.avatar_url || ''} alt={member.user_profiles?.full_name || ''} />
                          <AvatarFallback>
                            {member.user_profiles?.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-background"></div>
                      </div>
                      <div>
                        <div className="font-medium">
                          {member.user_profiles?.full_name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {member.user_profiles?.email || 'No email'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm">{member.departments?.name || 'No Department'}</div>
                        <div className="text-xs text-muted-foreground">
                          {member.roles?.name || 'Member'}
                        </div>
                      </div>
                      
                      <Badge 
                        variant={member.roles?.name === "Admin" ? "default" : "secondary"}
                        className={member.roles?.name === "Admin" ? "bg-red-500" : ""}
                      >
                        {member.roles?.name || 'Member'}
                      </Badge>
                      
                      <div className="text-right text-sm">
                        <div>Status: {member.status || 'active'}</div>
                        <div className="text-xs text-muted-foreground">
                          Joined {new Date(member.joined_at || '').toLocaleDateString()}
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Message</DropdownMenuItem>
                          <DropdownMenuItem>Schedule Meeting</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {filteredMembers.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-medium">No team members found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <Button className="mt-4">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamManagement;