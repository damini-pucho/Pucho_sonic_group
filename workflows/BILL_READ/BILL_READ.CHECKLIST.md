# Studio checklist — BILL_READ

File: `BILL_READ.json`. Do the steps in order. Tick each box.

## 1. Import
- [ ] Studio → Flows → Import → pick the file above.

## 2. Read the document (OCR + AI) (`step_extract_ai`, ocr-analytics)
- [ ] No connection to pick. Check each box below; paste the value if it is empty or different.
- [ ] A box that is a dropdown takes a `{{…}}` value only after you press its **ƒ** button. Press ƒ, then paste.
  - **url**: `{{trigger['body']['Bill_Photo']}}`
  - **model**: `openrouter/anthropic/claude-sonnet-4.5`
  - **query**: `You read one expense bill (a phone photo) for Sonic Group, a company that rents and fits out commercial spaces in India.
The bill was uploaded at the centre {{trigger['body']['Centre']}}. Read exactly what is printed — never guess a number you cannot see.
Extract: the vendor name as printed, the vendor GSTIN, the bill number, the bill date (YYYY-MM-DD), the taxable value,
the GST rate in percent (if several rates are printed, the rate on the largest line), CGST, SGST and IGST amounts
(0 when absent), the bill total, and a one-line narration of what was bought or done, in plain English.
Then pick the matching row from Sonic Group's vendor ledger mapping by GSTIN first, then by vendor name and city:
{{step_constants['vendor_ledgers']}}
Copy its Tally_Ledger and Expense_Head exactly; when no row matches, leave both empty.
Reply ONLY with JSON: {"Vendor_Name": "", "Vendor_GSTIN": "", "Bill_No": "", "Bill_Date": "", "Taxable_Value": 0, "GST_Rate": 0, "CGST": 0, "SGST": 0, "IGST": 0, "Total_Amount": 0, "Narration": "", "Tally_Ledger": "", "Expense_Head": "", "AI_Confidence": 0.0}
`
  - **puchoModelKey**: `openrouter/anthropic/claude-sonnet-4.5`
  - **puchoProviderName**: `OpenRouter`

## 3. Insert bills: Uploaded_At, Centre, Centre_Coordinator, Bill_Photo, Vendor_Name, Vendor_GSTIN +18 more (Bill_ID numbered by the app) (`step_extract_insert`, http)
- [ ] No connection to pick. Check each box below; paste the value if it is empty or different.
- [ ] A box that is a dropdown takes a `{{…}}` value only after you press its **ƒ** button. Press ƒ, then paste.
  - **method**: `POST`
  - **url**: `{{step_constants['app_url']}}/api/data/bills`
  - **headers**: `{"Content-Type": "application/json", "Authorization": "Bearer {{step_constants['inbound_token']}}", "X-Flow": "{{step_constants['flow']}}"}`
  - **authType**: `NONE`
  - **body_type**: `json`
  - **body**: `{"data": {"Bill_ID": "{{step_extract_build['row']['Bill_ID']}}", "Uploaded_At": "{{step_extract_build['row']['Uploaded_At']}}", "Centre": "{{step_extract_build['row']['Centre']}}", "Centre_Coordinator": "{{step_extract_build['row']['Centre_Coordinator']}}", "Bill_Photo": "{{step_extract_build['row']['Bill_Photo']}}", "Vendor_Name": "{{step_extract_build['row']['Vendor_Name']}}", "Vendor_GSTIN": "{{step_extract_build['row']['Vendor_GSTIN']}}", "Bill_No": "{{step_extract_build['row']['Bill_No']}}", "Bill_Date": "{{step_extract_build['row']['Bill_Date']}}", "Taxable_Value": "{{step_extract_build['row']['Taxable_Value']}}", "GST_Rate": "{{step_extract_build['row']['GST_Rate']}}", "CGST": "{{step_extract_build['row']['CGST']}}", "SGST": "{{step_extract_build['row']['SGST']}}", "IGST": "{{step_extract_build['row']['IGST']}}", "Total_Amount": "{{step_extract_build['row']['Total_Amount']}}", "Narration": "{{step_extract_build['row']['Narration']}}", "Tally_Ledger": "{{step_extract_build['row']['Tally_Ledger']}}", "Expense_Head": "{{step_extract_build['row']['Expense_Head']}}", "AI_Confidence": "{{step_extract_build['row']['AI_Confidence']}}", "Status": "{{step_extract_build['row']['Status']}}", "Query_From": "{{step_extract_build['row']['Query_From']}}", "Query_Remarks": "{{step_extract_build['row']['Query_Remarks']}}", "Query_Reply": "{{step_extract_build['row']['Query_Reply']}}", "Accounts_Remarks": "{{step_extract_build['row']['Accounts_Remarks']}}", "Exported_At": "{{step_extract_build['row']['Exported_At']}}"}}`

## 4. Constants (`step_constants`, code)
- [ ] Open the step's code and replace each placeholder with the real value, then save:
  - `SET_IN_STUDIO_APP_URL` → the app's public origin, e.g. `https://<client>-os.pucho.app` (no trailing slash)
  - `SET_IN_STUDIO_INBOUND_TOKEN` → this flow's own token: set `INBOUND_TOKEN_<FLOW>` in the app's environment and paste the same value here (one token per flow — a leak points at one flow and one flow can be cut off); the shared `INBOUND_TOKEN` also works (docs/security.md § Inbound tokens)

## 5. Publish
- [ ] Press **Publish**. Edits do nothing until Studio says the flow is published.
- [ ] Self-check: open **Parse AI output · build the row (CODE)**. Its code has **19 lines** and line 1 is `// @ts-nocheck`. If not, paste it again and publish.
## 6. Test the trigger — one payload per action
- [ ] Open the trigger step → **Test** → paste a payload below → send. Studio then shows every later step's input filled in, and `{{trigger['body'][…]}}` picks resolve in the UI.
- [ ] After the test, open each **http** step: the **JSON Body** box lists the fields it writes (named, one per column). If a box is empty, the import did not take `body.data` — tell Claude.
- [ ] Test one update with an optional field left blank (e.g. no Close_Reason): the row's column must stay as it was. If it was blanked, tell Claude (the app would then need a skip-empty rule).
- [ ] Each test must end at a **Return** step with `ok: true` and the row it wrote; a run that stops earlier is a failed path.
- [ ] A WhatsApp **text** send reaches a number only inside Meta's 24-hour window after the customer last wrote; a reminder or a win-back must be a **template** send (`sends.template`) approved on whatsapp.pucho.ai.

**extract**
```json
{
  "action": "extract",
  "Bill_Photo": "<Bill_Photo>",
  "Centre": "Pune — Baner"
}
```

From a terminal (the app sends the same): `curl -X POST <webhook URL>/sync -H 'Content-Type: application/json' -d @payload.json`


## 7. Hand back
- [ ] Copy the webhook URL from the trigger step and send it to Claude.
- Claude adds `/sync` at the end when the app waits for the flow's answer. Do not add it yourself.
