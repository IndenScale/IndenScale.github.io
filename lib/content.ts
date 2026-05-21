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
const sections = ['bim', 'ops', 'architecture', 'projects'];

export function getSectionTitle(section: string): string {
  const titles: Record<string, string> = {
    bim: 'Make BIM Great Again',
    ops: '运营工业化',
    architecture: 'Agent 架构',
    projects: '项目',
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

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md') && f !== 'index.md')
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
  if (!fs.existsSync(fullPath)) return null;

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
