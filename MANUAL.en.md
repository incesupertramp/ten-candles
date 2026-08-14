# Ten Candles for Foundry VTT
## Installation & usage manual — v0.3.1

An **unofficial, fan-made** game system for playing *Ten Candles* (by Cavalry Games) on Foundry VTT.

> **Legal note.** This system contains only the **mechanical structures** needed to play: no official rulebook text is included. You must own a legally purchased copy of the *Ten Candles* rulebook to play. All narrative content (scenarios, modules, truths) is provided by your table.

---

## 1. Requirements

- **Foundry VTT v13** (verified). It also runs on **v14** (shown as "unverified", but enablable).
- No mandatory add-on modules.
- **Dice So Nice** is supported but **optional** (3D dice on rolls).
- **Webcams** on the board require Foundry's **A/V** enabled; **final recordings** require browser audio enabled.
- Language: **Italian** and **English** UI (follows your Foundry language setting).

---

## 2. Installation

Manual install (no public manifest yet).

**Step 1 — Copy the folder.** Extract `ten-candles.zip`: you get a `ten-candles/` folder. Copy it into:

```
.../FoundryVTT/Data/systems/ten-candles/
```

The correct path must have `ten-candles/system.json` (not a folder nested inside another).

**Step 2 — Restart Foundry** (quit and relaunch the app). After an update, also do a **hard refresh (F5)** in the client to clear the template cache.

**Step 3 — Create the world.** *Create World* → **Game System**: *Ten Candles*. Launch it.

**Check.** In the console (F12) you should see `ten-candles | Initializing…` and `… Ready`, with no red errors.

> Once the repository is public, installation via **Manifest URL** will be possible.

---

## 3. Preparing the game

### 3.1 Create characters and assign them

1. Sidebar → **Actors** → *Create Actor* → type **character** → name it.
2. **Assign each character to its player** (*Configure Player*, or drag the actor onto the user) so `game.user.character` points to the right character. **This is required for collaborative creation** (see §3.3), which assigns tasks based on the user's character.

### 3.2 Filling the sheet (manually)

| Field | What to write |
|---|---|
| **Concept** | Who the character is, in one line |
| **Virtue** | A positive trait, one word |
| **Vice** | A negative trait, one word |
| **Moment** | A personal goal: living it successfully grants a Hope die |
| **Brink** | The hidden "edge": unlocks once Moment and Traits are spent |
| **Final recording** | (optional) an audio file of the character's last words — see §4.7 |

Fields auto-save. Press **Edit** to open the editable inputs.

### 3.3 Guided collaborative creation (recommended)

In *Ten Candles* you don't pick your own traits: your neighbors write them for you. The system guides the ritual from the **tracker** (§5.3).

