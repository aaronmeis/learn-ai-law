# AI Law in 20 Slides

A synthesis deck for the AI Law Deep Dive. Near-practitioner fluency across contracts, IP,
and regulation — for the technical-legal liaison, not for practicing law. Current to
2026-09-02.

---

## Why this exists

- An AI architect sits between the build and the legal team. The gap is vocabulary and issue-spotting, not bar admission.
- Goal: read a commercial AI vendor agreement and know what to push on; look at a deployment and name the IP, liability, and regulatory exposure; brief counsel with facts, not conclusions.
- Three pillars, weighted: Contracts 40%, Intellectual Property 30%, Regulatory & litigation 30%.
- Everything is conceptual and public-source only. No confidential text, ever, in any tool.

---

## The sources-of-law map

- **Statute** — enacted by a legislature. Highest binding force. No comprehensive US federal AI statute exists; enforcement runs through general laws (FTC Act §5, ECOA, FCRA, Title VII).
- **Regulation / legislative rule** — agency, notice-and-comment, force of law once final.
- **Executive order** — binds the executive branch only; the next President can rescind it (EO 14110 → rescinded 2025).
- **Agency guidance** — persuasive, not binding; can be withdrawn at will (several EEOC AI documents delisted in 2025).
- **Common law** — judge-made; the AI liability theories (negligence, failure to warn, product liability) live here.
- After *Loper Bright* (2024) courts no longer defer to agencies on ambiguous statutes.

---

## Pillar 1 — Contracts: the deal structure

- Commercial AI deals come as a **stack**: MSA (durable legal terms) + order form (commercials) + SOW + SLA + DPA + AI addendum.
- The MSA holds what survives every purchase: IP ownership, limitation of liability, warranties, indemnification, term/termination.
- The order form holds price and quantity. Don't negotiate legal terms there.
- Open standard riders exist: Common Paper Standard AI Addendum v1.0, Bonterms Standard AI Addendum v2.0, SCL AI clauses (paired pro-supplier / pro-customer).

---

## Contracts: the clauses that matter for AI

