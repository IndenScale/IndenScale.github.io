---
title: "Monoco Toolkit"
date: "2025-06-20"
description: "首个 L3 Agentic 编排平台（无头操作系统），将 AI 开发从 L2（Agent/聊天机器人）提升至 L3（自主工程系统）。"
tags: ["AI", "工具", "智能体"]
repoUrl: "https://github.com/IndenScale/monoco-toolkit"
---

Monoco 是首个 L3 Agentic 编排平台，也被称为"无头操作系统"。它将 AI 开发从 L2（Agent/聊天机器人）提升至 L3（自主工程系统）。

## 核心特性

- **HOTL** (Human-On-The-Loop): 批处理/异步模式，10倍生产力提升
- **客观完成定义 (DoD)**: 基于测试、Lint、不变量的可靠性保障
- **Issue 驱动开发**: 将 Issue 作为工作单元管理生命周期
- **隔离环境**: 分支/Worktree 隔离确保不污染本地状态
- **治理即代码**: Git hooks、CI/CD 门控、自动审计

## 标准工作流

```bash
# 1. 创建并启动 Issue（自动创建 worktree）
monoco issue create feature -t "新功能"
monoco issue start FEAT-XXXX

# 2. 进入 worktree 目录工作
cd ~/Documents/worktrees/feat-xxxx-slug

# 3. 开发、提交代码...
git add . && git commit -m "feat: xxx"

# 4. 同步文件列表
monoco issue sync-files

# 5. 提交审查（必须在 worktree 中执行）
monoco issue submit FEAT-XXXX

# 6. 关闭 Issue（在主仓库执行，自动清理 worktree）
cd /path/to/main/repo
monoco issue close FEAT-XXXX --solution implemented
```

## L3 Agentic 的定义

| 层级 | 名称 | 特征 |
|------|------|------|
| L1 | 工具 | 单一功能，被动调用 |
| L2 | Agent/聊天机器人 | 多轮对话，实时交互 |
| **L3** | **自主工程系统** | **批处理、异步、自动化、治理** |

## 与 L2 Agent 的区别

| 维度 | L2 Agent | Monoco (L3) |
|------|----------|-------------|
| 交互模式 | 实时对话 | 批处理/异步 |
| 生产力 | 1x | 10x |
| 质量保证 | 人工审查 | 客观 DoD |
| 治理 | 无 | 内置 |
| 隔离 | 无 | Worktree 隔离 |

## 安装

```bash
pip install monoco-toolkit
```

## 许可

MIT
