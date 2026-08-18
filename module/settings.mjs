/**
 * Ten Candles — Impostazioni di sistema (game.settings).
 *
 * - animations   (client): abilita/disabilita le animazioni della plancia.
 * - tapeEffect   (world) : effetto "mangianastri" sulle registrazioni finali.
 * - tapeIntensity(world) : quanto è spinto l'effetto (0.3 tenue → 1.6 marcato).
 */

import { SYSTEM_ID, SCHEMA_VERSION } from "./config.mjs";

export function registerSystemSettings() {
  game.settings.register(SYSTEM_ID, "animations", {
    name: "TENCANDLES.Settings.Animations.Name",
    hint: "TENCANDLES.Settings.Animations.Hint",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => {
      // Ridisegna le finestre del sistema per applicare subito il cambiamento.
      for (const app of Object.values(ui.windows ?? {})) {
        try { app.render?.(false); } catch (_e) { /* no-op */ }
      }
    }
  });

  game.settings.register(SYSTEM_ID, "tapeEffect", {
    name: "TENCANDLES.Settings.TapeEffect.Name",
    hint: "TENCANDLES.Settings.TapeEffect.Hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(SYSTEM_ID, "tapeIntensity", {
    name: "TENCANDLES.Settings.TapeIntensity.Name",
    hint: "TENCANDLES.Settings.TapeIntensity.Hint",
    scope: "world",
    config: true,
    type: Number,
    default: 1,
    range: { min: 0.3, max: 1.6, step: 0.1 }
  });

  // Versione dello schema dati persistito (per le migrazioni). Non in UI.
  game.settings.register(SYSTEM_ID, "schemaVersion", {
    scope: "world",
    config: false,
    type: Number,
    default: 0
  });

  game.settings.register(SYSTEM_ID, "planchetteSound", {
    name: "TENCANDLES.Settings.PlanchetteSound.Name",
    hint: "TENCANDLES.Settings.PlanchetteSound.Hint",
    scope: "client",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(SYSTEM_ID, "ambient", {
    name: "TENCANDLES.Settings.Ambient.Name",
    hint: "TENCANDLES.Settings.Ambient.Hint",
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
    onChange: (v) => {
      import("./apps/sfx.mjs").then(({ Ambient }) => { if (!v) Ambient.stop(); }).catch(() => {});
    }
  });
}

/**
 * Esegue le migrazioni dello schema dati se necessario (solo GM).
 * Oggi i campi aggiunti hanno tutti un default nel DataModel, quindi non serve
 * alcuna trasformazione: si aggiorna solo la versione registrata. Lo scaffold è
 * pronto per migrazioni reali future (es. rinominare/spostare campi sugli attori).
 */
export async function runMigrations() {
  if (!game.user?.isGM) return;
  let stored = 0;
  try { stored = Number(game.settings.get(SYSTEM_ID, "schemaVersion")) || 0; } catch (_e) { return; }
  if (stored >= SCHEMA_VERSION) return;

  console.log(`${SYSTEM_ID} | migrating data schema ${stored} → ${SCHEMA_VERSION}`);
  // --- Punto d'inserimento per migrazioni future ---
  // Esempio:
  //   if (stored < 2) { for (const a of game.actors) { await a.update({ ... }); } }

  try { await game.settings.set(SYSTEM_ID, "schemaVersion", SCHEMA_VERSION); }
  catch (err) { console.error(`${SYSTEM_ID} | failed to store schema version`, err); }
}

/** Helper: valore di un'impostazione con fallback sicuro. */
export function tcSetting(key, fallback) {
  try { return game.settings.get(SYSTEM_ID, key); }
  catch (_e) { return fallback; }
}
