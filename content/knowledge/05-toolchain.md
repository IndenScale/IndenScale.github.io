---
title: "工具链参考"
date: "2026-05-21"
description: "OpStack 框架的推荐实现映射——Jinja2 模板、Pydantic 模型、飞书多维表格、CI 编排"
---

# 工具链参考

## 0. 说明

本文是 OpStack 框架的推荐实现映射——将理论概念对应到具体的工具和载体。这些推荐基于我们有限的经验，是**参考起点**而非权威选型。每个组织应根据自己的技术栈、规模和安全约束做调整。

选型原则：

- 优先选择已有广泛社区支持的成熟工具
- 优先选择纯文本/代码可管理的载体（Git 友好）
- 优先选择可组合的松散工具，而非一体化平台
- AI Agent 友好（结构化输入输出优于 GUI）

## 1. 三层架构的工具映射

```text
产物层  ── LibreOffice / WeasyPrint / Playwright（渲染为最终格式）
  │
内容层  ── Jinja2（模板） + YAML（结构） + Markdown（文字）
  │
数据层  ── Pydantic（schema） + 数据库 / API（存储）
```

### 1.1 数据层

| 功能         | 推荐                             | 说明                                                          |
| ------------ | -------------------------------- | ------------------------------------------------------------- |
| 数据 Schema  | **Pydantic v2**                  | 既是类型定义，也是 validator 执行引擎。`BaseModel` 即数据框架 |
| 时序数据     | **ClickHouse / TimescaleDB**     | 实时到中频指标的存储和聚合                                    |
| 低频数据     | **YAML / JSON in Git**           | 行业规范、供应商基础信息等相对稳定的结构化事实                |
| 非结构化事实 | **飞书文档 / Notion / Markdown** | 会议记录、用户反馈原文、决策日志                              |

### 1.2 内容层

| 功能       | 推荐                                                   | 说明                                                                         |
| ---------- | ------------------------------------------------------ | ---------------------------------------------------------------------------- |
| 内容模板   | **Jinja2**                                             | 模板引擎。周报、方案、邮件的结构骨架用 Jinja2 表达，数据从 Pydantic 模型注入 |
| 结构化内容 | **YAML**                                               | 非技术人员可编辑的结构化中间格式（参考 AtomDoc 的 content.yaml）             |
| 长文本内容 | **Markdown**                                           | 段落级文字内容。比 YAML 更适合长文本编辑                                     |
| 内容组装   | **AtomDoc (docx)** / **WeasyPrint (PDF)** / **Pandoc** | 将 content + style 渲染为目标格式                                            |

**Jinja2 + Pydantic 的典型协作：**

```python
from pydantic import BaseModel

class WeeklyReport(BaseModel):
    week: str
    dau: float
    dau_wow: float
    key_projects: list[str]
    risks: list[str]

# 模板
TEMPLATE = """
# 周报 — {{ week }}
## 核心指标
- DAU: {{ "%.0f"|format(dau) }} (环比 {{ "%+.1f%%"|format(dau_wow * 100) }})

## 重点项目
{% for p in key_projects %}
- {{ p }}
{% endfor %}

## 风险
{% for r in risks %}
- {{ r }}
{% endfor %}
"""

# 渲染
data = WeeklyReport(week="2026-W20", dau=152000, dau_wow=-0.03, ...)
content = jinja2.Template(TEMPLATE).render(data.model_dump())
```

### 1.3 产物层

| 功能         | 推荐                                     | 说明                                                          |
| ------------ | ---------------------------------------- | ------------------------------------------------------------- |
| docx 渲染    | **AtomDoc**                              | 内容/样式分离，text overlay 保证保真度                        |
| PDF 渲染     | **WeasyPrint** (HTML→PDF) / **Typst**    | WeasyPrint 适合从 HTML 模板生成；Typst 适合需要精确排版的场景 |
| 看板/图表    | **ECharts / Observable Plot** → PNG/SVG  | 数据驱动的图表生成，产物嵌入 docx 或网页                      |
| 通用格式转换 | **LibreOffice (headless)**               | 最后兜底——任何格式渲染为 PDF/PNG 后供 Agent 逐页读取          |
| 网页产物     | **任意前端框架 → SSR / Playwright 截图** | 交互式看板用网页呈现，截图嵌入文档                            |

## 2. 策略执行架构

策略的四层金字塔映射到 CI/CD 管道的不同阶段。

