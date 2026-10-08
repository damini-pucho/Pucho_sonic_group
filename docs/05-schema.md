# 05 — Data schema · Sonic Bills & Income
PostgreSQL, one table per entity (`app/db/schema.sql`, idempotent — apply, then apply again). Column names are the declared names in lower case; the kernel reads every value as a string. The app writes through its DAL; a flow writes through `/api/data/<entity>` with `INBOUND_TOKEN`; Studio reads with `studio_reader` (SELECT on these tables only).

## bills
| column | type |
|---|---|
| Bill_ID | text |
| Uploaded_At | timestamptz |
| Centre | text |
| Centre_Coordinator | text |
| Bill_Photo | text |
| Vendor_Name | text |
| Vendor_GSTIN | text |
| Bill_No | text |
| Bill_Date | date |
| Taxable_Value | numeric |
| GST_Rate | numeric |
| CGST | numeric |
| SGST | numeric |
| IGST | numeric |
| Total_Amount | numeric |
| Narration | text |
| Tally_Ledger | text |
| Expense_Head | text |
| AI_Confidence | numeric |
| Status | text |
| Query_From | text |
| Query_Remarks | text |
| Query_Reply | text |
| Accounts_Remarks | text |
| Exported_At | timestamptz |

id: Bill_ID (B-…) · status: Status ['At Centre', 'With HO', 'With Director', 'With Accounts', 'Query', 'Finalised', 'Exported', 'Cancelled']

## vendor_ledgers
| column | type |
|---|---|
| Map_ID | text |
| Vendor_Name | text |
| Vendor_GSTIN | text |
| City | text |
| Tally_Ledger | text |
| Expense_Head | text |
| Status | text |

id: Map_ID (VL-…) · status: Status ['Active', 'Inactive']

## centres
| column | type |
|---|---|
| Centre_ID | text |
| Centre_Name | text |
| City | text |
| State | text |
| Coordinator | text |
| Phone | text |
| Status | text |

id: Centre_ID (CEN-…) · status: Status ['Active', 'Inactive']

## agreements
| column | type |
|---|---|
| Agreement_ID | text |
| Created_At | timestamptz |
| Tenant_Name | text |
| Tenant_GSTIN | text |
| Tenant_State | text |
| Centre | text |
| Unit | text |
| Agreement_Type | text |
| Start_Date | date |
| End_Date | date |
| Monthly_Amount | numeric |
| GST_Rate | numeric |
| GST_Amount | numeric |
| Monthly_Total | numeric |
| Due_Day | numeric |
| Next_Due_Date | date |
| Tenant_Ledger | text |
| Income_Head | text |
| Invoice_Status | text |
| Status | text |

id: Agreement_ID (AG-…) · status: Status ['Active', 'On Hold', 'Ended']

## sales_invoices
| column | type |
|---|---|
| Invoice_ID | text |
| Prepared_At | timestamptz |
| Agreement_ID | text |
| Tenant_Name | text |
| Tenant_State | text |
| Centre | text |
| Period | text |
| Due_Date | date |
| Taxable_Value | numeric |
| GST_Rate | numeric |
| GST_Amount | numeric |
| Total_Amount | numeric |
| Tenant_Ledger | text |
| Income_Head | text |
| Narration | text |
| Status | text |
| Exported_At | timestamptz |

id: Invoice_ID (SI-…) · status: Status ['Prepared', 'Exported']

## audit_log
| column | type |
|---|---|
| Audit_ID | text |
| At | timestamptz |
| Who | text |
| Flow | text |
| Action | text |
| Entity | text |
| Record_ID | text |
| Summary | text |

id: Audit_ID (AUD-…) · status: — 
