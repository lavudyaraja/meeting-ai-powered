import { useState, useEffect } from "react";
import { Activity, HardDrive, Zap, RefreshCw, Download, Upload, Database, Trash2, Check } from "lucide-react";

const SystemPerformance = () => {
  const [processingLocation, setProcessingLocation] = useState("cloud");
  const [refreshInterval, setRefreshInterval] = useState("5");
  const [cachingEnabled, setCachingEnabled] = useState(true);
  const [autoUpdateModels, setAutoUpdateModels] = useState(true);
  const [apiResponseTime, setApiResponseTime] = useState(65);
  const [aiLatency, setAiLatency] = useState(45);
  const [storageUsed, setStorageUsed] = useState(42);
  const [isSaving, setIsSaving] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isBacking, setIsBacking] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [cacheSize, setCacheSize] = useState(256);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    loadSystemSettings();
    startPerformanceMonitoring();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setApiResponseTime(Math.min(100, Math.max(20, apiResponseTime + (Math.random() - 0.5) * 10)));
      setAiLatency(Math.min(100, Math.max(10, aiLatency + (Math.random() - 0.5) * 15)));
      setStorageUsed(Math.min(95, storageUsed + Math.random() * 0.1));
    }, parseInt(refreshInterval) * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval, apiResponseTime, aiLatency, storageUsed]);

  const loadSystemSettings = () => {
    const settings = {
      processingLocation: "cloud",
      refreshInterval: "5",
      cachingEnabled: true,
      autoUpdateModels: true,
      lastBackup: null
    };
    
    setProcessingLocation(settings.processingLocation);
    setRefreshInterval(settings.refreshInterval);
    setCachingEnabled(settings.cachingEnabled);
    setAutoUpdateModels(settings.autoUpdateModels);
    setLastBackup(settings.lastBackup);
  };

  const startPerformanceMonitoring = () => {
    console.log("Performance monitoring started");
  };

  const saveSystemSettings = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    showToast("System settings saved successfully", "success");
  };

  const clearCache = async () => {
    setIsClearing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCacheSize(0);
    setTimeout(() => setCacheSize(Math.random() * 50), 2000);
    setIsClearing(false);
    showToast("Cache cleared successfully", "success");
  };

  const checkForUpdates = async () => {
    setIsChecking(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const hasUpdate = Math.random() > 0.7;
    setUpdateAvailable(hasUpdate);
    setIsChecking(false);
    
    if (hasUpdate) {
      showToast("New updates available!", "info");
    } else {
      showToast("System is up to date", "success");
    }
  };

  const backupSettings = async () => {
    setIsBacking(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const backupDate = new Date().toLocaleString();
    setLastBackup(backupDate);
    setIsBacking(false);
    showToast("Settings backed up successfully", "success");
  };

  const restoreSettings = async () => {
    setIsRestoring(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (lastBackup) {
      showToast("Settings restored successfully", "success");
    } else {
      showToast("No backup found", "error");
    }
    
    setIsRestoring(false);
  };

  const showToast = (message: string, type: "success" | "error" | "info") => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-xl font-semibold text-white z-50 animate-slideIn ${
      type === 'success' ? 'bg-gradient-to-r from-emerald-500 to-teal-600' :
      type === 'error' ? 'bg-gradient-to-r from-rose-500 to-red-600' :
      'bg-gradient-to-r from-blue-500 to-cyan-600'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const getPerformanceColor = (value: number) => {
    if (value < 40) return 'from-emerald-500 to-teal-600';
    if (value < 70) return 'from-orange-500 to-amber-600';
    return 'from-rose-500 to-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="">
        <div className="max-w-5xl mx-auto p-8">
          <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="space-y-3">
              <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                System Performance
              </h1>
              <p className="text-cyan-300 text-xl font-semibold">Monitor and optimize your system settings</p>
            </div>

            {/* Performance Metrics */}
            <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-cyan-400/40 rounded-3xl p-8 hover:border-cyan-300/70 transition-all duration-300">
              <h2 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-8">
                Performance Metrics
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                    <Activity className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-3">
                      <span className="text-slate-200 font-bold text-xl">API Response Time</span>
                      <span className="text-cyan-300 font-bold text-lg">
                        {Math.round(apiResponseTime * 1.92)}ms avg
                      </span>
                    </div>
                    <div className="relative h-4 bg-slate-800/50 rounded-full overflow-hidden border-2 border-slate-700">
                      <div 
                        className={`absolute h-full bg-gradient-to-r ${getPerformanceColor(apiResponseTime)} transition-all duration-500`}
                        style={{ width: `${apiResponseTime}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-3">
                      <span className="text-slate-200 font-bold text-xl">AI Model Latency</span>
                      <span className="text-violet-300 font-bold text-lg">
                        {(aiLatency * 0.051).toFixed(1)}s avg
                      </span>
                    </div>
                    <div className="relative h-4 bg-slate-800/50 rounded-full overflow-hidden border-2 border-slate-700">
                      <div 
                        className={`absolute h-full bg-gradient-to-r ${getPerformanceColor(aiLatency)} transition-all duration-500`}
                        style={{ width: `${aiLatency}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <HardDrive className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-3">
                      <span className="text-slate-200 font-bold text-xl">Storage Used</span>
                      <span className="text-orange-300 font-bold text-lg">
                        {(storageUsed * 0.238).toFixed(1)} GB / 10 GB
                      </span>
                    </div>
                    <div className="relative h-4 bg-slate-800/50 rounded-full overflow-hidden border-2 border-slate-700">
                      <div 
                        className={`absolute h-full bg-gradient-to-r ${getPerformanceColor(storageUsed)} transition-all duration-500`}
                        style={{ width: `${storageUsed}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Processing Options */}
            <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-emerald-400/40 rounded-3xl p-8 hover:border-emerald-300/70 transition-all duration-300">
              <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-8">
                Processing Options
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-slate-200 font-bold text-xl block mb-4">
                    AI Processing Location
                  </label>
                  <select
                    value={processingLocation}
                    onChange={(e) => setProcessingLocation(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-800/50 border-2 border-slate-700 rounded-2xl text-slate-200 font-semibold text-lg focus:outline-none focus:border-emerald-400/60 transition-all duration-300"
                  >
                    <option value="cloud">Cloud (Recommended)</option>
                    <option value="local">Local (Beta)</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                  <p className="text-slate-400 text-base mt-3 font-medium">
                    Cloud processing offers better performance but local processing keeps data on-device
                  </p>
                </div>

                <div>
                  <label className="text-slate-200 font-bold text-xl block mb-4">
                    Data Refresh Interval
                  </label>
                  <select
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-800/50 border-2 border-slate-700 rounded-2xl text-slate-200 font-semibold text-lg focus:outline-none focus:border-emerald-400/60 transition-all duration-300"
                  >
                    <option value="1">Every 1 minute</option>
                    <option value="5">Every 5 minutes</option>
                    <option value="15">Every 15 minutes</option>
                    <option value="30">Every 30 minutes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Cache Management */}
            <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-blue-400/40 rounded-3xl p-8 hover:border-blue-300/70 transition-all duration-300">
              <h2 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
                Cache Management
              </h2>
              
              <div className="space-y-5">
                <div className="flex items-center justify-between p-6 bg-slate-800/50 border-2 border-slate-700 rounded-2xl hover:border-blue-400/60 transition-all duration-300">
                  <div>
                    <span className="text-slate-200 font-bold text-xl block mb-2">Enable Caching</span>
                    <p className="text-slate-400 text-base font-medium">Cache frequently accessed data</p>
                  </div>
                  <button
                    onClick={() => setCachingEnabled(!cachingEnabled)}
                    className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                      cachingEnabled 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                        : 'bg-slate-700 border-2 border-slate-600'
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${
                      cachingEnabled ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>

                <div className="p-6 bg-slate-800/50 border-2 border-slate-700 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-200 font-bold text-lg">Cache Size</span>
                    <span className="text-cyan-300 font-black text-xl">{cacheSize.toFixed(0)} MB</span>
                  </div>
                  <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden border-2 border-slate-600">
                    <div 
                      className="absolute h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
                      style={{ width: `${(cacheSize / 512) * 100}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={clearCache}
                  disabled={isClearing}
                  className="w-full flex items-center justify-center gap-3 bg-slate-800/50 border-2 border-slate-700 hover:border-rose-400/60 text-slate-200 font-bold text-lg py-5 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                >
                  {isClearing ? (
                    <>
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      Clearing Cache...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-6 h-6" />
                      Clear Cache
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Updates */}
            <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-violet-400/40 rounded-3xl p-8 hover:border-violet-300/70 transition-all duration-300">
              <h2 className="text-4xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-8">
                Updates
              </h2>
              
              <div className="space-y-5">
                <div className="flex items-center justify-between p-6 bg-slate-800/50 border-2 border-slate-700 rounded-2xl hover:border-violet-400/60 transition-all duration-300">
                  <div>
                    <span className="text-slate-200 font-bold text-xl block mb-2">Auto-update AI Models</span>
                    <p className="text-slate-400 text-base font-medium">Automatically download new models</p>
                  </div>
                  <button
                    onClick={() => setAutoUpdateModels(!autoUpdateModels)}
                    className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                      autoUpdateModels 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                        : 'bg-slate-700 border-2 border-slate-600'
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${
                      autoUpdateModels ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>

                {updateAvailable && (
                  <div className="p-5 bg-orange-500/20 border-2 border-orange-400/60 rounded-2xl">
                    <p className="text-orange-300 font-bold text-lg">New updates available! Click below to install.</p>
                  </div>
                )}

                <button
                  onClick={checkForUpdates}
                  disabled={isChecking}
                  className="w-full flex items-center justify-center gap-3 bg-slate-800/50 border-2 border-slate-700 hover:border-violet-400/60 text-slate-200 font-bold text-lg py-5 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                >
                  {isChecking ? (
                    <>
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6" />
                      Check for Updates
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Backup & Restore */}
            <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-pink-400/40 rounded-3xl p-8 hover:border-pink-300/70 transition-all duration-300">
              <h2 className="text-4xl font-black bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-8">
                Backup & Restore
              </h2>
              
              <div className="space-y-5">
                {lastBackup && (
                  <div className="p-5 bg-emerald-500/20 border-2 border-emerald-400/60 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Database className="w-6 h-6 text-emerald-400" />
                      <span className="text-emerald-300 font-bold text-lg">Last backup: {lastBackup}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={backupSettings}
                  disabled={isBacking}
                  className="w-full flex items-center justify-center gap-3 bg-slate-800/50 border-2 border-slate-700 hover:border-pink-400/60 text-slate-200 font-bold text-lg py-5 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                >
                  {isBacking ? (
                    <>
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      Backing up...
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6" />
                      Backup Settings
                    </>
                  )}
                </button>

                <button
                  onClick={restoreSettings}
                  disabled={isRestoring}
                  className="w-full flex items-center justify-center gap-3 bg-slate-800/50 border-2 border-slate-700 hover:border-pink-400/60 text-slate-200 font-bold text-lg py-5 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                >
                  {isRestoring ? (
                    <>
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      Restoring...
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6" />
                      Restore Settings
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={saveSystemSettings}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-2xl py-6 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] border-2 border-emerald-400/50 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-7 h-7 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-7 h-7" />
                  Save System Settings
                </>
              )}
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

export default SystemPerformance;