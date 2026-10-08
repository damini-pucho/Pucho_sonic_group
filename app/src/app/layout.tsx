// src/app/layout.tsx — the root: fonts (all self-hosted), the generated tokens, the kernel CSS, antd's style registry and
// the client providers. The signed-in person is read once here from the session cookie and handed to the client tree.
import type { Metadata, Viewport } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
// IBM Plex for the Pucho login page, from node_modules (no remote request). Geist (inside the app) is in index.css.
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@/config/tokens.css';   // generated token values first, so index.css only references them
import '@/index.css';
import '@/design.css';
import Providers from '@/components/Providers';
import { currentUser } from '@/lib/auth';
import { OS, BRAND } from '@/config/os.config';

export const metadata: Metadata = {
  title: OS.name,
  description: OS.tagline,
  manifest: '/manifest.webmanifest',
  icons: { icon: '/brand/icon.svg', apple: '/brand/icon-180.png' },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: OS.name },
};
export const viewport: Viewport = { themeColor: BRAND.color, width: 'device-width', initialScale: 1 };
export const dynamic = 'force-dynamic';   // every page depends on the session cookie

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser().catch(() => null);
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <Providers user={user}>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
