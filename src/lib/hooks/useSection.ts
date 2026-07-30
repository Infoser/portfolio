import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { SectionContent } from '@/types/sections';
import type { AdminSectionKey, SectionKey } from '@/config/sections-manifest';
import { getStaticSectionContent } from '@/sections-content';
import { getSupabase, isSupabaseConfigured, type SupabaseSectionRow } from '@/lib/supabase';

const memoryCache = new Map<AdminSectionKey, { content: SectionContent; at: number }>();
const TTL_MS = 60_000;
const inflight = new Map<AdminSectionKey, Promise<FetchResult>>();

const isFresh = (entry: { at: number }): boolean => Date.now() - entry.at < TTL_MS;

const normalizeKey = (key: AdminSectionKey): string => key;

type FetchResult =
  | { ok: true; content: SectionContent }
  | { ok: false; reason: 'no-config' | 'no-row' | 'error'; error?: string };

const fetchOnce = async (key: AdminSectionKey): Promise<FetchResult> => {
  const existing = inflight.get(key);
  if (existing) return existing;

  const task = (async (): Promise<FetchResult> => {
    const supabase = await getSupabase();
    if (!supabase) return { ok: false, reason: 'no-config' };

    const { data, error } = await supabase
      .from('sections')
      .select('section_key, content, updated_by, updated_at')
      .eq('section_key', normalizeKey(key))
      .maybeSingle();

    if (error) {
      console.warn(`[useSection] fetch failed for ${key}:`, error.message);
      return { ok: false, reason: 'error', error: error.message };
    }

    if (!data) return { ok: false, reason: 'no-row' };
    return { ok: true, content: (data as SupabaseSectionRow).content as SectionContent };
  })();

  inflight.set(key, task);
  try {
    const result = await task;
    if (result.ok) {
      memoryCache.set(key, { content: result.content, at: Date.now() });
    }
    return result;
  } finally {
    inflight.delete(key);
  }
};

type UseSectionState = {
  content: SectionContent | undefined;
  isLoading: boolean;
  isLive: boolean;
  /** Non-null only when the live fetch returned an error (NOT when there
   * simply is no Supabase configured or no row — those are silent fallback
   * to bundled static content). Surfaces broken live-data layer to the
   * caller so it isn't serving stale content indefinitely with no signal. */
  error: string | null;
};

export type UseSectionResult = UseSectionState & {
  /** Force a fresh fetch that bypasses the in-memory TTL cache, and update
   * this hook's state when the result arrives. Returns the fetched content
   * (or undefined on failure). Safe to call after a save to refresh the
   * admin live-preview pane. */
  refetch: () => Promise<SectionContent | undefined>;
};

export function useSection(key: AdminSectionKey): UseSectionResult {
  const [state, setState] = useState<UseSectionState>(() => {
    const cached = memoryCache.get(key);
    if (cached && isFresh(cached)) {
      return { content: cached.content, isLoading: false, isLive: true, error: null };
    }
    return {
      content: getStaticSectionContent(key),
      isLoading: isSupabaseConfigured(),
      isLive: false,
      error: null,
    };
  });

  // One-shot toast: fire once per transition into a non-null error state,
  // not on every re-render. We dedupe by remembering the last error string
  // we already toasted. Reset when the error clears or changes.
  const lastToastedRef = useRef<string | null>(null);
  useEffect(() => {
    if (state.error && state.error !== lastToastedRef.current) {
      lastToastedRef.current = state.error;
      toast.error(`Live data unavailable for "${key}": ${state.error}. Using bundled content.`);
    } else if (!state.error) {
      lastToastedRef.current = null;
    }
  }, [state.error, key]);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setState({
        content: getStaticSectionContent(key),
        isLoading: false,
        isLive: false,
        error: null,
      });
      return;
    }

    let cancelled = false;
    const cached = memoryCache.get(key);
    if (cached && isFresh(cached)) {
      setState({ content: cached.content, isLoading: false, isLive: true, error: null });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));
    fetchOnce(key).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setState({ content: result.content, isLoading: false, isLive: true, error: null });
      } else {
        setState({
          content: getStaticSectionContent(key),
          isLoading: false,
          isLive: false,
          // No-row and no-config are benign (silent fallback, not an error);
          // surface only genuine fetch errors so the toaster isn't noisy.
          error: result.reason === 'error' ? (result.error ?? 'fetch error') : null,
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [key]);

  // `refetch` identity must stay stable for downstream useEffect deps. The
  // latest key is captured via a ref so the closure can stay referentially
  // stable across renders without firing stale-key fetches when the
  // consumer changes key on the same hook instance.
  const keyRef = useRef(key);
  keyRef.current = key;
  const refetchRef = useRef<(() => Promise<SectionContent | undefined>) | null>(null);
  if (!refetchRef.current) {
    refetchRef.current = async () => {
      const k = keyRef.current;
      memoryCache.delete(k);
      if (!isSupabaseConfigured()) {
        const fallback = getStaticSectionContent(k);
        setState({ content: fallback, isLoading: false, isLive: false, error: null });
        return fallback;
      }
      setState((prev) => ({ ...prev, isLoading: true }));
      const result = await fetchOnce(k);
      if (result.ok) {
        setState({ content: result.content, isLoading: false, isLive: true, error: null });
        return result.content;
      }
      setState({
        content: getStaticSectionContent(k),
        isLoading: false,
        isLive: false,
        error: result.reason === 'error' ? (result.error ?? 'fetch error') : null,
      });
      return undefined;
    };
  }

  return { ...state, refetch: refetchRef.current };
}

export function useSectionStrict(key: AdminSectionKey): UseSectionResult {
  return useSection(key);
}

export type { SectionKey };

export const clearSectionCache = (key?: AdminSectionKey): void => {
  if (key) memoryCache.delete(key);
  else memoryCache.clear();
};
