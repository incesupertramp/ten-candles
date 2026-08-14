# Ten Candles — ToDo funzionalità

Roadmap delle funzionalità **nuove** rispetto alla v0.1.0. Priorità: 🔴 alta · 🟡 media · 🟢 bassa.
La sezione "Meccaniche di gioco" nasce da una verifica diretta sul manuale ufficiale: distingue ciò che **manca** da ciò che è **parziale**.

---

## Meccaniche di gioco (verificate sul manuale)

### Creazione del personaggio (collaborativa)
- [~] 🔴 **Passaggio delle carte Trait** — flusso guidato nel tracker: ognuno scrive la **Virtù per il vicino di destra** e il **Vizio per il vicino di sinistra**; le scritture arrivano sul personaggio bersaglio via il canale GM-autoritativo. **Fatto** il motore di assegnazione ai vicini; **da rifinire**: passaggio a "carte" vero e ordine turni.
- [~] 🔴 **Brink scritti dai vicini** — passo "brink": ognuno scrive il Brink per il vicino di **sinistra**. **Fatto** nel flusso guidato.
- [~] 🔴 **Brink del GM e antagonista "Them"** — passo **"Them"** nel flusso: il GM scrive il **Brink di Them** (antagonista, annunciato in chat a fine creazione) e un **Brink per un personaggio a scelta** ("They have seen you…"). **Fatto** come regia GM; **da rifinire**: assegnazione automatica in base alla posizione (sinistra/destra del GM) e scrittura del Brink di Them da parte del giocatore designato.
- [x] 🟡 **Accensione progressiva delle candele** — durante la creazione le candele si accendono a gruppi: 3 (Traits) + 3 (Moments) + 3 (Brinks) + 1 (fine). Aggiunto anche il passo **Moment** (ognuno scrive il proprio) al flusso.
- [ ] 🟡 **Introduzione del Module** — area per il testo di scenario e l'apertura "These things are true. The world is dark." *Mancante*.

### Fase Truths (tra le scene)
- [~] 🔴 **Truths interattive** — pannello nel tracker con apertura del rito, raccolta condivisa delle verità (chiunque le aggiunge, sincronizzate), progressione N = candele accese, auto-chiusura con **"And we are alive"** + riepilogo in chat. **Fatto** il flusso interattivo; **ordine turni**: il GM può assegnare il turno (indicatore "tocca a…") in Verità e creazione. *Resta*: automatismo orario e regola sulla prima verità.
- [x] 🟡 **Registro delle verità** — le verità raccolte compaiono in lista nel tracker e vengono riepilogate in chat a fine rito.

### Risoluzione dei conflitti
- [x] 🔴 **Live Moment come conflitto reale** — vivere il Moment tira un conflitto vero; l'Hope die arriva in automatico sul successo. *Parziale* (oggi bottoni success/fail manuali).
- [x] 🟡 **Seize su conflitto fallito** — spegnere una candela **addizionale** (2 in totale) per prendere la narrazione di un fallimento. *Parziale* (oggi seize solo su successo).
- [x] 🟡 **Dire conflict completo** — conseguenze gravi + **morte volontaria**: su un dire fallito un giocatore può scegliere di morire e **vincere la narrazione** del conflitto fallito. *Parziale* (oggi solo il flag "dire").
- [x] 🟢 **GM narra sempre i conflitti falliti** (tranne morte volontaria) — enforcement della regola nella narration. *Sfumatura mancante*.

### Morte e candele
- [x] 🟡 **Martyrdom** — sulla scheda di un personaggio morto: seleziona un sopravvissuto e donagli un Hope die (annuncio in chat).
- [x] 🔴 **Identità delle candele** — stato candele come **array** di accese/spente; sulla plancia il GM **clicca la candela precisa** per spegnerla (animazione sulla candela giusta).

### Personaggio e antagonista
- [x] 🟡 **Segretezza del Brink** — il valore del Brink è mascherato ai non-proprietari sulla scheda; lo vedono solo proprietario e GM.
- [x] 🟡 **Rappresentazione di "Them"** — pannello persistente nel tracker con il Brink dell'antagonista una volta definito (visibile al tavolo come minaccia condivisa).
- [x] 🟢 **Supplies / equipment** — tipo di item **supply** con **quantità/consumo**, sezione nella scheda (aggiungi / +1 / usa / rimuovi) e scheda item dedicata.

---

## Final recordings

