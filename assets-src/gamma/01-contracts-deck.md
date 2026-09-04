# Commercial AI Contracts — Revision Deck

Pillar 1 of the AI Law Deep Dive (40% weight). Conceptual: contract anatomy, clause
taxonomy, and negotiation-position analysis on public exemplars only. No real agreements.
Current to 2026-09-02.

---

## The contract stack

- **MSA (Master Services Agreement)** — the durable umbrella: IP, liability, confidentiality, warranties, indemnity, term/termination, governing law. Survives every order.
- **Order form** — the transactional layer: services, quantities, fees, dates. Incorporates the MSA.
- **SOW** — scope of a specific engagement. **SLA** — uptime/performance commitment with service-credit remedy. **DPA** — data-protection terms (GDPR Art. 28). **AI addendum** — AI-specific terms bolted on.
- Rule of thumb: legal terms live in the MSA; do not let them drift into documentation the vendor can change unilaterally.

---

## Where the standard terms come from

- **Common Paper Standard AI Addendum v1.0** (16 Jul 2025) — defines Input, Output, Training, Training Data; assigns Output to the customer; rights-in-Input warranty.
- **Bonterms Standard AI Addendum v2.0** (~May 2026) — also addresses upstream model-provider obligations.
- **SCL AI Group Contractual Clauses** (Oct 2023, upd. Mar 2025) — paired pro-supplier / pro-customer versions of each clause with drafting notes; a separate Oct 2024 set covers EU AI Act obligations.
- **oneNDA / oneDPA** — standard-template ecosystem.
- Public provider terms to read clause-by-clause: Anthropic Commercial ToS, OpenAI Business Terms + DPA, Google Cloud Generative AI Indemnified Services, Azure OpenAI data/privacy terms, AWS Bedrock + Service Terms §50.

---

## Clause map — the AI-relevant ones

- Training-data use · Output IP ownership · IP indemnity ("copyright shield") · Limitation of liability + carve-outs · Warranties and disclaimers · Acceptable-use policy · Model deprecation / change management · Data processing (DPA) · Sub-processors and flow-down · Rate limits · Audit rights · Termination.

---

## Training-data-use clause

- The question: may the vendor use your inputs, outputs, and usage data to train or improve its models?
- Customer-favorable baseline: no training on customer content by default; short retention; a zero-retention option.
- Watch broad language — "develop and improve its services" is wide enough to include model training.
- The fix: an explicit no-training term with **"Training" defined separately** from "service improvement" (Common Paper / Bonterms).
- Fallback ladder (Venable, Jun 2026): opt-in → opt-out → "to provide the service only" → zero retention, plus anonymization standards and a right to revoke.
- "Customer Data" vs "Usage Data" is where this fight happens — telemetry and "aggregated / de-identified" signals are usually claimed by the vendor.

---

## Output IP ownership

- Enterprise terms from the major providers assign output to the customer **as between the parties**.
- That is a contract allocation, not proof the output is copyrightable, and identical output could go to another customer.
- Silence is a gap: without an assignment the customer may lack clear title. Fix with an AI addendum assigning "Output."
- Fine-tune ownership is separate: who owns the fine-tuned model, the adapter weights, and the training set you supplied — and may the vendor reuse them?

---

## IP indemnity / "copyright shield"

- The vendor's promise to **defend** and cover the customer against third-party IP claims from the service and, in newer terms, from AI-generated output.
- Reference structure: Google Cloud splits it into a **training-data indemnity** and a **generated-output indemnity**, with exclusions.
- Typical **conditions**: use in line with the AUP; do not disable safety/filtering; no knowing infringement; use a current model version.
- Typical **carve-outs**: claims from your fine-tuning data, prompts, or RAG content; often patents (coverage limited to copyright).
- Customer asks: uncapped or super-capped; duty to defend from filing; both training-data and output claims; carve the IP indemnity out of the general liability cap.

---

## Limitation of liability

