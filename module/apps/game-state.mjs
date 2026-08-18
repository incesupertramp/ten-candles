/**
 * Ten Candles — Stato di gioco condiviso (candele + dice pool).
 *
 * Lo stato NON è per-personaggio: è unico e comune al tavolo. In Foundry lo
 * strumento giusto è un world setting (sincronizzato a tutti i client).
 *
 * ─── ARCHITETTURA: GM-autoritativo, player-relay ────────────────────────────
 * Solo un client GM può SCRIVERE un world setting. Quindi:
 *   - Se chi chiama è GM  → esegue direttamente la mutazione (scrive il setting).
 *   - Se chi chiama è player → invia un comando via socket; lo esegue il GM
 *     "attivo" (game.users.activeGM), unico responsabile della scrittura.
 * In questo modo c'è UN solo scrittore autorevole: niente race, niente doppie
 * esecuzioni. La lettura è libera per tutti (il setting è replicato ovunque).
 *
 * Le regole (10 candele, refill = candele accese, GM pool = 10 − accese)
 * arrivano da CONFIG.TEN_CANDLES.rules (Comp. 2).
 */

import { SYSTEM_ID } from "../config.mjs";

const SETTING_KEY = "gameState";
const SOCKET = `system.${SYSTEM_ID}`;
const RENDER_HOOK = `${SYSTEM_ID}.stateChanged`;

export class GameState {
  /* -------------------------------------------- */
  /*  Registrazione (chiamate da init/ready)      */
  /* -------------------------------------------- */

  /** Registra il world setting che contiene lo stato. Chiamare in `init`. */
  static registerSettings() {
    const r = CONFIG.TEN_CANDLES.rules;
    game.settings.register(SYSTEM_ID, SETTING_KEY, {
      scope: "world",
      config: false, // gestito dal nostro tracker, non dal menu impostazioni
      type: Object,
      default: {
        candles: Array(r.startingCandles).fill(true),
        playerPool: r.startingPlayerPool,
        gmPool: r.startingGmPool,
        sceneNumber: 1,
        truthsPhase: false,
        truthsTarget: 0,
        truths: [],
        creation: { active: false, step: "idle", themBrink: "" },
        planchetteManual: "",
        turnActorId: "",
        moduleText: "",
        linesVeils: "",
        truthsLog: [],
        xcard: 0
      },
      // onChange scatta su TUTTI i client → notifica la UI di ridisegnarsi.
      onChange: () => Hooks.callAll(RENDER_HOOK)
    });
  }

