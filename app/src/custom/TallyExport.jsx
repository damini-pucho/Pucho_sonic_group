// TallyExport — the one-click Tally Prime import (R12, R13, R17). Builds one XML from every finalised bill and every prepared
// sales invoice (src/custom/tallyXml.js — code, not a model), downloads it, then marks those rows Exported through the
// same Server Action every modal uses (runAction → direct patch; the role → action map and the audit row apply).
import { useMemo, useState } from 'react';
import { Button } from 'antd';
import { toast } from 'sonner';
import { FileDown, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { runAction } from '../utils/api';
import { CARD, SECTION_TITLE } from '../module/Charts';
import { Callout, Tiles } from '../components/ui/primitives';
import { envelope, billProblem, invoiceProblem, billLines, invoiceLines, TALLY } from './tallyXml';

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
const sum = (rows, k) => rows.reduce((s, r) => s + (parseFloat(r[k]) || 0), 0);

export default function TallyExport({ data, reload }) {
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(false);
  const finalised = useMemo(() => (data.bills ?? []).filter((b) => b.Status === 'Finalised'), [data.bills]);
  const prepared = useMemo(() => (data.sales_invoices ?? []).filter((s) => s.Status === 'Prepared'), [data.sales_invoices]);
  const bills = finalised.filter((b) => !billProblem(b));
  const invoices = prepared.filter((s) => !invoiceProblem(s));
  const blocked = [...finalised.filter(billProblem).map((b) => `${b.Vendor_Name} ${b.Bill_No ?? ''} — ${billProblem(b)}`), ...prepared.filter(invoiceProblem).map((s) => `${s.Tenant_Name} ${s.Period ?? ''} — ${invoiceProblem(s)}`)];
  const xml = useMemo(() => envelope(bills, invoices), [bills, invoices]);
  const count = bills.length + invoices.length;

  async function exportNow() {
    if (!count) return;
    setBusy(true);
    try {
      const stamp = new Date();
      const name = `sonic-tally-import-${stamp.toISOString().slice(0, 16).replace(/[-:T]/g, '')}.xml`;
      const url = URL.createObjectURL(new Blob([xml], { type: 'application/xml' }));
      const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      const at = stamp.toISOString(); let failed = 0;
      for (const b of bills) { const r = await runAction({ direct: 'patch', entity: 'bills' }, { Bill_ID: b.Bill_ID, Status: 'Exported', Exported_At: at }); if (!r?.ok) failed++; }
      for (const s of invoices) { const r = await runAction({ direct: 'patch', entity: 'sales_invoices' }, { Invoice_ID: s.Invoice_ID, Status: 'Exported', Exported_At: at }); if (!r?.ok) failed++; }
      if (failed) toast.error(`${name} downloaded, but ${failed} row(s) could not be marked Exported — mark them from the table`);
      else toast.success(`${name} downloaded — ${count} voucher${count === 1 ? '' : 's'} marked Exported`, { description: 'Import it in Tally Prime: Gateway of Tally → Import → Vouchers.' });
      reload?.();
    } catch (e) { toast.error(e.message || 'The export could not be completed'); }
    finally { setBusy(false); }
  }

  const example = bills[0] ? billLines(bills[0]) : invoices[0] ? invoiceLines(invoices[0]) : null;
  return (
    <section className={`${CARD} p-5 space-y-4`} data-os-custom="TallyExport">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={SECTION_TITLE}>Tally Prime import file</h3>
          <p className="text-[13px] text-ink-3 mt-0.5">{TALLY.purchaseVoucher} vouchers for bills, {TALLY.salesVoucher} vouchers for invoices — one XML, imported from Gateway of Tally → Import → Vouchers.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button icon={preview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />} onClick={() => setPreview((p) => !p)} disabled={!count} data-os-action="tally-preview">{preview ? 'Hide XML' : 'Preview XML'}</Button>
          <Button type="primary" icon={<FileDown className="w-3.5 h-3.5" />} loading={busy} disabled={!count} onClick={exportNow} data-os-action="tally-download">Download Tally XML{count ? ` (${count})` : ''}</Button>
        </div>
      </div>
      <Tiles columns={4} items={[
        { label: 'Bills', value: `${bills.length} · ${inr(sum(bills, 'Total_Amount'))}` },
        { label: 'Input GST', value: inr(sum(bills, 'CGST') + sum(bills, 'SGST') + sum(bills, 'IGST')) },
        { label: 'Sales invoices', value: `${invoices.length} · ${inr(sum(invoices, 'Total_Amount'))}` },
        { label: 'Output GST', value: inr(sum(invoices, 'GST_Amount')) },
      ]} />
      {!count && !blocked.length && <p className="text-[13px] text-ink-3">Nothing to export — bills appear here once Accounts finalises them, invoices once they are raised.</p>}
      {blocked.length > 0 && (
        <Callout tone="warn" icon={AlertTriangle} label={`${blocked.length} not in this file`}>
          <ul className="list-disc pl-4 space-y-0.5">{blocked.slice(0, 6).map((t) => <li key={t}>{t}</li>)}</ul>
        </Callout>
      )}
      {example && (
        <div className="text-[13px]">
          <p className="text-ink-3 mb-1.5">How the first voucher posts</p>
          <div className="rounded-lg border border-[color:var(--hair-5)] divide-y divide-black/[0.05]">
            {example.map((l, i) => (
              <div key={i} className="flex items-center justify-between gap-3 px-3 py-1.5">
                <span className="text-ink-2 truncate">{l.ledger}</span>
                <span className="tabular whitespace-nowrap text-ink">{l.dr ? `${inr(l.amount)} Dr` : `${inr(l.amount)} Cr`}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {preview && count > 0 && (
        <pre className="max-h-80 overflow-auto rounded-lg bg-surface-2 border border-[color:var(--hair-5)] p-3 text-[12px] leading-5 text-ink-2 whitespace-pre" data-os-xml>{xml}</pre>
      )}
    </section>
  );
}
