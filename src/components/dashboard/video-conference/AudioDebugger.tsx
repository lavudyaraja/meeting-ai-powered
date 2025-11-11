import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Volume2, VolumeX, Mic, MicOff, Settings, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface AudioDebuggerProps {
  isOpen: boolean;
  onClose: () => void;
  onAudioFixed?: () => void;
}

interface AudioDevice {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'audiooutput';
}

interface AudioDiagnostic {
  name: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
  solution?: string;
}

export const AudioDebugger: React.FC<AudioDebuggerProps> = ({
  isOpen,
  onClose,
  onAudioFixed
}) => {
  const [diagnostics, setDiagnostics] = useState<AudioDiagnostic[]>([]);
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);
  const [selectedOutputDevice, setSelectedOutputDevice] = useState<string>('default');
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [testAudioPlaying, setTestAudioPlaying] = useState(false);
  
  const testAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (isOpen) {
      runDiagnostics();
      loadAudioDevices();
    }

    return () => {
      // Cleanup
      if (testAudioRef.current) {
        testAudioRef.current.pause();
        testAudioRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [isOpen]);

  const loadAudioDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices
        .filter(device => device.kind === 'audiooutput' || device.kind === 'audioinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `${device.kind === 'audiooutput' ? 'Speaker' : 'Microphone'} ${device.deviceId.slice(0, 8)}`,
          kind: device.kind as 'audioinput' | 'audiooutput'
        }));
      
      setAudioDevices(audioDevices);
    } catch (error) {
      console.error('Error loading audio devices:', error);
    }
  };

  const runDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    const results: AudioDiagnostic[] = [];

    try {
      // Test 1: Audio Context Support
      const hasAudioContext = typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined';
      results.push({
        name: 'Audio Context Support',
        status: hasAudioContext ? 'passed' : 'failed',
        message: hasAudioContext ? 'Audio Context API is supported' : 'Audio Context API is not supported',
        solution: hasAudioContext ? undefined : 'Update your browser to a newer version'
      });

      // Test 2: Media Devices API
      const hasMediaDevices = typeof navigator.mediaDevices !== 'undefined';
      results.push({
        name: 'Media Devices API',
        status: hasMediaDevices ? 'passed' : 'failed',
        message: hasMediaDevices ? 'Media Devices API is available' : 'Media Devices API is not available',
        solution: hasMediaDevices ? undefined : 'Update your browser to support Media Devices API'
      });

      // Test 3: Audio Context State
      if (hasAudioContext) {
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          audioContextRef.current = new AudioContextClass();
          
          const contextState = audioContextRef.current.state;
          results.push({
            name: 'Audio Context State',
            status: contextState === 'running' ? 'passed' : 'warning',
            message: `Audio context state: ${contextState}`,
            solution: contextState === 'suspended' ? 'Click anywhere on the page to resume audio context' : undefined
          });

          // Try to resume if suspended
          if (contextState === 'suspended') {
            try {
              await audioContextRef.current.resume();
              results[results.length - 1].status = 'passed';
              results[results.length - 1].message = 'Audio context successfully resumed';
              results[results.length - 1].solution = undefined;
            } catch (error) {
              results[results.length - 1].solution = 'User interaction required to resume audio context';
            }
          }
        } catch (error) {
          results.push({
            name: 'Audio Context State',
            status: 'failed',
            message: `Failed to create audio context: ${error}`,
            solution: 'Try refreshing the page or updating your browser'
          });
        }
      }

      // Test 4: Audio Output Devices
      if (hasMediaDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const outputDevices = devices.filter(device => device.kind === 'audiooutput');
          
          results.push({
            name: 'Audio Output Devices',
            status: outputDevices.length > 0 ? 'passed' : 'warning',
            message: `Found ${outputDevices.length} audio output device(s)`,
            solution: outputDevices.length === 0 ? 'Check if audio devices are connected and recognized by the system' : undefined
          });
        } catch (error) {
          results.push({
            name: 'Audio Output Devices',
            status: 'failed',
            message: `Failed to enumerate devices: ${error}`,
            solution: 'Grant microphone permissions to access device list'
          });
        }
      }

      // Test 5: Audio Elements in DOM
      const audioElements = document.querySelectorAll('audio');
      const mutedElements = Array.from(audioElements).filter(el => el.muted);
      
      results.push({
        name: 'Audio Elements',
        status: audioElements.length > 0 ? (mutedElements.length === audioElements.length ? 'warning' : 'passed') : 'warning',
        message: `Found ${audioElements.length} audio elements, ${mutedElements.length} are muted`,
        solution: mutedElements.length > 0 ? 'Some audio elements are muted, this might prevent audio playback' : undefined
      });

      // Test 6: HTTPS Connection (required for many audio features)
      const isHTTPS = window.location.protocol === 'https:';
      results.push({
        name: 'Secure Connection',
        status: isHTTPS || window.location.hostname === 'localhost' ? 'passed' : 'warning',
        message: isHTTPS ? 'Using secure HTTPS connection' : 'Using HTTP connection',
        solution: !isHTTPS && window.location.hostname !== 'localhost' ? 'Use HTTPS for better audio/video support' : undefined
      });

    } catch (error) {
      results.push({
        name: 'Diagnostic Error',
        status: 'failed',
        message: `Error running diagnostics: ${error}`,
        solution: 'Try refreshing the page and running diagnostics again'
      });
    }

    setDiagnostics(results);
    setIsRunningDiagnostics(false);
  };

  const playTestAudio = async () => {
    try {
      setTestAudioPlaying(true);
      
      // Create test audio element
      testAudioRef.current = document.createElement('audio');
      testAudioRef.current.crossOrigin = 'anonymous';
      
      // Use a data URL for a simple beep sound
      const audioContext = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
      
      setTimeout(() => {
        setTestAudioPlaying(false);
      }, 1000);
      
      if (onAudioFixed) {
        onAudioFixed();
      }
      
    } catch (error) {
      console.error('Error playing test audio:', error);
      setTestAudioPlaying(false);
    }
  };

  const fixCommonIssues = async () => {
    try {
      // 1. Resume all suspended audio contexts
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // 2. Unmute all audio elements
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(el => {
        el.muted = false;
        el.volume = 1.0;
        if (el.paused) {
          el.play().catch(e => console.log('Auto-play failed:', e));
        }
      });

      // 3. Set audio output device for all elements
      if (selectedOutputDevice !== 'default') {
        audioElements.forEach(el => {
          if ('setSinkId' in el) {
            (el as any).setSinkId(selectedOutputDevice).catch((e: any) => 
              console.warn('Failed to set audio output device:', e)
            );
          }
        });
      }

      // Re-run diagnostics to check improvements
      await runDiagnostics();

      if (onAudioFixed) {
        onAudioFixed();
      }

    } catch (error) {
      console.error('Error fixing audio issues:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Audio Diagnostics</h2>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={fixCommonIssues}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Fix Common Issues
              </Button>
              <Button 
                onClick={playTestAudio}
                disabled={testAudioPlaying}
                variant="outline"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                {testAudioPlaying ? 'Playing...' : 'Test Audio'}
              </Button>
              <Button 
                onClick={runDiagnostics}
                disabled={isRunningDiagnostics}
                variant="outline"
              >
                {isRunningDiagnostics ? 'Running...' : 'Re-run Diagnostics'}
              </Button>
            </div>
          </div>

          {/* Audio Output Device Selection */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Audio Output Device</h3>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedOutputDevice}
              onChange={(e) => setSelectedOutputDevice(e.target.value)}
            >
              <option value="default">Default</option>
              {audioDevices
                .filter(device => device.kind === 'audiooutput')
                .map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
            </select>
          </div>

          {/* Diagnostics Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Diagnostic Results</h3>
            {diagnostics.map((diagnostic, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(diagnostic.status)}
                  <span className="font-medium">{diagnostic.name}</span>
                  <Badge className={getStatusColor(diagnostic.status)}>
                    {diagnostic.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-2">{diagnostic.message}</p>
                {diagnostic.solution && (
                  <Alert>
                    <AlertDescription>
                      <strong>Solution:</strong> {diagnostic.solution}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </div>

          {/* Manual Instructions */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Manual Troubleshooting Steps</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Ensure your speakers/headphones are connected and working</li>
              <li>Check browser permissions for audio access</li>
              <li>Try refreshing the page if audio doesn't work</li>
              <li>Click anywhere on the page to enable audio context</li>
              <li>Check system volume and browser tab is not muted</li>
              <li>Try using headphones instead of speakers to avoid feedback</li>
              <li>Ensure you're using a supported browser (Chrome, Firefox, Safari)</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AudioDebugger;