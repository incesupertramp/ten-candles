/**
 * Ten Candles — Candle Tracker (ApplicationV2 semplice, non document sheet).
 *
 * FASE 1: finestra minima che mostra lo stato condiviso e offre i controlli
 * base al GM (spegni candela, nuova partita). Si ridisegna su tutti i client
 * quando lo stato cambia, agganciandosi all'hook emesso da GameState.onChange.
 *
 * L'estetica (candele animate, tema) è FASE 2.
 */

import { SYSTEM_ID } from "../config.mjs";
import { GameState } from "./game-state.mjs";
import { TenCandlesBoard } from "./board.mjs";
import { TenCandlesSafety } from "./safety.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const RENDER_HOOK = `${SYSTEM_ID}.stateChanged`;

export class TenCandlesTracker extends HandlebarsApplicationMixin(ApplicationV2) {
  /** @override */
  static DEFAULT_OPTIONS = {
    id: "ten-candles-tracker",
    classes: ["ten-candles", "tc-tracker"],
    position: { width: 260, height: "auto" },
    window: { title: "TENCANDLES.Tracker.Title", resizable: false },
    actions: {
      darken: this.#onDarken,
      newGame: this.#onNewGame,
      openBoard: this.#onOpenBoard,
      submitTruth: this.#onSubmitTruth,
      closeTruths: this.#onCloseTruths,
      playRecordings: this.#onPlayRecordings,
      startCreation: this.#onStartCreation,
      creationNext: this.#onCreationNext,
      endCreation: this.#onEndCreation,
      creationSubmit: this.#onCreationSubmit,
      creationSetThem: this.#onCreationSetThem,
      creationGmBrink: this.#onCreationGmBrink,
      spellWord: this.#onSpellWord,
      planchetteAuto: this.#onPlanchetteAuto,
      setTurn: this.#onSetTurn,
      clearTurn: this.#onClearTurn,
      openSafety: this.#onOpenSafety,
      xcard: this.#onXCard
    }
  };

  /** @override */
  static PARTS = {
    body: { template: "systems/ten-candles/templates/apps/candle-tracker.hbs" }
  };

  /** Id dell'hook di re-render, per poterlo rimuovere alla chiusura. */
  #hookId = null;

  /** @override — registra il re-render allo stato che cambia. */
  _onRender(context, options) {
    super._onRender?.(context, options);
    if (this.#hookId === null) {
      this.#hookId = Hooks.on(RENDER_HOOK, () => this.render(false));
    }
  }

  /** @override — pulizia dell'hook. */
  async close(options) {
    if (this.#hookId !== null) {
      Hooks.off(RENDER_HOOK, this.#hookId);
      this.#hookId = null;
    }
    return super.close(options);
  }

  /** @override */
  async _prepareContext() {
    const total = CONFIG.TEN_CANDLES.rules.startingCandles;
    // Array di booleani: true = candela accesa (per disegnare le 10 candele).
    const litArr = GameState.candles;
    const candles = Array.from({ length: total }, (_, i) => (litArr.length ? !!litArr[i] : i < GameState.candlesLit));
    const truths = GameState.truths;
    const truthsTarget = GameState.truthsTarget;

    // --- Creazione collaborativa: assegnazione al vicino + overview GM ---
    let creation = null;
    if (GameState.creationActive) {
      const step = GameState.creationStep;
      const ring = GameState.creationRing();
      const n = ring.length;
      const valueOf = (a) =>
        step === "virtue" ? a.system.traits.virtue.value
        : step === "vice" ? a.system.traits.vice.value
        : step === "brink" ? a.system.brink.value
        : step === "moment" ? a.system.moment.value : "";
      let assignment = null;
      const me = game.user.character;
      if (me && me.type === "character" && n >= 2) {
        const i = ring.findIndex((a) => a.id === me.id);
        if (i >= 0) {
          const right = ring[(i + 1) % n];
          const left = ring[(i - 1 + n) % n];
          if (step === "moment") {
            // Il Moment lo scrive ciascuno sul proprio personaggio.
            assignment = { field: "moment", targetId: me.id, targetName: "", current: me.system.moment?.value ?? "" };
          } else if (["virtue", "vice", "brink"].includes(step)) {
            const target = step === "virtue" ? right : left; // Virtù→destra, Vizio/Brink→sinistra
            assignment = { field: step, targetId: target.id, targetName: target.name, current: valueOf(target) ?? "" };
          }
        }
      }
      const overview = ring.map((a) => ({ name: a.name, filled: !!(valueOf(a) || "").trim() }));
      const them = step === "them"
        ? { brink: GameState.creationThemBrink, chars: ring.map((a) => ({ id: a.id, name: a.name })) }
        : null;
      creation = {
        step,
        stepLabel: game.i18n.localize(`TENCANDLES.Creation.Step.${step}`),
        askLabel: game.i18n.localize(`TENCANDLES.Creation.Ask.${step}`),
        assignment,
        overview,
        them
      };
    }

    // --- Turno (il GM sceglie chi tocca), mostrato durante Verità/creazione ---
    const showTurn = GameState.truthsPhase || GameState.creationActive;
    const turnId = GameState.turnActorId;
    const turnActor = turnId ? game.actors.get(turnId) : null;
    const turn = turnActor
      ? { name: turnActor.name, isMine: game.user.character?.id === turnActor.id }
      : null;
    const turnChars = game.user.isGM
      ? GameState.creationRing().map((a) => ({ id: a.id, name: a.name, sel: a.id === turnId }))
      : [];

    return {
      candles,
      candlesLit: GameState.candlesLit,
      playerPool: GameState.playerPool,
      gmPool: GameState.gmPool,
      sceneNumber: GameState.sceneNumber,
      isLastStand: GameState.isLastStand,
      isGameOver: GameState.isGameOver,
      isGM: game.user.isGM,
      truthsPhase: GameState.truthsPhase,
      truths,
      truthsTarget,
      truthsCount: truths.length,
      canSubmit: GameState.truthsPhase && truths.length < truthsTarget,
      creation,
      themBrink: GameState.creationThemBrink,
      showTurn,
      turn,
      turnChars
    };
  }

  /* -------------------------------------------- */
  /*  Actions                                     */
  /* -------------------------------------------- */

  static async #onDarken() {
    await GameState.darkenCandle();
  }

