import { SECTIONS_MANIFEST, type SectionKey } from '@/config/sections-manifest';
import type { SectionContent } from '@/types/sections';
import { MarkdownRenderer } from './renderers/MarkdownRenderer';
import { JsonRenderer } from './renderers/JsonRenderer';
import { TomlRenderer } from './renderers/TomlRenderer';
import { StructuredListRenderer } from './renderers/StructuredListRenderer';
import { ProjectRenderer } from './renderers/ProjectRenderer';
import { SkillsRenderer } from './renderers/SkillsRenderer';
import { ContactRenderer } from './renderers/ContactRenderer';

type SectionRendererProps = {
  sectionKey: SectionKey;
  content: SectionContent;
};

export function SectionRenderer({ sectionKey, content }: SectionRendererProps) {
  const entry = SECTIONS_MANIFEST[sectionKey];

  switch (content.kind) {
    case 'markdown':
      return <MarkdownRenderer body={content.body} />;
    case 'json':
      if (sectionKey === 'skills') {
        return (
          <SkillsRenderer
            data={content.data as Record<string, unknown>}
          />
        );
      }
      return <JsonRenderer data={content.data} />;
    case 'toml':
      if (sectionKey === 'contact') {
        return (
          <ContactRenderer
            data={content.data as Record<string, unknown>}
          />
        );
      }
      return <TomlRenderer data={content.data} />;
    case 'structured-list':
      if (sectionKey === 'projects') {
        return (
          <ProjectRenderer
            entries={content.entries}
            emptyMessage="No projects wired yet. They will appear here once the admin uploads them."
          />
        );
      }
      return (
        <StructuredListRenderer
          entries={content.entries}
          emptyMessage={`No ${entry.label.toLowerCase()} entries wired yet. They will appear here once the admin uploads them.`}
        />
      );
    default:
      return null;
  }
}
