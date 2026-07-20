import { getSupabase } from '@/lib/supabase';

export type AdminSession = {
  userId: string;
  email: string;
};

export async function adminSignIn(email: string, password: string): Promise<AdminSession> {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error('Sign-in succeeded but no user returned.');
  return { userId: data.user.id, email: data.user.email ?? email };
}

export async function adminSignOut(): Promise<void> {
  const supabase = await getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user) return null;
  return { userId: user.id, email: user.email ?? '' };
}

export async function updateSectionContent(
  sectionKey: string,
  content: unknown,
): Promise<void> {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');
  const session = await getAdminSession();
  if (!session) throw new Error('Must be signed in as admin to save content.');

  const { error } = await supabase
    .from('sections')
    .upsert(
      { section_key: sectionKey, content, updated_by: session.userId, updated_at: new Date().toISOString() },
      { onConflict: 'section_key' },
    );
  if (error) throw error;
}
