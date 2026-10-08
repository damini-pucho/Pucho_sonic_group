# 00 — Decisions · Sonic Bills & Income
_Generated from os.yaml. The step-2 summary: roles and homes, journeys, entities, metrics, sections, actions, flows, overview, theme, tier, not in v1 (`method/os-decisions.md`)._

## D1 · Roles and homes
| role | lands on | pages | in their words |
|---|---|---|---|
| Admin | `/` | * | Sees everything; maintains centres, vendor ledgers and people |
| Centre Coordinator | `/my-bills` | my_bills, settings | Photographs and uploads the centre's bills, verifies what AI read, answers queries |
| HO Coordinator | `/ho-approvals` | ho_approvals, bills, settings | Approves bills from every centre after the centre, or raises a query |
| Director | `/` | overview, director_approvals, bills, income, settings | Approves bills online and sees every bill, query and the expected sales |
| Accounts | `/accounts` | accounts_approvals, tally_export, bills, income, vendors, centres, settings | Finalises approved bills, keeps the vendor ledger mapping, raises sales invoices and exports to Tally |

## D2 · Journeys
- **centre** · Upload a bill photo and send it to HO — lands on `my_bills` · 3 steps: Tap Upload bill → Take the photo and pick the centre — AI reads the bill → Check the fields AI filled → Verify & send to HO
- **centre** · Answer a query on a bill — lands on `my_bills` · 2 steps: The query sits at the top of My bills with its remarks → Reply & resend — the correction goes back to the stage that asked
- **ho** · Approve or query the bills from the centres — lands on `ho_approvals` · 2 steps: HO approvals opens on the waiting bills → Approve — or Raise query with remarks
- **director** · Approve the bills waiting for the Director — lands on `overview` · 2 steps: Overview opens on Waiting for your approval → Approve on the row — or open Approvals to raise a query
- **director** · See the bills of one day or one vendor — lands on `overview` · 2 steps: All bills → Pick the day preset — or group by vendor
- **accounts** · Finalise bills and import them into Tally — lands on `accounts_approvals` · 3 steps: Finalise bills opens on the bills the Director approved → Finalise — Tally ledger and expense head already filled → Tally export → Download Tally XML (one click)
- **accounts** · Raise tomorrow's sales invoices — lands on `income` · 3 steps: Agreements & sales opens on Due tomorrow → Raise invoice on the row → Tally export → Download Tally XML
- **admin** · Add a centre and its coordinator — lands on `overview` · 2 steps: Setup → Centres → Add centre → Users & roles → add the coordinator

## D3 · Entities
| entity | title | subtitle | owner | due | contact | stages |
|---|---|---|---|---|---|---|
| bills | Vendor_Name | Centre, Bill_No | Centre_Coordinator |  |  | At Centre → With HO → With Director → With Accounts → Query → Finalised → Exported → Cancelled |
| vendor_ledgers | Vendor_Name | Tally_Ledger |  |  |  | Active → Inactive |
| centres | Centre_Name | City, State | Coordinator |  | phone=Phone, whatsapp=Phone | Active → Inactive |
| agreements | Tenant_Name | Centre, Unit |  | Next_Due_Date |  | Active → On Hold → Ended |
| sales_invoices | Tenant_Name | Centre, Period |  | Due_Date |  | Prepared → Exported |
| audit_log |  |  |  |  |  |  |

Data: **PostgreSQL** (one database per client, single-tenant) · security: **§19 baseline** (`docs/security.md`)

## D4 · Metrics
| metric | label | entity | where | tone |
|---|---|---|---|---|
| `at_centre` | To verify at centre | bills | `Status=At Centre` | warn |
| `with_ho` | Waiting with HO | bills | `Status=With HO` | info |
| `with_director` | Waiting for Director | bills | `Status=With Director` | warn |
| `with_accounts` | Waiting with Accounts | bills | `Status=With Accounts` | info |
| `open_queries` | Open queries | bills | `Status=Query` | bad |
| `unmapped` | Vendor not mapped | bills | `Tally_Ledger is empty and Status not in [Cancelled, Exported]` | warn |
| `bills_today` | Bills today | bills | `Uploaded_At=today` | info |
| `bills_month` | Bills this month | bills | `Uploaded_At in month and Status!=Cancelled` | info |
| `bills_value` | Bill value this month | bills | `Uploaded_At in month and Status!=Cancelled` · sum Total_Amount | info |
| `ready_tally` | Bills ready for Tally | bills | `Status=Finalised` | ok |
| `exported_month` | Exported this month | bills | `Status=Exported and Exported_At in month` | ok |
| `invoices_ready` | Sales invoices ready | sales_invoices | `Status=Prepared` | ok |
| `expected_sales` | Expected sales / month | agreements | `Status=Active` · sum Monthly_Total | info |
| `active_agreements` | Active agreements | agreements | `Status=Active` | info |
| `due_tomorrow` | Due tomorrow | agreements | `Next_Due_Date<=today+1 and Invoice_Status!=Raised and Status=Active` | warn |
| `ending_soon` | Ending in 60 days | agreements | `End_Date<=today+60 and End_Date>=today and Status=Active` | warn |

