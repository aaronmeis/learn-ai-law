# AI Law Study — Prompt Library

Companion to the **AI Law Learning Hub**
(`C:\obsidian\personal_research_2026\Learning\AI-Law\00 - AI Law Learning Hub.md`).

These are reusable prompt templates for using an LLM as a study aid across the
6-week curriculum. Fill the `«angle-bracket»` slots and paste.

---

## 🔒 The golden rule — read before every session

**No confidential text ever goes into any model (Claude included).**

- This is a *pure learning* program. Every drafting, redline, and issue-spotting
  exercise runs on **public exemplars only** — published vendor terms
  (OpenAI / Anthropic / Google Cloud / AWS / Azure), standard templates
  (Common Paper, Bonterms, SCL, oneNDA), statutes, court opinions, and
  fictional scenarios you or the model invent.
- Never paste: a real company agreement, a draft under negotiation, internal
  memos, deal terms, counsel's advice, customer names, or anything a colleague
  told you in confidence.
- If you want to practice on something that resembles a real deal, **rebuild it
  as a fictional fact pattern** first (new party names, changed numbers,
  invented product) — or just use the public exemplar it's based on.
- The prompts below are written so you never *need* confidential input. If a
  prompt seems to ask for it, you're using the wrong prompt.

---

## The categories

| # | File | Use it to… | Default model |
|---|---|---|---|
| 1 | [`01-briefing.md`](01-briefing.md) | Get oriented on a topic, case, statute, or agency instrument fast — structured, cited, at the right rung | Sonnet 5 |
| 2 | [`02-socratic-examiner.md`](02-socratic-examiner.md) | Be quizzed, pushed, and gap-checked — the 200→300 engine | **Opus 5** |
| 3 | [`03-issue-spotter.md`](03-issue-spotter.md) | Run a fictional or public AI deployment through a legal-issue scan by pillar | Sonnet 5 (Opus 5 for capstone) |
| 4 | [`04-redline-assist.md`](04-redline-assist.md) | Work a **public** contract clause-by-clause: what it does, who it favours, what the fallback ask is | Sonnet 5 |
| 5 | [`05-translation.md`](05-translation.md) | Move between legalese ↔ plain English ↔ technical framing; prep for a counsel conversation | Sonnet 5 |
| 6 | [`06-standards-discriminator.md`](06-standards-discriminator.md) | Separate labels that get merged: 42001 audit stages, 23894, 22989, Measure vs TEVV, SP 800-37 vs the AI RMF, AIBOM vs SBOM, high-risk vs frontier, AI 600-1 | Sonnet 5 |
| 7 | [`07-genai-profile.md`](07-genai-profile.md) | Walk NIST AI 600-1 for one fictional generative use without treating the profile as a statute | Sonnet 5 |

Plus [`building-your-own.md`](building-your-own.md) — how to write and tune new prompts, and the anti-patterns to avoid.

---

## How to use these well

1. **Set the rung.** Tell the model whether you want 100 (orient), 200 (read the
   instrument), or 300 (contested / unsettled). The curriculum ladder is in
   Hub Sec. 2.
2. **Demand citations to primary sources.** Article number, section, paragraph,
   case name + court + year. If the model won't cite, don't trust the claim —
   go to the `reference/readings-*.md` ledgers.
3. **Cross-check the volatile stuff.** AI law moved fast in 2025–2026 (EO 14110
   rescinded; Colorado AI Act stayed; USPTO dropped the Pannu test; Bartz v.
   Anthropic settled ~$1.5B). Anything date-sensitive: verify against the
   ledger or the primary source before you rely on it.
4. **Keep the model in "study partner" mode, not "lawyer" mode.** You are
   building your own understanding, not collecting advice to act on. Ask it to
   show reasoning and disagreement, not just conclusions.
5. **Log what you learned**, not the transcript — 3 bullets into the week's
   lesson note.

## Model switch

Build/briefing/first-pass work: **Sonnet 5**. Switch to **Opus 5** for the
300-level Socratic examiner sessions (Weeks 2–6) and for capstone self-grading
(Hub Sec. 5). Everything here works on either; the examiner prompts are noticeably
sharper on Opus.
