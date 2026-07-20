import { type ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { TooltipProvider } from '@/design-system/components/tooltip';
import { Toaster } from '@/design-system/components/sonner';
import { ThemeProvider } from '@/design-system/ThemeProvider';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <TooltipProvider delayDuration={200} skipDelayDuration={300}>
          {children}
          <Toaster position="bottom-right" />
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