Meccanica emotiva del finale: ogni giocatore registra un ultimo messaggio del personaggio; il GM le custodisce e le riproduce **alla fine** (dopo l'ultima candela). Non è solo grafica: tocca `die()` e il game over.

- [x] 🟡 **Dato** — campo `recording = { path, hidden }` sul character DataModel; `hidden` di default → visibile solo al GM (rispetta la sorpresa).
- [ ] 🟡 **Opzione A — manuale via Discord vocale** — i giocatori registrano col telefono/Discord, il GM riproduce nel canale vocale. *Nessun codice*, fedele al rito.
- [x] 🟡 **Opzione B — in-app (consigliata)** — upload di un file audio sulla scheda (`FilePicker`), playback **broadcast** con `foundry.audio.AudioHelper.play({src, volume}, true)`, con trigger automatici su `actor.die()` e su **game over** (tutte in sequenza) + controllo GM per riprodurle/rigiocarle.
- [ ] 🟢 **Opzione C — registrazione in-app** — `MediaRecorder` dentro una app ApplicationV2, salvataggio sul server Foundry. *Alto sforzo, dopo la B*.
- [~] 🟡 **Privacy** — le registrazioni restano nascoste ai player fino al momento della riproduzione (flag GM-only).

---

## Integrazione Discord

- [ ] 🟢 **Webhook Foundry → Discord** — posta gli eventi di gioco in un canale (candela spenta, The Last Stand, morte di un personaggio). Indipendente, basso sforzo, **a senso unico**.
- Nota: l'audio **sincronizzato** delle recordings **non** passa da Discord (canali separati) ma da `AudioHelper` in-app; Discord resta ottimo per la **voce** del tavolo e per la riproduzione **manuale** delle recordings.

---

## Planchette della tavola ouija (spirito/GM)

Rifinire la planchette-master oltre lo stato attuale (punta a una lettera derivata dallo stato e "salta" a una nuova lettera quando il GM agisce).

- [x] 🟡 **Movimento fluido** — la planchette **scivola** verso la lettera bersaglio invece di saltare (transizione/`animateTransform` calcolando delta posizione tra un render e l'altro in `_onRender`).
- [x] 🟡 **Scia luminosa** — debole traccia ambra dietro la planchette mentre si muove (vende "lo spirito indica").
- [x] 🟡 **Trigger su narrazione del GM** — quando il GM scrive in chat (non tiri/whisper/annunci di sistema) lo **spirito si ravviva** (bagliore) sulla plancia. API `pointPlanchette`/`spellWord` già presenti.
- [x] 🟢 **Controllo GM manuale** — pannello nel tracker per far **comporre una parola** alla planchette (indica le lettere in sequenza) + `game.system.api.spellWord()` / `pointPlanchette()`.
- [x] 🟢 **Effetto sonoro** — suono procedurale di scivolamento quando la planchette si muove (impostazione, default off).
- [~] 🟢 **Idle ritmico** — l'alone dello spirito **pulsa** a riposo; micro-oscillazione di movimento non aggiunta (eviterebbe conflitti col transform base).

---

## UX e qualità

- [x] 🟡 **Animazione di spegnimento** — quando una candela si spegne, sulla plancia la fiamma sfuma e parte uno sbuffo di fumo (rispetta impostazioni/reduced-motion).
- [x] 🟡 **Localizzazione italiana** (`lang/it.json`) e struttura per altre lingue — completa (EN/IT).
- [x] 🟡 **Impostazioni di sistema** (`game.settings`) — animazioni della plancia on/off (client), effetto mangianastri on/off + intensità (world).
- [ ] 🟡 **Pulsante toolbar consolidato** — gestione pulita delle API scene-controls di v13 **e** v14 (rimuovere il best-effort).
- [x] 🟢 **ProseMirror** per le note della scheda (editor rich text al posto della textarea).
- [x] 🟢 **Audio ambient** opzionale — crackle procedurale di candele mentre la plancia è aperta (impostazione, default off).
- [x] 🟢 **Preset Dice So Nice** a tema (cera/ambra) — registrato via hook, solo se il modulo è presente.
- [x] 🟢 **Migrazioni schema** — hook in `ready` che confronta `schemaVersion` (setting world) ed esegue le migrazioni; scaffold pronto (nessuna trasformazione necessaria alla v1).

## Distribuzione e infrastruttura

- [x] 🔴 **LICENSE** — MIT sul **codice** + nota che separa il lavoro dai contenuti protetti di *Ten Candles*. Presente in `LICENSE`.
- [x] 🟡 **Verifica su v14** — `compatibility.verified` portato a "14".
- [x] 🟡 **CHANGELOG.md** e note di release per ogni versione — mantenuto a ogni versione.
- [x] 🟢 **CI di lint/validazione** — workflow `lint.yml` (node --check, validazione JSON, ESLint) + `eslint.config.js` e `package.json`.
- [~] 🟢 **README/manuale in inglese** — README + `MANUAL.en.md` presenti; mancano screenshot/gif.
