---
title: "Typedown"
date: "2025-08-10"
description: "Markdown 的渐进式形式化工具，为 Markdown 添加语义层，将其从松散文本转换为经过验证的知识库。"
tags: ["工具", "架构"]
repoUrl: "https://github.com/IndenScale/Typedown"
---

Typedown 是 Markdown 的渐进式形式化工具，为 Markdown 添加语义层，将其从松散文本转换为经过验证的知识库。

## 核心概念

- **Model**: 使用 Pydantic 定义数据结构，编译时验证
- **Entity**: 严格 YAML 实例化数据
- **Reference**: `[[...]]` 语法链接实体，支持内容寻址
- **Spec**: 三层验证（字段级、模型级、全局级）

## 使用方式

### VS Code 扩展（推荐）

实时验证、智能导航、语义高亮

### CLI

```bash
# 验证项目
typedown check .
```

用于 CI/CD 验证，确保文档质量。

## 安装

```bash
pip install typedown
# 或
uv tool install typedown
```

## 设计理念

Typedown 的核心理念是**渐进式形式化**——你可以从普通的 Markdown 开始，逐步添加类型约束，而不需要一次性重写所有文档。这种方式降低了采用门槛，同时提供了强大的验证能力。
