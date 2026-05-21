---
title: "AtomDoc：让 AI 编辑 Word 文档"
date: "2026-04-15"
description: "AI Agent 可以写代码但不能可靠编辑 .docx。AtomDoc 用 passthrough 保真往返方案解决了这个问题。"
tags: ["项目", "文档工程", "OOXML"]
---

## 问题

AI Agent 可以处理代码、Markdown、JSON，但无法可靠编辑 `.docx` 文件——企业工作流中最主要的文档格式。

现有方案都不行：

- **pandoc** 做格式转换会丢失编号、样式继承、页眉页脚
- **python-docx** 工作在错误的抽象层，Agent 容易写出损坏的 OOXML
- **LibreOffice** 的命令行转换同样有保真度损失

所以企业里大量文档工作（报告生成、合同填充、标书制作）仍然是人工操作。

## 分析

问题不在"读不懂 docx"，在于**重建 OOXML 时无法保持像素级保真**。OOXML 的样式系统极其复杂——样式继承、编号层级、主题色、页布局——从一个抽象模型逆向生成完全一致的 OOXML 几乎不可能。

关键洞察：**你不需要重建 OOXML，你只需要替换文本**。`styles.xml`、`numbering.xml`、`theme.xml`、页眉页脚——这些部件不需要被"理解"或修改，只需要被原样保留。唯一需要修改的是 `document.xml` 中的 `w:t`（文本节点）。

## 方案

**Passthrough 保真往返**：拆包时保留所有 OOXML 部件为原始字节，仅将文本节点提取到可编辑的 YAML 中。组装时做最小 XML 手术——只替换 `w:t` 文本节点。

```
原始 .docx → [AtomDoc split] → 内容层 (YAML) + 样式层 (OOXML 原样)
                                      ↓  Agent 编辑 YAML
修改后 .docx ← [AtomDoc assemble] ← 内容层 (YAML) + 样式层 (OOXML 原样)
```

五层正交样式架构（Run / Paragraph / Cell / Row / Table），每层独立管理属性，通过参数哈希指纹识别样式，解决了 Word 中"Normal 垃圾桶"问题。`patterns` 命令自动发现重复格式模式，供语义重命名。

## 效果

- 往返测试：**100% 像素级保真**（LibreOffice 渲染 PNG + 逐页 SSIM 对比）
- 66 个测试，支持 Python 3.10-3.13
- pip 可安装：`pip install atomdoc`
- Agent 在 YAML 层编辑文档内容，不需要理解 OOXML
