# SALES_INVOICE
trigger: `webhook.catch_webhook` {}
constants: `{}`
writes: sales_invoices, agreements, audit_log

Shape: trigger → `step_constants` → [`step_router` on action →] `step_<action>_ai` → `step_<action>_build` (parse + row, CODE) → `step_<action>_insert|update` (http → the app's /api/data, named fields under body.data) → `step_<action>_done` (Return: ok, id, row).
Built by `scripts/build_flows.py` (flow/flowkit.py); the JSON lands beside this file as `SALES_INVOICE.json`; the CHECKLIST carries a test payload per action.

### `raise`  (model: none, ~5s, ~5 credits, 40 runs/month)
payload: `{"Agreement_ID": "string", "Tenant_Name": "string", "Tenant_State": "string", "Centre": "string", "Unit": "string", "Next_Due_Date": "string", "Monthly_Amount": "number", "GST_Rate": "number", "GST_Type": "string", "GST_Amount": "number", "Monthly_Total": "number", "Tenant_Ledger": "string", "Income_Head": "string"}`
result: `{"Invoice_ID": "string"}`
rules: Period = the month of Next_Due_Date (code); Narration = Income_Head + ' for ' + Period + ' — ' + Unit (code); The app numbers the invoice (SI-YYYY-NNNN); Wired: CODE advances the agreement's Next_Due_Date by one month and sets Invoice_Status back to Upcoming; simulated: the agreement is marked Raised
