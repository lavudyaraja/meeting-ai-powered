import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Award, 
  TrendingUp, 
  CalendarDays,
  MessageSquare,
  Video,
  CheckCircle,
  BarChart3,
  Shield,
  Edit,
  MoreHorizontal
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for a team member
const mockMember = {
  id: "1",
  firstName: "Alex",
  lastName: "Johnson",
  email: "alex.johnson@company.com",
  phone: "+1 (555) 123-4567",
  jobTitle: "Senior Product Manager",
  department: "Product",
  role: "Manager",
  status: "active",
  isOnline: true,
  lastActive: "2025-10-05T10:30:00Z",
  joinedDate: "2024-01-15T00:00:00Z",
  avatar: "",
  bio: "Product leader with 10 years of experience in building innovative solutions. Passionate about user-centered design and agile methodologies.",
  location: "San Francisco, CA",
  timezone: "PST (UTC-8)",
  stats: {
    meetingsAttended: 145,
    meetingsOrganized: 67,
    tasksCompleted: 234,
    aiInsightsGenerated: 89,
    attendanceRate: 94.5,
    punctuality: 87.2,
    engagement: 92.1
  },
  permissions: {
    meetings: {
      create: true,
      edit: true,
      delete: true,
      view: true
    },
    team: {
      invite: true,
      edit: false,
      remove: false
    },
    analytics: {
      view: true,
      export: false
    }
  }
};

// Mock data for recent meetings
const mockMeetings = [
  {
    id: "1",
    title: "Product Roadmap Planning",
    date: "2025-10-04T14:00:00Z",
    duration: 3600, // in seconds
    status: "completed",
    attendees: 12
  },
  {
    id: "2",
    title: "Weekly Team Sync",
    date: "2025-10-03T09:00:00Z",
    duration: 1800,
    status: "completed",
    attendees: 8
  },
  {
    id: "3",
    title: "Client Presentation",
    date: "2025-10-02T15:30:00Z",
    duration: 5400,
    status: "completed",
    attendees: 15
  },
  {
    id: "4",
    title: "Sprint Planning",
    date: "2025-10-01T10:00:00Z",
    duration: 4200,
    status: "completed",
    attendees: 10
  }
];

// Mock data for tasks
const mockTasks = [
  {
    id: "1",
    title: "Prepare Q4 roadmap presentation",
    status: "completed",
    dueDate: "2025-10-05T17:00:00Z",
    assignee: "Alex Johnson"
  },
  {
    id: "2",
    title: "Review user feedback for new features",
    status: "in-progress",
    dueDate: "2025-10-10T17:00:00Z",
    assignee: "Alex Johnson"
  },
  {
    id: "3",
    title: "Coordinate with engineering team on timeline",
    status: "pending",
    dueDate: "2025-10-12T17:00:00Z",
    assignee: "Alex Johnson"
  }
];

const TeamMemberProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={mockMember.avatar} alt={`${mockMember.firstName} ${mockMember.lastName}`} />
              <AvatarFallback className="text-2xl">
                {mockMember.firstName.charAt(0)}
                {mockMember.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {mockMember.isOnline && (
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-4 border-background"></div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">
                {mockMember.firstName} {mockMember.lastName}
              </h1>
              {mockMember.isOnline && (
                <Badge variant="default" className="bg-green-500">
                  Online
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{mockMember.jobTitle}</p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>{mockMember.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>{mockMember.phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{mockMember.location}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button>
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
          </Button>
          <Button variant="outline">
            <Video className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem>Export Data</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Remove Member</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meetings Attended</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMember.stats.meetingsAttended}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMember.stats.tasksCompleted}</div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMember.stats.attendanceRate}%</div>
            <Progress value={mockMember.stats.attendanceRate} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMember.stats.engagement}%</div>
            <Progress value={mockMember.stats.engagement} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Full Name</Label>
                    <p>{mockMember.firstName} {mockMember.lastName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p>{mockMember.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p>{mockMember.phone}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Location</Label>
                    <p>{mockMember.location}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Job Title</Label>
                    <p>{mockMember.jobTitle}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Department</Label>
                    <p>{mockMember.department}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Role</Label>
                    <p>{mockMember.role}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Timezone</Label>
                    <p>{mockMember.timezone}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Joined Date</Label>
                    <p>{new Date(mockMember.joinedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Last Active</Label>
                    <p>{new Date(mockMember.lastActive).toLocaleString()}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Bio</Label>
                  <p className="mt-1">{mockMember.bio}</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-blue-100 p-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Attended Product Roadmap Planning</p>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-green-100 p-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Completed task: Review user feedback</p>
                      <p className="text-sm text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-purple-100 p-2">
                      <MessageSquare className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Posted 3 comments in team chat</p>
                      <p className="text-sm text-muted-foreground">Oct 3, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-orange-100 p-2">
                      <Award className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Generated 5 AI insights</p>
                      <p className="text-sm text-muted-foreground">Oct 2, 2025</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="meetings" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Meeting Activity</CardTitle>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Meetings</SelectItem>
                      <SelectItem value="organized">Organized</SelectItem>
                      <SelectItem value="attended">Attended</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">Export</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMeetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{meeting.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          <span>{new Date(meeting.date).toLocaleDateString()}</span>
                        </div>
                        <div>
                          {Math.floor(meeting.duration / 60)} min
                        </div>
                        <div>
                          {meeting.attendees} attendees
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{meeting.status}</Badge>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Metrics */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Meeting Attendance</span>
                    <span className="text-sm font-medium">{mockMember.stats.attendanceRate}%</span>
                  </div>
                  <Progress value={mockMember.stats.attendanceRate} />
                  <p className="text-xs text-muted-foreground mt-1">
                    Attended {mockMember.stats.meetingsAttended} of {Math.round(mockMember.stats.meetingsAttended * 100 / mockMember.stats.attendanceRate)} meetings
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Punctuality</span>
                    <span className="text-sm font-medium">{mockMember.stats.punctuality}%</span>
                  </div>
                  <Progress value={mockMember.stats.punctuality} />
                  <p className="text-xs text-muted-foreground mt-1">
                    Joined meetings on time in {mockMember.stats.punctuality}% of cases
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Engagement</span>
                    <span className="text-sm font-medium">{mockMember.stats.engagement}%</span>
                  </div>
                  <Progress value={mockMember.stats.engagement} />
                  <p className="text-xs text-muted-foreground mt-1">
                    Active participation in discussions
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Tasks Completion</span>
                    <span className="text-sm font-medium">87%</span>
                  </div>
                  <Progress value={87} />
                  <p className="text-xs text-muted-foreground mt-1">
                    Completed {mockMember.stats.tasksCompleted} tasks this quarter
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle>AI Insights Generated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center my-4">
                  {mockMember.stats.aiInsightsGenerated}
                </div>
                <p className="text-center text-muted-foreground mb-6">
                  Actionable insights from meetings
                </p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Action Items</span>
                      <span>34</span>
                    </div>
                    <Progress value={68} className="mt-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Key Decisions</span>
                      <span>12</span>
                    </div>
                    <Progress value={48} className="mt-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Questions Raised</span>
                      <span>43</span>
                    </div>
                    <Progress value={86} className="mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Task Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Task Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          task.status === "completed" ? "default" : 
                          task.status === "in-progress" ? "secondary" : "outline"
                        }
                      >
                        {task.status.replace("-", " ")}
                      </Badge>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role & Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Current Role</h3>
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className="rounded-full bg-blue-100 p-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{mockMember.role}</p>
                    <p className="text-sm text-muted-foreground">
                      {mockMember.role === "Admin" 
                        ? "Full access to all features and settings" 
                        : mockMember.role === "Manager"
                        ? "Manage team meetings and view reports"
                        : mockMember.role === "Member"
                        ? "Create meetings and use basic features"
                        : "View-only access to limited meetings"}
                    </p>
                  </div>
                  <Button variant="outline" className="ml-auto">Change Role</Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Permission Matrix</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Meetings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>Create</span>
                        <Badge variant={mockMember.permissions.meetings.create ? "default" : "secondary"}>
                          {mockMember.permissions.meetings.create ? "Allowed" : "Denied"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>Edit</span>
                        <Badge variant={mockMember.permissions.meetings.edit ? "default" : "secondary"}>
                          {mockMember.permissions.meetings.edit ? "Allowed" : "Denied"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>Delete</span>
                        <Badge variant={mockMember.permissions.meetings.delete ? "default" : "secondary"}>
                          {mockMember.permissions.meetings.delete ? "Allowed" : "Denied"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>View</span>
                        <Badge variant={mockMember.permissions.meetings.view ? "default" : "secondary"}>
                          {mockMember.permissions.meetings.view ? "Allowed" : "Denied"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Team</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>Invite Members</span>
                        <Badge variant={mockMember.permissions.team.invite ? "default" : "secondary"}>
                          {mockMember.permissions.team.invite ? "Allowed" : "Denied"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>Edit Members</span>
                        <Badge variant={mockMember.permissions.team.edit ? "default" : "secondary"}>
                          {mockMember.permissions.team.edit ? "Allowed" : "Denied"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>Remove Members</span>
                        <Badge variant={mockMember.permissions.team.remove ? "default" : "secondary"}>
                          {mockMember.permissions.team.remove ? "Allowed" : "Denied"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Analytics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>View Reports</span>
                        <Badge variant={mockMember.permissions.analytics.view ? "default" : "secondary"}>
                          {mockMember.permissions.analytics.view ? "Allowed" : "Denied"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>Export Data</span>
                        <Badge variant={mockMember.permissions.analytics.export ? "default" : "secondary"}>
                          {mockMember.permissions.analytics.export ? "Allowed" : "Denied"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Permission History</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Role changed to Manager</p>
                      <p className="text-sm text-muted-foreground">by Sarah Williams on Oct 1, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Granted meeting creation permission</p>
                      <p className="text-sm text-muted-foreground">by Michael Chen on Sep 15, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Award className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Granted analytics view permission</p>
                      <p className="text-sm text-muted-foreground">by Admin on Aug 22, 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamMemberProfile;