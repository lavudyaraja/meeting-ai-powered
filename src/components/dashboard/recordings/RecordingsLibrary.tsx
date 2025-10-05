import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Grid, 
  List, 
  Play, 
  Download, 
  Share2, 
  MoreHorizontal, 
  Filter,
  Calendar,
  Clock,
  FileText,
  Star,
  Folder,
  Upload,
  Video,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { useNavigate } from "react-router-dom";
import { useRecordings } from "@/hooks/use-recordings";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

// Mock data for folders
const mockFolders = [
  { id: "1", name: "All Recordings", count: 42 },
  { id: "2", name: "Product Team", count: 18 },
  { id: "3", name: "Engineering", count: 24 },
  { id: "4", name: "Client Meetings", count: 7 }
];

const RecordingsLibrary = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const { recordings, loading, error, toggleFavorite, incrementViewCount } = useRecordings(user?.id || null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("1");
  const [sortBy, setSortBy] = useState("recent");

  // Get user session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Filter and sort recordings
  const filteredRecordings = recordings
    .filter(recording => {
      return recording.title.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
        case "oldest":
          return new Date(a.created_at || "").getTime() - new Date(b.created_at || "").getTime();
        case "duration":
          return (b.duration || 0) - (a.duration || 0);
        case "views":
          return (b.views_count || 0) - (a.views_count || 0);
        default:
          return 0;
      }
    });

  // Format duration
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0m 0s";
    
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m ${secs}s`;
  };

  // Format file size
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "0 MB";
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Handle play recording
  const handlePlayRecording = async (id: string) => {
    // Increment view count
    await incrementViewCount(id);
    // Navigate to player
    navigate(`/dashboard#recordings/player?id=${id}`);
  };

  // Handle toggle favorite
  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    await toggleFavorite(id, isFavorite);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="py-12">
        <CardContent className="text-center">
          <div className="mx-auto h-12 w-12 text-red-500 mb-4">
            <FileText className="h-12 w-12" />
          </div>
          <h3 className="mt-4 font-medium">Error loading recordings</h3>
          <p className="text-muted-foreground">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Recordings</h1>
          <p className="text-muted-foreground">Manage your meeting recordings and transcripts</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload Recording
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recordings</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recordings.length}</div>
            <p className="text-xs text-muted-foreground">All recordings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recordings.filter(r => {
                const today = new Date();
                const recordingDate = new Date(r.created_at || "");
                return recordingDate.toDateString() === today.toDateString();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Recordings added</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recordings.filter(r => {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                const recordingDate = new Date(r.created_at || "");
                return recordingDate > oneWeekAgo;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Recordings added</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFileSize(recordings.reduce((acc, r) => acc + (r.file_size || 0), 0))}
            </div>
            <p className="text-xs text-muted-foreground">Storage used</p>
          </CardContent>
        </Card>
      </div>

      {/* Folders */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {mockFolders.map(folder => (
          <Button
            key={folder.id}
            variant={selectedFolder === folder.id ? "default" : "outline"}
            className="flex items-center gap-2 whitespace-nowrap"
            onClick={() => setSelectedFolder(folder.id)}
          >
            <Folder className="h-4 w-4" />
            {folder.name}
            <Badge variant="secondary" className="ml-1">
              {folder.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search recordings..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
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

      {/* Recordings */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecordings.map((recording) => (
            <Card key={recording.id} className="overflow-hidden">
              <div className="relative">
                <div 
                  className="bg-muted aspect-video flex items-center justify-center cursor-pointer"
                  onClick={() => handlePlayRecording(recording.id)}
                >
                  <Video className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleToggleFavorite(recording.id, recording.is_favorite || false)}
                  >
                    <Star 
                      className={`h-4 w-4 ${recording.is_favorite ? "fill-yellow-500 text-yellow-500" : ""}`} 
                    />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {formatDuration(recording.duration)}
                </div>
                <div className="absolute bottom-2 right-2">
                  <Badge 
                    variant={recording.status === "ready" ? "default" : "secondary"}
                    className={recording.status === "processing" ? "animate-pulse" : ""}
                  >
                    {recording.status}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 
                  className="font-semibold line-clamp-2 mb-2 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handlePlayRecording(recording.id)}
                >
                  {recording.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(recording.created_at || "").toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex -space-x-2">
                    {[...Array(Math.min(3, recording.participants_count || 0))].map((_, i) => (
                      <Avatar key={i} className="h-6 w-6 border-2 border-background">
                        <AvatarFallback className="text-xs">U{i+1}</AvatarFallback>
                      </Avatar>
                    ))}
                    {(recording.participants_count || 0) > 3 && (
                      <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                        +{(recording.participants_count || 0) - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{recording.views_count || 0} views</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => handlePlayRecording(recording.id)}>
                    <Play className="h-4 w-4 mr-1" />
                    Play
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem>Add to Playlist</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                {filteredRecordings.map((recording) => (
                  <div 
                    key={recording.id} 
                    className="p-4 flex items-center justify-between hover:bg-muted/50 cursor-pointer"
                    onClick={() => handlePlayRecording(recording.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="bg-muted h-16 w-24 flex items-center justify-center">
                          <Video className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                          {formatDuration(recording.duration)}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {recording.title}
                          {recording.is_favorite && (
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(recording.created_at || "").toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>{formatFileSize(recording.file_size)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{recording.participants_count || 0} participants</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant={recording.status === "ready" ? "default" : "secondary"}
                            className={recording.status === "processing" ? "animate-pulse" : ""}
                          >
                            {recording.status}
                          </Badge>
                          {recording.transcript_url && (
                            <Badge variant="outline">
                              Transcript ready
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-right text-sm mr-4">
                        <div>{recording.views_count || 0} views</div>
                      </div>
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); handlePlayRecording(recording.id); }}>
                        <Play className="h-4 w-4 mr-1" />
                        Play
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>Add to Playlist</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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

      {filteredRecordings.length === 0 && !loading && (
        <Card className="py-12">
          <CardContent className="text-center">
            <Video className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-medium">No recordings found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <Button className="mt-4">
              <Upload className="w-4 h-4 mr-2" />
              Upload Recording
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecordingsLibrary;