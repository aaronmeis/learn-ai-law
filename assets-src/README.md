# AI Law Deep Dive — Phase 5 asset sources

Build inputs for the generated study assets. Curriculum spine: `C:\obsidian\personal_research_2026\Learning\AI-Law\00 - AI Law Learning Hub.md` §3.

**Golden rule (same as the rest of the program):** pure learning. Every source here is a
public exemplar, statute, opinion, or the user's own study notes. No real company
agreement and no confidential text goes into any model or any generated asset.

## What gets generated

| Asset | Tool | Source file(s) here | Output dir |
|-------|------|---------------------|-----------|
| Master deck "AI Law in ~20 slides" | `gamma` | `gamma/00-master-deck.md` | `C:\output\obsidian\learning\ai-law\gamma\` |
| Contracts pillar revision deck | `gamma` | `gamma/01-contracts-deck.md` | same |
| IP pillar revision deck | `gamma` | `gamma/02-ip-deck.md` | same |
| Regulatory & litigation pillar revision deck | `gamma` | `gamma/03-regulatory-deck.md` | same |
| 6 × weekly one-pager infographic | `gemini-infographic` | `infographics/week-1.md` … `week-6.md` | `C:\output\obsidian\learning\ai-law\infographics\` |
| Master notebook "AI Law — Core Sources" | `notebooklm` | `notebooklm/master.md` (source manifest) | `C:\output\obsidian\learning\ai-law\notebooklm\master\` |
| 6 × weekly notebook (audio overview + video short) | `notebooklm` | `notebooklm/week-1.md` … `week-6.md` | `C:\output\obsidian\learning\ai-law\notebooklm\week-N\` |

## Run order (cheapest / most reversible first)

1. Connection tests: `/gamma test`, `/gemini-infographic test`, `nlm` auth check.
2. `/gamma preview` on each of the 4 deck sources (free — no credits).
3. One `gemini-infographic` (week 1) as a style check, then the remaining 5.
4. One NotebookLM notebook (week 1) end to end, then master + weeks 2–6.
5. Gamma generate the 4 decks once previews look right.

## Notebook source manifests

The `notebooklm/*.md` files are **manifests, not content** — they list the vault files and
public URLs to ingest as sources into each notebook, plus the tailored Studio prompts
(audio-overview focus, video-short focus). NotebookLM ingests sources; it does not need
prose from us.
