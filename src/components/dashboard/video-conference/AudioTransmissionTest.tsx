import React, { useState, useEffect, useRef } from 'react';

interface AudioTransmissionTestProps {
  onClose: () => void;
  localStreamRef: React.RefObject<MediaStream | null>;
  onTestComplete: (result: { success: boolean; message: string }) => void;
}

const AudioTransmissionTest: React.FC<AudioTransmissionTestProps> = ({ 
  onClose, 
  localStreamRef,
  onTestComplete
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startTest = async () => {
    if (!localStreamRef.current) {
      setTestResult({
        success: false,
        message: "No local audio stream available. Please check your microphone permissions."
      });
      return;
    }

    try {
      // Create audio context for monitoring
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      // Create analyzer to monitor audio levels
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      // Connect local stream to analyzer
      const source = audioContextRef.current.createMediaStreamSource(localStreamRef.current);
      source.connect(analyserRef.current);
      
      setIsRecording(true);
      setTestResult(null);
      
      // Monitor audio levels
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average);
        }
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };
      
      updateAudioLevel();
      
      // Wait for 5 seconds to detect audio
      setTimeout(() => {
        finishTest();
      }, 5000);
    } catch (error) {
      console.error('Error starting audio test:', error);
      setTestResult({
        success: false,
        message: "Failed to start audio test. Please check console for details."
      });
      setIsRecording(false);
    }
  };

  const finishTest = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    setIsRecording(false);
    
    if (audioLevel > 5) {
      setTestResult({
        success: true,
        message: `Audio transmission test successful! Audio level detected: ${Math.round(audioLevel)}. Your microphone is working and audio should be transmitted to other participants.`
      });
      onTestComplete({
        success: true,
        message: `Audio level: ${Math.round(audioLevel)} - Transmission should be working`
      });
    } else {
      setTestResult({
        success: false,
        message: "No audio detected during test. Please check:\n1. Your microphone is properly connected\n2. Microphone permissions are granted\n3. You are speaking during the test\n4. Your microphone is not muted"
      });
      onTestComplete({
        success: false,
        message: "No audio detected - Check microphone connection and permissions"
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Audio Transmission Test</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            This test will check if your microphone is working and audio can be transmitted to other participants.
          </p>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Audio Level</span>
              <span className="text-sm">{Math.round(audioLevel)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-600 h-4 rounded-full transition-all duration-100"
                style={{ width: `${Math.min(100, audioLevel)}%` }}
              ></div>
            </div>
          </div>
          
          {isRecording ? (
            <div className="text-center py-4">
              <div className="inline-block animate-pulse rounded-full h-16 w-16 bg-red-500 mb-4"></div>
              <p className="font-medium">Recording... Please speak into your microphone</p>
              <p className="text-sm text-gray-500">Test will complete in 5 seconds</p>
            </div>
          ) : testResult ? (
            <div className={`p-4 rounded ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <h3 className={`font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                {testResult.success ? 'Test Successful!' : 'Test Failed'}
              </h3>
              <p className={`text-sm ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                {testResult.message}
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <button
                onClick={startTest}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded"
              >
                Start Test
              </button>
              <p className="text-sm text-gray-500 mt-2">You will need to speak during the test</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioTransmissionTest;