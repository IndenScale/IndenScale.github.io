import { highlightWithLineNumbers } from '@/lib/syntax';

interface CodeSnippetProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeSnippet({ code, language = 'python', filename }: CodeSnippetProps) {
  if (!code) return null;

  const highlighted = highlightWithLineNumbers(code);

  return (
    <div className="glass-surface glass-edge rounded-2xl overflow-hidden">
      {/* Chrome — monochrome dots */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card/50">
        <span className="term-dot term-dot-red" aria-hidden />
        <span className="term-dot term-dot-yellow" aria-hidden />
        <span className="term-dot term-dot-green" aria-hidden />
        {filename && (
          <span className="ml-2 text-xs font-mono text-muted-foreground">
            {filename}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 overflow-x-auto text-sm leading-relaxed" style={{ background: 'var(--code-bg)', color: 'var(--code-fg)' }}>
        <code
          dangerouslySetInnerHTML={{ __html: highlighted }}
          role="code"
          aria-label={`${language} code snippet`}
          className="block font-mono whitespace-pre"
        />
      </div>
    </div>
  );
}
