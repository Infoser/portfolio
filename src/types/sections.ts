import type { SectionKind } from '@/config/sections-manifest';

export type MarkdownContent = {
  kind: 'markdown';
  body: string;
};

export type JsonContent = {
  kind: 'json';
  data: unknown;
};

export type TomlContent = {
  kind: 'toml';
  data: Record<string, unknown>;
};

export type StructuredEntryBase = {
  id: string;
  title: string;
  subtitle?: string;
  start?: string;
  end?: string;
  location?: string;
  bullets?: string[];
  links?: Array<{ label: string; href: string; kind?: 'demo' | 'site' | 'github' | 'paper' | 'read-more' }>;
  imageUrl?: string;
  tags?: string[];
};

export type StructuredListContent<TMeta = Record<string, unknown>> = {
  kind: 'structured-list';
  entries: StructuredEntryBase[];
  meta?: TMeta;
};

export type SectionContent =
  | MarkdownContent
  | JsonContent
  | TomlContent
  | StructuredListContent;

export type SectionContentTypeMap = {
  markdown: MarkdownContent;
  json: JsonContent;
  toml: TomlContent;
  'structured-list': StructuredListContent;
};

export type SectionContentFor<K extends SectionKind> = K extends keyof SectionContentTypeMap
  ? SectionContentTypeMap[K]
  : MarkdownContent;
