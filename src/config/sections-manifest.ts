import type { LucideIcon } from 'lucide-react';
import {
  User,
  Briefcase,
  FolderGit2,
  Trophy,
  Code2,
  GraduationCap,
  Users,
  Mail,
  Megaphone,
  Type,
} from 'lucide-react';

export type SectionKey =
  | 'about'
  | 'experience'
  | 'projects'
  | 'achievements'
  | 'skills'
  | 'education'
  | 'leadership'
  | 'contact';

export type SectionKind = 'markdown' | 'json' | 'toml' | 'structured-list' | 'banner' | 'about_roles';

export type FolderKey = 'projects' | 'experience' | 'achievements' | 'education' | 'leadership';

/**
 * Extra manifest keys that participate in admin editing / site settings but
 * are NOT shown in the public section explorer. Rendered as the same kind of
 * row in the admin nav, and dispatched to a dedicated editor.
 */
export type MetaKey = 'site_banner' | 'about_roles';

export type AdminSectionKey = SectionKey | MetaKey;

export type ManifestEntry = {
  key: AdminSectionKey;
  label: string;
  extension: string;
  icon: LucideIcon;
  isFolder: boolean;
  kind: SectionKind | 'folder';
  /**
   * For structured-list sections that should render as a collapsible folder
   * in the Explorer. When true, the Explorer reads the list's entry titles
   * and renders them as children at render time (no extra section keys needed).
   */
  inlineChildren?: boolean;
  /** Legacy explicit children (unused now, kept for backward type compat). */
  children?: SectionKey[];
};

export const SECTIONS_MANIFEST: Record<SectionKey, ManifestEntry> = {
  about: {
    key: 'about',
    label: 'About',
    extension: 'md',
    icon: User,
    isFolder: false,
    kind: 'markdown',
  },
  experience: {
    key: 'experience',
    label: 'Experience',
    extension: 'folder',
    icon: Briefcase,
    isFolder: true,
    kind: 'folder',
    inlineChildren: true,
  },
  projects: {
    key: 'projects',
    label: 'Projects',
    extension: 'folder',
    icon: FolderGit2,
    isFolder: true,
    kind: 'folder',
    inlineChildren: true,
  },
  achievements: {
    key: 'achievements',
    label: 'Achievements',
    extension: 'folder',
    icon: Trophy,
    isFolder: true,
    kind: 'folder',
    inlineChildren: true,
  },
  skills: {
    key: 'skills',
    label: 'Skills',
    extension: 'json',
    icon: Code2,
    isFolder: false,
    kind: 'json',
  },
  education: {
    key: 'education',
    label: 'Education',
    extension: 'folder',
    icon: GraduationCap,
    isFolder: true,
    kind: 'folder',
    inlineChildren: true,
  },
  leadership: {
    key: 'leadership',
    label: 'Leadership',
    extension: 'folder',
    icon: Users,
    isFolder: true,
    kind: 'folder',
    inlineChildren: true,
  },
  contact: {
    key: 'contact',
    label: 'Contact',
    extension: 'toml',
    icon: Mail,
    isFolder: false,
    kind: 'toml',
  },
};

export const SECTION_KEYS = Object.keys(SECTIONS_MANIFEST) as SectionKey[];

export const getManifestEntry = (key: SectionKey): ManifestEntry => SECTIONS_MANIFEST[key];

export const isFolderKey = (key: SectionKey): key is FolderKey =>
  SECTIONS_MANIFEST[key].isFolder;

/**
 * Manifest entries for admin-only "site settings" rows. These reuse the same
 * `sections` Supabase table (the `content` JSONB column holds the banner
 * payload), but are never rendered in the public Explorer. The SiteBanner
 * feature reads `site_banner` from this manifest indirectly via useSection.
 */
export const META_MANIFEST: Record<MetaKey, ManifestEntry> = {
  site_banner: {
    key: 'site_banner',
    label: 'Site Banner',
    extension: 'json',
    icon: Megaphone,
    isFolder: false,
    kind: 'banner',
  },
  about_roles: {
    key: 'about_roles',
    label: 'About Roles',
    extension: 'json',
    icon: Type,
    isFolder: false,
    kind: 'about_roles',
  },
};

export const META_KEYS = Object.keys(META_MANIFEST) as MetaKey[];

export const getMetaManifestEntry = (key: MetaKey): ManifestEntry => META_MANIFEST[key];

export const getAdminManifestEntry = (key: AdminSectionKey): ManifestEntry =>
  key in SECTIONS_MANIFEST
    ? SECTIONS_MANIFEST[key as SectionKey]
    : META_MANIFEST[key as MetaKey];
