---
title: "2026：管理杠杆——AI 工程化的五个层级"
date: "2026-02-20"
description: "从 Agent 到 Agent Swarm，从 HITL 到 HOTL，从指令到 Issue，从 Action DAG 到 Stage 编排，从代码到全领域 Oracle。"
tags: ["随笔", "AI", "产品架构", "Typedown", "Monoco", "AgentHooks"]
---

## 引言：管理杠杆

上一篇文章用 RLVR 串起了 2025 年的技术主线。这篇文章讨论一个更偏向工程管理的问题：**如何让一个人管理十倍、百倍的 AI 劳动力？**

答案是**管理杠杆**——通过分层抽象，将复杂的多变量决策拆解为可组合、可验证、可复用的单元。

2026 年的五个机会，对应五个层级的杠杆：

| 层级         | 变化                        | 杠杆效应                   |
| ------------ | --------------------------- | -------------------------- |
| **产品应用** | Agent → Agent Swarm         | 并行执行，吞吐线性扩展     |
| **交互模式** | HITL → HOTL                 | 异步批处理，注意力解放     |
| **状态存储** | 指令 → Issue Ticket         | 状态中心化，可观测性       |
| **编排框架** | Action DAG → Stage 编排     | 抽象层次提升，降低认知负荷 |
| **基础设施** | 代码 Oracle → 全领域 Oracle | 可验证奖励泛化             |

本文将解释这五个层级的逻辑，以及三个项目——**Typedown**、**Monoco**、**AgentHooks**——如何分别解决其中的关键问题。

---

## 第一层：Agent Swarm（产品应用层）

### 1.1 Swarm 的阻塞

单 Agent 的吞吐受限于推理延迟。当任务需要高频采样（每步 2-5 秒，一个任务 50-100 步），串行执行无法满足需求。

### 1.2 并行化杠杆

**并行化**：将大任务拆分为可并行子任务，多个 Agent 同时执行。

```text
串行: Task A → Task B → Task C (300s)
并行: Task A → [Agent 1, Agent 2, Agent 3] → Merge (100s)
```

### 1.3 协调复杂度

并行化引入**协调复杂度**：

- 子任务如何拆分？
- 中间结果如何共享？
- 冲突如何解决？

这需要更高层级的编排机制——从 Action-level 上升到 Stage-level。

---

## 第二层：HOTL（交互模式层）

### 2.1 注意力瓶颈

**HITL**（Human-In-The-Loop）要求人类在每个关键决策点审批。当 8 个 Agent 并行执行时，人类成为瓶颈。

```text
HITL: Agent → [等待审批] → 执行 → [等待审批] → ...
      └─ 人类的注意力是串行的，无法扩展
```

### 2.2 边界预设杠杆

```text
HOTL: 人类定义边界（什么能做、什么不能）
      ↓
      Agent 在边界内自主执行（批处理/异步）
      ↓
      异常时人类介入
```

### 2.3 可预测性与委托

---

## 第三层：Issue Ticket（状态存储层）

### 3.1 状态散落

当前 Agent 工作流的状态散落在：

- 系统提示词（意图）
- 对话历史（上下文）
- 文件系统（中间产物）
- 人类大脑（隐式知识）

没有**唯一的真相源**（Single Source of Truth）。

### 3.2 状态中心化杠杆

```markdown
# Issues/FEATURE-001.md —— 唯一的真相源

---

id: ISSUE-001
type: FeatureRequest
status: Doing
stage: implement
assignee: agent-003
parent: [[ISSUE-000]] # 父任务引用
created_at: 2026-02-20

---

<!-- 文档结构 -->

<!-- 文档结构：意图 -->

实现 OAuth2 登录支持...

<!-- 文档结构：设计 -->

- [ ] 选择 OAuth2 库
- [ ] 设计用户模型

<!-- 文档结构：实现记录 -->

- [[commit-abc123]] 初始化配置
- [[commit-def456]] 实现回调接口

<!-- 文档结构：验收标准 -->

- [x] Google 登录
- [x] GitHub 登录
- [ ] Token 刷新（Blocked by [[ISSUE-005]]）
```

### 3.3 Markdown 与 YAML 的选择

| 存储方式          | 人类可读 | 版本控制 | 结构化查询 |
| ----------------- | -------- | -------- | ---------- |
| 数据库            | ❌       | 需审计表 | ✅         |
| 纯文本            | ✅       | ✅       | ❌         |
| **Markdown+YAML** | ✅       | ✅       | ✅         |

---

## 第四层：Stage 编排（框架层）

### 4.1 细粒度编排的负担

**Action-level DAG**（如 n8n、Dify、LangGraph）要求开发者手动设计每个动作的执行顺序：

