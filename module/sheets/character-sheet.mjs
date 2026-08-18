/**
 * Ten Candles — Character sheet (ApplicationV2).
 *
 * Stack v13 (compatibile v14):
 *   foundry.applications.sheets.ActorSheetV2  +  HandlebarsApplicationMixin
 *
 * FASE 1: HTML essenziale, nessuna estetica. I campi di testo/checkbox si
 * salvano da soli (submitOnChange) perché ActorSheetV2 → DocumentSheetV2
 * gestisce il submit del form verso il documento. I bottoni "azione"
 * (data-action) chiamano i metodi operativi definiti su TenCandlesActor
 * (Comp. 3). Dopo ogni update, Foundry ridisegna la sheet da solo.
 *
 * L'estetica (tema horror, animazioni) è FASE 2. Qui il CSS è minimo.
 */

import { DiceEngine } from "../apps/dice-engine.mjs";
import { GameState } from "../apps/game-state.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export class TenCandlesCharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["ten-candles", "sheet", "actor", "character"],
    position: { width: 480, height: 640 },
    window: { resizable: true },
    form: {
      submitOnChange: true, // i campi si salvano al cambiamento
      closeOnSubmit: false
    },
    // Mappa data-action="..." → handler statico (this = istanza sheet).
    actions: {
      burnTrait: this.#onBurnTrait,
      liveMoment: this.#onLiveMoment,
      liveMomentRoll: this.#onLiveMomentRoll,
      setHope: this.#onSetHope,
      toggleAlive: this.#onToggleAlive,
      toggleEdit: this.#onToggleEdit,
      rollConflict: this.#onRollConflict,
      pickRecording: this.#onPickRecording,
      playRecording: this.#onPlayRecording,
      martyrdom: this.#onMartyrdom,
      addSupply: this.#onAddSupply,
      incSupply: this.#onIncSupply,
      consumeSupply: this.#onConsumeSupply,
      deleteSupply: this.#onDeleteSupply
    }
  };

  /** Stato locale: modalità modifica. */
  #editing = false;

  /** @override — un solo template per la Fase 1. */
  static PARTS = {
    body: {
      template: "systems/ten-candles/templates/actor/character-sheet.hbs"
    }
  };

  /* -------------------------------------------- */
  /*  Contesto per il template                    */
  /* -------------------------------------------- */
  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const sys = this.actor.system;

    context.actor = this.actor;
    context.system = sys;
    context.editable = this.isEditable;
    context.editing = this.#editing && this.isEditable;
    context.isGM = game.user.isGM;
    context.canSeeBrink = this.actor.isOwner || game.user.isGM;
    context.survivors = game.actors
      .filter((a) => a.type === "character" && a.system.alive && a.id !== this.actor.id)
      .map((a) => ({ id: a.id, name: a.name }));
    context.supplies = this.actor.items
      .filter((i) => i.type === "supply")
      .map((i) => ({ id: i.id, name: i.name, quantity: i.system.quantity, consumable: i.system.consumable, notes: i.system.notes }));

    // Hope come fiammelle: almeno 5 pip, di più se l'Hope è alto.
    const hope = sys.hope?.dice ?? 0;
    const pipCount = Math.max(5, hope);
    context.hopePips = Array.from({ length: pipCount }, (_, i) => ({ n: i + 1, on: i < hope }));

    // Righe Trait pronte per il template (dati derivati inclusi: usableNow).
    context.traitRows = [
      {
        key: "virtue",
        label: "TENCANDLES.Trait.Virtue",
        value: sys.traits.virtue.value,
        burned: sys.traits.virtue.burned,
        usableNow: sys.traits.virtue.usableNow
      },
      {
        key: "vice",
        label: "TENCANDLES.Trait.Vice",
        value: sys.traits.vice.value,
        burned: sys.traits.vice.burned,
        usableNow: sys.traits.vice.usableNow
      }
    ];

    return context;
  }

  /* -------------------------------------------- */
  /*  Action handlers                             */
  /*  Firma ApplicationV2: (event, target)        */
  /*  `this` è l'istanza della sheet.             */
  /* -------------------------------------------- */

  static async #onBurnTrait(event, target) {
    await this.actor.burnTrait(target.dataset.trait);
  }

  static async #onLiveMoment(event, target) {
    const success = target.dataset.success === "true";
    await this.actor.liveMoment({ success });
  }

  static async #onLiveMomentRoll(event, target) {
    await DiceEngine.rollConflict(this.actor, { moment: true });
  }

  static async #onSetHope(event, target) {
    const n = Number(target.dataset.n) || 0;
    const cur = this.actor.system.hope?.dice ?? 0;
    const val = Math.max(0, cur === n ? n - 1 : n); // riclicca l'ultima accesa → spegne
    await this.actor.update({ "system.hope.dice": val });
  }

  static async #onToggleAlive(event, target) {
    if (this.actor.system.alive) {
      await this.actor.die();
    } else if (typeof this.actor.revive === "function") {
      await this.actor.revive();
    } else {
      await this.actor.update({ "system.alive": true });
    }
  }

  static async #onToggleEdit(event, target) {
    this.#editing = !this.#editing;
    this.render(false);
  }

  static async #onPickRecording(event, target) {
    const FP = foundry.applications?.apps?.FilePicker?.implementation ?? globalThis.FilePicker;
    const current = this.actor.system.recording?.path ?? "";
    try {
      const picker = new FP({
        type: "audio",
        current,
        callback: (path) => this.actor.update({ "system.recording.path": path })
      });
      return picker.browse ? picker.browse() : picker.render(true);
    } catch (err) {
      console.error("ten-candles | FilePicker non disponibile", err);
    }
  }

  static async #onPlayRecording(event, target) {
    await this.actor.playRecording();
  }

  static async #onMartyrdom(event, target) {
    const sel = this.element?.querySelector(".tcs-martyr-target");
    if (!sel || !sel.value) return;
    await GameState.grantHope(sel.value);
  }

  static async #onAddSupply() {
    await this.actor.createEmbeddedDocuments("Item", [{
      type: "supply",
      name: game.i18n.localize("TENCANDLES.Supply.New")
    }]);
  }

  #supplyItem(target) {
    const id = target?.closest?.("[data-item-id]")?.dataset?.itemId;
    return id ? this.actor.items.get(id) : null;
  }

  static async #onIncSupply(event, target) {
    const item = this.#supplyItem(target);
    if (item) await item.update({ "system.quantity": (item.system.quantity ?? 0) + 1 });
  }

  static async #onConsumeSupply(event, target) {
    const item = this.#supplyItem(target);
    if (!item) return;
    const q = (item.system.quantity ?? 0) - 1;
    if (q <= 0 && item.system.consumable) await item.delete();
    else await item.update({ "system.quantity": Math.max(0, q) });
  }

  static async #onDeleteSupply(event, target) {
    const item = this.#supplyItem(target);
    if (item) await item.delete();
  }

  static async #onRollConflict(event, target) {
    const dire = target.dataset.dire === "true";
    await DiceEngine.rollConflict(this.actor, { dire });
  }
}
