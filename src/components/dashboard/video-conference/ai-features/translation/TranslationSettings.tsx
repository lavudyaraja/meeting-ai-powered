import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Languages,
  Save,
  RotateCcw,
  Loader2
} from "lucide-react";

interface TranslationSettingsProps {
  defaultSourceLanguage?: string;
  defaultTargetLanguage?: string;
  onSettingsChange?: (settings: { sourceLanguage: string; targetLanguage: string }) => void;
  className?: string;
}

export const TranslationSettings: React.FC<TranslationSettingsProps> = ({
  defaultSourceLanguage = "en",
  defaultTargetLanguage = "es",
  onSettingsChange,
  className = ""
}) => {
  const [sourceLanguage, setSourceLanguage] = useState(defaultSourceLanguage);
  const [targetLanguage, setTargetLanguage] = useState(defaultTargetLanguage);
  const [isSaving, setIsSaving] = useState(false);

  const languageOptions = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In a real implementation, this would save to user preferences or database
      onSettingsChange?.({ sourceLanguage, targetLanguage });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error saving translation settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSourceLanguage(defaultSourceLanguage);
    setTargetLanguage(defaultTargetLanguage);
  };

  return (
    <Card className={`p-4 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Languages className="w-5 h-5 text-blue-400" />
        <h3 className="font-semibold text-slate-100">Translation Settings</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-sm text-slate-300 mb-2 block">Source Language</Label>
          <select 
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
            className="w-full bg-slate-700 text-slate-200 rounded-lg px-3 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none"
          >
            {languageOptions.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>

        <div>
          <Label className="text-sm text-slate-300 mb-2 block">Target Language</Label>
          <select 
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="w-full bg-slate-700 text-slate-200 rounded-lg px-3 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none"
          >
            {languageOptions.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 gap-1.5 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
          >
            {isSaving ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            Save Settings
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-1.5 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
};