```yaml
# Action-level: 太细， cognitive load 高
steps:
  - call_llm: "分析需求"
  - search_web: "查找 API 文档"
  - call_llm: "设计接口"
  - write_file: "创建模型"
  - call_llm: "生成迁移脚本"
  - run_command: "执行迁移"
  - call_llm: "编写测试"
  - run_command: "运行测试"
```

当 Agent 能力增强（Test Time Scaling），**动作的选择应该由 Agent 决定，而非开发者预设**。

### 4.2 Stage 抽象杠杆

```yaml
# Stage-level: 抽象层次提升
stages:
  - name: Draft
    exit: "acceptance_criteria is not empty"
    # Agent 自主决定如何补充信息

  - name: Doing
    exit: "tests_pass and lint_clean"
    budget: { max_steps: 100 }
    # Agent 自主选择动作：写代码、运行测试、查文档

  - name: Review
    exit: "human_approved or auto_pass"
    # Agent 自主准备审查材料
```

### 4.3 马尔可夫过程解耦

**Action-level DAG** 是**N 阶马尔可夫过程**：下一步动作依赖于完整的执行历史（DAG 的完整路径）。

**Stage-level 编排** 将其解耦为**多个一阶马尔可夫过程**：

```text
全局：Draft → Doing → Review → Done

每个 Stage 内部：
  Doing: [State_t] → Action → [State_{t+1}]

Agent 只需要知道：
1. 当前在哪个 Stage（一阶状态）
2. 当前 Stage 的局部上下文
```

这种解耦是**AgentHooks**的核心思想：通过 Hook 拦截 Stage 转换事件，将全局编排与局部执行分离。

---

## 第五层：全领域 Oracle（基础设施层）

### 5.1 验证缺口

RLVR 依赖可验证奖励。代码领域有天然 Oracle（测试、Linter、CI/CD），但其他领域呢？

### 5.2 形式化验证杠杆

```text
意图："用户密码必须加密存储"
  ↓ 形式化（Typedown Spec）
规则：password_field must match regex "^\$2[ayb]\$.{56}$"
  ↓ 验证（Oracle）
检查：数据库 schema 中 password 字段是否符合 bcrypt 格式
  ↓ 奖励信号
结果：通过 → 正奖励；失败 → 负奖励
```

### 5.3 跨领域 Oracle

| 领域         | 形式化规则                   | Oracle 实现                   |
| ------------ | ---------------------------- | ----------------------------- |
| **数据工程** | Schema 约束、分布断言        | dbt tests, Great Expectations |
| **基础设施** | Terraform Plan 合规性        | OPA (Open Policy Agent)       |
| **产品设计** | UI 组件 Design System 符合性 | 截图对比, CSS 变量检查        |
| **内容审核** | 多模态合规规则               | 分类模型, 关键词过滤          |
| **项目管理** | Issue 完成标准               | Spec 验证函数                 |

### 5.4 领域成熟触发 RLVR

---

## 三个项目的定位

五个层级的杠杆，对应三个项目的分工：

```text
┌─────────────────────────────────────────────────────────────┐
│                    编排层：AgentHooks                        │
│         将 N 阶马尔可夫过程解耦为一阶马尔可夫过程              │
├─────────────────────────────────────────────────────────────┤
│  Stage 转换  │  事件路由  │  Agent 调度  │  冲突解决         │
│   (机会四)   │  (机会四)  │   (机会三)   │   (机会一)       │
├─────────────────────────────────────────────────────────────┤
│                    状态层：Monoco                            │
│              State File 作为唯一的真相源                       │
├─────────────────────────────────────────────────────────────┤
│  Issue 存储  │  生命周期  │  引用关系  │  版本历史           │
│   (机会三)   │  (机会二)  │  (机会四)  │   (机会三)       │
├─────────────────────────────────────────────────────────────┤
│                    验证层：Typedown                          │
│                形式化验证与 Oracle 构建                      │
├─────────────────────────────────────────────────────────────┤
│   Model 定义   │  Spec 验证  │  Reference  │  Entity 实例   │
│   (机会五)    │   (机会五)  │  (机会三)   │   (机会三)   │
└─────────────────────────────────────────────────────────────┘
```

### Typedown：Validator

**解决的问题**：工作单元的形式化定义与验证。

````typedown
```model:FeatureRequest
class FeatureRequest(BaseModel):
    title: str
    acceptance_criteria: List[str]

    @model_validator(mode='after')
    def check_completeness(self):
        assert len(self.acceptance_criteria) >= 3
        return self
```

```spec:check_admin_mfa
@target(type="User", scope="global")
def check_admin_mfa(user: User):
    if user.role == "admin":
        assert user.mfa_enabled, "Admin must enable MFA"
```
````

**核心价值**：将模糊的人类意图转化为机器可验证的规则——**Oracle 的基础设施**。

### Monoco：State File

**解决的问题**：Agent 工作流的状态中心化存储。

