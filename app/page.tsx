import Link from "next/link";
import { getArticles, getSectionIndex, getRecentArticles } from "@/lib/content";

const sections = [
  { slug: 'bim', title: 'Make BIM Great Again', desc: '施工管理的计算化' },
  { slug: 'ops', title: '运营工业化', desc: '企业现实与 Agent 工程的接口' },
  { slug: 'architecture', title: 'Agent 架构', desc: 'Harness 的控制切面' },
  { slug: 'projects', title: '项目', desc: '问题 → 分析 → 方案 → 效果' },
] as const;

export default function Home() {
  const recent = getRecentArticles(6);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <section className="mb-16 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">宋涤非</h1>
        <p className="text-muted-foreground leading-relaxed max-w-xl">
          Agent 基础设施工程师。目前在传统企业数字化转型部门构建 Agent Runtime 与可观测性体系。
          这里记录我对四个问题的思考与实践。
        </p>
        <div className="flex gap-4 text-sm">
          <a href="https://github.com/IndenScale" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
        </div>
      </section>

      <section className="mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sections.map(({ slug, title, desc }) => {
            const articles = getArticles(slug);
            return (
              <Link
                key={slug}
                href={`/${slug}`}
                className="group p-5 rounded-lg border border-border hover:border-foreground/20 hover:shadow-sm transition-all"
              >
                <h2 className="font-semibold group-hover:text-muted-foreground transition-colors">
                  {title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                <p className="text-xs text-muted-foreground mt-3">
                  {articles.length} 篇文章
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {recent.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-6">最近更新</h2>
          <div className="space-y-4">
            {recent.map((article) => (
              <article key={`${article.section}/${article.slug}`} className="group">
                <Link href={`/${article.section}/${article.slug}`}>
                  <div className="space-y-1 py-2">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="text-xs px-2 py-0.5 rounded bg-muted">
                        {sections.find(s => s.slug === article.section)?.title}
                      </span>
                      {article.date && (
                        <time dateTime={article.date}>
                          {new Date(article.date).toLocaleDateString("zh-CN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                      )}
                    </div>
                    <h3 className="font-medium group-hover:text-muted-foreground transition-colors">
                      {article.title}
                    </h3>
                    {article.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {article.description}
                      </p>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