  static async #onNewGame() {
    let ok = false;
    try {
      ok = await foundry.applications.api.DialogV2.confirm({
        window: { title: game.i18n.localize("TENCANDLES.Tracker.NewGame") },
        content: `<p>${game.i18n.localize("TENCANDLES.Tracker.NewGameConfirm")}</p>`
      });
    } catch (err) {
      console.warn("ten-candles | DialogV2 non disponibile, uso confirm():", err);
      ok = window.confirm(game.i18n.localize("TENCANDLES.Tracker.NewGameConfirm"));
    }
    if (ok) await GameState.newGame();
  }

  static async #onOpenBoard() {
    new TenCandlesBoard().render(true);
  }

  static async #onSubmitTruth() {
    const input = this.element?.querySelector(".tc-truth-input");
    const text = input?.value ?? "";
    if (!text.trim()) return;
    await GameState.submitTruth(text);
    if (input) input.value = "";
  }

  static async #onCloseTruths() {
    await GameState.closeTruths();
  }

  static async #onPlayRecordings() {
    await CONFIG.Actor.documentClass.playAllFinalRecordings();
  }

  static async #onStartCreation() { await GameState.startCreation(); }
  static async #onCreationNext() { await GameState.creationNext(); }
  static async #onEndCreation() { await GameState.endCreation(); }

  static async #onCreationSubmit() {
    const input = this.element?.querySelector(".tc-creation-input");
    if (!input) return;
    const actorId = input.dataset.actor;
    const field = input.dataset.field;
    if (!actorId || !field) return;
    await GameState.creationWrite(actorId, field, input.value ?? "");
  }

  static async #onCreationSetThem() {
    const input = this.element?.querySelector(".tc-them-input");
    if (!input) return;
    await GameState.creationSetThem(input.value ?? "");
  }

  static async #onCreationGmBrink() {
    const sel = this.element?.querySelector(".tc-gmbrink-target");
    const input = this.element?.querySelector(".tc-gmbrink-input");
    if (!sel || !input || !sel.value) return;
    await GameState.creationWrite(sel.value, "brink", input.value ?? "");
    input.value = "";
  }

  static async #onSpellWord() {
    const input = this.element?.querySelector(".tc-spell-input");
    if (!input) return;
    const text = input.value ?? "";
    if (!text.trim()) return;
    input.value = "";
    await GameState.spellWord(text);
  }

  static async #onPlanchetteAuto() {
    await GameState.pointPlanchette("");
  }

  static async #onSetTurn() {
    const sel = this.element?.querySelector(".tc-turn-target");
    if (!sel) return;
    await GameState.setTurn(sel.value ?? "");
  }

  static async #onClearTurn() {
    await GameState.setTurn("");
  }

  static async #onOpenSafety() {
    new TenCandlesSafety().render(true);
  }

  static async #onXCard() {
    await GameState.raiseXCard();
  }
}
