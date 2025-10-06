import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  FolderOpen, 
  Users, 
  Settings,
  Download,
  Share2,
  FileSpreadsheet,
  FileBarChart,
  FileCode,
  CheckCircle,
  Sparkles,
  Loader2,
  Eye,
  Copy,
  Send
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DocumentSettings {
  enabled: boolean;
  autoGenerate: boolean;
  shareWithParticipants: boolean;
  saveToCloud: boolean;
  defaultFormat: string;
  aiModel: string;
  includeSummary: boolean;
  extractActionItems: boolean;
  extractDecisions: boolean;
}

interface DocumentTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  template: string;
  aiPrompt: string;
}

interface GeneratedDocument {
  id: string;
  type: string;
  title: string;
  content: string;
  format: string;
  generatedAt: Date;
  meetingId: string;
}

interface MeetingData {
  id: string;
  title: string;
  date: Date;
  participants: string[];
  transcript: string;
  duration: number;
}

const SmartDocumentGenerator = () => {
  const [settings, setSettings] = useState<DocumentSettings>({
    enabled: true,
    autoGenerate: true,
    shareWithParticipants: true,
    saveToCloud: true,
    defaultFormat: "pdf",
    aiModel: "gpt-4",
    includeSummary: true,
    extractActionItems: true,
    extractDecisions: true
  });

  const [templates, setTemplates] = useState<DocumentTemplate[]>([
    {
      id: "1",
      name: "Meeting Minutes",
      type: "minutes",
      description: "Comprehensive meeting minutes with AI summaries",
      template: "# {{meeting_title}} - Meeting Minutes\n\nDate: {{date}}\nDuration: {{duration}}\n\n## Attendees\n{{attendees}}\n\n## Executive Summary\n{{ai_summary}}\n\n## Key Discussion Points\n{{discussion_points}}\n\n## Decisions Made\n{{decisions}}\n\n## Action Items\n{{action_items}}\n\n## Next Steps\n{{next_steps}}",
      aiPrompt: "Analyze the meeting transcript and create comprehensive meeting minutes. Extract key discussion points, decisions made, and action items. Provide an executive summary."
    },
    {
      id: "2",
      name: "Action Items Report",
      type: "action_items",
      description: "Detailed action items with owners and deadlines",
      template: "# Action Items - {{meeting_title}}\n\nGenerated: {{date}}\n\n## Overview\n{{overview}}\n\n## Action Items\n{{action_items_detailed}}\n\n## Priority Matrix\n{{priority_matrix}}",
      aiPrompt: "Extract all action items from the meeting transcript. For each item, identify the owner, deadline (if mentioned), priority level, and dependencies."
    },
    {
      id: "3",
      name: "PRD (Product Requirements)",
      type: "prd",
      description: "Product requirements document from product discussions",
      template: "# Product Requirements Document\n\n## Product Overview\n{{product_overview}}\n\n## User Stories\n{{user_stories}}\n\n## Requirements\n{{requirements}}\n\n## Success Metrics\n{{success_metrics}}\n\n## Timeline\n{{timeline}}",
      aiPrompt: "Based on the product discussions in the meeting, create a structured PRD. Extract user stories, functional and non-functional requirements, success metrics, and proposed timeline."
    },
    {
      id: "4",
      name: "Technical Specification",
      type: "spec",
      description: "Technical specification from engineering discussions",
      template: "# Technical Specification\n\n## Overview\n{{overview}}\n\n## Architecture\n{{architecture}}\n\n## Technical Requirements\n{{tech_requirements}}\n\n## Implementation Plan\n{{implementation}}\n\n## Risks & Mitigation\n{{risks}}",
      aiPrompt: "Extract technical details from the meeting and create a technical specification. Include architecture decisions, technical requirements, implementation approach, and identified risks."
    }
  ]);

  const [newTemplate, setNewTemplate] = useState<Omit<DocumentTemplate, "id">>({
    name: "",
    type: "",
    description: "",
    template: "",
    aiPrompt: ""
  });

  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<string>("");
  const [selectedDocType, setSelectedDocType] = useState<string>("");
  const [previewDocument, setPreviewDocument] = useState<GeneratedDocument | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Mock meeting data - in production, fetch from your database
  const [meetings] = useState<MeetingData[]>([
    {
      id: "1",
      title: "Product Planning Q1 2025",
      date: new Date("2025-01-15"),
      participants: ["John Doe", "Jane Smith", "Bob Johnson"],
      transcript: "We discussed the Q1 roadmap focusing on user authentication improvements. Jane proposed implementing OAuth 2.0 and SSO. Bob raised concerns about migration timeline. Decision: Proceed with OAuth implementation with 6-week timeline. Action: Jane to create technical spec by Jan 22. John to coordinate with design team.",
      duration: 45
    },
    {
      id: "2",
      title: "Engineering Sync",
      date: new Date("2025-01-20"),
      participants: ["Alice Chen", "Mike Wilson", "Sarah Lee"],
      transcript: "Reviewed current sprint progress. Backend API is 80% complete. Frontend integration needs more time. Mike identified performance bottleneck in database queries. Decision: Extend sprint by 3 days. Action: Mike to optimize queries by EOW. Sarah to update project timeline.",
      duration: 30
    }
  ]);

  // AI Document Generation Function
  const generateDocumentWithAI = async (
    meetingData: MeetingData,
    template: DocumentTemplate
  ): Promise<string> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In production, this would call your AI API (OpenAI, Claude, etc.)
    // For now, we'll use intelligent text processing and template filling
    
    const { transcript, title, date, participants, duration } = meetingData;
    
    // Extract action items
    const actionItems = extractActionItems(transcript);
    const decisions = extractDecisions(transcript);
    const discussionPoints = extractDiscussionPoints(transcript);
    const summary = generateSummary(transcript);
    
    // Fill template variables
    let content = template.template
      .replace(/{{meeting_title}}/g, title)
      .replace(/{{date}}/g, date.toLocaleDateString())
      .replace(/{{duration}}/g, `${duration} minutes`)
      .replace(/{{attendees}}/g, participants.map(p => `- ${p}`).join('\n'))
      .replace(/{{ai_summary}}/g, summary)
      .replace(/{{discussion_points}}/g, discussionPoints.map((p, i) => `${i + 1}. ${p}`).join('\n'))
      .replace(/{{decisions}}/g, decisions.map((d, i) => `${i + 1}. ${d}`).join('\n'))
      .replace(/{{action_items}}/g, actionItems.map((a, i) => `${i + 1}. ${a}`).join('\n'))
      .replace(/{{action_items_detailed}}/g, actionItems.map((a, i) => 
        `### Action Item ${i + 1}\n- **Task**: ${a}\n- **Status**: Pending\n- **Priority**: Medium\n`
      ).join('\n'))
      .replace(/{{next_steps}}/g, generateNextSteps(actionItems))
      .replace(/{{overview}}/g, summary)
      .replace(/{{priority_matrix}}/g, generatePriorityMatrix(actionItems));

    // Template-specific AI generation
    if (template.type === 'prd') {
      content = content
        .replace(/{{product_overview}}/g, generateProductOverview(transcript))
        .replace(/{{user_stories}}/g, extractUserStories(transcript))
        .replace(/{{requirements}}/g, extractRequirements(transcript))
        .replace(/{{success_metrics}}/g, 'To be defined based on product goals')
        .replace(/{{timeline}}/g, extractTimeline(transcript));
    } else if (template.type === 'spec') {
      content = content
        .replace(/{{overview}}/g, summary)
        .replace(/{{architecture}}/g, extractArchitecture(transcript))
        .replace(/{{tech_requirements}}/g, extractTechRequirements(transcript))
        .replace(/{{implementation}}/g, extractImplementation(transcript))
        .replace(/{{risks}}/g, extractRisks(transcript));
    }

    return content;
  };

  // Helper functions for AI extraction
  const extractActionItems = (transcript: string): string[] => {
    const items: string[] = [];
    const lines = transcript.split('.');
    
    lines.forEach(line => {
      if (line.toLowerCase().includes('action:') || 
          line.toLowerCase().includes('to do:') ||
          line.toLowerCase().includes('will create') ||
          line.toLowerCase().includes('needs to') ||
          line.toLowerCase().includes('to coordinate')) {
        items.push(line.trim());
      }
    });
    
    return items.length > 0 ? items : ['No specific action items identified'];
  };

  const extractDecisions = (transcript: string): string[] => {
    const decisions: string[] = [];
    const lines = transcript.split('.');
    
    lines.forEach(line => {
      if (line.toLowerCase().includes('decision:') || 
          line.toLowerCase().includes('agreed to') ||
          line.toLowerCase().includes('proceed with') ||
          line.toLowerCase().includes('decided')) {
        decisions.push(line.trim());
      }
    });
    
    return decisions.length > 0 ? decisions : ['No formal decisions recorded'];
  };

  const extractDiscussionPoints = (transcript: string): string[] => {
    const sentences = transcript.split('.').filter(s => s.trim().length > 20);
    return sentences.slice(0, 5).map(s => s.trim());
  };

  const generateSummary = (transcript: string): string => {
    const sentences = transcript.split('.').filter(s => s.trim().length > 0);
    const firstSentences = sentences.slice(0, 3).join('. ') + '.';
    return firstSentences || 'Meeting summary not available.';
  };

  const generateNextSteps = (actionItems: string[]): string => {
    if (actionItems.length === 0 || actionItems[0] === 'No specific action items identified') {
      return 'Team to reconvene and define concrete next steps.';
    }
    return 'Team to execute on identified action items and report progress in next meeting.';
  };

  const generatePriorityMatrix = (actionItems: string[]): string => {
    return `| Priority | Count |\n|----------|-------|\n| High | ${Math.ceil(actionItems.length * 0.3)} |\n| Medium | ${Math.floor(actionItems.length * 0.5)} |\n| Low | ${Math.floor(actionItems.length * 0.2)} |`;
  };

  const generateProductOverview = (transcript: string): string => {
    return 'Based on the meeting discussion, this product aims to address key user needs identified by the team.';
  };

  const extractUserStories = (transcript: string): string => {
    return '- As a user, I want to [feature] so that [benefit]\n- As a user, I need to [capability] to achieve [goal]';
  };

  const extractRequirements = (transcript: string): string => {
    return '### Functional Requirements\n- Requirement 1\n- Requirement 2\n\n### Non-Functional Requirements\n- Performance\n- Security\n- Scalability';
  };

  const extractTimeline = (transcript: string): string => {
    const timelineMatch = transcript.match(/(\d+)\s*(week|day|month)/i);
    if (timelineMatch) {
      return `Proposed timeline: ${timelineMatch[0]}`;
    }
    return 'Timeline to be determined';
  };

  const extractArchitecture = (transcript: string): string => {
    return 'Architecture decisions and technical approach discussed in the meeting.';
  };

  const extractTechRequirements = (transcript: string): string => {
    return '- Technical requirement 1\n- Technical requirement 2\n- Technical requirement 3';
  };

  const extractImplementation = (transcript: string): string => {
    return 'Implementation approach based on team discussion and technical constraints.';
  };

  const extractRisks = (transcript: string): string => {
    const risks = transcript.toLowerCase().includes('concern') || 
                  transcript.toLowerCase().includes('risk') ||
                  transcript.toLowerCase().includes('issue');
    
    if (risks) {
      return '- Identified risks from team discussion\n- Mitigation strategies to be developed';
    }
    return 'No major risks identified during discussion';
  };

  // Generate document handler
  const handleGenerateDocument = async () => {
    if (!selectedMeeting || !selectedDocType) {
      alert('Please select a meeting and document type');
      return;
    }

    setIsGenerating(true);

    try {
      const meeting = meetings.find(m => m.id === selectedMeeting);
      const template = templates.find(t => t.type === selectedDocType);

      if (!meeting || !template) {
        throw new Error('Meeting or template not found');
      }

      const content = await generateDocumentWithAI(meeting, template);

      const newDoc: GeneratedDocument = {
        id: Date.now().toString(),
        type: template.type,
        title: `${template.name} - ${meeting.title}`,
        content,
        format: settings.defaultFormat,
        generatedAt: new Date(),
        meetingId: meeting.id
      };

      setGeneratedDocuments([newDoc, ...generatedDocuments]);
      setPreviewDocument(newDoc);
      setShowPreview(true);

      // Auto-share if enabled
      if (settings.shareWithParticipants) {
        await shareDocument(newDoc, meeting.participants);
      }

      // Auto-save if enabled
      if (settings.saveToCloud) {
        await saveToCloud(newDoc);
      }

    } catch (error) {
      console.error('Error generating document:', error);
      alert('Failed to generate document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const shareDocument = async (doc: GeneratedDocument, participants: string[]) => {
    // Simulate sharing
    console.log(`Sharing document ${doc.id} with:`, participants);
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const saveToCloud = async (doc: GeneratedDocument) => {
    // Simulate cloud save
    console.log(`Saving document ${doc.id} to cloud`);
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const downloadDocument = (doc: GeneratedDocument) => {
    const blob = new Blob([doc.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    alert('Copied to clipboard!');
  };

  const handleToggleChange = (field: keyof DocumentSettings, checked: boolean) => {
    setSettings({ ...settings, [field]: checked });
  };

  const handleAddTemplate = () => {
    if (!newTemplate.name || !newTemplate.type || !newTemplate.template) {
      alert('Please fill in all required fields');
      return;
    }

    const template: DocumentTemplate = {
      ...newTemplate,
      id: Date.now().toString()
    };

    setTemplates([...templates, template]);
    setNewTemplate({
      name: "",
      type: "",
      description: "",
      template: "",
      aiPrompt: ""
    });
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
  };

  const documentTypes = [
    { id: "prd", name: "PRD", icon: FileText, description: "Product Requirements Document" },
    { id: "spec", name: "Tech Spec", icon: FileCode, description: "Technical Specification" },
    { id: "minutes", name: "Minutes", icon: FileText, description: "Meeting Minutes" },
    { id: "action_items", name: "Action Items", icon: CheckCircle, description: "Action Items Report" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI-Powered Document Generator
          </CardTitle>
          <CardDescription>
            Automatically generate intelligent documents from meeting discussions using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Generate Section */}
          <div className="p-4 border-2 border-dashed rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate Document
            </h3>
            <div className="space-y-3">
              <div>
                <Label>Select Meeting</Label>
                <Select value={selectedMeeting} onValueChange={setSelectedMeeting}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a meeting" />
                  </SelectTrigger>
                  <SelectContent>
                    {meetings.map(meeting => (
                      <SelectItem key={meeting.id} value={meeting.id}>
                        {meeting.title} - {meeting.date.toLocaleDateString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Document Type</Label>
                <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.type}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerateDocument} 
                disabled={isGenerating || !selectedMeeting || !selectedDocType}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Document
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold">Generator Settings</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Auto-Generate After Meetings</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically create documents when meetings end
                </p>
              </div>
              <Switch
                checked={settings.autoGenerate}
                onCheckedChange={(checked) => handleToggleChange("autoGenerate", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Share with Participants</h4>
                <p className="text-sm text-muted-foreground">
                  Send generated documents to meeting attendees
                </p>
              </div>
              <Switch
                checked={settings.shareWithParticipants}
                onCheckedChange={(checked) => handleToggleChange("shareWithParticipants", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Save to Cloud Storage</h4>
                <p className="text-sm text-muted-foreground">
                  Store documents in your cloud storage
                </p>
              </div>
              <Switch
                checked={settings.saveToCloud}
                onCheckedChange={(checked) => handleToggleChange("saveToCloud", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Extract Action Items</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically identify and list action items
                </p>
              </div>
              <Switch
                checked={settings.extractActionItems}
                onCheckedChange={(checked) => handleToggleChange("extractActionItems", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Extract Decisions</h4>
                <p className="text-sm text-muted-foreground">
                  Identify key decisions made during meetings
                </p>
              </div>
              <Switch
                checked={settings.extractDecisions}
                onCheckedChange={(checked) => handleToggleChange("extractDecisions", checked)}
              />
            </div>
          </div>

          {/* AI Model Selection */}
          <div className="space-y-2">
            <Label>AI Model</Label>
            <Select value={settings.aiModel} onValueChange={(value) => setSettings({...settings, aiModel: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4 (Best Quality)</SelectItem>
                <SelectItem value="gpt-3.5">GPT-3.5 (Faster)</SelectItem>
                <SelectItem value="claude">Claude (Analytical)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Output Format */}
          <div className="space-y-2">
            <Label>Default Output Format</Label>
            <div className="grid grid-cols-4 gap-2">
              {["pdf", "docx", "md", "txt"].map((format) => (
                <Button
                  key={format}
                  variant={settings.defaultFormat === format ? "default" : "outline"}
                  onClick={() => setSettings({...settings, defaultFormat: format})}
                  size="sm"
                >
                  {format.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Documents */}
      {generatedDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Documents</CardTitle>
            <CardDescription>Recently generated documents from your meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedDocuments.map((doc) => (
                <div key={doc.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{doc.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Generated {doc.generatedAt.toLocaleString()} • {doc.format.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPreviewDocument(doc);
                          setShowPreview(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadDocument(doc)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(doc.content)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Document Templates</CardTitle>
          <CardDescription>Customize AI prompts and templates for your documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {documentTypes.map((type) => {
              const Icon = type.icon;
              const template = templates.find(t => t.type === type.id);
              return (
                <div key={type.id} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4" />
                    <h4 className="font-medium">{type.name}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{type.description}</p>
                  {template && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="w-full">
                          View Template
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{template.name}</DialogTitle>
                          <DialogDescription>{template.description}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>AI Prompt</Label>
                            <Textarea
                              value={template.aiPrompt}
                              readOnly
                              rows={3}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Template Structure</Label>
                            <Textarea
                              value={template.template}
                              readOnly
                              rows={8}
                              className="mt-1 font-mono text-xs"
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add New Template */}
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium mb-3">Create Custom Template</h4>
            <div className="space-y-3">
              <Input
                placeholder="Template name (e.g., Sprint Review)"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
              />
              <Input
                placeholder="Document type (e.g., review)"
                value={newTemplate.type}
                onChange={(e) => setNewTemplate({...newTemplate, type: e.target.value})}
              />
              <Textarea
                placeholder="Description"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                rows={2}
              />
              <Textarea
                placeholder="AI Prompt: Describe what the AI should extract and generate"
                value={newTemplate.aiPrompt}
                onChange={(e) => setNewTemplate({...newTemplate, aiPrompt: e.target.value})}
                rows={3}
              />
              <Textarea
                placeholder="Template structure (use {{variables}} for dynamic content)"
                value={newTemplate.template}
                onChange={(e) => setNewTemplate({...newTemplate, template: e.target.value})}
                rows={5}
                className="font-mono text-sm"
              />
              <Button onClick={handleAddTemplate} className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Add Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewDocument?.title}</DialogTitle>
            <DialogDescription>
              Generated {previewDocument?.generatedAt.toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={() => previewDocument && downloadDocument(previewDocument)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={() => previewDocument && copyToClipboard(previewDocument.content)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline">
                <Send className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            <div className="p-4 border rounded-lg bg-gray-50 max-h-[60vh] overflow-y-auto">
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {previewDocument?.content}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SmartDocumentGenerator;