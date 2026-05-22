import { ArrowUpRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="mb-12 space-y-6">
      {/* Name — large, confident, monochrome */}
      <h1 className="text-5xl font-bold tracking-tight text-foreground">
        宋涤非
      </h1>

      {/* Role — subtle separation */}
      <p className="text-sm font-mono text-muted-foreground tracking-wide">
        Agent 基础设施工程师
      </p>

      {/* Hook statement — the insight that stops the scroll */}
      <blockquote className="border-l-2 border-foreground/20 pl-5 py-1">
        <p className="text-lg text-foreground leading-relaxed max-w-2xl">
          模型是 Agent 的大脑，但我们不是神经外科医生——
          <span className="font-semibold">我们是接口工程师</span>。
        </p>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-xl">
          我们的工作不是控制大脑如何思考，而是控制大脑与世界的接口：
          何时可以行动、何时必须停止、如何被观测。
        </p>
      </blockquote>

      {/* Tags — what I work on */}
      <p className="text-sm text-muted-foreground/70 font-mono tracking-wide">
        Agent Runtime · 可观测性 · 运营工业化
      </p>

      {/* Social links — minimal */}
      <div className="flex items-center gap-5 text-sm pt-1">
        <a
          href="https://github.com/IndenScale"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          GitHub
        </a>
        <a
          href="https://x.com/IndenScale"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X
        </a>
        <a
          href="/architecture/agent-engineering-in-2026"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <span>代表作</span>
          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
        </a>
      </div>
    </section>
  );
}
