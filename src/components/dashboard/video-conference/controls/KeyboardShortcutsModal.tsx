import React from "react";
import { X } from "lucide-react";

interface KeyboardShortcutsModalProps {
  showKeyboardShortcuts: boolean;
  setShowKeyboardShortcuts: (show: boolean) => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  showKeyboardShortcuts,
  setShowKeyboardShortcuts
}) => {
  return (
    <>
      {showKeyboardShortcuts && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
          onClick={() => setShowKeyboardShortcuts(false)}
        >
          <div 
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-100">Keyboard Shortcuts</h3>
              <button 
                onClick={() => setShowKeyboardShortcuts(false)} 
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { action: 'Toggle Mute', shortcut: 'Ctrl+D' },
                { action: 'Toggle Video', shortcut: 'Ctrl+E' },
                { action: 'Raise Hand', shortcut: 'Ctrl+H' },
                { action: 'Toggle Chat', shortcut: 'Ctrl+M' },
                { action: 'Toggle Participants', shortcut: 'Ctrl+P' }
              ].map(({ action, shortcut }, idx) => (
                <div 
                  key={idx} 
                  className="flex justify-between items-center py-2 border-b border-slate-700 last:border-0"
                >
                  <span className="text-sm text-slate-300">{action}</span>
                  <kbd className="px-3 py-1.5 bg-slate-700 rounded-lg text-sm text-slate-200 font-mono">
                    {shortcut}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-in {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};