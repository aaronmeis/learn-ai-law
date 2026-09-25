# Learn AI Law

![Learn AI Law: Contracts, Intellectual Property, US Regulation, EU AI Act, Privacy](assets/readme/header.png)

A personal, self-contained study console for a 6-week study program covering AI contracts, intellectual property, regulation, and Responsible AI. Built for an enterprise architect audience.

**Not legal advice.** Study material only.

**Live:** https://aaronmeis.github.io/learn-ai-law/

## What's here

- `index.html` (+ `assets/` + `media/shorts/`): the study console. A single-page app, no build step, no external dependencies beyond Google Fonts, with a knowledge base, quiz bank, glossary, case tracker, **35 vertical NotebookLM shorts** (25 curriculum plus 10 on the September 2026 standards, Measure and TEVV, security RMF, and AIBOM pages), **six week presenter decks**, and a dedicated **EU AI products** section and **ISO/IEC 42001**, **23894**, and **22989** study views plus a standards map (words, methods, obligations) and a NIST Measure and TEVV study view (AIMS clauses and Annex A; AI risk guidance on ISO 31000, objectives, and risk sources) (AI in products, AI-assisted product creation, EU vs US contrast, roles, risk tiers, GPAI embeds, conformity, and product liability). Published via GitHub Pages from the repo root.
- `assets-src/`: source material behind the console, including Gamma deck outlines, NotebookLM prompts, and infographic briefs.
- `prompts/`: reusable prompt templates for studying (Socratic examiner, issue-spotter, redline assist, translation, briefing).

## Layout

- `index.html`: page shell, grouped navigation, mobile tab bar.
- `css/base.css`: themes and the original view styles. `css/enhance.css`: Today, Shorts feed, mobile chrome, search.
- `js/data.js`: study content (references, glossary, weeks, ladder, quiz). `js/app.js`: the original views. `js/enhance.js`: routing (`#/today`, `#/shorts/<id>`), Today screen, Shorts feed and checks, streaks, search (Ctrl/Cmd K), export and import.
- `shorts-meta.json`: pillar, keywords, duration, poster and `youtube` ID per Short. Kept apart from `shorts-catalog.json` so the download scripts can rewrite the catalog. Run `python scripts/enrich_shorts_meta.py` after adding Shorts.
- `manifest.webmanifest` and `sw.js`: install to a phone home screen; notes, cards and quizzes work offline.

## Moving Shorts to YouTube

Upload each MP4 as an **unlisted** video, then paste its video ID (the part after `v=`) into that Short's `"youtube"` field in `shorts-meta.json`. Shorts with an ID play from YouTube; the rest keep playing from `media/shorts/`. Once every Short has an ID you can delete the MP4s from the repo.

## Running locally

Serve the folder (the Shorts and deck catalogs are loaded with `fetch`, which does not work from a double-clicked file):

```
npx serve .
```
