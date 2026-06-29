import fs from 'fs';
import path from 'path';

interface Article {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
  section: string;
}

const contentDir = path.join(process.cwd(), 'content');
const distDir = path.join(process.cwd(), 'dist');
const sections = ['eac', 'architecture', 'knowledge', 'synthesis', 'tools', 'domains'];

const SITE_URL = 'https://indenscale.github.io';
const AUTHOR_NAME = '宋涤非 (IndenScale)';
const SITE_TITLE = 'IndenScale';
const SITE_DESC = 'Agent 架构、运营工业化、施工管理计算化。记录思考与实践。';

// Minimal gray-matter-like frontmatter parser (avoids ESM/CJS issues in scripts)
function parseFrontmatter(raw: string): { data: Record<string, any>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const frontmatter: Record<string, any> = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let value = kv[2].trim();
    // Parse arrays like [a, b, c]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = JSON.parse(value.replace(/'/g, '"'));
    }
    frontmatter[key] = value;
  }
  return { data: frontmatter, content: match[2] };
}

function getArticles(section: string): Article[] {
  const dir = path.join(contentDir, section);
  if (!fs.existsSync(dir)) return [];

  const files: string[] = [];
  function collect(dirPath: string) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md') {
        files.push(path.relative(path.join(contentDir, section), path.join(dirPath, entry.name)));
      } else if (entry.isDirectory()) {
        collect(path.join(dirPath, entry.name));
      }
    }
  }
  collect(dir);

  return files.map(fileName => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(dir, fileName);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data } = parseFrontmatter(raw);
    const titleMatch = data.title ? null : raw.match(/^#\s+(.+)$/m);
    return {
      slug,
      title: data.title || (titleMatch ? titleMatch[1].trim() : slug),
      date: data.date || '',
      description: data.description || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      content: '',
      section,
    };
  }).sort((a, b) => {
    if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
    return a.title.localeCompare(b.title);
  });
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function htmlEscape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatRfc822(date: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const d = date.getUTCDate().toString().padStart(2, '0');
  const m = months[date.getUTCMonth()];
  const y = date.getUTCFullYear();
  const h = date.getUTCHours().toString().padStart(2, '0');
  const min = date.getUTCMinutes().toString().padStart(2, '0');
  const sec = date.getUTCSeconds().toString().padStart(2, '0');
  const day = days[date.getUTCDay()];
  return `${day}, ${d} ${m} ${y} ${h}:${min}:${sec} +0000`;
}

function generateRSS(section: string, outputPath: string) {
  const articles = getArticles(section).filter(a => a.date);
  const sectionTitles: Record<string, string> = {
    eac: 'Engineering as Code',
    architecture: 'Agent 架构',
    knowledge: '运营工业化',
    synthesis: '跨层研究',
    tools: '工具',
    domains: '领域实例',
  };
  const sectionTitle = sectionTitles[section] || section;

  const now = formatRfc822(new Date());

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)} — ${escapeXml(sectionTitle)}</title>
    <link>${escapeXml(SITE_URL)}/${section}/</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${now}</lastBuildDate>
    <generator>IndenScale RSS Generator</generator>
    <atom:link href="${escapeXml(SITE_URL)}/${section}/feed.xml" rel="self" type="application/rss+xml"/>
`;

  for (const article of articles) {
    const pubDate = new Date(article.date);
    const dateStr = formatRfc822(pubDate);
    const url = `${SITE_URL}/${section}/${article.slug}/`;
    const desc = article.description ? htmlEscape(article.description) : '';

    xml += `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${dateStr}</pubDate>
      <description>${desc}</description>
      <author>${escapeXml(AUTHOR_NAME)}</author>
`;

    if (article.tags.length > 0) {
      for (const tag of article.tags) {
        xml += `      <category>${escapeXml(tag)}</category>\n`;
      }
    }

    xml += `    </item>
`;
  }

  xml += `  </channel>
</rss>`;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, xml, 'utf8');
  console.log(`  RSS feed generated: ${outputPath} (${articles.length} articles)`);
}

// Generate RSS for each section
for (const section of sections) {
  const articles = getArticles(section).filter(a => a.date);
  if (articles.length === 0) continue;
  generateRSS(section, path.join(distDir, section, 'feed.xml'));
}

// Also generate site-wide RSS
const all: Article[] = [];
for (const section of sections) {
  all.push(...getArticles(section).filter(a => a.date));
}
all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
const now = formatRfc822(new Date());
const allXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${escapeXml(SITE_URL)}/</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${now}</lastBuildDate>
    <generator>IndenScale RSS Generator</generator>
    <atom:link href="${escapeXml(SITE_URL)}/feed.xml" rel="self" type="application/rss+xml"/>
${all.map(a => {
  const pubDate = new Date(a.date);
  const dateStr = formatRfc822(pubDate);
  const url = `${SITE_URL}/${a.section}/${a.slug}/`;
  const desc = a.description ? htmlEscape(a.description) : '';
  let item = `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${dateStr}</pubDate>
      <description>${desc}</description>
      <author>${escapeXml(AUTHOR_NAME)}</author>`;
  if (a.tags.length > 0) {
    for (const tag of a.tags) {
      item += `\n      <category>${escapeXml(tag)}</category>`;
    }
  }
  return item + '\n    </item>';
}).join('\n')}
  </channel>
</rss>`;

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, 'feed.xml'), allXml, 'utf8');
console.log(`  RSS feed generated: ${path.join(distDir, 'feed.xml')} (${all.length} articles)`);

console.log('\n✓ All RSS feeds generated successfully!');
