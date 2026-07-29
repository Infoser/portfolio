import type { SectionContent } from '@/types/sections';
import type { AdminSectionKey, SectionKey } from '@/config/sections-manifest';
import { aboutContent } from './about';
import { experienceContent } from './experience';
import { achievementsContent } from './achievement';
import { educationContent } from './education';
import { leadershipContent } from './leadership';
import { skillsContent } from './skills';
import { contactContent } from './contact';
import { projectsContent } from './projects';
import { siteBannerContent } from './site-banner';

const STATIC_SECTIONS: Partial<Record<AdminSectionKey, SectionContent>> = {
  about: aboutContent,
  experience: experienceContent,
  projects: projectsContent,
  achievements: achievementsContent,
  education: educationContent,
  leadership: leadershipContent,
  skills: skillsContent,
  contact: contactContent,
  site_banner: siteBannerContent,
};

export const getStaticSectionContent = (key: AdminSectionKey): SectionContent | undefined =>
  STATIC_SECTIONS[key];

export const isStaticSection = (key: AdminSectionKey): boolean => Boolean(STATIC_SECTIONS[key]);

export const getSectionContent = (key: SectionKey): SectionContent | undefined =>
  STATIC_SECTIONS[key] as SectionContent | undefined;
