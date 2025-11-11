import React, { useState, useEffect, useRef } from 'react';

interface AudioDebuggerProps {
  onClose: () => void;
  localStreamRef: React.RefObject<MediaStream | null>;
  participants: any[];
}

const AudioDebugger: React.FC<AudioDebuggerProps> = ({ 
  onClose, 
  localStreamRef,
  participants 
}) => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [audioLevels, setAudioLevels] = useState<Record<string, number>>({});
  const analyzerRef = useRef<Record<string, any>>({});

  useEffect(() => {
    const updateDebugInfo = () => {
      const info: any = {};
      
      // Local stream info
      if (localStreamRef.current) {
        const localStream = localStreamRef.current;
        info.localStream = {
          id: localStream.id,
          active: localStream.active,
          audioTracks: localStream.getAudioTracks().map(t => ({
            id: t.id,
            enabled: t.enabled,
            muted: t.muted,
            readyState: t.readyState,
            kind: t.kind
          })),
          videoTracks: localStream.getVideoTracks().map(t => ({
            id: t.id,
            enabled: t.enabled,
            muted: t.muted,
            readyState: t.readyState,
            kind: t.kind
          }))
        };
      }
      
      // Participants info
      info.participants = participants.map(p => ({
        id: p.id,
        name: p.name,
        hasStream: !!p.stream,
        streamInfo: p.stream ? {
          id: p.stream.id,
          active: p.stream.active,
          audioTracks: p.stream.getAudioTracks().length,
          videoTracks: p.stream.getVideoTracks().length
        } : null
      }));
      
      setDebugInfo(info);
    };
    
    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 1000);
    return () => clearInterval(interval);
  }, [localStreamRef, participants]);

  useEffect(() => {
    // Set up audio level monitoring
    const monitorAudioLevels = () => {
      if (localStreamRef.current) {
        const localStream = localStreamRef.current;
        const audioTracks = localStream.getAudioTracks();
        
        if (audioTracks.length > 0 && !analyzerRef.current['local']) {
          try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(localStream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            
            analyzerRef.current['local'] = {
              context: audioContext,
              analyser: analyser,
              source: source
            };
          } catch (e) {
            console.error('Error setting up local audio monitoring:', e);
          }
        }
      }
      
      // Monitor remote participants
      participants.forEach(participant => {
        if (participant.stream && !analyzerRef.current[participant.id]) {
          try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(participant.stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            
            analyzerRef.current[participant.id] = {
              context: audioContext,
              analyser: analyser,
              source: source
            };
          } catch (e) {
            console.error(`Error setting up audio monitoring for ${participant.id}:`, e);
          }
        }
      });
    };
    
    monitorAudioLevels();
    
    // Update audio levels
    const updateAudioLevels = () => {
      const levels: Record<string, number> = {};
      
      Object.keys(analyzerRef.current).forEach(key => {
        const analyzer = analyzerRef.current[key];
        if (analyzer && analyzer.analyser) {
          const dataArray = new Uint8Array(analyzer.analyser.frequencyBinCount);
          analyzer.analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          levels[key] = average;
        }
      });
      
      setAudioLevels(levels);
    };
    
    const interval = setInterval(updateAudioLevels, 100);
    return () => {
      clearInterval(interval);
      // Clean up audio contexts
      Object.values(analyzerRef.current).forEach((analyzer: any) => {
        if (analyzer.context) {
          analyzer.context.close();
        }
      });
    };
  }, [participants, localStreamRef]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Audio Debugger</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Audio Levels</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-32">Local Audio:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all duration-100"
                  style={{ width: `${Math.min(100, (audioLevels['local'] || 0) / 2.55)}%` }}
                ></div>
              </div>
              <span className="ml-2 w-12">{Math.round(audioLevels['local'] || 0)}</span>
            </div>
            
            {participants.map(participant => (
              <div key={participant.id} className="flex items-center">
                <span className="w-32">{participant.name}:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-green-600 h-4 rounded-full transition-all duration-100"
                    style={{ width: `${Math.min(100, (audioLevels[participant.id] || 0) / 2.55)}%` }}
                  ></div>
                </div>
                <span className="ml-2 w-12">{Math.round(audioLevels[participant.id] || 0)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Local Stream Info</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo.localStream, null, 2)}
          </pre>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Participants Info</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo.participants, null, 2)}
          </pre>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h4 className="font-semibold text-yellow-800 mb-2">Troubleshooting Tips</h4>
          <ul className="list-disc pl-5 text-yellow-700 space-y-1">
            <li>If local audio level is 0, check your microphone permissions</li>
            <li>If remote audio levels are 0, check if other participants have unmuted</li>
            <li>Ensure all participants are using compatible browsers (Chrome, Firefox, Edge)</li>
            <li>Check your network connection if participants frequently drop</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AudioDebugger;