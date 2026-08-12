# Changelog

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
