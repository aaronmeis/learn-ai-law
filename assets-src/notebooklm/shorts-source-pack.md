# Learn AI Law — Shorts source pack (enterprise architect)

**Purpose:** Compact source for NotebookLM vertical shorts. Study material only. Not legal advice.
**Audience:** Enterprise AI architects who need working legal fluency across contracts, IP, US/EU regulation, Responsible AI, and defense/national-security AI rules.
**Currency:** Reflects the Learn AI Law curriculum as of 2026-09-08, including FY2026 NDAA (P.L. 119-60) and the NSCAI Final Report (2021).

---

## Pillar map

| Pillar | Weight | Architect job |
|---|---|---|
| Contracts | 35% | Redline vendor AI terms; own data/training rights; indemnity reality |
| Intellectual property | 25% | Classify assets across copyright, patent, trade secret, trademark |
| Regulation & litigation | 25% | Map binding rules (federal, state, EU, defense) to the product |
| Responsible AI | 15% | Wire NIST AI RMF / ISO 42001 into engineering controls |

---

## Sources of law (force hierarchy)

1. **Statute** — hardest to change (Congress / state legislature). No comprehensive *civilian* US AI statute yet. Defense AI rules increasingly appear in the annual NDAA.
2. **Legislative rule** — agency notice-and-comment rule (APA); force of law once final.
3. **Executive order** — binds the executive branch; next President can rescind.
4. **Sub-regulatory guidance** — FAQs, technical assistance; persuasive only; withdrawable at will.
5. **Common law** — judge-made (contracts, torts, product liability for AI harms).
6. After *Loper Bright* (2024), courts no longer defer to agency readings of ambiguous statutes under *Chevron*.

---

## US federal civilian posture (2026 snapshot)

- EO 14110 (Biden 2023) **rescinded** Jan 20 2025.
- Governing charter: **EO 14179** (Jan 23 2025) + **"Winning the Race: America's AI Action Plan"** (Jul 23 2025).
- Companion orders include EO 14319 (federal LLM procurement neutrality) and EO 14365 (state-law preemption strategy / DOJ task force).
- OMB **M-25-21** (agency AI use) and **M-25-22** (agency AI acquisition) replaced Biden-era memos; M-25-22 bites on solicitations on/after Sep 30 2025.
- Civilian enforcement still runs through generally applicable law: **FTC Act §5**, ECOA/FCRA, Title VII/ADA.
- FTC **Operation AI Comply**; *Rytr* order set aside; *Rite Aid* facial-recognition order stands.

---

## Defense / national security AI

### FY2026 NDAA (P.L. 119-60, enacted Dec 18 2025)

Main *congressional* defense AI vehicle. Title XV Subtitle D:

- **§1532 Covered AI systems** — Restricts DOD use/acquisition of covered AI, including systems associated with DeepSeek and High Flyer and with covered nations (China, Russia, Iran, North Korea). Limited SECDEF waivers for research, testing, evaluation, training, and specified national-security missions. Architect action: inventory model-vendor provenance before DOD-facing work.
- **§1533** — Cross-functional team for AI model assessment/oversight; DOD-wide framework for performance standards, testing, security, documentation, ethical-AI compliance.
- **§1534** — AI sandbox environments (isolated, controlled compute) for experimentation/testing/training, plus department-wide sandbox standards.
- **§1535** — AI Futures Steering Committee (stand up by Apr 1 2026; report by Jan 31 2027) for advanced AI, AGI-enabling trajectories, **agentic AI**, adversary use, and counter-AI options.
- Nearby: **§1512** AI/ML cybersecurity governance; **§1513** procurement hardening.

CRS IF13197 summarizes cyber + AI provisions. CRS IF13151 covers agentic AI / §1535.

### NSCAI Final Report (Mar 1 2021)

National Security Commission on Artificial Intelligence (Eric Schmidt, chair; Robert O. Work, vice chair). Landmark strategy still framing later NDAA AI titles: defense readiness, talent/infrastructure, U.S.–China competition, justified confidence in AI systems, democratic-values guardrails, White House coordination, allied partnerships.

---

## Intellectual property (100 → 300)

