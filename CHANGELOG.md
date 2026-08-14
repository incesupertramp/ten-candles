# Changelog

## v0.4.0 — Sicurezza al tavolo, scenario, libro delle Verità

- **Strumenti di sicurezza**: nuova app **Scenario & Sicurezza** (pulsante nel tracker, `game.system.api.openSafety()`). Include una **X-Card** che chiunque può premere (annuncio in chat per fermare/aggiustare una scena) e i **Lines & Veils** condivisi della Session Zero.
- **Testo del Module**: il GM scrive l'ambientazione e l'apertura; viene mostrata in chat all'avvio della partita.
- **Libro delle Verità**: registro **persistente** che raccoglie tutte le verità stabilite, scena per scena (prima finivano solo in chat e si azzeravano). Localizzazione EN/IT.

## v0.3.9 — Turni ordinati + idle della planchette

- **Ordine dei turni nelle Verità**: la **prima verità** spetta a chi ha **fallito/seized** il conflitto (altrimenti il GM); poi il turno **avanza in senso orario** a ogni verità inviata. Il GM può sempre forzare il turno.
- **Idle della planchette**: a riposo la planchette **dondola** leggermente (oltre all'alone che pulsa), senza interferire con posizione e rotazione. Rispetta impostazioni e prefers-reduced-motion.

## v0.3.8 — Rifiniture: planchette viva, audio, note rich text

- **Planchette su narrazione**: quando il GM scrive in chat (non tiri/whisper/annunci di sistema) lo **spirito si ravviva** con un bagliore sulla plancia.
- **Suono planchette** (opzionale, default off): un lieve scivolamento procedurale quando la planchette si muove.
- **Audio ambientale** (opzionale, default off): un leggero **crackle** di candele mentre la plancia è aperta.
- **Note in ProseMirror**: le note della scheda ora usano un editor rich text al posto della textarea.

## v0.3.7 — Candele con identità, ordine turni, provviste

- **Identità delle candele**: lo stato passa da conteggio ad **array** di accese/spente. Sulla plancia il **GM clicca la candela precisa** da spegnere; l'animazione di spegnimento parte sulla candela giusta. Il pulsante "Spegni" resta come scorciatoia (spegne una accesa).
- **Ordine dei turni**: il GM può **assegnare il turno** a un personaggio (indicatore "Turno: …" per tutti) durante Verità e creazione.
- **Supplies / equipment**: nuovo tipo di item **supply** con **quantità e consumo**; sezione nella scheda del personaggio (aggiungi, +1, usa una, rimuovi) e scheda item dedicata. Aggiunto `documentTypes` al manifest.

## v0.3.6 — Planchette parlante, preset dadi, v14, CI

- **Planchette manuale (GM)**: dal tracker il master può far **comporre una parola** alla planchette, che indica le lettere in sequenza (scivolando da una all'altra). API: `game.system.api.spellWord("…")` e `pointPlanchette("A")`; "Auto" torna al comportamento automatico.
- **Preset Dice So Nice** a tema cera/ambra (registrato solo se il modulo è presente).
- **Compatibilità v14**: `compatibility.verified` portato a "14".
- **CI**: workflow di **lint/validazione** (node --check, JSON, ESLint) con `eslint.config.js` e `package.json`.

## v0.3.5 — Segretezza del Brink + "Them" persistente

- **Segretezza del Brink**: sulla scheda il valore del Brink è **mascherato** a chi non è proprietario né GM (lo vedono solo tu e il GM).
- **"Them" come entità**: una volta definito, l'antagonista compare in un **pannello persistente** nel tracker con il suo Brink, come minaccia condivisa del tavolo.

## v0.3.4 — Martyrdom + animazione di spegnimento

- **Martyrdom**: sulla scheda di un personaggio **morto** compare un controllo per **donare un Hope die** a un sopravvissuto a scelta (annuncio in chat). La scrittura passa dal canale GM-autoritativo.
- **Animazione di spegnimento**: quando una candela si spegne, sulla plancia la **fiamma sfuma** e parte uno **sbuffo di fumo**. Rispetta l'impostazione animazioni e prefers-reduced-motion.

## v0.3.3 — Impostazioni di sistema + scaffold migrazioni

- Nuove **impostazioni** (Configure Settings): **animazioni della plancia** on/off (per utente); **effetto mangianastri** on/off e **intensità** regolabile (0.3–1.6, per il mondo).
- **Migrazioni schema**: hook in `ready` che confronta `schemaVersion` e prepara il terreno per migrazioni future (nessuna trasformazione necessaria alla v1).

## v0.3.2 — Creazione: candele progressive + passo Moment

- Durante la **creazione collaborativa** le candele si accendono **progressivamente**: 3 (Traits) + 3 (Moments) + 3 (Brinks) + 1 (fine) → 10. Si vedono accendersi sulla plancia man mano che il GM avanza i passi.
- Aggiunto il passo **Moment** al flusso (ognuno scrive il **proprio** Momento): ora Virtù → Vizio → Moment → Brink → Them → fine.
- A fine creazione lo stato è pronto al gioco (10 candele, pool 10/0, scena 1). Localizzazione EN/IT.

## v0.3.1 — Creazione: passo "Them" (Brink GM + antagonista)

- Nuovo passo **"Them"** nel flusso di creazione: il GM scrive il **Brink dell'antagonista "Them"** (annunciato in chat a fine creazione) e un **Brink per un personaggio a scelta** ("They have seen you…").
- Ordine dei passi ora: Virtù → Vizio → Brink → **Them** → fine.
- Localizzazione EN/IT.
- *Da rifinire* (TODO): assegnazione automatica sinistra/destra del GM e scrittura del Brink di Them dal giocatore designato; accensione progressiva delle candele.

## v0.3.0 — Creazione collaborativa (primo milestone)

- **Flusso di creazione guidato** nel tracker: il GM avvia la creazione; a passi (Virtù → Vizio → Brink) ogni giocatore scrive il campo per il **vicino** — **Virtù al vicino di destra**, **Vizio e Brink al vicino di sinistra** — e la scrittura arriva sul personaggio bersaglio via il canale GM-autoritativo.
- Il GM vede una **checklist** di chi ha già scritto e comanda avanzamento/termine dei passi.
- Localizzazione EN/IT.
- **Ancora da fare** (nel TODO): Brink del GM + antagonista "Them", accensione progressiva delle candele, passaggio a "carte" con ordine dei turni.

## v0.2.11 — Registrazioni con effetto "mangianastri"

- Le registrazioni finali vengono riprodotte con un **effetto lo-fi in tempo reale** (Web Audio): banda ridotta, boost dei medi "scatolato", saturazione, **wow/flutter** e **fruscio del nastro**. Si carica un file pulito (mp3/ogg/wav); la distorsione la fa Foundry.
- Riproduzione **trasmessa via socket** ed elaborata localmente da ogni client (audio uguale per tutti), con **fallback** a riproduzione semplice se la Web Audio non è disponibile.

## v0.2.10 — Recording: sezione sempre visibile

- La **registrazione finale** ora è **sempre visibile** sulla scheda (non più solo in modifica): campo + pulsante FilePicker per l'owner, pulsante di ascolto per il GM.
- Aggiunta scorciatoia `game.system.api.playRecordings()` per provare la riproduzione senza arrivare al game over.

## v0.2.9 — Final recordings (audio finale)

- Nuovo campo **registrazione finale** sul personaggio (`recording.path`, riservata al GM).
- Sulla scheda: **FilePicker audio** per caricare l'ultimo messaggio (in modifica) e pulsante di ascolto per il GM.
- Riproduzione **broadcast** a tutto il tavolo (`AudioHelper.play(..., true)`) e pulsante **"Riproduci le registrazioni finali"** nel tracker al game over, che le suona **in sequenza**.
- Localizzazione EN/IT aggiornata.

## v0.2.8 — Verità interattive + planchette fluida

- **Blocco B — Verità interattive**: allo spegnimento di una candela (≥2 accese) si apre la fase Truths nel tracker — rito d'apertura, raccolta condivisa e sincronizzata delle verità (chiunque le aggiunge), progressione N = candele accese, auto-chiusura con «E noi siamo vivi» e riepilogo in chat. Il GM può chiudere in anticipo.
- **Planchette**: ora **scivola** verso la nuova lettera quando il master agisce, con **scia luminosa** che sfuma (rispetta prefers-reduced-motion).

## v0.2.7 — Localizzazione italiana

- **Traduzione italiana completa** (`lang/it.json`, 91 stringhe) e registrazione della lingua nel manifest: schede, tracker, plancia, carte di conflitto e notifiche in italiano.
- Aggiornato il TODO con le feature della planchette della tavola ouija.

## v0.2.6 — Board seduta spiritica (top-down)

- **Board ridisegnata da zero** in vista dall'alto, generata per geometria: tavolo tondo di legno con **tavola ouija** (OUIJA, YES/NO, sole/luna, A-Z, numeri, GOOD BYE).
- **Planchette-master** con la webcam del GM che punta a una lettera e si sposta quando il master agisce (spegne candele / cambia scena).
- **10 candele in anello** con fumo, alone caldo sul legno e cera fredda quando spente.
- **Webcam dei giocatori in cerchio** attorno al tavolo (2–6, adattive).
- **Cerchio rituale** (pentagramma) che si intensifica al calare delle candele; **Last Stand** con velo rosso e rituale color sangue. Animazioni disattivate con prefers-reduced-motion.

## v0.2.5 — Seduta: geometria e riempimento schermo

- **Tavolo tondo più piccolo** con le sedie **tutte attorno** e visibili (prima quelle laterali finivano coperte dal tavolo).
- **Planchette al centro più grande e chiara**, con lo slot dello spirito ben leggibile.
- **La scena riempie l'area** della board invece di restare piccola e centrata.
- Sipari più sottili e info in alto ricollocate.

## v0.2.4 — Seduta spiritica

- **Sedie player in cerchio completo** attorno al tavolo (2–4, adattive), con vuoto in alto per le info.
- **Nessuna sedia per il GM**: al centro una **planchette** con lo slot dello spirito (webcam del GM), alone ambra pulsante ed etichetta "THE SPIRIT".
- Info (candele/scena/pool) spostate in alto; la board resta legata ai dati e alla scenografia teatrale.

## v0.2.3 — Finezze sceniche

- **Fumo leggero** che sale dalle candele accese; **pozze di luce** calde sotto ognuna.
- **Cera fredda** che si accumula attorno alle candele spente.
- **Pulviscolo** che fluttua nel fascio del riflettore e leggero **respiro** della luce.
- **Reattività al Last Stand**: ribalta e riflettore si abbassano, un velo rosso cala sulla scena (e sparisce col game over).
- Nomi lunghi troncati con eleganza sulle sedie. Tutte le animazioni rispettano prefers-reduced-motion.

## v0.2.2 — Plancia teatrale

- **Palcoscenico**: sipari bordeaux e mantovana incorniciano la scena, pavimento del palco in prospettiva con luci di ribalta, riflettore sul tavolo e vignettatura.
- **Cerchio rituale** inciso attorno ai giocatori, che **si intensifica man mano che le candele si spengono** (e vira al sangue nel Last Stand).

## v0.2.1 — Scheda ridisegnata

- **Restyle candlelit** coerente col tavolo: Trait a carte (si incarboniscono quando bruciati), Moment e Brink in fasce, Brink che si accende da solo quando disponibile.
- **Hope come fiammelle cliccabili** (clic per accendere/spegnere) al posto dei bottoni +/reset.
- **Modalità lettura + tasto Modifica**: i campi sono in sola lettura finché non premi "Edit".
- **Stato vivo/morto** dalla fiamma in alto (smorza la scheda da morto).

## v0.2.0 — Blocco A: Conflitti

- **GM narra sempre i conflitti falliti** (salvo seize o morte volontaria).
- **Seize su fallimento**: prendere la narrazione di un conflitto fallito costa una candela addizionale (2 totali); su successo resta 1.
- **Dire + morte volontaria**: su un dire fallito compare "Choose death" — il PG muore e narra il conflitto fallito.
- **Live Moment come tiro reale**: nuovo bottone sulla scheda che gioca il Moment come conflitto (Hope automatico sul successo); restano anche i bottoni manuali success/fail.

## v0.1.9

- **Webcam negli slot (sperimentale)**: ogni sedia mostra il video A/V di Foundry del suo utente dentro lo slot-volto circolare; se il flusso non c'e (A/V spento o nessuna camera) resta il segnaposto.
- Comando di diagnostica: game.system.api.debugCameras().

## v0.1.8

- **Sedie per account player** (non solo connessi): mostra da 2 a 4 sedie in base ai giocatori configurati.
- **Info centrale leggibile**: spostata nella fascia libera in alto-centro con un pannellino scuro dietro (prima era coperta dalla candela davanti).

## v0.1.7

- **Plancia come tavolo-scena in prospettiva**: tavolo in legno visto dall'alto con pozza di luce, dieci candele realistiche (cera, colature, fiamma con alone e flicker) in anello ampio.
- **Sedie adattive**: da 2 a 4 giocatori in semicerchio in base ai player collegati, GM di fronte; ogni sedia ha lo slot-volto (segnaposto, pronto per le webcam).
- **Info al centro dell'anello** (candele accese, Scene, Player, GM): sempre leggibili.

## v0.1.6

- **✕ di chiusura nella barra sinistra** (area libera), invece che in alto a destra.
- **Controlli e scritte della board sollevati** per non finire sotto le barre di Foundry (hotbar) e restare visibili/cliccabili.
- Rimossa la barra-titolo interna che si sovrapponeva al toolbar sinistro (il Last Stand resta segnalato dal medaglione rosso).

## v0.1.5

- **Plancia in secondo piano**: ora è a tutto schermo ma SOTTO l'interfaccia di Foundry (legge lo z-index reale di #interface). Toolbar, sidebar e chat restano sopra e usabili.
- **Pulsante di chiusura galleggiante**: una ✕ sempre in primo piano per chiudere la board (la ✕ interna resterebbe sotto le toolbar). Darken/New game si usano dal tracker; il click sulle candele al centro resta attivo.

## v0.1.4

- **Plancia di nuovo visibile**: torna a coprire lo schermo (z-index alto), ma lascia scoperta la colonna della sidebar a destra, così la chat resta usabile. Calcolo basato sul bordo sinistro della sidebar (affidabile su v13/v14).

## v0.1.3

- **Plancia collocata correttamente**: inserita dentro l'interfaccia di Foundry, sopra il canvas ma sotto la UI. Sidebar, chat e controlli restano sopra e cliccabili; niente più sovrapposizioni.

## v0.1.2

- **Plancia non invadente**: ora copre solo l'area del canvas; sidebar, chat e controlli di Foundry restano visibili e cliccabili.
- **Conferma New game in-board**: niente più popup nascosto sotto la plancia; la conferma appare tra i controlli della board.

## v0.1.1

Correzioni per Foundry v14.

- **Plancia a tutto schermo**: ripristinato il CSS della board (era stato rimosso per errore) e forzato l'overlay a coprire lo schermo sopra l'interfaccia (z-index alto). Ora la plancia si apre correttamente su v13 e v14.
- **Pulsante toolbar**: rimosso `onClick` deprecato in favore di `onChange` (niente più avviso di deprecazione su v14).

## v0.1.0

Prima release.

- Meccaniche complete: dieci candele, pool giocatori/GM sincronizzati, conflict roll interattivo (successo 6 / hope 5-6, scarto degli 1, narration rights), Trait/Moment/Brink, The Last Stand, fine partita.
- Grafica candlelight: plancia circolare a tutto schermo, character sheet e conflict card a tema, flicker delle fiamme, rispetto di `prefers-reduced-motion`.
