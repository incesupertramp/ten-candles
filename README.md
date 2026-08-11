# Ten Candles — Unofficial Foundry VTT Game System

![Foundry](https://img.shields.io/badge/Foundry-v13%20%7C%20v14-informational)
![Version](https://img.shields.io/badge/version-0.1.9-orange)
![License](https://img.shields.io/badge/code%20license-MIT-green)
![Status](https://img.shields.io/badge/status-beta-yellow)

An **unofficial, fan-made** game system that brings *Ten Candles* — the tragic horror storytelling game by **Cavalry Games** — to Foundry Virtual Tabletop. It recreates the ten dwindling candles, the shrinking dice pool, and the collaborative descent into the dark, wrapped in a candlelit table scene.

> ⚠️ **Legal / disclaimer.** This project contains **only the game's mechanics** — **no rulebook text is included**. You must own a legally purchased copy of *Ten Candles* to play. All narrative content (scenarios, "modules", truths) is provided by your group. *Ten Candles* and its trademarks belong to Cavalry Games; this project is not affiliated with or endorsed by them.

---

## ✨ Features

**Mechanics**
- Ten shared candles as a dwindling resource, with automatic scene changes and refills.
- Player dice pool (= lit candles) and GM dice pool (= 10 − lit), synced across all clients.
- Interactive **conflict rolls** in chat: success on 6, Hope die on 5–6, loss of 1s, narration rights.
- **Traits** (Virtue / Vice), **Moment** (→ Hope die) and **Brink** (embrace to reroll the pool).
- **The Last Stand** and end-of-game handling, plus the ritual "These things are true…" prompts.

**The table**
- A **candlelit table scene** rendered in perspective, with ten volumetric, flickering candles.
- **Adaptive seating**: 2–4 player chairs plus the GM opposite, based on your configured players.
- **Face slots** on every chair that stream each user's **webcam** (experimental), with graceful fallback.
- Fully vector (SVG), scales crisply, and respects `prefers-reduced-motion`.

---

## 📦 Requirements

- **Foundry VTT v13** (verified). Runs on **v14** (shown as unverified but enabled).
- No dependencies. **Dice So Nice!** is supported but optional.
- For webcam slots: enable Foundry's **Audio/Video** system.

## 🚀 Installation

**Via Manifest URL (recommended)** — in Foundry: *Game Systems → Install System*, then paste:

```
https://github.com/incesupertramp/ten-candles/releases/latest/download/system.json
```

**Manual** — download the latest `ten-candles.zip` from [Releases](https://github.com/incesupertramp/ten-candles/releases), extract it into your Foundry `Data/systems/` folder (so that `Data/systems/ten-candles/system.json` exists), and restart Foundry.

## ▶️ Quick start

1. Create a world using the **Ten Candles** system.
2. Create **character** actors and fill in Concept, Virtue, Vice, Moment and Brink.
3. Open the **board** — the flame button in the toolbar, or `game.system.api.openBoard()`.
4. As GM, press **New game** to light the ten candles, then play: roll conflicts from a character sheet, and darken candles as the dark closes in.

A full guide is available in **[MANUALE.pdf](MANUALE.pdf)** (Italian).

## 🖼️ Screenshots

<!-- Add your screenshots here, e.g.: ![The table](docs/board.png) -->
*Coming soon.*

---

## 🗺️ Roadmap

Planned mechanics and features are tracked in **[TODO.md](TODO.md)** — including the collaborative character-creation card passing, interactive Truths, dire conflicts and martyrdom, final recordings, and localization. Changes per release are in **[CHANGELOG.md](CHANGELOG.md)**.

## 🤝 Contributing

Issues and pull requests are welcome. Please keep contributions focused on **mechanics and interface** only — never include text or artwork from the *Ten Candles* rulebook.

## 📄 License

The **code** in this repository is released under the **MIT License** (see `LICENSE`). This license covers the code only and does **not** extend to *Ten Candles*, which remains the intellectual property of Cavalry Games.

## 🙏 Credits

- *Ten Candles* © **Cavalry Games**.
- System development: **incesupertramp**.

---
---

# Ten Candles — Game System non ufficiale per Foundry VTT

Sistema di gioco **non ufficiale, fan-made** che porta *Ten Candles* — il gioco di narrazione horror tragico di **Cavalry Games** — su Foundry Virtual Tabletop. Ricrea le dieci candele che si spengono, il pool di dadi che si assottiglia e la discesa collaborativa nel buio, dentro una scena-tavolo a lume di candela.

> ⚠️ **Nota legale.** Questo progetto contiene **solo le meccaniche** del gioco — **nessun testo del manuale è incluso**. Per giocare serve possedere una copia regolarmente acquistata di *Ten Candles*. Tutti i contenuti narrativi (scenari, "moduli", verità) li fornisce il tuo gruppo. *Ten Candles* e i relativi marchi appartengono a Cavalry Games; questo progetto non è affiliato né approvato da loro.

---

## ✨ Funzionalità

**Meccaniche**
- Dieci candele condivise come risorsa che cala, con cambio scena e refill automatici.
- Pool dadi giocatori (= candele accese) e pool GM (= 10 − accese), sincronizzati su tutti i client.
- **Tiri di conflitto** interattivi in chat: successo su 6, Hope die su 5–6, scarto degli 1, diritti di narrazione.
- **Trait** (Virtue / Vice), **Moment** (→ Hope die) e **Brink** (da abbracciare per ritirare il pool).
- **The Last Stand** e gestione di fine partita, con le frasi rituali "These things are true…".

**Il tavolo**
- Una **scena-tavolo a lume di candela** in prospettiva, con dieci candele a volume che tremolano.
- **Sedie adattive**: da 2 a 4 sedie player più il GM di fronte, in base ai giocatori configurati.
- **Slot-volto** su ogni sedia che trasmettono la **webcam** di ciascun utente (sperimentale), con fallback.
- Completamente vettoriale (SVG), nitido a ogni risoluzione, rispetta `prefers-reduced-motion`.

---

## 📦 Requisiti

- **Foundry VTT v13** (verificata). Funziona su **v14** (segnalata come non verificata ma abilitabile).
- Nessuna dipendenza. **Dice So Nice!** è supportato ma facoltativo.
- Per gli slot webcam: attiva il sistema **Audio/Video** di Foundry.

## 🚀 Installazione

**Tramite Manifest URL (consigliato)** — in Foundry: *Game Systems → Install System*, poi incolla:

```
https://github.com/incesupertramp/ten-candles/releases/latest/download/system.json
```

**Manuale** — scarica l'ultimo `ten-candles.zip` dalle [Release](https://github.com/incesupertramp/ten-candles/releases), estrailo nella cartella `Data/systems/` di Foundry (così da avere `Data/systems/ten-candles/system.json`), e riavvia Foundry.

## ▶️ Avvio rapido

1. Crea un mondo con il sistema **Ten Candles**.
2. Crea gli attori **character** e compila Concept, Virtue, Vice, Moment e Brink.
3. Apri la **plancia** — il pulsante fiamma nella toolbar, oppure `game.system.api.openBoard()`.
4. Come GM, premi **New game** per accendere le dieci candele, poi gioca: lancia i conflitti dalla scheda e spegni le candele mentre il buio avanza.

Guida completa nel **[MANUALE.pdf](MANUALE.pdf)**.

## 🗺️ Roadmap

Le meccaniche e funzionalità pianificate sono in **[TODO.md](TODO.md)** — tra cui la creazione collaborativa dei personaggi, le Truths interattive, i dire conflict e il martyrdom, le final recordings e la localizzazione. Le modifiche per versione sono in **[CHANGELOG.md](CHANGELOG.md)**.

## 🤝 Contribuire

Issue e pull request sono benvenute. Mantieni i contributi focalizzati **solo su meccaniche e interfaccia** — non includere mai testo o illustrazioni del manuale di *Ten Candles*.

## 📄 Licenza

Il **codice** di questo repository è rilasciato con licenza **MIT** (vedi `LICENSE`). La licenza copre solo il codice e **non** si estende a *Ten Candles*, che resta proprietà intellettuale di Cavalry Games.

## 🙏 Crediti

- *Ten Candles* © **Cavalry Games**.
- Sviluppo del sistema: **incesupertramp**.
