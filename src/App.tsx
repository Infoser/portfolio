import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AppProviders } from '@/app/AppProviders';
import { EditorShell } from '@/features/editor-shell';
import { ProfileImage } from '@/features/profile-image';
import { SectionRenderer } from '@/features/section';
import { SECTIONS_MANIFEST, type SectionKey } from '@/config/sections-manifest';
import { useTabsStore } from '@/store/tabs';
import { useSection } from '@/lib/hooks/useSection';
import { isSupabaseConfigured } from '@/lib/supabase';
import { BugCounter, DebugTerminal, SessionTracker } from '@/features/easter-eggs';
import Playground from '@/routes/playground';
import { NotFoundRoute } from '@/routes/not-found';

const ParticleField = lazy(() =>
  import('@/features/three-background').then((m) => ({ default: m.ParticleField })),
);
const AdminGate = lazy(() =>
  import('@/features/admin').then((m) => ({ default: m.AdminGate })),
);

const SectionView = ({ sectionKey }: { sectionKey: SectionKey }) => {
  const entry = SECTIONS_MANIFEST[sectionKey];
  const { content, isLoading, isLive } = useSection(sectionKey);
  const pageTitle = `${entry.label} — Ishan Kumar Sahu`;
  const isAbout = sectionKey === 'about';

  return (
    <article
      className={
        isAbout
          ? 'flex max-w-3xl flex-col gap-6 md:max-w-4xl md:flex-row md:items-start md:gap-8'
          : 'flex max-w-3xl flex-col gap-6'
      }
    >
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`${entry.label} — section of Ishan Kumar Sahu's portfolio.${entry.extension === 'md' ? '' : ' Read as a ' + entry.extension + ' file.'}`}
        />
      </Helmet>
      <div className={isAbout ? 'min-w-0 flex-1' : 'contents'}>
        <header className="flex flex-col gap-1">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {entry.label.toLowerCase()}.{entry.extension}
            {isSupabaseConfigured() && (
              <span className="ml-2 normal-case tracking-normal text-muted-foreground/70">
                {isLoading ? '· loading live' : isLive ? '· live' : '· using bundled'}
              </span>
            )}
          </p>
          <h2 className="font-display text-3xl font-medium tracking-tight">{entry.label}</h2>
        </header>

        {content ? (
          <SectionRenderer sectionKey={sectionKey} content={content} />
        ) : (
          <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
            Content for <span className="font-mono text-primary">{entry.label}</span> will appear
            here once you upload it via the admin panel post-deploy.
          </div>
        )}
      </div>

      {isAbout && (
        <ProfileImage src="/profile.png" alt="Ishan Kumar Sahu" />
      )}
    </article>
  );
};

const renderSection = (key: SectionKey) => <SectionView sectionKey={key} />;

function App() {
  const open = useTabsStore((s) => s.open);

  useEffect(() => {
    open('about');
  }, [open]);

  return (
    <AppProviders>
      <Helmet defaultTitle="Ishan Kumar Sahu — ML/DL researcher" titleTemplate="%s · portfolio" />
      <Suspense fallback={null}>
        <ParticleField />
      </Suspense>
      <div className="relative z-10">
        <DebugTerminal />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <EditorShell
                  renderSection={renderSection}
                  statusCenterSlot={<BugCounter />}
                  statusRightSlot={<SessionTracker />}
                />
              }
            />
          <Route path="/playground" element={<Playground />} />
          <Route
            path="/__admin__"
            element={
              <Suspense
                fallback={
                  <div className="flex min-h-dvh items-center justify-center bg-background font-mono text-sm text-muted-foreground">
                    Loading admin…
                  </div>
                }
              >
                <AdminGate />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFoundRoute />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AppProviders>
  );
}

export default App;
