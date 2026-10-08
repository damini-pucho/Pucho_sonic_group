// DetailPage — /entity/:id from os.yaml `detail`. A record header (id, title, status, meta, actions),
// then sections. `layout: rail` puts every section marked `rail: true` (or listed under `rail:`) in a
// right-hand column — the Energy Mission lead page: record on the left, score / owner / linked
// quotation / matching prices on the right. Every section type is in Sections.jsx.
import { useState } from 'react';
import { useParams, Link } from '../lib/router';
import { motion } from 'framer-motion';
import { Button } from 'antd';
import { ArrowLeft } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import ActionModal from './ActionModal';
import { CARD } from './Charts';
import { pageVariants } from './Kpis';
import { renderSection, MetaList } from './Sections';
import { modalEntities } from './Fields';
import { useEntity, useEntities } from '../hooks/useEntity';
import { ENTITIES, DOCUMENTS } from '../config/os.config';
import { useAuth } from '../context/AuthContext';
import Profile from './blocks/Profile';
import DocumentPreview from './DocumentPreview';

export function sectionEntities(sections) {
  return sections.filter((s) => ['related', 'linked', 'list', 'timeline'].includes(s.type)).map((s) => s.entity);
}

export default function DetailPage({ config }) {
  const { id } = useParams(); const { user } = useAuth();
  const ent = ENTITIES[config.entity]; const idc = ent.id.column;
  const { rows, loading, reload } = useEntity(config.entity);
  const row = rows.find((r) => r[idc] === decodeURIComponent(id));
  const d = config.detail;
  const all = [...(d.sections ?? []), ...(d.rail ?? []).map((s) => ({ ...s, rail: true })), ...(d.tabs ?? []).flatMap((t) => t.sections ?? [])];
  const docEnts = (config.modals ?? []).filter((m) => m.kind === 'document').flatMap((m) => [DOCUMENTS[m.document]?.items?.entity]).filter(Boolean);
  const { data } = useEntities([...new Set([...sectionEntities(all), ...docEnts, ...(config.modals ?? []).flatMap((m) => modalEntities(m, DOCUMENTS))].filter(Boolean))]);
  const [modal, setModal] = useState(null);
  // Row actions may be declared on the page or on its (first) table block — the detail page shows the same set as buttons.
  const firstTable = (function find(bs) { for (const b of bs ?? []) { if (b.type === 'table') return b; const t = find(b.blocks) ?? (b.tabs ?? []).map((x) => find(x.blocks)).find(Boolean); if (t) return t; } return null; })(config.blocks);
  const rowActions = (config.actions?.row ?? firstTable?.actions?.row ?? []).map((k) => config.modals.find((m) => m.id === k)).filter(Boolean);
  const statusCol = ent.status?.column;
  const openModal = (m, r) => setModal({ spec: m, row: r ?? row });
  const ctx = { row, ent, idc, data, reload, user, openModal, actions: [...rowActions, ...(config.modals ?? [])], modals: config.modals ?? [] };
  const renderSections = (sections) => sections.map((s, i) => renderSection(s, i, ctx));

  if (loading) return <div className="p-10 text-sm text-ink-3">Loading…</div>;
  if (!row) return <div className="p-10"><p className="font-semibold">Not found</p><Link to={config.route} className="text-primary-600 text-sm">← Back to {config.label}</Link></div>;

  const main = all.filter((s) => !s.rail && !(d.tabs ?? []).some((t) => (t.sections ?? []).includes(s)));
  const rail = all.filter((s) => s.rail);
  const title = d.title_column ? row[d.title_column] : row[idc];
  const isPrimary = (m) => m.primary || rowActions.length === 1;
  // One primary per header (ux-laws: Von Restorff): the first action marked primary; any other marked one is secondary
  const primary = rowActions.filter(isPrimary).slice(0, 1); const rest = rowActions.filter((m) => !primary.includes(m));

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-5" data-os-detail>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link to={config.route} className="btn-ghost -ml-2"><ArrowLeft className="w-4 h-4" /> {config.label}</Link>
        {d.kind !== 'profile' && rowActions.length > 0 && (
          <div className="flex gap-2 flex-wrap justify-end" data-os-page-actions>
            {rest.map((m) => <Button key={m.id} data-os-action={m.id} onClick={() => openModal(m)}>{m.title}</Button>)}
            {primary.map((m) => <Button key={m.id} data-os-action={m.id} type="primary" onClick={() => openModal(m)}>{m.title}</Button>)}
          </div>
        )}
      </div>

      {d.kind === 'profile' ? (
        <Profile row={row} entity={ent} spec={d} actions={rowActions} onAction={(m) => openModal(m)} renderSections={renderSections} />
      ) : (
        <div className={d.layout === 'rail' && rail.length ? 'grid grid-cols-1 lg:grid-cols-3 gap-5 items-start' : 'space-y-5'}>
          <div className={d.layout === 'rail' && rail.length ? 'lg:col-span-2 space-y-5 min-w-0' : 'space-y-5 min-w-0'}>
            {/* Record header — who/what this is, in one glance. */}
            <div className={`${CARD} p-5`} data-os-record>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <h2 className="text-[19px] font-semibold text-ink truncate">{title}</h2>
                  <p className="text-[12px] text-ink-3 mt-0.5 tabular">{d.title_column ? `${row[idc]} · ` : ''}{(d.subtitle ?? []).map((c) => row[c]).filter(Boolean).join(' · ')}{ent.created && row[ent.created] ? `${d.subtitle?.length || d.title_column ? ' · ' : ''}Created ${String(row[ent.created]).slice(0, 10)}` : ''}</p>
                </div>
                <div className="flex items-center gap-2">{d.badge && row[d.badge] && <StatusBadge status={row[d.badge]} />}{statusCol && <StatusBadge status={row[statusCol]} />}</div>
              </div>
              {d.meta?.length > 0 && <div className="mt-4 pt-4 border-t border-[color:var(--hair-5)]"><MetaList items={d.meta} row={row} ent={ent} /></div>}
            </div>
            {renderSections(main)}
          </div>
          {d.layout === 'rail' && rail.length > 0 && <aside className="space-y-5 min-w-0" data-os-rail>{renderSections(rail)}</aside>}
        </div>
      )}

      {modal && modal.spec.kind === 'document' && <DocumentPreview docId={modal.spec.document} row={modal.row} data={data} open onClose={() => setModal(null)} />}
      {modal && modal.spec.kind !== 'document' && <ActionModal spec={{ entity: config.entity, ...modal.spec }} row={modal.row} open onClose={() => setModal(null)} data={data} onDone={reload} />}
    </motion.div>
  );
}
