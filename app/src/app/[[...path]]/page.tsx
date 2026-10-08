// src/app/[[...path]]/page.tsx — every OS page is served here: the route is matched against os.yaml's pages (routes are
// data), the person is required and authorised on the SERVER (standards §19.3 — the sidebar hiding a page is not the
// guard), the rows the page reads are loaded through the DAL under that person's scope, and the kernel renders them.
import { notFound, redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { loadEntities, type Actor } from '@/lib/dal';
import { wiring } from '@/lib/flows';
import { matchRoute, entitiesOf, permitted } from '@/lib/routes';
import { PAGES } from '@/config/pages';
import { homeFor } from '@/config/roles';
import { HEADER } from '@/config/os.config';
import AppShell from '@/components/AppShell';
import PublicShell from '@/components/PublicShell';

export const dynamic = 'force-dynamic';

export default async function OsPage({ params }: { params: Promise<{ path?: string[] }> }) {
  // Next hands each segment decoded; an id with a slash in it (DSC/QUO/006/2026-27) must stay ONE segment for the route pattern,
  // so each is re-encoded here and matchRoute decodes the named params back.
  const path = '/' + ((await params).path ?? []).map((seg) => encodeURIComponent(seg)).join('/');
  const hit = matchRoute(path);
  if (hit?.page.public) {
    const actor: Actor = { kind: 'public', page: hit.page.id };
    const data = await loadEntities(actor, entitiesOf(hit.page));
    return <PublicShell config={hit.page} data={data} params={hit.params} />;
  }
  const user = await currentUser();
  if (!user) redirect(`/login${path !== '/' ? `?next=${encodeURIComponent(path)}` : ''}`);
  if (!hit) { if (path === '/') redirect(homeFor(user.role)); notFound(); }
  if (!permitted(user.role, hit.page.id)) { const home = homeFor(user.role); if (home !== path) redirect(home); notFound(); }
  const actor: Actor = { kind: 'user', user };
  // the page's own entities, plus what the shell shows on every page: nav badges, header search and notifications
  const wanted = [...entitiesOf(hit.page), ...PAGES.filter((p: any) => p.badge && typeof p.badge === 'object').map((p: any) => p.badge.entity),
                  ...((HEADER as any).search ?? []).map((h: any) => h.entity), ...((HEADER as any).notifications ?? []).map((h: any) => h.entity)];
  const data = await loadEntities(actor, wanted);
  return <AppShell config={hit.page} kind={hit.kind} data={data} params={hit.params} wiring={wiring()} />;
}
