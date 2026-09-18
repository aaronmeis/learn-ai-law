# Learn AI Law — EU AI products source pack (shorts)

**Purpose:** Compact source for NotebookLM vertical shorts on putting AI in products, using AI to create products, and EU vs US contrast. Study material only. Not legal advice.
**Audience:** Product and platform teams shipping into the EU (and dual-market US/EU launches).
**Currency:** Matches the Learn AI Law SPA `EU AI products` view refreshed 2026-09-18, including Digital Omnibus on AI (OJ L 2026/1744, in force 27 Jul 2026).

---

## Two different questions

1. **Does this product contain an AI system?** Classification under the AI Act (Regulation (EU) 2024/1689). Chatbots, recommenders, computer-vision modules, foundation-model API calls, on-device models, and safety components inside regulated hardware usually count.
2. **Did we use AI while building a non-AI product?** Mostly contracts, IP, ordinary product safety, and marketing claims. The finished good is not automatically an "AI system" unless the shipped product itself performs AI inference for the user.

---

## Decision sequence before you ship

1. Is there an AI system or GPAI model in scope? (Art. 3(1)–(2))
2. Where do outputs land? Act reaches systems placed on the EU market, put into service in the EU, or whose output is used in the EU (Art. 2). US SaaS serving EU users still counts.
3. Who are you? Provider, deployer, importer, or distributor (Arts. 3(3)–(7)). Rebranding or substantial modification can flip you into provider (Art. 25).
4. What risk tier? Prohibited (Art. 5), high-risk Annex I product-safety, high-risk Annex III use-case, limited-risk Art. 50, or minimal.
5. Which dates bind you? Art. 5 and GPAI rules already apply. Art. 50 largely from 2 Aug 2026. Annex III high-risk deferred to 2 Dec 2027. Annex I product-safety AI deferred to 2 Aug 2028.
6. What else stacks? Product Liability Directive 2024/2853, MDR/machinery/toys if Annex I, GDPR, sector rules, vendor contracts.

---

## Putting AI in a product

- **SaaS feature calling a foundation model:** You are usually the provider of the AI system you ship under your product name, and a customer/deployer of the GPAI model vendor. GPAI model duties (Arts. 51–55) stay with the model provider. Your system still needs its own risk classification, Art. 50 notices if users chat with it, and high-risk controls if Annex III applies (hiring, credit, biometrics).
- **On-device / embedded model in hardware:** Medical devices, machinery, toys, radio equipment, and other Annex I products that use AI as a safety component are high-risk under Art. 6(1). Conformity runs through the product-safety regime plus AI Act requirements. Digital Omnibus pushes those high-risk AI duties to 2 Aug 2028.
- **Internal-only tool never sold:** Putting into service (Art. 3(11)) still triggers the Act. An HR screening model used only inside an EU entity can be high-risk Annex III with no commercial listing.
- **Open-weight model you fine-tune and ship:** Fine-tuning plus placing under your trademark is provider conduct. Keep training-data summaries, eval evidence, and change logs for Art. 11 / Annex IV if high-risk.
- **Marketplace / app-store distribution:** Distributors and importers have gatekeeping duties (Arts. 23–24).

---

## Using AI to create a product

- **GenAI as an internal design assistant:** Using Copilot, Midjourney, or a CAD-copilot to draft specs, UI, or mechanical designs does not by itself make the finished non-AI toaster or website an AI system. You may still be a deployer of the design tool. Copyright, trade-secret leakage, and product-safety law still apply to finished goods.
- **AI-generated assets shipped to customers:** If the product delivers AI-generated text, images, audio, or video to end users, Art. 50 transparency and machine-readable marking duties apply from 2 Aug 2026 (with a short grace window for some marking of systems already on the market). Label deepfakes and synthetic media clearly.
- **AI that designs another AI system:** Agentic pipelines that assemble models, prompts, and tools can create a new AI system you then place on the market. Role analysis restarts for that output system.
- **Training or fine-tuning on customer content:** Training rights are a contract/IP problem first. If the resulting model is GPAI or the resulting system is high-risk, provider duties attach to whoever places it.
- **What does not flip you:** A bike frame optimized with an offline ML study, or marketing copy drafted with ChatGPT and then heavily edited by humans, is not automatically an AI product. The moment the shipped product itself performs AI inference for the user, you are back in the AI-in-product lane.

---

## Risk tiers for products (Omnibus dates)

| Tier | When | Action / date |
|---|---|---|
| Prohibited (Art. 5) | Social scoring, exploitative manipulation, untargeted facial-image scraping, certain real-time remote biometric ID (narrow LE exceptions), Omnibus nudifier-style bans | Do not place. Already enforceable. |
| High-risk Annex I | AI is the product or a safety component under listed EU product-safety laws | Full high-risk stack via product-safety pathway. Deferred to **2 Aug 2028**. |
| High-risk Annex III | Stand-alone systems: biometrics, critical infrastructure, education, employment, essential services (credit/insurance), law enforcement, migration, justice | Arts. 9–15, conformity, CE, registration. Deferred to **2 Dec 2027**. |
| Limited risk (Art. 50) | Chatbots, emotion recognition, biometric categorisation, synthetic/deepfake content | Disclose AI interaction; machine-readable synthetic marking. Mostly from **2 Aug 2026**. Not deferred with high-risk. |
| Minimal | Spam filters, inventory forecasting, many productivity copilots outside Annex III | Voluntary codes useful; PLD, consumer law, GDPR can still bite. |

---

## GPAI embeds

