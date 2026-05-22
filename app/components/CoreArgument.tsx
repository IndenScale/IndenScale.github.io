import { LiquidGlassCard } from "./LiquidGlassCard";

const ARGUMENTS = [
  {
    title: '声明式而非过程式',
    body: '用验收条件替代执行步骤，用令牌模型替代流程模型。',
  },
  {
    title: '多层断言栈',
    body: '策略从检测向下迁移为预防——让错误不可能发生，而非更快发现。',
  },
  {
    title: '事实不可篡改',
    body: '四类资产中唯一不可被"优化"的。只能被采集，或被忽略。',
  },
  {
    title: 'Ops-as-Code',
    body: '运营工业化的声明式框架，构建 Agent 运行时的控制切面。',
  },
];

export function CoreArgument() {
  return (
    <div className="space-y-6">
      {/* Lead statement */}
      <div className="border-l-2 border-foreground/10 pl-5">
        <p className="text-foreground leading-relaxed">
          2024 年的挑战是"让 Agent 能跑起来"，2026 年的挑战是
          <span className="font-semibold">"让 Agent 能放心地跑在生产环境"</span>。
        </p>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Hooks 是强制执行的约束，其他一切只是善意的建议。
          AGENTS.md、Skills、Sub-agent——这些都只是提示模型的手段；
          只有 Hooks 是确定性的。
        </p>
      </div>

      {/* Argument grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ARGUMENTS.map((arg) => (
          <LiquidGlassCard key={arg.title} tilt={false} noise className="px-5 py-4">
            <h3 className="font-semibold text-foreground mb-2 text-sm">{arg.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{arg.body}</p>
          </LiquidGlassCard>
        ))}
      </div>
    </div>
  );
}
