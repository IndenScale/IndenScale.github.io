# AgentHooks 文献策展

本目录包含关于 AgentHooks 和相关 Agent Engineering 主题的精选文献集合。

---

## 目录结构

```text
agenthooks-curation/
├── README.md                          # 本文件
├── AgentHooks Specification.md        # 原创：协议规范
├── AgentHooks 项目介绍.md              # 原创：项目简介
├── AgentHooks：生产级 Agent 系统的确定性基础.md  # 原创：生产级系统论证
├── Agent Middleware：从反射走向治理.md         # 原创：成熟度模型
├── AgentHooks 与 Agent Middleware 概念定义.md  # 原创：概念分层
├── .references/                       # 外部引用文献
│   ├── Claude Code Hooks - Karan Bansal.md
│   ├── Evaluating AGENTS.md - ETH Zurich.md
│   └── AGENTS.md Outperforms Skills - Vercel.md
└── .generated/                        # AI 生成内容
    └── evaluation-report.md
```

---

## 原创内容

| 文件名 | 标题 | 日期 | 描述 |
|--------|------|------|------|
| `AgentHooks Specification.md` | AgentHooks Specification | 2026-02-22 | 协议完整规范，包含事件类型、通信协议、字段参考 |
| `AgentHooks 项目介绍.md` | AgentHooks | 2025-01-15 | 项目简介，核心设计理念与能力概览 |
| `AgentHooks：生产级 Agent 系统的确定性基础.md` | AgentHooks：生产级 Agent 系统的确定性基础 | 2026-02-22 | 论证生产级系统为何应迁移到 AgentHooks |
| `Agent Middleware：从反射走向治理.md` | Agent Middleware：从反射走向治理 | 2026-02-22 | 三级成熟度模型（反射级→策略级→治理级） |
| `AgentHooks 与 Agent Middleware 概念定义.md` | AgentHooks 与 Agent Middleware 概念定义 | 2026-02-22 | 明确区分接口协议层与中间件逻辑层 |

---

## 外部引用

位于 `.references/` 目录，为第三方创作的参考文章：

| 文件名 | 标题 | 作者/来源 | 日期 | 描述 |
|--------|------|-----------|------|------|
| `Claude Code Hooks - Karan Bansal.md` | Claude Code's Most Underrated Feature: Hooks | Karan Bansal | 2026-01-25 | Claude Code Hooks 的权威指南与开源实现 |
| `AGENTS.md Outperforms Skills - Vercel.md` | AGENTS.md Outperforms Skills in Our Agent Evals | Vercel AI Team | 2026 | Vercel 实验：AGENTS.md 100% 通过率 vs Skills 79% |
| `Evaluating AGENTS.md - ETH Zurich.md` | Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents? | ETH Zurich / LogicStar.ai | 2026-02-13 | 学术论文：AGENTS.md 仅边际提升性能（4%） |

---

## AI 生成内容

位于 `.generated/` 目录：

| 文件名 | 描述 |
|--------|------|
| `evaluation-report.md` | 对全部文献的逐点评估报告，从工程师/研究者/商业领袖多视角进行质量分析 |

---

## 策展逻辑

本策展围绕以下主题组织：

1. **理论基础**：AgentHooks 的核心概念、协议规范与成熟度模型（原创）
2. **对比研究**：AGENTS.md vs Skills vs AgentHooks 的效果评估（外部引用）
3. **实践指南**：Claude Code Hooks 的社区实践模式（外部引用）
4. **质量评估**：多视角文献评估（AI 生成）

---

## 使用建议

- **快速入门**：从 `AgentHooks 项目介绍.md` 开始了解基本概念
- **深入理解**：阅读 `AgentHooks：生产级 Agent 系统的确定性基础.md` 理解设计哲学
- **协议实现**：参考 `AgentHooks Specification.md` 进行具体实现
- **背景研究**：查阅 `.references/` 中的外部文章了解业界探索与争议
- **评估参考**：查看 `.generated/evaluation-report.md` 了解文献质量分析

---

*策展日期：2026-02-22*  
*结构更新：2026-02-22*
