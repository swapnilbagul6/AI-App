/**
 * Decodes a base64 string into a Uint8Array.
 */
const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

/**
 * Decodes base64 string directly to Float32Array for AudioBuffer.
 * Assumes 16-bit PCM input.
 */
export const base64ToFloat32 = (base64: string): Float32Array => {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for(let i=0; i<int16.length; i++) {
    float32[i] = int16[i] / 32768.0;
  }
  return float32;
};

/**
 * Wraps raw PCM data in a WAV container.
 * Assumes 16-bit mono PCM at 24kHz (Gemini standard).
 * Accepts either a single base64 string or an array of base64 chunks.
 */
export const pcmToWavBlob = (base64Pcm: string | string[], sampleRate: number = 24000): Blob => {
  let pcmData: Uint8Array;

  if (Array.isArray(base64Pcm)) {
    // Calculate total length
    const buffers = base64Pcm.map(chunk => base64ToUint8Array(chunk));
    const totalLength = buffers.reduce((acc, b) => acc + b.length, 0);
    pcmData = new Uint8Array(totalLength);
    
    // Concatenate
    let offset = 0;
    for (const b of buffers) {
      pcmData.set(b, offset);
      offset += b.length;
    }
  } else {
    pcmData = base64ToUint8Array(base64Pcm);
  }
  
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmData.length;
  const fileSize = 36 + dataSize;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, fileSize, true);
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, byteRate, true); // ByteRate
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, bitsPerSample, true); // BitsPerSample

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Write PCM data
  const pcmBytes = new Uint8Array(buffer, 44);
  pcmBytes.set(pcmData);

  return new Blob([buffer], { type: 'audio/wav' });
};

const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};