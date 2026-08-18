# Ten Candles — Game System non ufficiale per Foundry VTT

[English](README.md) · **Italiano**

![Ten Candles](assets/cover.png)

![Foundry](https://img.shields.io/badge/Foundry-v13%20%7C%20v14-informational)
![Version](https://img.shields.io/badge/version-0.3.1-orange)
![License](https://img.shields.io/badge/code%20license-MIT-green)
![Status](https://img.shields.io/badge/status-beta-yellow)

Sistema di gioco **non ufficiale, fan-made** che porta *Ten Candles* — il gioco di narrazione horror tragico di **Cavalry Games** — su Foundry Virtual Tabletop. Ricrea le dieci candele che si spengono, il pool di dadi che si assottiglia e la discesa collaborativa nel buio, dentro una seduta spiritica a lume di candela.

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
- Una **plancia seduta spiritica** vista dall'alto, generata per geometria: un tavolo tondo di legno con una **tavola ouija** rettangolare, dieci candele in anello (fumo + aloni caldi di luce) e un **cerchio rituale** che si intensifica al calare delle candele.
- **Webcam dei giocatori** in cerchio attorno al tavolo (2–6, adattive); al centro una **planchette** con la webcam del master ("lo spirito") che **scivola** verso una lettera quando il master agisce.
- **The Last Stand** tinge la plancia di rosso sangue. Completamente vettoriale (SVG), nitido a ogni risoluzione, rispetta `prefers-reduced-motion`.

**Riti e finale**
- **Creazione collaborativa dei personaggi**: un flusso guidato in cui i vicini si scrivono a vicenda Virtue, Vice e Brink, più un passo **"Them"** per l'antagonista.
- **Verità interattive** tra le scene, raccolte e sincronizzate al tavolo.
- **Registrazioni finali**: carichi un file audio pulito; Foundry lo riproduce con un effetto **vecchio mangianastri** in tempo reale.
- Localizzazione **italiana e inglese**.

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
2. Crea gli attori **character** e compila Concept, Virtue, Vice, Moment e Brink (oppure usa la **creazione collaborativa** dal tracker).
3. Apri la **plancia** — il pulsante fiamma nella toolbar, oppure `game.system.api.openBoard()`.
4. Come GM, premi **New game** per accendere le dieci candele, poi gioca: lancia i conflitti dalla scheda e spegni le candele mentre il buio avanza.

## 📚 Documentazione

- **Italiano** — [Manuale d'uso](MANUALE.md) · [Changelog](CHANGELOG.md) · [ToDo](TODO.md)
- **English** — [User manual](MANUAL.en.md) · [Changelog](CHANGELOG.en.md) · [Roadmap / ToDo](TODO.en.md)

## 🖼️ Screenshot

<!-- Aggiungi qui gli screenshot, es.: ![La plancia](docs/board.png) -->
*In arrivo.*

---

## 🗺️ Roadmap

Le meccaniche e funzionalità pianificate sono in **[TODO.md](TODO.md)** — tra cui l'accensione progressiva delle candele in creazione, l'ordine dei turni nelle Verità, il controllo manuale della planchette e la distribuzione via manifest pubblico. Le modifiche per versione sono in **[CHANGELOG.md](CHANGELOG.md)**.

## 🤝 Contribuire

Issue e pull request sono benvenute. Mantieni i contributi focalizzati **solo su meccaniche e interfaccia** — non includere mai testo o illustrazioni del manuale di *Ten Candles*.

## 📄 Licenza

Il **codice** di questo repository è rilasciato con licenza **MIT** (vedi `LICENSE`). La licenza copre solo il codice e **non** si estende a *Ten Candles*, che resta proprietà intellettuale di Cavalry Games.

## 🙏 Crediti

- *Ten Candles* © **Cavalry Games**.
- Sviluppo del sistema: **incesupertramp**.
