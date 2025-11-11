import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, Grid, List, Play, Download, Share2, MoreHorizontal, 
  Filter, Calendar, Clock, FileText, Star, Folder, Upload,
  Video, Users, Loader2, Plus, FolderPlus, Trash2, Edit2,
  TrendingUp, CheckCircle2, AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useRecordings } from "@/hooks/use-recordings"; // Fixed import path
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import type { Folder as FolderType } from "@/types/database";

// Define Folder interface locally since it's not in Supabase types
interface Folder {
  id: string;
  user_id: string;
  name: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

// Extend the Recording type to include folder_id
interface RecordingWithFolder {
  id: string;
  meeting_id: string | null;
  title: string;
  description: string | null;
  file_url: string | null;
  transcript_url: string | null;
  duration: number | null;
  file_size: number | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
  participants_count: number | null;
  views_count: number | null;
  is_favorite: boolean | null;
  folder_id?: string | null;
  thumbnail_url?: string | null;
  tags?: string[] | null;
}

const RecordingsLibrary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const { recordings, loading, error, toggleFavorite, incrementViewCount } = useRecordings(user?.id || null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("recent");
  const [statusFilter, setStatusFilter] = useState("all");
  const [folders, setFolders] = useState<Folder[]>([]); // Use local Folder interface
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedRecordings, setSelectedRecordings] = useState<string[]>([]);
  const [bulkActionMode, setBulkActionMode] = useState(false);

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

  // Fetch folders
  useEffect(() => {
    if (!user) return;

    const fetchFolders = async () => {
      // Use any to bypass type checking for folders table
      const { data, error } = await (supabase as any)
        .from('folders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setFolders(data);
      }
    };

    fetchFolders();

    // Real-time subscription for folders
    const channel = (supabase as any)
      .channel('folders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'folders',
          filter: `user_id=eq.${user.id}`
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            setFolders((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setFolders((prev) => prev.filter((f) => f.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setFolders((prev) =>
              prev.map((f) => (f.id === payload.new.id ? payload.new : f))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Create folder
  const handleCreateFolder = async () => {
    if (!user || !newFolderName.trim()) return;

    const { error } = await (supabase as any)
      .from('folders')
      .insert([{ user_id: user.id, name: newFolderName }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive"
      });
    } else {
      setNewFolderName("");
      setIsCreateFolderOpen(false);
      toast({
        title: "Success",
        description: "Folder created successfully"
      });
    }
  };

  // Delete folder
  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm("Are you sure you want to delete this folder? Recordings will not be deleted.")) return;

    const { error } = await (supabase as any)
      .from('folders')
      .delete()
      .eq('id', folderId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete folder",
        variant: "destructive"
      });
    } else {
      if (selectedFolder === folderId) {
        setSelectedFolder(null);
      }
      toast({
        title: "Success",
        description: "Folder deleted successfully"
      });
    }
  };

  // Move recording to folder
  const handleMoveToFolder = async (recordingId: string, folderId: string | null) => {
    // Update the recordings table with folder_id (need to cast to any since it's not in the type)
    const { error } = await (supabase as any)
      .from('recordings')
      .update({ folder_id: folderId })
      .eq('id', recordingId)
      .eq('created_by', user?.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to move recording",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Recording moved successfully"
      });
    }
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedRecordings.length} recordings?`)) return;

    const { error } = await (supabase as any)
      .from('recordings')
      .delete()
      .in('id', selectedRecordings)
      .eq('created_by', user?.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete recordings",
        variant: "destructive"
      });
    } else {
      setSelectedRecordings([]);
      setBulkActionMode(false);
      toast({
        title: "Success",
        description: `${selectedRecordings.length} recordings deleted`
      });
    }
  };

  const handleBulkMoveToFolder = async (folderId: string | null) => {
    const { error } = await (supabase as any)
      .from('recordings')
      .update({ folder_id: folderId })
      .in('id', selectedRecordings)
      .eq('created_by', user?.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to move recordings",
        variant: "destructive"
      });
    } else {
      setSelectedRecordings([]);
      toast({
        title: "Success",
        description: `${selectedRecordings.length} recordings moved`
      });
    }
  };

  // Filter and sort recordings
  const filteredRecordings = (recordings as unknown as RecordingWithFolder[])
    .filter(recording => {
      const matchesSearch = recording.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFolder = selectedFolder ? recording.folder_id === selectedFolder : true;
      const matchesStatus = statusFilter === 'all' || recording.status === statusFilter;
      return matchesSearch && matchesFolder && matchesStatus;
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
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Calculate statistics
  const stats = {
    total: recordings.length,
    today: recordings.filter(r => {
      const today = new Date();
      const recordingDate = new Date(r.created_at || "");
      return recordingDate.toDateString() === today.toDateString();
    }).length,
    thisWeek: recordings.filter(r => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const recordingDate = new Date(r.created_at || "");
      return recordingDate > oneWeekAgo;
    }).length,
    totalSize: recordings.reduce((acc, r) => acc + (r.file_size || 0), 0),
    processing: recordings.filter(r => r.status === 'processing').length,
    ready: recordings.filter(r => r.status === 'ready').length,
    failed: recordings.filter(r => r.status === 'failed').length
  };

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
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Handle play recording
  const handlePlayRecording = async (id: string) => {
    await incrementViewCount(id);
    navigate(`/dashboard#recordings/player?id=${id}`);
  };

