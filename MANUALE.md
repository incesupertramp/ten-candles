# Ten Candles per Foundry VTT
## Manuale di installazione e uso — v0.3.1

Sistema **non ufficiale, fan-made** per giocare a *Ten Candles* (di Cavalry Games) su Foundry VTT.

> **Nota legale.** Il sistema contiene solo le **strutture meccaniche** necessarie a giocare: nessun testo del manuale ufficiale è incluso. Per giocare bisogna possedere il manuale ufficiale *Ten Candles*, acquistato regolarmente. I contenuti narrativi (scenari, moduli, verità) li inserisce il tavolo.

---

## 1. Cosa serve

- **Foundry VTT versione 13** (verificata). Funziona anche su **v14** (comparirà come "non verificato", ma è abilitabile).
- Nessun modulo aggiuntivo obbligatorio.
- **Dice So Nice** è supportato ma **facoltativo** (dadi 3D ai tiri).
- Per le **webcam** sulla plancia serve l'**A/V di Foundry** attivo; per le **registrazioni finali** serve audio abilitato nel browser.
- Lingua: interfaccia **italiana** e **inglese** (segue la lingua impostata in Foundry).

---

## 2. Installazione

Installazione manuale (non c'è ancora un manifest pubblico).

**Passo 1 — Copia la cartella.** Estrai `ten-candles.zip`: ottieni una cartella `ten-candles/`. Copiala in:

```
.../FoundryVTT/Data/systems/ten-candles/
```

Il percorso corretto deve avere `ten-candles/system.json` (non una cartella dentro un'altra).

**Passo 2 — Riavvia Foundry** (chiudi e riapri l'applicazione). Dopo un aggiornamento, ricordati anche un **F5** nel client per svuotare la cache dei template.

**Passo 3 — Crea il mondo.** *Create World* → **Game System**: *Ten Candles*. Avvia il mondo.

**Verifica.** In console (F12) dovresti vedere `ten-candles | Initializing…` e `… Ready`, senza errori rossi.

> In futuro, con repository pubblico, sarà possibile installare via **Manifest URL**.

---

## 3. Preparare la partita

### 3.1 Creare i personaggi e assegnarli

1. Barra laterale → **Actors** → *Create Actor* → tipo **character** → nome.
2. **Assegna ogni personaggio al suo giocatore**: *Configure Player* (o trascina l'attore sull'utente) così `game.user.character` punta al personaggio giusto. **Serve per la creazione collaborativa** (vedi §3.3), che assegna gli incarichi in base al personaggio dell'utente.

### 3.2 Compilare la scheda (a mano)

| Campo | Cosa scrivere |
|---|---|
| **Concept** | Chi è il personaggio, in una frase |
| **Virtue** | Un tratto positivo, una parola |
| **Vice** | Un tratto negativo, una parola |
| **Moment** | Un obiettivo personale: se vissuto con successo dà un Hope die |
| **Brink** | Il "limite" nascosto: si sblocca quando Moment e Trait sono spesi |
| **Registrazione finale** | (facoltativa) file audio dell'ultimo messaggio del personaggio — vedi §4.7 |

I campi si salvano da soli. Premi **Modifica** per aprire i campi editabili.

### 3.3 Creazione collaborativa guidata (consigliata)

In *Ten Candles* non scegli i tuoi tratti: te li scrivono i vicini. Il sistema guida il rito dal **tracker** (§5.3).

1. Il **GM** preme **Avvia creazione** (azzera Virtù/Vizio/Brink di tutti i personaggi).
2. Il flusso avanza a passi: **Virtù → Vizio → Brink → Them**. A ogni passo ciascun giocatore vede *"Scrivi una … per [vicino]"* e un campo:
   - **Virtù** → al **vicino di destra**
   - **Vizio** e **Brink** → al **vicino di sinistra**
   
   Al salvataggio il testo finisce sul **personaggio bersaglio** (lo scrive il GM in automatico, quindi nessun problema di permessi).
3. Passo **Them**: il **GM** definisce il **Brink dell'antagonista "Them"** ("I have seen Them…") e un **Brink per un personaggio a scelta** ("They have seen you…").
4. Il GM vede una **checklist** di chi ha già scritto e comanda **Passo successivo** / **Termina**. Alla fine, il Brink di Them viene annunciato in chat.

> I "vicini" sono calcolati con un **anello stabile** (stesso ordine su tutti i client).

### 3.4 Accendere le dieci candele

Apri la **plancia** (§5.2) o il tracker e premi **New game**: candele a 10, pool giocatori a 10, pool GM a 0, scena a 1.

---

## 4. Come si gioca (il flusso)

*Ten Candles* è un horror tragico: si gioca al buio, le candele si spengono una a una, e alla fine tutti muoiono. Il sistema automatizza le meccaniche; la narrazione resta al tavolo.

### 4.1 Le risorse

- **Dieci candele**: la risorsa che cala. Non si riaccendono mai.
- **Pool dei giocatori**: i dadi comuni. A ogni scena si ricarica pari al **numero di candele accese** (cala nel tempo).
- **Pool del GM**: parte da 0 e cresce (`10 − candele accese`). Serve a contendere la narrazione.

### 4.2 Il tiro di conflitto

1. Dalla scheda premi **Conflict roll** (o **Dire conflict**).
2. Compare una **card in chat**: pool giocatori, eventuali Hope die, pool GM.
   - Dado normale: successo su **6**. Hope die: successo su **5–6**. Il conflitto **riesce** con almeno un successo.
3. **Narrazione**: narra chi ha più **6**; in pareggio narra il GM.
4. Prima di applicare, se disponibili:
   - **Burn Trait** — brucia un Trait per **ritirare tutti gli 1** (max un Trait per scena).
   - **Embrace Brink** — se stai fallendo/perdendo la narrazione, **ritira tutto** il pool. Se ora riesci tieni il Brink; se fallisci, il Brink si brucia, perdi gli Hope die e cala una candela.
   - **Seize narration** — su un successo in cui narrerebbe il GM, spegni una candela per prenderti la narrazione.
5. **Apply outcome**:
   - **Successo**: gli 1 escono dal pool (gli Hope no).
   - **Fallimento**: cala una candela e cambia scena.
   - In **The Last Stand** il fallimento causa la **morte** del personaggio.

### 4.3 Hope, Moment, Brink

- **Vivere il Moment** (dalla scheda) con successo dà un **Hope die** (conta 6 per la narrazione, non si perde uscendo 1).
- Il **Brink** resta *Locked* finché non hai **vissuto il Moment** e **bruciato entrambi i Trait**; poi diventa *Available*.

### 4.4 Le Verità interattive (tra le scene)

Quando cala una candela (con **≥2 accese**) si apre la **fase Verità** nel tracker:
- Rito d'apertura *"These things are true. The world is dark."*
- Chiunque può **aggiungere una verità**: la lista è condivisa e sincronizzata; il numero di verità = **candele accese**.
- Al completamento la fase si **chiude da sola** con *"And we are alive."* e un **riepilogo in chat**. Il GM può chiudere in anticipo.
- Con l'**ultima candela** (Last Stand) non c'è raccolta: si dice solo *"And we are alive."*

### 4.5 The Last Stand

Con **una sola candela accesa** inizia *The Last Stand*: la plancia vira al **rosso** e il cerchio rituale si fa color sangue. Ogni conflitto **fallito** è ora la **morte** del personaggio.

### 4.6 Fine partita

Spenta l'ultima candela, la plancia mostra *"The world is dark."*: la storia è finita.

### 4.7 Le registrazioni finali (audio) con effetto "mangianastri"

Ogni personaggio può avere una **registrazione finale**: l'ultimo messaggio, riprodotto alla fine.
- **Caricare**: sulla scheda, sezione **Registrazione finale**, usa il pulsante 🎙 (FilePicker) per scegliere un **file audio pulito** (mp3/ogg/wav). Il campo è riservato al GM finché non si riproduce.
- **Effetto**: la riproduzione applica **in tempo reale** una distorsione lo-fi da **vecchio mangianastri** (banda ridotta, saturazione, wow/flutter, fruscio). Tu carichi il file pulito: la distorsione la fa Foundry.
- **Riprodurre**: al **game over** compare nel tracker **"Riproduci le registrazioni finali"** (le suona in sequenza). Il GM può ascoltarne una dalla scheda (▶) o usare `game.system.api.playRecordings()`.
- L'audio è **trasmesso a tutti** i client (ognuno lo elabora localmente); se la Web Audio non è disponibile, c'è un **fallback** a riproduzione pulita.

---

## 5. L'interfaccia

### 5.1 Character sheet

Ogni sezione è una "carta", con stati visivi: **Trait bruciato** incarbonito; **Moment vissuto** ambra tenue; **Brink** con etichetta *Locked/Available/Burned*; **Hope** come dado ambrato con +1/Reset; **Conflict roll** (ambra) e **Dire conflict** (sangue). In fondo, la **Registrazione finale** (§4.7).

### 5.2 Plancia — seduta spiritica (vista dall'alto)

La plancia è una **seduta spiritica vista dall'alto**, generata per geometria:
- Un **tavolo tondo di legno** (bordo, venature, ombra) con sopra una **tavola ouija** rettangolare (OUIJA, YES/NO, sole/luna, A-Z, numeri, GOOD BYE).
- **Dieci candele in anello** sul bordo del tavolo: fiamme che tremolano, **fumo** che sale, **alone caldo** sul legno; da spente restano cera fredda.
- Le **webcam dei giocatori** in cerchio attorno al tavolo (2–6, disposte in automatico).
- Al centro una **planchette** con la webcam del **master (lo "spirito")**: **scivola** verso una lettera **quando il master agisce** (spegne una candela / cambia scena), con una **scia luminosa**.
- Un **cerchio rituale** (pentagramma) che **si intensifica** al calare delle candele; in **Last Stand** vira al sangue e cala un **velo rosso**.
- In alto: candele accese, scena, pool.

Come aprirla: **pulsante fiamma** nella toolbar, oppure `game.system.api.openBoard()`.

Controlli: il **GM** può spegnere candele e usa **Darken a candle** / **New game**; i giocatori vedono la plancia aggiornarsi in tempo reale.

### 5.3 Tracker compatto

Finestra piccola con pallini-candela, pool e scena, e il pulsante **Open full board**. È anche la **plancia di regia**: qui compaiono il **pannello Verità** (§4.4), il **pannello Creazione collaborativa** (§3.3) e, al game over, **Riproduci le registrazioni finali**. Aprila con `game.system.api.openTracker()`.

### 5.4 Conflict card (in chat)

Mostra i dadi: **6** scintilla d'ambra (successo), **1** dado spento color sangue (perso), **Hope** tratteggiati. Sotto: esito, narrazione e pulsanti d'azione.

---

## 6. Ruoli e permessi

Lo stato condiviso (candele, pool, scena, fase Verità, creazione) è unico per il tavolo: solo il **GM** lo modifica. Le azioni dei giocatori che cambiano lo stato comune (o scrivono sul personaggio di un vicino durante la creazione) vengono **inoltrate al GM**, unico "scrittore" autorevole — così niente conflitti o doppie esecuzioni. Le **registrazioni** fanno eccezione: sono **trasmesse a tutti** perché ogni client deve elaborare l'audio localmente. Se nessun GM è connesso, un'azione che lo richiede avvisa che manca un GM attivo.

---

## 7. Comandi utili

| Comando | Effetto |
|---|---|
| `game.system.api.openBoard()` | Apre la plancia (seduta) |
| `game.system.api.openTracker()` | Apre il tracker compatto |
| `game.system.api.playRecordings()` | Riproduce in sequenza le registrazioni finali |
| `game.system.api.debugCameras()` | Diagnostica delle webcam sulla plancia |
| `game.system.api.GameState.candlesLit` | Legge quante candele sono accese |
| `game.system.api.GameState.newGame()` | (GM) Nuova partita |

---

## 8. Come funziona sotto il cofano (tecnico)

- **Struttura**: `system.json` (manifest), `module/` (ES module), `templates/` (Handlebars), `styles/` (CSS), `lang/` (en, it).
- **Dati personaggio**: `module/data/character.mjs` (DataModel), inclusa `recording {path, hidden}`.
- **Metodi**: `module/documents/actor.mjs` (burn Trait, live Moment, die/revive, `playRecording`, `playAllFinalRecordings`).
- **Stato condiviso**: `module/apps/game-state.mjs` — world setting **GM-autoritativo** con **relay via socket**; gestisce candele, pool, scena, **Verità** e **creazione collaborativa** (inclusi Brink del GM e "Them").
- **Audio mangianastri**: `module/apps/tape-audio.mjs` — effetto lo-fi Web Audio + **broadcast** su socket per riproduzione locale su ogni client.
- **Motore dadi**: `module/apps/dice-engine.mjs`.
- **Interfaccia**: `sheets/character-sheet.mjs`, `apps/board.mjs` (plancia top-down generata per geometria), `apps/candle-tracker.mjs` — tutte ApplicationV2.
- **Grafica**: `styles/tokens.css` (design token) + `styles/ten-candles.css`.

---

## 9. Assunzioni e limiti noti

- **Sblocco del Brink**: "Moment risolto" (a prescindere dall'esito) **e** entrambi i Trait bruciati.
- **Embrace Brink fallito in Last Stand**: applica la morte del personaggio.
- **Click sulla candela**: lo stato tiene un *conteggio* di candele, non l'identità di ciascuna.
- **Creazione collaborativa**: richiede che ogni utente abbia un **personaggio assegnato**; il GM senza personaggio vede solo la regia. Il **Brink di Them / GM** è oggi scritto dal GM (regia), non ancora assegnato in automatico in base alla posizione al tavolo.
- **Registrazioni**: i parametri dell'effetto e la sincronia tra client sono tarati "a orecchio" e vanno provati dal vivo; l'autoplay dipende dalle policy del browser.

---

## 10. Risoluzione problemi

| Problema | Soluzione |
|---|---|
| Il sistema non compare in *Create World* | Verifica `Data/systems/ten-candles/system.json`. Riavvia Foundry. |
| Dopo un aggiornamento vedo la versione vecchia | Riestrai lo zip e fai **F5** nel client (cache dei template). |
| Il pulsante fiamma non c'è nella toolbar | Usa `game.system.api.openBoard()` (l'API scene-controls cambia tra v13/v14). |
| Le webcam non compaiono sulla plancia | Attiva l'A/V di Foundry; poi `game.system.api.debugCameras()` per diagnosticare. |
| Le fiamme/animazioni non si muovono | Hai `prefers-reduced-motion` attivo: è voluto. |
| Un giocatore non riceve un cambio di stato | Serve un GM connesso (è lui a scrivere lo stato). |
| La creazione non mi assegna nessun incarico | Assicurati di avere un **personaggio assegnato** all'utente. |
| La registrazione non parte | Verifica che il percorso audio sia valido e che l'audio del browser sia sbloccato (una prima interazione). |

---

## 11. Cosa manca / prossimi sviluppi

- Creazione: **accensione progressiva** delle candele (3+3+3+1) e assegnazione automatica del Brink GM/"Them" per posizione al tavolo.
- Verità: **ordine dei turni** (giro orario) e chi stabilisce la **prima** verità.
- Planchette: controllo **manuale** del GM per comporre parole; effetto sonoro.
- Spegnimento della candela **esatta** cliccata; migrazioni dello schema versionato.
- Distribuzione: **manifest pubblico** e release automatica.

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
| Verità interattive | `GameState` (fase Truths) | Raccolta condivisa, chiusura corale |
| Creazione collaborativa | `GameState` (creation) | Virtù/Vizio/Brink ai vicini + passo Them |
| Registrazioni + mangianastri | `actor.playRecording()` + `TapeAudio` | Broadcast, effetto lo-fi locale |
| Last Stand (fail → morte) | `DiceEngine` + `die()` | 1 candela accesa |
