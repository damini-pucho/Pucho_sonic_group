# Step 0 — Intake · Sonic Group Expense & Income OS

Source: `MoM Sonic Group Expense & Income Automation- 06-10-2026.pdf` (meeting 06 Oct 2026; Mugdha Borate — Sonic Group;
Jainam, Damini — Pucho). Read in full, including the translated transcript (pages 6–8).

## Answers (AskUserQuestion, 08 Oct 2026, Damini)

| # | question | answer |
|---|---|---|
| Stage | How far should this go now? | **Clickable demo** on sample data (the UI/UX demo promised within 3–4 working days) |
| Tally | How does an approved bill reach Tally Prime in v1? | **XML export, one click** (MoM decision 2); direct push UNVERIFIED until Chintan confirms |
| Income | Include agreements → expected sales → sales invoice one day before due? | **Yes — expenses + income** |
| Language | Labels | **English only** |
| For whom | (settled by the MoM) | **One client** — Sonic Group (`os.mode: client`) |
| Users | (settled by the MoM) | Centre Coordinator → HO Coordinator → Director → Accounts (4 stages) |
| Data | (settled by the MoM) | The OS's own database; Tally Prime is the books; vendor→ledger mapping from Mugdha |

## Hard locks (first pass)

- Stack: nothing in the MoM locks a stack. "Mobile application" → the kernel's PWA (install to home screen, camera upload).
- Tally Prime: push is the open question (MoM Q1). v1 writes an **XML import file**; no direct push.
- Spine: integration asked about, not specified (MoM Q2) → `not_in_v1`.
- Local tools: Node v26 ✓ · git ✓ · Python — none on the system; a private Python 3.12 (uv) in the session scratchpad runs
  the gates · PostgreSQL 18 service running ✓, but **`psql.exe` is blocked by the machine's Application Control policy** —
  the database is reached through the app's Node driver (`npm run db:migrate`), and the `postgres` password must be put in
  `app/.env` by Damini.

## Build brief

**Build.** One app that replaces the hard-copy, email-based bill approval at Sonic Group's centres.
- A **Centre Coordinator** photographs an expense bill on their phone and uploads it. AI reads it (vendor, bill no, date,
  taxable value, GST rate(s), CGST/SGST/IGST, total, narration); code maps the vendor to its **Tally ledger name** and
  **expense head** from Mugdha's mapping table.
- The bill moves **Centre Coordinator → HO Coordinator → Director → Accounts**. Any stage can **raise a query** (flag + remarks);
  the centre replies on the bill; it re-enters the stage that raised it.
- Everyone sees bills **by day and by vendor** (sort, filter, drop-downs); the Director has one online view of everything.
- **Accounts** finalises and, with one click, downloads the **Tally XML** (purchase voucher with the mapped ledger, the
  expense head, the GST ledgers and the narration).
- **Income:** agreements (tenant, centre, rent / fit-out, amount, due day) give an **expected-sales** view; a daily job
  prepares each **sales invoice one day before its due date** and its Tally XML.
- Data home: the OS's own PostgreSQL. Stage: **clickable demo** with demo personas.

**Not in v1.** Direct push into Tally Prime (pending Chintan — XML import is the agreed fallback) · Spine integration (pending
Chintan; "first we need to get this working") · reading data back from Tally · Marathi / Hindi labels · WhatsApp/email
notifications (not asked for).

**Samples needed (from Mugdha).** (1) The vendor-name → Tally ledger → expense-head mapping document (MoM action 3).
(2) Three real bill photos — one intra-state GST, one inter-state (IGST), one with several GST rates. (3) One purchase
voucher exported from their Tally Prime as XML (so our XML matches their voucher type, ledger names and GST ledgers).
(4) Two agreement summaries (one rent, one fit-out). (5) One sales invoice from their Tally.

**Business rules to confirm (one batch).**
1. Expense bills enter Tally as a **Purchase** voucher or a **Journal**? Names of the GST input ledgers (Input CGST 9 % …)?
2. A query from the Director — goes back to the centre only, or to the HO Coordinator too?
3. Can a stage **reject** a bill outright, or only query it?
4. Sales invoice due date: a fixed day each month per agreement? Escalation clauses (e.g. 5 % a year) in v1 or later?
5. Rent invoices: GST 18 % on all of them? Fit-out billed by milestone or one-time?
6. Is each centre one Tally company, or one company for the group with cost centres?

**Outputs that leave the app.** Tally XML files — downloaded by Accounts and imported in Tally Prime (Gateway → Import →
Vouchers). A browser download only; no file is pushed into Tally.

**Simulated or unverified at this stage.** AI bill reading — **SIMULATED** (the Studio flow is built but not imported;
the demo fills fields from seed values) · the daily sales-invoice job — **SIMULATED** · Tally import of our XML —
**UNVERIFIED** until Accounts imports one file into a test company · CP Portal deploy — not in this stage.

**Look.** Domain: real-estate operations + accounts, Indian multi-state centres. Users on phones (centres) and laptops
(HO, Director, Accounts). Tone: calm, ledger-like. Geist, shadcn look, one brand accent. English only.

**Risks.** Vendor names read from photos may not match a mapped vendor (MoM risk 2) → an **unmapped** state and an
Accounts queue to map it once. Tally push not confirmed (MoM risk 1). Known kernel gaps touched: Studio import,
Tally/scheduled flows against a live workspace, CP Portal deploy — all UNVERIFIED.

**Gate:** answers ✓ · brief ✓ · "yes" — pending.
