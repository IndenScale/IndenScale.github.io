type Token = { pattern: RegExp; className: string };

const TOKENS: Token[] = [
  { pattern: /(\{\%.*?\%\}|\{\{.*?\}\}|\{#.*?#\})/g, className: 'syn-jinja' },
  { pattern: /(#.*$)/gm, className: 'syn-comment' },
  { pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, className: 'syn-string' },
  { pattern: /\b(def|class|from|import|return|for|in|if|elif|else|while|with|as|try|except|raise|pass|None|True|False|self|yield|and|or|not|is|lambda|assert|break|continue|del|finally|global|nonlocal)\b/g, className: 'syn-keyword' },
  { pattern: /(@\w+)/g, className: 'syn-decorator' },
  { pattern: /\b(\d+\.?\d*[eE]?[+-]?\d*)\b/g, className: 'syn-number' },
  { pattern: /\b([a-zA-Z_]\w*)(?=\s*\()/g, className: 'syn-function' },
];

interface Segment {
  text: string;
  className: string | null;
}

function splitByRegex(text: string, regex: RegExp, className: string): Segment[] {
  const result: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(regex.source, regex.flags);
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push({ text: text.slice(lastIndex, match.index), className: null });
    }
    result.push({ text: match[0], className });
    lastIndex = match.index + match[0].length;
    if (!re.lastIndex && match[0].length === 0) break;
  }
  if (lastIndex < text.length) {
    result.push({ text: text.slice(lastIndex), className: null });
  }
  return result;
}

function mergeSegments(segments: Segment[], token: Token): Segment[] {
  const result: Segment[] = [];
  for (const seg of segments) {
    if (seg.className !== null) {
      result.push(seg);
    } else {
      result.push(...splitByRegex(seg.text, token.pattern, token.className));
    }
  }
  return result;
}

export function highlightPython(code: string): string {
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  let segments: Segment[] = [{ text: escaped, className: null }];
  for (const token of TOKENS) {
    segments = mergeSegments(segments, token);
  }

  let html = '';
  let lineNumber = 1;
  for (const seg of segments) {
    const text = seg.text;
    if (seg.className) {
      html += `<span class="${seg.className}">${text}</span>`;
    } else {
      html += text;
    }
  }

  return html;
}

export function highlightWithLineNumbers(code: string): string {
  const lines = code.split('\n');
  return lines
    .map((line, i) => {
      const highlighted = highlightPython(line) || '&nbsp;';
      return `<span class="syn-ln">${String(i + 1).padStart(2, ' ')}</span>${highlighted}`;
    })
    .join('\n');
}
