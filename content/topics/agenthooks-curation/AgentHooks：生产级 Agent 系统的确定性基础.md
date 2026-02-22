---
title: "AgentHooks：生产级 Agent 系统的确定性基础"
date: "2026-02-22"
description: "AGENTS.md 与 Agent Skills 在原型阶段具有传播优势，但在生产环境中，AgentHooks 提供了更强的确定性、可控性和表达力。本文论证为何生产级系统应迁移到 AgentHooks 机制，并呼吁建立供应商无关的标准协议。"
tags: ["Agent Engineering", "AgentHooks", "AGENTS.md", "Agent Skills", "生产系统"]
---

## 引言：两种范式

2025-2026 年，Agent 开发工具呈现两条清晰的分化路径：

**路径一：提示工程范式**

以 AGENTS.md、Agent Skills、MCP 为代表，通过结构化的上下文注入来引导模型行为。它们在原型阶段获得了广泛传播——易于理解、快速上手、 visibly 有效。

**路径二：事件拦截范式**

以 Claude Code Hooks、Kimi CLI AgentHooks 为代表，通过事件驱动的拦截机制来治理 Agent 执行。它们更为底层，学习曲线更陡，但提供了前者无法企及的**确定性**。

本文的核心论点是：**AGENTS.md 和 Agent Skills 适合探索，AgentHooks 适合生产。** 当 Agent 从个人实验走向组织部署，我们需要从"引导"转向"治理"，从"建议"转向"约束"。

---

## 1. Claude Code Hooks 的兴起与社区实践

2025 年中，Anthropic 在 Claude Code 中引入了 Hooks 机制——一套事件驱动的拦截系统。截至 2026 年初，社区已经沉淀出一批高价值的使用模式：

### 1.1 安全治理类

**危险命令拦截**  
Karan Bansal 等开发者构建了 `block-dangerous-commands` 钩子，在 `PreToolUse` 事件拦截破坏性操作：`rm -rf ~`、fork bombs、`git reset --hard`、force push 到 main 等。

**密钥保护**  
通过拦截 `Read`、`Edit`、`Write`、`Bash` 工具，防止 Agent 接触 `.env` 文件、SSH 密钥、AWS 凭证，或执行可能泄露密钥的命令（`cat .env`、`echo $API_KEY`）。

### 1.2 质量保障类

**自动格式化**  
在 `PostToolUse`（文件写入后）自动运行 Prettier、Black 或 Rustfmt，确保代码风格一致。

**测试触发**  
在代码修改后自动运行相关测试套件，失败时阻止提交或通知开发者。

### 1.3 工作流增强类

**自动暂存**  
每次 Claude Code 编辑文件后自动 `git add`，保持工作区整洁，便于审查。

**Slack 通知**  
当 Agent 需要输入或遇到权限请求时，通过 Slack 通知异步等待的开发者。

这些案例的共同特征：**它们不是"建议"模型做什么，而是"强制"控制模型能做什么。**

---

## 2. AGENTS.md 与 Agent Skills 的局限性

2025 年，AGENTS.md 和 Agent Skills 成为 Agent 开发的流行模式。Vercel 的 AI SDK 率先推广了 AGENTS.md，随后被众多工具采纳。然而，Hacker News 上的技术讨论逐渐揭示了一个问题：**这些机制实际上限制了模型的发挥，且缺乏生产环境所需的确定性。**

### 2.1 提示工程的本质局限

AGENTS.md 和 Agent Skills 本质上是**提示工程（Prompt Engineering）的结构化变体**：

- **概率性而非确定性**：模型可能"忘记"或"误解" AGENTS.md 中的指令，尤其是在长会话或复杂任务中
- **无法强制执行**：模型可以选择不遵循建议，系统无法阻止不当行为
- **上下文竞争**：AGENTS.md 内容与其他提示争夺有限的上下文窗口，重要约束可能被截断

### 2.2 "善意的建议" vs "强制的约束"

