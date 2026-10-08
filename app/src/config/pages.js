// src/config/pages.js — generated from os.yaml pages[]. Do not edit; edit os.yaml.
export const PAGES = [
  {
    "id": "overview",
    "covers": [
      "R6",
      "R8",
      "R9",
      "R15",
      "R20"
    ],
    "kind": "overview",
    "route": "/",
    "label": "Overview",
    "icon": "LayoutDashboard",
    "subtitle": "Bills waiting at each stage, open queries and this month's expected sales",
    "desc": "What needs the Director today, then the month in numbers",
    "greeting": "Here is Sonic Group today.",
    "quick_links": false,
    "queues": [
      {
        "metric": "with_director",
        "action": "approve_dir",
        "action_label": "Approve",
        "sub": "Centre",
        "link": "/director-approvals",
        "entity": "bills",
        "label": "Waiting for Director",
        "tone": "warn",
        "icon": "Stamp",
        "where": "Status=With Director"
      },
      {
        "metric": "open_queries",
        "sub": "Query_From",
        "link": "/bills",
        "entity": "bills",
        "label": "Open queries",
        "tone": "bad",
        "icon": "MessageSquareWarning",
        "where": "Status=Query"
      },
      {
        "metric": "due_tomorrow",
        "sub": "Centre",
        "link": "/income",
        "entity": "agreements",
        "label": "Due tomorrow",
        "tone": "warn",
        "icon": "CalendarClock",
        "where": "Next_Due_Date<=today+1 and Invoice_Status!=Raised and Status=Active"
      }
    ],
    "kpis": [
      {
        "metric": "bills_month",
        "entity": "bills",
        "label": "Bills this month",
        "tone": "auto",
        "icon": "Receipt",
        "formula": "count where Uploaded_At in month and Status!=Cancelled",
        "filter": "Uploaded_At in month and Status!=Cancelled",
        "alert": false
      },
      {
        "metric": "bills_value",
        "entity": "bills",
        "label": "Bill value this month",
        "tone": "auto",
        "icon": "IndianRupee",
        "formula": "sum Total_Amount where Uploaded_At in month and Status!=Cancelled",
        "filter": "Uploaded_At in month and Status!=Cancelled",
        "format": "money",
        "alert": false
      },
      {
        "metric": "open_queries",
        "entity": "bills",
        "label": "Open queries",
        "tone": "bad",
        "icon": "MessageSquareWarning",
        "formula": "count where Status=Query",
        "filter": "Status=Query",
        "alert": true
      },
      {
        "metric": "expected_sales",
        "entity": "agreements",
        "label": "Expected sales / month",
        "tone": "auto",
        "icon": "TrendingUp",
        "formula": "sum Monthly_Total where Status=Active",
        "filter": "Status=Active",
        "format": "money",
        "alert": false
      }
    ],
    "charts": [
      {
        "id": "bills-by-day",
        "type": "trend",
        "entity": "bills",
        "title": "Bills by day",
        "date": "Uploaded_At",
        "days": 30
      },
      {
        "id": "bills-by-vendor",
        "type": "breakdown",
        "entity": "bills",
        "title": "Bill value by vendor",
        "group": "Vendor_Name",
        "sum": "Total_Amount",
        "style": "bar",
        "layout": "horizontal",
        "limit": 8
      }
    ],
    "recent": {
      "entity": "bills",
      "columns": [
        "Bill_ID",
        "Vendor_Name",
        "Centre",
        "Total_Amount",
        "Status"
      ],
      "limit": 6,
      "title": "Latest bills",
      "link": "/bills"
    },
    "modals": [
      {
        "id": "approve_dir",
        "covers": [
          "R6"
        ],
        "kind": "status",
        "title": "Approve bill",
        "entity": "bills",
        "direct": "patch",
        "context": {
          "Status": "With Accounts"
        },
        "summary": [
          "Vendor_Name",
          "Bill_No",
          "Total_Amount",
          "Centre"
        ],
        "submit": "Approve",
        "success": "Approved — sent to Accounts",
        "fields": []
      }
    ],
    "portal": "admin"
  },
  {
    "id": "my_bills",
    "covers": [
      "R1",
      "R2",
      "R4",
      "R11",
      "R19"
    ],
    "route": "/my-bills",
    "label": "My bills",
    "icon": "Camera",
    "subtitle": "Photograph a bill, check what AI read, and answer queries from HO, the Director or Accounts",
    "desc": "The centre's bills — upload, verify, reply",
    "entity": "bills",
    "export": false,
    "blocks": [
      {
        "type": "approvals",
        "covers": [
          "R2",
          "R4",
          "R11"
        ],
        "title": "Needs you",
        "empty": "Nothing waiting — upload a new bill with Upload bill",
        "sources": [
          {
            "entity": "bills",
            "label": "Verify",
            "icon": "ScanLine",
            "where": "Status=At Centre and Centre_Coordinator={{user}}",
            "id": "Bill_ID",
            "title": "Vendor_Name",
            "summary": [
              "Bill_No",
              "Total_Amount",
              "Expense_Head"
            ],
            "date": "Uploaded_At",
            "status": "Status",
            "approve": {
              "direct": "patch",
              "context": {
                "Status": "With HO"
              },
              "button": "Verify & send to HO",
              "title": "Check what AI read",
              "columns": 2,
              "fields": [
                {
                  "key": "Vendor_Name",
                  "label": "Vendor (as on the bill)",
                  "type": "text",
                  "required": true
                },
                {
                  "key": "Vendor_GSTIN",
                  "label": "Vendor GSTIN",
                  "type": "text"
                },
                {
                  "key": "Bill_No",
                  "label": "Bill no",
                  "type": "text",
                  "required": true
                },
                {
                  "key": "Bill_Date",
                  "label": "Bill date",
                  "type": "date",
                  "required": true
                },
                {
                  "key": "Taxable_Value",
                  "label": "Taxable value (₹)",
                  "type": "number",
                  "required": true
                },
                {
                  "key": "GST_Rate",
                  "label": "GST rate (%)",
                  "type": "number"
                },
                {
                  "key": "CGST",
                  "label": "CGST (₹)",
                  "type": "number"
                },
                {
                  "key": "SGST",
                  "label": "SGST (₹)",
                  "type": "number"
                },
                {
                  "key": "IGST",
                  "label": "IGST (₹)",
                  "type": "number"
                },
                {
                  "key": "Total_Amount",
                  "label": "Bill total (₹)",
                  "type": "number",
                  "required": true
                },
                {
                  "key": "Narration",
                  "label": "Narration",
                  "type": "textarea",
                  "rows": 2
                }
              ]
            },
            "reject": {
              "direct": "patch",
              "context": {
                "Status": "Cancelled"
              },
              "button": "Cancel bill",
              "title": "Cancel this bill",
              "summary": [
                "Vendor_Name",
                "Bill_No"
              ],
              "fields": [
                {
                  "key": "Query_Reply",
                  "label": "Why (e.g. photo unclear — re-uploaded)",
                  "type": "textarea",
                  "rows": 2,
                  "required": true
                }
              ]
            }
          },
          {
            "entity": "bills",
            "label": "Query from HO",
            "icon": "MessageSquareWarning",
            "where": "Status=Query and Query_From=HO and Centre_Coordinator={{user}}",
            "id": "Bill_ID",
            "title": "Vendor_Name",
            "summary": [
              "Query_Remarks",
              "Bill_No"
            ],
            "date": "Uploaded_At",
            "status": "Status",
            "approve": {
              "direct": "patch",
              "context": {
                "Status": "With HO"
              },
              "button": "Reply & resend",
              "title": "Reply to HO",
              "summary": [
                "Query_Remarks"
              ],
              "fields": [
                {
                  "key": "Query_Reply",
                  "label": "Your reply / correction",
                  "type": "textarea",
                  "rows": 3,
                  "required": true
                },
                {
                  "key": "Bill_Date",
                  "label": "Bill date",
                  "type": "date"
                },
                {
                  "key": "Total_Amount",
                  "label": "Bill total (₹)",
                  "type": "number"
                }
              ]
            },
            "reject": {
              "direct": "patch",
              "context": {
                "Status": "Cancelled"
              },
              "button": "Cancel bill",
              "title": "Cancel this bill",
              "summary": [
                "Vendor_Name",
                "Bill_No"
              ],
              "fields": [
                {
                  "key": "Query_Reply",
                  "label": "Why",
                  "type": "textarea",
                  "rows": 2,
                  "required": true
                }
              ]
            }
          },
          {
            "entity": "bills",
            "label": "Query from Director",
            "icon": "MessageSquareWarning",
            "where": "Status=Query and Query_From=Director and Centre_Coordinator={{user}}",
            "id": "Bill_ID",
            "title": "Vendor_Name",
            "summary": [
              "Query_Remarks",
              "Bill_No"
            ],
            "date": "Uploaded_At",
            "status": "Status",
            "approve": {
              "direct": "patch",
              "context": {
                "Status": "With Director"
              },
              "button": "Reply & resend",
              "title": "Reply to the Director",
              "summary": [
                "Query_Remarks"
              ],
              "fields": [
                {
                  "key": "Query_Reply",
                  "label": "Your reply / correction",
                  "type": "textarea",
                  "rows": 3,
                  "required": true
                },
                {
                  "key": "Total_Amount",
                  "label": "Bill total (₹)",
                  "type": "number"
                }
              ]
            },
            "reject": {
              "direct": "patch",
              "context": {
                "Status": "Cancelled"
              },
              "button": "Cancel bill",
              "title": "Cancel this bill",
              "summary": [
                "Vendor_Name",
                "Bill_No"
              ],
              "fields": [
                {
                  "key": "Query_Reply",
                  "label": "Why",
                  "type": "textarea",
                  "rows": 2,
                  "required": true
                }
              ]
            }
          },
          {
            "entity": "bills",
            "label": "Query from Accounts",
            "icon": "MessageSquareWarning",
            "where": "Status=Query and Query_From=Accounts and Centre_Coordinator={{user}}",
            "id": "Bill_ID",
            "title": "Vendor_Name",
            "summary": [
              "Query_Remarks",
              "Bill_No"
            ],
            "date": "Uploaded_At",
            "status": "Status",
            "approve": {
              "direct": "patch",
              "context": {
                "Status": "With Accounts"
              },
              "button": "Reply & resend",
              "title": "Reply to Accounts",
              "summary": [
                "Query_Remarks"
              ],
              "fields": [
                {
                  "key": "Query_Reply",
                  "label": "Your reply / correction",
                  "type": "textarea",
                  "rows": 3,
                  "required": true
                },
                {
                  "key": "Vendor_GSTIN",
                  "label": "Vendor GSTIN",
                  "type": "text"
                },
                {
                  "key": "Total_Amount",
                  "label": "Bill total (₹)",
                  "type": "number"
                }
              ]
            },
            "reject": {
              "direct": "patch",
              "context": {
                "Status": "Cancelled"
              },
              "button": "Cancel bill",
              "title": "Cancel this bill",
              "summary": [
                "Vendor_Name",
                "Bill_No"
              ],
              "fields": [
                {
                  "key": "Query_Reply",
                  "label": "Why",
                  "type": "textarea",
                  "rows": 2,
                  "required": true
                }
              ]
            }
          }
        ],
        "id": "my_bills-approvals"
      },
      {
        "type": "table",
        "covers": [
          "R19"
        ],
        "label": "All my bills",
        "where": "Centre_Coordinator={{user}}",
        "segments": {
          "column": "Status",
          "all": "All"
        },
        "period": {
          "column": "Uploaded_At",
          "presets": [
            "today",
            "7d",
            "30d",
            "all"
          ],
          "default": "all"
        },
        "view": "cards",
        "views": [
          "cards",
          "table"
        ],
        "columns": [
          {
            "key": "Vendor_Name",
            "header": "Vendor",
            "type": "text",
            "sub": "Bill_No"
          },
          {
            "key": "Bill_Date",
            "header": "Bill date",
            "type": "date"
          },
          {
            "key": "Total_Amount",
            "header": "Total",
            "type": "money"
          },
          {
            "key": "Status",
            "type": "badge"
          },
          {
            "key": "Bill_ID",
            "type": "id",
            "priority": "low"
          }
        ],
        "search": [
          "Vendor_Name",
          "Bill_No",
          "Bill_ID"
        ],
        "card": {
          "title": "Vendor_Name",
          "subtitle": [
            "Bill_No",
            "Bill_Date"
          ],
          "badge": "Status",
          "fields": [
            {
              "key": "Total_Amount",
              "label": "Total",
              "icon": "IndianRupee"
            },
            {
              "key": "Expense_Head",
              "label": "Head",
              "icon": "Tag"
            }
          ],
          "callout": {
            "column": "Query_Remarks",
            "label": "Query",
            "tone": "warn"
          }
        },
        "drawer": {
          "title_column": "Vendor_Name",
          "sections": [
            {
              "type": "tiles",
              "title": "Bill",
              "columns": [
                "Bill_No",
                "Bill_Date",
                "Centre",
                "Status"
              ]
            },
            {
              "type": "tiles",
              "title": "Amounts",
              "columns": [
                "Taxable_Value",
                "GST_Rate",
                "CGST",
                "SGST",
                "IGST",
                "Total_Amount"
              ]
            },
            {
              "type": "callout",
              "column": "Narration",
              "title": "Narration",
              "tone": "neutral"
            },
            {
              "type": "callout",
              "column": "Query_Remarks",
              "title": "Query",
              "tone": "warn"
            },
            {
              "type": "callout",
              "column": "Query_Reply",
              "title": "Your reply",
              "tone": "info"
            },
            {
              "type": "fields",
              "title": "Photo",
              "columns": [
                "Bill_Photo"
              ]
            }
          ]
        },
        "empty": {
          "title": "No bills yet",
          "reason": "Bills you upload from this phone appear here and move to HO once you verify them.",
          "action": "upload_bill"
        },
        "actions": {
          "header": [
            "upload_bill"
          ]
        },
        "id": "my_bills-table"
      }
    ],
    "modals": [
      {
        "id": "upload_bill",
        "covers": [
          "R1",
          "R2"
        ],
        "kind": "create",
        "primary": true,
        "title": "Upload bill",
        "intro": "Take a clear photo of the whole bill. AI reads the vendor, GST and narration — you check it next.",
        "flow": "BILL_READ",
        "action": "extract",
        "submit": "Read the bill",
        "success": "Bill read — check it under Needs you",
        "fields": [
          {
            "key": "Bill_Photo",
            "label": "Bill photo",
            "type": "file",
            "accept": "image/*,application/pdf",
            "required": true
          },
          {
            "key": "Centre",
            "label": "Centre",
            "type": "select",
            "options_from": "centres.Centre_Name",
            "required": true
          }
        ]
      }
    ],
    "portal": "admin"
  },
  {
    "id": "ho_approvals",
    "covers": [
      "R5",
      "R10"
    ],
    "route": "/ho-approvals",
    "label": "HO approvals",
    "icon": "Building2",
    "subtitle": "Bills every centre has verified — approve, or raise a query with remarks",
    "desc": "The HO Coordinator's stage",
    "entity": "bills",
    "badge": {
      "entity": "bills",
      "where": "Status=With HO"
    },
    "blocks": [
      {
        "type": "approvals",
        "title": "Waiting with HO",
        "empty": "No bill is waiting with HO",
        "sources": [
          {
            "entity": "bills",
            "label": "Bill",
            "icon": "Receipt",
            "where": "Status=With HO",
            "id": "Bill_ID",
            "title": "Vendor_Name",
            "summary": [
              "Centre",
              "Bill_No",
              "Total_Amount",
              "Expense_Head"
            ],
            "date": "Uploaded_At",
            "status": "Status",
            "approve": {
              "direct": "patch",
              "context": {
                "Status": "With Director"
              },
              "button": "Approve",
              "title": "Approve — send to the Director",
              "summary": [
                "Vendor_Name",
                "Bill_No",
                "Total_Amount",
                "Narration"
              ],
              "fields": []
            },
            "reject": {
              "direct": "patch",
              "context": {
                "Status": "Query",
                "Query_From": "HO"
              },
              "button": "Raise query",
              "title": "Raise a query to the centre",
              "summary": [
                "Vendor_Name",
                "Bill_No",
                "Centre"
              ],
              "fields": [
                {
                  "key": "Query_Remarks",
                  "label": "What is wrong with this bill",
                  "type": "textarea",
                  "rows": 3,
                  "required": true
                }
              ]
            }
          }
        ],
        "id": "ho_approvals-approvals"
      }
    ],
    "portal": "admin"
  },
  {
    "id": "director_approvals",
    "covers": [
      "R6"
    ],
    "route": "/director-approvals",
    "label": "Approvals",
    "icon": "Stamp",
    "subtitle": "Bills HO has approved — check and approve online, or raise a query",
    "desc": "The Director's stage",
    "entity": "bills",
    "badge": {
      "entity": "bills",
      "where": "Status=With Director"
    },
    "blocks": [
      {
        "type": "approvals",
        "title": "Waiting for the Director",
        "layout": "cards",
        "empty": "Nothing waits for the Director",
        "sources": [
          {
            "entity": "bills",
            "label": "Bill",
            "icon": "Receipt",
            "where": "Status=With Director",
            "id": "Bill_ID",
            "title": "Vendor_Name",
            "status": "Status",
            "meta": [
              {
                "icon": "MapPin",
                "label": "Centre",
                "column": "Centre"
              },
              {
                "icon": "Hash",
                "label": "Bill no",
                "column": "Bill_No"
              },
              {
                "icon": "IndianRupee",
                "label": "Total",
                "column": "Total_Amount"
              },
              {
                "icon": "Tag",
                "label": "Head",
                "column": "Expense_Head"
              },
              {
                "icon": "FileText",
                "label": "Narration",
                "column": "Narration"
              }
            ],
            "approve": {
              "direct": "patch",
              "context": {
                "Status": "With Accounts"
              },
              "button": "Approve",
              "title": "Approve — send to Accounts",
              "summary": [
                "Vendor_Name",
                "Bill_No",
                "Total_Amount"
              ],
              "fields": []
            },
            "reject": {
              "direct": "patch",
              "context": {
                "Status": "Query",
                "Query_From": "Director"
              },
              "button": "Raise query",
              "title": "Raise a query to the centre",
              "summary": [
                "Vendor_Name",
                "Bill_No",
                "Centre"
              ],
              "fields": [
                {
                  "key": "Query_Remarks",
                  "label": "Remarks",
                  "type": "textarea",
                  "rows": 3,
                  "required": true
                }
              ]
            }
          }
        ],
        "id": "director_approvals-approvals"
      }
    ],
    "portal": "admin"
  },
  {
    "id": "accounts_approvals",
    "covers": [
      "R3",
      "R7",
      "R13",
      "R18"
    ],
    "route": "/accounts",
    "label": "Finalise bills",
    "icon": "Calculator",
    "subtitle": "Bills the Director approved — confirm the Tally ledger and expense head, then finalise",
    "desc": "The Accounts stage",
    "entity": "bills",
    "badge": {
      "entity": "bills",
      "where": "Status=With Accounts"
    },
    "blocks": [
      {
        "type": "approvals",
        "title": "Waiting with Accounts",
        "empty": "Nothing to finalise",
        "sources": [
          {
            "entity": "bills",
            "label": "Bill",
            "icon": "Receipt",
            "where": "Status=With Accounts",
            "id": "Bill_ID",
            "title": "Vendor_Name",
            "summary": [
              "Tally_Ledger",
              "Expense_Head",
              "Total_Amount"
            ],
            "date": "Uploaded_At",
            "status": "Status",
            "approve": {
              "direct": "patch",
              "context": {
                "Status": "Finalised"
              },
              "button": "Finalise",
              "title": "Finalise for Tally",
              "summary": [
                "Vendor_Name",
                "Vendor_GSTIN",
                "Bill_No",
                "Taxable_Value",
                "CGST",
                "SGST",
                "IGST",
                "Total_Amount"
              ],
              "columns": 2,
              "fields": [
                {
                  "key": "Tally_Ledger",
                  "label": "Tally ledger (vendor)",
                  "type": "select",
                  "options_from": "vendor_ledgers.Tally_Ledger",
                  "required": true
                },
                {
                  "key": "Expense_Head",
                  "label": "Expense head",
                  "type": "select",
                  "options_from": "vendor_ledgers.Expense_Head",
                  "required": true
                },
                {
                  "key": "Accounts_Remarks",
                  "label": "Remarks",
                  "type": "textarea",
                  "rows": 2
                }
              ]
            },
            "reject": {
              "direct": "patch",
              "context": {
                "Status": "Query",
                "Query_From": "Accounts"
              },
              "button": "Raise query",
              "title": "Raise a query to the centre",
              "summary": [
                "Vendor_Name",
                "Bill_No",
                "Centre"
              ],
              "fields": [
                {
                  "key": "Query_Remarks",
                  "label": "Remarks",
                  "type": "textarea",
                  "rows": 3,
                  "required": true
                }
              ]
            }
          }
        ],
        "id": "accounts_approvals-approvals"
      }
    ],
    "portal": "admin"
  },
  {
    "id": "tally_export",
    "covers": [
      "R12",
      "R13",
      "R17"
    ],
    "route": "/tally-export",
    "label": "Tally export",
    "icon": "FileDown",
    "subtitle": "One click builds the Tally Prime import XML for every finalised bill and prepared sales invoice",
    "desc": "Purchase vouchers and sales vouchers for Tally Prime (Gateway → Import → Vouchers)",
    "entity": "bills",
    "badge": {
      "entity": "bills",
      "where": "Status=Finalised"
    },
    "blocks": [
      {
        "type": "kpis",
        "kpis": [
          {
            "metric": "ready_tally",
            "entity": "bills",
            "label": "Bills ready for Tally",
            "tone": "ok",
            "icon": "FileDown",
            "formula": "count where Status=Finalised",
            "filter": "Status=Finalised",
            "alert": false
          },
          {
            "metric": "invoices_ready",
            "entity": "sales_invoices",
            "label": "Sales invoices ready",
            "tone": "ok",
            "icon": "FileDown",
            "formula": "count where Status=Prepared",
            "filter": "Status=Prepared",
            "alert": false
          },
          {
            "metric": "exported_month",
            "entity": "bills",
            "label": "Exported this month",
            "tone": "ok",
            "icon": "CheckCircle2",
            "formula": "count where Status=Exported and Exported_At in month",
            "filter": "Status=Exported and Exported_At in month",
            "alert": false
          }
        ],
        "id": "tally_export-kpis"
      },
      {
        "type": "custom",
        "name": "TallyExport",
        "covers": [
          "R12",
          "R13",
          "R17"
        ],
        "id": "tally_export-custom"
      },
      {
        "type": "tabs",
        "tabs": [
          {
            "label": "Bills ready",
            "blocks": [
              {
                "type": "table",
                "where": "Status=Finalised",
                "columns": [
                  {
                    "key": "Vendor_Name",
                    "header": "Vendor",
                    "type": "text",
                    "sub": "Bill_No"
                  },
                  {
                    "key": "Tally_Ledger",
                    "header": "Tally ledger",
                    "type": "text"
                  },
                  {
                    "key": "Expense_Head",
                    "header": "Head",
                    "type": "tag"
                  },
                  {
                    "key": "Taxable_Value",
                    "header": "Taxable",
                    "type": "money"
                  },
                  {
                    "key": "Total_Amount",
                    "header": "Total",
                    "type": "money"
                  },
                  {
                    "key": "Centre",
                    "priority": "low"
                  }
                ],
                "search": [
                  "Vendor_Name",
                  "Bill_No",
                  "Tally_Ledger"
                ],
                "actions": {
                  "row": [
                    "mark_bill_exported"
                  ]
                }
              }
            ]
          },
          {
            "label": "Sales invoices ready",
            "blocks": [
              {
                "type": "table",
                "entity": "sales_invoices",
                "where": "Status=Prepared",
                "columns": [
                  {
                    "key": "Tenant_Name",
                    "header": "Tenant",
                    "type": "text",
                    "sub": "Period"
                  },
                  {
                    "key": "Income_Head",
                    "header": "Head",
                    "type": "tag"
                  },
                  {
                    "key": "Due_Date",
                    "header": "Due",
                    "type": "due"
                  },
                  {
                    "key": "Taxable_Value",
                    "header": "Taxable",
                    "type": "money"
                  },
                  {
                    "key": "Total_Amount",
                    "header": "Total",
                    "type": "money"
                  },
                  {
                    "key": "Centre",
                    "priority": "low"
                  }
                ],
                "search": [
                  "Tenant_Name",
                  "Invoice_ID"
                ],
                "actions": {
                  "row": [
                    "mark_invoice_exported"
                  ]
                }
              }
            ]
          },
          {
            "label": "Exported",
            "blocks": [
              {
                "type": "table",
                "where": "Status=Exported",
                "period": {
                  "column": "Exported_At",
                  "presets": [
                    "7d",
                    "30d",
                    "month",
                    "all"
                  ],
                  "default": "30d"
                },
                "columns": [
                  {
                    "key": "Vendor_Name",
                    "header": "Vendor",
                    "type": "text",
                    "sub": "Bill_No"
                  },
                  {
                    "key": "Tally_Ledger",
                    "header": "Tally ledger",
                    "type": "text"
                  },
                  {
                    "key": "Total_Amount",
                    "header": "Total",
                    "type": "money"
                  },
                  {
                    "key": "Exported_At",
                    "header": "Exported",
                    "type": "date"
                  }
                ],
                "search": [
                  "Vendor_Name",
                  "Bill_No"
                ]
              }
            ]
          }
        ],
        "id": "tally_export-tabs"
      }
    ],
    "modals": [
      {
        "id": "mark_bill_exported",
        "kind": "status",
        "title": "Mark as imported in Tally",
        "entity": "bills",
        "direct": "patch",
        "context": {
          "Status": "Exported"
        },
        "summary": [
          "Vendor_Name",
          "Bill_No",
          "Total_Amount"
        ],
        "submit": "Mark exported",
        "success": "Marked as exported",
        "fields": [
          {
            "key": "Exported_At",
            "label": "Exported on",
            "type": "date",
            "default": "today",
            "required": true
          }
        ]
      },
      {
        "id": "mark_invoice_exported",
        "kind": "status",
        "title": "Mark as imported in Tally",
        "entity": "sales_invoices",
        "direct": "patch",
        "context": {
          "Status": "Exported"
        },
        "summary": [
          "Tenant_Name",
          "Period",
          "Total_Amount"
        ],
        "submit": "Mark exported",
        "success": "Marked as exported",
        "fields": [
          {
            "key": "Exported_At",
            "label": "Exported on",
            "type": "date",
            "default": "today",
            "required": true
          }
        ]
      }
    ],
    "portal": "admin"
  },
  {
    "id": "bills",
    "covers": [
      "R8",
      "R9",
      "R10",
      "R19"
    ],
    "route": "/bills",
    "label": "All bills",
    "icon": "Receipt",
    "subtitle": "Every bill from every centre — pick a day, a vendor or a centre",
    "desc": "The register of every expense bill since the start",
    "entity": "bills",
    "read_only": "Bills move through the stage pages (HO approvals, Approvals, Finalise bills); this register is for finding bills by day, vendor and centre",
    "blocks": [
      {
        "type": "kpis",
        "kpis": [
          {
            "metric": "bills_today",
            "entity": "bills",
            "label": "Bills today",
            "tone": "auto",
            "icon": "Receipt",
            "formula": "count where Uploaded_At=today",
            "filter": "Uploaded_At=today",
            "alert": false
          },
          {
            "metric": "bills_month",
            "entity": "bills",
            "label": "Bills this month",
            "tone": "auto",
            "icon": "Receipt",
            "formula": "count where Uploaded_At in month and Status!=Cancelled",
            "filter": "Uploaded_At in month and Status!=Cancelled",
            "alert": false
          },
          {
            "metric": "bills_value",
            "entity": "bills",
            "label": "Bill value this month",
            "tone": "auto",
            "icon": "IndianRupee",
            "formula": "sum Total_Amount where Uploaded_At in month and Status!=Cancelled",
            "filter": "Uploaded_At in month and Status!=Cancelled",
            "format": "money",
            "alert": false
          },
          {
            "metric": "open_queries",
            "entity": "bills",
            "label": "Open queries",
            "tone": "bad",
            "icon": "MessageSquareWarning",
            "formula": "count where Status=Query",
            "filter": "Status=Query",
            "alert": true
          }
        ],
        "id": "bills-kpis"
      },
      {
        "type": "table",
        "covers": [
          "R8",
          "R9"
        ],
        "segments": {
          "column": "Status",
          "all": "All bills"
        },
        "period": {
          "column": "Uploaded_At",
          "presets": [
            "today",
            "yesterday",
            "7d",
            "30d",
            "month",
            "all"
          ],
          "default": "all"
        },
        "views": [
          "table",
          "grouped",
          "cards"
        ],
        "group": {
          "by": "Vendor_Name",
          "label": "{v}",
          "collapsible": true,
          "summary": [
            {
              "label": "Bills",
              "count": true
            },
            {
              "label": "Value",
              "sum": "Total_Amount"
            }
          ]
        },
        "columns": [
          {
            "key": "Vendor_Name",
            "header": "Vendor",
            "type": "text",
            "sub": "Bill_No"
          },
          {
            "key": "Centre",
            "type": "tag"
          },
          {
            "key": "Bill_Date",
            "header": "Bill date",
            "type": "date"
          },
          {
            "key": "Total_Amount",
            "header": "Total",
            "type": "money"
          },
          {
            "key": "Expense_Head",
            "header": "Head",
            "type": "text"
          },
          {
            "key": "Status",
            "type": "badge"
          },
          {
            "key": "Uploaded_At",
            "header": "Uploaded",
            "type": "date"
          },
          {
            "key": "Bill_ID",
            "type": "id",
            "priority": "low"
          }
        ],
        "search": [
          "Vendor_Name",
          "Bill_No",
          "Bill_ID",
          "Narration"
        ],
        "filters": [
          "Vendor_Name",
          "Centre",
          "Expense_Head"
        ],
        "card": {
          "title": "Vendor_Name",
          "subtitle": [
            "Centre",
            "Bill_No"
          ],
          "badge": "Status",
          "fields": [
            {
              "key": "Total_Amount",
              "label": "Total",
              "icon": "IndianRupee"
            },
            {
              "key": "Bill_Date",
              "label": "Bill date",
              "icon": "Calendar"
            }
          ],
          "callout": {
            "column": "Query_Remarks",
            "label": "Query",
            "tone": "warn"
          }
        },
        "drawer": {
          "title_column": "Vendor_Name",
          "tabs": [
            {
              "label": "Bill",
              "sections": [
                {
                  "type": "tiles",
                  "title": "Bill",
                  "columns": [
                    "Bill_No",
                    "Bill_Date",
                    "Centre",
                    "Centre_Coordinator"
                  ]
                },
                {
                  "type": "tiles",
                  "title": "GST",
                  "columns": [
                    "Taxable_Value",
                    "GST_Rate",
                    "CGST",
                    "SGST",
                    "IGST",
                    "Total_Amount"
                  ]
                },
                {
                  "type": "callout",
                  "column": "Narration",
                  "title": "Narration",
                  "tone": "neutral"
                },
                {
                  "type": "callout",
                  "column": "Query_Remarks",
                  "title": "Query",
                  "tone": "warn"
                },
                {
                  "type": "callout",
                  "column": "Query_Reply",
                  "title": "Centre's reply",
                  "tone": "info"
                },
                {
                  "type": "fields",
                  "title": "Photo",
                  "columns": [
                    "Bill_Photo"
                  ]
                }
              ]
            },
            {
              "label": "Tally",
              "sections": [
                {
                  "type": "tiles",
                  "title": "Tally entry",
                  "columns": [
                    "Tally_Ledger",
                    "Expense_Head",
                    "Vendor_GSTIN",
                    "AI_Confidence"
                  ]
                },
                {
                  "type": "callout",
                  "column": "Accounts_Remarks",
                  "title": "Accounts remarks",
                  "tone": "neutral"
                }
              ]
            },
            {
              "label": "Approval trail",
              "sections": [
                {
                  "type": "timeline",
                  "title": "Who did what",
                  "entity": "audit_log",
                  "match": {
                    "column": "Record_ID",
                    "equals": "Bill_ID"
                  },
                  "date": "At",
                  "actor": "Who",
                  "title_column": "Action",
                  "body": "Summary",
                  "empty": "No change recorded yet"
                }
              ]
            }
          ]
        },
        "id": "bills-table"
      }
    ],
    "portal": "admin"
  },
  {
    "id": "income",
    "covers": [
      "R14",
      "R15",
      "R16"
    ],
    "route": "/income",
    "label": "Agreements & sales",
    "icon": "FileSignature",
    "subtitle": "Expected sales from every agreement, and the invoices due tomorrow",
    "desc": "Agreements, expected sales and sales invoices",
    "entity": "agreements",
    "badge": {
      "entity": "agreements",
      "where": "Next_Due_Date<=today+1 and Invoice_Status!=Raised and Status=Active"
    },
    "blocks": [
      {
        "type": "kpis",
        "kpis": [
          {
            "metric": "expected_sales",
            "entity": "agreements",
            "label": "Expected sales / month",
            "tone": "auto",
            "icon": "TrendingUp",
            "formula": "sum Monthly_Total where Status=Active",
            "filter": "Status=Active",
            "format": "money",
            "alert": false
          },
          {
            "metric": "active_agreements",
            "entity": "agreements",
            "label": "Active agreements",
            "tone": "auto",
            "icon": "FileSignature",
            "formula": "count where Status=Active",
            "filter": "Status=Active",
            "alert": false
          },
          {
            "metric": "due_tomorrow",
            "entity": "agreements",
            "label": "Due tomorrow",
            "tone": "warn",
            "icon": "CalendarClock",
            "formula": "count where Next_Due_Date<=today+1 and Invoice_Status!=Raised and Status=Active",
            "filter": "Next_Due_Date<=today+1 and Invoice_Status!=Raised and Status=Active",
            "alert": true
          },
          {
            "metric": "ending_soon",
            "entity": "agreements",
            "label": "Ending in 60 days",
            "tone": "warn",
            "icon": "CalendarX",
            "formula": "count where End_Date<=today+60 and End_Date>=today and Status=Active",
            "filter": "End_Date<=today+60 and End_Date>=today and Status=Active",
            "alert": true
          }
        ],
        "id": "income-kpis"
      },
      {
        "type": "queue",
        "covers": [
          "R16"
        ],
        "entity": "agreements",
        "groups": [
          {
            "metric": "due_tomorrow",
            "action": "raise_invoice",
            "action_label": "Raise invoice",
            "entity": "agreements",
            "label": "Due tomorrow",
            "tone": "warn",
            "icon": "CalendarClock",
            "where": "Next_Due_Date<=today+1 and Invoice_Status!=Raised and Status=Active"
          }
        ],
        "empty": "No sales invoice is due tomorrow",
        "id": "income-queue"
      },
      {
        "type": "tabs",
        "tabs": [
          {
            "label": "Agreements",
            "blocks": [
              {
                "type": "table",
                "covers": [
                  "R14",
                  "R15"
                ],
                "segments": {
                  "column": "Status",
                  "all": "All"
                },
                "columns": [
                  {
                    "key": "Tenant_Name",
                    "header": "Tenant",
                    "type": "text",
                    "sub": "Unit"
                  },
                  {
                    "key": "Centre",
                    "type": "tag"
                  },
                  {
                    "key": "Agreement_Type",
                    "header": "Type",
                    "type": "tag"
                  },
                  {
                    "key": "Monthly_Total",
                    "header": "Monthly (incl. GST)",
                    "type": "money"
                  },
                  {
                    "key": "Next_Due_Date",
                    "header": "Next due",
                    "type": "due"
                  },
                  {
                    "key": "End_Date",
                    "header": "Ends",
                    "type": "date"
                  },
                  {
                    "key": "Status",
                    "type": "badge"
                  },
                  {
                    "key": "Agreement_ID",
                    "type": "id",
                    "priority": "low"
                  }
                ],
                "search": [
                  "Tenant_Name",
                  "Agreement_ID",
                  "Centre"
                ],
                "filters": [
                  "Centre",
                  "Agreement_Type"
                ],
                "drawer": {
                  "title_column": "Tenant_Name",
                  "sections": [
                    {
                      "type": "tiles",
                      "title": "Agreement",
                      "columns": [
                        "Agreement_Type",
                        "Centre",
                        "Unit",
                        "Start_Date",
                        "End_Date",
                        "Due_Day"
                      ]
                    },
                    {
                      "type": "tiles",
                      "title": "Monthly",
                      "columns": [
                        "Monthly_Amount",
                        "GST_Rate",
                        "GST_Type",
                        "GST_Amount",
                        "Monthly_Total"
                      ]
                    },
                    {
                      "type": "tiles",
                      "title": "Tally",
                      "columns": [
                        "Tenant_Ledger",
                        "Income_Head",
                        "Tenant_GSTIN",
                        "Tenant_State"
                      ]
                    },
                    {
                      "type": "list",
                      "title": "Invoices raised",
                      "entity": "sales_invoices",
                      "match": {
                        "column": "Agreement_ID",
                        "equals": "Agreement_ID"
                      },
                      "label": "Period",
                      "value": "Total_Amount",
                      "limit": 6,
                      "empty": "No invoice yet"
                    }
                  ]
                },
                "actions": {
                  "header": [
                    "add_agreement"
                  ],
                  "row": [
                    "raise_invoice",
                    "edit_agreement"
                  ]
                }
              }
            ]
          },
          {
            "label": "Sales invoices",
            "blocks": [
              {
                "type": "table",
                "entity": "sales_invoices",
                "segments": {
                  "column": "Status",
                  "all": "All"
                },
                "columns": [
                  {
                    "key": "Tenant_Name",
                    "header": "Tenant",
                    "type": "text",
                    "sub": "Period"
                  },
                  {
                    "key": "Centre",
                    "type": "tag"
                  },
                  {
                    "key": "Due_Date",
                    "header": "Due",
                    "type": "date"
                  },
                  {
                    "key": "Total_Amount",
                    "header": "Total",
                    "type": "money"
                  },
                  {
                    "key": "Status",
                    "type": "badge"
                  },
                  {
                    "key": "Invoice_ID",
                    "type": "id",
                    "priority": "low"
                  }
                ],
                "search": [
                  "Tenant_Name",
                  "Invoice_ID"
                ]
              }
            ]
          }
        ],
        "id": "income-tabs"
      },
      {
        "type": "charts",
        "charts": [
          {
            "id": "expected-by-centre",
            "type": "breakdown",
            "entity": "agreements",
            "title": "Expected sales by centre",
            "group": "Centre",
            "sum": "Monthly_Total",
            "where": "Status=Active",
            "style": "bar"
          }
        ],
        "id": "income-charts"
      }
    ],
    "modals": [
      {
        "id": "raise_invoice",
        "covers": [
          "R16"
        ],
        "kind": "custom",
        "primary": true,
        "title": "Raise sales invoice",
        "flow": "SALES_INVOICE",
        "action": "raise",
        "entity": "agreements",
        "pass": [
          "Agreement_ID",
          "Tenant_Name",
          "Tenant_State",
          "Centre",
          "Unit",
          "Next_Due_Date",
          "Monthly_Amount",
          "GST_Rate",
          "GST_Type",
          "GST_Amount",
          "Monthly_Total",
          "Tenant_Ledger",
          "Income_Head"
        ],
        "summary": [
          "Tenant_Name",
          "Centre",
          "Next_Due_Date",
          "Monthly_Total"
        ],
        "submit": "Raise invoice",
        "success": "Sales invoice prepared — it is on Tally export",
        "fields": []
      },
      {
        "id": "add_agreement",
        "covers": [
          "R14"
        ],
        "kind": "create",
        "title": "Add agreement",
        "entity": "agreements",
        "direct": "insert",
        "context": {
          "Invoice_Status": "Upcoming",
          "Status": "Active"
        },
        "columns": 2,
        "submit": "Save agreement",
        "success": "Agreement saved",
        "fields": [
          {
            "key": "Tenant_Name",
            "label": "Tenant",
            "type": "text",
            "required": true
          },
          {
            "key": "Tenant_GSTIN",
            "label": "Tenant GSTIN",
            "type": "text"
          },
          {
            "key": "Tenant_State",
            "label": "Tenant state",
            "type": "text",
            "required": true
          },
          {
            "key": "Centre",
            "label": "Centre",
            "type": "select",
            "options_from": "centres.Centre_Name",
            "required": true
          },
          {
            "key": "Unit",
            "label": "Unit / space",
            "type": "text",
            "required": true
          },
          {
            "key": "Agreement_Type",
            "label": "Type",
            "type": "select",
            "options": [
              "Rent",
              "Fit-out",
              "Rent + Fit-out"
            ],
            "required": true
          },
          {
            "key": "Start_Date",
            "label": "Start date",
            "type": "date",
            "required": true
          },
          {
            "key": "End_Date",
            "label": "End date",
            "type": "date",
            "required": true
          },
          {
            "key": "Monthly_Amount",
            "label": "Monthly amount before GST (₹)",
            "type": "number",
            "required": true
          },
          {
            "key": "GST_Rate",
            "label": "GST rate (%)",
            "type": "number",
            "default": "18"
          },
          {
            "key": "GST_Type",
            "label": "GST type",
            "type": "select",
            "options": [
              "CGST + SGST",
              "IGST"
            ],
            "default": "CGST + SGST",
            "required": true
          },
          {
            "key": "GST_Amount",
            "label": "GST amount (₹)",
            "type": "number",
            "required": true
          },
          {
            "key": "Monthly_Total",
            "label": "Monthly total incl. GST (₹)",
            "type": "number",
            "required": true
          },
          {
            "key": "Due_Day",
            "label": "Due day of the month",
            "type": "number",
            "required": true
          },
          {
            "key": "Next_Due_Date",
            "label": "Next due date",
            "type": "date",
            "required": true
          },
          {
            "key": "Tenant_Ledger",
            "label": "Tally ledger (tenant)",
            "type": "text",
            "required": true
          },
          {
            "key": "Income_Head",
            "label": "Income head",
            "type": "select",
            "options": [
              "Rent Income",
              "Fit-out Income"
            ],
            "required": true
          }
        ]
      },
      {
        "id": "edit_agreement",
        "kind": "edit",
        "title": "Edit agreement",
        "entity": "agreements",
        "direct": "patch",
        "columns": 2,
        "fields": [
          {
            "key": "Monthly_Amount",
            "label": "Monthly amount before GST (₹)",
            "type": "number"
          },
          {
            "key": "GST_Amount",
            "label": "GST amount (₹)",
            "type": "number"
          },
          {
            "key": "Monthly_Total",
            "label": "Monthly total incl. GST (₹)",
            "type": "number"
          },
          {
            "key": "Next_Due_Date",
            "label": "Next due date",
            "type": "date"
          },
          {
            "key": "End_Date",
            "label": "End date",
            "type": "date"
          },
          {
            "key": "Invoice_Status",
            "label": "Invoice for this cycle",
            "type": "select",
            "options": [
              "Upcoming",
              "Raised"
            ]
          },
          {
            "key": "Status",
            "label": "Status",
            "type": "select",
            "options_status": true
          }
        ]
      }
    ],
    "portal": "admin"
  },
  {
    "id": "vendors",
    "covers": [
      "R3",
      "R18"
    ],
    "route": "/vendors",
    "label": "Vendor ledgers",
    "group": "Setup",
    "icon": "Link2",
    "subtitle": "Which vendor's bill goes to which Tally ledger and expense head",
    "desc": "The vendor → Tally ledger → expense head mapping Mugdha provides",
    "entity": "vendor_ledgers",
    "blocks": [
      {
        "type": "table",
        "segments": {
          "column": "Status",
          "all": "All"
        },
        "columns": [
          {
            "key": "Vendor_Name",
            "header": "Vendor on the bill",
            "type": "text",
            "sub": "City"
          },
          {
            "key": "Tally_Ledger",
            "header": "Tally ledger",
            "type": "text"
          },
          {
            "key": "Expense_Head",
            "header": "Expense head",
            "type": "tag"
          },
          {
            "key": "Vendor_GSTIN",
            "header": "GSTIN",
            "type": "text"
          },
          {
            "key": "Status",
            "type": "badge"
          },
          {
            "key": "Map_ID",
            "type": "id",
            "priority": "low"
          }
        ],
        "search": [
          "Vendor_Name",
          "Tally_Ledger",
          "Vendor_GSTIN"
        ],
        "filters": [
          "Expense_Head",
          "City"
        ],
        "drawer": {
          "title_column": "Vendor_Name",
          "sections": [
            {
              "type": "tiles",
              "title": "Mapping",
              "columns": [
                "Tally_Ledger",
                "Expense_Head",
                "Vendor_GSTIN",
                "City"
              ]
            },
            {
              "type": "list",
              "title": "Bills from this vendor",
              "entity": "bills",
              "match": {
                "column": "Vendor_Name",
                "equals": "Vendor_Name"
              },
              "label": "Bill_No",
              "value": "Total_Amount",
              "limit": 6,
              "empty": "No bill yet"
            }
          ]
        },
        "empty": {
          "title": "No vendor mapped yet",
          "reason": "Add each vendor once with its Tally ledger name and expense head — AI uses this list to fill new bills.",
          "action": "add_vendor"
        },
        "actions": {
          "header": [
            "add_vendor"
          ],
          "row": [
            "edit_vendor"
          ]
        },
        "id": "vendors-table"
      }
    ],
    "modals": [
      {
        "id": "add_vendor",
        "covers": [
          "R18"
        ],
        "kind": "create",
        "title": "Add vendor ledger",
        "direct": "insert",
        "context": {
          "Status": "Active"
        },
        "columns": 2,
        "submit": "Save",
        "success": "Vendor mapped",
        "fields": [
          {
            "key": "Vendor_Name",
            "label": "Vendor name (as on the bill)",
            "type": "text",
            "required": true
          },
          {
            "key": "Vendor_GSTIN",
            "label": "Vendor GSTIN",
            "type": "text"
          },
          {
            "key": "City",
            "label": "City",
            "type": "text"
          },
          {
            "key": "Tally_Ledger",
            "label": "Tally ledger name",
            "type": "text",
            "required": true
          },
          {
            "key": "Expense_Head",
            "label": "Expense head",
            "type": "text",
            "required": true
          }
        ]
      },
      {
        "id": "edit_vendor",
        "kind": "edit",
        "title": "Edit vendor ledger",
        "direct": "patch",
        "columns": 2,
        "fields": [
          {
            "key": "Tally_Ledger",
            "label": "Tally ledger name",
            "type": "text",
            "required": true
          },
          {
            "key": "Expense_Head",
            "label": "Expense head",
            "type": "text",
            "required": true
          },
          {
            "key": "Vendor_GSTIN",
            "label": "Vendor GSTIN",
            "type": "text"
          },
          {
            "key": "City",
            "label": "City",
            "type": "text"
          },
          {
            "key": "Status",
            "label": "Status",
            "type": "select",
            "options_status": true
          }
        ]
      }
    ],
    "portal": "admin"
  },
  {
    "id": "centres",
    "covers": [
      "R19"
    ],
    "route": "/centres",
    "label": "Centres",
    "group": "Setup",
    "icon": "MapPin",
    "subtitle": "Every location and its coordinator",
    "desc": "Centres across Maharashtra and other states",
    "entity": "centres",
    "blocks": [
      {
        "type": "table",
        "columns": [
          {
            "key": "Centre_Name",
            "header": "Centre",
            "type": "text",
            "sub": "City"
          },
          {
            "key": "State",
            "type": "tag"
          },
          {
            "key": "Coordinator",
            "type": "owner"
          },
          {
            "key": "Phone",
            "type": "text"
          },
          {
            "key": "Status",
            "type": "badge"
          }
        ],
        "search": [
          "Centre_Name",
          "City",
          "Coordinator"
        ],
        "filters": [
          "State"
        ],
        "drawer": {
          "title_column": "Centre_Name",
          "sections": [
            {
              "type": "tiles",
              "title": "Centre",
              "columns": [
                "City",
                "State",
                "Coordinator",
                "Phone"
              ]
            },
            {
              "type": "list",
              "title": "Latest bills",
              "entity": "bills",
              "match": {
                "column": "Centre",
                "equals": "Centre_Name"
              },
              "label": "Vendor_Name",
              "value": "Total_Amount",
              "limit": 6,
              "empty": "No bill yet"
            }
          ]
        },
        "actions": {
          "header": [
            "add_centre"
          ],
          "row": [
            "edit_centre"
          ]
        },
        "id": "centres-table"
      }
    ],
    "modals": [
      {
        "id": "add_centre",
        "kind": "create",
        "title": "Add centre",
        "direct": "insert",
        "context": {
          "Status": "Active"
        },
        "columns": 2,
        "submit": "Save",
        "success": "Centre added",
        "fields": [
          {
            "key": "Centre_Name",
            "label": "Centre name",
            "type": "text",
            "required": true,
            "placeholder": "e.g. Pune — Baner"
          },
          {
            "key": "City",
            "label": "City",
            "type": "text",
            "required": true
          },
          {
            "key": "State",
            "label": "State",
            "type": "text",
            "required": true
          },
          {
            "key": "Coordinator",
            "label": "Centre coordinator",
            "type": "text",
            "required": true
          },
          {
            "key": "Phone",
            "label": "Phone",
            "type": "text"
          }
        ]
      },
      {
        "id": "edit_centre",
        "kind": "edit",
        "title": "Edit centre",
        "direct": "patch",
        "columns": 2,
        "fields": [
          {
            "key": "Coordinator",
            "label": "Centre coordinator",
            "type": "text"
          },
          {
            "key": "Phone",
            "label": "Phone",
            "type": "text"
          },
          {
            "key": "Status",
            "label": "Status",
            "type": "select",
            "options_status": true
          }
        ]
      }
    ],
    "portal": "admin"
  },
  {
    "id": "activity",
    "kind": "page",
    "route": "/activity",
    "label": "Activity log",
    "group": "Setup",
    "icon": "History",
    "desc": "Every change — who approved, queried, finalised or exported which bill, and when",
    "read_only": "The approval trail is written by the app from the session; nobody edits it",
    "blocks": [
      {
        "type": "kpis",
        "kpis": [
          {
            "label": "Changes today",
            "entity": "audit_log",
            "formula": "count where At in last 1 days",
            "icon": "History"
          },
          {
            "label": "Changes this week",
            "entity": "audit_log",
            "formula": "count where At in last 7 days",
            "icon": "CalendarDays"
          },
          {
            "label": "People active (7d)",
            "entity": "audit_log",
            "formula": "distinct Who where At in last 7 days",
            "icon": "Users"
          },
          {
            "label": "AI actions (7d)",
            "entity": "audit_log",
            "formula": "count where At in last 7 days and Flow!=direct",
            "icon": "Sparkles"
          }
        ],
        "id": "activity-kpis"
      },
      {
        "type": "table",
        "entity": "audit_log",
        "columns": [
          {
            "key": "At",
            "type": "date"
          },
          {
            "key": "Who",
            "type": "text"
          },
          {
            "key": "Action",
            "type": "tag"
          },
          {
            "key": "Entity",
            "type": "text"
          },
          {
            "key": "Record_ID",
            "type": "id"
          },
          {
            "key": "Summary",
            "type": "truncate"
          }
        ],
        "search": [
          "Who",
          "Record_ID",
          "Summary"
        ],
        "filters": [
          "Who",
          "Entity"
        ],
        "period": {
          "column": "At",
          "presets": [
            "today",
            "7d",
            "30d",
            "all"
          ],
          "default": "7d"
        },
        "segments": {
          "column": "Entity",
          "all": "All changes"
        },
        "drawer": {
          "placement": "center"
        },
        "sort": {
          "column": "At",
          "dir": "desc"
        },
        "id": "activity-table"
      }
    ],
    "entity": "audit_log",
    "export": true,
    "portal": "admin"
  },
  {
    "id": "settings",
    "kind": "settings",
    "route": "/settings",
    "label": "Settings",
    "icon": "Settings",
    "desc": "Profile and password",
    "portal": "admin"
  },
  {
    "id": "users",
    "kind": "users",
    "route": "/users",
    "label": "Users & roles",
    "icon": "Users",
    "group": "Setup",
    "desc": "Everyone who can sign in, and what each role may open",
    "subtitle": "Add people, reset passwords, change roles",
    "portal": "admin",
    "kernel": true
  }
];
