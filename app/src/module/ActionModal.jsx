// A modal form declared in os.yaml (fields + flow.action). Handles select options from entities, required_when, voice notes, submit → callWorkflow → toast → refresh.
import { useT } from '../i18n';
import { useEffect, useMemo, useState } from 'react';
import { Button } from 'antd';
import Fields, { missingFields } from './Fields';
import { toast } from 'sonner';
import Modal from '../components/Modal';
import WorkingState from '../components/WorkingState';
import { AnimatePresence } from 'framer-motion';
import { ENTITIES } from '../config/os.config';
import { runAction } from '../utils/api';
import Builder from './Builder';
import { fmt } from './Sections';
import { useAuth } from '../context/AuthContext';



export default function ActionModal({ spec, row: rowProp, open, onClose, data, onDone }) {
  const t = useT();
  // Bulk: `row` is an array of records; the form is filled once and its payload applied to each (M9).
  const bulkRows = Array.isArray(rowProp) ? rowProp : null; const row = bulkRows ? null : rowProp;
  const [values, setValues] = useState({});
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const { user } = useAuth();
  // `default: "{{user}}"` = the signed-in person; a date field's `default: today | tomorrow` = that day, in the person's own time zone
  const day = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const dflt = (v) => (v === '{{user}}' ? (user?.name ?? '') : v === 'today' ? day(0) : v === 'tomorrow' ? day(1) : v);
  const rowKey = row ? row[ENTITIES[spec.entity]?.id?.column] ?? JSON.stringify(row) : '';
  useEffect(() => {
    if (!open) return;
    const init = {};
    const walk = (fs) => { for (const f of fs ?? []) { if (f.type === 'panel') walk(f.fields); else if (f.key) init[f.key] = row?.[f.key] || dflt(f.default) || ''; } };
    walk(spec.fields);
    setValues(init);
  }, [open, spec.id, rowKey]); // eslint-disable-line react-hooks/exhaustive-deps -- keyed on identity: the page re-creates `spec` on every render and a reset mid-typing would wipe the form

  const missing = useMemo(() => missingFields(spec.fields, values), [spec, values]);

  async function submit() {
    if (missing.length) { toast.error(`Please fill: ${missing.map((f) => f.label).join(', ')}`); return; }
    setBusy(true);
    try {
      const one = async (r) => {
        // `user` is the signed-in person, always — the flow (and the demo `map: { user: Rep }`) attribute the record to them. ActionCard
        // sent it; this modal did not, so a rep's own "Log an activity" vanished from their own `where: Rep={{user}}` table (QA Q3 found it).
        const payload = { user: user?.name, ...(spec.context ?? {}), ...(r ? Object.fromEntries((spec.pass ?? []).map((k) => [k, r[k]])) : {}), ...values };
        if (r && spec.entity) { const idc = ENTITIES[spec.entity]?.id?.column; if (idc) payload[idc] = r[idc]; }
        return runAction(spec, payload);
      };
      let res;
      // A success line that promises a delivery ("the client has the update") is not said when the send was simulated.
      const said = (r) => (r?.would_send ? `${spec.title} — saved` : (spec.success ?? `${spec.title} done`));
      if (bulkRows) { for (const r of bulkRows) res = await one(r); toast.success(`${said(res)} — ${bulkRows.length} records`); }
      else { res = await one(row); toast.success(said(res)); }
      // A simulated send shows the exact words it WOULD have sent — labelled, never presented as delivered (rule 8).
      if (res?.would_send?.text) toast.message(`${bulkRows ? `${bulkRows.length} ${res.would_send.channel} messages` : res.would_send.channel} not sent — simulated`, { description: `${bulkRows ? 'Last one, to' : 'To'} ${res.would_send.to || '—'} (${res.would_send.lang}): ${res.would_send.text}`, duration: 12000 });
      onDone?.(res); onClose();
    } catch (e) { toast.error(e.code === 'NOT_WIRED' ? 'This workflow is not connected yet' : (e.message || 'Something went wrong')); }
    finally { setBusy(false); }
  }

  if (spec.kind === 'builder') return (
    <Modal isOpen={open} onClose={onClose} title={t(spec.title)} size={spec.size ?? 'xl'}>
      <Builder spec={spec} row={row} data={data} onClose={onClose} onDone={onDone} />
    </Modal>
  );
  // Two columns when declared, or when the form is long enough that one column would scroll (≥ 6 fields).
  const fieldCount = (spec.fields ?? []).filter((f) => f.type !== 'panel').length;
  const columns = spec.columns ?? (fieldCount >= 6 ? 2 : 1);
  const size = spec.size ?? (columns === 2 ? 'lg' : 'md');
  return (
    <Modal isOpen={open} onClose={onClose} title={t(spec.title)} size={size}>
      <div className="os-form space-y-4 w-full" data-os-form data-os-columns={columns}>
        {bulkRows && <p className="text-[13px] text-ink-2 -mt-1">Applies to <span className="font-medium text-ink">{bulkRows.length}</span> selected records.</p>}
        {row && spec.summary && (
          <div className="rounded-[var(--r-10)] bg-surface-2 border border-[color:var(--hair-5)] p-4 grid grid-cols-2 gap-3">
            {spec.summary.map((k) => <div key={k}><p className="text-[12px] text-ink-3">{k.replace(/_/g, ' ')}</p><p className="font-medium text-ink text-[14px]">{fmt(row, k, ENTITIES[spec.entity]) }</p></div>)}
          </div>
        )}
        {spec.intro && <p className="text-[13px] text-ink-3 -mt-1">{spec.intro}</p>}
        <Fields fields={spec.fields ?? []} values={values} setValues={setValues} data={data} entity={spec.entity} recording={recording} setRecording={setRecording} columns={columns} row={row} />
        {/* The workflow's real stages while it runs — the two-to-twenty seconds that are the
            whole product. The button stops being the only thing that knows something is happening. */}
        <AnimatePresence>{busy && <WorkingState spec={spec} active={busy} />}</AnimatePresence>
        <div className="flex justify-end gap-3 pt-3 border-t border-[color:var(--hair-5)]">
          <Button onClick={onClose} disabled={busy}>Cancel</Button>
          <Button type="primary" loading={busy} onClick={submit}>{busy ? (spec.pending ?? 'Working…') : (spec.submit ?? 'Save')}</Button>
        </div>
      </div>
    </Modal>
  );
}
