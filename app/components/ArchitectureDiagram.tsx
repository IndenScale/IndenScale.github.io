const LAYERS = [
  {
    label: '产物层',
    en: 'Product Layer',
    formula: '产物 = 内容 + 样式',
    desc: '最终交付物的视觉形态。Word、PPT、看板、邮件——内容和样式独立演化，互不污染。',
  },
  {
    label: '内容层',
    en: 'Content Layer',
    formula: '内容 = 模板 + 数据',
    desc: '剥离视觉表现后的"干货"。模板捕获可重复模式，数据驱动实例填充。',
  },
  {
    label: '数据层',
    en: 'Data Layer',
    formula: '结构化的原子事实',
    desc: 'Pydantic schema + DB + API。数字、事实、事件——未经加工但经过严格类型约束。',
  },
];

export function ArchitectureDiagram() {
  return (
    <div className="space-y-0">
      {LAYERS.map((layer, i) => (
        <div key={layer.label}>
          <div className="glass-surface glass-edge rounded-xl px-6 py-5 transition-all duration-300 hover:shadow-lg">
            {/* Header: label + english */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-lg font-semibold text-foreground">{layer.label}</span>
              <span className="text-xs text-muted-foreground font-mono tracking-wide">
                {layer.en}
              </span>
            </div>
            {/* Formula: distinct, code-like */}
            <div className="text-sm font-mono text-foreground/70 mb-3">
              {layer.formula}
            </div>
            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {layer.desc}
            </p>
          </div>

          {i < LAYERS.length - 1 && (
            <div className="flex flex-col items-center py-3" aria-hidden>
              <div className="arch-chevron" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
