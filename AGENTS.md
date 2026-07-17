# AGENTS.md

## What this is

A static, browser-only presentation for Ada Homolova and Johan Schuijt’s Wikimania 2026 session, **“Who is running the world? Political data matters.”** The session introduces EveryPolitician, Wikidata, and PoliLoom, then moves into a hands-on data-verification exercise and community discussion.

The opening includes audience polls about who counts as a politician. There is no application server, database, build step, or package manager.

## Files

- `index.html` — Reveal.js slide deck, speaker notes, presenter-side poll control, and live result bars.
- `poll.html` — mobile audience voting page.
- `polls.js` — shared poll questions and MQTT configuration.
- `style.css` — EveryPolitician-branded deck and poll-result styling.
- `fonts/`, `images/` — local presentation assets.

Reveal.js, MQTT.js, and the QR generator are loaded from CDNs.

## Poll architecture

The deck controls the poll currently shown on audience devices. A slide with `data-poll="<id>"` corresponds to an entry in `POLLS` in `polls.js`.

Messages use retained MQTT topics on a public broker:

- `<prefix>/control` — active question ID.
- `<prefix>/vote/<question>/<clientId>` — one device’s latest vote.

Audience device IDs and selections are stored in `localStorage`. The presenter deck tallies incoming votes in memory. Presenter mode is enabled with `index.html?key=<PRESENTER_KEY>` and remembered in `sessionStorage`; `&reset` clears retained votes as they arrive. The key prevents accidental control by shared deck copies, but is not a security boundary.

## Working locally

Serve the directory over HTTP, for example:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. Internet access is required for CDN dependencies and the public MQTT broker.

When editing polls, `polls.js` is the single source of truth for question text — poll-slide headings in `index.html` are stamped from it at runtime, so their `<h2>`s stay empty in the markup. Keep every `data-poll` ID unique and present in `POLLS`. Preserve speaker notes in `<aside class="notes">` and the deck’s existing section structure.
