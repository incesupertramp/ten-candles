/**
 * Ten Candles — Effetti sonori procedurali (Web Audio, nessun file richiesto).
 * Usa l'AudioContext già sbloccato di Foundry; non lo chiude mai.
 */

function ctx() {
  const g = game.audio ?? {};
  const c = g.music || g.environment || g.interface || null;
  return c && typeof c.createGain === "function" ? c : null;
}

/** Fruscio breve tipo "scivolamento su legno" quando la planchette si muove. */
export function planchetteSlide() {
  const c = ctx();
  if (!c) return;
  try {
    const dur = 0.5;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource();
    src.buffer = buf;
    const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1100; bp.Q.value = 0.6;
    const gain = c.createGain(); gain.gain.value = 0.06;
    src.connect(bp).connect(gain).connect(c.destination);
    src.start();
  } catch (_e) { /* no-op */ }
}

/** Crackle ambientale di candele: piccoli "pop" casuali finché è attivo. */
export class Ambient {
  static #timer = null;
  static #playing = false;

  static start() {
    if (this.#playing) return;
    const c = ctx();
    if (!c) return;
    this.#playing = true;
    const pop = () => {
      if (!this.#playing) return;
      try {
        const len = Math.floor(c.sampleRate * 0.05);
        const buf = c.createBuffer(1, len, c.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.3));
        const src = c.createBufferSource();
        src.buffer = buf;
        const hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 2200;
        const gain = c.createGain(); gain.gain.value = 0.015 + Math.random() * 0.03;
        src.connect(hp).connect(gain).connect(c.destination);
        src.start();
      } catch (_e) { /* no-op */ }
      this.#timer = setTimeout(pop, 220 + Math.random() * 900);
    };
    pop();
  }

  static stop() {
    this.#playing = false;
    if (this.#timer) { clearTimeout(this.#timer); this.#timer = null; }
  }
}
