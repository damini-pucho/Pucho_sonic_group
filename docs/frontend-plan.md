# Frontend plan — Sonic Bills & Income (pucho-os 4.4, step 4)

**Status: PLAN ONLY — nothing below is implemented.** Written 09 Oct 2026 against the running demo (commit `82aac8b`) and the
gate screenshots in `evidence/ui-check*/`. Sources followed: `method/design-direction.md` (D9), `reference/frontend-design.md`,
`reference/microanimations.md`, `method/ux-laws.md`, `reference/pattern-catalogue.md` §7b–§8, `docs/build-prompt.md`.

The plan does **not** redesign the app. It keeps every page, role, route and workflow and lists what to change, where the change
belongs (os.yaml · `app/src/custom/**` · a kernel ticket), and how each change is proven.

---

## 0 · Rules this plan obeys (from the skill)

| rule | consequence here |
|---|---|
| `os.yaml` is the source of truth; generated files are never edited | every layout / label / block change below is an **os.yaml edit** + `rescaffold.sh` |
| custom UI lives only in `app/src/custom/**`, kernel primitives + tokens, no hex, no new package | 3 custom components (§5) |
| a shared visual change is a kernel change (`templates/app`) + every worked example re-gated | 4 **kernel tickets** (§6), not done in this repo |
| one accent, colour = status, hairlines, Geist inside / IBM Plex on login, 12px floor | §1 keeps the D9 look unchanged |
| ≤ 1 React Bits Micro interaction per view, 120 / 200 / 280 ms, reduced motion honoured | §7 |
| lean budget: overview ≤ 4 KPIs · ≤ 2 charts · ≤ 3 queues; page ≤ 4 KPIs · ≤ 6 modals · drawer ≤ 3 tabs | every page stays inside it (§3 table) |
| done = `ui_check` desktop **and** `--mobile` 0 failures + screenshots looked at + no custom stub left | §9 |

---

## 1 · Look and shell (D9) — keep, with reasons

| decision | value | why (one line, for the step-2 summary) |
|---|---|---|
| shell | `sidebar` (one portal) | 11 pages but each working role sees ≤ 5; a rail would add a click for everyone |
| tone | `graphite` | HO, Director and Accounts work in it for hours; colour must mean status only |
| canvas · edges · radius | `paper` · `shadcn` · `crisp` | the shadcn/ui look the kernel ships; finance → crisp, not round |
| density | `comfortable` | All bills is ≤ 8 columns; `compact` only if Accounts asks for a denser register |
| brand / primary | `#0F766E` deep teal → primary = brand (not a red) | one accent on primary buttons, focus, selected chip, active-nav marker |
| mark | monogram **SG** until Sonic Group sends a logo → `brand.logo` + `brand.icon` | the phone home-screen icon (PWA) is what centre coordinators see daily |
| font | Geist inside, IBM Plex on login (untouched) | Latin + ₹ only; a Marathi/Hindi toggle later falls back to the system font for Devanagari |
| `sidebar.action` | **new:** `{ label: Upload bill, page: my_bills, modal: upload_bill }` | the one verb that dominates a centre coordinator's day (catalogue §8) |
| nav groups | **new** `group:` on pages: *Bills* (My bills, HO approvals, Approvals, Finalise bills, All bills) · *Tally & income* (Tally export, Agreements & sales) · *Setup* | clears the U4 warning (admin saw 8 items in one group); working roles still see ≤ 5 |

Nothing else about the look changes. No gradients, glass, second accent, emoji or new font.

---

## 2 · Page-to-page frontend map (unchanged routes)

```
Login ─► role home
Centre  : /my-bills ──(Verify & send)──► HO
HO      : /ho-approvals ──(Approve)──► Director  ·  (Raise query)──► centre /my-bills
Director: / (Overview: Needs action) ─► /director-approvals ──(Approve)──► Accounts
Accounts: /accounts (Finalise) ─► /tally-export (Download Tally XML)
          /income (Due tomorrow → Raise invoice) ─► /tally-export
Shared  : /bills (find by day · vendor · centre)   Setup: /vendors /centres /activity /users
```

---

## 3 · Page-by-page plan

Format per page: **keep** (what already works) · **change** (os.yaml) · **custom** (src/custom) · **kernel** (ticket) · **proof**.

### Login (`/login`)
- **keep:** Pucho login page, IBM Plex, demo picker only while `DEMO_LOGINS=true`. The kernel forbids restyling it.
- **change:** none. **proof:** ui_check login at 1440 / 670 / 390 (already passing).

