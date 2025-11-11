import { supabase } from "@/integrations/supabase/client";

/* ============================================================
   ✅ WEBRTC CONFIGURATION
   ============================================================ */
const configuration: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
  ],
  iceCandidatePoolSize: 10,
  bundlePolicy: 'max-bundle', // Bundle all media over a single port
  rtcpMuxPolicy: 'require',   // Use RTP/RTCP multiplexing
};

/* ============================================================
   ✅ MEDIA CONSTRAINTS (Balanced for quality + stability)
   ============================================================ */
export const getMediaConstraints = (quality: "low" | "medium" | "high" = "high") => {
  // Enhanced audio constraints for better quality
  const baseAudio = {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    channelCount: 1,
    sampleRate: 48000,
    sampleSize: 16, // 16-bit audio for better quality
    latency: 0.01, // Low latency for real-time communication
    googEchoCancellation: true,
    googAutoGainControl: true,
    googNoiseSuppression: true,
    googHighpassFilter: true,
    googTypingNoiseDetection: true,
    googBeamforming: true,
    googArrayGeometry: true,
    googAudioMirroring: false,
  };

  const presets = {
    low: {
      audio: baseAudio,
      video: { width: 640, height: 480, frameRate: 24 },
    },
    medium: {
      audio: baseAudio,
      video: { width: 1280, height: 720, frameRate: 30 },
    },
    high: {
      audio: {
        ...baseAudio,
        sampleRate: 48000,
        channelCount: 2,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: { 
        width: 1920, 
        height: 1080, 
        frameRate: 30,
        facingMode: "user",
        aspectRatio: 1.777777778
      },
    },
  };
  return presets[quality];
};

/* ============================================================
   ✅ GET USER MEDIA (Safe & Permission-friendly)
   ============================================================ */
export const getUserMedia = async (quality: "low" | "medium" | "high" = "high") => {
  try {
    const constraints = getMediaConstraints(quality);
    console.log("🎥 Requesting user media with:", constraints);
    
    // First try to get audio only to ensure permissions
    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: constraints.audio });
    console.log("🎤 Audio stream acquired");
    
    // Then get full stream with both audio and video
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    if (stream.getAudioTracks().length === 0)
      console.warn("⚠️ No audio track found — check mic permissions!");
    if (stream.getVideoTracks().length === 0)
      console.warn("⚠️ No video track found — check camera permissions!");

    // Ensure all tracks are enabled by default
    stream.getTracks().forEach(track => {
      track.enabled = true;
      console.log(`Enabled ${track.kind} track: ${track.id}`);
    });

    return stream;
  } catch (error) {
    console.error("❌ Error accessing media devices:", error);
    throw error;
  }
};

/* ============================================================
   ✅ CREATE PEER CONNECTION
   ============================================================ */
export const createPeerConnection = (localStream: MediaStream | null) => {
  const pc = new RTCPeerConnection(configuration);

  // Add local media tracks
  if (localStream) {
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
      track.enabled = true; // Ensure both audio/video are active
      console.log(`Added track to peer connection: ${track.kind} - ${track.id}, enabled: ${track.enabled}`);
    });
  }

  // Add transceivers for both audio and video to ensure proper negotiation
  pc.addTransceiver('audio', { direction: 'sendrecv' });
  pc.addTransceiver('video', { direction: 'sendrecv' });

  // Handle track events
  pc.ontrack = (event) => {
    console.log("Track event received:", event.track.kind, event.track.id);
    // This will be handled by the handleTrackEvent function in useVideoConference
  };

  pc.onconnectionstatechange = () => {
    console.log("🔗 Connection state:", pc.connectionState);
  };
  pc.oniceconnectionstatechange = () => {
    console.log("❄️ ICE connection state:", pc.iceConnectionState);
  };

  return pc;
};

/* ============================================================
   ✅ OFFER / ANSWER CREATION
   ============================================================ */
export const createOffer = async (pc: RTCPeerConnection) => {
  // Ensure transceivers are set up correctly
  const audioTransceiver = pc.getTransceivers().find(t => t.sender.track?.kind === 'audio');
  const videoTransceiver = pc.getTransceivers().find(t => t.sender.track?.kind === 'video');
  
  if (audioTransceiver) {
    audioTransceiver.direction = 'sendrecv';
  }
  if (videoTransceiver) {
    videoTransceiver.direction = 'sendrecv';
  }

  const offer = await pc.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  });
  
  // Add proper audio codecs to SDP
  if (offer.sdp) {
    offer.sdp = offer.sdp.replace(
      'useinbandfec=1',
      'useinbandfec=1; stereo=1; maxaveragebitrate=510000'
    );
  }
  
  await pc.setLocalDescription(offer);
  return offer;
};