- Four regimes: **copyright** (expression), **patent** (functional invention), **trade secret** (secrecy measures), **trademark** (source identity).
- **Human authorship:** wholly machine-generated works cannot be registered (*Thaler v. Perlmutter*). Prompts alone are not enough authorship.
- **Training / fair use:** no categorical rule. Factor 4 (market effect) has been decisive. Snapshot: *Thomson Reuters v. Ross* rejected fair use; *Bartz* / *Kadrey* found training fair use but distinguished **pirated acquisition**. *Bartz* settled ~$1.5B (no precedent).
- **Model weights:** usually trade secret / contract, not clean copyright or patent fits.
- **Open weights ≠ open source** (OSAID 1.0). Llama/Gemma-style licenses often add MAU caps and AUP restrictions.

---

## Contracts

- Stack: **MSA** (rules) + **Order Form** (commercials) + **SOW/SLA** + **DPA**.
- **IP indemnity / copyright shield:** vendor defends third-party IP claims; watch carve-outs (filters on, no intentional infringement prompts, fine-tune/RAG exclusions).
- **Training-data-use clause:** customer-favorable baseline is no training on customer content; ZDR / short retention where available.
- **Output ownership:** contract allocation "as between the parties" ≠ copyrightability.
- **Liability cap + carve-outs:** typically fees-paid ceiling; carve IP indemnity, confidentiality, data breach, willful misconduct.
- **Model deprecation:** negotiate notice windows (≥90 days common walk-away for RAG re-embed).
- Standard riders: **Common Paper AI Addendum**, **Bonterms AI Addendum**.
- Cyber insurance often **excludes** probabilistic AI hallucination losses.

---

## State AI laws (binding ones to watch)

| Law | Status note |
|---|---|
| Colorado SB 24-205 | Enforcement stayed (2026); replacement SB 26-189 eff. Jan 1 2027 |
| Texas TRAIGA (HB 149) | Eff. Jan 1 2026; AG-only |
| California SB 53 / AB 2013 | Eff. Jan 1 2026 (frontier safety + training-data transparency) |
| California SB 942 | Operative Aug 2 2026 (transparency / provenance) |
| Illinois BIPA | Private right of action; biometric consent |
| NYC LL144 | AEDT bias audits + candidate notice |

---

## EU AI Act (architect angle)

- Risk tiers: **prohibited** (Art. 5) → **high-risk** (Art. 6 + Annex III) → **limited** (Art. 50 transparency) → minimal.
- Roles: **provider** vs **deployer** (architect deploying a vendor model is usually deployer).
- **GPAI** obligations live since Aug 2 2025; systemic-risk presumption ~10^25 FLOP.
- Art. 11 + Annex IV technical documentation; Art. 50 disclosures from Aug 2 2026.
- Digital Omnibus deferred standalone Annex III high-risk to **Dec 2 2027**.
- Extraterritorial: placing a model/system on the EU market, or output used in the EU.

---

## Privacy mini-module

- GDPR **Art. 22**: solely automated decisions with legal/significant effects; human intervention rights. Post-*SCHUFA*, credit scoring counts.
- EDPB Opinion 28/2024: personal data in AI models; unlawful training can taint deployment.
- CPPA **ADMT** rules: pre-use notice, opt-out, human appeal (ADMT duties from Jan 1 2027).

---

## Responsible AI frameworks

- **NIST AI RMF 1.0:** GOVERN → MAP → MEASURE → MANAGE (+ GenAI Profile).
- **ISO/IEC 42001:** certifiable AI management system.
- Engineering hooks: bias audits, red-teaming, HITL gates, explainability logs, model rollback.

---

## Sector rules (Week 6)

- Hiring: Title VII disparate impact / four-fifths rule; NYC LL144 audits; employer liable even for vendor tools.
- Credit: ECOA / Reg B adverse-action notices; CFPB Circular 2022-03 — black-box is not an excuse.
- Health: HHS Section 1557 (45 CFR 92.210) clinical decision-support nondiscrimination + HIPAA BAAs / no PHI training without authorization.

---

## Architect crosswalk cues (defense)

- §1532 → model lineage / vendor provenance tags (DIV-2 / Phase C–D).
- §1533 → eval harness + ethical-AI compliance gates (OV-6a / MEASURE).
- §1534 → sandbox-before-ATO path (SV-1 / Phase D).
- §1535 + NSCAI → advanced/agentic AI governance (AV-1 / GOVERN).
- §1512 → AI/ML cyber controls for poisoning, jailbreaks, unauthorized access.

---

## Hard rules for generated shorts

- Educational synthesis only. Never claim to be legal advice.
- Prefer primary instruments and dates over marketing slogans.
- Mark contested areas (fair use, state preemption theories, Colorado stay).
- Do not invent case holdings or statute section numbers not in this pack.
