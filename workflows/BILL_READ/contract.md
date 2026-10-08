# BILL_READ
trigger: `webhook.catch_webhook` {}
constants: `{"rows_from": ["vendor_ledgers"]}`
writes: bills, audit_log

Shape: trigger → `step_constants` → [`step_router` on action →] `step_<action>_ai` → `step_<action>_build` (parse + row, CODE) → `step_<action>_insert|update` (http → the app's /api/data, named fields under body.data) → `step_<action>_done` (Return: ok, id, row).
Built by `scripts/build_flows.py` (flow/flowkit.py); the JSON lands beside this file as `BILL_READ.json`; the CHECKLIST carries a test payload per action.

### `extract`  (model: advanced, ~15s, ~8 credits, 330 runs/month)
payload: `{"Bill_Photo": "string", "Centre": "string"}`
result: `{"Vendor_Name": "string", "Vendor_GSTIN": "string", "Bill_No": "string", "Bill_Date": "string", "Taxable_Value": "number", "GST_Rate": "number", "CGST": "number", "SGST": "number", "IGST": "number", "Total_Amount": "number", "Narration": "string", "Tally_Ledger": "string", "Expense_Head": "string", "AI_Confidence": "number"}`
rules: Status starts as At Centre; the uploader is the Centre_Coordinator (from the session); Taxable_Value + CGST + SGST + IGST must equal Total_Amount within ₹1 — otherwise AI_Confidence is capped at 0.5 in code; The app numbers the bill (B-YYYY-NNNN)

prompt:
```
You read one expense bill (a phone photo) for Sonic Group, a company that rents and fits out commercial spaces in India.
The bill was uploaded at the centre {{payload.Centre}}. Read exactly what is printed — never guess a number you cannot see.
Extract: the vendor name as printed, the vendor GSTIN, the bill number, the bill date (YYYY-MM-DD), the taxable value,
the GST rate in percent (if several rates are printed, the rate on the largest line), CGST, SGST and IGST amounts
(0 when absent), the bill total, and a one-line narration of what was bought or done, in plain English.
Then pick the matching row from Sonic Group's vendor ledger mapping by GSTIN first, then by vendor name and city:
{{constants.vendor_ledgers}}
Copy its Tally_Ledger and Expense_Head exactly; when no row matches, leave both empty.
Reply ONLY with JSON: {"Vendor_Name": "", "Vendor_GSTIN": "", "Bill_No": "", "Bill_Date": "", "Taxable_Value": 0, "GST_Rate": 0, "CGST": 0, "SGST": 0, "IGST": 0, "Total_Amount": 0, "Narration": "", "Tally_Ledger": "", "Expense_Head": "", "AI_Confidence": 0.0}
```
