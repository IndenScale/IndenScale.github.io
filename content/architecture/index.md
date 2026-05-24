---
title: "运行时层：Agent 架构"
description: "定义 Agent Harness 应该怎么工作，有哪些控制切面。五层统一框架的第三层。"
date: "2026-05-21"
---

> 本目录是 [统一框架](../) 的**运行时层**（第 3 层）。它定义 Agent 如何消费知识——三层控制回路 (Session/Turn/Step)、Hooks/Flag 控制平面、以及从净室到开放世界的扩展路径。上游依赖：[知识层 (knowledge/)](../knowledge/) 的策略梯度定义。下游被：[部署层 — IWE](../synthesis/iwe/) 消费。

Agent 开发正在从依赖模型"涌现能力"的神秘艺术，转变为**可预测、可治理、可复现的工程学科**。

核心洞见：你不需要控制大脑，你只需要控制大脑与世界的接口。

这个系列定义 Agent Harness 的控制切面——对话循环、行动循环、会话循环、控制机制、状态总线——以及它们如何映射到知识层中定义的策略梯度（Validator → Assertion → 结构化评估 → HITL）。

> [Agent 工程桥](../synthesis/agent-engineering/) —— 当 Agent 的接口约束（Hooks）已经收敛，下一个问题是：Agent 的判定逻辑如何被独立治理。四个关键决策，以及未闭环的治理环节。
