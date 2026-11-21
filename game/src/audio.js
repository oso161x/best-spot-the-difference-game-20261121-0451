// Tiny synth sounds through WebAudio: no audio files, just short oscillator blips.
// Audio starts on the first user gesture, so it never blocks the game loading.
export function createAudio() {
  let context = null;
  let muted = false;

  function ensure() {
    if (!context) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
      } catch {
        context = null;
      }
    }
    if (context && context.state === 'suspended') context.resume();
    return context;
  }

  function tone(freq, dur, type, vol, when) {
    const ac = ensure();
    if (!ac || muted) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol || 0.12, ac.currentTime + (when || 0));
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + (when || 0) + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime + (when || 0));
    osc.stop(ac.currentTime + (when || 0) + dur + 0.02);
  }

  return {
    unlock() { ensure(); },
    toggleMute() { muted = !muted; return muted; },
    found() { tone(660, 0.12, 'sine', 0.14); tone(880, 0.18, 'sine', 0.14, 0.09); },
    wrong() { tone(160, 0.22, 'sawtooth', 0.08); },
    hint() { tone(520, 0.1, 'triangle', 0.1); tone(780, 0.14, 'triangle', 0.1, 0.08); },
    win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'sine', 0.14, i * 0.11)); },
    over() { [392, 330, 262].forEach((f, i) => tone(f, 0.25, 'triangle', 0.12, i * 0.14)); },
    click() { tone(440, 0.06, 'sine', 0.08); },
  };
}
