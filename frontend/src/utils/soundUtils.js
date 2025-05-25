/**
 * Utility for managing and playing sounds with browser compatibility
 */

// Initialize audio context on first user interaction
let audioContext = null;

// Create audio context on demand
const getAudioContext = () => {
  if (!audioContext) {
    try {
      // For newer browsers
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContext();
    } catch (e) {
      console.error('Web Audio API is not supported in this browser');
    }
  }
  return audioContext;
};

// Preload sound
export const preloadSound = (url) => {
  const audio = new Audio();
  audio.src = url;
  return audio;
};

// Play sound with fallback options
export const playSound = async (audioElement) => {
  try {
    // Try the simple way first
    const playPromise = audioElement.play();
    
    if (playPromise !== undefined) {
      try {
        await playPromise;
      } catch (err) {
        console.warn('Audio playback was prevented by the browser, trying Web Audio API');
        
        // If auto-play is prevented, try using Web Audio API on user interaction
        const context = getAudioContext();
        if (context && context.state === 'suspended') {
          await context.resume();
        }
      }
    }
  } catch (err) {
    console.error('Failed to play audio:', err);
  }
};

export default {
  preloadSound,
  playSound,
  getAudioContext
};
