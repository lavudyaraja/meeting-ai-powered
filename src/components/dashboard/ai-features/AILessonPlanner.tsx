import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Loader2, 
  ChevronRight,
  FileText,
  BookMarked,
  Lightbulb,
  Brain,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LessonPlan {
  id: string;
  title: string;
  topic: string;
  content: string;
  toc: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

const AILessonPlanner = () => {
  const [topic, setTopic] = useState("");
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
  const [generatedContent, setGeneratedContent] = useState("");
  const [tableOfContents, setTableOfContents] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingTOC, setIsGeneratingTOC] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchLessonPlans();
  }, []);

  const fetchLessonPlans = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      
      // Try to fetch from lesson_plans table, but handle if it doesn't exist
      try {
        // @ts-ignore: TypeScript not recognizing lesson_plans table
        const { data, error } = await supabase
          .from("lesson_plans")
          .select("*")
          .eq("created_by", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          // If table doesn't exist, show a user-friendly message
          if (error.message.includes("relation") && error.message.includes("does not exist")) {
            console.log("Lesson plans table not found, initializing with empty array");
            setLessonPlans([]);
            return;
          }
          throw error;
        }
        // @ts-ignore: TypeScript type mismatch
        setLessonPlans(data || []);
      } catch (tableError: any) {
        // Handle case where table doesn't exist yet
        if (tableError.message && (tableError.message.includes("not found") || tableError.message.includes("relation"))) {
          console.log("Lesson plans table not available yet");
          setLessonPlans([]);
        } else {
          throw tableError;
        }
      }
    } catch (error: any) {
      console.error("Error fetching lesson plans:", error);
      toast({
        title: "Notice",
        description: "Lesson plans feature is being set up. Please try again later.",
        variant: "default",
      });
      setLessonPlans([]);
    }
  };

  const generateTableOfContents = async () => {
    if (!topic.trim()) {
      toast({
        title: "Please enter a topic",
        description: "You need to specify a topic to generate a lesson plan",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingTOC(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [
            {
              role: "user",
              content: `Create a detailed table of contents for teaching "${topic}". Provide 5-8 main sections with brief descriptions. Format as a simple list with section titles only, one per line.`
            }
          ]
        }
      });

      if (error) throw error;

      const toc = data.message.split('\n').filter((line: string) => line.trim() !== '');
      setTableOfContents(toc.slice(0, 8));
      
      // Reset expanded sections
      const initialExpanded: Record<string, boolean> = {};
      toc.slice(0, 8).forEach((section, index) => {
        initialExpanded[index.toString()] = index === 0; // Expand first section by default
      });
      setExpandedSections(initialExpanded);
      setActiveSection("0");

      toast({
        title: "Success",
        description: "Table of contents generated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate table of contents",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingTOC(false);
    }
  };

  const toggleSection = (index: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
    setActiveSection(index);
  };

  const generateLessonContent = async (section: string) => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [
            {
              role: "user",
              content: `Create detailed educational content for the section "${section}" about "${topic}". Include key concepts, explanations, examples, and learning objectives. Format the content clearly with headings and bullet points where appropriate.`
            }
          ]
        }
      });

      if (error) throw error;

      const newPlan: any = {
        id: Date.now().toString(),
        title: `${topic} - ${section}`,
        topic,
        content: data.message,
        toc: tableOfContents,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setSelectedPlan(newPlan as LessonPlan);
      setGeneratedContent(data.message);

      toast({
        title: "Success",
        description: "Lesson content generated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate lesson content",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveLessonPlan = async () => {
    if (!selectedPlan) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Try to save to lesson_plans table
      try {
        // @ts-ignore: TypeScript not recognizing lesson_plans table
        const { data, error } = await supabase
          .from("lesson_plans")
          .insert([{
            title: selectedPlan.title,
            topic: selectedPlan.topic,
            content: selectedPlan.content,
            toc: selectedPlan.toc,
            created_by: user.id
          }])
          .select();

        if (error) throw error;

        if (data) {
          // @ts-ignore: TypeScript type mismatch
          setLessonPlans([data[0], ...lessonPlans]);
          toast({
            title: "Success",
            description: "Lesson plan saved successfully",
          });
        }
      } catch (saveError: any) {
        // Handle case where table doesn't exist yet
        console.log("Could not save to lesson_plans table:", saveError.message);
        toast({
          title: "Notice",
          description: "Lesson plans feature is being set up. Save functionality will be available soon.",
          variant: "default",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save lesson plan",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    const contentToCopy = generatedContent || (selectedPlan?.content || "");
    if (contentToCopy) {
      navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied",
        description: "Lesson content copied to clipboard",
      });
    }
  };

  const downloadContent = () => {
    const planToDownload = selectedPlan;
    if (!planToDownload) return;

    const element = document.createElement("a");
    const file = new Blob([`${planToDownload.title}\n\n${planToDownload.content}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${planToDownload.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredPlans = lessonPlans.filter(plan => 
    plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            AI Lesson Planner
          </h2>
          <p className="text-muted-foreground">
            Generate educational content with AI assistance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow overflow-hidden">
        {/* Left Panel - Topic Input and TOC */}
        <div className="lg:col-span-1 space-y-6 flex flex-col overflow-hidden">
          {/* Topic Input */}
          <Card className="glass-effect p-6 flex-shrink-0">
            <div className="space-y-4">
              <div>
                <Label htmlFor="topic" className="text-primary font-medium flex items-center gap-2">
                  <BookMarked className="w-4 h-4" />
                  Learning Topic
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic to teach..."
                    className="bg-transparent border-primary/30 focus:border-primary flex-1"
                  />
                  <Button
                    onClick={generateTableOfContents}
                    disabled={isGeneratingTOC || !topic.trim()}
                    className="flex items-center gap-2"
                  >
                    {isGeneratingTOC ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Generate
                  </Button>
                </div>
              </div>

              {tableOfContents.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4" />
                    Suggested Table of Contents
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {tableOfContents.map((section, index) => (
                      <div key={index} className="border border-border rounded-lg">
                        <Button
                          variant="ghost"
                          className="w-full justify-between group p-4"
                          onClick={() => toggleSection(index.toString())}
                        >
                          <span className="text-left font-medium">{section}</span>
                          {expandedSections[index.toString()] ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                        {expandedSections[index.toString()] && (
                          <div className="px-4 pb-4">
                            <Button
                              variant="default"
                              size="sm"
                              className="w-full"
                              onClick={() => generateLessonContent(section)}
                              disabled={isGenerating}
                            >
                              {isGenerating && activeSection === index.toString() ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                  Generating...
                                </>
                              ) : (
                                "Generate Content"
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Saved Lesson Plans */}
          <Card className="glass-effect p-6 flex-grow flex flex-col overflow-hidden">
            <div className="space-y-4 flex-grow flex flex-col overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Saved Lesson Plans
                </h3>
                <span className="text-sm text-muted-foreground">
                  {lessonPlans.length} plans
                </span>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search lesson plans..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2 overflow-y-auto flex-grow">
                {filteredPlans.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {searchQuery ? "No matching lesson plans" : "No saved lesson plans"}
                  </p>
                ) : (
                  filteredPlans.map((plan) => (
                    <Button
                      key={plan.id}
                      variant="ghost"
                      className="w-full justify-start h-auto py-3 px-4 text-left"
                      onClick={() => setSelectedPlan(plan)}
                    >
                      <div>
                        <p className="font-medium text-sm">{plan.title}</p>
                        <p className="text-xs text-muted-foreground">{plan.topic}</p>
                      </div>
                    </Button>
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel - Content Display */}
        <div className="lg:col-span-2 flex flex-col overflow-hidden">
          <Card className="glass-effect p-6 flex-grow flex flex-col overflow-hidden">
            <div className="flex-grow flex flex-col overflow-hidden">
              {selectedPlan ? (
                <div className="space-y-4 flex-grow flex flex-col overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold">{selectedPlan.title}</h3>
                      <p className="text-muted-foreground">{selectedPlan.topic}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadContent}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={saveLessonPlan}
                        disabled={lessonPlans.some(plan => plan.id === selectedPlan.id)}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        {lessonPlans.some(plan => plan.id === selectedPlan.id) ? "Saved" : "Save"}
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-4 flex-grow overflow-y-auto">
                    <div className="prose prose-invert max-w-none h-full">
                      {selectedPlan.content.split('\n').map((paragraph, index) => {
                        if (paragraph.startsWith('# ')) {
                          return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{paragraph.substring(2)}</h1>;
                        } else if (paragraph.startsWith('## ')) {
                          return <h2 key={index} className="text-xl font-semibold mt-5 mb-3">{paragraph.substring(3)}</h2>;
                        } else if (paragraph.startsWith('### ')) {
                          return <h3 key={index} className="text-lg font-medium mt-4 mb-2">{paragraph.substring(4)}</h3>;
                        } else if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                          return <li key={index} className="ml-6">{paragraph.substring(2)}</li>;
                        } else {
                          return <p key={index} className="mb-3">{paragraph}</p>;
                        }
                      })}
                    </div>
                  </div>
                </div>
              ) : generatedContent ? (
                <div className="space-y-4 flex-grow flex flex-col overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">Generated Content</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={saveLessonPlan}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Save Plan
                      </Button>
                    </div>
                  </div>
                  <div className="border-t pt-4 flex-grow overflow-y-auto">
                    <div className="prose prose-invert max-w-none whitespace-pre-wrap h-full">
                      {generatedContent}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center flex-grow">
                  <Lightbulb className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">AI Lesson Planner</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Enter a topic above to generate a table of contents, then select a section to create detailed educational content with AI assistance.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div className="flex flex-col items-center">
                      <Brain className="w-8 h-8 mb-2" />
                      <span>AI-Powered</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <FileText className="w-8 h-8 mb-2" />
                      <span>Structured Content</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <BookMarked className="w-8 h-8 mb-2" />
                      <span>Save & Reuse</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AILessonPlanner;