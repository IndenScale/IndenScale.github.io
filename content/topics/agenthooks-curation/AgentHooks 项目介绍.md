---
title: "AgentHooks"
date: "2025-01-15"
description: "AI Agent 事件驱动 Hooks 的开放格式。允许拦截、修改或对 Agent 生命周期事件做出反应。"
tags: ["AI", "智能体", "工具", "Hooks"]
repoUrl: "https://github.com/IndenScale/agenthooks"
---

AgentHooks 是 AI Agent 的事件驱动拦截协议。通过标准化的生命周期事件，让开发者能够在不侵入 Agent 核心逻辑的前提下，实现安全管控、质量门控与自动化工作流。

## 核心设计

### 为什么需要 AgentHooks？

AGENTS.md 和 Agent Skills 提供了**引导**，AgentHooks 提供了**约束**——从文本建议到代码执行的确定性保障。

| 维度   | AGENTS.md / Skills | AgentHooks |
| ------ | ------------------ | ---------- |
| 本质   | 提示工程           | 事件拦截   |
| 确定性 | 概率性             | 强制性     |
| 可阻断 | ❌                 | ✅         |
| 可观测 | 困难               | 完整审计   |

### 一分钟理解

一个 Hook 是一个文件夹，包含声明式配置与可执行脚本：

```text
block-dangerous-commands/
├── HOOK.md              # 何时触发、如何执行
└── scripts/
    └── check.sh         # 具体做什么
```

**HOOK.md 示例：**

```yaml
---
name: block-dangerous-commands
description: 阻止危险的系统命令
trigger: pre-tool-call
matcher:
  tool: "Shell"
  pattern: "rm -rf /|mkfs"
async: false
priority: 999
---
```

**check.sh 示例：**

```bash
echo "危险命令被阻断：rm -rf / 会摧毁系统" >&2
exit 2  # 阻断操作
```

## 核心能力

- **拦截工具调用** —— 阻止危险命令、审查敏感操作、验证权限
- **质量门控** —— 在 Agent 完成前强制执行测试、lint、规范检查
- **响应生命周期** —— 会话开始/结束、上下文压缩等事件的自动化
- **JIT 提示工程** —— 通过 Hook 动态注入上下文，替代静态 AGENTS.md

## 协议亮点

### 同步与异步

- **同步**（默认）：阻塞执行，Agent 等待结果。可阻断操作、可修改参数、可反馈状态。
- **异步**：后台运行，Agent 不等待。仅适用于无需反馈、副作用可控的场景。

**设计原则：默认同步，谨慎异步。**

### 阻断机制

通过 exit code 2 强制阻断危险操作，stderr 作为阻断原因反馈给 Agent。

### 优先级编排

多个 Hook 按优先级（0-1000）排序执行，首个阻断 Hook 停止后续执行。

### 14 个标准事件

覆盖会话生命周期、Agent Turn、工具调用、子 Agent、上下文管理等全链路。

## 迁移路径

AgentHooks 不是 AGENTS.md 的替代品，而是**升级其执行方式**：

```text
AGENTS.md 内容 ──→ pre-session Hook 读取 ──→ 选择性注入上下文
Agent Skills ────→ pre-agent-turn Hook 解析 ──→ 动态加载能力
```

从"模型自己读"到"钩子精确控制地注入"——更强的确定性与可观测性。

## 支持平台

- ✅ [Kimi CLI](https://github.com/moonshotai/kimi-cli) —— 完整支持
- 🚧 Claude Code —— 功能相似，协议对齐中
- 🚧 Gemini CLI —— 开发中

## 文档

- **[协议规范 →](/works/agenthooks-spec)** —— 完整的事件类型、通信协议、字段参考
- **[GitHub 仓库](https://github.com/IndenScale/agenthooks)** —— 源码、示例、参考实现

## 许可

Apache 2.0
