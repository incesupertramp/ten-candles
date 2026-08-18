/**
 * Ten Candles — Scenario, Sicurezza & Registro delle Verità.
 *
 * Un pannello condiviso per: il testo del "Module" (scenario + apertura), i
 * Lines & Veils della Session Zero, la X-Card (chiunque può invocarla) e il
 * "Libro delle Verità" che cresce per tutta la partita. Il testo lo modifica il
 * GM; tutti lo vedono in sola lettura. Si ridisegna su ogni cambio di stato.
 */

import { SYSTEM_ID } from "../config.mjs";
import { GameState } from "./game-state.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const RENDER_HOOK = `${SYSTEM_ID}.stateChanged`;

export class TenCandlesSafety extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "ten-candles-safety",
    classes: ["ten-candles", "tc-safety"],
    position: { width: 420, height: "auto" },
    window: { title: "TENCANDLES.Safety.Title", resizable: true },
    actions: {
      raiseXCard: this.#onRaiseXCard,
      saveModule: this.#onSaveModule,
      saveLinesVeils: this.#onSaveLinesVeils
    }
  };

  static PARTS = {
    body: { template: "systems/ten-candles/templates/apps/safety.hbs" }
  };

  #hookId = null;

  _onRender(context, options) {
    super._onRender?.(context, options);
    if (this.#hookId === null) {
      this.#hookId = Hooks.on(RENDER_HOOK, () => this.render(false));
    }
  }

  async close(options) {
    if (this.#hookId !== null) { Hooks.off(RENDER_HOOK, this.#hookId); this.#hookId = null; }
    return super.close(options);
  }

  async _prepareContext() {
    return {
      isGM: game.user.isGM,
      moduleText: GameState.moduleText,
      linesVeils: GameState.linesVeils,
      truthsLog: GameState.truthsLog
    };
  }

  static async #onRaiseXCard() {
    await GameState.raiseXCard();
  }

  static async #onSaveModule() {
    const el = this.element?.querySelector(".tc-module-input");
    if (el) await GameState.setModuleText(el.value ?? "");
  }

  static async #onSaveLinesVeils() {
    const el = this.element?.querySelector(".tc-lv-input");
    if (el) await GameState.setLinesVeils(el.value ?? "");
  }
}