### Overview (`/`, Director + Admin)
- **keep:** Needs action (Waiting for Director · Open queries · Due tomorrow) → 4 KPI tiles → *Bills by day* + *Bill value by vendor* → Latest bills; 1W/1M/3M.
- **change:** `recent.columns` — drop `Total_Amount` until the kernel formats money in `recent` (it prints `21712`), or keep it after kernel ticket K2.
- **change:** *Open queries* queue gets `action_label: Open` + link to the bill drawer (today it has no verb — D6 "one verb per row").
- **budget:** 4 KPIs · 2 charts · 3 queues — at the limit, add nothing.
- **proof:** C4 (same counts on Overview, bell, nav badges), screenshot.

### My bills (`/my-bills`, Centre Coordinator — **phone first**)
- **keep:** Upload bill (primary), *Needs you* inbox (Verify · Query from HO / Director / Accounts), *All my bills* cards, server-side scope.
- **change:** approvals `layout: cards` with `meta:` rows (Bill no · Total · Head · Query remarks) instead of the list layout — the list layout prints amounts raw (`21712`) and wraps badly at 390px; cards format money and stack the two buttons.
- **change:** `sidebar.action` Upload bill (§1) so the verb is one tap from any page on a phone.
- **custom:** `BillPhoto` drawer section (§5.2) so the coordinator sees the photo beside what AI read.
- **states:** upload → kernel `WorkingState` "Reading the bill…" while BILL_READ runs (≤ 25 s sync); simulated result toast says *SIMULATED read* (already true — keep).
- **proof:** ui_check `--mobile` (U1 40px targets, U1b), screenshot at 390px with 1 Verify + 1 Query card.

### HO approvals (`/ho-approvals`, HO Coordinator)
- **keep:** single inbox, Approve / Raise query in the client's words, nav badge.
- **change:** `layout: cards` + `meta:` (Centre · Bill no · Total · Head · Narration) — same reason as My bills; the Director page already uses cards, so all three stage pages look alike (Jakob).
- **custom:** `BillPhoto` in the Approve modal is not possible (modals take fields only) → HO opens the bill drawer for the photo; see kernel ticket K4 for a photo in the approvals card.
- **proof:** U2 one primary per card; screenshot.

### Approvals — Director (`/director-approvals`)
- **keep:** cards layout (already formatted), Approve / Raise query.
- **change:** none beyond shared money formatting.

### Finalise bills (`/accounts`, Accounts)  — **has a functional defect**
- **defect (seen in `modal-accounts-approvals-bill-approve.png`):** the *Tally ledger* and *Expense head* dropdowns show **"No data"**. The kernel loads `options_from` entities for page modals but **not** for fields inside an `approvals` source (`Page.jsx collectEntities`). Accounts therefore cannot pick a ledger for an unmapped vendor (Deccan Plumbing Works).
- **change (fix without touching the kernel):** declare a page-level modal on `accounts_approvals` — **`map_vendor`** (*Add vendor ledger*, `direct: insert` into `vendor_ledgers`, fields Vendor name · GSTIN · City · Tally ledger · Expense head) and expose it as a header action *Map a vendor*. Its `options_from`/entity makes the page load `vendor_ledgers`, which also fills the Finalise dropdowns, and it gives Accounts the "map an unmatched vendor once" verb (R18) where the unmapped bill is.
- **change:** `layout: cards` + `meta:` (Tally ledger · Expense head · Taxable · Total), and a callout tone `warn` "Vendor not mapped" when `Tally_Ledger` is empty (card `callout`).
- **kernel:** K1 — load `options_from` for approvals approve/reject fields.
- **proof:** open Finalise on B-2026-0134 → both selects list values; ui_check F1 (select renders options).

### Tally export (`/tally-export`, Accounts)
- **keep:** KPI tiles, the custom *Tally Prime import file* card (totals, Dr/Cr preview, blocked list, Preview XML, Download), the three tabs.
- **change:** `export: false` on the page — the header *Export* (CSV) beside *Download Tally XML* reads as two exports; CSV stays on All bills.
- **custom (fix):** in `tallyXml.js` the sales-invoice narration falls back to `${Income_Head} for ${Period}` → prints **"for undefined"** when a simulated invoice has no Period. Fallback to the month of `Due_Date`.
- **custom:** *Download Tally XML* becomes a **Slide Commit** (§7) — the click also marks rows Exported, so it is a final action.
- **proof:** unit test (Dr = Cr, no "undefined" in output), screenshot, ui_check (custom buttons keep `data-os-custom-action`, never `data-os-action`, so the gate does not click them).

