import { Menu } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/design-system';
import { ActivityBar } from './ActivityBar';
import { Explorer } from './Explorer';
import { TabStrip } from './TabStrip';
import { EditorArea } from './EditorArea';
import { TitleBar } from './TitleBar';
import { StatusBar } from './StatusBar';

type EditorShellProps = {
  renderSection?: (key: import('@/config/sections-manifest').SectionKey) => ReactNode;
  statusCenterSlot?: ReactNode;
  statusRightSlot?: ReactNode;
};

export function EditorShell({ renderSection, statusCenterSlot, statusRightSlot }: EditorShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      <TitleBar onOpenMenu={() => setDrawerOpen(true)} />
      <div className="relative flex min-h-0 flex-1">
        <ActivityBar />

        {/* Explorer — desktop */}
        <aside
          aria-label="File tree"
          className="hidden w-56 shrink-0 border-r border-border bg-surface md:block"
        >
          <Explorer />
        </aside>

        {/* Explorer — mobile drawer */}
        <div className="absolute left-16 top-2 z-30 md:hidden">
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Browse sections"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 font-mono text-xs"
              >
                <Menu className="size-3.5" />
                Browse Sections
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="border-b border-border p-3">
                <SheetTitle className="font-mono text-xs uppercase tracking-[0.18em]">
                  Sections
                </SheetTitle>
              </SheetHeader>
              <div className="h-full overflow-y-auto">
                <Explorer />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main pane */}
        <main className="flex min-w-0 flex-1 flex-col">
          <TabStrip />
          <EditorArea>{renderSection}</EditorArea>
        </main>
      </div>

      <StatusBar centerSlot={statusCenterSlot} rightSlot={statusRightSlot} />
    </div>
  );
}

export { ActivityBar, Explorer, TabStrip, EditorArea, TitleBar, StatusBar };
