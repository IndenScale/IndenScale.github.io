const TIERS = [
  {
    num: '01',
    label: 'HITL',
    title: 'HITL 节点',
    desc: '人做决策。信息不完备、后果不可逆时，保留人的最终判断权。',
    meta: '最慢 · 最贵 · 不可规模化',
  },
  {
    num: '02',
    label: 'Eval',
    title: '结构化评估项',
    desc: '人/Agent 按明确规则判定。判定标准可文本化，允许解释空间。',
    meta: '可审计 · 可复现',
  },
  {
    num: '03',
    label: 'Assert',
    title: 'Assertion',
    desc: 'pytest / CI 中执行。可访问数据库、API、文件系统——表达跨系统约束。',
    meta: '有 setup 成本 · 失败阻断流水线',
  },
  {
    num: '04',
    label: 'Validate',
    title: 'Validator',
    desc: 'Pydantic field_validator，数据入库时自动触发。确定性、无副作用、零延迟。',
    meta: '最稳固 · 最廉价 · 预防而非检测',
  },
];

export function StrategyPyramid() {
  return (
    <div className="space-y-4">
      {TIERS.map((tier, i) => (
        <div key={tier.label} className="flex items-start gap-4">
          {/* Step indicator */}
          <div className="flex flex-col items-center shrink-0 w-10 pt-1.5">
            <span className="text-[11px] font-mono text-muted-foreground tracking-wider">
              {tier.num}
            </span>
            {i < TIERS.length - 1 && (
              <div className="w-px flex-1 mt-2 mb-0 bg-muted-foreground/20" />
            )}
          </div>

          {/* Card */}
          <div className="flex-1 pb-2">
            <div className="glass-surface glass-edge rounded-xl px-6 py-5 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-lg font-semibold text-foreground">{tier.title}</span>
                <span className="text-xs font-mono text-muted-foreground tracking-wide">
                  {tier.label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{tier.desc}</p>
              <p className="text-xs text-muted-foreground/50 mt-3 font-mono">{tier.meta}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Direction note */}
      <p className="text-center text-xs text-muted-foreground/40 mt-6 pl-14">
        自动化方向：HITL → Eval → Assert → Validate
      </p>
    </div>
  );
}
