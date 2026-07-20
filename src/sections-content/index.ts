import type { SectionContent } from '@/types/sections';
import type { SectionKey } from '@/config/sections-manifest';
import { aboutContent } from './about';
import { experienceContent } from './experience';
import { achievementsContent } from './achievement';
import { educationContent } from './education';
import { leadershipContent } from './leadership';
import { skillsContent } from './skills';
import { contactContent } from './contact';
import { projectsContent } from './projects';

const STATIC_SECTIONS: Partial<Record<SectionKey, SectionContent>> = {
  about: aboutContent,
  experience: experienceContent,
  projects: projectsContent,
  achievements: achievementsContent,
  education: educationContent,
  leadership: leadershipContent,
  skills: skillsContent,
  contact: contactContent,
};

export const getStaticSectionContent = (key: SectionKey): SectionContent | undefined =>
  STATIC_SECTIONS[key];

export const isStaticSection = (key: SectionKey): boolean => Boolean(STATIC_SECTIONS[key]);
