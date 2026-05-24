import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticles, getSectionIndex, getSectionTitle } from "@/lib/content";
import { BackgroundBlobs } from "../components/BackgroundBlobs";
import { LiquidGlassCard } from "../components/LiquidGlassCard";

interface Props {
  params: Promise<{ section: string }>;
}

const validSections = ['bim', 'ops', 'architecture', 'projects', 'research'];

export async function generateStaticParams() {
  return validSections.map(section => ({ section }));
}

export async function generateMetadata({ params }: Props) {
  const { section } = await params;
  if (!validSections.includes(section)) return { title: "Not Found" };
  return { title: getSectionTitle(section) };
}

export default async function SectionPage({ params }: Props) {
  const { section } = await params;
  if (!validSections.includes(section)) notFound();

  const index = getSectionIndex(section);
  const articles = getArticles(section);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <BackgroundBlobs />
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 inline-block">
        ← 首页
      </Link>

      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{getSectionTitle(section)}</h1>
          {index?.description && (
            <p className="text-muted-foreground">{index.description}</p>
          )}
        </div>

        {articles.length === 0 ? (
          <p className="text-muted-foreground">即将更新</p>
        ) : (
          <div className="space-y-3 pt-4">
            {articles.map((article, i) => (
              <article key={article.slug} className="group">
                <Link href={`/${section}/${article.slug}`}>
                  <LiquidGlassCard tilt={false} noise={false} className="p-4">
                    <div className="flex items-start gap-4">
                      <span className="text-xs font-mono text-muted-foreground/40 shrink-0 mt-0.5 w-6">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {article.date && (
                            <time dateTime={article.date}>
                              {new Date(article.date).toLocaleDateString("zh-CN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </time>
                          )}
                        </div>
                        <h2 className="text-base font-medium group-hover:text-muted-foreground transition-colors">
                          {article.title}
                        </h2>
                        {article.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>
                        )}
                      </div>
                    </div>
                  </LiquidGlassCard>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
