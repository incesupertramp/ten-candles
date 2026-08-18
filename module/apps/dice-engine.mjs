/**
 * Ten Candles — Motore dadi (conflict resolution).
 *
 * Il conflitto si gioca come una CARD in chat con bottoni di stato, perché il
 * manuale prevede una sequenza interattiva:
 *   1) tiro del pool giocatori (+ hope die) e del pool GM;
 *   2) eventuale Burn Trait → ritira i dadi usciti 1;
 *   3) eventuale Embrace Brink → ritira l'intero pool del giocatore;
 *   4) Apply → applica l'esito.
 *
 * Regole (dal manuale):
 *  - Dado normale: successo su 6. Hope die: successo su 5-6.
 *  - Il conflitto riesce se c'è ALMENO un successo.
 *  - Su SUCCESSO: i dadi normali usciti 1 si perdono dal pool (gli hope no).
 *  - Su FALLIMENTO: si spegne una candela (→ cambio scena). In The Last Stand
 *    il fallimento causa invece la MORTE del personaggio.
 *  - Narration rights: vince chi ha più 6 (solo i 6 contano, anche per gli hope);
 *    in caso di pareggio vince il GM.
 *  - Burn Trait: ritira tutti gli 1 (max 1 Trait per scena).
 *  - Embrace Brink: ritira tutto il pool; se riesce tieni il Brink, se fallisce
 *    il Brink si brucia, perdi gli hope e si spegne una candela.
 *
 * ASSUNZIONE (traduzione digitale): se un Embrace Brink fallisce durante The
 * Last Stand, applico morte del personaggio invece dello spegnimento candela
 * (coerente con la regola del Last Stand). Modificabile in una riga.
 *
 * NOTA permessi: si assume che sia il proprietario del personaggio a tirare il
 * proprio conflitto (autore del messaggio = owner), così può aggiornare la card.
 */

import { SYSTEM_ID } from "../config.mjs";
import { GameState } from "./game-state.mjs";

const FLAG = "conflict";
const CARD_TEMPLATE = "systems/ten-candles/templates/chat/conflict-card.hbs";

/** Tira n d6 e ritorna i valori (con supporto opzionale a Dice So Nice). */
async function rollValues(n) {
  if (!n || n <= 0) return [];
  const roll = new Roll(`${n}d6`);
  await roll.evaluate();
  if (game.dice3d) { try { await game.dice3d.showForRoll(roll, game.user, true); } catch (_) {} }
  return roll.dice[0].results.map((r) => r.result);
}

const countSix = (arr) => arr.filter((v) => v === 6).length;

export class DiceEngine {
  /** Registra il listener delegato per i bottoni delle card. Chiamare in `ready`. */
  static activateListeners() {
    document.addEventListener("click", (ev) => {
      const btn = ev.target.closest("[data-tc-btn]");
      if (!btn) return;
      const messageId = btn.closest("[data-message-id]")?.dataset.messageId;
      if (!messageId) return;
      this.onCardButton(btn.dataset.tcBtn, messageId);
    });
  }

  /* -------------------------------------------- */
  /*  Lancio di un conflitto                      */
  /* -------------------------------------------- */

  /**
   * @param {TenCandlesActor} actor  personaggio che tira
   * @param {object} [opts]
   * @param {boolean} [opts.dire=false]
   * @param {boolean} [opts.moment=false] tiro per vivere il Moment
   */
  static async rollConflict(actor, { dire = false, moment = false } = {}) {
    const hopeN = actor?.system?.hope?.dice ?? 0;

    const flags = {
      actorId: actor?.id ?? null,
      dire,
      moment,
      lastStand: GameState.isLastStand,
      normal: await rollValues(GameState.playerPool),
      hope: await rollValues(hopeN),
      gm: await rollValues(GameState.gmPool),
      resolved: false,
      note: null // "brinkKept" | "brinkFailed" | null
    };

    const content = await this.#renderCard(flags, actor);
    await ChatMessage.create({
      content,
      speaker: { alias: game.i18n.localize("TENCANDLES.SystemName") },
      flags: { [SYSTEM_ID]: { [FLAG]: flags } }
    });
  }

  /* -------------------------------------------- */
  /*  Valutazione dello stato di tiro             */
  /* -------------------------------------------- */

  static evaluate(flags) {
    const success = flags.normal.some((v) => v === 6) || flags.hope.some((v) => v >= 5);
    const playerSixes = countSix(flags.normal) + countSix(flags.hope);
    const gmSixes = countSix(flags.gm);
    const winsDice = playerSixes > gmSixes ? "player" : "gm"; // pareggio → GM
    // Regola: il GM narra sempre un conflitto fallito (salvo seize o morte volontaria).
    const narrator = success ? winsDice : "gm";
    const ones = flags.normal.filter((v) => v === 1).length; // solo i normali si perdono
    return { success, playerSixes, gmSixes, winsDice, narrator, ones };
  }