export const createAnswer = async (pc: RTCPeerConnection, offer: RTCSessionDescriptionInit) => {
  // Ensure transceivers are set up correctly
  const audioTransceiver = pc.getTransceivers().find(t => t.sender.track?.kind === 'audio');
  const videoTransceiver = pc.getTransceivers().find(t => t.sender.track?.kind === 'video');
  
  if (audioTransceiver) {
    audioTransceiver.direction = 'sendrecv';
  }
  if (videoTransceiver) {
    videoTransceiver.direction = 'sendrecv';
  }
  
  await pc.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await pc.createAnswer();
  
  // Add proper audio codecs to SDP
  if (answer.sdp) {
    answer.sdp = answer.sdp.replace(
      'useinbandfec=1',
      'useinbandfec=1; stereo=1; maxaveragebitrate=510000'
    );
  }
  
  await pc.setLocalDescription(answer);
  return answer;
};

/* ============================================================
   ✅ HANDLE ICE CANDIDATES
   ============================================================ */
export const handleIceCandidate = async (pc: RTCPeerConnection, candidate: RTCIceCandidate) => {
  try {
    if (pc.remoteDescription) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } else {
      console.warn("🕓 Remote description not set, delaying ICE candidate.");
    }
  } catch (error) {
    console.error("❌ Error adding ICE candidate:", error);
  }
};

/* ============================================================
   ✅ HANDLE REMOTE TRACKS (Audio Fix Included)
   ============================================================ */
export const handleTrackEvent = (
  pc: RTCPeerConnection,
  onTrack: (event: RTCTrackEvent) => void
) => {
  pc.ontrack = (event) => {
    const stream = event.streams[0];
    console.log("📡 Received remote track:", event.track.kind, event.track.id);

    // 🔊 Auto-play remote audio safely
    if (event.track.kind === "audio" && stream) {
      const audioEl = document.createElement("audio");
      audioEl.srcObject = stream;
      audioEl.autoplay = true;
      audioEl.controls = false;
      audioEl.muted = false;
      audioEl.volume = 1.0;
      document.body.appendChild(audioEl);
      
      console.log("🔊 Created audio element for remote track:", event.track.id);

      // Handle autoplay restrictions
      const tryPlay = async () => {
        try {
          await audioEl.play();
          console.log("✅ Remote audio playback started for track:", event.track.id);
        } catch (e) {
          console.warn("⚠️ Autoplay blocked. Waiting for user interaction...", e);
          const unlockAudio = async () => {
            try {
              await audioEl.play();
              console.log("✅ Audio playback started after user click for track:", event.track.id);
              document.removeEventListener("click", unlockAudio);
            } catch (err) {
              console.error("❌ Audio still blocked:", err);
            }
          };
          document.addEventListener("click", unlockAudio, { once: true });
        }
      };
      tryPlay();
    }

    onTrack(event);
  };
};

/* ============================================================
   ✅ SIGNALING HELPERS (Supabase)
   ============================================================ */
export const sendSignalingData = async (
  meetingId: string,
  targetUserId: string,
  data: any,
  currentUserId: string,
  currentUserName: string
) => {
  try {
    const { error } = await supabase.from("meeting_messages").insert({
      meeting_id: meetingId,
      user_id: currentUserId,
      user_name: currentUserName,
      message: JSON.stringify({
        type: "signal",
        target: targetUserId,
        data,
        from: currentUserId,
        timestamp: Date.now(),
      }),
      timestamp: new Date().toISOString(),
    });
    if (error) throw error;
  } catch (error) {
    console.error("❌ Error sending signaling data:", error);
  }
};

export const listenForSignalingData = (
  meetingId: string,
  userId: string,
  callback: (data: any, from: string) => void
) => {
  const channel = supabase
    .channel(`signaling-${meetingId}-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "meeting_messages",
        filter: `meeting_id=eq.${meetingId}`,
      },
      (payload) => {
        try {
          const msg = JSON.parse(payload.new.message);
          if (msg.type === "signal" && msg.target === userId) {
            callback(msg.data, msg.from);
          }
        } catch {
          /* ignore non-signal messages */
        }
      }
    )
    .subscribe();
  return channel;
};

/* ============================================================
   ✅ EXTRA AUDIO FIXES
   ============================================================ */
export const ensureAudioUnlocked = () => {
  // Helps unlock playback on first user click
  const resumeAudioContext = async () => {
    try {
      if (typeof window !== 'undefined') {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          if (ctx.state === "suspended") {
            await ctx.resume();
            console.log("🎧 Audio context resumed on click/touch");
          }
        }
      }
    } catch (err) {
      console.warn("⚠️ Audio context unlock failed:", err);
    }
  };

  ["click", "touchstart", "keydown"].forEach((ev) =>
    document.addEventListener(ev, resumeAudioContext, { once: true })
  );
};
