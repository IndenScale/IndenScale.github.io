---
title: "Typedown：Markdown 的类型安全验证层"
date: "2025-08-10"
description: "在 Agent 产出暴增后，人工审查成为瓶颈。Typedown 让 Markdown 文档在编写时就通过编译期验证。"
tags: ["项目", "DSL", "验证"]
---

## 问题

当 Agent 产出大量结构化文档（需求、设计、报告），人工审查成为瓶颈。传统 Markdown 是自由文本——任何人都可以写任何东西，没有编译期检查。Agent 可能漏掉必填字段、写错引用格式、违反业务规则。这些错误在人工审查时才能发现，但那时已经产生了纠正成本。

## 分析

Agent 产出的文档不是"随笔"，是**结构化工作产物**。它们有 Schema——必填字段、类型约束、引用完整性、业务规则。关键洞察：这些问题可以用编译期检查解决，就像代码的 lint 和 type check 一样。

但有一个约束：**文档必须保持人类可读**。不能为了机器验证而牺牲可读性。所以方案必须是渐进式的——从纯 Markdown 开始，逐步加约束。

## 方案

Typedown 为 Markdown 添加四层类型安全：
- **Model**：Pydantic 定义数据结构——字段类型、必填项、自定义校验
- **Entity**：YAML 实例化数据
- **Reference**：`[[Entity:ID]]` 语法实现内容寻址——引用完整性自动检查
- **Spec**：三层验证——字段级（类型检查）、模型级（关联完整性）、全局级（跨实体约束）

工具链：VS Code 扩展（实时验证、自动补全）+ CLI（`typedown check` 集成 CI/CD）+ Web 编辑器。

## 效果

- VS Code 扩展下载量 2,500+，GitHub Stars 50+
- `typedown check` 让文档验证从"人看"变成"机器跑"——类似 ESLint 之于 JavaScript
- 在企业部署中，配置错误率降低 80%