  /* -------------------------------------------- */
  /*  Gestione click sui bottoni della card       */
  /* -------------------------------------------- */

  static async onCardButton(action, messageId) {
    const message = game.messages.get(messageId);
    if (!message) return;
    const flags = foundry.utils.deepClone(message.getFlag(SYSTEM_ID, FLAG));
    if (!flags || flags.resolved) return;

    const actor = flags.actorId ? game.actors.get(flags.actorId) : null;
    if (!(actor?.isOwner || game.user.isGM)) {
      ui.notifications.warn(game.i18n.localize("TENCANDLES.Notify.NotYourConflict"));
      return;
    }

    switch (action) {
      case "burnTrait": return this.#doBurnTrait(message, flags, actor);
      case "embraceBrink": return this.#doEmbraceBrink(message, flags, actor);
      case "seize": return this.#doSeize(message, flags, actor);
      case "chooseDeath": return this.#doChooseDeath(message, flags, actor);
      case "apply": return this.#doApply(message, flags, actor);
    }
  }

  /* -------------------------------------------- */
  /*  Burn Trait → ritira gli 1                   */
  /* -------------------------------------------- */

  static async #doBurnTrait(message, flags, actor) {
    const ones = flags.normal.filter((v) => v === 1).length;
    if (ones === 0) {
      ui.notifications.warn(game.i18n.localize("TENCANDLES.Notify.NoOnesToReroll"));
      return;
    }

    // Trait spendibili in questa scena.
    const usable = [];
    const t = actor.system.traits;
    if (t.virtue.usableNow) usable.push({ key: "virtue", label: `${game.i18n.localize("TENCANDLES.Trait.Virtue")}: ${t.virtue.value}` });
    if (t.vice.usableNow) usable.push({ key: "vice", label: `${game.i18n.localize("TENCANDLES.Trait.Vice")}: ${t.vice.value}` });
    if (usable.length === 0) {
      ui.notifications.warn(game.i18n.localize("TENCANDLES.Notify.NoTraitAvailable"));
      return;
    }

    // Scelta del Trait (se entrambi disponibili).
    let key = usable[0].key;
    if (usable.length > 1) {
      key = await foundry.applications.api.DialogV2.wait({
        window: { title: game.i18n.localize("TENCANDLES.Dialog.ChooseTrait") },
        content: "",
        buttons: usable.map((u) => ({ action: u.key, label: u.label }))
      }).catch(() => null);
      if (!key) return;
    }

    const burned = await actor.burnTrait(key);
    if (!burned) return;

    // Ritira tutti i dadi normali usciti 1.
    const rerolled = await rollValues(ones);
    let i = 0;
    flags.normal = flags.normal.map((v) => (v === 1 ? rerolled[i++] : v));

