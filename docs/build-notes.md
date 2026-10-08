# Build notes — Sonic Bills & Income (demo build, 08 Oct 2026)

Authored, not generated. What the gates proved, what they did not, and what this machine needed.

## Gates run (evidence/ is committed)
| gate | result | artefact |
|---|---|---|
| intake_check (problem card) | PASS — 20 R-lines, 17 quoted, 3 inferred ⚑ | docs/sonic-group-problem-card.md |
| fidelity_check | PASS — F1 149/168 strings traced · F2 5/5 entities · F3 closest reference 14 % | docs/fidelity.md |
| db:migrate ×2 · db:seed | applied twice, idempotent · 14 bills, 8 vendor ledgers, 5 centres, 6 agreements, 3 sales invoices, 5 personas | — |
| npm run build · npm run check · check:db | clean · 7/7 · 8/8 | evidence/check.txt, evidence/check-db.txt |
| ui_check desktop / mobile | 596 passed, 0 failed / 545 passed, 0 failed (13/13 pages, every persona) | evidence/ui-check*/ |
| build_flows (contract gate) | BILL_READ PASS · SALES_INVOICE PASS · 0 complexity breaches | workflows/*/ , docs/flows-complexity.md |
| flow_sim | 2 action runs, 0 failures | evidence/flow-sim.txt |
| security_scan --stage demo | 0 critical · 0 high · 1 medium (W4 bill text into the AI prompt — output is JSON a person checks) · 2 low (webhook URL is the secret) | docs/security-scan.json |
| Tally XML builder (unit) | Dr = Cr on intra-state, inter-state, round-off and IGST cases | src/custom/tallyXml.js |
| Manual, Centre persona on a 375px phone | Rohan sees only his 4 Pune bills; Verify & send to HO moved B-2026-0141 to With HO; audit row Who = Rohan Patil (from the session) | — |

## SIMULATED / UNVERIFIED
- **BILL_READ (AI reads the photo) — SIMULATED.** Until `WEBHOOK_BILL_READ` is set, an upload stores the photo and creates a bill with sample values marked "SIMULATED read". The header shows *Workflows simulated*.
- **SALES_INVOICE — SIMULATED.** The app inserts the invoice and marks the agreement Raised; advancing Next_Due_Date by a month happens in the wired flow's CODE only.
- **Tally import of our XML — UNVERIFIED.** Voucher types (Purchase / Sales) and GST ledger names (Input/Output CGST, SGST, IGST, Round Off) are constants in `app/src/custom/tallyXml.js` and must match Sonic Group's Tally company exactly (gap G1). Accounts must import one file into a test company first.
- **Vendor matching by AI** uses the vendor_ledgers rows baked into the flow at build time (`constants.rows_from`); a mapping added in the app reaches the flow only after `build_flows.py` is re-run and the flow re-imported. Accounts always confirms the ledger in Finalise.
- **Unattended daily invoice run** — not in v1 (Due tomorrow queue + one click).

## Known-broken on this machine (local demo only)
- `app` / `studio_reader` least-privilege roles were **not created**: Windows Application Control blocks PostgreSQL's own `plpgsql.dll`, so the `DO` block in db/roles.sql cannot run. The app connects as `postgres` locally. Not acceptable for pilot — the client database must have the roles (§19.1).
- `psql.exe` is blocked by the same policy; the database is reached through Node (`pg`).

## pucho-os 4.4.0 defects found on Windows (fix in the skill, then re-gate the worked examples)
1. `scaffold_os.py` AUTHORED check compares `src/custom` with `os.walk` paths that use `\` on Windows → `app/src/custom/index.js` is overwritten and recorded as generated. Workaround: `rescaffold.sh`.
2. The scaffold writes text files in Windows text mode (CRLF); `scripts/db.mjs` parses `.env` with `(.*)$` and `\r` defeats it → "Invalid URL". Workaround: `sed -i 's/\r$//' app/.env` after a scaffold.
3. `app/scripts/start.mjs` does `import(path.join(...))` → ERR_UNSUPPORTED_ESM_URL_SCHEME on Windows. Workaround: `node start-local.mjs` (pathToFileURL).
4. (minor) PNG icons need Pillow and use a Linux font path; on Windows the monogram falls back to Pillow's default font.

## Footprint warnings, answered (D6 / lean frontend)
- *ho_approvals, director_approvals, accounts_approvals "no header or row action"* — false positive: each page acts through its `approvals` block (Approve · Raise query · Finalise). The scaffold's D6 check does not count approvals buttons.
- *27 KPIs across pages* (before trimming) — the two approval pages' KPI strips were removed (they could not open a list: K7); the inbox title and the nav badge carry the count.
- *add_agreement has 17 fields (U6)* — kept: it is entered once per agreement from Mugdha's summaries; split into steps if Accounts finds it long.
- *admin sees 8 nav items in one group (U4)* — admin only; every working role sees ≤ 5.

## Open with the client (MoM gaps)
G1 Purchase vs Journal, GST ledger names · G2 Director's query → centre only, or HO too? · G3 reject outright, or query only? (v1: query + the centre may cancel) · G4 fixed due day, escalation clauses · G5 one Tally company or one per centre · G6 Chintan: direct Tally push, Spine.

## Run it locally
```
cd sonic-group-os
node start-local.mjs          # http://127.0.0.1:3000 — DEMO_LOGINS=true lists the 5 personas on the login page
```
Re-scaffold (after an os.yaml change): `PUCHO_OS=<skill> PY=python sh rescaffold.sh`, then `sed -i 's/\r$//' app/.env`, `cd app && npm run build`.
