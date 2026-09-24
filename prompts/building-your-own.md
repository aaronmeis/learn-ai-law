# Building your own prompts

The five categories cover the recurring moves. This guide is for when you need
something they don't cover — and for tuning the ones that don't quite land.

---

## The anatomy of a good study prompt here

1. **Role + learner context.** "You are my AI-law study partner. I'm an
   enterprise AI architect, no formal legal training, building toward
   near-practitioner fluency. Pure learning — not legal advice."
   Paste this every time; it sets register and stops the model hedging into
   uselessness or overclaiming into advice.

2. **The rung.** 100 / 200 / 300 (Hub Sec. 2). Without it the model averages to a
   mushy 150. Say which one and why ("I can read the AI Act, I want the
   contested layer").

3. **The output shape.** Ask for a table, a numbered list, a brief in IERAC
   format, "one question at a time". Unstructured answers are hard to study
   from and hard to grade yourself against later.

4. **A citation demand.** "Cite to section/article, or case + court + year. If
   you can't cite it, mark it uncertain." This is the single highest-leverage
   line.

5. **A currency check.** "Flag anything that changed in 2025–2026 and give your
   confidence." The training data has a cutoff; the law kept moving.

6. **A self-assessment hook.** End with "then tell me what I got wrong / what's
   shaky / what to read next." The learning is in the feedback, not the answer.

---

## Tuning moves when a prompt underperforms

| Symptom | Fix |
|---|---|
| Answers are vague / hedged | Add the rung; demand a concrete example and a citation for every claim. |
| Model gives conclusions, not understanding | "Show the reasoning chain. Which factor/element did the work? What's the counter-argument?" |
| Model slips into giving advice | Re-assert "pure learning, not advice — I need to understand, not act." |
| Too easy — I'm never wrong | "Be a hard grader. Assume I'm bluffing when I'm vague. Rank my gaps by how badly they'd land in a room with a lawyer." |
| Stale or wrong on 2025–26 developments | Give it the fact from the ledger, ask it to reason from that. Cross-check `reference/readings-*.md`. |
| Answers ramble | Constrain: word count, number of points, "tight". |

---

## Things to never build a prompt around

- **Confidential input.** No prompt should require a real agreement, draft, deal
  term, internal memo, or something a colleague said in confidence. If you're
  reaching for one, stop and rebuild it as a fictional fact pattern or use the
  public exemplar.
- **"Draft this for me to send/sign."** This program is conceptual. Prompts
  produce *understanding and practice artifacts*, not work product for a live
  matter.
- **"What should we do?"** That's counsel's call. Ask "what are the options and
  trade-offs, and what would counsel need to decide this?"

---

## A template to start from

```
You are my AI-law study partner. I'm an enterprise AI architect with no formal
legal training, building toward near-practitioner fluency. Pure learning — not
legal advice; I need to understand, not act.

Task: «what you want»
Rung: «100 / 200 / 300»
Output shape: «table / numbered brief / one question at a time / …»

Requirements:
- Cite primary sources (section/article, or case + court + year); mark anything
  you can't cite as uncertain.
- Flag anything that changed in 2025–2026 with your confidence level.
- End by telling me what to read next and (if applicable) what I got wrong.
```

---

## Where prompts live

This folder is the source of truth. If a prompt proves broadly useful, it can be
lifted into the study SPA's "Prompts" tab (Phase 4) so it's available during
sessions without leaving the learning flow. Keep the wording in sync.