```text
代码提交
  │
  ├── Validator ── Pydantic model_validator（数据写入时自动触发）
  │
  ├── Assertion ── pytest + CI（git push 触发）
  │
  ├── 结构化评估 ── CI 中的 Agent job（LLM 读取规则 + 上下文，输出判定）
  │
  └── HITL 节点 ── PR review / Approval gate（人触发）
```

### 2.1 Validator — Pydantic 内嵌

Validator 在数据模型定义时同步编写，在数据实例化或写入时自动触发。

```python
from pydantic import BaseModel, field_validator, model_validator

class ActivityProposal(BaseModel):
    name: str
    budget: float
    start_date: str
    end_date: str
    target_dau_uplift: float

    @field_validator("budget")
    @classmethod
    def budget_positive(cls, v):
        assert v > 0, "预算必须大于 0"
        return v

    @model_validator(mode="after")
    def dates_ordered(self):
        assert self.start_date < self.end_date, "开始日期必须早于结束日期"
        return self
```

### 2.2 Assertion — pytest + CI

Assertion 写入测试文件，在 git push 时由 CI 执行。可以访问数据库、API、文件系统。

```yaml
# .github/workflows/validate.yml
name: Strategy Validation
on: [push, pull_request]
jobs:
  assertions:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run strategy assertions
        run: pytest tests/strategy/ --strategy-version=$(cat STRATEGY_VERSION)
```

```python
# tests/strategy/test_dau.py
def test_dau_not_dropping(db):
    """策略: 周环比 DAU 降幅不超过 15%"""
    dau_today = db.query("SELECT dau FROM metrics WHERE date = today()")
    dau_7d_avg = db.query("SELECT avg(dau) FROM metrics WHERE date >= today() - 7")
    drop = (dau_7d_avg - dau_today) / dau_7d_avg
    assert drop < 0.15, f"DAU dropped {drop:.1%} vs 7d avg"
```

### 2.3 结构化评估 — CI 中的 Agent Job

结构化评估项以 Markdown/YAML 形式存储在仓库中，CI 触发 Agent 读取评估规则、加载待评估内容、输出判定结果。

```yaml
# .github/workflows/review.yml
name: Structured Review
on:
  pull_request:
    paths: ["proposals/**"]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run structured review
        run: |
          agent-review \
            --rules reviews/activity-proposal.review.md \
            --target proposals/ \
            --output review-results.json
```

评估规则文件（`reviews/activity-proposal.review.md`）：

```markdown
# 活动方案结构化评估

## A. 目标可衡量性

- [ ] 目标包含数值指标
- [ ] 目标有明确时间窗口
- [ ] 目标与公司级 OKR 有映射

## B. 预算合理性

- [ ] 预算明细与活动模块一一对应
- [ ] 单用户成本在历史区间内（< ¥50/用户）

## C. 风险覆盖

- [ ] 至少列出 3 个风险点
- [ ] 高危风险有预案
```

### 2.4 HITL 节点 — PR Review Gate

HITL 映射到代码审查流程中的审批节点。关键区别：HITL 节点只存在规则**尚不能编码**的地方。一旦可以编码，它应该在下个 sprint 迁移到 assertion 或结构化评估。

```yaml
# .github/CODEOWNERS
# 策略变更需要 owner 审批
strategy/**       @strategy-owners
proposals/重大活动/**  @vp-operations
```

## 3. 内容提取

将非结构化文档中的内容提取为结构化的 Pydantic 模型。

| 来源格式             | 工具                                                     | 策略                                |
| -------------------- | -------------------------------------------------------- | ----------------------------------- |
| **docx**             | **AtomDoc**                                              | 拆分 → content.yaml → Pydantic 解析 |
| **PDF（文本型）**    | **MinerU** / **pdfplumber**                              | 提取文本 + 表格 + 阅读顺序          |
| **PDF（扫描件）**    | **MinerU**（内置 OCR）                                   | 扫描件 → OCR → 结构化               |
| **任意格式（兜底）** | **LibreOffice headless** → 逐页渲染 PNG → Agent 逐页读取 | 最慢、最贵，但零格式限制            |
| **网页**             | **Playwright** / **readability**                         | 抓取 + 正文提取                     |
| **飞书/钉钉消息**    | 平台 API                                                 | 结构化事件流                        |

### 3.1 AtomDoc 提取管线（docx 特化）

```python
from atomdoc.parser.docx_reader import parse_docx
from pydantic import BaseModel

# 1. 拆分 docx
result = parse_docx("input.docx")
doc = result.document

# 2. 映射到 Pydantic 模型
class ProposalContent(BaseModel):
    title: str
    sections: list[Section]
    tables: list[TableData]

# 3. 策略验证
proposal = ProposalContent.from_atomdoc(doc)
errors = validate(proposal)  # 执行字段级 validator
```

