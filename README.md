# Ten Candles — Foundry VTT (game system)

Sistema **non ufficiale, fan-made** per giocare a *Ten Candles* (di Cavalry Games) su Foundry VTT.

> **Legale / copyright.** Questo sistema contiene **solo le strutture meccaniche** necessarie a giocare: **nessun testo del manuale** è incluso. Per giocare serve possedere il manuale ufficiale *Ten Candles*, acquistato regolarmente. I contenuti narrativi (scenari, moduli, testi) vanno inseriti dal GM.

---

## Requisiti

- **Foundry VTT v13** (verificato). Gira anche su **v14** (comparirà come "non verificato", ma è abilitabile).
- Nessuna dipendenza. *Dice So Nice* è supportato ma **facoltativo**.

## Installazione (manuale, Fase 1)

Non essendoci ancora un manifest pubblico, si installa a mano:

1. Copia la cartella `ten-candles/` dentro la cartella `Data/systems/` del tuo Foundry
   (percorso tipico: `…/FoundryVTT/Data/systems/ten-candles/`).
2. Riavvia Foundry.
3. **Create World** → seleziona *Ten Candles* come Game System.

> In Fase 2, quando ci sarà un repository, si potrà installare via **Manifest URL**.

---

## Uso rapido

1. **Personaggi.** Actors → *Create Actor* → tipo **character**. Nella sheet: Concept, **Virtue**, **Vice**, **Moment**, **Brink**. (Gli hope die si guadagnano in gioco.)
2. **Tracker.** Apri il tracker candele:
   - pulsante 🔥 nella toolbar di sinistra, **oppure**
   - da console / macro: `game.system.api.openTracker()`.
3. **Nuova partita.** Nel tracker (come GM): **New game** → 10 candele, pool 10/0, scena 1.
4. **Conflitto.** Dalla sheet del PG: **Conflict roll** (o **Dire conflict**). Nella card in chat: eventuale *Burn Trait* / *Embrace Brink*, poi **Apply outcome**.

---

## Mappa meccanica → implementazione

| Meccanica (manuale) | Dove vive | Nota |
|---|---|---|
| Candele 10→0, mai riaccese | `GameState` (world setting) | `darkenCandle()` |
| Pool giocatori = candele accese | `GameState` | refill a ogni scena |
| Pool GM = 10 − candele accese | `GameState` | cresce col calare delle candele |
| Successo su 6 / hope su 5-6 | `DiceEngine.evaluate()` | solo i 6 per la narrazione |
| Scarto degli 1 su successo | `DiceEngine` → `loseDice()` | gli hope su 1 non si perdono |
| Virtue / Vice (burn → reroll 1) | `TenCandlesActor.burnTrait()` | max 1 Trait per scena |
| Moment → hope die | `TenCandlesActor.liveMoment()` | — |
| Brink (embrace → reroll pool) | `DiceEngine` + `burnBrink()` | sblocco: Moment risolto + Trait bruciati |
| Narration rights | `DiceEngine.evaluate()` | pareggio → GM |
| The Last Stand (fail → morte) | `DiceEngine` + `die()` | 1 candela accesa |
| Truths (frasi rituali) | `GameState` (chat) | numero truths = candele accese |

**Architettura stato condiviso:** GM-autoritativo. I player inviano i comandi via **socket** al GM attivo (`game.users.activeGM`), unico a scrivere il world setting. Lettura libera per tutti; la UI si aggiorna sull'`onChange` del setting.

---

## Checklist QA (da eseguire in Foundry reale)

Spunta ogni voce. `[ ]` = da testare. Consigliato con **due client** (una finestra GM + una player) per validare il relay socket.

### A. Caricamento
- [ ] Il system compare in *Create World* e il mondo si avvia senza errori in console.
- [ ] In console (F12) compaiono i log `ten-candles | Initializing…` e `… Ready`.

### B. Character sheet (Comp. 4)
- [ ] *Create Actor* tipo **character** → la sheet si apre.
- [ ] Scrivere Concept/Virtue/Vice/Moment/Brink e chiudere/riaprire: i valori **persistono**.
- [ ] `Alive` (checkbox) si salva.

### C. Trait (Comp. 3 + 4)
- [ ] **Burn** su Virtue → il campo si barra, notifica "reroll all dice showing 1".
- [ ] Dopo un burn, **Burn** sull'altro Trait è **bloccato** nella stessa scena (regola 1/scena).
- [ ] Burn su un Trait vuoto o già bruciato → notifica di avviso, nessun cambiamento.

### D. Hope / Moment (Comp. 3 + 4)
- [ ] **+1** hope → il contatore sale; **Reset** → 0.
- [ ] **Live — success (+Hope)** → Moment marcato *Lived*, hope +1.
- [ ] **Live — no success** → Moment *Lived*, hope invariato.

### E. Brink derivato (Comp. 2)
- [ ] Con Moment non vissuto o Trait non tutti bruciati → Brink = **Locked**.
- [ ] Dopo aver vissuto il Moment **e** bruciato entrambi i Trait → Brink = **Available**.

