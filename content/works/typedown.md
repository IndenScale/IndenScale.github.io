---
title: "Typedown"
date: "2025-08-10"
description: "Markdown 的渐进式形式化工具，为 Markdown 添加语义层，将其从松散文本转换为经过验证的知识库。"
tags: ["工具", "架构"]
repoUrl: "https://github.com/IndenScale/Typedown"
---

Typedown 是 Markdown 的渐进式形式化工具。

## 核心概念

- **Model**: 使用 Pydantic 定义数据结构，编译时验证
- **Entity**: 严格 YAML 实例化数据
- **Reference**: `[[...]]` 语法链接实体，支持内容寻址
- **Spec**: 三层验证（字段级、模型级、全局级）
