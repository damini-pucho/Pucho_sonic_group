// src/lib/dal.ts — the data-access layer (standards §19.3): who is asking, what they may see, scoped queries, DTOs.
// Every read and every write of an entity — from a Server Component, a Server Action or a Route Handler a flow calls —
// goes through here, so one place knows the entity vocabulary (ENTITIES from os.yaml), the role → entity access map
// and the per-person scope (ACCESS, generated), the audit log and the encrypted columns.
import 'server-only';
import { randomBytes } from 'node:crypto';
import { pool, query } from './db';
import { ENTITIES } from '@/config/os.config';
import { ENTITY_ACCESS, SCOPES, PUBLIC_ENTITIES } from '@/config/access';
import { encryptField, decryptField, isCiphertext, blindIndex, encryptionConfigured } from './crypto';
import type { SessionUser } from './auth';

export type Actor = { kind: 'user'; user: SessionUser } | { kind: 'flow'; name: string } | { kind: 'public'; page: string } | { kind: 'system' };
export type Row = Record<string, string>;
type Entity = { id: { column: string; prefix: string }; columns: string[]; types?: Record<string, string>; created?: string | null; encrypted?: string[]; status?: { column: string; values: string[] } | null };
const E = ENTITIES as unknown as Record<string, Entity>;
const AUDIT = 'audit_log' in E;

export class NotFound extends Error { constructor(m = 'Not found') { super(m); } }
export class Forbidden extends Error { constructor(m = 'Not allowed') { super(m); } }

export const table = (entity: string) => `"${entity}"`;
export const col = (c: string) => `"${c.toLowerCase()}"`;
export function entityOf(name: string): Entity { const e = E[name]; if (!e) throw new NotFound(`no entity ${name}`); return e; }

/** May this actor read the entity at all? (A record they may not see is a 404, never a 403 — §14.4.) */
export function canRead(actor: Actor, entity: string): boolean {
  if (!(entity in E)) return false;
  if (actor.kind === 'system' || actor.kind === 'flow') return true;
  if (actor.kind === 'public') return ((PUBLIC_ENTITIES as unknown as Record<string, string[]>)[actor.page] ?? []).includes(entity);
  const allowed = (ENTITY_ACCESS as unknown as Record<string, string[]>)[actor.user.role] ?? [];
  return allowed.includes('*') || allowed.includes(entity);
}
/** The column a self-service role is pinned to on this entity (`Rep={{user}}` on every page it can open) — scope applies server-side. */
export function scopeOf(actor: Actor, entity: string): { column: string; value: string } | null {
  if (actor.kind !== 'user') return null;
  const s = ((SCOPES as unknown as Record<string, Record<string, string>>)[actor.user.role] ?? {})[entity];
  return s ? { column: s, value: actor.user.name } : null;
}

// ── value shaping: the kernel reads every value as a string (as it did from CSV / PostgREST); the database keeps real types ──
function fromDb(e: Entity, r: Record<string, unknown>, entity: string): Row {
  const out: Row = {};
  for (const c of e.columns) {
    const v = r[c.toLowerCase()];
    let s = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
    if (e.encrypted?.includes(c) && isCiphertext(s)) { try { s = decryptField(s, `${entity}.${c}:${r[e.id.column.toLowerCase()]}`); } catch { s = '••••'; } }
    out[c] = s;
  }
  return out;
}
function toDb(e: Entity, entity: string, row: Record<string, unknown>, id: string): { cols: string[]; vals: unknown[] } {
  const cols: string[] = []; const vals: unknown[] = [];
  for (const c of e.columns) {
    if (!(c in row)) continue;
    const raw = row[c]; const t = e.types?.[c] ?? 'text';
    let v: unknown = raw == null ? null : Array.isArray(raw) || (typeof raw === 'object') ? JSON.stringify(raw) : raw;
    if (v === '' && t !== 'text') v = null;
    if (v != null && t === 'numeric') { const n = Number(v); v = Number.isFinite(n) ? n : null; }
    if (v != null && t === 'boolean') v = ['true', '1', 'yes', 'on'].includes(String(v).toLowerCase());
    if (v != null && (t === 'date' || t === 'timestamptz') && String(v).trim() === '') v = null;
    if (v != null && e.encrypted?.includes(c)) {
      if (!encryptionConfigured()) throw new Error(`${entity}.${c} is declared encrypted but FIELD_ENC_KEYS is not set`);
      const plain = String(v); v = encryptField(plain, `${entity}.${c}:${id}`); cols.push(`${c.toLowerCase()}_bidx`); vals.push(blindIndex(plain));
    }
    cols.push(c.toLowerCase()); vals.push(v);
  }
  return { cols, vals };
}

