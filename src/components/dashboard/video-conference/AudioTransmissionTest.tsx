import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, Play, Square, AlertCircle, CheckCircle } from 'lucide-react';

interface AudioTransmissionTestProps {
  localStream?: MediaStream | null;
  isVisible: boolean;
  onClose: () => void;
}

interface TestResult {
  test: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
}

export const AudioTransmissionTest: React.FC<AudioTransmissionTestProps> = ({
  localStream,
  isVisible,
  onClose
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTestingTransmission, setIsTestingTransmission] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (isVisible && localStream) {
      runAudioTransmissionTests();
      startAudioMonitoring();
    }

    return () => {
      stopAudioMonitoring();
    };
  }, [isVisible, localStream]);

  const runAudioTransmissionTests = async () => {
    setIsTestingTransmission(true);
    const results: TestResult[] = [];

    try {
      // Test 1: Check if local stream exists
      if (!localStream) {
        results.push({
          test: 'Local Stream',
          status: 'failed',
          message: 'No local media stream available'
        });
        setTestResults(results);
        setIsTestingTransmission(false);
        return;
      }

      results.push({
        test: 'Local Stream',
        status: 'passed',
        message: `Stream available (ID: ${localStream.id.slice(0, 8)}...)`
      });

      // Test 2: Check audio tracks
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length === 0) {
        results.push({
          test: 'Audio Tracks',
          status: 'failed',
          message: 'No audio tracks found in local stream'
        });
      } else {
        results.push({
          test: 'Audio Tracks',
          status: 'passed',
          message: `Found ${audioTracks.length} audio track(s)`
        });

        // Test 3: Check if audio tracks are enabled
        const enabledTracks = audioTracks.filter(track => track.enabled);
        if (enabledTracks.length === 0) {
          results.push({
            test: 'Audio Track State',
            status: 'failed',
            message: 'All audio tracks are disabled/muted'
          });
        } else {
          results.push({
            test: 'Audio Track State',
            status: 'passed',
            message: `${enabledTracks.length}/${audioTracks.length} tracks enabled`
          });
        }

        // Test 4: Check audio track settings
        audioTracks.forEach((track, index) => {
          const settings = track.getSettings();
          results.push({
            test: `Track ${index + 1} Settings`,
            status: settings.sampleRate && settings.channelCount ? 'passed' : 'warning',
            message: `Sample Rate: ${settings.sampleRate || 'N/A'}, Channels: ${settings.channelCount || 'N/A'}`
          });
        });
      }

      // Test 5: Check if stream is active
      results.push({
        test: 'Stream Status',
        status: localStream.active ? 'passed' : 'failed',
        message: localStream.active ? 'Stream is active' : 'Stream is inactive'
      });

      // Test 6: Test audio level detection
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const context = new AudioContext();
        const analyser = context.createAnalyser();
        const microphone = context.createMediaStreamSource(localStream);
        
        microphone.connect(analyser);
        analyser.fftSize = 256;
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        // Get a quick sample
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
        
        results.push({
          test: 'Audio Level Detection',
          status: average > 0 ? 'passed' : 'warning',
          message: `Current audio level: ${average.toFixed(2)} (${average > 0 ? 'detecting audio' : 'no audio detected'})`
        });

        // Cleanup
        microphone.disconnect();
        context.close();
      } catch (error) {
        results.push({
          test: 'Audio Level Detection',
          status: 'failed',
          message: `Failed to setup audio analysis: ${error}`
        });
      }

      // Test 7: Check microphone permissions
      try {
        const permissions = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        results.push({
          test: 'Microphone Permission',
          status: permissions.state === 'granted' ? 'passed' : 'warning',
          message: `Permission: ${permissions.state}`
        });
      } catch (error) {
        results.push({
          test: 'Microphone Permission',
          status: 'warning',
          message: 'Unable to check microphone permissions'
        });
      }

    } catch (error) {
      results.push({
        test: 'Overall Test',
        status: 'failed',
        message: `Test failed: ${error}`
      });
    }

    setTestResults(results);
    setIsTestingTransmission(false);
  };

  const startAudioMonitoring = () => {
    if (!localStream) return;

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(localStream);
      
      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      const monitorLevel = () => {
        if (!analyserRef.current) return;
        
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
        const normalizedLevel = average / 255;
        
        setAudioLevel(normalizedLevel);
        animationRef.current = requestAnimationFrame(monitorLevel);
      };
      
      monitorLevel();
    } catch (error) {
      console.error('Error starting audio monitoring:', error);
    }
  };

  const stopAudioMonitoring = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const startRecording = async () => {
    if (!localStream) return;

    try {
      recordedChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(localStream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start(100);
      setIsRecording(true);
      
      // Auto-stop after 5 seconds
      setTimeout(() => {
        stopRecording();
      }, 5000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      setTimeout(() => {
        if (recordedChunksRef.current.length > 0) {
          const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
          playRecording(blob);
        }
      }, 1000);
    }
  };

  const playRecording = (blob: Blob) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(blob);
    audio.volume = 1.0;
    audio.play().catch(error => {
      console.error('Error playing recording:', error);
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Audio Transmission Test</h2>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>

          {/* Audio Level Monitor */}
          <Card className="mb-6 p-4">
            <h3 className="font-semibold mb-3">Live Audio Level</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {audioLevel > 0.1 ? (
                  <Mic className="w-5 h-5 text-green-500" />
                ) : (
                  <MicOff className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm">Level: {(audioLevel * 100).toFixed(1)}%</span>
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-red-500 transition-all duration-100"
                  style={{ width: `${Math.min(audioLevel * 100, 100)}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Speak into your microphone to test audio transmission
            </p>
          </Card>

          {/* Recording Test */}
          <Card className="mb-6 p-4">
            <h3 className="font-semibold mb-3">Recording Test</h3>
            <div className="flex items-center gap-3">
              <Button 
                onClick={isRecording ? stopRecording : startRecording}
                disabled={!localStream}
                className={isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}
              >
                {isRecording ? (
                  <>
                    <Square className="w-4 h-4 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start 5s Test
                  </>
                )}
              </Button>
              <span className="text-sm text-gray-600">
                {isRecording ? 'Recording your voice...' : 'Click to record a 5-second audio test'}
              </span>
            </div>
          </Card>

          {/* Test Results */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Transmission Diagnostics</h3>
              <Button 
                onClick={runAudioTransmissionTests}
                disabled={isTestingTransmission}
                variant="outline"
                size="sm"
              >
                {isTestingTransmission ? 'Testing...' : 'Re-run Tests'}
              </Button>
            </div>
            
            {testResults.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Click "Re-run Tests" to start diagnostics</p>
            ) : (
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{result.test}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(result.status)}>
                        {result.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 flex-1 text-right mr-4">{result.message}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">How to Test Audio Transmission:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Ensure all tests above show "PASSED" status</li>
              <li>2. Speak into your microphone and watch the audio level bar</li>
              <li>3. Click "Start 5s Test" to record and playback your voice</li>
              <li>4. If you hear your recording, audio transmission is working</li>
              <li>5. Join a meeting with another person to test live transmission</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AudioTransmissionTest;