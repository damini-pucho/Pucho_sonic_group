// src/config/nav.js — generated from os.yaml portals[] + pages[]. ONE place: sidebar (with groups/children), header title/description, quick links, guards.
export const PORTALS = [{"id": "admin", "label": "Admin", "base": "/", "roles": ["admin", "centre", "ho", "director", "accounts"]}];
export const NAV = [
  {
    "id": "overview",
    "portal": "admin",
    "path": "/",
    "label": "Overview",
    "icon": "LayoutDashboard",
    "desc": "What needs the Director today, then the month in numbers",
    "kind": "overview",
    "subtitle": "Bills waiting at each stage, open queries and this month's expected sales"
  },
  {
    "id": "my_bills",
    "portal": "admin",
    "path": "/my-bills",
    "label": "My bills",
    "icon": "Camera",
    "desc": "The centre's bills — upload, verify, reply",
    "subtitle": "Photograph a bill, check what AI read, and answer queries from HO, the Director or Accounts"
  },
  {
    "id": "ho_approvals",
    "portal": "admin",
    "path": "/ho-approvals",
    "label": "HO approvals",
    "icon": "Building2",
    "desc": "The HO Coordinator's stage",
    "badge": {
      "entity": "bills",
      "where": "Status=With HO"
    },
    "subtitle": "Bills every centre has verified — approve, or raise a query with remarks"
  },
  {
    "id": "director_approvals",
    "portal": "admin",
    "path": "/director-approvals",
    "label": "Approvals",
    "icon": "Stamp",
    "desc": "The Director's stage",
    "badge": {
      "entity": "bills",
      "where": "Status=With Director"
    },
    "subtitle": "Bills HO has approved — check and approve online, or raise a query"
  },
  {
    "id": "accounts_approvals",
    "portal": "admin",
    "path": "/accounts",
    "label": "Finalise bills",
    "icon": "Calculator",
    "desc": "The Accounts stage",
    "badge": {
      "entity": "bills",
      "where": "Status=With Accounts"
    },
    "subtitle": "Bills the Director approved — confirm the Tally ledger and expense head, then finalise"
  },
  {
    "id": "tally_export",
    "portal": "admin",
    "path": "/tally-export",
    "label": "Tally export",
    "icon": "FileDown",
    "desc": "Purchase vouchers and sales vouchers for Tally Prime (Gateway → Import → Vouchers)",
    "badge": {
      "entity": "bills",
      "where": "Status=Finalised"
    },
    "subtitle": "One click builds the Tally Prime import XML for every finalised bill and prepared sales invoice"
  },
  {
    "id": "bills",
    "portal": "admin",
    "path": "/bills",
    "label": "All bills",
    "icon": "Receipt",
    "desc": "The register of every expense bill since the start",
    "subtitle": "Every bill from every centre — pick a day, a vendor or a centre"
  },
  {
    "id": "income",
    "portal": "admin",
    "path": "/income",
    "label": "Agreements & sales",
    "icon": "FileSignature",
    "desc": "Agreements, expected sales and sales invoices",
    "badge": {
      "entity": "agreements",
      "where": "Next_Due_Date<=today+1 and Invoice_Status!=Raised and Status=Active"
    },
    "subtitle": "Expected sales from every agreement, and the invoices due tomorrow"
  },
  {
    "id": "vendors",
    "portal": "admin",
    "path": "/vendors",
    "label": "Vendor ledgers",
    "icon": "Link2",
    "desc": "The vendor → Tally ledger → expense head mapping Mugdha provides",
    "group": "Setup",
    "subtitle": "Which vendor's bill goes to which Tally ledger and expense head"
  },
  {
    "id": "centres",
    "portal": "admin",
    "path": "/centres",
    "label": "Centres",
    "icon": "MapPin",
    "desc": "Centres across Maharashtra and other states",
    "group": "Setup",
    "subtitle": "Every location and its coordinator"
  },
  {
    "id": "activity",
    "portal": "admin",
    "path": "/activity",
    "label": "Activity log",
    "icon": "History",
    "desc": "Every change — who approved, queried, finalised or exported which bill, and when",
    "group": "Setup",
    "kind": "page"
  },
  {
    "id": "users",
    "portal": "admin",
    "path": "/users",
    "label": "Users & roles",
    "icon": "Users",
    "desc": "Everyone who can sign in, and what each role may open",
    "group": "Setup",
    "kind": "users",
    "subtitle": "Add people, reset passwords, change roles"
  },
  {
    "id": "settings",
    "portal": "admin",
    "path": "/settings",
    "label": "Settings",
    "icon": "Settings",
    "desc": "Profile and password",
    "kind": "settings"
  }
];
export function portalFor(pathname) {
  return [...PORTALS].sort((a, b) => b.base.length - a.base.length).find((p) => pathname === p.base || pathname.startsWith(p.base === '/' ? '/' : p.base + '/')) ?? PORTALS[0];
}
export function navFor(portalId) { return NAV.filter((n) => n.portal === portalId); }
export function metaForPath(pathname) {
  const hit = [...NAV].sort((a, b) => b.path.length - a.path.length).find((n) => pathname === n.path || (n.path !== '/' && pathname.startsWith(n.path + '/')));
  return hit ?? { label: 'Sonic Bills & Income', desc: '' };
}
