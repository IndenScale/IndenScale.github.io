import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Article {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
  section: string;
}

const contentDir = path.join(process.cwd(), 'content');
const sections = ['eac', 'architecture', 'knowledge', 'synthesis', 'tools', 'domains'];

export function getSectionTitle(section: string): string {
  const titles: Record<string, string> = {
    eac: 'Engineering as Code',
    architecture: 'Agent 架构',
    knowledge: '运营工业化',
    synthesis: '跨层研究',
    tools: '工具',
    domains: '领域实例',
  };
  return titles[section] || section;
}

export function getSectionDescription(section: string): string {
  const index = getArticle(section, 'index');
  return index?.description || '';
}

export function getArticles(section: string): Article[] {
  const dir = path.join(contentDir, section);
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md') {
      files.push(entry.name);
    } else if (entry.isDirectory()) {
      // Recurse into subdirectories (e.g. domains/Engineering  as Code/)
      const subdir = path.join(dir, entry.name);
      if (fs.existsSync(subdir)) {
        const subEntries = fs.readdirSync(subdir);
        for (const subEntry of subEntries) {
          if (subEntry.endsWith('.md') && subEntry !== 'index.md') {
            files.push(path.join(entry.name, subEntry));
          }
        }
      }
    }
  }

  return files
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(dir, fileName);
      const raw = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title || extractTitle(content) || slug,
        date: data.date || '',
        description: data.description || '',
        tags: data.tags || [],
        content,
        section,
      };
    })
    .sort((a, b) => {
      if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
      return a.title.localeCompare(b.title);
    });
}

export function getArticle(section: string, slug: string): Article | null {
  const fullPath = path.join(contentDir, section, `${slug}.md`);
  if (fs.existsSync(fullPath)) {
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title || extractTitle(content) || slug,
      date: data.date || '',
      description: data.description || '',
      tags: data.tags || [],
      content,
      section,
    };
  }
  // Try nested path for domains/
  const nestedPath = path.join(contentDir, section, `${slug}.md`);
  if (fs.existsSync(nestedPath)) {
    const raw = fs.readFileSync(nestedPath, 'utf8');
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title || extractTitle(content) || slug,
      date: data.date || '',
      description: data.description || '',
      tags: data.tags || [],
      content,
      section,
    };
  }
  return null;
}

export function getSectionIndex(section: string): Article | null {
  return getArticle(section, 'index');
}

export function getRecentArticles(count: number = 6): Article[] {
  const all: Article[] = [];
  for (const section of sections) {
    all.push(...getArticles(section));
  }
  return all
    .filter(a => a.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

function extractTitle(markdown: string): string | null {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

export interface CodeBlock {
  language: string;
  code: string;
}

export function extractCodeBlocks(markdown: string): CodeBlock[] {
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  const blocks: CodeBlock[] = [];
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    blocks.push({ language: match[1] || '', code: match[2].trimEnd() });
  }
  return blocks;
}

export function extractFirstCodeBlock(section: string, slug: string, language?: string, maxLines?: number): CodeBlock | null {
  const article = getArticle(section, slug);
  if (!article) return null;
  const blocks = extractCodeBlocks(article.content);
  let block = language
    ? blocks.find(b => b.language === language) || null
    : blocks[0] || null;
  if (block && maxLines) {
    const lines = block.code.split('\n');
    if (lines.length > maxLines) {
      block = {
        ...block,
        code: lines.slice(0, maxLines).join('\n') + '\n...',
      };
    }
  }
  return block;
}

export function getExcerpt(content: string, maxLength: number = 120): string {
  const plainText = content
    .replace(/#+ /g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength).replace(/\s+\S*$/, '') + '...';
}
