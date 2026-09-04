# AI Regulation & Litigation — Revision Deck

Pillar 3 of the AI Law Deep Dive (30% weight). US federal + states + EU AI Act + privacy +
sector rules + the cases. Current to 2026-09-02. Verify any date before relying on it.

---

## Sources of law, ordered by force

- **Statute** — bicameralism + presentment; hardest to change. No comprehensive US federal AI statute exists.
- **Legislative rule** — agency, notice-and-comment under the APA (5 U.S.C. §553); force of law.
- **Executive order** — binds the executive branch only; revocable by the next President.
- **Sub-regulatory guidance** — advisories, FAQs, technical assistance; persuasive, withdrawable at will.
- **Common law** — judge-made; where AI liability theories live.
- *Loper Bright v. Raimondo* (2024) overruled *Chevron*: courts now decide statutory meaning independently, making aggressive agency AI rules easier to challenge.

---

## US federal posture in 2026

- No omnibus AI statute; policy set by executive order + an action plan; harms pursued under generally applicable laws.
- EO 14110 (2023) **rescinded** 20 Jan 2025 by EO 14148.
- **EO 14179** ("Removing Barriers to American Leadership in AI," 23 Jan 2025) + **"Winning the Race: America's AI Action Plan"** (23 Jul 2025) — deregulatory; directs NIST to revise the AI RMF and the FTC to review burdensome AI consent orders.
- **EO 14319** ("Preventing Woke AI in the Federal Government," Jul 2025).
- **EO 14365** (state-preemption strategy, 11 Dec 2025) — DOJ litigation task force + funding conditions; named the Colorado AI Act.

---

## US federal: agency instruments and enforcement

- **OMB M-25-21** (federal AI use) and **M-25-22** (federal AI acquisition), both 3 Apr 2025, replaced the Biden-era M-24-10 / M-24-18; M-25-22 procurement terms bite on solicitations issued on/after 30 Sep 2025.
- **NIST AI RMF 1.0** + GenAI Profile (NIST AI 600-1) — voluntary; widely referenced by regulators and contracts.
- **FTC Act §5** — the core federal hook. Deception = a material claim likely to mislead a reasonable consumer (overstated AI capabilities). Unfairness = substantial, unavoidable consumer injury not outweighed by benefits.
- **Operation AI Comply** (Sep 2024); the **Rytr** final order was **set aside** in Jan 2026 pursuant to the AI Action Plan; the **Rite Aid** facial-recognition order stands.

---

## US states: the binding ones and their dates

- **Colorado AI Act (SB 24-205)** — reasonable-care duty against algorithmic discrimination in consequential decisions; impact assessments; consumer notices. Enforcement **STAYED** (Apr 2026, after a DOJ challenge under EO 14365). Replacement **SB 26-189** effective **1 Jan 2027**.
- **Texas HB 149 (TRAIGA)** — effective **1 Jan 2026**; AG-only enforcement.
- **California**: SB 53 (frontier-developer safety framework, incident reporting) and AB 2013 (training-data transparency summary) — both **1 Jan 2026**. SB 942 (AI Transparency Act, as amended by AB 853) — operative **2 Aug 2026**.
- **Illinois BIPA (740 ILCS 14)** — in force; **private right of action** with liquidated statutory damages; amended by SB 2979 (2024).
- **NYC Local Law 144** — automated employment decision tools: annual independent bias audit, public posting, 10 business days' candidate notice.

---

## The state-preemption fight

- EO 14365's theories: conditional federal spending, Commerce Clause, First Amendment compelled-speech. Commentators view each as contestable — **an executive order cannot itself preempt state law**.
- A summer-2025 congressional moratorium failed; a March 2026 White House framework asks Congress to preempt outright.
- Practical posture: treat "the Colorado AI Act" and other state AI laws as **in flux** — verify the operative text and date before relying on either the law or its suspension.

---

## EU AI Act: the structure

- **Regulation (EU) 2024/1689.** Risk tiers:
  - **Prohibited** (Art. 5, in force 2 Feb 2025) — manipulative subliminal techniques, exploitation of vulnerabilities, social scoring, most real-time public biometric ID, untargeted facial scraping, workplace/school emotion recognition.
  - **High-risk** (Art. 6 + Annexes I, III) — full compliance load.
  - **Limited-risk** (Art. 50) — transparency only.
  - **Minimal** — unregulated.

---

## EU AI Act: high-risk and the Digital Omnibus

