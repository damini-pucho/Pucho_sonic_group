'use client';
// Providers — the client root: antd (every dropdown opens downward — config/popup.js; the gate's M4 asserts it), the
// signed-in person, the UI language, toasts, the error boundary, and the PWA service worker in production.
import { StrictMode, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { Toaster } from 'sonner';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthProvider } from '../context/AuthContext';
import { LangProvider } from '../i18n';
import ErrorFallback from './ErrorFallback';
import { THEME } from '../config/theme';
import { getPopupContainer } from '../config/popupContainer';

export default function Providers({ user, children }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);
  return (
    <StrictMode>
      <ConfigProvider getPopupContainer={getPopupContainer} theme={THEME}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <AuthProvider user={user}>
            <LangProvider>
              {children}
              <Toaster position="bottom-right" richColors />
            </LangProvider>
          </AuthProvider>
        </ErrorBoundary>
      </ConfigProvider>
    </StrictMode>
  );
}
