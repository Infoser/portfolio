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

export type SectionKind = 'markdown' | 'json' | 'toml' | 'structured-list';

export type FolderKey = 'projects' | 'experience' | 'achievements' | 'education' | 'leadership';

export type ManifestEntry = {
  key: SectionKey;
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
