import type { AboutRolesContent } from '@/types/sections';

// Bundled fallback used when Supabase isn't configured or no live row
// exists yet. The admin panel can override this with a custom list.
// Default prefix shown by <RoleTypewriter /> is "I am " — keep these
// roles short noun phrases that read naturally after it (e.g. the
// rendered text becomes "I am Python Developer", "I am AI Engineer",
// "I am researcher").
export const aboutRolesContent: AboutRolesContent = {
  kind: 'about_roles',
  enabled: true,
  roles: ['Python Developer', 'AI Engineer', 'researcher'],
};
