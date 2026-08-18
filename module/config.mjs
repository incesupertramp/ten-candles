/**
 * Ten Candles — Configurazione di sistema.
 *
 * Single source of truth per i valori numerici delle regole. Le meccaniche
 * (dadi, pool, condizioni di successo) leggeranno SEMPRE da qui, così un
 * eventuale ritocco non richiede cacce al valore hard-coded nel codice.
 *
 * Riferimenti meccanici (dal manuale ufficiale Ten Candles, Cavalry Games):
 *  - Pool comune parte da 10 d6; refill = numero di candele ACCESE (cala).
 *  - Un dado normale ha successo su 6.
 *  - Un hope die ha successo su 5 o 6, ma solo i 6 contano per la narrazione.
 *  - I dadi che escono 1 si perdono per la scena (gli hope die NO).
 *  - Fallito il conflitto → una candela si spegne; le candele non si riaccendono.
 */

export const TEN_CANDLES = {};

/** Identificativo del sistema (deve combaciare con "id" in system.json). */
export const SYSTEM_ID = "ten-candles";

/** Versione dello schema dati del sistema (per future migrazioni). */
export const SCHEMA_VERSION = 1;

/* -------------------------------------------- */
/*  Numeri delle regole                         */
/* -------------------------------------------- */
TEN_CANDLES.rules = {
  startingCandles: 10, // candele accese a inizio partita
  startingPlayerPool: 10, // dice pool comune iniziale
  startingGmPool: 0, // pool del GM iniziale (cresce nel tempo)
  dieSuccess: 6, // soglia di successo di un dado normale
  hopeDieSuccessMin: 5, // un hope die ha successo su 5 o 6
  narrationValue: 6, // solo i 6 contano per i diritti di narrazione
  lostValue: 1 // i dadi su 1 vengono persi per la scena (tranne hope)
};

/* -------------------------------------------- */
/*  Tipi di Trait                               */
/* -------------------------------------------- */
TEN_CANDLES.traitTypes = {
  virtue: "TENCANDLES.Trait.Virtue",
  vice: "TENCANDLES.Trait.Vice"
};

/* -------------------------------------------- */
/*  Fasi di gioco (usate poi da tracker/scene)  */
/* -------------------------------------------- */
TEN_CANDLES.phases = {
  play: "TENCANDLES.Phase.Play", // scena normale
  truths: "TENCANDLES.Phase.Truths", // fase "These things are true..."
  lastStand: "TENCANDLES.Phase.LastStand" // ultima candela accesa
};

/* -------------------------------------------- */
/*  Frasi rituali (rese come stringhe fisse;    */
/*  NON sono testo protetto del manuale, sono   */
/*  frasi di gioco pronunciate al tavolo)       */
/* -------------------------------------------- */
TEN_CANDLES.ritual = {
  truthsOpen: "TENCANDLES.Ritual.TruthsOpen", // "These things are true. The world is dark."
  truthsClose: "TENCANDLES.Ritual.TruthsClose" // "And we are alive."
};
