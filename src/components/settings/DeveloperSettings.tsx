import { Copy, Eye, EyeOff, RefreshCw, Webhook, FileJson, FileSpreadsheet, FileText, Activity } from "lucide-react";
import { useState } from "react";

const DeveloperSettings = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("sk_live_1234567890abcdef");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [systemLogs] = useState(`[2025-04-10 10:23:45] API request received: GET /meetings
[2025-04-10 10:23:46] Database query executed
[2025-04-10 10:23:46] Response sent: 200 OK
[2025-04-10 10:24:12] Webhook triggered: on_meeting_end
[2025-04-10 10:24:13] AI summary generated
[2025-04-10 10:25:01] New meeting created
[2025-04-10 10:25:15] Transcription service started
[2025-04-10 10:26:30] Real-time sync completed`);

  const [eventTriggers] = useState([
    { name: "on_meeting_end", description: "Triggered when a meeting ends", active: true },
    { name: "on_summary_ready", description: "Triggered when AI summary is generated", active: true },
    { name: "on_task_created", description: "Triggered when a task is created", active: false },
    { name: "on_transcription_complete", description: "Triggered when transcription finishes", active: true }
  ]);

  const showToast = (message: string) => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 px-6 py-3 rounded-xl font-semibold text-white z-50 bg-gradient-to-r from-emerald-500 to-teal-600 animate-slideIn';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard");
  };

  const regenerateApiKey = () => {
    const newApiKey = "sk_live_" + Math.random().toString(36).substring(2, 15);
    setApiKey(newApiKey);
    showToast("API key regenerated successfully");
  };

  const exportData = (format: string) => {
    showToast(`Data exported as ${format}`);
  };

  const saveDeveloperSettings = () => {
    showToast("Developer settings saved successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="">
        <div className="max-w-5xl mx-auto p-8">
          <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="space-y-3">
              <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Developer Settings
              </h1>
              <p className="text-cyan-300 text-xl font-semibold">Manage API access, webhooks, and integrations</p>
            </div>

            {/* API Access */}
            <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-cyan-400/40 rounded-3xl p-8 hover:border-cyan-300/70 transition-all duration-300">
              <h2 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-8">
                API Access
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-slate-200 font-bold text-xl block mb-4">
                    API Key
                  </label>
                  <div className="flex gap-3">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      readOnly
                      className="flex-1 px-5 py-4 bg-slate-800/50 border-2 border-slate-700 rounded-2xl text-slate-200 font-mono text-lg focus:outline-none focus:border-cyan-400/60 transition-all duration-300"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="w-14 h-14 bg-slate-800/50 border-2 border-slate-700 hover:border-cyan-400/60 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105"
                    >
                      {showApiKey ? <EyeOff className="w-6 h-6 text-slate-300" /> : <Eye className="w-6 h-6 text-slate-300" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(apiKey)}
                      className="w-14 h-14 bg-slate-800/50 border-2 border-slate-700 hover:border-cyan-400/60 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105"
                    >
                      <Copy className="w-6 h-6 text-slate-300" />
                    </button>
                    <button
                      onClick={regenerateApiKey}
                      className="w-14 h-14 bg-slate-800/50 border-2 border-slate-700 hover:border-cyan-400/60 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105"
                    >
                      <RefreshCw className="w-6 h-6 text-slate-300" />
                    </button>
                  </div>
                  <p className="text-slate-400 text-base mt-3 font-medium">
                    Keep your API key secure. Never share it in public repositories.
                  </p>
                </div>

                <div>
                  <label className="text-slate-200 font-bold text-xl block mb-4">
                    Webhook URL
                  </label>
                  <div className="flex gap-3 items-center">
                    <Webhook className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                    <input
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://your-app.com/webhook"
                      className="flex-1 px-5 py-4 bg-slate-800/50 border-2 border-slate-700 rounded-2xl text-slate-200 font-medium text-lg focus:outline-none focus:border-cyan-400/60 transition-all duration-300"
                    />
                  </div>
                  <p className="text-slate-400 text-base mt-3 font-medium">
                    Events will be sent to this URL when triggered
                  </p>
                </div>
              </div>
            </div>

            {/* Event Triggers */}
            <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-emerald-400/40 rounded-3xl p-8 hover:border-emerald-300/70 transition-all duration-300">
              <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-8">
                Event Triggers
              </h2>
              
              <div className="space-y-4">
                {eventTriggers.map((trigger, index) => (
                  <div
                    key={index}
                    className="p-6 bg-slate-800/50 border-2 border-slate-700 rounded-2xl hover:border-emerald-400/60 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-slate-100 font-bold text-xl font-mono">{trigger.name}</h3>
                      <span className={`px-4 py-2 rounded-xl font-bold text-sm ${
                        trigger.active 
                          ? 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-400/60' 
                          : 'bg-slate-700/50 text-slate-400 border-2 border-slate-600'
                      }`}>
                        {trigger.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-slate-400 text-base font-medium">
                      {trigger.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Export */}
            <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-violet-400/40 rounded-3xl p-8 hover:border-violet-300/70 transition-all duration-300">
              <h2 className="text-4xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-8">
                Data Export
              </h2>
              
              <div className="space-y-4">
                <label className="text-slate-200 font-bold text-xl block mb-4">
                  Export Format
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => exportData("JSON")}
                    className="flex flex-col items-center gap-3 p-6 bg-slate-800/50 border-2 border-slate-700 hover:border-violet-400/60 rounded-2xl transition-all duration-300 hover:scale-105 group"
                  >
                    <FileJson className="w-12 h-12 text-violet-400 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-slate-200 font-bold text-lg">JSON</span>
                  </button>
                  <button
                    onClick={() => exportData("CSV")}
                    className="flex flex-col items-center gap-3 p-6 bg-slate-800/50 border-2 border-slate-700 hover:border-violet-400/60 rounded-2xl transition-all duration-300 hover:scale-105 group"
                  >
                    <FileSpreadsheet className="w-12 h-12 text-violet-400 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-slate-200 font-bold text-lg">CSV</span>
                  </button>
                  <button
                    onClick={() => exportData("PDF")}
                    className="flex flex-col items-center gap-3 p-6 bg-slate-800/50 border-2 border-slate-700 hover:border-violet-400/60 rounded-2xl transition-all duration-300 hover:scale-105 group"
                  >
                    <FileText className="w-12 h-12 text-violet-400 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-slate-200 font-bold text-lg">PDF</span>
                  </button>
                </div>
              </div>
            </div>

            {/* System Logs */}
            <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-orange-400/40 rounded-3xl p-8 hover:border-orange-300/70 transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  System Logs
                </h2>
                <Activity className="w-8 h-8 text-orange-400 animate-pulse" />
              </div>
              
              <div className="bg-slate-950/90 border-2 border-slate-800 rounded-2xl p-6 overflow-hidden">
                <pre className="text-slate-300 font-mono text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap">
                  {systemLogs}
                </pre>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={saveDeveloperSettings}
              className="w-full flex items-center justify-center gap-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-2xl py-6 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] border-2 border-emerald-400/50"
            >
              <RefreshCw className="w-7 h-7" />
              Save Developer Settings
            </button>
          </div>
        </div>

        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }

          .overflow-y-auto::-webkit-scrollbar {
            width: 8px;
          }

          .overflow-y-auto::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.5);
            border-radius: 10px;
          }

          .overflow-y-auto::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, rgb(34, 211, 238), rgb(59, 130, 246));
            border-radius: 10px;
          }

          .overflow-y-auto::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, rgb(6, 182, 212), rgb(37, 99, 235));
          }
        `}</style>
      </div>
    </div>
  );
};

export default DeveloperSettings;