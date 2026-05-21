import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticle, getArticles, getSectionTitle } from "@/lib/content";
import { remark } from "remark";
import html from "remark-html";

interface Props {
  params: Promise<{ section: string; slug: string }>;
}

const validSections = ['bim', 'ops', 'architecture', 'projects'];

export async function generateStaticParams() {
  const params: { section: string; slug: string }[] = [];
  for (const section of validSections) {
    for (const article of getArticles(section)) {
      params.push({ section, slug: article.slug });
    }
  }
  // Add index pages
  for (const section of validSections) {
    params.push({ section, slug: 'index' });
  }
  return params;
}

export async function generateMetadata({ params }: Props) {
  const { section, slug } = await params;
  const article = getArticle(section, slug);
  if (!article) return { title: "Not Found" };
  return {
    title: `${article.title} | ${getSectionTitle(section)}`,
    description: article.description,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { section, slug } = await params;
  if (!validSections.includes(section)) notFound();

  const article = getArticle(section, slug);
  if (!article) notFound();

  const contentHtml = (await remark().use(html).process(article.content)).toString();

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href={`/${section}`}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 inline-block"
      >
        ← {getSectionTitle(section)}
      </Link>

      <article className="space-y-8">
        <header className="space-y-4">
          {article.date && (
            <time dateTime={article.date} className="text-sm text-muted-foreground">
              {new Date(article.date).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          <h1 className="text-3xl font-bold tracking-tight">{article.title}</h1>
          {article.description && (
            <p className="text-lg text-muted-foreground">{article.description}</p>
          )}
        </header>

        <div
          className="prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>
    </main>
  );
}
