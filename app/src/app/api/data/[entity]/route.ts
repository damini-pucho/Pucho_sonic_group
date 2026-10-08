// /api/data/<entity> — the door a Studio flow writes through (standards §8.1, §15.4; decision D4: Studio reads the
// database with its read-only `studio_reader` role, but every write goes through here, under the same DAL rules as a
// person's request). INBOUND_TOKEN must be presented; unset means closed. The query shape is PostgREST's, so the
// emitter's http nodes did not have to change: GET ?select=* · POST [rows] (idempotent on the id) · PATCH ?<Id>=eq.<v>
// · POST ?mode=replace (a scheduled sync owning its whole table).
import { z } from 'zod';
import { inboundAllowed, inboundToken } from '@/lib/auth';
import { listRows, insertRows, patchRow, replaceRows, NotFound, type Actor } from '@/lib/dal';
import { ENTITIES } from '@/config/os.config';

export const dynamic = 'force-dynamic';
const Params = z.object({ entity: z.string().regex(/^[a-z][a-z0-9_]*$/) });
const closed = () => Response.json({ error: 'closed' }, { status: 403 });
// the actor names the flow (X-Flow header) and the token variable that let it in (S8: a leaked token is traceable to one flow)
const actorOf = (req: Request): Actor => ({ kind: 'flow', name: `${(req.headers.get('x-flow') || 'studio').slice(0, 60)}${inboundToken(req) && inboundToken(req) !== 'INBOUND_TOKEN' ? ` [${inboundToken(req)}]` : ''}`.slice(0, 80) });

function rowSchema(entity: string) {
  const e = (ENTITIES as any)[entity];
  return z.object(Object.fromEntries(e.columns.map((c: string) => [c, z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(z.unknown()), z.record(z.unknown())]).optional()]))).strict();
}

export async function GET(req: Request, ctx: { params: Promise<{ entity: string }> }) {
  if (!inboundAllowed(req)) return closed();
  const p = Params.safeParse(await ctx.params); if (!p.success || !(p.data.entity in (ENTITIES as any))) return Response.json({ error: 'not found' }, { status: 404 });
  try { return Response.json(await listRows(actorOf(req), p.data.entity)); } catch (e) { return e instanceof NotFound ? Response.json({ error: 'not found' }, { status: 404 }) : Response.json({ error: 'failed' }, { status: 500 }); }
}

export async function POST(req: Request, ctx: { params: Promise<{ entity: string }> }) {
  if (!inboundAllowed(req)) return closed();
  const p = Params.safeParse(await ctx.params); if (!p.success || !(p.data.entity in (ENTITIES as any))) return Response.json({ error: 'not found' }, { status: 404 });
  let body: unknown; try { body = await req.json(); } catch { return Response.json({ error: 'body must be JSON' }, { status: 400 }); }
  const rows = z.array(rowSchema(p.data.entity)).max(5000).safeParse(Array.isArray(body) ? body : [body]);
  if (!rows.success) return Response.json({ error: 'invalid rows', detail: rows.error.issues.slice(0, 5).map((i) => `${i.path.join('.')}: ${i.message}`) }, { status: 400 });
  const mode = new URL(req.url).searchParams.get('mode');
  const actor = actorOf(req); const flow = actor.kind === 'flow' ? actor.name : 'studio';
  try {
    if (mode === 'replace') return Response.json({ ok: true, rows: await replaceRows(actor, p.data.entity, rows.data as any, { flow }) });
    const out = await insertRows(actor, p.data.entity, rows.data as any, { flow, action: 'insert' });
    return Response.json(out, { status: 201 });
  } catch (e) { console.error('api/data POST', (e as Error).message); return Response.json({ error: 'failed' }, { status: 500 }); }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ entity: string }> }) {
  if (!inboundAllowed(req)) return closed();
  const p = Params.safeParse(await ctx.params); if (!p.success || !(p.data.entity in (ENTITIES as any))) return Response.json({ error: 'not found' }, { status: 404 });
  const e = (ENTITIES as any)[p.data.entity]; const q = new URL(req.url).searchParams.get(e.id.column) || '';
  const id = q.startsWith('eq.') ? q.slice(3) : q;
  if (!id) return Response.json({ error: `?${e.id.column}=eq.<id> is required` }, { status: 400 });
  let body: unknown; try { body = await req.json(); } catch { return Response.json({ error: 'body must be JSON' }, { status: 400 }); }
  const patch = rowSchema(p.data.entity).safeParse(body);
  if (!patch.success) return Response.json({ error: 'invalid patch' }, { status: 400 });
  const actor = actorOf(req);
  try {
    const row = await patchRow(actor, p.data.entity, id, patch.data as any, { flow: actor.kind === 'flow' ? actor.name : 'studio', action: 'patch' });
    return row ? Response.json([row]) : Response.json({ error: 'not found' }, { status: 404 });
  } catch (e) { console.error('api/data PATCH', (e as Error).message); return Response.json({ error: 'failed' }, { status: 500 }); }
}
