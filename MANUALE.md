# Ten Candles per Foundry VTT
## Manuale di installazione e uso

Sistema **non ufficiale, fan-made** per giocare a *Ten Candles* (di Cavalry Games) su Foundry VTT.

> **Nota legale.** Il sistema contiene solo le **strutture meccaniche** necessarie a giocare: nessun testo del manuale ufficiale è incluso. Per giocare bisogna possedere il manuale ufficiale *Ten Candles*, acquistato regolarmente. I contenuti narrativi (scenari, moduli, testi) li inserisce il GM.

---

## 1. Cosa serve

- **Foundry VTT versione 13** (verificata). Funziona anche su **v14** (comparirà come "non verificato", ma è abilitabile).
- Nessun modulo aggiuntivo obbligatorio.
- **Dice So Nice** è supportato ma **facoltativo** (aggiunge i dadi 3D ai tiri).

---

## 2. Installazione

Il sistema si installa manualmente (non c'è ancora un manifest pubblico).

**Passo 1 — Copia la cartella.**
Estrai `ten-candles.zip`. Ottieni una cartella `ten-candles/`. Copiala dentro la cartella dei sistemi di Foundry:

```
.../FoundryVTT/Data/systems/ten-candles/
```

La struttura corretta deve avere `ten-candles/system.json` a quel percorso (non una cartella dentro un'altra cartella).

**Passo 2 — Riavvia Foundry.**
Chiudi e riapri l'applicazione Foundry VTT.

**Passo 3 — Crea il mondo.**
Da *Game Worlds* scegli *Create World*, e come **Game System** seleziona *Ten Candles*. Avvia il mondo.

**Verifica.** Se apri la console (tasto F12) dovresti vedere i messaggi `ten-candles | Initializing…` e `… Ready`. Nessun errore rosso.

> In futuro, con un repository pubblico, sarà possibile installare tramite **Manifest URL**.

---

## 3. Preparare la partita

### 3.1 Creare i personaggi

1. Nella barra laterale apri la scheda **Actors**.
2. *Create Actor* → tipo **character** → dai un nome.
3. Si apre la **character sheet**.

### 3.2 Compilare la scheda

La creazione di un personaggio di *Ten Candles* prevede questi elementi (dal manuale ufficiale):

| Campo | Cosa scrivere |
|---|---|
| **Concept** | Chi è il personaggio, in una frase |
| **Virtue** | Un tratto positivo, una parola |
| **Vice** | Un tratto negativo, una parola |
| **Moment** | Un obiettivo personale: se vissuto con successo dà un Hope die |
| **Brink** | Il "limite" nascosto: si sblocca solo quando Moment e Trait sono spesi |

Tutti i campi si salvano da soli mentre scrivi.

### 3.3 Accendere le dieci candele

Apri la **plancia** (vedi §5) e premi **New game**: le candele tornano a 10, il pool giocatori a 10, il pool GM a 0, la scena a 1.

---

## 4. Come si gioca (il flusso)

*Ten Candles* è un horror tragico: la storia si svolge al buio, le candele si spengono una a una, e alla fine tutti i personaggi muoiono. Il sistema digitale automatizza le meccaniche; la narrazione resta al tavolo.

### 4.1 Le risorse

- **Dieci candele**: la risorsa che cala. Non si riaccendono mai.
- **Pool dei giocatori** (Player dice): i dadi comuni che i giocatori tirano. A ogni scena si ricarica pari al **numero di candele accese** (quindi si rimpicciolisce col tempo).
- **Pool del GM** (GM dice): parte da 0 e cresce (è pari a `10 − candele accese`). Serve a contendere la narrazione, non a "vincere".

### 4.2 Il tiro di conflitto (conflict roll)

Quando un personaggio tenta qualcosa di rischioso:

1. Dalla sua scheda premi **Conflict roll** (o **Dire conflict** per un conflitto grave).
2. Compare una **card in chat** con i dadi tirati: pool giocatori, eventuali Hope die, pool GM.
   - Un **dado normale** ha successo su **6**.
   - Un **Hope die** ha successo su **5 o 6**.
   - Il conflitto **riesce** se c'è almeno un successo.
3. **Narration rights** (chi narra l'esito): vince chi ha più **6**. In caso di pareggio, narra il GM.
4. Prima di applicare l'esito puoi usare, se disponibili:
   - **Burn Trait** — brucia un Trait (Virtue o Vice) per **ritirare tutti i dadi usciti 1**. Massimo un Trait per scena.
   - **Embrace Brink** — se stai fallendo o perdendo la narrazione, ritira **tutto** il tuo pool. Se ora riesci, tieni il Brink; se fallisci di nuovo, il Brink si brucia, perdi gli Hope die e si spegne una candela.
   - **Seize narration** — su un successo in cui la narrazione andrebbe al GM, puoi spegnere una candela per prendertela.
5. Premi **Apply outcome**:
   - **Successo**: i dadi usciti 1 vengono persi dal pool (gli Hope die no).
   - **Fallimento**: si spegne una candela e si cambia scena.
   - In **The Last Stand** (vedi §4.5) il fallimento causa invece la **morte** del personaggio.

### 4.3 Hope, Moment, Brink

- **Vivere il Moment**: dalla scheda, quando risolvi il tuo Moment con successo guadagni un **Hope die**. L'Hope die si aggiunge ai tuoi tiri e conta 6 per la narrazione; non si perde uscendo 1.
- **Il Brink** resta bloccato (Locked) finché non hai **vissuto il Moment** e **bruciato entrambi i Trait**. Allora diventa disponibile (Available) e puoi abbracciarlo nei conflitti.

### 4.4 Le Truths (tra una scena e l'altra)

Quando una candela si spegne, il sistema annuncia in chat la fase rituale: *"These things are true. The world is dark."* Il tavolo stabilisce un numero di verità pari alle candele ancora accese, e chiude con *"And we are alive."* Con l'ultima candela si dice solo *"And we are alive."*

### 4.5 The Last Stand

Quando resta **una sola candela accesa**, inizia *The Last Stand*: la plancia vira al rosso. Da qui, ogni conflitto **fallito** significa la **morte** del personaggio, non lo spegnimento di una candela.

### 4.6 Fine partita

Quando anche l'ultima candela si spegne, la plancia mostra *"The world is dark."*: la storia è finita.

---

## 5. L'interfaccia

### 5.1 Character sheet

Ogni sezione è una "carta". Gli stati sono visivi:
- Un **Trait bruciato** si incarbonisce (testo barrato, sfondo di cenere).
- Il **Moment vissuto** diventa ambra tenue.
- Il **Brink** mostra un'etichetta: *Locked* (grigia), *Available* (ambra con bagliore), *Burned* (cenere).
- **Hope**: un dado ambrato luminoso, con i pulsanti +1 / Reset.
- **Conflict roll** (ambra) e **Dire conflict** (sangue).

### 5.2 Plancia a tutto schermo (la vista principale)

Le **dieci candele in cerchio**, come al tavolo vero: le fiamme tremolano in modo indipendente. Al centro il numero di candele accese; ai lati **Player dice** e **GM dice**; in alto la scena e la frase rituale.

Come aprirla:
- **Pulsante nella barra strumenti** a sinistra (icona fiamma), **oppure**
- Da console o macro: `game.system.api.openBoard()`.

Controlli:
- **GM**: può cliccare una candela per spegnerla, oppure usare i pulsanti **Darken a candle** / **New game** in basso.
- **Giocatori**: vedono la plancia aggiornarsi in tempo reale (non spengono candele manualmente).

### 5.3 Tracker compatto

Una finestra piccola con i pallini-candela, i pool e la scena, più un pulsante **Open full board**. Aprila con `game.system.api.openTracker()`.

### 5.4 Conflict card (in chat)

Mostra i dadi: **6** = scintilla d'ambra (successo), **1** = dado spento color sangue (perso), **Hope** tratteggiati. Sotto, l'esito, la narrazione e i pulsanti d'azione.

---

## 6. Ruoli e permessi

Lo stato condiviso (candele, pool, scena) è unico per tutto il tavolo. Solo il **GM** può modificarlo. I giocatori compiono le loro azioni (tiri, spesa di Trait/Brink sulla propria card): quando un'azione deve cambiare lo stato comune, la richiesta viene inoltrata automaticamente al GM, che è l'unico "scrittore" autorevole. Questo evita conflitti e doppie esecuzioni. Se nessun GM è connesso, un'azione del giocatore che richiede il GM avvisa che non c'è un GM attivo.

---

## 7. Comandi utili

Da console (F12) o da una macro:

| Comando | Effetto |
|---|---|
| `game.system.api.openBoard()` | Apre la plancia a tutto schermo |
| `game.system.api.openTracker()` | Apre il tracker compatto |
| `game.system.api.GameState.candlesLit` | Legge quante candele sono accese |
| `game.system.api.GameState.newGame()` | (GM) Nuova partita |

---

## 8. Come funziona sotto il cofano (tecnico)

Per chi vuole mettere mano al codice.

- **Struttura**: `system.json` (manifest), `template.json` (tipi documento), `module/` (codice ES module), `templates/` (Handlebars), `styles/` (CSS), `lang/` (localizzazione).
- **Dati del personaggio**: definiti in `module/data/character.mjs` con un DataModel; niente schema in `template.json`.
- **Metodi operativi**: `module/documents/actor.mjs` (bruciare Trait, vivere il Moment, ecc.); modificano i dati in modo atomico.
- **Stato condiviso**: `module/apps/game-state.mjs`; usa un world setting con architettura GM-autoritativa e relay via socket.
- **Motore dadi**: `module/apps/dice-engine.mjs`; il conflict roll come card interattiva in chat.
- **Interfaccia**: `sheets/character-sheet.mjs` (scheda), `apps/board.mjs` (plancia), `apps/candle-tracker.mjs` (tracker) — tutte in ApplicationV2.
- **Grafica**: `styles/tokens.css` definisce i design token (palette, glow, flicker); `styles/ten-candles.css` li consuma. Un ritocco di palette si propaga da un solo file.

---

## 9. Assunzioni e limiti noti

- **Sblocco del Brink**: interpretato come "Moment risolto" (a prescindere dall'esito) **e** entrambi i Trait bruciati.
- **Embrace Brink fallito in Last Stand**: applica la morte del personaggio (coerente con la regola del Last Stand).
- **Click sulla candela**: lo stato tiene un *conteggio* di candele, non l'identità di ciascuna. Cliccandone una accesa se ne spegne una (l'ultima accesa nel giro), non necessariamente quella toccata.
- **Chi tira**: si assume che sia il proprietario del personaggio a lanciare il proprio conflitto.

---

## 10. Risoluzione problemi

| Problema | Soluzione |
|---|---|
| Il sistema non compare in *Create World* | Verifica il percorso: deve esserci `Data/systems/ten-candles/system.json`. Riavvia Foundry. |
| Il pulsante fiamma non c'è nella toolbar | L'API scene-controls cambia tra v13/v14. Usa `game.system.api.openBoard()`. |
| Le fiamme non tremolano | Hai attivo "riduci animazioni" nel sistema operativo/browser (`prefers-reduced-motion`): è voluto. |
| Un giocatore non riesce a spegnere una candela | È corretto: solo il GM lo fa manualmente. |
| Un cambio di stato non arriva a un giocatore | Serve un GM connesso: è lui a scrivere lo stato condiviso. |

---

## 11. Cosa manca / prossimi sviluppi

- Spegnimento della candela esatta cliccata (richiede un piccolo cambio al data model).
- Gestione completa di *Dire conflict* e *Martyrdom*; fase Truths interattiva.
- ProseMirror per le note della scheda.
- Migrazioni dello schema dati versionato.
- Distribuzione: manifest pubblico e release.

---

## Appendice — Mappa meccanica → sistema

| Meccanica | Dove | Nota |
|---|---|---|
| Candele 10→0 | `GameState.darkenCandle()` | Mai riaccese |
| Pool giocatori = candele accese | `GameState` | Refill a ogni scena |
| Pool GM = 10 − accese | `GameState` | Cresce nel tempo |
| Successo 6 / Hope 5-6 | `DiceEngine` | Solo i 6 per la narrazione |
| Scarto degli 1 su successo | `DiceEngine` → `loseDice()` | Gli Hope su 1 non si perdono |
| Burn Trait | `actor.burnTrait()` | Ritira gli 1; 1 Trait/scena |
| Moment → Hope | `actor.liveMoment()` | +1 Hope su successo |
| Brink (embrace) | `DiceEngine` + `burnBrink()` | Ritira tutto il pool |
| Last Stand (fail → morte) | `DiceEngine` + `die()` | 1 candela accesa |
