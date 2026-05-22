import { ArrowUpRight, GitBranch, Shield, FileText } from "lucide-react";

const PROJECTS = [
  {
    name: "AgentHooks",
    tagline: "AI Agent 事件驱动 Hooks 开放规范",
    description:
      "定义 14 个生命周期事件（pre/post 钩子 + 质量门），标准化 Agent 与外部治理系统的接口。已实现在 kimi-cli fork 中。",
    href: "https://github.com/IndenScale/agenthooks",
    license: "Apache 2.0",
    icon: Shield,
  },
  {
    name: "Typedown",
    tagline: "Markdown 的渐进式形式化工具",
    description:
      "为 Markdown 添加语义层：Pydantic Model → YAML Entity → 内容寻址引用 → 三层验证。VS Code 扩展 2,500+ 下载。",
    href: "https://github.com/IndenScale/Typedown",
    license: "MIT",
    icon: FileText,
  },
  {
    name: "AtomDoc",
    tagline: "AI 编辑 Word 文档的保真往返方案",
    description:
      "Passthrough 架构：拆包保留全部 OOXML 部件，仅提取文本节点到 YAML。Agent 编辑 YAML，组装时做最小 XML 手术。100% 像素级保真。",
    href: "https://github.com/IndenScale/AtomDoc",
    license: "MIT",
    icon: GitBranch,
  },
];

export function FeaturedProjects() {
  return (
    <div className="space-y-4">
      {PROJECTS.map((project) => {
        const Icon = project.icon;
        return (
          <a
            key={project.name}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="glass-surface glass-edge rounded-xl px-6 py-5 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Header: name + license */}
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-semibold text-foreground">
                      {project.name}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground/60 px-1.5 py-0.5 rounded bg-muted">
                      {project.license}
                    </span>
                  </div>

                  {/* Tagline */}
                  <p className="text-sm font-medium text-foreground/80 mb-2">
                    {project.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Arrow */}
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all shrink-0 mt-1" />
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