## D5 · Sections — the shape of each
| page | section | shape |
|---|---|---|
| Overview | Needs action | needs_action: with_director · open_queries · due_tomorrow |
| My bills | Needs you | approvals |
| My bills | bills | cards / table; drawer per row |
| HO approvals | kpis | kpis (strip) |
| HO approvals | Waiting with HO | approvals |
| Approvals | Waiting for the Director | approvals |
| Finalise bills | kpis | kpis (strip) |
| Finalise bills | Waiting with Accounts | approvals |
| Tally export | kpis | kpis (strip) |
| Tally export | custom | custom |
| Tally export | tabs | tabs: Bills ready, Sales invoices ready, Exported |
| Tally export | bills | table; drawer per row |
| Tally export | sales_invoices | table; drawer per row |
| Tally export | bills | table; drawer per row |
| All bills | kpis | kpis (strip) |
| All bills | bills | table / grouped / cards; grouped by Vendor_Name; drawer per row |
| Agreements & sales | kpis | kpis (strip) |
| Agreements & sales | queue | queue: due_tomorrow |
| Agreements & sales | tabs | tabs: Agreements, Sales invoices |
| Agreements & sales | agreements | table; drawer per row |
| Agreements & sales | sales_invoices | table; drawer per row |
| Agreements & sales | charts | charts: breakdown |
| Vendor ledgers | vendor_ledgers | table; drawer per row |
| Centres | centres | table; drawer per row |
| Activity log | kpis | kpis (strip) |
| Activity log | audit_log | table; centred pop-up per row |

## D6 · Actions
| page | action | shape |
|---|---|---|
| Overview | Approve bill | status: 0 fields · direct |
| My bills | Upload bill | create: 2 fields · BILL_READ |
| Tally export | Mark as imported in Tally | status: 1 field · direct |
| Tally export | Mark as imported in Tally | status: 1 field · direct |
| Agreements & sales | Raise sales invoice | custom: 0 fields · SALES_INVOICE |
| Agreements & sales | Add agreement | create: 17 fields · direct |
| Agreements & sales | Edit agreement | edit: 7 fields · direct |
| Vendor ledgers | Add vendor ledger | create: 5 fields · direct |
| Vendor ledgers | Edit vendor ledger | edit: 5 fields · direct |
| Centres | Add centre | create: 5 fields · direct |
| Centres | Edit centre | edit: 3 fields · direct |

## D7 · Flows and AI
- **BILL_READ** — `webhook.catch_webhook`; actions extract; AI in extract
- **SALES_INVOICE** — `webhook.catch_webhook`; actions raise; no model call
- Rules in code: The four stages are status changes the app makes itself (direct patch): At Centre → With HO → With Director → With Accounts → Finalised → Exported; who moved it and when is the audit row written from the session; A query records Query_From (HO · Director · Accounts); the centre's reply returns the bill to exactly that stage; Tally XML is built by code in the app (src/custom/TallyExport): one Purchase voucher per bill — vendor ledger credited with the total, expense head debited with the taxable value, Input CGST / SGST / IGST debited with the GST; one Sales voucher per invoice — tenant ledger debited, income head credited, Output CGST + SGST (same state as the centre) or IGST; downloaded as one file, then the rows are marked Exported; A Centre Coordinator's reads and writes of bills are pinned to Centre_Coordinator = the signed-in person, server-side; Expected sales = sum of Monthly_Total over Active agreements; Due tomorrow = Next_Due_Date ≤ tomorrow and not yet raised

## D8 · Overview order
- Needs action (with_director · open_queries · due_tomorrow) → KPI strip → charts: trend, breakdown → recent

## D9 · Shell & look
- Brand `#0F766E` → primary **brand** (red is overdue / lost / destructive only); mark: monogram
- Shell: admin → sidebar
- Look: tone graphite · face geist (login stays IBM Plex) · edges shadcn · canvas paper · radius crisp · density comfortable · labels plain · sidebar light
- Direction: Calm and ledger-like: centre coordinators on phones, HO, the Director and Accounts on laptops; one teal accent, colour only for status.

## D11 · Not in v1
- Direct push of entries into Tally Prime — v1 builds the XML Accounts imports in Tally (MoM decision 2); pending Chintan's confirmation
- Spine application integration — pending Chintan; 'first, we need to get this working'
- Raising tomorrow's sales invoices without a click (an unattended daily run) — v1 puts them on Accounts' Due tomorrow queue for one click; the kit's scheduled flows only sync from Tally
- Reading data back from Tally (ledgers, outstanding) — not asked for in v1
- Marathi / Hindi labels — English chosen at intake

## Footprint (lean frontend, v4.3)
- footprint: 11 pages in the nav (0 hidden) · 27 KPIs · 3 charts · 11 modals · 3 drawer tabs · for 20 requirements
- Budget: overview ≤ 4 KPIs · ≤ 2 charts · ≤ 3 queues; a page ≤ 4 KPIs · ≤ 6 modals · drawer ≤ 3 tabs; nav pages ≤ requirements. Pages marked `badge: Preview` stay off the nav until `os.show_preview: true`.
- Within budget.

## Definition of done
Tick against this page before step 3, and against the screenshots before step 4 (`method/os-decisions.md`).
