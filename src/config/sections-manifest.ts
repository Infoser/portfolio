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

export type FolderKey = 'projects' | 'experience';

export type ManifestEntry = {
  key: SectionKey;
  label: string;
  extension: string;
  icon: LucideIcon;
  isFolder: boolean;
  kind: SectionKind | 'folder';
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
    children: [],
  },
  projects: {
    key: 'projects',
    label: 'Projects',
    extension: 'folder',
    icon: FolderGit2,
    isFolder: true,
    kind: 'folder',
    children: [],
  },
  achievements: {
    key: 'achievements',
    label: 'Achievements',
    extension: 'md',
    icon: Trophy,
    isFolder: false,
    kind: 'markdown',
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
    extension: 'md',
    icon: GraduationCap,
    isFolder: false,
    kind: 'markdown',
  },
  leadership: {
    key: 'leadership',
    label: 'Leadership',
    extension: 'md',
    icon: Users,
    isFolder: false,
    kind: 'markdown',
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
