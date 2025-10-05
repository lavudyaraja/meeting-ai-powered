import { useState } from "react";
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
  FileQuestion,
  CheckCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface DocumentSettings {
  enabled: boolean;
  autoGenerate: boolean;
  shareWithParticipants: boolean;
  saveToCloud: boolean;
  defaultFormat: string;
  sharingRules: SharingRule[];
}

interface SharingRule {
  id: string;
  documentType: string;
  shareWith: "all" | "participants" | "owners" | "custom";
  customRecipients: string[];
  folderPath: string;
}

interface DocumentTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  template: string;
}

const SmartDocumentGenerator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<DocumentSettings>({
    enabled: false,
    autoGenerate: true,
    shareWithParticipants: true,
    saveToCloud: true,
    defaultFormat: "pdf",
    sharingRules: [
      {
        id: "1",
        documentType: "meeting_minutes",
        shareWith: "participants",
        customRecipients: [],
        folderPath: "/meetings/minutes"
      },
      {
        id: "2",
        documentType: "action_items",
        shareWith: "participants",
        customRecipients: [],
        folderPath: "/meetings/action-items"
      }
    ]
  });
  const [templates, setTemplates] = useState<DocumentTemplate[]>([
    {
      id: "1",
      name: "Meeting Minutes",
      type: "minutes",
      description: "Standard meeting minutes template",
      template: "# {{meeting_title}} - Meeting Minutes\n\nDate: {{date}}\n\n## Attendees\n{{attendees}}\n\n## Agenda Items\n{{agenda}}\n\n## Decisions Made\n{{decisions}}\n\n## Action Items\n{{action_items}}"
    },
    {
      id: "2",
      name: "Action Items Summary",
      type: "action_items",
      description: "Summary of action items with owners and deadlines",
      template: "# Action Items - {{meeting_title}}\n\n{{action_items_detailed}}"
    }
  ]);
  const [newTemplate, setNewTemplate] = useState<Omit<DocumentTemplate, "id">>({
    name: "",
    type: "",
    description: "",
    template: ""
  });

  const handleToggleChange = (field: keyof DocumentSettings, checked: boolean) => {
    const newSettings = { ...settings, [field]: checked };
    setSettings(newSettings);
    // In a real implementation, we would save to database here
  };

  const handleAddTemplate = () => {
    if (!newTemplate.name || !newTemplate.type || !newTemplate.template) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
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
      template: ""
    });

    toast({
      title: "Success",
      description: "Document template added successfully"
    });
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
    toast({
      title: "Success",
      description: "Document template deleted"
    });
  };

  const documentTypes = [
    { id: "prd", name: "PRD", icon: FileText, description: "Product Requirements Document" },
    { id: "rfd", name: "RFD", icon: FileSpreadsheet, description: "Request for Discussion" },
    { id: "spec", name: "Spec", icon: FileCode, description: "Technical Specification" },
    { id: "charter", name: "Charter", icon: FileBarChart, description: "Project Charter" },
    { id: "minutes", name: "Minutes", icon: FileText, description: "Meeting Minutes" },
    { id: "action_items", name: "Action Items", icon: CheckCircle, description: "Action Items List" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Smart Document Generator
        </CardTitle>
        <CardDescription>
          Automatically generate documents from meeting discussions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Enable Document Generation</h3>
            <p className="text-sm text-muted-foreground">
              Automatically create documents from meeting content
            </p>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(checked) => handleToggleChange("enabled", checked)}
          />
        </div>

        {settings.enabled && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Auto-Generate Documents</h3>
                <p className="text-sm text-muted-foreground">
                  Create documents immediately after meetings
                </p>
              </div>
              <Switch
                checked={settings.autoGenerate}
                onCheckedChange={(checked) => handleToggleChange("autoGenerate", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Share with Participants</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically send documents to meeting participants
                </p>
              </div>
              <Switch
                checked={settings.shareWithParticipants}
                onCheckedChange={(checked) => handleToggleChange("shareWithParticipants", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Save to Cloud</h3>
                <p className="text-sm text-muted-foreground">
                  Store generated documents in your cloud storage
                </p>
              </div>
              <Switch
                checked={settings.saveToCloud}
                onCheckedChange={(checked) => handleToggleChange("saveToCloud", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label>Default Document Format</Label>
              <div className="grid grid-cols-4 gap-2">
                {["pdf", "docx", "md", "txt"].map((format) => (
                  <Button
                    key={format}
                    variant={settings.defaultFormat === format ? "default" : "outline"}
                    onClick={() => setSettings({...settings, defaultFormat: format})}
                  >
                    {format.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <h3 className="font-medium mb-2">Document Types</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Configure which documents to generate automatically
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {documentTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div key={type.id} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-4 w-4" />
                        <h4 className="font-medium">{type.name}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{type.description}</p>
                      <Button size="sm" variant="outline" className="w-full">
                        Configure
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4">
              <h3 className="font-medium mb-2">Document Templates</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Customize document templates with your company's formatting
              </p>
              
              <div className="space-y-3">
                {templates.map((template) => (
                  <div key={template.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{template.name}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        Delete
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                        {template.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 border rounded-lg">
                <h4 className="font-medium mb-2">Add New Template</h4>
                <div className="space-y-2">
                  <Input
                    placeholder="Template name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  />
                  <Input
                    placeholder="Document type"
                    value={newTemplate.type}
                    onChange={(e) => setNewTemplate({...newTemplate, type: e.target.value})}
                  />
                  <Textarea
                    placeholder="Template description"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                  />
                  <Textarea
                    placeholder="Template content (use {{variables}} for dynamic content)"
                    value={newTemplate.template}
                    onChange={(e) => setNewTemplate({...newTemplate, template: e.target.value})}
                    rows={4}
                  />
                  <Button onClick={handleAddTemplate} className="w-full">
                    Add Template
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4">
          <Button className="w-full" variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Advanced Document Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartDocumentGenerator;