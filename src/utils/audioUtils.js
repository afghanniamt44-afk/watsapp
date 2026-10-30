// ==========================================================
// WhatsApp Web - Voice Note Audio Engine
// Generates realistic voice note sounds & manages recording
// ==========================================================

// Format seconds into 0:05 format
export function formatAudioTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Generate a realistic audible voice-note audio buffer using Web Audio API
// Synthesizes human-like voice formant pitch & speech rhythm
export function createSyntheticVoiceNoteBlob(durationSeconds = 6) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;

  const sampleRate = 22050;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const ctx = new AudioContext();
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const channelData = buffer.getChannelData(0);

  // Speech fundamental frequencies and harmonics (F0 around 130Hz - 220Hz)
  const speechPitches = [165, 185, 210, 195, 175, 160, 190, 220, 200, 170, 150];
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const pitchIndex = Math.floor((t * 2.5) % speechPitches.length);
    const f0 = speechPitches[pitchIndex];

    // Vocal tract vowel simulation (fundamental + 3 formants)
    const fundamental = Math.sin(2 * Math.PI * f0 * t);
    const formant1 = 0.5 * Math.sin(2 * Math.PI * (f0 * 3.5) * t);
    const formant2 = 0.25 * Math.sin(2 * Math.PI * (f0 * 6.2) * t);
    const noise = (Math.random() * 2 - 1) * 0.04;

    // Amplitude envelope with natural syllable cadence (speech cadence)
    const syllablePulse = Math.max(0, Math.sin(2 * Math.PI * 3.2 * t));
    const smoothEnvelope = Math.pow(syllablePulse, 1.5);

    // Fade in and fade out edges
    const edgeFade = Math.min(1, Math.min(t * 8, (durationSeconds - t) * 8));

    channelData[i] = (fundamental + formant1 + formant2 + noise) * smoothEnvelope * edgeFade * 0.22;
  }

  // Convert AudioBuffer to WAV Blob
  return audioBufferToWavBlob(buffer);
}

// Convert AudioBuffer to standard WAV Blob playable by any <audio> element
function audioBufferToWavBlob(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const channelData = buffer.getChannelData(0);
  const dataLength = channelData.length * bytesPerSample;
  const bufferLength = 44 + dataLength;

  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  // Write WAV Header
  function writeString(offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);

  // Write PCM audio samples
  let offset = 44;
  for (let i = 0; i < channelData.length; i++) {
    let sample = Math.max(-1, Math.min(1, channelData[i]));
    sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    view.setInt16(offset, sample, true);
    offset += 2;
  }

  return new Blob([view], { type: 'audio/wav' });
}
