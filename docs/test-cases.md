# Test cases · Sonic Bills & Income
| # | area | step | expected |
|---|---|---|---|
| T1 | BILL_READ.extract | call with the sample payload | result keys Vendor_Name, Vendor_GSTIN, Bill_No, Bill_Date, Taxable_Value, GST_Rate, CGST, SGST, IGST, Total_Amount, Narration, Tally_Ledger, Expense_Head, AI_Confidence; row in bills, audit_log |
| T2 | SALES_INVOICE.raise | call with the sample payload | result keys Invoice_ID; row in sales_invoices, agreements, audit_log |
| U1 | login | each persona signs in | sees only its pages; sign-out works |
| U2 | every page | demo data | KPIs, charts, table, search, export, each modal succeeds with a toast |
| U3 | detail routes | open from an id link | fields, related tables, custom sections |
| U4 | role guard | sales opens /masters | redirected |
| U5 | wired | every WEBHOOK_<FLOW> set, header shows no simulated chip | a create action runs the flow and the row appears within 30 s |
| U6 | sign-in | wrong password / unknown email | the same message; a deactivated person cannot sign in and their open session ends |
