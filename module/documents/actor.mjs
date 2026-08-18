/**
 * Ten Candles — Document class dell'Actor.
 *
 * Estende la classe Actor di Foundry aggiungendo i METODI OPERATIVI che
 * modificano lo stato del personaggio. Ogni metodo usa `this.update(...)`:
 * Foundry lo esegue in modo atomico, lo persiste e lo propaga a tutti i
 * client connessi. I permessi sono gestiti da Foundry (un player può agire
 * solo sul proprio personaggio; il GM su tutti).
 *
 * NB: qui vive SOLO la mutazione di stato. Il tiro dei dadi vero e proprio
 * (reroll degli 1, reroll del pool per il Brink) è nell'helper dadi del
 * Componente 5, che chiamerà questi metodi al momento giusto.
 *
 * Mappa azione di gioco → metodo:
 *   Burn a Trait      → burnTrait("virtue" | "vice")
 *   Live your Moment  → liveMoment({ success })
 *   Embrace the Brink → (reroll in Comp.5) → se fallisce: burnBrink()
 *   Gain / lose hope  → gainHope(n) / loseHope()
 *   Character death   → die()
 *   Scene change      → resetSceneFlags()
 */

import { TapeAudio } from "../apps/tape-audio.mjs";

export class TenCandlesActor extends Actor {
  /* -------------------------------------------- */
  /*  Getter di comodità                          */
  /* -------------------------------------------- */

  /** True se questo Actor è un personaggio giocante. */
  get isCharacter() {
    return this.type === "character";
  }

  /** Il personaggio può abbracciare il Brink adesso? (dato derivato) */
  get canEmbraceBrink() {
    return this.isCharacter && this.system.brink?.available === true;
  }

  /* -------------------------------------------- */
  /*  Trait                                       */
  /* -------------------------------------------- */

  /**
   * Brucia un Trait per poter ritirare tutti i dadi usciti 1.
   * Regole applicate:
   *  - il Trait deve esistere, avere un valore e non essere già bruciato;
   *  - non si può usare più di un Trait per scena.
   * Il reroll effettivo è gestito dall'helper dadi (Comp. 5).
   *
   * @param {"virtue"|"vice"} traitKey
   * @returns {Promise<boolean>} true se il Trait è stato bruciato
   */
  async burnTrait(traitKey) {
    if (!this.isCharacter) return false;
    const trait = this.system.traits?.[traitKey];

    if (!trait) {
      ui.notifications.warn(game.i18n.localize("TENCANDLES.Notify.TraitUnknown"));
      return false;
    }
    if (!trait.value) {
      ui.notifications.warn(game.i18n.localize("TENCANDLES.Notify.TraitEmpty"));
      return false;
    }
    if (trait.burned) {
      ui.notifications.warn(game.i18n.localize("TENCANDLES.Notify.TraitAlreadyBurned"));
      return false;
    }
    if (this.system.traitUsedThisScene) {
      ui.notifications.warn(game.i18n.localize("TENCANDLES.Notify.TraitUsedThisScene"));
      return false;
    }

    await this.update({
      [`system.traits.${traitKey}.burned`]: true,
      "system.traitUsedThisScene": true
    });

    ui.notifications.info(
      game.i18n.format("TENCANDLES.Notify.TraitBurned", { trait: trait.value })
    );
    return true;
  }

  /* -------------------------------------------- */
  /*  Moment                                      */
  /* -------------------------------------------- */

  /**
   * Vivi il tuo Moment. La carta viene risolta (lived = true). Se il tiro di
   * conflitto associato ha avuto successo, si guadagna un hope die.
   *
   * @param {object} [options]
   * @param {boolean} [options.success=false] esito del conflitto per vivere il Moment
   * @returns {Promise<boolean>}
   */
  async liveMoment({ success = false } = {}) {
    if (!this.isCharacter) return false;
    if (!this.system.moment.value) {
      ui.notifications.warn(game.i18n.localize("TENCANDLES.Notify.MomentEmpty"));
      return false;
    }
    if (this.system.moment.lived) {
      ui.notifications.warn(game.i18n.localize("TENCANDLES.Notify.MomentAlreadyLived"));
      return false;
    }

    const updates = { "system.moment.lived": true };
    if (success) updates["system.hope.dice"] = this.system.hope.dice + 1;

    await this.update(updates);

    ui.notifications.info(
      game.i18n.localize(
        success ? "TENCANDLES.Notify.MomentLivedHope" : "TENCANDLES.Notify.MomentLived"
      )
    );
    return true;
  }

