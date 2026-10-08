// src/config/access.js — GENERATED from os.yaml roles[] × pages[]. What the server lets each role read and do:
//   ENTITY_ACCESS[role]   entities any page the role can open reads ('*' = every entity)
//   SCOPES[role][entity]  the column a self-service role is pinned to (every page it opens filters `Col={{user}}`)
//   ACTIONS[role]         'flow:<FLOW>.<action>' / 'direct:<op>:<entity>' keys declared on pages the role can open
//   PUBLIC_ENTITIES[page] / PUBLIC_ACTIONS[page]  what a `public: true` page may read and submit without a sign-in
export const ENTITY_ACCESS = {"admin": ["*"], "centre": ["bills", "centres"], "ho": ["audit_log", "bills"], "director": ["agreements", "audit_log", "bills", "centres", "sales_invoices"], "accounts": ["agreements", "audit_log", "bills", "centres", "sales_invoices", "vendor_ledgers"]};
export const SCOPES = {"centre": {"bills": "Centre_Coordinator"}};
export const ACTIONS = {"admin": ["direct:insert:agreements", "direct:insert:centres", "direct:insert:vendor_ledgers", "direct:patch:agreements", "direct:patch:bills", "direct:patch:centres", "direct:patch:sales_invoices", "direct:patch:vendor_ledgers", "flow:BILL_READ.extract", "flow:SALES_INVOICE.raise"], "centre": ["direct:patch:bills", "flow:BILL_READ.extract"], "ho": ["direct:patch:bills"], "director": ["direct:insert:agreements", "direct:patch:agreements", "direct:patch:bills", "flow:SALES_INVOICE.raise"], "accounts": ["direct:insert:agreements", "direct:insert:centres", "direct:insert:vendor_ledgers", "direct:patch:agreements", "direct:patch:bills", "direct:patch:centres", "direct:patch:sales_invoices", "direct:patch:vendor_ledgers", "flow:SALES_INVOICE.raise"]};
export const PUBLIC_ENTITIES = {};
export const PUBLIC_ACTIONS = {};