// ── reads ──
export async function listRows(actor: Actor, entity: string): Promise<Row[]> {
  if (!canRead(actor, entity)) throw new NotFound();
  const e = entityOf(entity); const scope = scopeOf(actor, entity);
  const rows = await query<{ r: Record<string, unknown> }>(
    `SELECT row_to_json(t) AS r FROM ${table(entity)} t ${scope ? `WHERE ${col(scope.column)} = $1` : ''} ORDER BY t._seq DESC`, scope ? [scope.value] : []);
  return rows.map((x) => fromDb(e, x.r, entity));
}
export async function getRow(actor: Actor, entity: string, id: string): Promise<Row | null> {
  if (!canRead(actor, entity)) return null;
  const e = entityOf(entity); const scope = scopeOf(actor, entity);
  const rows = await query<{ r: Record<string, unknown> }>(
    `SELECT row_to_json(t) AS r FROM ${table(entity)} t WHERE ${col(e.id.column)} = $1 ${scope ? `AND ${col(scope.column)} = $2` : ''}`, scope ? [id, scope.value] : [id]);
  return rows[0] ? fromDb(e, rows[0].r, entity) : null;
}
/** Everything the actor may read, for the entities named — one round trip per entity, missing ones skipped. */
export async function loadEntities(actor: Actor, names: string[]): Promise<Record<string, Row[]>> {
  const out: Record<string, Row[]> = {};
  await Promise.all([...new Set(names)].filter((n) => n in E && canRead(actor, n)).map(async (n) => { out[n] = await listRows(actor, n); }));
  return out;
}

// ── ids: <prefix><year>-<nnnn>, numbered inside the year, under an advisory lock so two inserts never share one ──
export async function nextId(entity: string, client: { query: typeof pool.query } = pool): Promise<string> {
  const e = entityOf(entity); const year = String(new Date().getFullYear()); const sep = e.id.prefix.endsWith('-') ? '-' : '/';
  await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [entity]);
  const r = await client.query(`SELECT count(*)::int AS n FROM ${table(entity)} WHERE ${col(e.id.column)} LIKE $1`, [`${e.id.prefix}${year}${sep}%`]);
  return `${e.id.prefix}${year}${sep}${String(r.rows[0].n + 1).padStart(4, '0')}`;
}

// ── writes ──
export async function insertRows(actor: Actor, entity: string, rows: Record<string, unknown>[], opts: { flow?: string; action?: string; audit?: boolean } = {}): Promise<Row[]> {
  const e = entityOf(entity); const out: Row[] = [];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const raw of rows) {
      const row: Record<string, unknown> = {};
      for (const c of e.columns) if (c in raw) row[c] = raw[c];
      let id = String(row[e.id.column] ?? '').trim();
      if (!id) id = await nextId(entity, client);
      row[e.id.column] = id;
      if (e.created && !row[e.created]) row[e.created] = new Date().toISOString();
      const { cols, vals } = toDb(e, entity, row, id);
      const r = await client.query(
        `INSERT INTO ${table(entity)} (${cols.map((c) => `"${c}"`).join(', ')}) VALUES (${vals.map((_, i) => `$${i + 1}`).join(', ')})
         ON CONFLICT (${col(e.id.column)}) DO NOTHING RETURNING row_to_json(${table(entity)}) AS r`, vals);   // idempotent on the natural key (§15.4)
      if (r.rows[0]) out.push(fromDb(e, r.rows[0].r, entity));
    }
    await client.query('COMMIT');
  } catch (err) { await client.query('ROLLBACK'); throw err; } finally { client.release(); }
  if (opts.audit !== false) for (const r of out) await writeAudit(actor, opts.flow ?? 'direct', opts.action ?? 'insert', entity, r[e.id.column], r);
  return out;
}

export async function patchRow(actor: Actor, entity: string, id: string, patch: Record<string, unknown>, opts: { flow?: string; action?: string; audit?: boolean } = {}): Promise<Row | null> {
  const e = entityOf(entity);
  const { cols, vals } = toDb(e, entity, Object.fromEntries(Object.entries(patch).filter(([k]) => k !== e.id.column)), id);
  if (!cols.length) return getRow(actor, entity, id);
  const scope = scopeOf(actor, entity);
  const r = await query<{ r: Record<string, unknown> }>(
    `UPDATE ${table(entity)} SET ${cols.map((c, i) => `"${c}" = $${i + 1}`).join(', ')} WHERE ${col(e.id.column)} = $${cols.length + 1} ${scope ? `AND ${col(scope.column)} = $${cols.length + 2}` : ''}
     RETURNING row_to_json(${table(entity)}) AS r`, scope ? [...vals, id, scope.value] : [...vals, id]);
  if (!r[0]) return null;                                                      // a row outside the person's scope does not exist to them
  const row = fromDb(e, r[0].r, entity);
  if (opts.audit !== false) await writeAudit(actor, opts.flow ?? 'direct', opts.action ?? 'patch', entity, id, patch);
  return row;
}