  /* -------------------------------------------- */
  /*  Brink                                        */
  /* -------------------------------------------- */

  /**
   * Brucia il Brink. Va chiamato quando un reroll del Brink FALLISCE:
   * il Brink si brucia e tutti gli hope die vengono persi.
   * (Lo spegnimento della candela conseguente è gestito dal tracker, Comp. 5.)
   * @returns {Promise<void>}
   */
  async burnBrink() {
    if (!this.isCharacter) return;
    await this.update({
      "system.brink.burned": true,
      "system.hope.dice": 0
    });
    ui.notifications.warn(game.i18n.localize("TENCANDLES.Notify.BrinkBurned"));
  }

  /* -------------------------------------------- */
  /*  Hope                                         */
  /* -------------------------------------------- */

  /**
   * Aggiunge hope die (es. +1 vivendo il Moment, o via Martyrdom).
   * @param {number} [amount=1]
   */
  async gainHope(amount = 1) {
    if (!this.isCharacter) return;
    const next = Math.max(0, this.system.hope.dice + amount);
    await this.update({ "system.hope.dice": next });
  }

  /** Azzera gli hope die (persi per un Brink fallito). */
  async loseHope() {
    if (!this.isCharacter) return;
    await this.update({ "system.hope.dice": 0 });
  }

  /* -------------------------------------------- */
  /*  Vita / morte                                */
  /* -------------------------------------------- */

  /** Segna il personaggio come morto (The Last Stand / Dire Conflict). */
  async die() {
    if (!this.isCharacter || !this.system.alive) return;
    await this.update({ "system.alive": false });
    ui.notifications.info(
      game.i18n.format("TENCANDLES.Notify.CharacterDied", { name: this.name })
    );
  }

  /** Utility/undo: riporta in vita (correzione errori al tavolo). */
  async revive() {
    if (!this.isCharacter) return;
    await this.update({ "system.alive": true });
  }

  /* -------------------------------------------- */
  /*  Final recording                             */
  /* -------------------------------------------- */

  /** Riproduce (in broadcast a tutti, con effetto mangianastri) la registrazione finale. */
  async playRecording() {
    const src = this.system.recording?.path;
    if (!this.isCharacter || !src) return null;
    return TapeAudio.broadcastAndPlay(src);
  }

  /**
   * Riproduce in sequenza le registrazioni finali di tutti i personaggi che ne
   * hanno una. Attende la fine di ciascuna prima della successiva (con fallback
   * a polling perché gli eventi Sound variano tra le versioni di Foundry).
   */
  static async playAllFinalRecordings() {
    const chars = game.actors.filter(
      (a) => a.type === "character" && a.system.recording?.path
    );
    for (const actor of chars) {
      // playRecording → broadcastAndPlay: risolve a fine riproduzione locale,
      // quindi l'await mette in sequenza una registrazione dopo l'altra.
      // eslint-disable-next-line no-await-in-loop
      await actor.playRecording();
    }
  }

  /* -------------------------------------------- */
  /*  Cambio scena                                */
  /* -------------------------------------------- */

  /**
   * Azzera i flag legati alla scena (il vincolo "un Trait per scena").
   * Il tracker (Comp. 5) chiamerà questo su tutti i personaggi al cambio scena.
   * @returns {Promise<void>}
   */
  async resetSceneFlags() {
    if (!this.isCharacter) return;
    if (this.system.traitUsedThisScene) {
      await this.update({ "system.traitUsedThisScene": false });
    }
  }
}
