import { Tooltip, Tag as AntTag } from 'antd';
import { Link } from '../lib/router';
import { format } from 'date-fns';
import StatusBadge from '../components/StatusBadge';
import { toDate, toNum } from './formula';
import { dueOf } from './due';

const EMPTY = <span className="text-ink-3">—</span>;
// An id is a code, not a headline: mono, quiet, never bold (M9). It still links to the record.
const ID = 'text-[12.5px] font-mono text-ink-2 tabular';
export function renderCell(col, value, row, ctx) {
  const v = value ?? '';
  switch (col.type) {
    case 'id': return ctx.detailRoute ? <Link to={ctx.detailRoute.replace(':id', encodeURIComponent(v))} onClick={(e) => e.stopPropagation()} className={`${ID} hover:underline underline-offset-2 max-sm:inline-flex max-sm:items-center max-sm:min-h-8`}>{v}</Link> : <span className={ID}>{v}</span>;
    case 'money': return <span className="font-medium text-ink tabular">₹{toNum(v).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>;
    case 'number': return <span className="tabular text-ink">{v}</span>;
    case 'date': { const d = toDate(v); return <span className="text-ink-2 whitespace-nowrap tabular">{d ? format(d, col.time ? 'dd MMM, HH:mm' : 'dd MMM yyyy') : '—'}</span>; }
    case 'file': return v ? <a href={v} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-[13px] text-primary-600 hover:underline" data-os-file-link>Open</a> : EMPTY;
    case 'badge': return v ? <StatusBadge status={v} /> : EMPTY;
    case 'tag': return v ? <AntTag className="bg-black/[0.05] border-0 text-ink-2 rounded-[var(--r-6)] text-[12px]">{v}</AntTag> : EMPTY;
    case 'truncate': return v ? <Tooltip title={v}><span className="text-[13px] text-ink-2 truncate max-w-[220px] block">{v}</span></Tooltip> : EMPTY;
    case 'due': { // the entity's due reading: Overdue 18d · Today · Fri 26 Sep — identical to the chip on cards and in the drawer (C3)
      const s = ctx.ent ? dueOf(row, ctx.ent) : null; if (!s || s.kind === 'closed' || s.kind === 'none') return EMPTY;
      const cls = { bad: 'badge-danger', warn: 'badge-warning', neutral: 'badge-neutral' }[s.tone];
      return <span className={`badge ${cls} tabular`} data-os-due={s.kind}>{s.label}</span>; }
    case 'overdue': { const d = toDate(v); if (!d) return EMPTY; const late = d < new Date(); return <span className={`text-[12px] font-medium tabular ${late ? 'text-bad-text' : 'text-ink-2'}`}>{format(d, 'dd MMM')}{late ? ' · overdue' : ''}</span>; }
    case 'owner': return v ? <span className="text-ink">{v}</span> : (ctx.onUnassigned ? <button type="button" className="no-pill text-[12px] font-medium text-primary-600 hover:underline" onClick={(e) => { e.stopPropagation(); ctx.onUnassigned(row); }} data-os-unassigned>Unassigned · Assign</button> : <span className="badge badge-warning">Unassigned</span>);
    default: return col.sub ? <div><p className="font-medium text-ink leading-tight">{v || '—'}</p><p className={`mt-0.5 ${col.sub_type === 'id' || /_ID$|_No$/.test(col.sub) ? ID : 'text-[12px] text-ink-3'}`}>{row[col.sub]}</p></div> : <span className="text-ink">{v || '—'}</span>;
  }
}
