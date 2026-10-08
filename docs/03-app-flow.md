# 03 — App Flow · Sonic Bills & Income
## Pages
- **overview** `/` — What needs the Director today, then the month in numbers
- **my_bills** `/my-bills` — The centre's bills — upload, verify, reply
- **ho_approvals** `/ho-approvals` — The HO Coordinator's stage
- **director_approvals** `/director-approvals` — The Director's stage
- **accounts_approvals** `/accounts` — The Accounts stage
- **tally_export** `/tally-export` — Purchase vouchers and sales vouchers for Tally Prime (Gateway → Import → Vouchers)
- **bills** `/bills` — The register of every expense bill since the start
- **income** `/income` — Agreements, expected sales and sales invoices
- **vendors** `/vendors` — The vendor → Tally ledger → expense head mapping Mugdha provides
- **centres** `/centres` — Centres across Maharashtra and other states
- **activity** `/activity` — Every change — who approved, queried, finalised or exported which bill, and when
- **settings** `/settings` — Profile and password
- **users** `/users` — Everyone who can sign in, and what each role may open
## Navigation and look
Shell per portal: admin=sidebar (`src/config/design.js`); nav from `src/config/nav.js`; tone graphite, radius crisp, density comfortable, sidebar light (`src/config/tokens.css`); header title = active page label. Login → first permitted page. Roles: admin (*), centre (my_bills, settings), ho (ho_approvals, bills, settings), director (overview, director_approvals, bills, income, settings), accounts (accounts_approvals, tally_export, bills, income, vendors, centres, settings).
## Workflow wiring (screen → flow.action)
- Overview `/` → direct patch (Approve bill)
- My bills `/my-bills` → `BILL_READ.extract` (Upload bill)
- HO approvals `/ho-approvals` → no workflow
- Approvals `/director-approvals` → no workflow
- Finalise bills `/accounts` → no workflow
- Tally export `/tally-export` → direct patch (Mark as imported in Tally)
- All bills `/bills` → no workflow
- Agreements & sales `/income` → `SALES_INVOICE.raise` (Raise sales invoice), direct insert (Add agreement), direct patch (Edit agreement)
- Vendor ledgers `/vendors` → direct insert (Add vendor ledger), direct patch (Edit vendor ledger)
- Centres `/centres` → direct insert (Add centre), direct patch (Edit centre)
- Activity log `/activity` → no workflow
- Settings `/settings` → no workflow
- Users & roles `/users` → no workflow
## States
Every table: loading skeleton, empty state with CTA, search, filters, segments/period chips where declared, table/cards/kanban views where declared, export. Every modal: validation, pending label, toast, refresh.
