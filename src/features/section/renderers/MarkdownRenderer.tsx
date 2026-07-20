import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

type MarkdownRendererProps = {
  body: string;
  className?: string;
};

export function MarkdownRenderer({ body, className }: MarkdownRendererProps) {
  return (
    <div
      className={
        'prose prose-headings:font-display prose-headings:tracking-tight prose-h2:text-2xl prose-h2:font-medium prose-p:text-sm prose-p:leading-relaxed prose-a:text-primary prose-a:underline prose-a:decoration-dotted prose-a:underline-offset-4 prose-a:hover:opacity-80 prose-code:rounded prose-code:bg-code-bg prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-xs prose-code:before:content-none prose-code:after:content-none prose-pre:bg-code-bg prose-pre:text-code-foreground prose-pre:rounded-md prose-pre:border prose-pre:border-border prose-pre:font-mono prose-pre:text-xs prose-img:rounded-md prose-img:border prose-img:border-border prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-strong:text-foreground max-w-prose ' +
        (className ?? '')
      }
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {body}
      </ReactMarkdown>
    </div>
  );
}