- **Training-data-use** — may the vendor train on your inputs/outputs? Customer baseline: no training by default, short retention, zero-retention option. Watch "develop and improve" language.
- **Output IP ownership** — enterprise terms assign output to the customer *as between the parties*; that is not proof the output is copyrightable.
- **IP indemnity / "copyright shield"** — vendor defends you against third-party IP claims on the service and (newer) on generated output. Conditioned on AUP compliance and keeping filters on; carves out your fine-tunes, prompts, and RAG data; often copyright-only, not patents.
- **Limitation of liability** — the cap (often 12 months' fees). Push IP indemnity, confidentiality, and data-breach into carve-outs above the cap.
- **Warranty disclaimers** — "AS IS" must be conspicuous and specific to survive UCC §2-316.
- **Model deprecation** — notice and migration window when the model version changes. Poorly addressed in standard terms.

---

## Contracts: how to think about a negotiation

- Every clause has a customer ask, a vendor ask, and a realistic fallback.
- Example — no-training: ask = no training across all tiers with "Training" defined separately from service improvement; fallback = contractual opt-out plus zero retention.
- Example — indemnity: ask = uncapped IP indemnity with a duty to defend, covering training-data *and* output claims; fallback = carve the IP indemnity out of the general cap.
- Insurance context: commercial policies increasingly exclude AI harms, so the contract *is* the risk-transfer mechanism. That is why vendors fight for low caps.

---

## Pillar 2 — Intellectual Property: four regimes

- **Copyright** — original works of authorship; automatic on fixation; requires a human author.
- **Patent** — novel, non-obvious, eligible inventions; 20 years; a natural person must be the inventor.
- **Trade secret** — economically valuable, kept secret; the practical primary mode for model weights, pipelines, and system prompts (DTSA + state UTSA).
- **Trademark** — source identifiers; prevents consumer confusion.

---

## IP: training data and fair use

- The core question: is copying copyrighted works to train a model a fair use under 17 U.S.C. §107, or infringement? No federal appellate ruling as of 2026.
- **Thomson Reuters v. Ross** (D. Del. 2025) — fair use rejected on all four factors; factor 4 (market harm, incl. the market to license training data) decisive.
- **Bartz v. Anthropic** (N.D. Cal. 2025) — training on lawfully acquired books "spectacularly transformative"; but downloading and keeping pirated copies was separately infringing. Settled ~$1.5B (final approval Jul 2026, no precedent).
- **Kadrey v. Meta** (N.D. Cal. 2025) — training "highly transformative" but expressly "not a ruling that AI training is lawful"; plaintiffs lost on an undeveloped market-dilution record.
- EU has a statutory TDM exception (DSM Arts. 3–4) with a machine-readable opt-out; the US has none and relies on fair use.

---

## IP: authorship and ownership of outputs

- **Human-authorship requirement** — purely machine-generated output cannot be registered (*Thaler v. Perlmutter*, D.C. Cir. 2025, cert. denied 2026).
- Prompts alone are not enough authorship (Copyright Office Part 2 report, Jan 2025).
- Human contribution can protect the human parts: creative edits, original elements, and selection/arrangement (*Zarya of the Dawn*).
- Registration requires disclaiming more-than-de-minimis AI-generated content.

---

## IP: patents and inventorship

- *Thaler v. Vidal* (Fed. Cir. 2022) — an inventor must be a natural person; DABUS applications fail.
- **USPTO Revised Inventorship Guidance for AI-Assisted Inventions** (28 Nov 2025) — rescinds the Feb 2024 guidance, drops the Pannu-factor analysis for AI, treats AI "analogous to any other tool." A natural person must still be named and have significantly contributed.
- §101 eligibility: applying generic ML to a new data field is ineligible (*Recentive Analytics v. Fox*, Fed. Cir. 2025).

---

## IP: trade secret and licensing

- Weights, training pipelines, prompts, eval sets → trade secret, protected only while reasonable secrecy measures hold. Feeding secret material into a consumer AI tool can destroy the secret.
- *US v. Linwei Ding* — criminal AI trade-secret prosecution; the regime in active use.
- **Open weights ≠ open source.** Llama-style "community licenses" add MAU caps, bans on training competing models, and binding AUPs. Under the OSI Open Source AI Definition 1.0 those are "open weights," not open source.

---

## Pillar 3 — US regulation: the federal posture

- EO 14110 (2023) rescinded 20 Jan 2025 → **EO 14179** + **"Winning the Race: America's AI Action Plan"** (Jul 2025), deregulatory.
- EO 14319 ("Preventing Woke AI in the Federal Government"); EO 14365 (state-preemption strategy, Dec 2025) — legally contestable; an EO cannot itself preempt state law.
- OMB M-25-21 (federal AI use) and M-25-22 (federal AI acquisition) replaced the Biden-era memos.
- FTC Act §5 (deceptive AI claims, unfair deployments) is the main federal enforcement hook — Operation AI Comply (2024); the Rytr order was set aside in Jan 2026.

---

## US regulation: the states

- **Colorado AI Act (SB 24-205)** — duty of reasonable care against algorithmic discrimination in consequential decisions. Enforcement judicially **stayed** (Apr 2026, DOJ challenge); replacement **SB 26-189** effective 1 Jan 2027.
- **Texas HB 149 (TRAIGA)** — effective 1 Jan 2026, AG-only enforcement.
- **California** — SB 53 (frontier developer duties) and AB 2013 (training-data transparency) both effective 1 Jan 2026; SB 942 (AI Transparency Act) operative 2 Aug 2026.
- **Illinois BIPA** — still in force; private right of action with statutory damages; amended by SB 2979 (2024).
- **NYC Local Law 144** — automated employment decision tools need an annual bias audit, public posting, and candidate notice.

---

## Pillar 3 — the EU AI Act (architect angle)

- **Risk tiers**: prohibited (Art. 5) / high-risk (Art. 6 + Annexes I, III) / limited-risk transparency (Art. 50) / minimal.
- **GPAI** obligations (Arts. 51–56) live since 2 Aug 2025: technical documentation, training-data summary, copyright policy; systemic-risk models (presumed above 10^25 FLOP) add evaluations, incident reporting, cybersecurity.
- **Art. 50** transparency (tell people they're talking to AI; mark synthetic media) applies from 2 Aug 2026.
- **High-risk** obligations deferred to **2 Dec 2027** for standalone Annex III systems via the Digital Omnibus (Regulation (EU) 2026/1744).
- **Extraterritorial**: applies if you place a system/model on the EU market or the output is used in the EU — no EU entity required.

---

## Privacy, sector rules, and litigation

- **GDPR Art. 22** — right against solely-automated significant decisions; post-*SCHUFA* (CJEU C-634/21) automated credit scoring counts.
- **CPPA ADMT regulations** — pre-use notice, opt-out, appeal to a human; ADMT-specific duties from 1 Jan 2027.
- **Sector overlays**: ECOA/Reg B adverse-action explainability (CFPB Circular 2022-03); HHS §1557 patient-care decision-support rule (45 CFR 92.210); Title VII disparate impact for hiring tools.
- **Litigation to watch**: *Ross* on appeal (3rd Cir.); the SDNY OpenAI MDL; *Thomson Reuters*, *Kadrey*, *Bartz*.

---

## The IP decision points across an AI supply chain

- **Data** — rights to acquire and retain training copies; TDM opt-outs.
- **Training** — fair use (unsettled); provenance reps in vendor contracts.
- **Weights** — trade secret; license terms if open-weight.
- **Prompts / RAG** — your inputs; usually carved out of vendor indemnities.
- **Outputs** — ownership allocation vs copyrightability; regurgitation / substantial-similarity risk.
- **Deployment** — EU AI Act role (provider vs deployer), sector rules, disclosure duties.

---

## How to run an issue-spot

1. State the deployment in facts, not conclusions.
2. Walk the supply chain: data → training → weights → prompts → outputs → deployment.
3. For each issue name the governing authority and a severity: blocker / material / monitor.
4. Separate settled law from genuinely unsettled questions.
5. Turn the unsettled ones into questions for counsel — phrased as questions, with facts attached.
6. Be explicit about the limits of your analysis: what is a legal call you should not make.

---

## What to keep current

- One hour a week: Akin Gump AI tracker, the litigation tracker, EU AI Act timeline, one newsletter.
- The fast-moving edges: training fair use, whether stayed state laws revive, EU AI Act dates, USPTO/Copyright Office guidance revisions.
- This deck is a snapshot dated 2026-09-02. Re-verify any date or holding before you rely on it with counsel.
