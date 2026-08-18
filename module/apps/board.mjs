/**
 * Ten Candles — Plancia (ApplicationV2 frameless) sopra il canvas.
 *
 * La board copre SOLO l'area centrale (il canvas), lasciando fuori i controlli
 * a sinistra e la sidebar/chat a destra, così l'interfaccia di Foundry resta
 * visibile e cliccabile. La conferma di New game è un controllo DENTRO la board
 * (niente popup che finirebbero coperti dall'overlay).
 */

import { SYSTEM_ID } from "../config.mjs";
import { GameState } from "./game-state.mjs";
import { planchetteSlide, Ambient } from "./sfx.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const RENDER_HOOK = `${SYSTEM_ID}.stateChanged`;

export class TenCandlesBoard extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "ten-candles-board",
    classes: ["ten-candles", "tc-board"],
    window: { frame: false, positioned: false },
    actions: {
      close: this.#onClose,
      darkenCandle: this.#onDarken,
      snuff: this.#onSnuff,
      newGame: this.#onNewGamePrompt,
      newGameConfirm: this.#onNewGameConfirm,
      newGameCancel: this.#onNewGameCancel
    }
  };

  static PARTS = {
    body: { template: "systems/ten-candles/templates/apps/board.hbs" }
  };

  #hookId = null;
  #chatHookId = null;
  #confirming = false;
  #floatClose = null;
  #planchettePos = null;
  #prevLitMap = null;

  /** @override */
  _onRender(context, options) {
    super._onRender?.(context, options);
    this.#placeUnderUI();
    this.#ensureFloatingClose();
    this.#attachWebcams();
    this.#animatePlanchette(context);
    this.#animateSnuff(context);
    if (this.#hookId === null) {
      this.#hookId = Hooks.on(RENDER_HOOK, () => this.render(false));
    }
    if (this.#chatHookId === null) {
      this.#chatHookId = Hooks.on("createChatMessage", (msg) => this.#onChatNarration(msg));
    }
    // Audio ambientale (crackle), se abilitato.
    try { if (game.settings.get(SYSTEM_ID, "ambient")) Ambient.start(); } catch (_e) { /* no-op */ }
  }

  /** Quando il GM narra in chat, lo "spirito" si ravviva (bagliore) sulla plancia. */
  #onChatNarration(msg) {
    try {
      const author = msg.author ?? msg.user;
      if (!author?.isGM) return;
      if (msg.isRoll || (msg.rolls?.length)) return;
      if (msg.whisper?.length) return;
      // Ignora gli annunci del sistema (alias = nome sistema).
      const sysName = game.i18n.localize("TENCANDLES.SystemName");
      if (msg.speaker?.alias === sysName) return;
      this.#stirPlanchette();
    } catch (_e) { /* no-op */ }
  }

  /** Bagliore dello spirito (aura che si intensifica per un istante). */
  #stirPlanchette() {
    if (!this.#animationsOn()) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
    const glow = this.element?.querySelector(".tc-spirit-glow");
    if (!glow) return;
    try {
      glow.animate([{ opacity: 0.5 }, { opacity: 1 }, { opacity: 0.5 }], { duration: 1100, easing: "ease-in-out" });
    } catch (_e) { /* no-op */ }
  }

  /**
   * Quando una candela specifica passa da accesa a spenta, anima su quella
   * candela la fiamma che sfuma + uno sbuffo di fumo.
   */
  #animateSnuff(context) {
    const svg = this.element?.querySelector(".tc-board-svg");
    const cands = context?.candles;
    if (!svg || !Array.isArray(cands)) return;
    const prev = this.#prevLitMap;
    const cur = {};
    for (const c of cands) cur[c.index] = c.lit;
    this.#prevLitMap = cur;
    if (!prev) return;
    if (!this.#animationsOn()) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;

    const ns = "http://www.w3.org/2000/svg";
    for (const c of cands) {
      if (prev[c.index] !== true || c.lit !== false) continue;
      const x = c.x, y = c.y;
      try {
        const flame = document.createElementNS(ns, "circle");
        flame.setAttribute("cx", x.toFixed(1));
        flame.setAttribute("cy", (y - 21).toFixed(1));
        flame.setAttribute("r", "7.5");
        flame.setAttribute("fill", "url(#tcFlame)");
        flame.style.pointerEvents = "none";
        svg.appendChild(flame);
        flame.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 520, easing: "ease-in" })
          .onfinish = () => flame.remove();

        const smoke = document.createElementNS(ns, "path");
        smoke.setAttribute("d", `M${x.toFixed(1)},${(y - 22).toFixed(1)} q6,-9 0,-20 q-6,-11 0,-22`);
        smoke.setAttribute("fill", "none");
        smoke.setAttribute("stroke", "#cdbfa0");
        smoke.setAttribute("stroke-width", "1.4");
        smoke.style.pointerEvents = "none";
        svg.appendChild(smoke);
        smoke.animate(
          [{ opacity: 0.55, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(-18px)" }],
          { duration: 1500, easing: "ease-out" }
        ).onfinish = () => smoke.remove();
      } catch (_e) { /* animazione non supportata */ }
    }
  }

  /**
   * Fa "scivolare" la planchette dalla posizione precedente a quella nuova quando
   * cambia lettera (cioè quando il master agisce: spegne candele / cambia scena),
   * con una scia luminosa che sfuma dietro. Rispetta prefers-reduced-motion.
   */
  #animatePlanchette(context) {
    const el = this.element?.querySelector(".tc-planchette");
    const cur = context?.planchette;
    if (!el || !cur) return;
    const prev = this.#planchettePos;
    this.#planchettePos = { x: cur.x, y: cur.y };
    if (!prev || (prev.x === cur.x && prev.y === cur.y)) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
    if (!this.#animationsOn()) return;

    const dur = 1100, ease = "cubic-bezier(.5,0,.2,1)";
    try { if (game.settings.get(SYSTEM_ID, "planchetteSound")) planchetteSlide(); } catch (_e) { /* no-op */ }
    // Scivolamento dell'elemento dalla vecchia alla nuova posizione.
    try {
      el.animate(
        [
          { transform: `translate(${prev.x}px, ${prev.y}px)` },
          { transform: `translate(${cur.x}px, ${cur.y}px)` }
        ],
        { duration: dur, easing: ease }
      );
    } catch (_e) { /* animazione non supportata: la planchette resta alla nuova posizione */ }

    // Scia luminosa che segue e sfuma.
    try {
      const ns = "http://www.w3.org/2000/svg";
      const trail = document.createElementNS(ns, "ellipse");
      trail.setAttribute("cx", "0");
      trail.setAttribute("cy", "-8");
      trail.setAttribute("rx", "30");
      trail.setAttribute("ry", "32");
      trail.setAttribute("fill", "url(#tcGlow)");
      trail.setAttribute("transform", `translate(${prev.x}, ${prev.y})`);
      trail.style.pointerEvents = "none";
      el.parentNode.insertBefore(trail, el);
      const anim = trail.animate(
        [
          { transform: `translate(${prev.x}px, ${prev.y}px)`, opacity: 0.5 },
          { transform: `translate(${cur.x}px, ${cur.y}px)`, opacity: 0 }
        ],
        { duration: dur + 200, easing: "ease-out" }
      );
      const cleanup = () => trail.remove();
      anim.onfinish = cleanup;
      anim.oncancel = cleanup;
    } catch (_e) { /* scia non disponibile */ }
  }

  /**
   * Colloca la board a tutto schermo ma SOTTO l'interfaccia di Foundry: sopra il
   * canvas, sotto toolbar/sidebar/chat/hotbar (che restano cliccabili sopra).
   * Legge lo z-index reale di #interface a runtime, così non si tira a indovinare.
   */
  #placeUnderUI() {
    const el = this.element;
    if (!el) return;
    el.classList.add("ten-candles", "tc-board");

    const base = { position: "fixed", inset: "0", width: "auto", height: "auto", margin: "0" };
    const iface = document.getElementById("interface");

    if (iface && iface.parentElement) {
      // Board come fratello subito PRIMA dell'interfaccia (sotto di essa).
      if (el.nextElementSibling !== iface) iface.before(el);

      const ifaceZ = parseInt(getComputedStyle(iface).zIndex, 10);
      const canvasEl = document.getElementById("board");
      const canvasZ = canvasEl ? parseInt(getComputedStyle(canvasEl).zIndex, 10) : NaN;
      const cz = Number.isFinite(canvasZ) ? canvasZ : 0;

      // Un gradino sotto la UI, ma comunque sopra il canvas.
      let z = Number.isFinite(ifaceZ) ? ifaceZ - 1 : cz + 1;
      if (z <= cz) z = cz + 1;

      Object.assign(el.style, base, { zIndex: String(z) });
    } else {
      // Fallback: sopra tutto (garantito visibile).
      if (el.parentElement !== document.body) document.body.appendChild(el);
      Object.assign(el.style, base, { zIndex: "9999" });
    }
  }

  /** Pulsante ✕ galleggiante sopra la UI (la ✕ interna finirebbe sotto le toolbar). */
  #ensureFloatingClose() {
    if (this.#floatClose) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tc-board-float-close";
    btn.title = game.i18n.localize("Close");
    btn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    btn.addEventListener("click", () => this.close());
    document.body.appendChild(btn);
    this.#floatClose = btn;
  }

  /** Aggancia i flussi webcam di Foundry negli slot volto (best-effort). */
  #attachWebcams() {
    const root = this.element;
    if (!root) return;
    root.querySelectorAll("video[data-tc-cam]").forEach((v) => {
      const uid = v.dataset.tcCam;
      const stream = TenCandlesBoard.findUserStream(uid);
      if (stream) {
        if (v.srcObject !== stream) v.srcObject = stream;
        v.style.display = "block";
        v.play?.().catch(() => {});
      } else {
        v.style.display = "none";
      }
    });
  }

  /** Cerca il MediaStream di un utente riusando il video A/V di Foundry. */
  static findUserStream(userId) {
    if (!userId) return null;
    const selectors = [
      `.camera-view[data-user-id="${userId}"] video`,
      `[data-user-id="${userId}"] video`,
      `[data-user="${userId}"] video`,
      `#camera-views [data-user-id="${userId}"] video`
    ];
    for (const s of selectors) {
      const el = document.querySelector(s);
      if (el && el.srcObject) return el.srcObject;
    }
    // Fallback: API del client A/V (varia per versione).
    try {
      const c = game.webrtc?.client;
      const s = c?.getMediaStreamForUser?.(userId) ?? c?.getLevelsStreamForUser?.(userId);
      if (s) return s;
    } catch (_) {}
    return null;
  }

  /** @override */
  async close(options) {
    if (this.#hookId !== null) { Hooks.off(RENDER_HOOK, this.#hookId); this.#hookId = null; }
    if (this.#chatHookId !== null) { Hooks.off("createChatMessage", this.#chatHookId); this.#chatHookId = null; }
    Ambient.stop();
    if (this.#floatClose) { this.#floatClose.remove(); this.#floatClose = null; }
    return super.close(options);
  }

  /** @override */
  async _prepareContext() {
    const total = CONFIG.TEN_CANDLES.rules.startingCandles;
    const lit = GameState.candlesLit;
    const clip = (s) => (s && s.length > 14 ? s.slice(0, 13) + "…" : (s || ""));

    // Geometria top-down: tutto disposto per angoli attorno al centro del tavolo.
    const cx = 400, cy = 400, DEG = Math.PI / 180;
    const pol = (r, d) => [cx + r * Math.cos(d * DEG), cy + r * Math.sin(d * DEG)];
    const r2 = (v) => +v.toFixed(1);

    // --- Candele in anello sul bordo del tavolo ---
    const litArr = GameState.candles;
    const candles = [];
    for (let i = 0; i < total; i++) {
      const [x, y] = pol(300, -90 + i * 36);
      const isLit = litArr.length ? !!litArr[i] : i < lit;
      candles.push({ x: r2(x), y: r2(y), lit: isLit, index: i, delay: (i * 0.3).toFixed(2) });
    }

    // --- Giocatori (webcam) in cerchio attorno al tavolo, con vuoto in alto ---
    const players = game.users.filter((u) => !u.isGM);
    const n = Math.max(2, Math.min(6, players.length || 2));
    const gap = 80;
    const seats = [];
    for (let i = 0; i < n; i++) {
      const deg = 90 + ((i + 0.5) / n - 0.5) * (360 - gap); // 90 = basso; vuoto in alto
      const [x, y] = pol(362, deg);
      const [lx, ly] = pol(362, deg);
      const p = players[i];
      const pImg = p ? (p.character?.img || p.avatar || "") : "";
      seats.push({
        x: r2(x), y: r2(y), labelX: r2(lx), labelY: r2(ly + 60),
        userId: p ? p.id : "",
        img: (pImg && !pImg.includes("mystery-man")) ? pImg : "",
        label: clip(p ? p.name : ""),
        initial: p ? (p.name?.[0] ?? "").toUpperCase() : ""
      });
    }

    // --- Lettere della tavola ouija (generate su archi) ---
    const mkRow = (str, y, arch, size) => {
      const len = str.length, x0 = 206, x1 = 594, out = [];
      for (let i = 0; i < len; i++) {
        const t = len === 1 ? 0 : i / (len - 1);
        const x = x0 + (x1 - x0) * t;
        const yy = y - arch * Math.sin(Math.PI * t);
        out.push({ ch: str[i], x: r2(x), y: r2(yy + size * 0.34), size });
      }
      return out;
    };
    const row1 = mkRow("ABCDEFGHIJKLM", 356, 28, 29);
    const row2 = mkRow("NOPQRSTUVWXYZ", 418, 22, 29);
    const nums = mkRow("1234567890", 474, 0, 24);

    // --- Planchette-master: punta a una lettera derivata dallo stato ---
    // Si "sposta" quando il master agisce (cambia scena / spegne candele),
    // perché la lettera bersaglio dipende da sceneNumber e candele spente.
    const glyphs = [...row1, ...row2, ...nums];
    const manual = String(GameState.planchetteManual || "").toUpperCase();
    let g;
    if (manual) {
      g = glyphs.find((x) => x.ch === manual);
    }
    if (!g) {
      const gi = glyphs.length ? (GameState.sceneNumber * 3 + (total - lit) * 2) % glyphs.length : 0;
      g = glyphs[gi] || { x: 400, y: 356 };
    }
    const planchette = { x: r2(g.x), y: r2(g.y + 6), rot: r2((g.x - 400) / 34) };

    // Spirito (GM) dentro la planchette.
    const gmUser = game.users.find((u) => u.isGM);
    const gmImg = gmUser ? (gmUser.character?.img || gmUser.avatar || "") : "";
    const spirit = {
      userId: gmUser ? gmUser.id : "",
      img: (gmImg && !gmImg.includes("mystery-man")) ? gmImg : "",
      initial: (gmUser?.name?.[0] ?? "?").toUpperCase()
    };

    // Cerchio rituale: si intensifica al calare delle candele.
    const litFrac = total ? lit / total : 1;
    const ritualOpacity = +(0.28 + (1 - litFrac) * 0.55).toFixed(2);

    return {
      candles, seats, ouija: { row1, row2, nums }, planchette, spirit,
      candlesLit: lit,
      total,
      playerPool: GameState.playerPool,
      gmPool: GameState.gmPool,
      sceneNumber: GameState.sceneNumber,
      isLastStand: GameState.isLastStand,
      isGameOver: GameState.isGameOver,
      isGM: game.user.isGM,
      confirming: this.#confirming,
      ritualOpacity,
      noAnim: !this.#animationsOn()
    };
  }

  /** Impostazione client: animazioni della plancia on/off (default on). */
  #animationsOn() {
    try { return game.settings.get(SYSTEM_ID, "animations"); }
    catch (_e) { return true; }
  }

  /* -------------------------------------------- */
  /*  Actions                                     */
  /* -------------------------------------------- */
  static #onClose() {
    this.close();
  }

  static async #onDarken() {
    if (!game.user.isGM) return;
    await GameState.darkenCandle();
  }

  static async #onSnuff(event, target) {
    const i = Number(target?.dataset?.index);
    if (Number.isInteger(i)) await GameState.snuffCandle(i);
  }

  /** Mostra la conferma in-board (invece di un popup). */
  static #onNewGamePrompt() {
    if (!game.user.isGM) return;
    this.#confirming = true;
    this.render(false);
  }

  static async #onNewGameConfirm() {
    if (!game.user.isGM) return;
    this.#confirming = false;
    await GameState.newGame();
    this.render(false);
  }

  static #onNewGameCancel() {
    this.#confirming = false;
    this.render(false);
  }
}
