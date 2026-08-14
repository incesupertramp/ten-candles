# Ten Candles — Feature ToDo

Roadmap of features **new** relative to v0.1.0. Priority: 🔴 high · 🟡 medium · 🟢 low.
The "Game mechanics" section comes from a direct check against the official rulebook: it distinguishes what's **missing** from what's **partial**.
Legend: `[x]` done · `[~]` partial · `[ ]` not started.

---

## Game mechanics (checked against the rulebook)

### Character creation (collaborative)
- [~] 🔴 **Trait card-passing** — guided flow in the tracker: everyone writes the **Virtue for the right neighbor** and the **Vice for the left neighbor**; writes land on the target character via the GM-authoritative channel. **Done**: the neighbor-assignment engine; **to refine**: real "card" passing and turn order.
- [~] 🔴 **Neighbor-written Brinks** — "brink" step: everyone writes the Brink for the **left** neighbor. **Done** in the guided flow.
- [~] 🔴 **GM Brink and the "Them" antagonist** — **"Them"** step in the flow: the GM writes the **Brink of Them** (antagonist, announced in chat at the end of creation) and a **Brink for a chosen character** ("They have seen you…"). **Done** as GM direction; **to refine**: auto-assignment by seat position (left/right of the GM) and having the designated player write the Brink of Them.
- [ ] 🟡 **Progressive candle lighting** — 3 (Traits step) + 3 (Moments step) + 3 (Brinks step) + 1 (before the first scene / recording). *Missing* (today New game = 10 at once).
- [ ] 🟡 **Module intro** — an area for the scenario text and the opening "These things are true. The world is dark." *Missing*.

### Truths phase (between scenes)
- [~] 🔴 **Interactive Truths** — tracker panel with the ritual opening, a shared collection of truths (anyone adds them, synced), progression N = lit candles, auto-close with **"And we are alive"** + a chat summary. **Done**: the interactive flow; **still to do**: turn order (clockwise) and the rule on who states the **first** truth (failed/seized → GM).
- [x] 🟡 **Truths register** — collected truths appear as a list in the tracker and are summarized in chat at the end of the ritual.

### Conflict resolution
- [x] 🔴 **Live Moment as a real conflict** — living the Moment rolls a real conflict; the Hope die arrives automatically on success.
- [x] 🟡 **Seize on a failed conflict** — snuff an **additional** candle (2 total) to take narration of a failure.
- [x] 🟡 **Full Dire conflict** — grave consequences + **voluntary death**: on a failed dire, a player may choose to die and **win narration** of the failed conflict.
- [x] 🟢 **GM always narrates failed conflicts** (except voluntary death) — rule enforcement in narration.

### Death and candles
- [ ] 🟡 **Martyrdom** — a heroic death grants a Hope die to another survivor. *Missing*.
- [ ] 🔴 **Candle identity** — snuff *exactly* the clicked candle (today the last lit one of the ring goes out). Requires an array of candle states instead of a count. *Partial/cosmetic*.

### Character and antagonist
- [ ] 🟡 **Brink secrecy** — hide the Brink value from non-owners (only your own and your left neighbor's visible). *Partial* (concept exists, not ownership).
- [ ] 🟡 **"Them" representation** — the antagonist as an entity/actor defined by the Brink of the player to the GM's right. *Missing*.
- [ ] 🟢 **Supplies / equipment** (Step Seven) — an optional item type for gear. *Missing*.

---

## Final recordings

The finale's emotional mechanic: each player records a last message for their character; the GM keeps them and plays them **at the end** (after the last candle). It's not just graphics: it touches `die()` and game over.

- [x] 🟡 **Data** — `recording = { path, hidden }` field on the character DataModel; `hidden` by default → GM-only (protects the surprise).
- [ ] 🟡 **Option A — manual via Discord voice** — players record with a phone/Discord, the GM plays them in voice. *No code*, faithful to the ritual.
- [x] 🟡 **Option B — in-app (recommended)** — upload an audio file on the sheet (`FilePicker`), **broadcast** playback, with automatic triggers on `actor.die()` and at **game over** (all in sequence) + GM control to play/replay.
- [ ] 🟢 **Option C — in-app recording** — `MediaRecorder` inside an ApplicationV2 app, saved to the Foundry server. *High effort, after B*.
- [~] 🟡 **Privacy** — recordings stay hidden from players until playback (GM-only flag).
- [x] 🟢 **"Tape recorder" effect** — real-time lo-fi distortion (narrow band, saturation, wow/flutter, hiss) applied in Foundry via Web Audio; the user uploads a clean file.

---

## Discord integration

- [ ] 🟢 **Foundry → Discord webhook** — post game events to a channel (candle out, The Last Stand, character death). Independent, low effort, **one-way**.
- Note: **synced** recording audio does **not** go through Discord (separate channels) but through in-app Web Audio; Discord stays great for table **voice** and for **manual** recording playback.

---

## Ouija planchette (spirit/GM)

- [x] 🟡 **Smooth movement** — the planchette **slides** toward the target letter instead of jumping (computing the position delta between renders in `_onRender`).
- [x] 🟡 **Glowing trail** — a faint amber trail behind the planchette as it moves.
- [ ] 🟡 **Trigger on GM narration/action** — move the planchette when the master **narrates/acts** (not only on candle snuff): a dedicated event hook + an optional `game.system.api.pointPlanchette(char)` API.
- [ ] 🟢 **Manual GM control** — the master can point the planchette at a **specific letter/word** (input or click) to "spell" a spirit message.
- [ ] 🟢 **Sound effect** — a light wood/slide sound when the planchette moves (with a toggle).
- [ ] 🟢 **Rhythmic idle** — micro-oscillation at rest (the halo pulse already exists), optional via settings.

---

## UX & quality

- [ ] 🟡 **Snuff animation** — flame fade + smoke burst when a candle goes out.
- [x] 🟡 **Italian localization** (`lang/it.json`) and structure for other languages — complete (EN/IT).
- [ ] 🟡 **System settings** (`game.settings`) — toggles: animations on/off, board behavior, Dice So Nice.
- [ ] 🟡 **Consolidated toolbar button** — clean handling of the v13 **and** v14 scene-controls APIs (remove the best-effort).
- [ ] 🟢 **ProseMirror** for sheet notes (today a textarea).
- [ ] 🟢 Optional **ambient audio** (crackle/candle) with a toggle.
- [ ] 🟢 Themed **Dice So Nice preset** (wax/amber dice).
- [ ] 🟢 **Schema migrations** — a `ready` hook that compares `schemaVersion` and runs migrations.

## Distribution & infrastructure

- [ ] 🔴 **LICENSE** — a license for the **code**, with wording that separates your work from the protected *Ten Candles* content.
- [ ] 🟡 **v14 verification** and a `compatibility.verified` bump.
- [x] 🟡 **CHANGELOG.md** and release notes per version — maintained at every version.
- [ ] 🟢 **Lint/validation CI** in the GitHub Action (ESLint + JSON/manifest checks before release).
- [~] 🟢 **English README/manual** + screenshots/gifs for the Foundry community — README + `MANUAL.en.md` present; screenshots/gifs missing.
