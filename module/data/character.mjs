/**
 * Ten Candles — DataModel dell'Actor "character".
 *
 * Definisce lo SCHEMA dei dati di un personaggio. In Foundry v13 lo schema
 * vive qui (non in template.json), tramite `foundry.abstract.TypeDataModel`.
 *
 * Mappa meccanica → dato:
 *  ┌──────────────────────────┬───────────────────────────────────────────┐
 *  │ Trait (Virtue/Vice)      │ traits.virtue/vice = { value, burned }     │
 *  │  - burn → reroll degli 1 │ burned: true quando la carta è bruciata     │
 *  │  - max 1 Trait per scena │ traitUsedThisScene: flag azzerato a scena   │
 *  │ Moment                   │ moment = { value, lived }                    │
 *  │  - vissuto → +1 hope die │ lived: true quando risolto/bruciato         │
 *  │ Brink (Trait nascosto)   │ brink = { value, burned }                    │
 *  │  - sblocco condizionato  │ brink.available (derivato, vedi sotto)      │
 *  │ Hope die (successo 5-6)  │ hope.dice = numero di hope die posseduti     │
 *  │ Vivo/morto (Last Stand)  │ alive: boolean                              │
 *  └──────────────────────────┴───────────────────────────────────────────┘
 *
 * ASSUNZIONE (traduzione digitale, da confermare):
 *  Il manuale dice che il Brink si sblocca "quando il Moment è passato e
 *  tutti i Trait sono spariti". Interpreto "Moment passato" = carta Moment
 *  risolta/bruciata (moment.lived = true), a prescindere dall'esito del tiro.
 *  "Tutti i Trait spariti" = virtue.burned && vice.burned.
 */

import { SCHEMA_VERSION } from "../config.mjs";

const fields = foundry.data.fields;

export class CharacterData extends foundry.abstract.TypeDataModel {
  /** @override */
  static defineSchema() {
    return {
      // Versione dello schema, per migrazioni future del formato dati.
      schemaVersion: new fields.NumberField({
        required: true,
        integer: true,
        initial: SCHEMA_VERSION
      }),

      // Concept breve del personaggio (Step Three della creazione).
      concept: new fields.StringField({
        required: true,
        blank: true,
        initial: "",
        label: "TENCANDLES.Field.Concept"
      }),

      // Il personaggio è ancora vivo? (rilevante per The Last Stand e le Truths)
      alive: new fields.BooleanField({
        initial: true,
        label: "TENCANDLES.Field.Alive"
      }),

      // --- Traits: una virtue e un vice, ciascuno bruciabile una volta ---
      traits: new fields.SchemaField({
        virtue: new fields.SchemaField({
          value: new fields.StringField({ blank: true, initial: "", label: "TENCANDLES.Trait.Virtue" }),
          burned: new fields.BooleanField({ initial: false })
        }),
        vice: new fields.SchemaField({
          value: new fields.StringField({ blank: true, initial: "", label: "TENCANDLES.Trait.Vice" }),
          burned: new fields.BooleanField({ initial: false })
        })
      }),

      // Regola: non si possono usare entrambi i Trait nella stessa scena.
      // Flag azzerato al cambio scena (gestito dal tracker, Componente 5).
      traitUsedThisScene: new fields.BooleanField({ initial: false }),

      // --- Moment: se vissuto con successo, garantisce un hope die ---
      moment: new fields.SchemaField({
        value: new fields.StringField({ blank: true, initial: "", label: "TENCANDLES.Field.Moment" }),
        lived: new fields.BooleanField({ initial: false })
      }),

      // --- Brink: Trait nascosto, usabile solo a certe condizioni ---
      brink: new fields.SchemaField({
        value: new fields.StringField({ blank: true, initial: "", label: "TENCANDLES.Field.Brink" }),
        burned: new fields.BooleanField({ initial: false })
      }),

      // --- Hope dice posseduti (successo su 5-6; persi solo su Brink fallito) ---
      hope: new fields.SchemaField({
        dice: new fields.NumberField({ initial: 0, integer: true, min: 0, label: "TENCANDLES.Field.HopeDice" })
      }),

      // Note libere / biografia.
      notes: new fields.HTMLField({ initial: "", label: "TENCANDLES.Field.Notes" }),

      // --- Final recording: ultimo messaggio del personaggio ---
      // Riprodotto alla fine (dopo l'ultima candela). `hidden` = riservato al
      // GM finché non viene riprodotto, per non rovinare la sorpresa.
      recording: new fields.SchemaField({
        path: new fields.StringField({ blank: true, initial: "" }),
        hidden: new fields.BooleanField({ initial: true })
      })
    };
  }

  /* -------------------------------------------- */
  /*  Dati derivati (calcolati, non salvati)      */
  /* -------------------------------------------- */
  /** @override */
  prepareDerivedData() {
    const bothTraitsGone = this.traits.virtue.burned && this.traits.vice.burned;

    // Il Brink è utilizzabile solo se: non ancora bruciato, Moment risolto,
    // ed entrambi i Trait spariti. (vedi ASSUNZIONE in testa al file)
    this.brink.available = !this.brink.burned && this.moment.lived && bothTraitsGone;

    // Comodità per la UI: quali Trait sono ancora attivi (non bruciati)?
    this.traits.virtue.active = !this.traits.virtue.burned && this.traits.virtue.value !== "";
    this.traits.vice.active = !this.traits.vice.burned && this.traits.vice.value !== "";

    // Un Trait è spendibile in questa scena solo se attivo e non se ne è già
    // usato uno in scena.
    const canUseTrait = (t) => t.active && !this.traitUsedThisScene;
    this.traits.virtue.usableNow = canUseTrait(this.traits.virtue);
    this.traits.vice.usableNow = canUseTrait(this.traits.vice);
  }
}
