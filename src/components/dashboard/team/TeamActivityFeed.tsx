import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  UserPlus, 
  Video, 
  CheckCircle, 
  MessageSquare, 
  FileText, 
  Award, 
  Filter,
  CalendarDays,
  Clock,
  Search,
  Shield
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

// Mock data for team activity
const mockActivities = [
  {
    id: "1",
    type: "meeting-created",
    title: "Product Roadmap Planning",
    description: "Alex Johnson scheduled a new meeting",
    user: {
      name: "Alex Johnson",
      avatar: ""
    },
    timestamp: "2025-10-05T10:30:00Z",
    relatedId: "meeting-123"
  },
  {
    id: "2",
    type: "member-joined",
    title: "New Team Member",
    description: "Sarah Williams joined the Product team",
    user: {
      name: "Sarah Williams",
      avatar: ""
    },
    timestamp: "2025-10-05T09:15:00Z",
    relatedId: "user-456"
  },
  {
    id: "3",
    type: "task-completed",
    title: "Q3 Report Finalized",
    description: "Michael Chen completed a task",
    user: {
      name: "Michael Chen",
      avatar: ""
    },
    timestamp: "2025-10-04T16:45:00Z",
    relatedId: "task-789"
  },
  {
    id: "4",
    type: "ai-insight",
    title: "Key Decision Detected",
    description: "AI identified a critical decision in Product Sync meeting",
    user: {
      name: "AI Assistant",
      avatar: ""
    },
    timestamp: "2025-10-04T14:20:00Z",
    relatedId: "insight-123"
  },
  {
    id: "5",
    type: "role-changed",
    title: "Role Updated",
    description: "Emma Davis promoted to Manager",
    user: {
      name: "Emma Davis",
      avatar: ""
    },
    timestamp: "2025-10-04T11:30:00Z",
    relatedId: "user-321"
  },
  {
    id: "6",
    type: "meeting-completed",
    title: "Weekly Team Sync",
    description: "Meeting completed with 8 attendees",
    user: {
      name: "Team Meeting",
      avatar: ""
    },
    timestamp: "2025-10-03T10:00:00Z",
    relatedId: "meeting-456"
  },
  {
    id: "7",
    type: "document-uploaded",
    title: "Project Proposal",
    description: "Alex Johnson uploaded a new document",
    user: {
      name: "Alex Johnson",
      avatar: ""
    },
    timestamp: "2025-10-02T15:30:00Z",
    relatedId: "doc-789"
  },
  {
    id: "8",
    type: "task-assigned",
    title: "New Assignment",
    description: "Sarah Williams assigned a task to Michael Chen",
    user: {
      name: "Sarah Williams",
      avatar: ""
    },
    timestamp: "2025-10-02T09:45:00Z",
    relatedId: "task-321"
  }
];

const activityTypes = [
  { id: "all", name: "All Activities", icon: Calendar },
  { id: "meeting-created", name: "Meetings Created", icon: Video },
  { id: "member-joined", name: "New Members", icon: UserPlus },
  { id: "task-completed", name: "Tasks Completed", icon: CheckCircle },
  { id: "ai-insight", name: "AI Insights", icon: Award },
  { id: "role-changed", name: "Role Changes", icon: Shield },
  { id: "document-uploaded", name: "Documents", icon: FileText },
  { id: "task-assigned", name: "Task Assignments", icon: MessageSquare }
];

const TeamActivityFeed = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [dateRange, setDateRange] = useState("7days");

  // Filter activities based on search and filters
  const filteredActivities = mockActivities
    .filter(activity => {
      const matchesSearch = 
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === "all" || activity.type === selectedType;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = new Date(activity.timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, typeof mockActivities>);

  const getActivityIcon = (type: string) => {
    const activityType = activityTypes.find(t => t.id === type);
    if (activityType) {
      const Icon = activityType.icon;
      return <Icon className="h-5 w-5" />;
    }
    return <Calendar className="h-5 w-5" />;
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "meeting-created":
      case "meeting-completed":
        return "bg-blue-100 text-blue-800";
      case "member-joined":
        return "bg-green-100 text-green-800";
      case "task-completed":
      case "task-assigned":
        return "bg-purple-100 text-purple-800";
      case "ai-insight":
        return "bg-yellow-100 text-yellow-800";
      case "role-changed":
        return "bg-indigo-100 text-indigo-800";
      case "document-uploaded":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Team Activity</h1>
          <p className="text-muted-foreground">Track what's happening in your team</p>
        </div>
        <Button>Export Activity Log</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search activities..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Activity Type" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {type.name}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
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
                  <DropdownMenuItem>Create Report</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-8">
              {Object.entries(groupedActivities).map(([date, activities]) => (
                <div key={date}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 bg-border"></div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      {date}
                    </div>
                    <div className="h-px flex-1 bg-border"></div>
                  </div>
                  
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="h-full w-0.5 bg-border mt-2"></div>
                        </div>
                        
                        <div className="flex-1 pb-4">
                          <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-medium">{activity.title}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {activity.description}
                                  </p>
                                  <div className="flex items-center gap-2 mt-3">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                                      <AvatarFallback className="text-xs">
                                        {activity.user.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">{activity.user.name}</span>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Clock className="h-3 w-3" />
                                      <span>{new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm">View</Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {filteredActivities.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No activities found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamActivityFeed;