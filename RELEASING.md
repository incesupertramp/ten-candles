# Publishing & releasing / Pubblicazione e release

> The system installs into Foundry via a **manifest URL**, which requires a **public** GitHub repo and a **published release** whose assets include `system.json` and `ten-candles.zip`. The release is built automatically by the GitHub Action when you push a `v*` tag.
>
> Il sistema si installa in Foundry via **manifest URL**, che richiede repo GitHub **pubblico** e una **release pubblicata** con allegati `system.json` e `ten-candles.zip`. La release è costruita in automatico dalla GitHub Action quando pubblichi un tag `v*`.

## One-time setup / Configurazione iniziale

1. Create the repo on GitHub as **`incesupertramp/ten-candles`** and set it **Public** (Foundry fetches the manifest anonymously).
2. Push the code (contents of `ten-candles-repo.zip`, i.e. the files at the repo root — `system.json`, `module/`, `.github/`, `README.md`, `LICENSE`, …).

```bash
cd ten-candles            # the extracted repo folder
git init
git add .
git commit -m "Ten Candles v0.3.2"
git branch -M main
git remote add origin https://github.com/incesupertramp/ten-candles.git
git push -u origin main
```

## Every release / A ogni release

The manifest `version`, `url`, `manifest`, and `download` are **patched automatically** from the tag by the workflow — you only push a tag.

```bash
git tag v0.3.2
git push origin v0.3.2
```

The Action then: patches `system.json`, zips the files at root, and publishes the release with `system.json` + `ten-candles.zip`.

## Install URL / URL di installazione

In Foundry → *Game Systems → Install System*, paste:

```
https://github.com/incesupertramp/ten-candles/releases/latest/download/system.json
```

## Checklist

- [ ] Repo **public**
- [ ] Tag `vX.Y.Z` matches `system.json` version
- [ ] Action run succeeded (release created with both assets)
- [ ] Manifest URL resolves to the latest `system.json`
