# Intellectual Property & AI — Revision Deck

Pillar 2 of the AI Law Deep Dive (30% weight). Current to 2026-09-02. Study material,
not legal advice.

---

## The four regimes at a glance

- **Copyright** — original works of authorship fixed in a medium; automatic on fixation; exclusive rights to reproduce, adapt, distribute, perform, display; requires a human author; ideas and facts excluded.
- **Patent** — novel, non-obvious, eligible inventions; 20-year right to exclude; requires application and examination; a natural person must be the inventor.
- **Trade secret** — information with economic value from not being known, subject to reasonable secrecy; protected under the federal DTSA and state UTSA; lost if disclosed.
- **Trademark** — words/logos that identify source; the right is against consumer confusion.

---

## Which regime protects what in an AI system

- **Training data** — third-party copyright; your license to acquire and retain.
- **Model weights** — not clearly copyrightable (no human author of the numbers), poor fit for patents → **trade secret** or license.
- **Training pipeline, system prompts, eval sets** — trade secret.
- **Fine-tuned models / adapters** — trade secret + contract.
- **Outputs** — copyright only with human authorship; ownership otherwise allocated by contract.
- **Product name** — trademark.

---

## Copyright: the training-data fair-use question

- In plain terms: is copying copyrighted works into a training corpus excused as fair use under 17 U.S.C. §107, or is it infringement?
- The four factors: (1) purpose and character, incl. commerciality and transformativeness; (2) nature of the work; (3) amount used; (4) effect on the market for or value of the work.
- As of 2026: no federal appellate ruling. District courts split. Factor 4 has been decisive.
- *Warhol v. Goldsmith* (2023) narrowed "transformative" — commercial purpose counts and the new purpose must be genuinely distinct.

---

## The three 2025 training rulings

- **Thomson Reuters v. Ross** (D. Del., Bibas J., Feb 2025) — non-generative legal-research tool built on copied Westlaw headnotes; fair use **rejected on all four factors**; factor 4 (incl. the market to license data for AI training) decisive. On appeal to the 3rd Cir. (argued Jun 2026).
- **Bartz v. Anthropic** (N.D. Cal., Alsup J., Jun 2025) — training on lawfully acquired books "spectacularly transformative" and fair use; **but** downloading and keeping ~7M pirated books was separately infringing. ~$1.5B class settlement, final approval Jul 2026 — no precedent.
- **Kadrey v. Meta** (N.D. Cal., Chhabria J., Jun 2025) — training "highly transformative"; expressly "not a ruling that AI training is lawful"; plaintiffs lost on an undeveloped **market-dilution** record.

---

## Copyright: acquisition vs use

- Bartz's key distinction: whether *training* on a work is fair use is separate from whether *how you got the copies* was lawful.
- Buying and digitizing books → fair use. Downloading and retaining pirated copies from shadow libraries → separately infringing, regardless of the training question.
- Practical takeaway: provenance of the corpus is its own risk, addressed by contract reps and by not retaining what you don't need.

---

## Copyright: US vs EU on training

- **US** — no statutory text-and-data-mining exception; relies entirely on fair use.
- **EU** — statutory TDM exceptions (DSM Directive 2019/790 Arts. 3–4); Art. 4 lets rightsholders **opt out** in machine-readable form, which removes the exception for commercial training.
- The EU AI Act requires GPAI providers to honor those opt-outs, **including for training done outside the EU**.

---

## Copyright: authorship of AI outputs

- **Human-authorship requirement** — US copyright protects only works with a human author. *Thaler v. Perlmutter* (D.C. Cir. 2025, cert. denied Mar 2026): a wholly machine-generated work cannot be registered.
- **Prompts alone are not authorship** — Copyright Office Part 2 report (Jan 2025); a detailed text prompt does not supply the required control over the expressive result.
- **What can be protected** — the human's creative edits, original elements, and the selection / coordination / arrangement (*Zarya of the Dawn*; *Théâtre D'opéra Spatial*).
- **Registration** — must disclaim more-than-de-minimis AI-generated content in the deposit; the resulting registration is thin.

---

## Copyright: output-side infringement

