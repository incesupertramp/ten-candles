/**
 * Ten Candles — Effetto "vecchio mangianastri" per le registrazioni finali.
 *
 * L'utente carica un file audio pulito (mp3/ogg/wav): la distorsione lo-fi è
 * applicata QUI, in tempo reale, con la Web Audio API. La riproduzione è
 * trasmessa via socket così ogni client la elabora localmente (audio uguale
 * per tutti) usando il proprio AudioContext già sbloccato da Foundry.
 *
 * Catena: banda ridotta (highpass + lowpass) → boost medi "scatolato" →
 * saturazione (waveshaper) → wow/flutter (LFO sul detune) → fruscio del nastro.
 */

import { SYSTEM_ID } from "../config.mjs";

const SOCKET = `system.${SYSTEM_ID}`;

export class TapeAudio {
  /** Registra il listener socket (chiamare in `ready`). */
  static register() {
    game.socket.on(SOCKET, (payload) => {
      if (payload?.audio === "recording" && payload.src) {
        this.play(payload.src);
      }
    });
  }

  /** Trasmette a tutti + riproduce localmente. Risolve a fine riproduzione locale. */
  static broadcastAndPlay(src) {
    try { game.socket.emit(SOCKET, { audio: "recording", src }); }
    catch (_e) { /* offline: si sente solo in locale */ }
    return this.play(src);
  }

  /** AudioContext sbloccato di Foundry (o fallback). */
  static #ctx() {
    const g = game.audio ?? {};
    const c = g.music || g.environment || g.interface || g.ctx || null;
    if (c && typeof c.createGain === "function") return c;
    this._fallback ??= new (window.AudioContext || window.webkitAudioContext)();
    return this._fallback;
  }

  /** Curva di distorsione (saturazione morbida) per il waveshaper. */
  static #distortionCurve(amount = 24) {
    const n = 44100, curve = new Float32Array(n), deg = Math.PI / 180;
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }

  /** Buffer di rumore bianco (fruscio del nastro), loopabile. */
  static #noiseBuffer(ctx, seconds = 2) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  /**
   * Riproduce `src` con l'effetto mangianastri. Ritorna una Promise che si
   * risolve alla fine (per la riproduzione in sequenza).
   */
  static async play(src) {
    let ctx;
    try {
      // Rispetta l'impostazione: se l'effetto è disattivato, riproduzione pulita.
      let on = true, intensity = 1;
      try {
        on = game.settings.get(SYSTEM_ID, "tapeEffect");
        intensity = Number(game.settings.get(SYSTEM_ID, "tapeIntensity")) || 1;
      } catch (_e) { /* impostazioni non registrate: default */ }
      if (!on) {
        await foundry.audio.AudioHelper.play({ src, volume: 0.9, autoplay: true, loop: false }, false);
        return;
      }
      const k = Math.max(0.3, Math.min(1.6, intensity));

      ctx = this.#ctx();
      if (ctx.state === "suspended") { try { await ctx.resume(); } catch (_e) { /* no-op */ } }

      const resp = await fetch(src);
      const arr = await resp.arrayBuffer();
      const buffer = await ctx.decodeAudioData(arr);

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      // Wow & flutter: due LFO sul detune (lenta oscillazione + tremolio veloce).
      const wow = ctx.createOscillator(); wow.frequency.value = 0.6;
      const wowAmt = ctx.createGain(); wowAmt.gain.value = 14 * k; // cents
      wow.connect(wowAmt).connect(source.detune);
      const flutter = ctx.createOscillator(); flutter.frequency.value = 6.2;
      const flutterAmt = ctx.createGain(); flutterAmt.gain.value = 7 * k;
      flutter.connect(flutterAmt).connect(source.detune);

      // Banda ridotta da mangianastri.
      const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 260;
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3300;
      const mid = ctx.createBiquadFilter(); mid.type = "peaking"; mid.frequency.value = 1400; mid.gain.value = 5 * k; mid.Q.value = 1.1;

      // Saturazione.
      const shaper = ctx.createWaveShaper();
      shaper.curve = this.#distortionCurve(22 * k);
      shaper.oversample = "2x";

      // Uscita, con volume coerente con Foundry.
      const out = ctx.createGain();
      const vol = Number(game.settings?.get?.("core", "globalInterfaceVolume") ?? 1);
      out.gain.value = 0.95 * (isFinite(vol) ? vol : 1);

      // Fruscio del nastro.
      const noise = ctx.createBufferSource();
      noise.buffer = this.#noiseBuffer(ctx, 2);
      noise.loop = true;
      const noiseHp = ctx.createBiquadFilter(); noiseHp.type = "highpass"; noiseHp.frequency.value = 1800;
      const noiseGain = ctx.createGain(); noiseGain.gain.value = 0.02 * k;
      noise.connect(noiseHp).connect(noiseGain).connect(out);

      // Segnale.
      source.connect(hp).connect(lp).connect(mid).connect(shaper).connect(out).connect(ctx.destination);

      wow.start(); flutter.start(); noise.start();
      source.start();

      return await new Promise((resolve) => {
        source.onended = () => {
          try { noise.stop(); wow.stop(); flutter.stop(); } catch (_e) { /* no-op */ }
          resolve();
        };
      });
    } catch (err) {
      console.error("ten-candles | effetto mangianastri non riuscito, riproduzione semplice", err);
      try { await foundry.audio.AudioHelper.play({ src, volume: 0.9, autoplay: true, loop: false }, false); }
      catch (_e2) { /* niente audio */ }
    }
  }
}
