import Link from "next/link";
import { getArticles, getRecentArticles, extractFirstCodeBlock } from "@/lib/content";
import { LiquidGlassCard } from "./components/LiquidGlassCard";
import { BackgroundBlobs } from "./components/BackgroundBlobs";
import { HeroSection } from "./components/HeroSection";
import { FeaturedProjects } from "./components/FeaturedProjects";
import { ArchitectureDiagram } from "./components/ArchitectureDiagram";
import { StrategyPyramid } from "./components/StrategyPyramid";
import { CodeSnippet } from "./components/CodeSnippet";
import { CoreArgument } from "./components/CoreArgument";
import { ArrowRight, FileText } from "lucide-react";

const sections = [
  { slug: 'eac', title: 'Engineering as Code', desc: '工程设计的形式化与可计算基础' },
  { slug: 'ops', title: '运营工业化', desc: '企业现实与 Agent 工程的接口' },
  { slug: 'architecture', title: 'Agent 架构', desc: 'Harness 的控制切面' },
  { slug: 'projects', title: '项目', desc: '问题 → 分析 → 方案 → 效果' },
  { slug: 'research', title: 'Research', desc: 'RL · 对齐 · 形式化验证' },
] as const;

// Extract code snippet at build time from the toolchain article
const codeBlock = extractFirstCodeBlock('ops', '05-toolchain', 'python', 12);

export default function Home() {
  const recent = getRecentArticles(6);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-20">
      <BackgroundBlobs />

      {/* ═══ Hero ═══ */}
      <HeroSection />

      {/* ═══ Featured Projects ═══ */}
      <section className="space-y-8">
        <div className="section-divider">
          <span className="section-label">开源项目</span>
        </div>
        <FeaturedProjects />
      </section>

      {/* ═══ Core Argument ═══ */}
      <section className="space-y-8">
        <div className="section-divider">
          <span className="section-label">核心论点</span>
        </div>
        <CoreArgument />
      </section>

      {/* ═══ Architecture: Three Layers ═══ */}
      <section className="space-y-8">
        <div className="section-divider">
          <span className="section-label">三层架构</span>
        </div>
        <ArchitectureDiagram />
      </section>

      {/* ═══ Strategy: Assertion Pyramid ═══ */}
      <section className="space-y-8">
        <div className="section-divider">
          <span className="section-label">控制策略</span>
        </div>
        <StrategyPyramid />
      </section>

      {/* ═══ Code ═══ */}
      {codeBlock && (
        <section className="space-y-8">
          <div className="section-divider">
            <span className="section-label">代码接口</span>
          </div>
          <div>
            <CodeSnippet
              code={codeBlock.code}
              language="python"
              filename="weekly_report.py"
            />
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Jinja2 模板 + Pydantic 模型：声明式数据框架驱动内容自动组装
            </p>
          </div>
        </section>
      )}

      {/* ═══ Sections ═══ */}
      <section className="space-y-8">
        <div className="section-divider">
          <span className="section-label">内容领域</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sections.map(({ slug, title, desc }) => {
            const articles = getArticles(slug);
            return (
              <Link key={slug} href={`/${slug}`} className="block">
                <LiquidGlassCard className="h-full p-5" tilt={false} noise>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="font-semibold text-foreground">{title}</h2>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                    <div className="flex items-center gap-1.5 mt-4 text-xs text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" />
                      <span>{articles.length} 篇文章</span>
                    </div>
                  </div>
                </LiquidGlassCard>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══ Recent ═══ */}
      {recent.length > 0 && (
        <section className="space-y-8">
          <div className="section-divider">
            <span className="section-label">最近更新</span>
          </div>
          <div className="space-y-3">
            {recent.map((article) => (
              <article key={`${article.section}/${article.slug}`}>
                <Link href={`/${article.section}/${article.slug}`} className="block">
                  <LiquidGlassCard className="p-4" tilt={false} noise={false}>
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1">
                          <span className="font-medium text-foreground">
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
                  </LiquidGlassCard>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
