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

/**
 * Extract the storage object path (the part passed to .remove([...]))
 * from a Supabase public URL or signed URL.
 *
 * Supabase v2 storage URLs have the shape:
 *   https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
 *   https://<project>.supabase.co/storage/v1/object/sign/<bucket>/<path>?...
 *   https://<project>.supabase.co/storage/v1/render/image/public/<bucket>/<path>
 *
 * The previous implementation split on `/object/${BUCKET}/` (e.g.
 * `/object/section-images/`), which never appears in the URL — the actual
 * substring between `object` and the bucket name is `/public/`. As a result
 * `path` was always undefined and the remove call was skipped, leaving
 * orphaned objects in the bucket.
 */
const extractStoragePath = (publicUrl: string, bucket: string): string | null => {
  let url: URL;
  try {
    url = new URL(publicUrl);
  } catch {
    return null;
  }
  const pathname = decodeURIComponent(url.pathname);
  // Match: .../object/{public|sign}/<bucket>/<rest> or ...
  // .../render/image/public/<bucket>/<rest>
  const patterns = [
    new RegExp(`/object/(?:public|sign)/${bucket}/(.+)$`, 'i'),
    new RegExp(`/render/image/(?:public|sign)/${bucket}/(.+)$`, 'i'),
  ];
  for (const re of patterns) {
    const m = pathname.match(re);
    if (m && m[1]) return m[1];
  }
  return null;
};

export async function deleteSectionImage(publicUrl: string): Promise<void> {
  const supabase = await getSupabase();
  if (!supabase) return;
  try {
    const path = extractStoragePath(publicUrl, BUCKET);
    if (!path) {
      console.warn(`[storage] could not parse object path from URL: ${publicUrl}`);
      return;
    }
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) console.warn(`[storage] remove failed for ${path}: ${error.message}`);
  } catch (err) {
    // best effort — but log so silent failure is observable
    console.warn('[storage] deleteSectionImage threw:', err);
  }
}
