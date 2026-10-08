// Header — page title (a one-line subtitle only when the page declares `subtitle:`; `desc` is for the sidebar
// tooltip and docs, not for people), global search in the centre, and on the right the Demo-data / simulated pill, the
// install pill, the language switch and the notifications bell. No avatar and no name here: the account menu (Profile &
// settings · Sign out) is the profile at the bottom-left of the shell (Sidebar.jsx ProfileMenu) — one place, the way Pucho does it
// (Haresh review Oct 2026, UI 1–3, 10). The app name lives on the login page and the rail mark, not here.
// `design.header.style`: blur (translucent, default) | flat.
import { useLocation } from '../lib/router';
import { useEntrance } from '../hooks/useGsapMotion';
import { metaForPath } from '../config/nav';
import HeaderTools from './HeaderTools';
import { cn } from '../utils/cn';
import { DESIGN } from '../config/design';
import { useT, LanguageSwitch } from '../i18n';
import InstallPrompt from './InstallPrompt';

export default function Header({ onMenuClick, wiring }) {
  const { pathname } = useLocation(); const meta = metaForPath(pathname);
  const titleRef = useEntrance([pathname], { y: 10, x: -8, duration: 0.4 });
  const t = useT(); const flat = (DESIGN.header ?? {}).style === 'flat';
  return (
    <header data-os-header={flat ? 'flat' : 'blur'} className={cn('sticky top-0 z-20 w-full border-b border-surface-border grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center page-gutter h-[56px] gap-3', flat ? 'app-canvas' : 'backdrop-blur-xl')}
      style={{ background: flat ? 'var(--bg)' : 'color-mix(in srgb, var(--surface) 90%, transparent)' }}>
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onMenuClick} aria-label="Open menu" className="lg:hidden btn-ghost w-11 h-11 flex items-center justify-center -ml-2.5 rounded-lg shrink-0"><svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={2} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg></button>
        <div ref={titleRef} className="flex flex-col min-w-0"><h1 className="text-[16px] font-semibold text-ink tracking-tight truncate">{t(meta.label)}</h1>{meta.subtitle && <p className="text-[12px] text-ink-3 hidden sm:block truncate">{t(meta.subtitle)}</p>}</div>
      </div>
      {/* centre slot: global search (UI 10) — HeaderTools renders the search here and the bell on the right */}
      <div className="flex items-center justify-center min-w-0"><HeaderTools slot="search" /></div>
      <div className="flex items-center justify-end gap-2 min-w-0">
        {wiring && wiring.total > 0 && wiring.wired < wiring.total && <span data-os-simulated={wiring.total - wiring.wired} title={`Not wired yet: ${(wiring.unwired || []).join(', ')} — the app applies these actions itself until the workflow URL is set (docs/security.md)`} className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-[var(--r-6)] bg-warn-soft text-warn-text"><span className="w-1.5 h-1.5 rounded-full bg-warn" />{wiring.wired === 0 ? 'Workflows simulated' : `${wiring.total - wiring.wired} of ${wiring.total} workflows simulated`}</span>}
        <InstallPrompt />
        <LanguageSwitch />
        <HeaderTools slot="tools" />
      </div>
    </header>
  );
}
