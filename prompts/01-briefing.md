# 1 · Briefing prompts

Get oriented fast, at the right rung, with citations you can chase.
**Model:** Sonnet 5. **Curriculum fit:** every week, especially Weeks 1–2.

---

## 1.1 — Topic briefing at a set rung

```
You are my AI-law study partner. I am an enterprise AI architect with no formal
legal training, building toward near-practitioner fluency. This is pure learning —
do not give legal advice, give me a structured understanding.

Brief me on: «topic — e.g. "the fair-use question in AI training-data cases">

Target rung: «100 orient / 200 read-the-instrument / 300 contested»

Structure your answer as:
1. The one-paragraph "why this matters to an AI deployment" framing.
2. The governing authority — statutes, regulations, agency guidance, key cases —
   each with a proper citation (section/article, or case name + court + year).
3. The current majority / default position, stated plainly.
4. What is genuinely unsettled or split, and who is on which side.
5. 3–5 terms of art I must be able to use precisely, defined.
6. What to read next from primary sources (name them).

Flag anything that changed in 2025–2026, and tell me your confidence on each
date-sensitive point.
```

---

## 1.2 — Case brief (IERAC format, architect lens)

```
Brief this case for me: «case name, court, year»

Use this format:
- Posture & procedural history (one line).
- Issue(s) — as a yes/no legal question.
- Holding — what the court actually decided.
- Reasoning — the chain, including which fair-use factor / statutory element
  did the work.
- What it does NOT decide (scope limits, dicta, open questions).
- Why an AI architect should care: what deployment or contracting decision does
  this touch?
- How it fits the litigation tracker: does it align with or cut against
  «other case»?

Cite to the opinion by page or section where you can. If you're unsure whether
this is current (appeal pending, settled, vacated), say so.
```

---

## 1.3 — Statute / regulation / EO walkthrough

```
Walk me through: «instrument — e.g. "EU AI Act Article 50" / "Colorado SB 24-205"
/ "EO 14179">

Give me:
1. What kind of instrument this is and its legal force (binding? on whom?
   preempted? stayed?).
2. Effective date(s) and any phased timeline.
3. Scope — who is a regulated party, what triggers coverage, key exemptions.
4. The core obligations, in plain language, as a list.
5. Enforcement — who enforces, what penalties, any enforcement actions so far.
6. For an AI architect: which obligations would land on us as a provider vs a
   deployer vs a downstream integrator.
7. Current status as of «today's date» — pending amendments, litigation,
   rescission risk.

Quote the operative language for the 2–3 most important provisions.
```

---

## 1.4 — Compare instruments / positions side by side

```
Compare «A» and «B» on «dimension».
Examples: OpenAI vs Anthropic vs Google Cloud on output-IP indemnification;
EU AI Act high-risk obligations vs Colorado AI Act duties; the pro-supplier vs
pro-customer SCL AI clauses.

Output a table: rows = the sub-points that matter, columns = each instrument,
cells = the actual position (quote or tight paraphrase). Then 3 bullets on the
practical takeaway for someone reviewing vendor terms. Note where a column is
"silent" — silence is a finding.
```

---

## 1.5 — "Get me to 200 on this in 30 minutes"

```
I have 30 minutes before a working session on «topic». I'm at rung 100 and need
to get to 200 (able to read the primary instrument and follow counsel).

Give me: the 5 things I must know, the 3 primary documents to have open, the
vocabulary I'll hear, the 2 most common misconceptions, and one question I
should be able to answer at the end. Keep it tight.
```
