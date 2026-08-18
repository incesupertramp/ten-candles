# Changelog

## v0.4.2 — Portraits on the board (webcam fallback)

- The "face" slots around the table now show the **character portrait** (or the user's avatar) when **no live webcam stream is available**. Handy when Foundry A/V isn't available (it needs HTTPS/secure context): the seance stays populated without SSL. If a webcam stream is present, the video overlays as before; if neither portrait nor webcam exist, the initial is shown.

## v0.4.1 — System cover image

- Added the system **cover image** (`assets/cover.png`) via the manifest `media` (cover + setup) and `background` fields: the "Ten Candles" tile in Foundry's system browser now shows the title art instead of being blank.

## v0.4.0 — Table safety, scenario, book of truths

- **Safety tools**: a new **Scenario & Safety** app (tracker button, `game.system.api.openSafety()`). It includes an **X-Card** anyone can tap (a chat announcement to pause/adjust a scene) and shared **Lines & Veils** from Session Zero.
- **Module text**: the GM writes the setting and opening; it's shown in chat at New game.
- **Book of Truths**: a **persistent** log collecting every established truth, scene by scene (they used to only go to chat and reset). EN/IT localization.

## v0.3.9 — Ordered turns + planchette idle

- **Truths turn order**: the **first truth** goes to whoever **failed/seized** the conflict (otherwise the GM); then the turn **advances clockwise** with each submitted truth. The GM can always override the turn.
- **Planchette idle**: at rest the planchette **sways** gently (in addition to the pulsing aura), without interfering with position and rotation. Respects settings and prefers-reduced-motion.

## v0.3.8 — Polish: living planchette, audio, rich-text notes

- **Planchette on narration**: when the GM posts to chat (not rolls/whispers/system announcements) the **spirit stirs** with a glow on the board.
- **Planchette sound** (optional, default off): a soft procedural slide when the planchette moves.
- **Ambient audio** (optional, default off): a subtle candle **crackle** while the board is open.
- **ProseMirror notes**: the sheet's notes now use a rich-text editor instead of a textarea.

## v0.3.7 — Candle identity, turn order, supplies

- **Candle identity**: state moves from a count to an **array** of lit/unlit. On the board the **GM clicks the exact candle** to snuff; the snuff animation plays on the right candle. The "Darken" button stays as a shortcut (snuffs a lit one).
- **Turn order**: the GM can **assign the turn** to a character (a "Turn: …" indicator for everyone) during Truths and creation.
- **Supplies / equipment**: a new **supply** item type with **quantity and consumption**; a section on the character sheet (add, +1, use one, remove) and a dedicated item sheet. Added `documentTypes` to the manifest.

## v0.3.6 — Spelling planchette, dice preset, v14, CI

- **Manual planchette (GM)**: from the tracker the master can make the planchette **spell out a word**, pointing at letters in sequence (sliding between them). API: `game.system.api.spellWord("…")` and `pointPlanchette("A")`; "Auto" returns to automatic behavior.
- **Dice So Nice preset** in a wax/amber theme (registered only if the module is present).
- **v14 compatibility**: `compatibility.verified` bumped to "14".
- **CI**: a **lint/validation** workflow (node --check, JSON, ESLint) with `eslint.config.js` and `package.json`.

## v0.3.5 — Brink secrecy + persistent "Them"

- **Brink secrecy**: on the sheet, the Brink value is **masked** for anyone who isn't the owner or GM (only you and the GM can see it).
- **"Them" as an entity**: once defined, the antagonist appears in a **persistent panel** in the tracker with its Brink, as the table's shared threat.

## v0.3.4 — Martyrdom + snuff animation

- **Martyrdom**: a **dead** character's sheet shows a control to **gift a Hope die** to a chosen survivor (announced in chat). The write goes through the GM-authoritative channel.
- **Snuff animation**: when a candle goes out, its **flame fades** and a **puff of smoke** rises on the board. Respects the animations setting and prefers-reduced-motion.

## v0.3.3 — System settings + migration scaffold

- New **settings** (Configure Settings): **board animations** on/off (per user); **tape-recorder effect** on/off and adjustable **intensity** (0.3–1.6, world-scoped).
- **Schema migrations**: a `ready` hook comparing `schemaVersion`, ready for future migrations (no transformation needed at v1).

## v0.3.2 — Creation: progressive candles + Moment step

- During **collaborative creation**, candles now light **progressively**: 3 (Traits) + 3 (Moments) + 3 (Brinks) + 1 (final) → 10, lighting up on the board as the GM advances the steps.
- Added the **Moment** step to the flow (each player writes their **own** Moment): now Virtue → Vice → Moment → Brink → Them → done.
- At the end of creation the state is game-ready (10 candles, pools 10/0, scene 1). EN/IT localization.

## v0.3.1 — Creation: the "Them" step (GM Brink + antagonist)

- New **"Them"** step in the creation flow: the GM writes the **Brink of the antagonist "Them"** (announced in chat at the end of creation) and a **Brink for a chosen character** ("They have seen you…").
- Step order is now: Virtue → Vice → Brink → **Them** → done.
- EN/IT localization.
- *To refine* (TODO): auto-assignment by the GM's left/right seat and having the designated player write the Brink of Them; progressive candle lighting.

## v0.3.0 — Collaborative creation (first milestone)

- **Guided creation flow** in the tracker: the GM starts creation; step by step (Virtue → Vice → Brink) each player writes the field for their **neighbor** — **Virtue to the right neighbor**, **Vice and Brink to the left neighbor** — and the write lands on the target character via the GM-authoritative channel.
- The GM sees a **checklist** of who has written and controls step advance/end.
- EN/IT localization.
- **Still to do** (in the TODO): GM Brink + the "Them" antagonist, progressive candle lighting, "card" passing with turn order.

## v0.2.11 — Recordings with a "tape recorder" effect

- Final recordings play with a **real-time lo-fi effect** (Web Audio): narrow band, "boxy" mid boost, saturation, **wow/flutter**, and **tape hiss**. You upload a clean file (mp3/ogg/wav); Foundry does the distortion.
- Playback is **broadcast via socket** and processed locally by each client (same audio for everyone), with a **fallback** to plain playback if Web Audio isn't available.

## v0.2.10 — Recording: always-visible section

- The **final recording** is now **always visible** on the sheet (no longer only in edit mode): field + FilePicker button for the owner, listen button for the GM.
- Added the `game.system.api.playRecordings()` shortcut to test playback without reaching game over.

## v0.2.9 — Final recordings (audio finale)

- New **final recording** field on the character (`recording.path`, GM-only).
- On the sheet: an **audio FilePicker** to upload the last message (in edit mode) and a listen button for the GM.
- **Broadcast** playback to the whole table (`AudioHelper.play(..., true)`) and a **"Play final recordings"** button in the tracker at game over, playing them **in sequence**.
- EN/IT localization updated.

## v0.2.8 — Interactive Truths + smooth planchette

- **Block B — Interactive Truths**: when a candle goes out (≥2 lit) the Truths phase opens in the tracker — opening ritual, a shared and synced collection of truths (anyone adds them), progression N = lit candles, auto-close with "And we are alive" and a chat summary. The GM can close early.
- **Planchette**: now **slides** toward the new letter when the master acts, with a **glowing trail** that fades (respects prefers-reduced-motion).

## v0.2.7 — Italian localization

- **Full Italian translation** (`lang/it.json`, 91 strings) and registration of the language in the manifest: sheets, tracker, board, conflict cards, and notifications in Italian.
- Updated the TODO with the ouija planchette features.

## v0.2.6 — Seance board (top-down)

- **Board redesigned from scratch** in a top-down view, generated by geometry: a round wooden table with an **ouija board** (OUIJA, YES/NO, sun/moon, A-Z, numbers, GOOD BYE).
- **Master planchette** with the GM's webcam pointing at a letter, moving when the master acts (snuffs candles / changes scene).
- **10 candles in a ring** with smoke, a warm pool of light on the wood, and cold wax when out.
- **Player webcams in a circle** around the table (2–6, adaptive).
- **Ritual circle** (pentagram) that intensifies as candles dwindle; **Last Stand** with a red wash and blood-colored ritual. Animations disabled with prefers-reduced-motion.

## v0.2.5 — Seance: geometry and screen fill

- **Smaller round table** with chairs **all around** and visible (before, the side ones were covered by the table).
- **Larger, clearer central planchette**, with the spirit slot easily readable.
- **The scene fills the board area** instead of staying small and centered.
- Thinner curtains and repositioned top info.

## v0.2.4 — Seance

- **Player chairs in a full circle** around the table (2–4, adaptive), with a gap at the top for info.
- **No chair for the GM**: at the center a **planchette** with the spirit slot (GM webcam), a pulsing amber halo, and a "THE SPIRIT" label.
- Info (candles/scene/pools) moved to the top; the board stays tied to the data and the theatrical staging.

## v0.2.3 — Scenic touches

- **Light smoke** rising from lit candles; warm **pools of light** under each.
- **Cold wax** accumulating around snuffed candles.
- **Dust motes** floating in the spotlight beam and a gentle **breathing** of the light.
- **Last Stand reactivity**: footlights and spotlight dim, a red veil descends over the scene (and disappears at game over).
- Long names elegantly truncated on the chairs. All animations respect prefers-reduced-motion.

## v0.2.2 — Theatrical board

- **Stage**: burgundy curtains and a valance frame the scene, a perspective stage floor with footlights, a spotlight on the table, and vignetting.
- **Ritual circle** engraved around the players, which **intensifies as the candles go out** (and turns to blood in the Last Stand).

## v0.2.1 — Redesigned sheet

- **Candlelit restyle** consistent with the table: Traits as cards (charring when burned), Moment and Brink in bands, Brink lighting up on its own when available.
- **Hope as clickable flames** (click to light/snuff) instead of +/reset buttons.
- **Read mode + Edit button**: fields are read-only until you press "Edit".
- **Alive/dead state** from the top flame (dims the sheet when dead).

## v0.2.0 — Block A: Conflicts

- **GM always narrates failed conflicts** (except on seize or voluntary death).
- **Seize on failure**: taking narration of a failed conflict costs an additional candle (2 total); on success it stays 1.
- **Dire + voluntary death**: on a failed dire, "Choose death" appears — the PC dies and narrates the failed conflict.
- **Live Moment as a real roll**: a new sheet button that plays the Moment as a conflict (automatic Hope on success); the manual success/fail buttons remain too.

## v0.1.9

- **Webcams in slots (experimental)**: each chair shows its user's Foundry A/V video inside the circular face slot; if there's no stream (A/V off or no camera) the placeholder remains.
- Diagnostic command: `game.system.api.debugCameras()`.

## v0.1.8

- **Chairs per player account** (not only connected ones): shows 2 to 4 chairs based on configured players.
- **Readable central info**: moved to the free top-center band with a small dark panel behind it (previously covered by the front candle).

## v0.1.7

- **Board as a perspective table-scene**: a wooden table seen from above with a pool of light, ten realistic candles (wax, drips, flame with halo and flicker) in a wide ring.
- **Adaptive chairs**: 2 to 4 players in a semicircle based on connected players, GM opposite; each chair has a face slot (placeholder, ready for webcams).
- **Info at the center of the ring** (lit candles, Scene, Player, GM): always readable.

## v0.1.6

- **Close ✕ in the left bar** (free area), instead of top-right.
- **Board controls and text raised** so they don't end up under Foundry's bars (hotbar) and stay visible/clickable.
- Removed the internal title bar that overlapped the left toolbar (the Last Stand is still signaled by the red medallion).

## v0.1.5

- **Board in the background**: now fullscreen but BELOW Foundry's interface (reads the real z-index of #interface). Toolbar, sidebar, and chat stay above and usable.
- **Floating close button**: an always-on-top ✕ to close the board (the internal ✕ would stay under the toolbars). Darken/New game are used from the tracker; clicking the central candles stays active.

## v0.1.4

- **Board visible again**: back to covering the screen (high z-index), but leaves the right sidebar column uncovered, so chat stays usable. Calculation based on the sidebar's left edge (reliable on v13/v14).

## v0.1.3

- **Board correctly placed**: inserted inside Foundry's interface, above the canvas but below the UI. Sidebar, chat, and controls stay above and clickable; no more overlaps.

## v0.1.2

- **Non-intrusive board**: now covers only the canvas area; Foundry's sidebar, chat, and controls stay visible and clickable.
- **In-board New game confirmation**: no more popup hidden under the board; the confirmation appears among the board controls.

## v0.1.1

Fixes for Foundry v14.

- **Fullscreen board**: restored the board CSS (accidentally removed) and forced the overlay to cover the screen above the interface (high z-index). The board now opens correctly on v13 and v14.
- **Toolbar button**: removed the deprecated `onClick` in favor of `onChange` (no more deprecation warning on v14).

## v0.1.0

First release.

- Full mechanics: ten candles, synced player/GM pools, interactive conflict roll (success 6 / hope 5-6, discard of 1s, narration rights), Trait/Moment/Brink, The Last Stand, end of game.
- Candlelight graphics: a fullscreen circular board, themed character sheet and conflict card, flame flicker, respect for `prefers-reduced-motion`.