### 3.2 MinerU 提取管线（PDF 通用）

```bash
# MinerU 将 PDF 转为结构化 Markdown + JSON
magic-pdf -p input.pdf -o output/

# 产物：
#   output/input.md       — Markdown（保留阅读顺序）
#   output/input.json     — 结构化（段落、表格、公式、图片坐标）
#   output/images/        — 提取的图片
```

提取后的 JSON 映射到 Pydantic 模型，触发后续策略验证。

### 3.3 LibreOffice 兜底管线

当格式不受 AtomDoc 和 MinerU 支持时（旧版 WPS、复杂表格布局、混合排版），使用 LibreOffice 作为万能渲染器：

```bash
# 任意格式 → PDF → 逐页 PNG
soffice --headless --convert-to pdf input.unknown
pdftoppm -png -r 150 input.pdf page
# → page-1.png, page-2.png, ...
# Agent 逐页读取，提取结构化信息
```

这是最慢、最贵、但对人类最自然的路径——Agent 像人一样"看"文档。随着 AtomDoc 和 MinerU 覆盖更广，兜底管线的使用频率应递减。

## 4. 事实的多速存储

回顾 03 文档的四速制，映射到具体存储：

| 速率     | 存储                                         | 查询方式                        |
| -------- | -------------------------------------------- | ------------------------------- |
| **实时** | ClickHouse / TimescaleDB / Redis Streams     | SQL（聚合查询）、PromQL（时序） |
| **高频** | 飞书消息 / CRM Pydantic 模型 / Markdown 笔记 | LLM Agent 语义搜索 + 关键词过滤 |
| **中频** | PostgreSQL / YAML 配置文件 in Git            | SQL / YAML diff                 |
| **低频** | Git 仓库 Markdown / YAML                     | `git log` / `grep`              |

存储之间不需要实时同步，但需要有文档化的查询路径："想查上一个季度的供应商报价走势？去这里。"

## 5. 设计的实现层

设计的实现层（回顾 04 文档 3.2 节）：

| 资产         | 推荐                                                                | 说明                                        |
| ------------ | ------------------------------------------------------------------- | ------------------------------------------- |
| 模板         | **Jinja2 (HTML/Markdown)** / **AtomDoc (docx)** / **PPTX template** | 类型化模板，数据注入                        |
| Design Token | **YAML/JSON token 文件** → 各平台消费                               | `{color.primary, spacing.md, font.size.lg}` |
| 组件库       | **Storybook (Web)** / **Document Template Gallery (文档)**          | 共享的预构建组件和模板                      |
| 品牌资产     | **Figma / 静态 SVG+PNG in Git**                                     | logo、色板、字体文件                        |

## 6. 完整管线的参考架构

```text
┌─────────────────────────────────────────────────────┐
│                    触发器                              │
│  定时 / webhook / git push / 人工                      │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────▼──────────┐
        │   内容提取           │
        │   AtomDoc / MinerU  │
        │   / LibreOffice     │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │   数据层             │
        │   Pydantic 解析      │
        │   + 实时数据查询     │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────────────┐
        │   策略执行 (CI/CD Pipeline)  │
        │                              │
        │  Validator ── Pydantic       │
        │  Assertion ── pytest         │
        │  结构化评估 ── Agent job     │
        │  HITL ──────── PR review    │
        └──────────┬──────────────────┘
                   │
        ┌──────────▼──────────┐
        │   内容组装           │
        │   Jinja2 / AtomDoc  │
        │   / WeasyPrint      │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │   产物分发           │
        │   邮件 / 飞书 / API │
        │   / Git / 看板      │
        └─────────────────────┘
```

管线的每一步产出日志和判定结果，全部存档。每次执行可被事后审计。

## 7. 目前的缺口

诚实列出我们还没有满意答案的工具链问题：

- **结构化评估的 Agent 可靠性**：LLM 执行自然语言判定规则的准确率和一致性尚未达到可无人值守的水准。目前建议 Agent 判定结果作为人的输入而非替代。
- **多源事实的版本对齐**：当一条策略同时消费数据库中的实时 DAU 和 Git 中的低频行业数据时，二者时间戳不一致可能导致错误判定。
- **HITL → Agent 的信任斜坡**：从人审批到 Agent 自动判定，中间需要多长时间的影子运行？什么指标算"够好了"？
- **跨组织的策略互认**：当供应商和采购方使用不同的策略定义时，如何在不统一框架的前提下实现互认？

这些缺口是工具链开发者的机会，不是放弃的理由。
