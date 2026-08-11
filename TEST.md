# Ten Candles — Checklist di test (v0.1.0)

Validazione da eseguire **in Foundry reale**. Consigliato con **due client** (una finestra GM + una player) per i test di sincronizzazione. Spunta `[x]` quando il comportamento atteso è verificato.

Legenda: **GM** = azione da GM · **PL** = azione da giocatore · **2C** = serve doppio client.

---

## A. Installazione e avvio
- [ ] Con Manifest URL, *Install System* scarica e installa senza errori.
- [ ] Il sistema compare in *Create World*; il mondo si avvia.
- [ ] In console (F12): log `Initializing…` e `Ready`, nessun errore rosso.

## B. Scheda personaggio
- [ ] *Create Actor* tipo **character** → la scheda si apre.
- [ ] Concept, Virtue, Vice, Moment, Brink si scrivono e **persistono** dopo chiusura/riapertura.
- [ ] Il checkbox **Alive** si salva.

## C. Trait
- [ ] **Burn** su Virtue → carta incarbonita, testo barrato, notifica di reroll.
- [ ] Dopo un burn, **Burn** sull'altro Trait è **bloccato** nella stessa scena (1/scena).
- [ ] Burn su Trait vuoto o già bruciato → avviso, nessun cambiamento.

## D. Hope e Moment
- [ ] **+1** Hope sale, **Reset** azzera.
- [ ] **Live — success (+Hope)** → Moment *Lived*, Hope +1.
- [ ] **Live — no success** → Moment *Lived*, Hope invariato.

## E. Brink (stato derivato)
- [ ] Moment non vissuto o Trait non tutti bruciati → Brink **Locked**.
- [ ] Moment vissuto **e** entrambi i Trait bruciati → Brink **Available** (con bagliore).

## F. Stato condiviso / tracker / board
- [ ] **New game** → 10 candele, pool **10 / 0**, scena **1**.
- [ ] **Darken a candle** → candele 9, pool player **9**, pool GM **1**, scena **2**.
- [ ] Refill corretto anche più avanti (es. a 6 candele: player **6**, GM **4**).
- [ ] Al cambio scena parte l'annuncio Truths in chat (numero verità = candele accese).
- [ ] A **1** candela → badge/plancia **The Last Stand** (rosso).
- [ ] A **0** candele → **The world is dark** + chat finale.
- [ ] Dopo un cambio scena, il flag "un Trait per scena" dei PG è **azzerato**.
- [ ] **2C** · **PL** compie un'azione che spegne una candela → lo stato si aggiorna **anche sul client GM**.
- [ ] **PL** senza GM connesso → avviso "No active GM".

## G. Conflict roll
- [ ] **Conflict roll** dalla scheda → card in chat con dadi player/(hope)/GM, esito, narration `(X vs Y)`.
- [ ] I **6** appaiono come luce, gli **1** come spenti (sangue).
- [ ] **Burn Trait** sulla card (se ci sono 1) → ritira **solo** gli 1; con due Trait liberi appare la scelta.
- [ ] **Apply** su successo con almeno un 1 → il **pool player cala** del numero di 1 (verifica sul tracker/board).
- [ ] **Apply** su fallimento (fuori Last Stand) → **si spegne una candela** e cambia scena.
- [ ] **Embrace Brink** (disponibile e stai fallendo/perdendo narrazione) → ritira tutto il pool; se poi fallisce → Brink **burned**, Hope **azzerati**, candela spenta.
- [ ] In **Last Stand**, **Apply** su fallimento → PG **morto** (`Alive` off), niente candela spenta.
- [ ] **Seize narration** (successo con narrazione al GM) → spegne una candela e chiude la card.
- [ ] Card **risolta** → non risponde più ai click (niente doppia esecuzione).
- [ ] Pool a 0 in Last Stand → tiro impossibile gestito come fallimento/morte.

## H. Permessi
- [ ] **PL** non può agire sulla card di conflitto di **un altro** PG (avviso).
- [ ] **PL** non può spegnere candele cliccando sulla board (solo il GM).

## I. Plancia (grafica)
- [ ] `game.system.api.openBoard()` (o pulsante toolbar) → overlay a **tutto schermo**.
- [ ] Le fiamme tremolano in modo **indipendente** (flicker sfasato).
- [ ] Fumo visibile sulle candele spente.
- [ ] **GM** clicca una candela → una si spegne; contatori e cerchio si aggiornano.
- [ ] I contatori Player/GM e la scena riflettono i dati reali.
- [ ] Chiusura con la **✕** funziona; l'hook di re-render non lascia residui.
- [ ] La board si aggiorna in tempo reale quando cambia lo stato (anche da un altro client).

## J. Accessibilità e motion
- [ ] Con `prefers-reduced-motion` attivo (SO/browser) le candele **non** animano.
- [ ] Testo leggibile sul fondo scuro (contrasto).

## K. Compatibilità
- [ ] Funziona su **v13** senza warning bloccanti.
- [ ] Su **v14** (se disponibile) si abilita e gira (atteso: avviso "non verificato"); verifica in particolare il **pulsante toolbar** (altrimenti usa l'API).

## L. Release / auto-install
- [ ] Push del tag `v0.1.0` → la GitHub Action crea la release con `system.json` + `ten-candles.zip`.
- [ ] Nel `system.json` allegato: `version`, `manifest` (latest) e `download` (tag) corretti.
- [ ] Manifest URL installa il sistema in Foundry.
- [ ] Una release successiva (`v0.2.0`) mostra il pulsante **Update** in Foundry.

---

### Note di regressione
Quando aggiungi una funzionalità dalla `TODO.md`, ri-esegui almeno le sezioni **F** e **G** (stato condiviso e conflict roll): sono il cuore meccanico e ogni cambiamento le può toccare.