- GPAI model providers (Arts. 51–55): training-content summaries, copyright-reserve respect, technical documentation, AI Office cooperation.
- Systemic-risk GPAI (historically ~10^25 FLOPs, AI Office designation): eval, adversarial testing, incident reporting, cybersecurity.
- Embedding a third-party GPAI model does **not** automatically transfer Arts. 51–55 duties to you.
- You can still be provider of the branded downstream AI system you ship. Classify that system on intended purpose.

---

## Roles and Art. 25 flip

- **Provider (Art. 3(3)):** Develops (or has developed) and places under own name/trademark. Owns conformity, CE, Art. 11 docs, post-market monitoring for high-risk.
- **Deployer (Art. 3(4)):** Uses under its authority. High-risk: human oversight, input-data fitness, logs, notices (Art. 26).
- **Importer / distributor (Arts. 3(6)–(7), 23–24):** EU gatekeeping for non-EU providers and further supply-chain availability.
- **Art. 25 downstream provider flip:** Putting your brand on a high-risk system, substantially modifying it, or changing intended purpose makes you the provider. White-label resale and thin wrappers are the classic trap.

---

## Liability stack

- AI Act is ex ante (can you place it?). PLD 2024/2853 is ex post no-fault liability when defective software/AI causes damage. AI Act compliance helps evidence but does not immunize.
- PLD treats software and AI as products; SaaS can be in scope; defined non-commercial OSS carve-outs exist.
- Defectiveness considers presentation, foreseeable misuse, learning after deployment, cybersecurity, and updates.
- Evidence tilting: disclosure orders and presumptions where opacity blocks proof. Keep eval and change logs.
- Member States must transpose PLD by **9 Dec 2026**.

---

## EU vs US — same product, two legal machines

**US posture in one line:** No comprehensive civilian US AI Act. Product teams face FTC Act §5, state/local AI statutes, sector statutes (FDA, ECOA, Title VII), common-law product liability, and IP authorship rules (Thaler).

| Topic | EU | US |
|---|---|---|
| Core statute | AI Act risk tiers, roles, CE for high-risk | No federal US AI Act; EO 14179 + AI Action Plan set tone; older statutes applied to AI |
| AI in product / placing on market | Placing or putting into service triggers role duties; intended purpose drives Annex I vs III | No general pre-market AI conformity gate; sector gates only when already in that regime |
| AI to create a product | Internal GenAI rarely makes finished non-AI good an AI system; shipping synthetic media can trigger Art. 50 | Same practical split; FTC §5 on deceptive claims; copyright needs human authorship (Thaler v. Perlmutter); patents need human inventors (Thaler v. Vidal) |
| Transparency | Art. 50 from ~2 Aug 2026 | No single federal chatbot-label rule; CA SB 942; NYC LL144; ECOA adverse-action |
| High-risk decisions | Annex III + Annex I with Omnibus dates | Colorado high-risk (watch effective date / SB 26-189), NYC LL144, Title VII / ECOA / FCRA / §1557 |
| Roles | Statutory provider/deployer/importer/distributor; Art. 25 flip | Contracts allocate vendor vs customer; tort looks for manufacturer/seller |
| Ex ante vs ex post | Docs, conformity, CE, monitoring before/while selling | Ship under general product rules; defend later under negligence, strict liability, warranty |
| Product liability | PLD 2024/2853 software/AI as product; transpose by 9 Dec 2026 | State common law + UCC; software-as-product varies |
| Deceptive claims | Unfair commercial practices + AI Act transparency | FTC §5 / Operation AI Comply |
| GPAI inside product | Model provider keeps Arts. 51–55; you remain provider of branded system | Mostly contract + copyright litigation; no federal GPAI CE analogue |

### Contrast examples

- **Support chatbot in B2B SaaS:** EU limited-risk Art. 50 if ticket answers only; disclose AI. If it denies refunds or ranks workers, re-screen Annex III. US: no federal chatbot stamp; FTC §5 on marketing; hiring/lending pulls Title VII / ECOA / NYC LL144 / Colorado.
- **Resume-screening feature:** EU Annex III employment (duties deferred to 2 Dec 2027; design now). US: NYC LL144 if AEDT; Title VII nationwide; Colorado if in scope; no CE mark.
- **Vision model in industrial machinery:** EU Annex I safety-component pathway (deferred to 2 Aug 2028) on top of machinery CE. US: OSHA / product liability / machine standards; defect and warning theories after incidents.
- **GenAI only to draft packaging/CAD:** Finished kettle usually not an AI system in either region. Keep human authorship for copyright; do not claim "AI guarantees perfect safety."

### Architect takeaways

- EU asks "what tier and who is the provider?" before scale. US asks "which existing consumer, civil-rights, sector, or tort rule already covers this harm?"
- Art. 50 labeling can be required in the EU for a chat feature the US still treats as ordinary UX plus advertising law.
- Passing a US bias audit or FDA clearance does not finish EU Annex I/III work, and an EU CE file does not answer FTC claim substantiation.
- Using AI as a build tool is usually not placing an AI system on the market. Shipping inference to users is.
- Dual-market reviews keep two columns: EU role + tier + date, and US statute/state + claim theory + evidence.

---

## Hard rules for generated shorts

- Educational synthesis only. Never claim to be legal advice.
- Prefer primary instruments and dates over marketing slogans.
- Mark Omnibus deferrals clearly: Art. 50 still ~2 Aug 2026; Annex III → 2 Dec 2027; Annex I → 2 Aug 2028.
- Do not invent case holdings or statute section numbers not in this pack or the companion shorts source pack.
- Each short owns one job. Do not restate the full EU tier pyramid already covered in earlier shorts 15–17 unless the contrast requires one sentence.
