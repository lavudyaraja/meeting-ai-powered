import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sparkles,
  BookOpen,
  Pen,
  Calendar,
  CheckCircle,
  FileText,
  Zap,
  Brain,
  Settings,
  Play,
  Pause,
  RotateCcw,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import { AILessonPlanner } from "@/components/dashboard/ai-features";
import { AIWhiteboard } from "@/components/dashboard/ai-features";

const AIFeatures = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"lesson-planner" | "whiteboard">("lesson-planner");

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">AI Features</h1>
            <p className="text-sm text-muted-foreground">Powerful AI tools to enhance your productivity</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            <Button
              variant={activeTab === "lesson-planner" ? "default" : "outline"}
              onClick={() => setActiveTab("lesson-planner")}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Lesson Planner
            </Button>
            <Button
              variant={activeTab === "whiteboard" ? "default" : "outline"}
              onClick={() => setActiveTab("whiteboard")}
              className="flex items-center gap-2"
            >
              <Pen className="h-4 w-4" />
              AI Whiteboard
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {activeTab === "lesson-planner" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  AI Lesson Planner
                </CardTitle>
                <CardDescription>
                  Generate educational content with AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AILessonPlanner />
              </CardContent>
            </Card>
          )}

          {activeTab === "whiteboard" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pen className="h-5 w-5" />
                  AI Whiteboard
                </CardTitle>
                <CardDescription>
                  Collaborative whiteboard with AI-powered features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIWhiteboard />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIFeatures;