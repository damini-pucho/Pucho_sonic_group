# Wiring map · Sonic Bills & Income
_Generated 2026-10-08._

## Screen → flow.action
- Overview `/` → direct patch (Approve bill)
- My bills `/my-bills` → `BILL_READ.extract` (Upload bill)
- HO approvals `/ho-approvals` → no workflow
- Approvals `/director-approvals` → no workflow
- Finalise bills `/accounts` → no workflow
- Tally export `/tally-export` → direct patch (Mark as imported in Tally)
- All bills `/bills` → no workflow
- Agreements & sales `/income` → `SALES_INVOICE.raise` (Raise sales invoice), direct insert (Add agreement), direct patch (Edit agreement)
- Vendor ledgers `/vendors` → direct insert (Add vendor ledger), direct patch (Edit vendor ledger)
- Centres `/centres` → direct insert (Add centre), direct patch (Edit centre)
- Activity log `/activity` → no workflow
- Settings `/settings` → no workflow
- Users & roles `/users` → no workflow

## Flows
- **BILL_READ** — trigger `webhook.catch_webhook`; writes bills, audit_log
  - `extract` — model advanced, ~15s, ~8 credits; payload Bill_Photo, Centre → result Vendor_Name, Vendor_GSTIN, Bill_No, Bill_Date, Taxable_Value, GST_Rate, CGST, SGST, IGST, Total_Amount, Narration, Tally_Ledger, Expense_Head, AI_Confidence
- **SALES_INVOICE** — trigger `webhook.catch_webhook`; writes sales_invoices, agreements, audit_log
  - `raise` — model none, ~5s, ~5 credits; payload Agreement_ID, Tenant_Name, Tenant_State, Centre, Unit, Next_Due_Date, Monthly_Amount, GST_Rate, GST_Amount, Monthly_Total, Tenant_Ledger, Income_Head → result Invoice_ID

## Credit estimate
| action | model | runs/month | credits/run | credits/month |
|---|---|---|---|---|
| `BILL_READ.extract` | advanced | 330 | 8 | 2,640 |
| `SALES_INVOICE.raise` | none | 40 | 5 | 200 |
| **total** | | | | **2,840** credits ≈ ₹852 / month (declared; `docs/estimate.md` is the client page and is re-counted on the built flows at step 6) |

Credits are the only unit the client is quoted — no plan fit. Per-step base per `flow/credit-table.md`.