### All bills (`/bills`, HO / Director / Accounts)
- **keep:** KPI strip, status segments, period presets, filters, Table / Groups / Cards, 3-tab drawer, CSV export.
- **change:** `group.count: bills` (today the summary prints "Bills:" with nothing — `count: true` is not a kernel key) and keep `summary: [{ label: Value, sum: Total_Amount }]`.
- **change (data):** rename money columns so every surface formats them — `Taxable_Value → Taxable_Amount`, `CGST → CGST_Amount`, `SGST → SGST_Amount`, `IGST → IGST_Amount` (the drawer/tiles format only `/_INR$|Amount|Total|Price/`; today *Taxable Value 18400*, *CGST 1656* print raw). A schema change: run `diff_os.py`, migrate, update `tallyXml.js` + the BILL_READ prompt/result keys, rebuild flows.
- **custom:** `ApprovalTrail` drawer section (§5.3) replaces the generic timeline (today: action "patch", 0 rows for seeded bills).
- **kernel:** K2 — format `sum` money in the grouped summary (`Value: 128400` → `₹1,28,400`).

### Agreements & sales (`/income`, Accounts + Director)
- **keep:** 4 KPIs, Due tomorrow queue with *Raise invoice*, Agreements / Sales invoices tabs, Expected sales by centre.
- **change:** queue `title: Invoices due tomorrow` — today the kernel default title reads **"Today's calls"** (wrong domain words, fidelity F1).
- **change:** *Add agreement* (17 fields, U6 warning) → a **stepper** in a third tab *New agreement*, 3 steps ≤ 7 fields: ① Tenant & space (Tenant, GSTIN, State, Centre, Unit, Type) ② Money & dates (Monthly amount, GST rate, GST type, Start, End, Due day, Next due) ③ Tally (Tenant ledger, Income head) + Review. The header button keeps opening the short modal for edits only.
- **kernel:** K3 — a computed field (`GST_Amount = Monthly_Amount × GST_Rate / 100`, `Monthly_Total = Monthly_Amount + GST_Amount`): today Accounts types numbers the record already knows (contract rule 10). Until then the stepper's review step shows them for checking.
- **proof:** U5 "Step n of m" + progress bar; U6 warning gone.

### Vendor ledgers · Centres (Setup)
- **keep:** table + add/edit modals + drawer with the vendor's / centre's bills.
- **change:** none. (Vendor ledgers gains a second entry point from Finalise bills — above.)

### Activity log · Users & roles · Profile & settings
- **keep:** kernel pages, admin only (Activity, Users). No change.

### Shared header / sidebar
- **keep:** search centre, bell (3 sources), *Workflows simulated* chip (must stay until both flows are wired — rule 8), badges on the four waiting pages only.
- **change:** nav groups + `sidebar.action` (§1).

### Footprint after the plan
| page | KPIs | charts | modals | drawer tabs |
|---|---|---|---|---|
| Overview | 4 | 2 | 1 | — |
| My bills | 0 | 0 | 1 (+4 approvals) | 1 |
| Finalise bills | 0 | 0 | 1 (*map_vendor*) | — |
| Tally export | 3 | 0 | 2 | — |
| All bills | 4 | 0 | 0 | 3 |
| Agreements & sales | 4 | 1 | 3 | 1 |
All inside the lean budget.

---

## 4 · os.yaml change list (one commit, then `rescaffold.sh`)

1. `design.sidebar.action: { label: Upload bill, page: my_bills, modal: upload_bill }`
2. `group:` on pages — Bills · Tally & income · Setup
3. `my_bills`, `ho_approvals`, `accounts_approvals` approvals → `layout: cards` + `meta:`
4. `accounts_approvals` → modal `map_vendor` + `actions: { header: [map_vendor] }`; card `callout` for an unmapped vendor
5. `tally_export` → `export: false`
6. `bills` → `group.count: bills`
7. money column renames (Taxable / CGST / SGST / IGST → `_Amount`) — with `diff_os.py`, a migration, and `build_flows.py`
8. `income` → queue `title:`, stepper tab *New agreement*; `overview` → *Open queries* `action_label`
9. drawer sections `{ type: custom, name: BillPhoto }` and `{ type: custom, name: ApprovalTrail }` on `bills` and `my_bills`

---

## 5 · Custom components (`app/src/custom/**` only)

| # | component | where | what it does | built from |
|---|---|---|---|---|
| 5.1 | `TallyExport` (exists) | Tally export | narration fallback fix; Slide Commit on Download | `tallyXml.js`, `CARD`, `Tiles`, `Callout` |
| 5.2 | `BillPhoto` | bill drawer (All bills, My bills) | the uploaded photo (`/api/files/<id>`) as a fitted image, tap to open full size; PDF → "Open bill PDF"; empty → "No photo (seeded demo bill)" | `<img referrerPolicy="no-referrer">`, `Callout`, tokens |
| 5.3 | `ApprovalTrail` | bill drawer, tab *Approval trail* | reads `audit_log` rows for the bill and writes sentences: *"Rohan Patil verified and sent to HO · 08 Oct 10:21"*, *"Sneha Kulkarni raised a query: …"*, *"Priya Joshi finalised · ledger XYZ Private Limited Bangalore"*, *"Exported to Tally"*; status dot by `toneOf()` | `audit_log` rows, `MetaRow`, `StatusBadge`, framer-motion fade |