  /** Registra il listener socket. Chiamare in `ready`. */
  static registerSocket() {
    game.socket.on(SOCKET, (payload) => this.#onSocket(payload));
  }

  /* -------------------------------------------- */
  /*  Lettura stato (libera per tutti)            */
  /* -------------------------------------------- */

  static get data() {
    return game.settings.get(SYSTEM_ID, SETTING_KEY);
  }
  static get candles() { return this.data.candles ?? []; }
  static get candlesLit() { return (this.data.candles ?? []).filter(Boolean).length; }
  static get playerPool() { return this.data.playerPool; }
  static get gmPool() { return this.data.gmPool; }
  static get sceneNumber() { return this.data.sceneNumber; }

  /** The Last Stand: inizia quando resta accesa una sola candela. */
  static get isLastStand() { return this.candlesLit === 1; }
  /** Partita finita: nessuna candela accesa. */
  static get isGameOver() { return this.candlesLit === 0; }

  /** Verità: fase di stabilimento in corso, obiettivo e lista raccolta. */
  static get truthsPhase() { return this.data.truthsPhase ?? false; }
  static get truthsTarget() { return this.data.truthsTarget ?? 0; }
  static get truths() { return this.data.truths ?? []; }

  /** Creazione collaborativa: fase attiva e passo corrente. */
  static get creationActive() { return this.data.creation?.active ?? false; }
  static get creationStep() { return this.data.creation?.step ?? "idle"; }
  static get creationThemBrink() { return this.data.creation?.themBrink ?? ""; }

  /** Lettera su cui il GM sta puntando manualmente la planchette ("" = automatico). */
  static get planchetteManual() { return this.data.planchetteManual ?? ""; }

  /** Personaggio a cui il GM ha assegnato il turno corrente ("" = nessuno). */
  static get turnActorId() { return this.data.turnActorId ?? ""; }

  /** Testo di scenario ("Module") e apertura, scritto dal GM. */
  static get moduleText() { return this.data.moduleText ?? ""; }
  /** Lines & Veils condivisi (safety, Session Zero). */
  static get linesVeils() { return this.data.linesVeils ?? ""; }
  /** Registro persistente delle Verità stabilite in tutta la partita. */
  static get truthsLog() { return this.data.truthsLog ?? []; }
  /** Contatore X-Card (aumenta a ogni invocazione; il valore serve solo a notificare). */
  static get xcard() { return this.data.xcard ?? 0; }

  /* -------------------------------------------- */
  /*  API pubblica (chiamabile da chiunque)       */
  /*  Instrada verso il GM autorevole.            */
  /* -------------------------------------------- */

  /** Spegne una candela → fine scena, refill, cambio scena, Truths. */
  static darkenCandle(initiatorId) { return this.#route("darkenCandle", { initiatorId }); }
  /** Spegne una candela specifica (clic sulla plancia). */
  static snuffCandle(index) { return this.#route("darkenCandle", { index }); }

  /** Rimuove n dadi dal pool giocatori (dadi usciti 1, messi da parte). */
  static loseDice(n = 1) { return this.#route("loseDice", { n }); }

  /** Nuova partita: riporta tutto ai valori iniziali. */
  static newGame() { return this.#route("newGame"); }

  /** Override manuale del GM (correzioni al tavolo). patch = campi da settare. */
  static setState(patch) { return this.#route("setState", { patch }); }

  /** Aggiunge una verità alla fase corrente (chiunque durante le Truths). */
  static submitTruth(text) { return this.#route("submitTruth", { text, name: game.user.name }); }

  /** Chiude anticipatamente la fase Verità (GM). */
  static closeTruths() { return this.#route("closeTruths"); }

  /* --- Creazione collaborativa --- */
  /** Avvia la creazione guidata (GM). Azzera Virtù/Vizio/Brink dei personaggi. */
  static startCreation() { return this.#route("startCreation"); }
  /** Passo successivo: virtue → vice → brink → done (GM). */
  static creationNext() { return this.#route("creationNext"); }
  /** Termina/annulla la creazione (GM). */
  static endCreation() { return this.#route("endCreation"); }
  /** Scrive un campo sul personaggio bersaglio (il vicino). */
  static creationWrite(actorId, field, value) { return this.#route("creationWrite", { actorId, field, value }); }
  /** Scrive il Brink dell'antagonista "Them". */
  static creationSetThem(text) { return this.#route("creationSetThem", { text }); }

  /** Martyrdom: dona un Hope die a un personaggio sopravvissuto. */
  static grantHope(actorId) { return this.#route("grantHope", { actorId }); }

  /** Planchette: punta manualmente su una lettera ("" torna all'automatico). */
  static pointPlanchette(ch) { return this.#route("pointPlanchette", { ch }); }
  /** Planchette: "compone" una parola indicando le lettere in sequenza. */
  static spellWord(text) { return this.#route("spellWord", { text }); }

  /** Turno: il GM assegna il turno corrente a un personaggio ("" per nessuno). */
  static setTurn(actorId) { return this.#route("setTurn", { actorId }); }

  /** Safety / scenario: il GM aggiorna testo del Module e Lines & Veils. */
  static setModuleText(text) { return this.#route("setModuleText", { text }); }
  static setLinesVeils(text) { return this.#route("setLinesVeils", { text }); }
  /** X-Card: chiunque può invocarla (stop/rewind della scena). */
  static raiseXCard() { return this.#route("raiseXCard", { name: game.user.name }); }

  /* -------------------------------------------- */
  /*  Routing GM-autoritativo                     */
  /* -------------------------------------------- */

  static #route(cmd, args = {}) {
    if (game.user.isGM) {
      // Un GM agisce direttamente (ha i permessi di scrittura).
      return this.#exec(cmd, args);
    }
    // I player inoltrano al GM attivo.
    const gm = game.users.activeGM;
    if (!gm) {
      ui.notifications.warn(game.i18n.localize("TENCANDLES.Notify.NoActiveGM"));
      return;
    }
    game.socket.emit(SOCKET, { cmd, args });
  }

  static #onSocket(payload) {
    // Solo il GM attivo esegue: unico scrittore autorevole.
    if (game.user !== game.users.activeGM) return;
    if (!payload?.cmd) return;
    this.#exec(payload.cmd, payload.args ?? {});
  }

  static async #exec(cmd, args) {
    switch (cmd) {
      case "darkenCandle": return this.#execDarkenCandle(args.index, args.initiatorId);
      case "loseDice": return this.#execLoseDice(args.n ?? 1);
      case "newGame": return this.#execNewGame();
      case "setState": return this.#execSetState(args.patch ?? {});
      case "submitTruth": return this.#execSubmitTruth(args.name, args.text);
      case "closeTruths": return this.#execCloseTruths();
      case "startCreation": return this.#execStartCreation();
      case "creationNext": return this.#execCreationNext();
      case "endCreation": return this.#execEndCreation();
      case "creationWrite": return this.#execCreationWrite(args.actorId, args.field, args.value);
      case "creationSetThem": return this.#execCreationSetThem(args.text);
      case "grantHope": return this.#execGrantHope(args.actorId);
      case "pointPlanchette": return this.#execPointPlanchette(args.ch);
      case "spellWord": return this.#execSpellWord(args.text);
      case "setTurn": return this.#execSetTurn(args.actorId);
      case "setModuleText": return this.#execSetModuleText(args.text);
      case "setLinesVeils": return this.#execSetLinesVeils(args.text);
      case "raiseXCard": return this.#execRaiseXCard(args.name);
      default:
        console.warn(`${SYSTEM_ID} | Unknown GameState command: ${cmd}`);
    }
  }

  /* -------------------------------------------- */
  /*  Esecutori (girano SOLO sul GM)              */
  /* -------------------------------------------- */

  /** Scrive lo stato (merge del patch sullo stato corrente). GM-only. */
  static async #write(patch) {
    const current = foundry.utils.deepClone(this.data);
    const next = foundry.utils.mergeObject(current, patch, { inplace: false });
    await game.settings.set(SYSTEM_ID, SETTING_KEY, next);
  }

  static async #execNewGame() {
    const r = CONFIG.TEN_CANDLES.rules;
    await this.#write({
      candles: Array(r.startingCandles).fill(true),
      playerPool: r.startingPlayerPool,
      gmPool: r.startingGmPool,
      sceneNumber: 1,
      truthsPhase: false,
      truthsTarget: 0,
      truths: [],
      creation: { active: false, step: "idle", themBrink: "" },
      planchetteManual: "",
      turnActorId: "",
      truthsLog: [],
      xcard: 0
    });
    await this.#resetAllSceneFlags();
    await this.#announce("TENCANDLES.Chat.NewGame", { candles: r.startingCandles });
    // Apertura di scenario: se il GM ha scritto il "Module", lo mostra in chat.
    const mod = (this.data.moduleText ?? "").trim();
    if (mod) {
      const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
      await ChatMessage.create({
        content: `<div class="tc-announce tc-module-open"><p>${esc(mod).replace(/\n/g, "<br>")}</p></div>`,
        speaker: { alias: game.i18n.localize("TENCANDLES.SystemName") }
      });
    }
  }

  static async #execDarkenCandle(index, initiatorId) {
    const total = CONFIG.TEN_CANDLES.rules.startingCandles;
    const candles = foundry.utils.deepClone(this.data.candles ?? Array(total).fill(true));

    // Sceglie quale candela spegnere: quella cliccata (se accesa), altrimenti
    // la candela accesa di indice più alto.
    let idx = -1;
    if (typeof index === "number" && candles[index]) idx = index;
    else { for (let i = candles.length - 1; i >= 0; i--) { if (candles[i]) { idx = i; break; } } }
    if (idx < 0) return; // niente da spegnere
    candles[idx] = false;
    const candlesLit = candles.filter(Boolean).length;

    // Ultima candela spenta → fine partita, nessun refill.
    if (candlesLit === 0) {
      await this.#write({ candles, playerPool: 0, gmPool: total, truthsPhase: false, truthsTarget: 0, truths: [], turnActorId: "" });
      await this.#announce("TENCANDLES.Chat.AllDark");
      return;
    }

    // Cambio scena: refill del pool giocatori = candele accese; il resto al GM.
    // Le Verità si stabiliscono quando restano ≥2 candele; nel Last Stand (1) si
    // dice solo "E noi siamo vivi", quindi nessuna fase di raccolta.
    const truthsOn = candlesLit >= 2;
    // Prima verità: la stabilisce chi ha fallito/seized (iniziatore), altrimenti il GM ("").
    const firstTurn = (truthsOn && initiatorId && game.actors.get(initiatorId)?.type === "character") ? initiatorId : "";
    await this.#write({
      candles,
      playerPool: candlesLit,
      gmPool: total - candlesLit,
      sceneNumber: this.data.sceneNumber + 1,
      truthsPhase: truthsOn,
      truthsTarget: truthsOn ? candlesLit : 0,
      truths: [],
      turnActorId: firstTurn
    });
    await this.#resetAllSceneFlags();

    // Annuncio Truths. Numero di truths = candele ora accese.
    if (candlesLit === 1) {
      await this.#announce("TENCANDLES.Chat.LastStand");
    } else {
      await this.#announce("TENCANDLES.Chat.SceneChange", { truths: candlesLit });
    }
  }

  /** Array di `total` booleani con le prime `n` candele accese. */
  static #firstN(n, total) {
    const t = total ?? CONFIG.TEN_CANDLES.rules.startingCandles;
    const k = Math.max(0, Math.min(t, Math.round(n || 0)));
    return Array.from({ length: t }, (_, i) => i < k);
  }

  /** Aggiunge una verità; se si raggiunge l'obiettivo, chiude la fase. GM-only. */
  static async #execSubmitTruth(name, text) {
    const t = (text ?? "").trim();
    if (!this.data.truthsPhase || !t) return;
    const truths = foundry.utils.deepClone(this.data.truths ?? []);
    if (truths.length >= (this.data.truthsTarget ?? 0)) return;
    truths.push({ name: name ?? "?", text: t.slice(0, 240) });
    const full = truths.length >= (this.data.truthsTarget ?? 0);
    // Turno in senso orario: passa al prossimo personaggio dell'anello.
    const nextTurn = full ? "" : this.#nextInRing(this.data.turnActorId ?? "");
    await this.#write({ truths, truthsPhase: !full, turnActorId: nextTurn });
    if (full) { await this.#appendTruthsLog(truths); await this.#announceTruthsClose(truths); }
  }

  /** Prossimo personaggio in senso orario dopo `curId` nell'anello. */
  static #nextInRing(curId) {
    const ring = this.creationRing();
    if (!ring.length) return "";
    const i = ring.findIndex((a) => a.id === curId);
    const next = ring[(i + 1) % ring.length];
    return next ? next.id : "";
  }

  /** Chiude la fase Verità e pronuncia la chiusura del rito. GM-only. */
  static async #execCloseTruths() {
    if (!this.data.truthsPhase) return;
    const truths = this.data.truths ?? [];
    await this.#write({ truthsPhase: false });
    await this.#appendTruthsLog(truths);
    await this.#announceTruthsClose(truths);
  }

  /** Accoda le verità appena stabilite al registro persistente della partita. */
  static async #appendTruthsLog(truths) {
    const items = (truths ?? []).map((t) => t.text).filter(Boolean);
    if (!items.length) return;
    const log = foundry.utils.deepClone(this.data.truthsLog ?? []);
    log.push({ scene: this.data.sceneNumber ?? 1, items });
    await this.#write({ truthsLog: log });
  }

  static async #announceTruthsClose(truths) {
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const items = (truths ?? []).map((t) => `<li>${esc(t.text)}</li>`).join("");
    const close = game.i18n.localize("TENCANDLES.Ritual.TruthsClose");
    await ChatMessage.create({
      content: `<div class="tc-announce">${items ? `<ul class="tc-truths">${items}</ul>` : ""}<p><em>${esc(close)}</em></p></div>`,
      speaker: { alias: game.i18n.localize("TENCANDLES.SystemName") }
    });
  }

  /* --- Creazione collaborativa (GM-only) --- */

  /** Ordine "al tavolo": personaggi ordinati per id (stabile su tutti i client). */
  static creationRing() {
    return game.actors
      .filter((a) => a.type === "character")
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  static async #execStartCreation() {
    for (const a of this.creationRing()) {
      // eslint-disable-next-line no-await-in-loop
      await a.update({
        "system.traits.virtue.value": "",
        "system.traits.vice.value": "",
        "system.brink.value": ""
      });
    }
    await this.#write({ candles: Array(CONFIG.TEN_CANDLES.rules.startingCandles).fill(false), creation: { active: true, step: "virtue", themBrink: "" } });
    await this.#announce("TENCANDLES.Creation.Started");
  }

  static async #execCreationNext() {
    if (!this.data.creation?.active) return;
    // Flusso: Virtù → Vizio → Moment → Brink → Them → fine.
    // Accensione progressiva delle candele (3 Traits + 3 Moments + 3 Brinks + 1):
    const order = ["virtue", "vice", "moment", "brink", "them", "done"];
    const litByStep = { virtue: 0, vice: 0, moment: 3, brink: 6, them: 9, done: 10 };
    const cur = this.data.creation.step;
    const next = order[Math.min(order.indexOf(cur) + 1, order.length - 1)];
    if (next === "done") {
      const r = CONFIG.TEN_CANDLES.rules;
      await this.#write({
        candles: Array(r.startingCandles).fill(true),
        playerPool: r.startingPlayerPool,
        gmPool: r.startingGmPool,
        sceneNumber: 1,
        creation: { active: false, step: "done" }
      });
      const them = (this.data.creation?.themBrink ?? "").trim();
      if (them) {
        const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
        await ChatMessage.create({
          content: `<div class="tc-announce"><p><strong>${esc(game.i18n.localize("TENCANDLES.Creation.Them"))}</strong></p><p><em>${esc(them)}</em></p></div>`,
          speaker: { alias: game.i18n.localize("TENCANDLES.SystemName") }
        });
      }
      await this.#announce("TENCANDLES.Creation.Done");
    } else {
      await this.#write({ candles: this.#firstN(litByStep[next] ?? this.candlesLit), creation: { active: true, step: next } });
    }
  }

  static async #execEndCreation() {
    await this.#write({ creation: { active: false, step: "idle" } });
  }

  static async #execCreationWrite(actorId, field, value) {
    if (!this.data.creation?.active) return;
    const actor = game.actors.get(actorId);
    if (!actor || actor.type !== "character") return;
    const allowed = { virtue: "system.traits.virtue.value", vice: "system.traits.vice.value", brink: "system.brink.value", moment: "system.moment.value" };
    const path = allowed[field];
    if (!path) return;
    await actor.update({ [path]: String(value ?? "").slice(0, 200) });
  }