/** A scheduled sync owns its whole table: clear and refill in one transaction (the Sheets `clear_sheet` + insert of v3). */
export async function replaceRows(actor: Actor, entity: string, rows: Record<string, unknown>[], opts: { flow?: string } = {}): Promise<number> {
  const e = entityOf(entity); const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`DELETE FROM ${table(entity)}`);
    let n = 0;
    for (const raw of rows) {
      const row: Record<string, unknown> = {}; for (const c of e.columns) if (c in raw) row[c] = raw[c];
      let id = String(row[e.id.column] ?? '').trim(); if (!id) id = await nextId(entity, client); row[e.id.column] = id;
      const { cols, vals } = toDb(e, entity, row, id);
      await client.query(`INSERT INTO ${table(entity)} (${cols.map((c) => `"${c}"`).join(', ')}) VALUES (${vals.map((_, i) => `$${i + 1}`).join(', ')}) ON CONFLICT (${col(e.id.column)}) DO NOTHING`, vals); n++;
    }
    await client.query('COMMIT');
    await writeAudit(actor, opts.flow ?? 'sync', 'replace', entity, '', { rows: n });
    return n;
  } catch (err) { await client.query('ROLLBACK'); throw err; } finally { client.release(); }
}

// ── audit (os.audit: true): one writer — this layer — for every write, whoever asked for it ──
export const actorName = (a: Actor) => a.kind === 'user' ? a.user.name : a.kind === 'flow' ? `flow:${a.name}` : a.kind === 'public' ? 'public form' : 'system';
export async function writeAudit(actor: Actor, flow: string, action: string, entity: string, recordId: string, payload: Record<string, unknown>) {
  if (!AUDIT || entity === 'audit_log') return;
  const summary = Object.entries(payload).filter(([k, v]) => !k.startsWith('_') && k !== 'action' && typeof v !== 'object' && String(v ?? '').trim()).slice(0, 4).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${String(v).slice(0, 40)}`).join(' · ');
  const a = E.audit_log; const row = { Audit_ID: `AUD-${Date.now().toString(36).toUpperCase()}${randomBytes(2).toString('hex').toUpperCase()}`, At: new Date().toISOString(), Who: actorName(actor), Flow: flow, Action: action, Entity: entity, Record_ID: String(recordId ?? ''), Summary: summary };
  const { cols, vals } = toDb(a, 'audit_log', row, row.Audit_ID);
  await query(`INSERT INTO "audit_log" (${cols.map((c) => `"${c}"`).join(', ')}) VALUES (${vals.map((_, i) => `$${i + 1}`).join(', ')}) ON CONFLICT DO NOTHING`, vals);
}

// ── files (D6): bytes live in the database, under the plan's cap ──
export async function storeFile(actor: Actor, f: { name: string; mime: string; data: Buffer; entity?: string; recordId?: string }): Promise<{ id: string; url: string }> {
  const maxMb = Number(process.env.FILES_MAX_MB || 10); const capMb = Number(process.env.FILES_CAP_MB || 400);
  if (f.data.length > maxMb * 1024 * 1024) throw new Error(`File is over ${maxMb} MB`);
  const used = await query<{ used: string }>('SELECT coalesce(sum(size), 0)::text AS used FROM files');
  if (Number(used[0].used) + f.data.length > capMb * 1024 * 1024) throw new Error('The storage cap for this OS is reached — delete old files or raise the plan');
  const id = `F-${randomBytes(8).toString('hex')}`;
  await query('INSERT INTO files (id, name, mime, size, data, entity, record_id, uploaded_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [id, f.name, f.mime, f.data.length, f.data, f.entity ?? null, f.recordId ?? null, actorName(actor)]);
  return { id, url: `/api/files/${id}` };
}
export async function readFile(id: string): Promise<{ name: string; mime: string; data: Buffer } | null> {
  const r = await query<{ name: string; mime: string; data: Buffer }>('SELECT name, mime, data FROM files WHERE id = $1', [id]);
  return r[0] ?? null;
}