Each: registered in `custom/index.js`, Lucide icons only, no hex, `useReducedMotion`, 12px floor, labelled buttons, works at 390px.
Remember the Windows workaround: re-scaffold only through `rescaffold.sh` (it keeps `custom/index.js`).

---

## 6 · Kernel tickets (for the pucho-os skill — not done in this repo)

| # | defect | seen at | fix in `templates/app` |
|---|---|---|---|
| K1 | `options_from` inside approvals approve/reject fields is not loaded → empty selects | Finalise for Tally | `Page.jsx collectEntities`: walk `sources[].approve/reject.fields` with `modalEntities` |
| K2 | money printed raw in approvals *list* summary, overview `recent`, grouped `summary.sum` | My bills, Overview, All bills › Groups | use `fmt(row, col, ent)` / `formatValue(…,'money')` in those three renderers; share one money regex (Charts `MONEY_COL` ≠ Sections `guessType`) |
| K3 | no computed field in forms | Add agreement | `type: static, compute:` evaluated in code, copied into the payload |
| K4 | approvals cards cannot show a thumbnail | HO / Director cards | `image: <file column>` on an approvals source |
| K5 | Windows: AUTHORED path check, CRLF `.env`, `start.mjs` file-URL import | scaffold / db / start | `docs/build-notes.md` § defects |

---

## 7 · Micro-interactions (React Bits Micro, ≤ 1 per view)

| view | interaction | source pattern | why | reduced motion |
|---|---|---|---|---|
| Tally export | **Slide Commit** on *Download Tally XML* | reactbits.dev/c/micro — Slide Commit | the action also marks rows Exported — a final step deserves a deliberate gesture | a plain primary button with a confirm |
| approval cards (all stages) | **Status Mark** on the card as it leaves the inbox after Approve / Finalise | Status Mark | acknowledges the stage change in place of a jump | instant removal + the toast |
| Upload bill | kernel `WorkingState` "Reading the bill…" (already there) — **no** Thought Line | — | an existing pending state; do not add a second | static label |

Port rules: file in `src/custom/micro/<Name>.jsx`, framer-motion only, `src/config/motion.js` durations (120 / 200 / 280 ms), tokens
not hex, Lucide icons, licence URL in a comment. Never: count-up KPIs, row staggers, confetti, shake.

---

## 8 · UX laws audit (method/ux-laws.md) — today → after

| law | today | after the plan |
|---|---|---|
| 1 Fitts | primary 40px; phone 40px (gate passes) | unchanged; Slide Commit track ≥ 44px tall |
| 2 Hick | Tally export header: *Export* + custom actions | `export: false` → one export path |
| 3 Zeigarnik | nav badges + Needs you counts | unchanged (works) |
| 4 Jakob | three stage pages in two layouts (list / cards) | all three in cards |
| 5 Goal gradient | — | agreement stepper shows Step n of 3 |
| 6 Von Restorff | one primary per card / header | unchanged; *Map a vendor* is secondary |
| 7 Miller | admin 8 nav items in one group (U4); Add agreement 17 fields (U6) | 3 nav groups; stepper 6 / 7 / 2 fields |

---

## 9 · States, responsiveness, accessibility (checklist per page)

- **loading** skeletons only while a request is pending · **empty** says why + next step (exists on My bills, Vendor ledgers) — add to Tally export tabs and Finalise inbox
- **simulated** stays visible: header chip, *SIMULATED read* narration, simulated toasts — never removed until `WEBHOOK_*` are set
- **error** keeps entered values; persistent message, not only a toast
- **widths** 1440 / 768 / 390, 200 % zoom; tables → cards under 640px; chip rows scroll sideways (already)
- **a11y** 44px touch targets on phones, visible focus, labelled icon buttons, text beside colour, Escape closes the top overlay

## 10 · Order of work and the gate

1. os.yaml items 1–6, 8 → `rescaffold.sh` → `sed -i 's/\r$//' app/.env` → `npm run build` → `npm run db:reset`
2. `BillPhoto`, `ApprovalTrail`, `TallyExport` fix + Slide Commit (custom)
3. money-column rename (item 7) with `diff_os.py` + migration + `build_flows.py` (flows re-gated: contract PASS, `flow_sim` 0 failures)
4. Gates: `npm run check` · `ui_check.py .` and `--mobile` at **0 failures, no custom stub** · `security_scan --stage demo` 0 C / 0 H · look at the screenshots per role (Rohan on 390px, Sneha, Anil, Priya)
5. Write what was observed (and what was not) in `docs/build-notes.md`; commit `evidence/`

**Not verified by any gate:** taste, copy, animation quality, whether a Tally import accepts the XML (Accounts must import one file).
