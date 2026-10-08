# Studio checklist — SALES_INVOICE

File: `SALES_INVOICE.json`. Do the steps in order. Tick each box.

## 1. Import
- [ ] Studio → Flows → Import → pick the file above.

## 2. Insert sales_invoices: Prepared_At, Agreement_ID, Tenant_Name, Tenant_State, Centre, Period +11 more (Invoice_ID numbered by the app) (`step_raise_insert`, http)
- [ ] No connection to pick. Check each box below; paste the value if it is empty or different.
- [ ] A box that is a dropdown takes a `{{…}}` value only after you press its **ƒ** button. Press ƒ, then paste.
  - **method**: `POST`
  - **url**: `{{step_constants['app_url']}}/api/data/sales_invoices`
  - **headers**: `{"Content-Type": "application/json", "Authorization": "Bearer {{step_constants['inbound_token']}}", "X-Flow": "{{step_constants['flow']}}"}`
  - **authType**: `NONE`
  - **body_type**: `json`
  - **body**: `{"data": {"Invoice_ID": "{{step_raise_build['row']['Invoice_ID']}}", "Prepared_At": "{{step_raise_build['row']['Prepared_At']}}", "Agreement_ID": "{{step_raise_build['row']['Agreement_ID']}}", "Tenant_Name": "{{step_raise_build['row']['Tenant_Name']}}", "Tenant_State": "{{step_raise_build['row']['Tenant_State']}}", "Centre": "{{step_raise_build['row']['Centre']}}", "Period": "{{step_raise_build['row']['Period']}}", "Due_Date": "{{step_raise_build['row']['Due_Date']}}", "Taxable_Value": "{{step_raise_build['row']['Taxable_Value']}}", "GST_Rate": "{{step_raise_build['row']['GST_Rate']}}", "GST_Type": "{{step_raise_build['row']['GST_Type']}}", "GST_Amount": "{{step_raise_build['row']['GST_Amount']}}", "Total_Amount": "{{step_raise_build['row']['Total_Amount']}}", "Tenant_Ledger": "{{step_raise_build['row']['Tenant_Ledger']}}", "Income_Head": "{{step_raise_build['row']['Income_Head']}}", "Narration": "{{step_raise_build['row']['Narration']}}", "Status": "{{step_raise_build['row']['Status']}}", "Exported_At": "{{step_raise_build['row']['Exported_At']}}"}}`

## 3. Update agreements (same call): Agreement_ID, Tenant_Name, Tenant_State, Centre, Unit, Monthly_Amount +8 more (`step_raise_also_update`, http)
- [ ] No connection to pick. Check each box below; paste the value if it is empty or different.
- [ ] A box that is a dropdown takes a `{{…}}` value only after you press its **ƒ** button. Press ƒ, then paste.
  - **method**: `PATCH`
  - **url**: `{{step_constants['app_url']}}/api/data/agreements`
  - **headers**: `{"Content-Type": "application/json", "Authorization": "Bearer {{step_constants['inbound_token']}}", "X-Flow": "{{step_constants['flow']}}"}`
  - **queryParams**: `eq.{{step_raise_also_build['id']}}`
  - **authType**: `NONE`
  - **body_type**: `json`
  - **body**: `{"data": {"Tenant_Name": "{{step_raise_also_build['patch']['Tenant_Name']}}", "Tenant_State": "{{step_raise_also_build['patch']['Tenant_State']}}", "Centre": "{{step_raise_also_build['patch']['Centre']}}", "Unit": "{{step_raise_also_build['patch']['Unit']}}", "Monthly_Amount": "{{step_raise_also_build['patch']['Monthly_Amount']}}", "GST_Rate": "{{step_raise_also_build['patch']['GST_Rate']}}", "GST_Type": "{{step_raise_also_build['patch']['GST_Type']}}", "GST_Amount": "{{step_raise_also_build['patch']['GST_Amount']}}", "Monthly_Total": "{{step_raise_also_build['patch']['Monthly_Total']}}", "Next_Due_Date": "{{step_raise_also_build['patch']['Next_Due_Date']}}", "Tenant_Ledger": "{{step_raise_also_build['patch']['Tenant_Ledger']}}", "Income_Head": "{{step_raise_also_build['patch']['Income_Head']}}", "Invoice_Status": "{{step_raise_also_build['patch']['Invoice_Status']}}"}}`

## 4. Constants (`step_constants`, code)
- [ ] Open the step's code and replace each placeholder with the real value, then save:
  - `SET_IN_STUDIO_APP_URL` → the app's public origin, e.g. `https://<client>-os.pucho.app` (no trailing slash)
  - `SET_IN_STUDIO_INBOUND_TOKEN` → this flow's own token: set `INBOUND_TOKEN_<FLOW>` in the app's environment and paste the same value here (one token per flow — a leak points at one flow and one flow can be cut off); the shared `INBOUND_TOKEN` also works (docs/security.md § Inbound tokens)

## 5. Publish
- [ ] Press **Publish**. Edits do nothing until Studio says the flow is published.
- [ ] Self-check: open **Build the agreements patch (CODE — same call)**. Its code has **9 lines** and line 1 is `// @ts-nocheck`. If not, paste it again and publish.
## 6. Test the trigger — one payload per action
- [ ] Open the trigger step → **Test** → paste a payload below → send. Studio then shows every later step's input filled in, and `{{trigger['body'][…]}}` picks resolve in the UI.
- [ ] After the test, open each **http** step: the **JSON Body** box lists the fields it writes (named, one per column). If a box is empty, the import did not take `body.data` — tell Claude.
- [ ] Test one update with an optional field left blank (e.g. no Close_Reason): the row's column must stay as it was. If it was blanked, tell Claude (the app would then need a skip-empty rule).
- [ ] Each test must end at a **Return** step with `ok: true` and the row it wrote; a run that stops earlier is a failed path.
- [ ] A WhatsApp **text** send reaches a number only inside Meta's 24-hour window after the customer last wrote; a reminder or a win-back must be a **template** send (`sends.template`) approved on whatsapp.pucho.ai.

**raise**
```json
{
  "action": "raise",
  "Agreement_ID": "AG-2026-014",
  "Tenant_Name": "Nexa Analytics Pvt Ltd",
  "Tenant_State": "Maharashtra",
  "Centre": "Pune — Baner",
  "Unit": "3rd floor, Wing A (4,200 sq ft)",
  "Next_Due_Date": "2026-10-09",
  "Monthly_Amount": 420000,
  "GST_Rate": 18,
  "GST_Type": "CGST + SGST",
  "GST_Amount": 75600,
  "Monthly_Total": 495600,
  "Tenant_Ledger": "Nexa Analytics Pvt Ltd",
  "Income_Head": "Rent Income"
}
```

From a terminal (the app sends the same): `curl -X POST <webhook URL>/sync -H 'Content-Type: application/json' -d @payload.json`


## 7. Hand back
- [ ] Copy the webhook URL from the trigger step and send it to Claude.
- Claude adds `/sync` at the end when the app waits for the flow's answer. Do not add it yourself.