    await this.#updateCard(message, flags, actor);
  }

  /* -------------------------------------------- */
  /*  Embrace Brink → ritira l'intero pool        */
  /* -------------------------------------------- */

  static async #doEmbraceBrink(message, flags, actor) {
    if (!actor.canEmbraceBrink) {
      ui.notifications.warn(game.i18n.localize("TENCANDLES.Notify.BrinkUnavailable"));
      return;
    }
    // Consentito solo se si sta fallendo o si perderebbero i diritti di narrazione.
    const before = this.evaluate(flags);
    if (before.success && before.narrator === "player") {
      ui.notifications.warn(game.i18n.localize("TENCANDLES.Notify.BrinkNotNeeded"));
      return;
    }

    // Ritira l'intero pool del giocatore (normali + hope). Il pool GM resta.
    flags.normal = await rollValues(flags.normal.length);
    flags.hope = await rollValues(flags.hope.length);

    const after = this.evaluate(flags);
    if (after.success) {
      flags.note = "brinkKept";
      await this.#updateCard(message, flags, actor);
    } else {
      await actor.burnBrink();
      if (flags.lastStand) await actor.die();
      else await GameState.darkenCandle(actor?.id);
      flags.note = "brinkFailed";
      flags.resolved = true;
      await this.#updateCard(message, flags, actor);
    }
  }

  /* -------------------------------------------- */
  /*  Seize narration                             */
  /*  Successo → 1 candela; Fallimento → 2 candele*/
  /* -------------------------------------------- */

  static async #doSeize(message, flags, actor) {
    const ev = this.evaluate(flags);
    if (ev.success) {
      if (ev.narrator !== "gm") return; // niente da prendere
      await GameState.darkenCandle(actor?.id); // seize su successo: una candela
    } else {
      if (flags.lastStand) return; // in Last Stand il fallimento è morte, non candela
      // seize su fallimento: una candela ADDIZIONALE (2 totali)
      await GameState.darkenCandle(actor?.id);
      await GameState.darkenCandle(actor?.id);
    }
    flags.outcome = "seize";
    flags.resolved = true;
    await this.#updateCard(message, flags, actor);
  }

  /* -------------------------------------------- */
  /*  Dire → morte volontaria                     */
  /*  Su un dire fallito il PG può morire e       */
  /*  narrare il conflitto fallito.               */
  /* -------------------------------------------- */

  static async #doChooseDeath(message, flags, actor) {
    const ev = this.evaluate(flags);
    if (!flags.dire || ev.success) return;
    if (actor) await actor.die();
    // Il conflitto è comunque fallito: fuori dal Last Stand una candela si spegne.
    if (!flags.lastStand) await GameState.darkenCandle(actor?.id);
    flags.outcome = "deathNarrate";
    flags.resolved = true;
    await this.#updateCard(message, flags, actor);
  }

  /* -------------------------------------------- */
  /*  Apply → applica l'esito                     */
  /* -------------------------------------------- */

  static async #doApply(message, flags, actor) {
    const ev = this.evaluate(flags);

    if (ev.success) {
      if (ev.ones > 0) await GameState.loseDice(ev.ones);
      flags.outcome = "success";
    } else if (flags.lastStand) {
      if (actor) await actor.die();
      flags.outcome = "death";
    } else {
      await GameState.darkenCandle(actor?.id);
      flags.outcome = "darken";
    }

    // Tiro per vivere il Moment: risolvi il Moment (+ Hope die su successo).
    if (flags.moment && actor) await actor.liveMoment({ success: ev.success });

    flags.resolved = true;
    await this.#updateCard(message, flags, actor);
  }

  /* -------------------------------------------- */
  /*  Rendering della card                        */
  /* -------------------------------------------- */

  static async #updateCard(message, flags, actor) {
    const content = await this.#renderCard(flags, actor);
    await message.update({ content, [`flags.${SYSTEM_ID}.${FLAG}`]: flags });
  }

  static async #renderCard(flags, actor) {
    const ev = this.evaluate(flags);

    // Marca ogni dado per lo stile (6 = successo, 1 = perso).
    const chip = (v, hope = false) => ({
      v,
      six: v === 6,
      hopeHit: hope && v >= 5,
      one: v === 1
    });

    const context = {
      actorName: actor?.name ?? "—",
      dire: flags.dire,
      moment: flags.moment,
      lastStand: flags.lastStand,
      resolved: flags.resolved,
      note: flags.note,
      outcome: flags.outcome ?? null,

      normal: flags.normal.map((v) => chip(v)),
      hope: flags.hope.map((v) => chip(v, true)),
      gm: flags.gm.map((v) => chip(v)),

      success: ev.success,
      playerSixes: ev.playerSixes,
      gmSixes: ev.gmSixes,
      narrationPlayer: ev.narrator === "player",
      ones: ev.ones,

      // Booleani per il template (evita helper `eq` non garantiti in Foundry).
      noteKept: flags.note === "brinkKept",
      noteFailed: flags.note === "brinkFailed",
      outcomeSuccess: flags.outcome === "success",
      outcomeDarken: flags.outcome === "darken",
      outcomeDeath: flags.outcome === "death",
      outcomeSeize: flags.outcome === "seize",
      outcomeDeathNarrate: flags.outcome === "deathNarrate",

      // Visibilità dei bottoni.
      showBurnTrait: !flags.resolved && ev.ones > 0 &&
        (actor?.system?.traits?.virtue?.usableNow || actor?.system?.traits?.vice?.usableNow),
      showEmbraceBrink: !flags.resolved && actor?.canEmbraceBrink &&
        (!ev.success || ev.narrator === "gm"),
      // Seize: su successo se narra il GM (1 candela); su fallimento fuori Last Stand (2 candele).
      showSeize: !flags.resolved &&
        ((ev.success && ev.narrator === "gm") || (!ev.success && !flags.lastStand)),
      // Morte volontaria: solo su dire fallito.
      showChooseDeath: !flags.resolved && flags.dire && !ev.success,
      showApply: !flags.resolved
    };

    return foundry.applications.handlebars.renderTemplate(CARD_TEMPLATE, context);
  }
}
