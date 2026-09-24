# 3 · Issue-spotter prompts

Run an AI deployment through a structured legal-issue scan by pillar. Use
**fictional scenarios** (invent them, or have the model invent them) or **public
case studies** — never a real internal deployment described in identifying detail.

**Model:** Sonnet 5 for practice; **Opus 5** for the Week-6 capstone exam.
**Curriculum fit:** Weeks 2, 5, 6; the standing ritual afterward.

---

## 3.1 — Full issue scan on a fictional deployment

```
You are my AI-law study partner. Here is a FICTIONAL enterprise AI deployment
(all names and facts invented for practice):

«describe: what the system does, which model/vendor, what data flows in, who
uses the output, what decisions it influences, which jurisdictions, B2B or
consumer-facing»

Produce a legal-issue map. For each of the three pillars, list the issues:

CONTRACTS — vendor-terms exposure: training on our data, output IP + indemnity
scope and carve-outs, AUP triggers, model deprecation, liability caps,
flow-down if we embed it.

INTELLECTUAL PROPERTY — copyrightability of outputs, training-data infringement
exposure, trade-secret leakage via prompts, licence compliance for any open
weights, patent/inventorship if outputs feed R&D.

REGULATORY & LITIGATION — EU AI Act (role: provider/deployer? high-risk? GPAI?
Art. 50 transparency?), US federal posture, binding state laws + effective
dates, sector rules (hiring/health/credit), privacy (GDPR Art. 22, ADMT,
DPA needs), FTC Sec. 5 exposure.

For each issue give: (a) one-line statement, (b) the governing authority with a
citation, (c) severity (blocker / material / monitor), (d) settled or unsettled.
End with the 5 issues I'd raise with counsel first and why.
```

---

## 3.2 — Generate a fresh practice scenario

```
Invent a realistic but fictional enterprise AI deployment for me to issue-spot.
Make it messy: at least one cross-border data flow, one sector-regulation hook,
one ambiguous provider/deployer question, and one IP wrinkle. Give me ~250 words
of facts and nothing else — no analysis yet. Vary it from anything typical so I
can't pattern-match.
```

Then run 3.1 on your own answer, and compare with:

```
Here is my issue-spot of the scenario you gave me: «paste».
Grade it: issues I nailed, issues I missed (with authority), issues I raised
that don't really apply, and mis-rated severities. Score /100 with a rubric
breakdown. Be a hard grader.
```

---

## 3.3 — Single-pillar deep scan

```
Scan this fictional deployment for «CONTRACTS / IP / REGULATORY» issues only,
but go deep — 200/300 level. Include the issues a first pass usually misses
(e.g. carve-outs to the IP indemnity, fine-tune ownership, EU AI Act
extraterritorial reach, adverse-action notice timing). Authority for each.

Scenario: «...»
```

---

## 3.4 — "What would break this deployment?"

```
Given this fictional deployment, play the adversary: what's the legal event that
forces a redesign or shutdown? Walk through the realistic bad scenarios — a
training-data injunction against the vendor, an AI Act enforcement action, a
state AG under a consumer-protection theory, a trade-secret claim, an
indemnity that turns out not to cover our use. For each: how plausible, what's
the trigger, what's the early-warning signal in the litigation tracker or feeds.

Scenario: «...»
```

---

## 3.5 — Map issues to controls

```
Here is my issue map: «paste 3.1 output».
For each material issue, give the control that addresses it and where it lives:
contract clause to negotiate, technical/process control, policy, or documentation
(e.g. AI Act Annex IV technical file). Note where one control satisfies multiple
regimes (NIST AI RMF + EU AI Act + state law) so I can sequence them.
```
