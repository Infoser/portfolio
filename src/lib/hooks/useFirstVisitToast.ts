import { useEffect } from 'react';
import { toast } from 'sonner';

const STORAGE_KEY = 'infoser-visited';

export function useFirstVisitToast() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let visited = false;
    try {
      visited = window.sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch {
    }
    if (visited) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
    }

    toast.info('Use the file tree on the left to explore sections.', {
      duration: 6000,
      id: 'first-visit-hint',
    });
  }, []);
}
