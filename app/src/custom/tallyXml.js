// src/custom/tallyXml.js — the Tally Prime voucher-import XML, built by code (rule zero: no model touches a number).
// One Purchase voucher per finalised bill, one Sales voucher per prepared sales invoice, all in one ENVELOPE that
// Accounts imports in Tally Prime: Gateway of Tally → Import → Vouchers.
// Tally's sign rule: a debit is ISDEEMEDPOSITIVE=Yes with a NEGATIVE amount; a credit is ISDEEMEDPOSITIVE=No with a positive amount.
//
// ⚑ G1 — to confirm with Sonic Group (Mugdha): the voucher types and the GST ledger names below must match their Tally company
// exactly, or the import stops on "Ledger does not exist". Change them here only.
export const TALLY = {
  purchaseVoucher: 'Purchase',
  salesVoucher: 'Sales',
  inputCGST: 'Input CGST',
  inputSGST: 'Input SGST',
  inputIGST: 'Input IGST',
  outputCGST: 'Output CGST',
  outputSGST: 'Output SGST',
  outputIGST: 'Output IGST',
  roundOff: 'Round Off',
};

const num = (v) => { const n = parseFloat(String(v ?? '').replace(/[^0-9.-]/g, '')); return Number.isFinite(n) ? n : 0; };
const r2 = (n) => Math.round(n * 100) / 100;
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
/** 2026-10-07 / 2026-10-07T… / a Date → 20261007 (IST calendar day). */
export function tallyDate(v) {
  if (!v) return '';
  const s = String(v);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s.replaceAll('-', '');
  const d = new Date(s); if (isNaN(d)) return '';
  const ist = new Date(d.getTime() + 330 * 60000);
  return ist.toISOString().slice(0, 10).replaceAll('-', '');
}

/** debit (Dr) or credit (Cr) line */
const line = (ledger, amount, dr) => ({ ledger, amount: r2(amount), dr });
const lineXml = (l) => `        <ALLLEDGERENTRIES.LIST>
          <LEDGERNAME>${esc(l.ledger)}</LEDGERNAME>
          <ISDEEMEDPOSITIVE>${l.dr ? 'Yes' : 'No'}</ISDEEMEDPOSITIVE>
          <AMOUNT>${(l.dr ? -l.amount : l.amount).toFixed(2)}</AMOUNT>
        </ALLLEDGERENTRIES.LIST>`;

/** Why a row cannot be exported yet — empty string when it can. */
export function billProblem(b) {
  if (!b.Tally_Ledger) return 'Vendor not mapped to a Tally ledger';
  if (!b.Expense_Head) return 'No expense head';
  if (!b.Bill_Date) return 'No bill date';
  if (num(b.Total_Amount) <= 0) return 'No bill total';
  return '';
}
export function invoiceProblem(s) {
  if (!s.Tenant_Ledger) return 'No tenant ledger';
  if (!s.Income_Head) return 'No income head';
  if (num(s.Total_Amount) <= 0) return 'No invoice total';
  return '';
}

/** Purchase voucher lines: expense head Dr taxable, input GST Dr, vendor Cr total; any paise difference → Round Off. */
export function billLines(b) {
  const taxable = num(b.Taxable_Value), cgst = num(b.CGST), sgst = num(b.SGST), igst = num(b.IGST), total = num(b.Total_Amount);
  const L = [line(b.Expense_Head, taxable || total - cgst - sgst - igst, true)];
  if (cgst) L.push(line(TALLY.inputCGST, cgst, true));
  if (sgst) L.push(line(TALLY.inputSGST, sgst, true));
  if (igst) L.push(line(TALLY.inputIGST, igst, true));
  const dr = L.reduce((s, l) => s + l.amount, 0); const diff = r2(total - dr);
  if (diff) L.push(line(TALLY.roundOff, Math.abs(diff), diff > 0));
  return [line(b.Tally_Ledger, total, false), ...L];
}

/** Sales voucher lines: tenant Dr total, income head Cr taxable, output GST Cr (CGST + SGST halves, or IGST). */
export function invoiceLines(s) {
  const taxable = num(s.Taxable_Value), gst = num(s.GST_Amount), total = num(s.Total_Amount) || taxable + gst;
  const L = [line(s.Income_Head, taxable, false)];
  if (gst) {
    if (String(s.GST_Type || '').toUpperCase().includes('IGST')) L.push(line(TALLY.outputIGST, gst, false));
    else { const half = r2(gst / 2); L.push(line(TALLY.outputCGST, half, false), line(TALLY.outputSGST, r2(gst - half), false)); }
  }
  const cr = L.reduce((x, l) => x + l.amount, 0); const diff = r2(total - cr);
  if (diff) L.push(line(TALLY.roundOff, Math.abs(diff), diff < 0));
  return [line(s.Tenant_Ledger, total, true), ...L];
}

const voucher = ({ type, date, number, reference, party, narration, lines }) => `    <TALLYMESSAGE xmlns:UDF="TallyUDF">
      <VOUCHER VCHTYPE="${esc(type)}" ACTION="Create" OBJVIEW="Accounting Voucher View">
        <DATE>${date}</DATE>
        <EFFECTIVEDATE>${date}</EFFECTIVEDATE>
        <VOUCHERTYPENAME>${esc(type)}</VOUCHERTYPENAME>
        <VOUCHERNUMBER>${esc(number)}</VOUCHERNUMBER>
        <REFERENCE>${esc(reference)}</REFERENCE>
        <PARTYLEDGERNAME>${esc(party)}</PARTYLEDGERNAME>
        <NARRATION>${esc(narration)}</NARRATION>
        <PERSISTEDVIEW>Accounting Voucher View</PERSISTEDVIEW>
${lines.map(lineXml).join('\n')}
      </VOUCHER>
    </TALLYMESSAGE>`;

export function billVoucher(b) {
  return voucher({ type: TALLY.purchaseVoucher, date: tallyDate(b.Bill_Date), number: b.Bill_ID, reference: b.Bill_No, party: b.Tally_Ledger,
    narration: [b.Narration, `Bill ${b.Bill_No || ''} dt ${b.Bill_Date || ''}`, b.Centre, b.Vendor_GSTIN && `GSTIN ${b.Vendor_GSTIN}`].filter(Boolean).join(' · '), lines: billLines(b) });
}
export function invoiceVoucher(s) {
  return voucher({ type: TALLY.salesVoucher, date: tallyDate(s.Due_Date || s.Prepared_At), number: s.Invoice_ID, reference: s.Agreement_ID, party: s.Tenant_Ledger,
    narration: s.Narration || `${s.Income_Head} for ${s.Period} — ${s.Centre}`, lines: invoiceLines(s) });
}

/** The whole import file. */
export function envelope(bills = [], invoices = []) {
  const body = [...bills.map(billVoucher), ...invoices.map(invoiceVoucher)].join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Vouchers</REPORTNAME>
      </REQUESTDESC>
      <REQUESTDATA>
${body}
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>
`;
}