  static async #execCreationSetThem(text) {
    if (!this.data.creation?.active) return;
    await this.#write({ creation: { themBrink: String(text ?? "").slice(0, 240) } });
  }

  static async #execGrantHope(actorId) {
    const actor = game.actors.get(actorId);
    if (!actor || actor.type !== "character" || !actor.system.alive) return;
    await actor.gainHope(1);
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    await ChatMessage.create({
      content: `<div class="tc-announce"><p><em>${esc(game.i18n.format("TENCANDLES.Martyrdom.Chat", { name: actor.name }))}</em></p></div>`,
      speaker: { alias: game.i18n.localize("TENCANDLES.SystemName") }
    });
  }

  static async #execPointPlanchette(ch) {
    const c = String(ch ?? "").trim().slice(0, 1).toUpperCase();
    await this.#write({ planchetteManual: c });
  }

  /** Indica in sequenza le lettere di una parola, poi torna all'automatico. */
  static async #execSpellWord(text) {
    const chars = String(text ?? "").toUpperCase().replace(/[^A-Z0-9 ]/g, "").split("");
    if (!chars.length) { await this.#write({ planchetteManual: "" }); return; }
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    for (const c of chars) {
      // eslint-disable-next-line no-await-in-loop
      await this.#write({ planchetteManual: c === " " ? "" : c });
      // eslint-disable-next-line no-await-in-loop
      await wait(c === " " ? 700 : 1300);
    }
    await this.#write({ planchetteManual: "" });
  }

  static async #execSetTurn(actorId) {
    await this.#write({ turnActorId: String(actorId ?? "") });
  }

  static async #execSetModuleText(text) {
    await this.#write({ moduleText: String(text ?? "").slice(0, 4000) });
  }

  static async #execSetLinesVeils(text) {
    await this.#write({ linesVeils: String(text ?? "").slice(0, 4000) });
  }

  static async #execRaiseXCard(name) {
    await this.#write({ xcard: (this.data.xcard ?? 0) + 1 });
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    await ChatMessage.create({
      content: `<div class="tc-announce tc-xcard-msg"><p><strong>✕ ${esc(game.i18n.localize("TENCANDLES.Safety.XCardRaised"))}</strong></p><p>${esc(game.i18n.format("TENCANDLES.Safety.XCardBy", { name: name ?? "?" }))}</p></div>`,
      speaker: { alias: game.i18n.localize("TENCANDLES.SystemName") },
      whisper: []
    });
  }

  static async #execLoseDice(n) {
    const playerPool = Math.max(0, this.data.playerPool - n);
    await this.#write({ playerPool });
  }

  /** Override manuale con clamp dei valori. GM-only. */
  static async #execSetState(patch) {
    const total = CONFIG.TEN_CANDLES.rules.startingCandles;
    const clean = {};
    if ("candlesLit" in patch) clean.candles = this.#firstN(Math.clamp(Math.round(patch.candlesLit), 0, total), total);
    if ("candles" in patch && Array.isArray(patch.candles)) clean.candles = patch.candles.slice(0, total).map(Boolean);
    if ("playerPool" in patch) clean.playerPool = Math.max(0, Math.round(patch.playerPool));
    if ("gmPool" in patch) clean.gmPool = Math.max(0, Math.round(patch.gmPool));
    if ("sceneNumber" in patch) clean.sceneNumber = Math.max(1, Math.round(patch.sceneNumber));
    await this.#write(clean);
  }

  /** Azzera il flag "un Trait per scena" su tutti i personaggi. GM-only. */
  static async #resetAllSceneFlags() {
    for (const actor of game.actors) {
      if (actor.type === "character") await actor.resetSceneFlags();
    }
  }

  /** Messaggio in chat (frasi di gioco, non testo del manuale). */
  static async #announce(key, data = {}) {
    await ChatMessage.create({
      content: `<div class="tc-announce">${game.i18n.format(key, data)}</div>`,
      speaker: { alias: game.i18n.localize("TENCANDLES.SystemName") }
    });
  }
}