1. The **GM** presses **Start creation** (clears everyone's Virtue/Vice/Brink).
2. The flow advances in steps: **Virtue → Vice → Brink → Them**. Each step, every player sees *"Write a … for [neighbor]"* and a field:
   - **Virtue** → to the **right** neighbor
   - **Vice** and **Brink** → to the **left** neighbor

   On save, the text is written to the **target character** (the GM performs the write automatically, so there are no permission issues).
3. **Them** step: the **GM** defines the **Brink of the antagonist "Them"** ("I have seen Them…") and a **Brink for a chosen character** ("They have seen you…").
4. The GM sees a **checklist** of who has written, and controls **Next step** / **End**. At the end, the Brink of Them is announced in chat.

> Neighbors are computed via a **stable ring** (same order on every client).

### 3.4 Light the ten candles

Open the **board** (§5.2) or the tracker and press **New game**: candles to 10, player pool to 10, GM pool to 0, scene to 1.

---

## 4. How to play (the flow)

*Ten Candles* is tragic horror: you play in the dark, candles go out one by one, and in the end everyone dies. The system automates the mechanics; narration stays at the table.

### 4.1 Resources

- **Ten candles**: the dwindling resource. Never relit.
- **Player pool**: the shared dice. Each scene it refills to the **number of lit candles** (so it shrinks over time).
- **GM pool**: starts at 0 and grows (`10 − lit candles`). Used to contest narration.

### 4.2 The conflict roll

1. From the sheet, press **Conflict roll** (or **Dire conflict**).
2. A **chat card** appears: player pool, any Hope dice, GM pool.
   - Normal die: success on **6**. Hope die: success on **5–6**. The conflict **succeeds** with at least one success.
3. **Narration**: whoever has more **6s** narrates; on a tie, the GM narrates.
4. Before applying, if available:
   - **Burn Trait** — burn a Trait to **reroll all the 1s** (max one Trait per scene).
   - **Embrace Brink** — if you're failing/losing narration, **reroll your whole pool**. Succeed now and you keep the Brink; fail and the Brink burns, you lose Hope dice, and a candle goes out.
   - **Seize narration** — on a success where the GM would narrate, snuff a candle to take narration.
5. **Apply outcome**:
   - **Success**: 1s leave the pool (Hope dice don't).
   - **Failure**: a candle goes out and the scene changes.
   - In **The Last Stand**, failure means the character's **death**.

### 4.3 Hope, Moment, Brink

- **Living the Moment** (from the sheet) successfully grants a **Hope die** (counts as 6 for narration, not lost on a 1).
- The **Brink** stays *Locked* until you've **lived the Moment** and **burned both Traits**; then it becomes *Available*.

### 4.4 Interactive Truths (between scenes)

When a candle goes out (with **≥2 lit**), the **Truths phase** opens in the tracker:
- Opening ritual *"These things are true. The world is dark."*
- Anyone can **add a truth**: the list is shared and synced; the number of truths = **lit candles**.
- When complete, the phase **auto-closes** with *"And we are alive."* and a **chat summary**. The GM can close early.
- With the **last candle** (Last Stand) there's no collection: only *"And we are alive."* is spoken.

### 4.5 The Last Stand

With **one candle left**, *The Last Stand* begins: the board turns **red** and the ritual circle goes blood-colored. Every **failed** conflict is now the character's **death**.

### 4.6 End of game

Once the last candle goes out, the board shows *"The world is dark."*: the story is over.

### 4.7 Final recordings (audio) with a "tape recorder" effect

Each character can have a **final recording**: their last message, played at the end.
- **Upload**: on the sheet, **Final recording** section, use the 🎙 button (FilePicker) to choose a **clean audio file** (mp3/ogg/wav). The field is GM-only until played.
- **Effect**: playback applies a **real-time** lo-fi **old tape recorder** distortion (narrow band, saturation, wow/flutter, hiss). You upload the clean file: Foundry does the distortion.
- **Playback**: at **game over**, the tracker shows **"Play final recordings"** (played in sequence). The GM can preview one from the sheet (▶) or use `game.system.api.playRecordings()`.
- Audio is **broadcast to all** clients (each processes it locally); if Web Audio is unavailable, there's a **fallback** to clean playback.

---

## 5. The interface

### 5.1 Character sheet

Each section is a "card" with visual states: **burned Trait** charred; **lived Moment** dim amber; **Brink** with a *Locked/Available/Burned* label; **Hope** as an amber die with +1/Reset; **Conflict roll** (amber) and **Dire conflict** (blood). At the bottom, the **Final recording** (§4.7).

### 5.2 Board — the seance (top-down view)

The board is a **top-down seance**, generated by geometry:
- A **round wooden table** (rim, grain, shadow) holding a rectangular **ouija board** (OUIJA, YES/NO, sun/moon, A-Z, numbers, GOOD BYE).
- **Ten candles in a ring** on the table's edge: flickering flames, rising **smoke**, a **warm pool** of light on the wood; when out, cold wax.
- **Player webcams** in a circle around the table (2–6, auto-placed).
- At the center, a **planchette** holding the **master's ("spirit") webcam**: it **slides** toward a letter **when the master acts** (snuffs a candle / changes scene), with a **glowing trail**.
- A **ritual circle** (pentagram) that **intensifies** as candles dwindle; in **Last Stand** it goes blood-red with a **red wash**.
- Top: lit candles, scene, pools.

Open it: the **flame button** in the toolbar, or `game.system.api.openBoard()`.

Controls: the **GM** can snuff candles and use **Darken a candle** / **New game**; players see the board update in real time.

### 5.3 Compact tracker

A small window with candle pips, pools and scene, plus **Open full board**. It's also the **director's panel**: here you'll find the **Truths panel** (§4.4), the **collaborative creation panel** (§3.3), and, at game over, **Play final recordings**. Open it with `game.system.api.openTracker()`.

### 5.4 Conflict card (in chat)

Shows the dice: **6** amber spark (success), **1** blood-dim die (lost), **Hope** dashed. Below: outcome, narration, and action buttons.

---

## 6. Roles & permissions

Shared state (candles, pools, scene, Truths phase, creation) is single for the table: only the **GM** changes it. Player actions that change shared state (or write to a neighbor's character during creation) are **relayed to the GM**, the sole authoritative "writer" — so no conflicts or double execution. **Recordings** are the exception: they are **broadcast to all** because each client must process the audio locally. If no GM is connected, an action requiring one warns that no active GM is present.

---

## 7. Useful commands

| Command | Effect |
|---|---|
| `game.system.api.openBoard()` | Open the board (seance) |
| `game.system.api.openTracker()` | Open the compact tracker |
| `game.system.api.playRecordings()` | Play final recordings in sequence |
| `game.system.api.debugCameras()` | Diagnose webcams on the board |
| `game.system.api.GameState.candlesLit` | Read how many candles are lit |
| `game.system.api.GameState.newGame()` | (GM) New game |

---

## 8. Under the hood (technical)

- **Structure**: `system.json` (manifest), `module/` (ES modules), `templates/` (Handlebars), `styles/` (CSS), `lang/` (en, it).
- **Character data**: `module/data/character.mjs` (DataModel), including `recording {path, hidden}`.
- **Methods**: `module/documents/actor.mjs` (burn Trait, live Moment, die/revive, `playRecording`, `playAllFinalRecordings`).
- **Shared state**: `module/apps/game-state.mjs` — a **GM-authoritative** world setting with a **socket relay**; handles candles, pools, scene, **Truths**, and **collaborative creation** (including GM/"Them" Brinks).
- **Tape audio**: `module/apps/tape-audio.mjs` — a Web Audio lo-fi effect + **socket broadcast** for local playback on every client.
- **Dice engine**: `module/apps/dice-engine.mjs`.
- **Interface**: `sheets/character-sheet.mjs`, `apps/board.mjs` (top-down board generated by geometry), `apps/candle-tracker.mjs` — all ApplicationV2.
- **Graphics**: `styles/tokens.css` (design tokens) + `styles/ten-candles.css`.

---

## 9. Assumptions & known limits

- **Brink unlock**: "Moment resolved" (regardless of outcome) **and** both Traits burned.
- **Failed Embrace Brink in Last Stand**: applies the character's death.
- **Clicking a candle**: state keeps a *count* of candles, not each one's identity.
- **Collaborative creation**: requires each user to have an **assigned character**; a GM without a character sees only the director controls. The **Them / GM Brink** is currently written by the GM (director), not yet auto-assigned by seat position.
- **Recordings**: effect parameters and cross-client sync are tuned "by ear" and need live testing; autoplay depends on browser policies.

---

## 10. Troubleshooting

| Problem | Fix |
|---|---|
| System doesn't appear in *Create World* | Check `Data/systems/ten-candles/system.json`. Restart Foundry. |
| After an update I see the old version | Re-extract the zip and **hard refresh (F5)** the client (template cache). |
| No flame button in the toolbar | Use `game.system.api.openBoard()` (scene-controls API differs between v13/v14). |
| Webcams don't show on the board | Enable Foundry A/V; then `game.system.api.debugCameras()` to diagnose. |
| Flames/animations don't move | You have `prefers-reduced-motion` on: intended. |
| A player doesn't get a state change | A connected GM is required (they write the state). |
| Creation assigns me no task | Make sure the user has an **assigned character**. |
| A recording won't play | Check the audio path is valid and browser audio is unlocked (a first interaction). |

---

## 11. What's missing / next

- Creation: **progressive candle lighting** (3+3+3+1) and auto-assignment of GM/"Them" Brink by seat.
- Truths: **turn order** (clockwise) and who states the **first** truth.
- Planchette: GM **manual** control to spell words; sound effect.
- Snuffing the **exact** clicked candle; versioned schema migrations.
- Distribution: **public manifest** and automated releases.

---

## Appendix — Mechanic → system map

| Mechanic | Where | Note |
|---|---|---|
| Candles 10→0 | `GameState.darkenCandle()` | Never relit |
| Player pool = lit candles | `GameState` | Refill each scene |
| GM pool = 10 − lit | `GameState` | Grows over time |
| Success 6 / Hope 5-6 | `DiceEngine` | Only 6s narrate |
| Discard 1s on success | `DiceEngine` → `loseDice()` | Hope on a 1 isn't lost |
| Burn Trait | `actor.burnTrait()` | Rerolls 1s; 1 Trait/scene |
| Moment → Hope | `actor.liveMoment()` | +1 Hope on success |
| Brink (embrace) | `DiceEngine` + `burnBrink()` | Rerolls the whole pool |
| Interactive Truths | `GameState` (Truths phase) | Shared collection, choral close |
| Collaborative creation | `GameState` (creation) | Virtue/Vice/Brink to neighbors + Them step |
| Recordings + tape effect | `actor.playRecording()` + `TapeAudio` | Broadcast, local lo-fi effect |
| Last Stand (fail → death) | `DiceEngine` + `die()` | 1 candle lit |
