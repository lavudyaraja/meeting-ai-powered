// Audio diagnostics script
console.log('=== Audio Diagnostics ===');

// Check browser audio capabilities
console.log('1. Checking Audio Context support...');
const hasAudioContext = typeof AudioContext !== 'undefined' || typeof window.webkitAudioContext !== 'undefined';
console.log('Audio Context support:', hasAudioContext ? '✓' : '✗');

// Check media devices API
console.log('\n2. Checking Media Devices API...');
const hasMediaDevices = typeof navigator.mediaDevices !== 'undefined';
console.log('Media Devices API:', hasMediaDevices ? '✓' : '✗');

if (hasMediaDevices) {
  console.log('Media Devices API methods:');
  console.log('- getUserMedia:', typeof navigator.mediaDevices.getUserMedia !== 'undefined' ? '✓' : '✗');
  console.log('- enumerateDevices:', typeof navigator.mediaDevices.enumerateDevices !== 'undefined' ? '✓' : '✗');
}

// Try to get audio devices
async function checkAudioDevices() {
  console.log('\n3. Checking Audio Devices...');
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      const audioOutputs = devices.filter(device => device.kind === 'audiooutput');
      
      console.log(`Found ${audioInputs.length} audio input devices:`);
      audioInputs.forEach((device, index) => {
        console.log(`  ${index + 1}. ${device.label || `Microphone ${index + 1}`} (${device.deviceId})`);
      });
      
      console.log(`Found ${audioOutputs.length} audio output devices:`);
      audioOutputs.forEach((device, index) => {
        console.log(`  ${index + 1}. ${device.label || `Speaker ${index + 1}`} (${device.deviceId})`);
      });
      
      return { inputs: audioInputs, outputs: audioOutputs };
    }
  } catch (error) {
    console.error('Error enumerating devices:', error);
  }
  
  return { inputs: [], outputs: [] };
}

// Try to access microphone
async function testMicrophoneAccess() {
  console.log('\n4. Testing Microphone Access...');
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('✓ Microphone access granted');
      
      // Check audio tracks
      const audioTracks = stream.getAudioTracks();
      console.log(`Found ${audioTracks.length} audio tracks:`);
      audioTracks.forEach((track, index) => {
        console.log(`  ${index + 1}. ${track.label} (enabled: ${track.enabled})`);
      });
      
      // Test audio level monitoring
      if (hasAudioContext) {
        console.log('\n5. Testing Audio Level Monitoring...');
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          const audioContext = new AudioContext();
          const analyser = audioContext.createAnalyser();
          const microphone = audioContext.createMediaStreamSource(stream);
          
          microphone.connect(analyser);
          analyser.fftSize = 256;
          
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          
          // Get a few samples
          for (let i = 0; i < 5; i++) {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
            console.log(`  Sample ${i + 1}: Average audio level = ${average.toFixed(2)}`);
            await new Promise(resolve => setTimeout(resolve, 200));
          }
          
          console.log('✓ Audio level monitoring working');
          
          // Clean up
          microphone.disconnect();
          if (audioContext.state !== 'closed') {
            audioContext.close();
          }
        } catch (error) {
          console.error('Error with audio level monitoring:', error);
        }
      }
      
      // Stop tracks to release microphone
      stream.getTracks().forEach(track => track.stop());
      console.log('✓ Microphone released');
      
      return true;
    } else {
      console.log('✗ MediaDevices API not available');
      return false;
    }
  } catch (error) {
    console.error('✗ Microphone access failed:', error.message);
    return false;
  }
}

// Run diagnostics
async function runDiagnostics() {
  console.log('Starting audio diagnostics...\n');
  
  // Check capabilities
  const devices = await checkAudioDevices();
  const micAccess = await testMicrophoneAccess();
  
  console.log('\n=== Diagnostics Summary ===');
  console.log('Audio Context Support:', hasAudioContext ? '✓' : '✗');
  console.log('Media Devices API:', hasMediaDevices ? '✓' : '✗');
  console.log('Audio Input Devices:', devices.inputs.length > 0 ? '✓' : '⚠');
  console.log('Audio Output Devices:', devices.outputs.length > 0 ? '✓' : '⚠');
  console.log('Microphone Access:', micAccess ? '✓' : '✗');
  
  if (!micAccess) {
    console.log('\n⚠ Common solutions for microphone issues:');
    console.log('  1. Check browser permissions for microphone access');
    console.log('  2. Ensure no other applications are using the microphone');
    console.log('  3. Try refreshing the page and allow microphone access when prompted');
    console.log('  4. Check if you are using HTTPS (required for microphone access in most browsers)');
  }
}

// Run the diagnostics
runDiagnostics().catch(error => {
  console.error('Diagnostics failed:', error);
});