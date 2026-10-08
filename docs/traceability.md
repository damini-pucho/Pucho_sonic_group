# Requirement traceability
Every client requirement and where the OS covers it. `scaffold_os.py` refuses to build while any row is empty.

| id | requirement | covered by |
|---|---|---|
| R1 | A Centre Coordinator takes a photo of an expense bill on their mobile and uploads it to the application | page my_bills; page my_bills › modal upload_bill; flow BILL_READ; flow BILL_READ.extract |
| R2 | A Centre Coordinator reads the bill data filled in by AI from the photo — vendor, GST, GST rates and narration | page my_bills; page my_bills › approvals; page my_bills › modal upload_bill; flow BILL_READ; flow BILL_READ.extract |
| R3 | Accounts sees each bill mapped to the vendor's Tally ledger name and the correct expense head from the mapping Mugdha provides | page accounts_approvals; page vendors; flow BILL_READ; flow BILL_READ.extract |
| R4 | A Centre Coordinator verifies and approves the bill as the first of four approval stages | page my_bills; page my_bills › approvals; rule 1 |
| R5 | An HO Coordinator approves the bill after the centre | page ho_approvals; rule 1 |
| R6 | The Director checks and approves the bill online | page overview; page overview › modal approve_dir; page director_approvals; rule 1 |
| R7 | Accounts does the finalisation of the approved bill | page accounts_approvals; rule 1 |
| R8 | The Director sees how many bills came on a particular day, sorted by day | page overview; page bills; page bills › table; header |
| R9 | The Director sees every bill from one vendor since the start, categorised by vendor | page overview; page bills; page bills › table; header |
| R10 | An HO Coordinator flags a bill that seems incorrect and adds remarks | page ho_approvals; page bills; rule 2 |
| R11 | A Centre Coordinator replies to a raised query with the correction in the application | page my_bills; page my_bills › approvals; rule 2 |
| R12 | Accounts generates the Tally XML import file for an approved bill with one click | page tally_export; page tally_export › custom; rule 3 |
| R13 | Accounts sees each Tally entry fall under the correct head with the GST split | page accounts_approvals; page tally_export; page tally_export › custom; rule 3 |
| R14 | Accounts records the agreements whose summaries Sonic Group provides | page income; page income › table; page income › modal add_agreement |
| R15 | The Director sees the expected sales from the agreements | page overview; page income; page income › table; rule 5 |
| R16 | Accounts gets the sales invoice prepared one day before each agreement's due date | page income; page income › queue; page income › modal raise_invoice; flow SALES_INVOICE; flow SALES_INVOICE.raise; rule 5 |
| R17 | Accounts downloads the sales invoice as a Tally XML import file | page tally_export; page tally_export › custom; rule 3 |
| R18 | Accounts maintains the vendor → ledger → expense-head mapping and maps an unmatched vendor once | page accounts_approvals; page vendors; page vendors › modal add_vendor |
| R19 | A Centre Coordinator sees only their own centre's bills; HO, Director and Accounts see all centres | page my_bills; page my_bills › table; page bills; page centres; rule 4 |
| R20 | The Director sees one overview of bills pending at each stage, open queries and this month's expected sales | page overview; rule 5 |