### F. Tracker / stato (Comp. 5a)
- [ ] `openTracker()` apre la finestra; **New game** → `10 / 10`, pool **10 / 0**, scena **1**.
- [ ] **Darken a candle** → candele **9**, pool player **9**, pool GM **1**, scena **2**; in chat compare l'annuncio scena + Truths (**"…Establish 9 truths…"**).
- [ ] Portare le candele a **1** → badge **The Last Stand**; a **0** → **All candles are dark** + chat `"The world is dark."`.
- [ ] **Relay socket:** dal client **player**, un'azione che spegne una candela (fallimento in un conflitto) aggiorna lo stato **anche sul client GM**. Con nessun GM connesso → notifica "No active GM".
- [ ] Dopo un cambio scena, il flag "un Trait per scena" dei PG è **azzerato** (si può ri-burnare un Trait).

### G. Conflict roll (Comp. 5b)
- [ ] **Conflict roll** dalla sheet → card in chat con dadi player/(hope)/GM, esito, narration `(X vs Y)`.
- [ ] I **6** appaiono verdi, gli **1** rossi.
- [ ] **Burn Trait** sulla card (se ci sono 1) → ritira **solo** gli 1; se entrambi i Trait sono liberi appare il dialogo di scelta.
- [ ] **Apply** su **successo** con almeno un 1 → il **pool player cala** del numero di 1 (verifica sul tracker).
- [ ] **Apply** su **fallimento** (fuori Last Stand) → **si spegne una candela** e cambia scena.
- [ ] **Embrace Brink** (quando disponibile e stai fallendo/perdendo narrazione) → ritira tutto il pool; se poi fallisce → Brink **burned**, hope **azzerati**, candela spenta.
- [ ] In **Last Stand**, **Apply** su fallimento → il PG risulta **morto** (`Alive` off), niente candela spenta.
- [ ] **Seize narration** (successo con narrazione al GM) → spegne una candela e chiude la card.
- [ ] Una card **risolta** non risponde più ai click (nessuna doppia esecuzione).

### H. Permessi
- [ ] Un player **non** può agire sulla card di conflitto di un **altro** PG (notifica "You can only act on your own conflict").

---

## Assunzioni prese (traduzione digitale)

Segnalate anche nel codice; modificabili in una riga:

1. **Sblocco Brink** = *Moment risolto* (`moment.lived`, a prescindere dall'esito) **e** entrambi i Trait bruciati.
2. **Embrace Brink fallito in Last Stand** → morte del personaggio (invece dello spegnimento candela).
3. A tirare il conflitto è il **proprietario** del PG (così può aggiornare la propria card).

## Limiti noti / Backlog Fase 2

- **Estetica**: tema horror, animazione candele, UX rifinita, ProseMirror per le note.
- **Regole avanzate**: gestione completa di *Dire conflict*, *Martyrdom* (hope a un altro sopravvissuto), fase Truths interattiva (non solo annuncio in chat).
- **Integrazioni**: Live Moment come vero conflict roll; migrazioni schema (`schemaVersion`); pulsante toolbar consolidato per la versione di Foundry in uso.
- **Distribuzione**: manifest pubblico + zip release + eventuale README in inglese.

## Struttura file

```
ten-candles/
├── system.json · template.json
├── lang/en.json
├── styles/
│   ├── tokens.css            (Fase 2: design token candlelight)
│   └── ten-candles.css       (stili: sheet, tracker, board, card)
├── module/
│   ├── ten-candles.mjs · config.mjs
│   ├── data/character.mjs
│   ├── documents/actor.mjs
│   ├── sheets/character-sheet.mjs
│   └── apps/game-state.mjs · candle-tracker.mjs · board.mjs · dice-engine.mjs
└── templates/
    ├── actor/character-sheet.hbs
    ├── apps/candle-tracker.hbs · board.hbs
    └── chat/conflict-card.hbs
```

## Fase 2 — Grafica (candlelight)

Restyle completo con tema *luce di candela nel buio*, senza modifiche alla logica:
- **Design token** (`styles/tokens.css`): palette fissa scura, tipografia serif rituale, glow via `box-shadow`, e primitive di **flicker** irregolare per fiamme "vere" (rispetta `prefers-reduced-motion`).
- **Character sheet**: carte-tratto che si incarboniscono quando `burned`, Brink `locked`/`available`, hope die ambrato.
- **Plancia a tutto schermo** (`board.mjs`): dieci candele in cerchio dai dati live, fiamme con flicker sfasato, fumo sulle spente, click-to-darken (GM), stati Last Stand / game over. Apri con il pulsante toolbar o `game.system.api.openBoard()`.
- **Tracker compatto**: versione mignon della board, con pulsante *Open full board*.
- **Conflict card**: dadi 6 = scintilla d'ambra, 1 = dado spento sangue, hope tratteggiati.

**Limite cosmetico noto:** lo stato tiene un *conteggio* di candele, non l'identità di ciascuna; cliccando una candela sulla board se ne spegne una (l'ultima accesa nel giro), non necessariamente quella cliccata. Correzione = piccolo cambio al data model, fuori dallo scope "solo grafica".

**Da verificare in Foundry reale (Fase 2):** overlay frameless a tutto schermo, pulsante toolbar (API scene-controls cambiata tra v13/v14 — c'è il fallback `openBoard()`), flicker SVG con `transform-box`, e la resa della card nel tema chiaro/scuro della chat.

