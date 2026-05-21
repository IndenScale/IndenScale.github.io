import Link from "next/link";
import { getArticles, getRecentArticles } from "@/lib/content";
import { GlowCard } from "./components/GlowCard";
import { ArrowRight, FileText } from "lucide-react";

const sections = [
  { slug: 'bim', title: 'Make BIM Great Again', desc: '施工管理的计算化' },
  { slug: 'ops', title: '运营工业化', desc: '企业现实与 Agent 工程的接口' },
  { slug: 'architecture', title: 'Agent 架构', desc: 'Harness 的控制切面' },
  { slug: 'projects', title: '项目', desc: '问题 → 分析 → 方案 → 效果' },
] as const;

const sectionColors: Record<string, string> = {
  bim: 'from-amber-500/20 to-orange-500/5',
  ops: 'from-emerald-500/20 to-teal-500/5',
  architecture: 'from-violet-500/20 to-purple-500/5',
  projects: 'from-sky-500/20 to-blue-500/5',
};

const sectionAccent: Record<string, string> = {
  bim: 'text-amber-600 dark:text-amber-400',
  ops: 'text-emerald-600 dark:text-emerald-400',
  architecture: 'text-violet-600 dark:text-violet-400',
  projects: 'text-sky-600 dark:text-sky-400',
};

export default function Home() {
  const recent = getRecentArticles(6);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      {/* Hero */}
      <section className="mb-16 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          宋涤非
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-xl text-base">
          Agent 基础设施工程师。目前在传统企业数字化转型部门构建 Agent Runtime 与可观测性体系。
          这里记录我对四个问题的思考与实践。
        </p>
        <div className="flex gap-4 text-sm">
          <a
            href="https://github.com/IndenScale"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </section>

      {/* Section Cards */}
      <section className="mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sections.map(({ slug, title, desc }) => {
            const articles = getArticles(slug);
            return (
              <Link key={slug} href={`/${slug}`} className="block">
                <GlowCard className="h-full p-5">
                  <div className={`absolute inset-0 bg-gradient-to-br ${sectionColors[slug]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className={`font-semibold transition-colors ${sectionAccent[slug]}`}>
                        {title}
                      </h2>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                    <div className="flex items-center gap-1.5 mt-4 text-xs text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" />
                      <span>{articles.length} 篇文章</span>
                    </div>
                  </div>
                </GlowCard>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Articles */}
      {recent.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            最近更新
          </h2>
          <div className="space-y-3">
            {recent.map((article) => (
              <article key={`${article.section}/${article.slug}`}>
                <Link href={`/${article.section}/${article.slug}`} className="block">
                  <GlowCard className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${sectionAccent[article.section].replace('text-', 'bg-')}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1">
                          <span className={`font-medium ${sectionAccent[article.section]}`}>
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
                        <h3 className="font-medium group-hover:text-primary transition-colors truncate">
                          {article.title}
                        </h3>
                        {article.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                            {article.description}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shrink-0 mt-1" />
                    </div>
                  </GlowCard>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
