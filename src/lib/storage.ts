import { getSupabase } from '@/lib/supabase';

const BUCKET = 'section-images';

export async function uploadSectionImage(
  file: File,
  sectionKey: string,
): Promise<string> {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');

  const ext = file.name.split('.').pop() ?? 'bin';
  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  const path = `${sectionKey}/${Date.now()}-${safeName || `upload.${ext}`}`;

  const { error: upsertError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type || undefined });
  if (upsertError) throw upsertError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteSectionImage(publicUrl: string): Promise<void> {
  const supabase = await getSupabase();
  if (!supabase) return;
  try {
    const url = new URL(publicUrl);
    const path = url.pathname.split(`/object/${BUCKET}/`)[1];
    if (!path) return;
    await supabase.storage.from(BUCKET).remove([decodeURIComponent(path)]);
  } catch {
    /* best effort */
  }
}
