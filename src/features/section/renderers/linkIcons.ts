import type { ComponentType } from 'react';
import {
  ExternalLink,
  Code2,
  Play,
  FileText,
  Mail,
  Phone,
  Download,
  Globe,
  Sparkles,
  Brain,
  CircuitBoard,
  Languages,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, HuggingfaceIcon, type BrandIconComponent } from './brandIcons';

export type IconProps = { className?: string };

/** Icon used for each renderer's structured-entry link `kind`. */
export const LINK_ICON: Record<'demo' | 'site' | 'github' | 'paper', ComponentType<IconProps>> = {
  demo: Play,
  site: ExternalLink,
  github: Code2,
  paper: FileText,
};

export const LINK_ICON_DEFAULT = ExternalLink;

/** Icon for known social channels in the Contact section. */
export const SOCIAL_ICON: Record<string, ComponentType<IconProps>> = {
  github: GithubIcon,
  huggingface: HuggingfaceIcon,
  linkedin: LinkedinIcon,
  twitter: Globe,
  website: Globe,
} satisfies Record<string, BrandIconComponent | typeof Globe>;

/** Lucide icon for each Skills category (snake_case mapping). */
export const SKILL_CATEGORY_ICON: Record<string, ComponentType<IconProps>> = {
  languages: Languages,
  ml_computer_vision: Brain,
  llms_nlp: Sparkles,
  web_backend: Globe,
  embedded_iot: CircuitBoard,
};

/** Human label for each Skills category (snake_case → Title Case). */
export const SKILL_CATEGORY_LABEL: Record<string, string> = {
  languages: 'Languages',
  ml_computer_vision: 'ML / Computer Vision',
  llms_nlp: 'LLMs / NLP',
  web_backend: 'Web & Backend',
  embedded_iot: 'Embedded / IoT',
};

/** Lucide icons used for Contact-section action buttons. */
export const CONTACT_ACTION_ICON = {
  email: Mail,
  phone: Phone,
  cv: Download,
} as const;
