/**
 * TechEngage - Web Audio API Synthesizer
 * Generates procedural UI sound effects without external audio assets.
 */

window.SoundEffects = (function () {
  let audioCtx = null;
  let muted = false;

  function initCtx() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, type, duration, startVol = 0.1, endVol = 0.001) {
    if (muted) return;
    try {
      initCtx();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(startVol, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(endVol, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio playback error:", e);
    }
  }

  return {
    toggleMute: function (isMuted) {
      muted = isMuted;
      return muted;
    },

    isMuted: function () {
      return muted;
    },

    click: function () {
      playTone(600, 'sine', 0.05, 0.05);
    },

    select: function () {
      playTone(440, 'triangle', 0.08, 0.08);
    },

    correct: function () {
      if (muted) return;
      initCtx();
      if (!audioCtx) return;

      // Play pleasant major third chord arpeggio (C5 -> E5 -> G5)
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          playTone(freq, 'sine', 0.2, 0.12);
        }, idx * 70);
      });
    },

    wrong: function () {
      if (muted) return;
      initCtx();
      if (!audioCtx) return;

      // Low buzz frequency transition
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(140, audioCtx.currentTime + 0.25);

        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } catch (e) {}
    },

    tick: function () {
      playTone(800, 'sine', 0.03, 0.02);
    },

    fanfare: function () {
      if (muted) return;
      initCtx();
      if (!audioCtx) return;

      // Triumph arpeggio C5 -> G5 -> C6 -> E6
      const fanfareNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      fanfareNotes.forEach((freq, idx) => {
        setTimeout(() => {
          playTone(freq, 'triangle', 0.35, 0.15);
        }, idx * 100);
      });
    }
  };
})();
