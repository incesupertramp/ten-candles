/**
 * Ten Candles — System entry point.
 *
 * FASE 1 (funzionalità) — completa:
 *   - Comp. 2: CONFIG.TEN_CANDLES + DataModel `character`.
 *   - Comp. 3: Document class TenCandlesActor.
 *   - Comp. 4: character sheet (ApplicationV2).
 *   - Comp. 5a: stato condiviso (candele + pool) + tracker.
 *   - Comp. 5b: motore dadi (conflict roll interattivo in chat).
 */

import { TEN_CANDLES, SYSTEM_ID, SCHEMA_VERSION } from "./config.mjs";
import { CharacterData } from "./data/character.mjs";
import { SupplyData } from "./data/supply.mjs";
import { TenCandlesSupplySheet } from "./sheets/supply-sheet.mjs";
import { TenCandlesActor } from "./documents/actor.mjs";
import { TenCandlesCharacterSheet } from "./sheets/character-sheet.mjs";
import { GameState } from "./apps/game-state.mjs";
import { TenCandlesTracker } from "./apps/candle-tracker.mjs";
import { TenCandlesBoard } from "./apps/board.mjs";
import { DiceEngine } from "./apps/dice-engine.mjs";
import { TapeAudio } from "./apps/tape-audio.mjs";
import { TenCandlesSafety } from "./apps/safety.mjs";
import { registerSystemSettings, runMigrations } from "./settings.mjs";

export { SYSTEM_ID };

/* -------------------------------------------- */
/*  Init                                        */
/* -------------------------------------------- */
Hooks.once("init", () => {
  console.log(`${SYSTEM_ID} | Initializing Ten Candles system`);

  CONFIG.TEN_CANDLES = TEN_CANDLES;

  CONFIG.Actor.dataModels.character = CharacterData;
  CONFIG.Actor.documentClass = TenCandlesActor;
  CONFIG.Item.dataModels.supply = SupplyData;
  try {
    foundry.applications.apps.DocumentSheetConfig.registerSheet(Item, SYSTEM_ID, TenCandlesSupplySheet, {
      types: ["supply"], makeDefault: true, label: "Ten Candles — Supply"
    });
  } catch (e) { console.warn("ten-candles | registrazione scheda supply non riuscita", e); }

  foundry.documents.collections.Actors.registerSheet(SYSTEM_ID, TenCandlesCharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "TENCANDLES.SheetCharacter"
  });

  GameState.registerSettings();
  registerSystemSettings();
});

/* -------------------------------------------- */
/*  Ready                                       */
/* -------------------------------------------- */
Hooks.once("ready", () => {
  console.log(`${SYSTEM_ID} | Ready (schema v${SCHEMA_VERSION})`);

  // Relay player → GM autorevole per lo stato condiviso.
  GameState.registerSocket();
  TapeAudio.register();
  runMigrations();

  // Listener delegato per i bottoni delle card di conflitto.
  DiceEngine.activateListeners();

  // API pubblica: game.system.api.openTracker();
  game.system.api = {
    GameState,
    DiceEngine,
    openTracker: () => new TenCandlesTracker().render(true),
    openBoard: () => new TenCandlesBoard().render(true),
    // Riproduce in sequenza tutte le registrazioni finali (test/GM).
    playRecordings: () => CONFIG.Actor.documentClass.playAllFinalRecordings(),
    pointPlanchette: (ch) => GameState.pointPlanchette(ch),
    spellWord: (text) => GameState.spellWord(text),
    openSafety: () => new TenCandlesSafety().render(true),
    // Diagnostica webcam: elenca i <video> presenti e l'utente associato.
    debugCameras: () => {
      const rows = [];
      document.querySelectorAll("video").forEach((v) => {
        const holder = v.closest("[data-user-id],[data-user]");
        rows.push({
          hasStream: !!v.srcObject,
          user: holder?.getAttribute("data-user-id") || holder?.getAttribute("data-user") || null,
          videoClass: v.className || null,
          parentClass: v.parentElement?.className || null
        });
      });
      console.table(rows);
      return rows;
    }
  };
});

/* -------------------------------------------- */
/*  Pulsante toolbar (best-effort v13/v14)      */
/*  Fallback garantito: game.system.api.openTracker() */
/* -------------------------------------------- */
Hooks.on("getSceneControlButtons", (controls) => {
  try {
    const tool = {
      name: "ten-candles-board",
      title: game.i18n.localize("TENCANDLES.Board.Title"),
      icon: "fa-solid fa-fire",
      button: true,
      order: 100,
      // onChange è il metodo valido su v13 e v14 (onClick è deprecato in v14).
      onChange: () => new TenCandlesBoard().render(true)
    };
    if (Array.isArray(controls)) {
      const tokens = controls.find((c) => c.name === "token") ?? controls[0];
      if (tokens?.tools && Array.isArray(tokens.tools)) tokens.tools.push(tool);
    } else if (controls?.tokens?.tools) {
      controls.tokens.tools[tool.name] = tool;
    }
  } catch (err) {
    console.warn(`${SYSTEM_ID} | Scene control button skipped:`, err);
  }
});

// Preset Dice So Nice (facoltativo): si registra solo se il modulo è presente.
Hooks.once("diceSoNiceReady", (dice3d) => {
  try {
    dice3d.addColorset({
      name: "ten-candles",
      category: "Ten Candles",
      description: "Ten Candles — cera & ambra",
      foreground: "#f0c877",
      background: "#2a1a0e",
      outline: "#7a5a2c",
      edge: "#d9701f",
      material: "glass",
      font: "Georgia",
      default: false
    }, "default");
  } catch (e) { console.warn("ten-candles | Dice So Nice preset non registrato", e); }
});
