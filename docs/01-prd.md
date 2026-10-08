# 01 — PRD · Sonic Bills & Income
_Generated 2026-10-08 from os.yaml._

**Client:** Sonic Group  
**Outcome:** A centre coordinator photographs an expense bill, AI reads the GST and the narration, the bill is approved by HO, the Director and Accounts online, and Accounts imports it into Tally Prime from one XML — sales invoices from the agreements arrive the day before they are due.  
**Languages:** en · **Volume:** ~300 events/month · **Operating cost:** see `docs/estimate.md` (credits/month, workflow-wise)

## Pages
- **overview** `/` — What needs the Director today, then the month in numbers
- **my_bills** `/my-bills` — The centre's bills — upload, verify, reply
- **ho_approvals** `/ho-approvals` — The HO Coordinator's stage
- **director_approvals** `/director-approvals` — The Director's stage
- **accounts_approvals** `/accounts` — The Accounts stage
- **tally_export** `/tally-export` — Purchase vouchers and sales vouchers for Tally Prime (Gateway → Import → Vouchers)
- **bills** `/bills` — The register of every expense bill since the start
- **income** `/income` — Agreements, expected sales and sales invoices
- **vendors** `/vendors` — The vendor → Tally ledger → expense head mapping Mugdha provides
- **centres** `/centres` — Centres across Maharashtra and other states
- **activity** `/activity` — Every change — who approved, queried, finalised or exported which bill, and when
- **settings** `/settings` — Profile and password
- **users** `/users` — Everyone who can sign in, and what each role may open

## Workflows
- **BILL_READ** — trigger `webhook.catch_webhook`; writes bills, audit_log
  - `extract` — model advanced, ~15s, ~8 credits; payload Bill_Photo, Centre → result Vendor_Name, Vendor_GSTIN, Bill_No, Bill_Date, Taxable_Value, GST_Rate, CGST, SGST, IGST, Total_Amount, Narration, Tally_Ledger, Expense_Head, AI_Confidence
- **SALES_INVOICE** — trigger `webhook.catch_webhook`; writes sales_invoices, agreements, audit_log
  - `raise` — model none, ~5s, ~5 credits; payload Agreement_ID, Tenant_Name, Tenant_State, Centre, Unit, Next_Due_Date, Monthly_Amount, GST_Rate, GST_Type, GST_Amount, Monthly_Total, Tenant_Ledger, Income_Head → result Invoice_ID

## Rules in code
- The four stages are status changes the app makes itself (direct patch): At Centre → With HO → With Director → With Accounts → Finalised → Exported; who moved it and when is the audit row written from the session
- A query records Query_From (HO · Director · Accounts); the centre's reply returns the bill to exactly that stage
- Tally XML is built by code in the app (src/custom/TallyExport): one Purchase voucher per bill — vendor ledger credited with the total, expense head debited with the taxable value, Input CGST / SGST / IGST debited with the GST; one Sales voucher per invoice — tenant ledger debited, income head credited, Output CGST + SGST (same state as the centre) or IGST; downloaded as one file, then the rows are marked Exported
- A Centre Coordinator's reads and writes of bills are pinned to Centre_Coordinator = the signed-in person, server-side
- Expected sales = sum of Monthly_Total over Active agreements; Due tomorrow = Next_Due_Date ≤ tomorrow and not yet raised

## Not in v1
- Direct push of entries into Tally Prime — v1 builds the XML Accounts imports in Tally (MoM decision 2); pending Chintan's confirmation
- Spine application integration — pending Chintan; 'first, we need to get this working'
- Raising tomorrow's sales invoices without a click (an unattended daily run) — v1 puts them on Accounts' Due tomorrow queue for one click; the kit's scheduled flows only sync from Tally
- Reading data back from Tally (ledgers, outstanding) — not asked for in v1
- Marathi / Hindi labels — English chosen at intake

## Success metric
The Director sees every bill online by day and by vendor, and no bill waits for a hard-copy signature