AGENTS.md 中的规范是**善意的建议**："请记得写测试"、"请遵循我们的代码风格"。

Hooks 中的拦截是**强制的约束**："未通过测试的代码不能提交"、"不符合风格的代码会被拒绝写入"。

这种区别在原型阶段不明显，但在生产环境中至关重要。一个金融系统不能依赖模型"记得"不泄露数据；它需要**保证**敏感操作被拦截。

### 2.3 社区共识的演变

Hacker News 上的讨论显示，经验丰富的开发者开始意识到：

> "AGENTS.md 适合告诉 Agent 项目结构，但不适合安全策略。后者需要可验证的约束，而非文本建议。"

这种认知转变标志着 Agent 开发从"探索阶段"向"工程阶段"的过渡。

---

## 3. AgentHooks 的不可替代性

尽管 AGENTS.md 和 Agent Skills 在通用性和采用门槛上具有早期优势，AgentHooks 在三个维度上提供了无法被替代的价值：

### 3.1 确定性（Determinism）

Hooks 是**代码执行**，不是**文本生成**。当一个 `PreToolUse` 钩子检查到 `rm -rf /` 时，它**必然**会阻断操作。这种确定性的保障是提示工程无法提供的。

### 3.2 可控性（Controllability）

Hooks 允许**双向干预**：

- **阻止**：通过 exit code 2 阻断危险操作
- **修改**：修改工具参数后放行
- **增强**：添加上下文信息后传递

AGENTS.md 只能单向"建议"，无法控制执行流程。

### 3.3 表达力（Expressiveness）

任何可以用代码表达的逻辑，都可以用 Hooks 实现：

- 调用外部 API 进行权限验证
- 查询数据库检查业务规则
- 执行复杂的多步骤安全检查
- 与现有企业系统（LDAP、IAM、审计系统）集成

AGENTS.md 的表达力受限于自然语言的模糊性和模型的理解能力。

### 3.4 AgentHooks 可以替代 AGENTS.md 和 Agent Skills

一个重要的观察是：**AgentHooks 可以很简单地实现 AGENTS.md 和 Agent Skills 的效果**，但反之不成立。

**JIT Prompt Engineering**  
AgentHooks 不仅能执行代码逻辑，还能通过返回提示词来承担提示工程工作。例如，一个 `UserPromptSubmit` 钩子可以：

- 解析用户输入的意图
- 动态检索相关的模式、示例或约束
- 在请求传递给模型前，注入最相关的上下文

这不是静态的 AGENTS.md 能实现的——它是**上下文感知的、Just-In-Time 的提示工程**。

**AGENTS.md 作为 Midware**  
一个 `PreSessionStart` 钩子完全可以读取 `.claude/AGENTS.md` 或 `.kimi/AGENTS.md`，并：

- 解析文件内容
- 根据当前任务选择性展示相关部分
- 将结构化信息注入系统提示

**Agent Skills 的动态加载**  
类似地，Agent Skills 可以通过 Hooks 实现更精细的控制：

- 只展示 Skill ID 和 Description，而非完整实现（避免上下文浪费）
- 根据用户意图动态加载特定 Skill 的详细内容
- 在 Skill 冲突时进行仲裁或合并

这意味着 Hooks 是**更底层的抽象**，AGENTS.md 和 Skills 可以被实现为 Hooks 之上的**特定 Midware**——但反过来不行。

**关键洞察：不是放弃，而是纳入**  
我们并不是要放弃 AGENTS.md 和 Agent Skills 这些已被验证有效的实践。相反，我们主张将它们纳入一个**更加普遍、工程化、确定性的框架**中执行。当 AGENTS.md 由 Hook 加载时：

- 加载过程是可观测、可审计的
- 内容可以被动态过滤和增强
- 冲突可以被检测和解决
- 执行过程是确定的，不受模型"记忆"或"注意力"的影响

---

## 4. 生产级系统的迁移主张

