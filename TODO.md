# Ten Candles — ToDo funzionalità

Roadmap delle funzionalità **nuove** rispetto alla v0.1.0. Priorità: 🔴 alta · 🟡 media · 🟢 bassa.
La sezione "Meccaniche di gioco" nasce da una verifica diretta sul manuale ufficiale: distingue ciò che **manca** da ciò che è **parziale**.

---

## Meccaniche di gioco (verificate sul manuale)

### Creazione del personaggio (collaborativa)
- [ ] 🔴 **Passaggio delle carte Trait** — non scegli i tuoi Trait: ognuno scrive una Virtue e la passa **a destra**, scrive un Vice e lo passa **a sinistra**. *Mancante* (oggi i campi si compilano da soli).
- [ ] 🔴 **Brink scritti dai vicini** — ognuno scrive il Brink per il giocatore alla **propria sinistra** ("I've seen you…"); conosci il tuo Brink e quello del vicino. *Mancante*.
- [ ] 🔴 **Brink del GM e antagonista "Them"** — il giocatore alla **sinistra del GM** riceve un Brink dal GM ("They have seen you…"); il giocatore alla **destra del GM** scrive il Brink di **Them** ("I have seen Them…"), definendo l'antagonista. *Mancante*.
- [ ] 🟡 **Accensione progressiva delle candele** — 3 (Step Traits) + 3 (Step Moments) + 3 (Step Brinks) + 1 (prima della prima scena / recording). *Mancante* (oggi solo New game = 10 in un colpo).
- [ ] 🟡 **Introduzione del Module** — area per il testo di scenario e l'apertura "These things are true. The world is dark." *Mancante*.

### Fase Truths (tra le scene)
- [ ] 🔴 **Truths interattive e ordinate** — apertura del GM, giro **in senso orario**, numero di verità = candele accese; chi ha **fallito il conflitto / seized** stabilisce la **prima** verità (altrimenti il GM); chiusura corale **"And we are alive"** (ultima verità collettiva). *Parziale* (oggi solo annuncio in chat).
- [ ] 🟡 **Registro delle verità** — lista condivisa delle verità stabilite che cresce durante la partita. *Mancante*.

### Risoluzione dei conflitti
- [x] 🔴 **Live Moment come conflitto reale** — vivere il Moment tira un conflitto vero; l'Hope die arriva in automatico sul successo. *Parziale* (oggi bottoni success/fail manuali).
- [x] 🟡 **Seize su conflitto fallito** — spegnere una candela **addizionale** (2 in totale) per prendere la narrazione di un fallimento. *Parziale* (oggi seize solo su successo).
- [x] 🟡 **Dire conflict completo** — conseguenze gravi + **morte volontaria**: su un dire fallito un giocatore può scegliere di morire e **vincere la narrazione** del conflitto fallito. *Parziale* (oggi solo il flag "dire").
- [x] 🟢 **GM narra sempre i conflitti falliti** (tranne morte volontaria) — enforcement della regola nella narration. *Sfumatura mancante*.

### Morte e candele
- [ ] 🟡 **Martyrdom** — una morte eroica assegna un Hope die a un altro sopravvissuto. *Mancante*.
- [ ] 🔴 **Identità delle candele** — spegnere *esattamente* la candela cliccata (oggi si spegne l'ultima accesa del giro). Richiede un array di stati candela invece del conteggio. *Parziale/cosmetico*.

### Personaggio e antagonista
- [ ] 🟡 **Segretezza del Brink** — nascondere il valore del Brink ai non-proprietari (visibile solo il proprio e quello del vicino di sinistra). *Parziale* (esiste il concetto, non l'ownership).
- [ ] 🟡 **Rappresentazione di "Them"** — l'antagonista come entità/attore definito dal Brink del giocatore a destra del GM. *Mancante*.
- [ ] 🟢 **Supplies / equipment** (Step Seven) — item type opzionale per l'equipaggiamento. *Mancante*.

---

## Final recordings

Meccanica emotiva del finale: ogni giocatore registra un ultimo messaggio del personaggio; il GM le custodisce e le riproduce **alla fine** (dopo l'ultima candela). Non è solo grafica: tocca `die()` e il game over.

- [ ] 🟡 **Dato** — campo `recording = { path, hidden }` sul character DataModel; `hidden` di default → visibile solo al GM (rispetta la sorpresa).
- [ ] 🟡 **Opzione A — manuale via Discord vocale** — i giocatori registrano col telefono/Discord, il GM riproduce nel canale vocale. *Nessun codice*, fedele al rito.
- [ ] 🟡 **Opzione B — in-app (consigliata)** — upload di un file audio sulla scheda (`FilePicker`), playback **broadcast** con `foundry.audio.AudioHelper.play({src, volume}, true)`, con trigger automatici su `actor.die()` e su **game over** (tutte in sequenza) + controllo GM per riprodurle/rigiocarle.
- [ ] 🟢 **Opzione C — registrazione in-app** — `MediaRecorder` dentro una app ApplicationV2, salvataggio sul server Foundry. *Alto sforzo, dopo la B*.
- [ ] 🟡 **Privacy** — le registrazioni restano nascoste ai player fino al momento della riproduzione (flag GM-only).

---

## Integrazione Discord

- [ ] 🟢 **Webhook Foundry → Discord** — posta gli eventi di gioco in un canale (candela spenta, The Last Stand, morte di un personaggio). Indipendente, basso sforzo, **a senso unico**.
- Nota: l'audio **sincronizzato** delle recordings **non** passa da Discord (canali separati) ma da `AudioHelper` in-app; Discord resta ottimo per la **voce** del tavolo e per la riproduzione **manuale** delle recordings.

---

## UX e qualità

- [ ] 🟡 **Animazione di spegnimento** — dissolvenza della fiamma + fumo che parte quando una candela si spegne.
- [ ] 🟡 **Localizzazione italiana** (`lang/it.json`) e struttura per altre lingue.
- [ ] 🟡 **Impostazioni di sistema** (`game.settings`) — toggle: animazioni on/off, comportamento board, Dice So Nice.
- [ ] 🟡 **Pulsante toolbar consolidato** — gestione pulita delle API scene-controls di v13 **e** v14 (rimuovere il best-effort).
- [ ] 🟢 **ProseMirror** per le note della scheda (oggi textarea).
- [ ] 🟢 **Audio ambient** opzionale (crepitio/candela) con toggle.
- [ ] 🟢 **Preset Dice So Nice** a tema (dadi di cera/ambra).
- [ ] 🟢 **Migrazioni schema** — hook in `ready` che confronta `schemaVersion` ed esegue le migrazioni.

## Distribuzione e infrastruttura

- [ ] 🔴 **LICENSE** — licenza per il **codice**, con dicitura che separa il tuo lavoro dai contenuti protetti di *Ten Candles*.
- [ ] 🟡 **Verifica su v14** e bump di `compatibility.verified`.
- [ ] 🟡 **CHANGELOG.md** e note di release per ogni versione.
- [ ] 🟢 **CI di lint/validazione** nella GitHub Action (ESLint + check JSON/manifest prima della release).
- [ ] 🟢 **README in inglese** + screenshot/gif per la community Foundry.