- The most negotiated clause. Two moves: exclude categories of damages (consequential, lost profits) and set a dollar ceiling (often 12 months' fees, 1×).
- **Carve-outs** pull categories above the cap: IP indemnity, confidentiality breach, data-protection breach, gross negligence / willful misconduct.
- Why vendors push caps low: commercial general-liability and tech E&O policies increasingly **exclude AI-related harms**, so the negotiated cap is the de facto risk allocation (Honigman, 2025).

---

## Warranties and disclaimers for AI output

- Meaningful AI warranties are narrow and heavily qualified (e.g. "will materially conform to the documentation").
- Vendors disclaim implied warranties of merchantability and fitness and disavow accuracy / non-infringement / reliability of output.
- Enforceability test (Bosin, 2026; UCC §2-316): the disclaimer must **mention "merchantability," be conspicuous, be specific** to how the AI actually fails, and be consistent with marketing.
- A dense all-caps block buried in section 19 risks being found non-conspicuous. "Error-free" marketing undercuts the disclaimer.

---

## Acceptable-use policy (AUP)

- The incorporated rules on what you may not do (illegal use, high-risk uses, abuse, circumventing safety).
- It is a binding contract term: breach can trigger suspension **and void your indemnity coverage**.
- Risk: an AUP the vendor "may update at any time." Customer asks: notice and consent on material changes; notice-and-cure before suspension for non-egregious breaches; no retroactive application.

---

## Data processing agreement (DPA)

- Exists principally to satisfy **GDPR Art. 28**: processing only on documented instructions, confidentiality, security, sub-processor controls, deletion or return of data, audit rights. US state privacy laws impose analogous processor terms.
- Sub-processors: require a list, advance notice of changes, an objection right, and flow-down of equivalent obligations.
- Controller vs processor: the customer is usually controller, the vendor processor — but training on customer data can make the vendor a **controller**, changing who owes which duties.

---

## Model deprecation / change management

- The vendor's right to retire, version, or materially change the underlying model — and what notice, migration window, and version-pinning the customer gets.
- Poorly addressed in most standard terms; a real operational risk for a product built on a specific model's behavior.
- Customer asks: 6–12 month notice, version pinning, migration support; fallback: 90 days plus a parallel-run period.

---

## Flow-down and the embedded-model problem

- If you embed a third-party foundation model in a product you resell, you **cannot grant downstream customers more than your upstream license allows**.
- The upstream AUP and any no-compete-training restriction must flow down, or you breach upstream.
- The indemnity delta: you may promise customers a broad IP indemnity while holding only a narrow (copyright-only, input-carve-out) one from the model provider — you absorb the gap.
- "Unlimited" data-use promises can conflict with upstream restrictions and with your customers' own DPA / GDPR constraints.

---

## Contracting around regulatory uncertainty

- Negotiate for vendor **reps and warranties** on regulatory status: EU AI Act classification, training-data provenance.
- Cooperation and documentation duties: supply EU AI Act Art. 11 technical documentation; cooperate as obligations phase in.
- Allocate the cost of compliance changes as new rules take effect.

---

## Negotiation positions — worked example

- Scenario (fictional): vendor MSA offers mutual IP indemnity capped at fees paid; no-training only on "Enterprise tier"; 30-day model-deprecation notice; AUP enforced by immediate suspension.
- **Indemnity** — ask: uncapped, duty to defend, training-data + output; fallback: carve out of the general cap.
- **No-training** — ask: all tiers, "Training" defined; fallback: opt-out + zero retention.
- **Deprecation** — ask: 6–12 months, pinning, migration support; fallback: 90 days + parallel run.
- **AUP** — ask: notice-and-cure, material-change notice, no retroactivity; fallback: cure period for non-egregious breaches.

---

## Checklist to carry into any AI vendor review

- Is there an AI addendum? A DPA? Is "Training" defined separately from "service improvement"?
- Who owns outputs? Fine-tunes? Is the IP indemnity two-part, and is it above the cap?
- What conditions and carve-outs gut the indemnity?
- Is the warranty disclaimer conspicuous and specific — and does the marketing contradict it?
- Can the AUP change unilaterally? Is there notice before suspension?
- What happens when the model version changes?
- If we embed and resell: does everything flow down, and where is the indemnity delta?
