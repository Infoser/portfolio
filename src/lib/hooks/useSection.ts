import { useEffect, useState } from 'react';
import type { SectionContent } from '@/types/sections';
import type { SectionKey } from '@/config/sections-manifest';
import { getStaticSectionContent } from '@/sections-content';
import { getSupabase, isSupabaseConfigured, type SupabaseSectionRow } from '@/lib/supabase';

const memoryCache = new Map<SectionKey, { content: SectionContent; at: number }>();
const TTL_MS = 60_000;
const inflight = new Map<SectionKey, Promise<SectionContent | undefined>>();

const isFresh = (entry: { at: number }): boolean => Date.now() - entry.at < TTL_MS;

const fetchOnce = async (key: SectionKey): Promise<SectionContent | undefined> => {
  if (inflight.has(key)) return inflight.get(key)!;

  const task = (async (): Promise<SectionContent | undefined> => {
    const supabase = await getSupabase();
    if (!supabase) return undefined;

    const { data, error } = await supabase
      .from('sections')
      .select('section_key, content, updated_by, updated_at')
      .eq('section_key', key)
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

type UseSectionResult = {
  content: SectionContent | undefined;
  isLoading: boolean;
  isLive: boolean;
};

export function useSection(key: SectionKey): UseSectionResult {
  const [state, setState] = useState<UseSectionResult>(() => {
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
      setState({ content: getStaticSectionContent(key), isLoading: false, isLive: false });
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

  return state;
}

export const clearSectionCache = (key?: SectionKey): void => {
  if (key) memoryCache.delete(key);
  else memoryCache.clear();
};
