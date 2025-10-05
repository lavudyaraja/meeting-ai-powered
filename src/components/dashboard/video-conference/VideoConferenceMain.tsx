import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Activity, Loader2 } from "lucide-react";

interface VideoConferenceMainProps {
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  isHostStarting: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  isVideoOff: boolean;
  reactions: { [key: string]: string };
  localStreamRef: React.RefObject<MediaStream>;
  videoContainerRef: React.RefObject<HTMLDivElement>;
  showToast: (title: string, description: string, variant?: 'default' | 'success' | 'error') => void;
  setParticipants: React.Dispatch<React.SetStateAction<any[]>>;
  setConnectionStatus: React.Dispatch<React.SetStateAction<'connecting' | 'connected' | 'disconnected'>>;
  setIsHostStarting: React.Dispatch<React.SetStateAction<boolean>>;
}

export const VideoConferenceMain = ({
  connectionStatus,
  isHostStarting,
  videoRef,
  isVideoOff,
  reactions,
  localStreamRef,
  videoContainerRef,
  showToast,
  setParticipants,
  setConnectionStatus,
  setIsHostStarting
}: VideoConferenceMainProps) => {
  const [videoEnabled, setVideoEnabled] = React.useState(true);

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        const newState = !videoTracks[0].enabled;
        videoTracks[0].enabled = newState;
        setVideoEnabled(newState);
        
        showToast(
          newState ? "Camera Enabled" : "Camera Disabled", 
          newState ? "Your camera is now on" : "Your camera is now off", 
          "success"
        );
      }
    }
  };

  // Set up video stream when connected
  React.useEffect(() => {
    const setupVideo = async () => {
      if (videoRef.current && localStreamRef.current && connectionStatus === 'connected') {
        // Assign the stream to the video element
        videoRef.current.srcObject = localStreamRef.current;
        
        // Ensure video tracks are enabled by default
        const videoTracks = localStreamRef.current.getVideoTracks();
        if (videoTracks.length > 0) {
          videoTracks[0].enabled = true;
          setVideoEnabled(true);
        }
        
        try {
          // Attempt to play the video
          await videoRef.current.play();
        } catch (e) {
          console.warn('Autoplay prevented:', e);
          // Try playing again on user interaction
          const playOnInteraction = async () => {
            try {
              await videoRef.current?.play();
              document.removeEventListener('click', playOnInteraction);
            } catch (err) {
              console.warn('Play on interaction failed:', err);
            }
          };
          document.addEventListener('click', playOnInteraction);
        }
      }
    };
    
    setupVideo();
  }, [connectionStatus, localStreamRef, videoRef]);

  const isVideoCameraOff = !videoEnabled || isVideoOff;

  return (
    <Card className="p-0 h-[calc(100vh-280px)] min-h-[500px] relative overflow-hidden border-2 border-gray-300 shadow-xl">
      {/* Video container */}
      <div ref={videoContainerRef} className="w-full h-full rounded-lg overflow-hidden relative bg-gray-100">
        {connectionStatus === 'connecting' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
            <div className="text-center space-y-4 text-white">
              <Activity className="w-16 h-16 animate-pulse mx-auto" />
              <p className="text-xl font-semibold">
                {isHostStarting ? "Starting meeting..." : "Joining meeting..."}
              </p>
              <p className="text-sm">Please wait a moment</p>
            </div>
          </div>
        )}
        
        {connectionStatus === 'connected' && (
          <div className="w-full h-full flex items-center justify-center bg-black relative">
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              muted
              controls={false}
              className="w-full h-full object-cover"
              style={{ 
                display: isVideoCameraOff ? 'none' : 'block',
                transform: 'scaleX(-1)' // Mirror effect for front camera
              }}
            />
            {isVideoCameraOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-center">
                  <VideoOff className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Camera is turned off</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={toggleVideo}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Turn On Camera
                  </Button>
                </div>
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
              You
            </div>
          </div>
        )}
        
        {connectionStatus === 'disconnected' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center space-y-4">
              <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto" />
              <p className="text-xl font-semibold text-gray-900">Connecting to meeting...</p>
              <p className="text-sm text-gray-600">Setting up your AI-powered experience</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Reactions overlay */}
      {Object.entries(reactions).map(([key, emoji]) => (
        <div
          key={key}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-6xl animate-bounce pointer-events-none z-20"
          style={{
            animationDuration: '1s',
            animationIterationCount: '3'
          }}
        >
          {emoji}
        </div>
      ))}
    </Card>
  );
};