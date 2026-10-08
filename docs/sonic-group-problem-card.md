# Problem card — Sonic Group, Maharashtra (+ centres in other states)

Source: MoM "Sonic Group Expense & Income Automation", 06 Oct 2026 — summary pages 1–5 and the translated transcript,
pages 6–8. Speaker: Mugdha Borate (Sonic Group) unless marked. References are `[p.N]` (page of the MoM PDF).

**Outcome in the client's words:** "we want to automate our entire process … the Director needs everything in one online access" — expense bills photographed at the centre, approved online through four stages and entered in Tally under the proper heads; sales invoices raised in Tally one day before the due date.
**Actors:** Centre Coordinator · HO Coordinator · Director · Accounts
**Inputs:** a photo of each expense bill (taken on a phone at the centre) · the vendor → Tally ledger → expense-head mapping (from Mugdha) · agreement summaries (tenant, space, rent / fit-out, amount, due date)
**Outputs:** approved bills with extracted GST and narration · queries with remarks on incorrect bills · a Tally import XML per approved bill · expected sales per agreement · a sales invoice (Tally XML) one day before each due date
**Volume:** ⚑ assumed 300 expense bills / month across ~12 centres; ⚑ assumed 40 active agreements → 40 sales invoices / month
**Languages:** English
**Systems:** Tally Prime (the books; "we have taken quite good access to it") · email and hard copies today · the Spine application (asked about, not specified)
**Success:** ⚑ the Director sees every bill online, by day and by vendor, without asking operations or accounts for data — and no bill needs a hard-copy signature
**Constraints:** the centre coordinator's workload must not grow ("they will take a photo on their mobile"); the four-stage manual process is kept exactly; direct push into Tally may not be feasible — XML import is the agreed fallback

## Requirement lines
R1  A Centre Coordinator takes a photo of an expense bill on their mobile and uploads it to the application  — "the coordinator at that particular location will just take a photo from their mobile. They won't scan" [p.6]
R2  A Centre Coordinator reads the bill data filled in by AI from the photo — vendor, GST, GST rates and narration  — "You need to read the GST in it, you need to read its narration, you need to read the GST rates" [p.8]
R3  Accounts sees each bill mapped to the vendor's Tally ledger name and the correct expense head from the mapping Mugdha provides  — "which vendor's invoice is registered under which name in my books here, I will provide that to you" [p.8]
R4  A Centre Coordinator verifies and approves the bill as the first of four approval stages  — "There is the center where it is received, then there is the HO coordinator, then the Director, and then Accounts" [p.7]
R5  An HO Coordinator approves the bill after the centre  — "The coordinator will approve it, then our Head Office coordinator will also approve it" [p.6]
R6  The Director checks and approves the bill online  — "Then the Director will also check and approve it online, and then it will come to Accounts" [p.6]
R7  Accounts does the finalisation of the approved bill  — "whatever finalization is needed will be done in Accounts" [p.6]
R8  The Director sees how many bills came on a particular day, sorted by day  — "If my Director asks to see how many bills came on a particular day, I should be able to sort it by day" [p.6]
R9  The Director sees every bill from one vendor since the start, categorised by vendor  — "I need to see how many bills have come from that vendor since we started, completely categorized by vendor" [p.6]
R10 An HO Coordinator flags a bill that seems incorrect and adds remarks  — "if a bill seems incorrect, we can flag it and add remarks" [p.6]
R11 A Centre Coordinator replies to a raised query with the correction in the application  — "Whatever correction or reply comes from them, it will come through that" [p.6]
R12 Accounts generates the Tally XML import file for an approved bill with one click  — "if your application can create an XML file, then an import link is definitely possible" [p.8]
R13 Accounts sees each Tally entry fall under the correct head with the GST split  — "that file should come exactly according to the proper heads" [p.8]
R14 Accounts records the agreements whose summaries Sonic Group provides  — "We have agreements, and we will provide you with the summaries of the agreements" [p.7]
R15 The Director sees the expected sales from the agreements  — "whatever my expected sales are from the agreement, that should also be visible to me in your application" [p.7]
R16 Accounts gets the sales invoice prepared one day before each agreement's due date  — "exactly one day before that due date, its entry should be made and the invoice should be generated in Tally" [p.7]
R17 Accounts downloads the sales invoice as a Tally XML import file  — "If direct entry into Tally is technically unfeasible, the system will generate an XML file for data import" [p.2]
R18 ⚑ Accounts maintains the vendor → ledger → expense-head mapping and maps an unmatched vendor once  — inferred from R3 and MoM risk "accurately mapping OCR-extracted vendor names to specific Tally ledgers"
R19 ⚑ A Centre Coordinator sees only their own centre's bills; HO, Director and Accounts see all centres  — inferred from "we have multiple locations across different states" [p.6]
R20 ⚑ The Director sees one overview of bills pending at each stage, open queries and this month's expected sales  — inferred from R6, R8, R15

## Not in v1
X1  Direct push of entries into Tally Prime  — "Going directly into Tally might not be possible. Yes, we can fetch, but we might not be able to export to Tally." [p.8]
X2  Spine application integration (one centralised application)  — "You tell me this first, and then we will look at the rest later" [p.7]
X3  Reading data back from Tally (ledgers, outstanding)  — not asked for in v1
X4  Marathi / Hindi labels  — English chosen at intake

## Gaps
G1  Do expense bills go into Tally as a Purchase voucher or a Journal, and what are the exact GST input ledger names?
G2  When the Director raises a query, does the bill go back to the centre only, or to the HO Coordinator as well?
G3  Can a stage reject a bill outright, or only raise a query on it?
G4  Is each agreement's due date a fixed day of the month, and are escalation clauses needed in v1?
G5  Is each centre a separate Tally company, or one company with cost centres?
G6  Can Chintan confirm whether a direct Tally push or a Spine integration is possible?