```markdown
# Issues/FEATURE-001.md

---

id: ISSUE-001
status: Doing
stage: implement
assignee: agent-003
parent: [[ISSUE-000]]

---

<!-- Issue 内容示例 -->

- [x] Google 登录
- [ ] GitHub 登录（Blocked by [[ISSUE-005]]）
```

**核心价值**：

- **可观测性**：人类随时 `cat` 文件了解状态
- **版本化**：Git 历史完整记录状态变迁
- **可引用**：`[[ISSUE-001]]` 作为内容寻址的依赖声明

### AgentHooks：编排

**解决的问题**：多 Agent 协作的解耦与调度。

```python
# Hook 拦截 Stage 转换事件
@on_issue_stage_changed
async def route_to_specialist(event):
    """当 Issue 进入 Review 阶段，分配给 Reviewer Agent"""
    if event.to_stage == "Review":
        await assign_agent(
            issue_id=event.issue_id,
            role="reviewer",
            worktree_isolation=True
        )

@on_agent_conflict
async def resolve_conflict(event):
    """当两个 Agent 修改同一文件，触发合并流程"""
    await create_merge_issue(
        files=event.conflicted_files,
        parent_agents=[event.agent_a, event.agent_b]
    )
```

**核心价值**：

- **解耦**：Agent 不需要知道全局状态，只需要响应 Hook 事件
- **组合**：不同的 Hook 可以链式组合，形成工作流
- **测试**：Hook 是纯函数，可独立测试

---

## 一个完整的例子

**场景**：100 个技术债务 Issue 的批量处理

````bash
# 1. 定义工作单元（Typedown）
cat > models/TechDebt.td << 'EOF'
```model:TechDebt
class TechDebt(BaseModel):
    file_path: str
    issue_type: Literal["deprecated_api", "type_error", "unused_import"]
    severity: Literal["high", "medium", "low"]

    @model_validator(mode='after')
    def check_fixable(self):
        if self.severity == "high":
            assert self.auto_fixable, "High severity must be auto-fixable"
        return self
```text
EOF

# 2. 生成 100 个 State File（AI 分析代码库）
monoco analyze --type TechDebt --output Issues/techdebt/
# 生成 Issues/techdebt/TD-001.md ~ TD-100.md

# 3. 配置 HOTL 边界（Monoco）
cat > .monoco/policy.yaml << 'EOF'
sovereignty:
  capabilities:
    allow: ["read", "write", "test", "lint"]
    require_approval: ["write:production"]
  budget:
    max_steps: 20  # 简单债务，20 步预算
    checkpoint_every: 5
EOF

# 4. 注册编排 Hook（AgentHooks）
cat > .agent/hooks/techdebt_router.py << 'EOF'
@on_issue_created
async def auto_start(event):
    if event.issue_type == "TechDebt":
        await start_agent(
            issue_id=event.issue_id,
            role="refactor_bot",
            isolation="worktree"
        )

@on_budget_exceeded
async def escalate(event):
    await update_issue(event.issue_id, {
        "stage": "ManualReview",
        "note": f"Budget exceeded at step {event.step}"
    })
EOF

# 5. 批量提交（HOTL）
monoco batch submit --issues Issues/techdebt/*.md --parallel 8

# 6. 人类只在异常时介入
monoco dashboard --alert-on "budget_exceeded,validation_failed"
````

**杠杆效果**：1 个人类管理者 + 8 个并行 Agent + 状态中心化 = 100 个 Issue 的吞吐。

---

## 总结

| 机会   | 核心问题            | 杠杆         | 解决方案          |
| ------ | ------------------- | ------------ | ----------------- |
| **一** | 单 Agent 吞吐受限   | **并行化**   | AgentHooks 调度   |
| **二** | 人类注意力瓶颈      | **异步化**   | HOTL 边界预设     |
| **三** | 状态散落不可观测    | **中心化**   | Monoco State File |
| **四** | Action DAG 太细     | **抽象提升** | Stage-level 编排  |
| **五** | 非代码领域无 Oracle | **形式化**   | Typedown Spec     |

三个项目的边界：

- **Typedown**：验证层（Validator）——工作单元的"类型系统"
- **Monoco**：状态层（State）——工作流的"文件系统"
- **AgentHooks**：编排层（Orchestrator）——多 Agent 的"调度器"

---

## 最后的思考：控制与赋能的再平衡

2025 年的 CLI Agent 浪潮（Claude Code, Cursor）选择了**赋能**（Empowerment）：给 Agent 尽可能多的工具，让它自由发挥。

2026 年的趋势是**有组织的赋能**：通过管理杠杆，让少量的控制（边界预设、状态机、验证规则）产生大量的自主执行。

这不是限制 AI，而是让 AI 的自主能力**可扩展、可验证、可审计**。

> "控制不是为了限制，而是为了让自由成为可能。" —— 这或许是 L3 Agentic 编排的终极意义。

---

_正月初五，于杭州_
