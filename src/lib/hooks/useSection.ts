import { useEffect, useRef, useState } from 'react';
import type { SectionContent } from '@/types/sections';
import type { AdminSectionKey, SectionKey } from '@/config/sections-manifest';
import { getStaticSectionContent } from '@/sections-content';
import { getSupabase, isSupabaseConfigured, type SupabaseSectionRow } from '@/lib/supabase';

const memoryCache = new Map<AdminSectionKey, { content: SectionContent; at: number }>();
const TTL_MS = 60_000;
const inflight = new Map<AdminSectionKey, Promise<SectionContent | undefined>>();

const isFresh = (entry: { at: number }): boolean => Date.now() - entry.at < TTL_MS;

const normalizeKey = (key: AdminSectionKey): string => key;

const fetchOnce = async (key: AdminSectionKey): Promise<SectionContent | undefined> => {
  if (inflight.has(key)) return inflight.get(key)!;

  const task = (async (): Promise<SectionContent | undefined> => {
    const supabase = await getSupabase();
    if (!supabase) return undefined;

    const { data, error } = await supabase
      .from('sections')
      .select('section_key, content, updated_by, updated_at')
      .eq('section_key', normalizeKey(key))
      .maybeSingle();

    if (error) {
      console.warn(`[useSection] fetch failed for ${key}:`, error.message);
      return undefined;
    }

    if (!data) return undefined;
    return (data as SupabaseSectionRow).content as SectionContent;
  })();

  inflight.set(key, task);
  try {
    const result = await task;
    if (result) {
      memoryCache.set(key, { content: result, at: Date.now() });
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
      return { content: cached.content, isLoading: false, isLive: true };
    }
    return {
      content: getStaticSectionContent(key),
      isLoading: isSupabaseConfigured(),
      isLive: false,
    };
  });

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setState({
        content: getStaticSectionContent(key),
        isLoading: false,
        isLive: false,
      });
      return;
    }

    let cancelled = false;
    const cached = memoryCache.get(key);
    if (cached && isFresh(cached)) {
      setState({ content: cached.content, isLoading: false, isLive: true });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));
    fetchOnce(key).then((live) => {
      if (cancelled) return;
      if (live) {
        setState({ content: live, isLoading: false, isLive: true });
      } else {
        setState({
          content: getStaticSectionContent(key),
          isLoading: false,
          isLive: false,
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
        setState({ content: fallback, isLoading: false, isLive: false });
        return fallback;
      }
      setState((prev) => ({ ...prev, isLoading: true }));
      const live = await fetchOnce(k);
      if (live) {
        setState({ content: live, isLoading: false, isLive: true });
      } else {
        setState({
          content: getStaticSectionContent(k),
          isLoading: false,
          isLive: false,
        });
      }
      return live;
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