基于以上分析，我们主张：**生产级 Agent 系统应尽快从 AGENTS.md/Skills 范式迁移到 AgentHooks 机制。**

### 4.1 风险维度的考量

| 风险等级 | AGENTS.md/Skills     | AgentHooks           |
| -------- | -------------------- | -------------------- |
| 安全策略 | 高（依赖模型遵守）   | 低（强制阻断）       |
| 合规审计 | 高（难以验证执行）   | 低（可记录每次决策） |
| 数据泄露 | 高（无法阻止访问）   | 低（可拦截敏感操作） |
| 成本控制 | 中（建议性预算限制） | 低（可强制配额检查） |

### 4.2 迁移路径

迁移不需要一次性完成。渐进式路径如下：

1. **共存阶段**：保留 AGENTS.md 用于项目上下文，添加关键安全 Hooks 进行约束
2. **增强阶段**：将 AGENTS.md 中的规范逐步转化为可执行的 Hooks
3. **替代阶段**：高优先级约束完全由 Hooks 处理，AGENTS.md 退化为纯文档

---

## 5. 标准化需求：供应商无关的 AgentHooks 协议

当前 Hooks 生态的一个关键问题是**碎片化**。

### 5.1 厂商现状

- **Claude Code**：13 个事件，Node.js/Python/Bash 支持，JSON stdin/out
- **Kimi CLI**：AgentHooks 支持，用户级 + 项目级 Hooks 发现
- **Gemini CLI**： reportedly 正在开发类似机制
- **Cursor**：有自己的 extension API，但 Hooks 支持程度不一
- **其他 Agent 产品**：支持程度参差不齐

### 5.2 标准化的必要性

当组织采用多 Agent 工具链时（Claude Code 用于编码，Kimi CLI 用于运维，内部工具用于特定领域），Hooks 的碎片化带来严重问题：

- **安全策略无法统一**：每个工具需要独立的 Hook 实现
- **审计日志格式不一致**：难以构建跨工具的观测系统
- **Midware 生态分裂**：开发者需要为每个平台重写相同功能

### 5.3 AgentHooks 开放标准

我们呼吁建立**供应商无关的 AgentHooks 协议**，核心要素包括：

1. **统一的事件集**：标准化的事件命名和触发时机
2. **统一的通信协议**：stdin/stdout JSON Schema、退出码语义、超时控制
3. **发现机制**：标准的 Hooks 路径和加载顺序
4. **Midware 接口**：可组合的 Midware 链式执行规范
5. **供应商适配层**：各 Agent 工具提供到标准协议的适配

这类似于 HTTP 协议统一了 Web 服务，或 OpenTelemetry 统一了可观测性。

---

## 结论：从赋能到治理

2025 年的 CLI Agent 浪潮选择了"赋能"——给 Agent 尽可能多的工具，期待涌现惊喜。2026 年的生产部署需要"治理"——在确定的约束下，让 Agent 安全、可靠、可审计地运行。

AgentHooks 不是 AGENTS.md 的竞争对手，而是**基础设施的升级**。前者是文本建议，后者是代码执行；前者是引导，后者是治理；前者适合原型，后者适合生产。

当我们谈论"Agent Engineering"时，我们需要的是**工程级的可靠性**，而非**艺术级的灵感**。AgentHooks 提供了这种可靠性的基础。

**生产级 Agent 系统的及格线很简单：你的约束是可执行的，还是仅仅是被建议的？**

---

## 参考

- Karan Bansal, [Claude Code Hooks: The Definitive Guide](https://karanbansal.in/blog/claude-code-hooks/), 2026
- Hacker News 讨论：AGENTS.md 与 Agent Skills 的局限性（多线程，2025-2026）
- Claude Code 官方文档：Hooks API Reference
- Kimi CLI AgentHooks 文档（feat/agenthooks 分支）

---

_本文讨论的概念定义参见：[AgentHooks 与 Agent Midware 概念定义](/.references/agenthooks-concepts.md)_
