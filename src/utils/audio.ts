/**
 * Web Audio API synthesizer for satisfying combo game sounds.
 * Fully standalone and works offline without external audio files.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a responsive popping/plop sound with ascending pitch based on combo count.
 */
export function playComboPop(comboCount: number, soundEnabled: boolean) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    
    // Scale pitch: base 320Hz, rises with combo up to a pleasant ceiling ~900Hz
    const pitchOffset = Math.min(comboCount * 9, 580);
    const baseFreq = 340 + pitchOffset;

    // Primary oscillator: quick punchy sine wave
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Frequency envelope: quick drop giving the signature bubble/pop effect
    osc.frequency.setValueAtTime(baseFreq * 1.35, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.12);

    // Amplitude envelope
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);

    // Subtle harmonic overtone for richness
    const harmOsc = ctx.createOscillator();
    const harmGain = ctx.createGain();
    harmOsc.type = 'triangle';
    harmOsc.frequency.setValueAtTime(baseFreq * 2.02, now);
    harmOsc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.08);

    harmGain.gain.setValueAtTime(0.08, now);
    harmGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    harmOsc.connect(harmGain);
    harmGain.connect(ctx.destination);

    harmOsc.start(now);
    harmOsc.stop(now + 0.1);
  } catch {
    // Fail gracefully if audio blocked
  }
}

/**
 * Play an uplifting milestone chime (triad arpeggio) when reaching special streaks
 */
export function playMilestoneSound(comboCount: number, soundEnabled: boolean) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const baseFreq = comboCount >= 50 ? 523.25 : 440; // C5 or A4
    const notes = [1, 1.25, 1.5, 2.0]; // Major triad + octave

    notes.forEach((ratio, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + index * 0.055;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * ratio, startTime);

      gain.gain.setValueAtTime(0.01, startTime);
      gain.gain.linearRampToValueAtTime(0.22, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  } catch {
    // Ignore
  }
}

/**
 * Play a soft swoosh / reset sound
 */
export function playResetSound(soundEnabled: boolean) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.16);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  } catch {
    // Ignore
  }
}
