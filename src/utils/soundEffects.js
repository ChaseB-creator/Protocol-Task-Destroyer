// Web Audio API Procedural Sound Synthesizer
// Zero external audio files required - works 100% offline and cross-platform

let audioCtx = null;
let soundMuted = false;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const isSoundMuted = () => soundMuted;

export const toggleSoundMute = () => {
  soundMuted = !soundMuted;
  localStorage.setItem('protocol_task_destroyer_sound_muted', soundMuted ? 'true' : 'false');
  return soundMuted;
};

export const initSoundPreference = () => {
  const saved = localStorage.getItem('protocol_task_destroyer_sound_muted') ?? localStorage.getItem('teensy_task_sound_muted');
  if (saved !== null) {
    soundMuted = saved === 'true';
  }
  return soundMuted;
};

// Joyful victory fanfare when a task is moved to "Complete"
export function playConfettiFanfare() {
  if (soundMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Chime frequencies: C5, E5, G5, B5, C6 (Major 7th / Bright triumphant resolution)
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
    
    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      // Volume envelope
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.6);
    });

    // Add a golden sub-bass sparkle
    const sparkleOsc = ctx.createOscillator();
    const sparkleGain = ctx.createGain();
    sparkleOsc.type = 'sine';
    sparkleOsc.frequency.setValueAtTime(261.63, now);
    sparkleOsc.frequency.exponentialRampToValueAtTime(523.25, now + 0.4);
    sparkleGain.gain.setValueAtTime(0.15, now);
    sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    sparkleOsc.connect(sparkleGain);
    sparkleGain.connect(ctx.destination);
    sparkleOsc.start(now);
    sparkleOsc.stop(now + 0.5);

  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}

// High-tech spaceship HUD button click
export function playButtonBlip() {
  if (soundMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(1450, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  } catch (e) {
    // silently ignore audio restriction
  }
}

// Tactile card drag/drop spaceship sound
export function playTaskMoveSound() {
  if (soundMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  } catch (e) {
    // ignore
  }
}

// Low futuristic powering down / delete sound
export function playDeleteSound() {
  if (soundMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.22);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  } catch (e) {
    // ignore
  }
}
