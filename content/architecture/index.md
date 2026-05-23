---
title: "Agent 架构"
description: "定义 Agent Harness 应该怎么工作，有哪些控制切面"
date: "2026-05-21"
---

Agent 开发正在从依赖模型"涌现能力"的神秘艺术，转变为**可预测、可治理、可复现的工程学科**。

核心洞见：你不需要控制大脑，你只需要控制大脑与世界的接口。

这个系列定义 Agent Harness 的控制切面——对话循环、行动循环、会话循环、控制机制、状态总线——以及它们如何映射到运营工业化中定义的策略梯度（Validator → Assertion → 结构化评估 → HITL）。

> [Agent 工程：从流程模拟到系统运营](/ops/08-agent-engineering) —— 当 Agent 的接口约束（Hooks）已经收敛，下一个问题是：Agent 的判定逻辑如何被独立治理。OpStack 给出了四个关键决策，以及警惕。
