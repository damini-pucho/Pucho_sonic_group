// src/config/roles.js — generated from os.yaml roles[].
export const ROLES = {"ADMIN": "admin", "CENTRE": "centre", "HO": "ho", "DIRECTOR": "director", "ACCOUNTS": "accounts"};
export const ROLE_PERMISSIONS = {"admin": ["*"], "centre": ["my_bills", "settings"], "ho": ["ho_approvals", "bills", "settings"], "director": ["overview", "director_approvals", "bills", "income", "settings"], "accounts": ["accounts_approvals", "tally_export", "bills", "income", "vendors", "centres", "settings"]};
export const ROLE_LABELS = {"admin": "Admin", "centre": "Centre Coordinator", "ho": "HO Coordinator", "director": "Director", "accounts": "Accounts"};
export const ROLE_COLORS = {"admin": "bg-brand-500", "centre": "bg-brand-500", "ho": "bg-brand-500", "director": "bg-brand-500", "accounts": "bg-brand-500"};
export const ROLE_HOME = {"admin": "/", "centre": "/my-bills", "ho": "/ho-approvals", "director": "/", "accounts": "/accounts"};
export const ROLE_DESC = {"admin": "Sees everything; maintains centres, vendor ledgers and people", "centre": "Photographs and uploads the centre's bills, verifies what AI read, answers queries", "ho": "Approves bills from every centre after the centre, or raises a query", "director": "Approves bills online and sees every bill, query and the expected sales", "accounts": "Finalises approved bills, keeps the vendor ledger mapping, raises sales invoices and exports to Tally"};   // plain-language access description shown in Settings (audit M12)
export function homeFor(role) { return ROLE_HOME[role] ?? '/'; }