- **Substantial similarity** — where there is no admitted copying, is the output similar enough in protected expression that an ordinary observer would recognize copying? *Authors Guild v. OpenAI* let output-similarity claims survive on this basis.
- **Regurgitation / memorization** — verbatim or near-verbatim reproduction of training text is a distinct risk from the training question.
- **DMCA §1202 (CMI)** — removing copyright-management information; several AI cases dismissed these claims; *Doe v. GitHub* adopted an identicality requirement.

---

## Patents: inventorship

- *Thaler v. Vidal* (Fed. Cir. 2022, cert. denied 2023) — "inventor" means a natural person; **DABUS** applications fail.
- **USPTO Revised Inventorship Guidance for AI-Assisted Inventions** (28 Nov 2025) — rescinds the Feb 2024 guidance; **drops the Pannu "significant contribution" test as applied to AI**; treats AI "analogous to any other tool"; a natural person must still be named and have significantly contributed.
- Getting inventorship wrong can invalidate a patent.

---

## Patents: subject-matter eligibility

- 35 U.S.C. §101 + the *Alice/Mayo* two-step: claims directed to an abstract idea without an inventive concept are ineligible.
- *Recentive Analytics v. Fox* (Fed. Cir. 2025) — applying generic machine learning to a new data field is **ineligible**.
- 2024 USPTO §101 guidance + Examples 47–49 show how the office applies this to AI claims.

---

## Trade secret

- The practical primary mode for weights, pipelines, prompts, and eval sets — protected only while **reasonable secrecy measures** hold.
- **DTSA** (18 U.S.C. §1836) — federal private civil cause of action alongside state UTSA; injunctions, damages, exemplary damages and fees for willful acts.
- **Misappropriation** — acquiring by improper means, or use/disclosure in breach of a duty of confidence.
- Feeding secret material into a consumer-tier AI tool can both **destroy** the secret and be actionable.
- *US v. Linwei Ding* (N.D. Cal., verdict Jan 2026) — criminal AI trade-secret prosecution.

---

## Licensing: open weights vs open source

- **Open weights** — parameters downloadable, often under a custom license with use restrictions, MAU caps, and withheld training-data information.
- **Open source (OSI OSAID 1.0, 28 Oct 2024)** — additionally requires the four freedoms for any purpose, plus code and sufficient "data information" to recreate a substantially equivalent system.
- **Llama-style community licenses** — MAU cap (e.g. 700M) above which a separate license is needed; ban on training competing LLMs; "Built with …" attribution; binding AUP. These break "any purpose," so: open weights, not open source. The "openwashing" critique.
- **Behavioral-use / RAIL clauses** — permit broad use but prohibit enumerated harmful uses; enforceability against downstream users of a downloadable model is unresolved.

---

## IP strategy across the AI supply chain

- **Data** — acquisition and retention rights; TDM opt-outs; provenance reps.
- **Training** — fair use unsettled; contract for provenance and cooperation.
- **Weights** — trade secret; license terms if open-weight; flow-down.
- **Prompts / RAG** — your inputs; usually carved out of vendor indemnities.
- **Outputs** — ownership allocation vs copyrightability; substantial-similarity / regurgitation risk.
- **Deployment** — attribution obligations; EU GPAI opt-out honoring.
- Layered strategy (Mayer Brown, Dec 2025): trade secret + contract + selective patenting.

---

## Scholarship to know (300-level)

- Lemley & Casey, *Fair Learning* (2021) — the pro-training-as-fair-use framing.
- Sag, *Copyright Safety for Generative AI* (2023) — the "snippet" / non-expressive-use argument.
- Lee, Cooper & Grimmelmann, *Talkin' 'Bout AI Generation* — the generative-AI supply chain as an analytic frame.
- Henderson et al., *Foundation Models and Fair Use* (2023).
- Samuelson — market-dilution critique and *How to Think About Remedies in the Generative AI Copyright Cases*.

---

## Open questions to take to counsel

- Is training on our corpus fair use — and does the answer change with how the corpus was acquired?
- Do our outputs carry substantial-similarity risk for any identifiable source works?
- If we use an open-weight model: do the license's use restrictions and attribution duties flow down to our customers?
- Are we relying on trade secret for anything we've exposed to a third-party tool?