  // Handle toggle favorite
  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    await toggleFavorite(id, isFavorite);
  };

  // Toggle recording selection
  const toggleRecordingSelection = (id: string) => {
    setSelectedRecordings(prev =>
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="py-12">
        <CardContent className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
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
          {bulkActionMode && selectedRecordings.length > 0 ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Folder className="w-4 h-4 mr-2" />
                    Move to Folder
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleBulkMoveToFolder(null)}>
                    No Folder
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {folders.map(folder => (
                    <DropdownMenuItem key={folder.id} onClick={() => handleBulkMoveToFolder(folder.id)}>
                      {folder.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete ({selectedRecordings.length})
              </Button>
              <Button variant="outline" onClick={() => {
                setBulkActionMode(false);
                setSelectedRecordings([]);
              }}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setBulkActionMode(!bulkActionMode)}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Select Multiple
              </Button>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload Recording
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recordings</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="flex gap-2 mt-1">
              <Badge variant="default" className="text-xs">
                {stats.ready} ready
              </Badge>
              {stats.processing > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {stats.processing} processing
                </Badge>
              )}
              {stats.failed > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {stats.failed} failed
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisWeek}</div>
            <p className="text-xs text-muted-foreground">
              {stats.today} added today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</div>
            <p className="text-xs text-muted-foreground">
              Across {stats.total} recordings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Folders</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{folders.length}</div>
            <p className="text-xs text-muted-foreground">
              Organized collections
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Folders */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedFolder === null ? "default" : "outline"}
          className="flex items-center gap-2 whitespace-nowrap"
          onClick={() => setSelectedFolder(null)}
        >
          <Folder className="h-4 w-4" />
          All Recordings
          <Badge variant="secondary" className="ml-1">
            {recordings.length}
          </Badge>
        </Button>
        {folders.map(folder => {
          const count = (recordings as unknown as RecordingWithFolder[]).filter(r => r.folder_id === folder.id).length;
          return (
            <div key={folder.id} className="flex items-center gap-1">
              <Button
                variant={selectedFolder === folder.id ? "default" : "outline"}
                className="flex items-center gap-2 whitespace-nowrap"
                onClick={() => setSelectedFolder(folder.id)}
              >
                <Folder className="h-4 w-4" />
                {folder.name}
                <Badge variant="secondary" className="ml-1">
                  {count}
                </Badge>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDeleteFolder(folder.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
        <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>
                Organize your recordings into folders
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateFolder}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search recordings..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
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
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Show Favorites Only</DropdownMenuItem>
                  <DropdownMenuItem>Show Untagged</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recordings Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecordings.map((recording) => (
            <Card 
              key={recording.id} 
              className={`overflow-hidden transition-all ${
                selectedRecordings.includes(recording.id) ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="relative">
                <div 
                  className="bg-muted aspect-video flex items-center justify-center cursor-pointer"
                  onClick={() => bulkActionMode ? toggleRecordingSelection(recording.id) : handlePlayRecording(recording.id)}
                >
                  {recording.thumbnail_url ? (
                    <img src={recording.thumbnail_url} alt={recording.title} className="w-full h-full object-cover" />
                  ) : (
                    <Video className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  {bulkActionMode ? (
                    <Button 
                      variant={selectedRecordings.includes(recording.id) ? "default" : "secondary"}
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => toggleRecordingSelection(recording.id)}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(recording.id, recording.is_favorite || false);
                      }}
                    >
                      <Star 
                        className={`h-4 w-4 ${recording.is_favorite ? "fill-yellow-500 text-yellow-500" : ""}`} 
                      />
                    </Button>
                  )}
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
                  <Button 
                    size="sm" 
                    className="flex-1" 
                    onClick={() => handlePlayRecording(recording.id)}
                    disabled={bulkActionMode}
                  >
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
                      <DropdownMenuSeparator />
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-muted w-full">
                          <Folder className="h-4 w-4 mr-2" />
                          Move to Folder
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleMoveToFolder(recording.id, null)}>
                            No Folder
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {folders.map(folder => (
                            <DropdownMenuItem 
                              key={folder.id}
                              onClick={() => handleMoveToFolder(recording.id, folder.id)}
                            >
                              {folder.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
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
                    className={`p-4 flex items-center justify-between hover:bg-muted/50 cursor-pointer transition-colors ${
                      selectedRecordings.includes(recording.id) ? 'bg-muted' : ''
                    }`}
                    onClick={() => bulkActionMode ? toggleRecordingSelection(recording.id) : handlePlayRecording(recording.id)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {bulkActionMode && (
                        <input
                          type="checkbox"
                          checked={selectedRecordings.includes(recording.id)}
                          onChange={() => toggleRecordingSelection(recording.id)}
                          className="h-4 w-4"
                        />
                      )}
                      <div className="relative">
                        <div className="bg-muted h-16 w-24 flex items-center justify-center rounded">
                          {recording.thumbnail_url ? (
                            <img src={recording.thumbnail_url} alt={recording.title} className="w-full h-full object-cover rounded" />
                          ) : (
                            <Video className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                          {formatDuration(recording.duration)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
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
                              Transcript
                            </Badge>
                          )}
                          {recording.tags && recording.tags.length > 0 && (
                            recording.tags.slice(0, 2).map((tag: string) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-right text-sm mr-4">
                        <div>{recording.views_count || 0} views</div>
                      </div>
                      {!bulkActionMode && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handlePlayRecording(recording.id); 
                            }}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Play
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
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
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )}
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
            <Video className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="mt-4 font-medium">No recordings found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedFolder || statusFilter !== 'all'
                ? "Try adjusting your search or filter to find what you're looking for."
                : "Upload your first recording to get started."}
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