- **Annex III** use cases presumptively high-risk: biometrics, critical infrastructure, education, employment/worker management, essential public and private services, law enforcement, migration/border, administration of justice. Classification is **rebuttable** under Art. 6.
- **Provider** obligations (Arts. 8–15): risk management, data governance, **Art. 11 + Annex IV technical documentation**, logging, transparency, human oversight, accuracy/robustness, conformity assessment, CE marking.
- **Deployer** obligations (Art. 26): human oversight, input-data control, monitoring, worker notice; **Art. 27 FRIA** for public bodies and essential-service providers.
- **Digital Omnibus (Regulation (EU) 2026/1744, in force 27 Jul 2026)** deferred standalone Annex III high-risk obligations to **2 Dec 2027** (embedded / Annex I to 2 Aug 2028).

---

## EU AI Act: GPAI and transparency

- **GPAI** (Arts. 51–56), obligations live since **2 Aug 2025**: technical documentation, training-data summary, a copyright policy addressing the TDM opt-out.
- **Systemic-risk GPAI** — presumed above **10^25 FLOP** training compute; adds model evaluations, adversarial testing, systemic-risk assessment, cybersecurity, serious-incident reporting to the AI Office.
- **GPAI Code of Practice** (final 10 Jul 2025) — the de facto compliance route pending harmonized standards.
- **Art. 50** transparency — tell people they're interacting with AI; mark AI-generated/manipulated media; machine-readable markings — applies **2 Aug 2026**.
- **Extraterritorial (Art. 2)** — placing a system/model on the EU market, or output used in the EU, regardless of establishment.

---

## Privacy mini-module

- **GDPR Art. 22** — right not to be subject to a solely-automated decision with legal or similarly significant effects, unless contract / law / explicit consent, and then with safeguards (human intervention, right to contest, meaningful information about the logic).
- ***SCHUFA*** (CJEU C-634/21, Dec 2023) — generating a probability score a lender relies on **is itself** an Art. 22 decision, not a preparatory step. Expanded Art. 22's reach across scoring and decision-support.
- **EDPB Opinion 28/2024** — personal data in AI models; unlawful processing during development can taint deployment; document the legitimate-interest balancing test.
- **CPPA regulations** (eff. 1 Jan 2026) — ADMT, risk assessments, cybersecurity audits; **ADMT-specific duties** (pre-use notice, opt-out, appeal to a human) from **1 Jan 2027**.

---

## Sector rules

- **Credit** — ECOA / Regulation B adverse-action notices: specific, accurate principal reasons. **CFPB Circular 2022-03** — a creditor cannot rely on a black-box model it cannot explain.
- **Hiring** — Title VII disparate impact (four-fifths rule); the employer is liable even for a vendor's tool. EEOC May 2023 technical assistance is delisted but remains the analytical baseline. NYC LL144 stacks on top.
- **Health** — HHS/OCR **Section 1557** "Patient Care Decision Support Tools" rule (**45 CFR 92.210**): covered programs must make reasonable efforts to identify and mitigate discrimination from decision-support tools relying on protected characteristics. HIPAA governs the data side (BAAs with model vendors, minimum necessary, no training on PHI without authorization).

---

## Litigation tracker — what to watch

- **Thomson Reuters v. Ross** — 3rd Cir. appeal (argued Jun 2026); first US merits rejection of an AI fair-use defense.
- **Bartz v. Anthropic** — settled ~$1.5B (final approval Jul 2026); the pirated-acquisition point survives as reasoning, not precedent.
- **Kadrey v. Meta** — market-dilution theory left open for a better-developed record.
- **SDNY OpenAI MDL** (incl. *Authors Guild v. OpenAI*, *NYT v. OpenAI*) — cross-MSJ; output-similarity and regurgitation claims.
- **FTC** — Rytr set aside; Rite Aid stands; the AI-companion-chatbot 6(b) inquiry (Sep 2025).

---

## The "what binds our product and when" table (method)

- List every regime that could apply: EU AI Act (which tier / role), GPAI, state laws (CO / TX / CA / IL / NYC), federal sector rules, GDPR, CPPA.
- For each: trigger (what makes it apply to us), status (in force / stayed / deferred), and date.
- Flag the ones in flux and the ones with a private right of action.
- Re-run the table every quarter — the dates move.

---

## Open questions for counsel

- Which EU AI Act role are we in for each deployment — provider, deployer, or downstream modifier — and does that change with fine-tuning?
- Do any stayed state laws create residual exposure if the stay lifts?
- For regulated-sector customers (banks, hospitals), which overlay rules attach to *our* product vs *their* use?
- Is our "error-free" / capability marketing a §5 deception risk?
