---
title: "策略四层梯度：从机器自动判定到人类决策"
date: "2026-03-15"
description: "验收条件不是二值的——它分布在一个从全自动到全人工的梯度上。这个梯度定义了 Agent 和人类之间的控制权分配。"
tags: ["运营工业化", "策略", "Agent Architecture", "HITL"]
---

## 验收条件的梯度

在运营工业化中，"策略"管一个核心问题：**什么样的结果算合格？**

但"合格"不是一个布尔值。它在四个层次上被定义——从完全自动化的机器规则到完全依赖人判的决策节点：

```text
                        HITL 节点
                       (人做决策)
                           ↑
                     结构化评估项
                   (人/Agent 按规则判定)
                           ↑
                      Assertion
                   (pytest, CI 时)
                           ↑
                      Validator
                  (Pydantic, 入库时)
```

从上到下，自动化程度递增、执行成本递减、判定确定性递增。

## 四个层次

### Validator：字段级的自动校验

数据入库时自动触发，纯粹的声明式约束。不需要上下文，不需要外部数据。

```python
@field_validator("dau")
def check_dau(cls, v):
    assert v >= 0, "DAU must be non-negative"

@model_validator(mode="after")
def check_dates(self):
    assert self.start_date < self.end_date
```

特征：确定性（相同输入必定相同输出）、无副作用、零延迟。最稳固的策略层。

### Assertion：测试时的行为校验

写入测试代码的不变式，在 CI/CD 管道中执行。与 Validator 的核心区别：**Assertion 可以访问外部资源**——数据库、API、文件系统。

```python
def test_dau_not_dropping():
    dau_today = db.query("SELECT dau FROM metrics WHERE date = today()")
    dau_7d_avg = db.query("SELECT avg(dau) WHERE date >= today() - 7")
    drop = (dau_7d_avg - dau_today) / dau_7d_avg
    assert drop < 0.15, f"DAU dropped {drop:.1%}"
```

特征：有 setup/teardown 成本、运行在 CI 环境中、失败时阻断流水线。

### 结构化评估项：自然语言描述的判定规则

用自然语言写成的、有明确判定标准的检查点。可能由人执行，也可能由 Agent 执行。不是一句"请评估质量"——必须有明确的维度、每个维度的通过标准、判定结果的格式要求。

```markdown
## 活动方案评审

### 目标可衡量性
- [ ] 目标包含数值指标
- [ ] 目标有明确的时间窗口
- [ ] 目标与公司 OKR 的映射关系有说明

### 风险覆盖
- [ ] 至少列出 3 个风险点
- [ ] 每个风险有应对措施
```

特征：人/Agent 可执行、判定标准明确但允许解释空间、结果可审计。

### HITL 节点：人类决策

当一个决策满足以下任一条件时，不应被自动化：

- 信息不完备（需要人通过非结构化渠道补充）
- 后果不可逆（上线、付款、合同签署）
- 需要承担后果（战略判断）

HITL 节点的设计目标不是消除它，而是**明确它的边界**——让人只做机器做不了的判断。

## 向下迁移：策略工程化的核心方向

四个层次不是静态分工。核心动态是**向下迁移**——让今天需要人判断的规则，明天变成机器可执行的断言。

```text
HITL → 结构化评估 → Assertion → Validator
  ↑                    ↑              ↑
  规则被明确为          判定逻辑       判定完全不
  可文本化的判定标准    可编码         依赖外部上下文
```

迁移的节奏不均匀。字段级 Validator 最容易到达——大多数类型和范围约束可以在设计阶段直接写入模型。跨系统的 Assertion 需要更多积累——你需要先见过足够多的失败案例，才能把"什么是不对的"写成规则。

**结构化评估是转换枢纽。** 当同一个结构化评估项被执行了 10 次，每次都得出相同的判定逻辑时，这个逻辑就可以代码化——编写断言或 validator，把评估项从 checklist 中删除。

## 与 Agent 架构的映射

策略四层梯度定义了 Agent 和人类之间的控制权分配。在 Agent Harness 中：

| 策略层 | Agent 控制切面 | 实现机制 |
|--------|---------------|----------|
| Validator | 数据写入门控 | Pydantic / JSON Schema，Agent 写入前自动校验 |
| Assertion | CI 质量门 | pytest / great_expectations，代码合并前阻断 |
| 结构化评估 | Agent 判定 + 人审 | Hooks 注入结构化 prompt，Agent 自评，人抽检 |
| HITL 节点 | 审批 / confirm | Hooks 阻断执行，等待人工确认 |

这不是理论映射——AgentHooks 的同步模式（可阻断执行）就是 HITL 的实现机制；Assertion 层对应 Monoco 的 DoD（Definition of Done）检查；Validator 层对应 Typedown 的 Schema 验证。

策略的向下迁移，在 Agent 系统中表现为**从 HITL 审批向自动化质量门的迁移**。每一条被形式化的验收条件，都让 Agent 的执行边界更确定，让人需要介入的频率更低。

这就是运营工业化与 Agent 工程的接口：**策略梯度定义了"合格"的机器可执行程度，Agent 架构定义了这些策略如何被注入到 Agent 的运行时中。**
