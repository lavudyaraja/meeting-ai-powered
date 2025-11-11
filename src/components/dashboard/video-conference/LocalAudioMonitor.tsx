import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Headphones } from 'lucide-react';

interface LocalAudioMonitorProps {
  localStream?: MediaStream | null;
  onToast?: (title: string, description: string, variant?: 'default' | 'success' | 'error') => void;
}

export const LocalAudioMonitor: React.FC<LocalAudioMonitorProps> = ({
  localStream,
  onToast
}) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const startLocalAudioMonitoring = async () => {
    if (!localStream) {
      onToast?.("Error", "No microphone stream available", "error");
      return;
    }

    try {
      // Create audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();

      // Resume if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Create source from microphone
      sourceRef.current = audioContextRef.current.createMediaStreamSource(localStream);
      
      // Create gain node with low volume to prevent feedback
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.setValueAtTime(0.2, audioContextRef.current.currentTime);

      // Connect: microphone -> gain -> speakers
      sourceRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContextRef.current.destination);

      setIsMonitoring(true);
      onToast?.("Local Audio", "You can now hear yourself speaking", "success");
      
    } catch (error) {
      console.error('Failed to start local audio monitoring:', error);
      onToast?.("Error", "Failed to enable local audio monitoring", "error");
    }
  };

  const stopLocalAudioMonitoring = () => {
    try {
      // Disconnect audio nodes
      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }
      
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }

      // Close audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }

      setIsMonitoring(false);
      onToast?.("Local Audio", "Local audio monitoring disabled", "default");
      
    } catch (error) {
      console.error('Error stopping local audio monitoring:', error);
    }
  };

  const toggleMonitoring = () => {
    if (isMonitoring) {
      stopLocalAudioMonitoring();
    } else {
      startLocalAudioMonitoring();
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (isMonitoring) {
        stopLocalAudioMonitoring();
      }
    };
  }, []);

  return (
    <Button
      onClick={toggleMonitoring}
      variant={isMonitoring ? "default" : "outline"}
      size="sm"
      className={`
        flex items-center gap-2 transition-all duration-200
        ${isMonitoring 
          ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200' 
          : 'hover:bg-gray-100 text-gray-700 border-gray-300'
        }
      `}
      title={isMonitoring ? "Turn off local audio monitoring" : "Hear yourself speaking"}
      disabled={!localStream}
    >
      {isMonitoring ? (
        <>
          <Volume2 className="w-4 h-4" />
          <span className="hidden sm:inline">Hearing Self</span>
        </>
      ) : (
        <>
          <Headphones className="w-4 h-4" />
          <span className="hidden sm:inline">Hear Myself</span>
        </>
      )}
    </Button>
  );
};

export default LocalAudioMonitor;