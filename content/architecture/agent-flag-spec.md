---
title: "Agent Flag 规范"
date: "2026-03-24"
description: "开放、持久化、文件系统级别的 Agent 状态协议，实现无内存的跨进程状态通信"
tags: ["Agent Architecture,State"]
---

# Agent Flag 规范

Agent Flag 是开放、中立、持久化且语义化的通信协议，提供跨越进程和语言壁垒的标准状态总线。

## 核心原则

### 状态脱离内存

状态必须持久化到物理文件系统，实现状态解耦。

### 双向通信

- **被动遥测**: 框架/Harness 写入微观指标
- **主动声明**: Agent 主动编辑状态

### 物理拦截

Hooks 消费 Flag，实现控制权反转。

## 目录结构

```text
.agents/flags/{session_id}/
├── system.status           # 宏观状态 (RUNNING, AWAITING_APPROVAL)
├── react.error_streak      # 连续报错次数 (框架写入)
├── react.circuit_breaker   # 熔断开关 (CLOSED, OPEN)
├── tokens.consumed         # Token 消耗量
└── app.research_done       # 业务状态声明 (Agent 写入)
```

## File-per-flag 优势

### 1. 精准事件监听

单一 JSON 模式下，任何变量改动触发整个文件更新。

独立文件模式实现"外科手术级"监听:

```bash
tail -f .agents/flags/{session_id}/system.status
```

### 2. 操作系统级权限控制

```bash
# 熔断开关只读 (Agent 无法篡改)
chmod 444 .agents/flags/{session_id}/react.circuit_breaker

# 业务状态可写 (Agent 可声明进度)
chmod 666 .agents/flags/{session_id}/app.research_done
```

### 3. 零锁争用

每个状态位是独立原子实体，避免文件锁冲突。

## 状态类型

### 系统状态 (system.*)

| 值 | 含义 |
|----|------|
| `RUNNING` | 正常运行 |
| `AWAITING_APPROVAL` | 等待人工审批 |
| `PAUSED` | 暂停 |
| `COMPLETED` | 完成 |
| `ERROR` | 错误 |

### 熔断状态 (react.circuit_breaker)

| 值 | 含义 |
|----|------|
| `CLOSED` | 正常通行 |
| `OPEN` | 熔断开启 |
| `HALF_OPEN` | 半开试探 |

### 遥测指标 (框架写入)

- `tokens.consumed`: Token 消耗量
- `react.error_streak`: 连续错误次数
- `react.loop_depth`: ReAct 循环深度

### 业务状态 (app.*)

由 Agent 主动声明:

- `app.research_done`
- `app.test_passed`
- `app.code_reviewed`

## 使用模式

### 模式 1: 框架被动写入

```python
write_flag("react.error_streak", error_count)
write_flag("tokens.consumed", token_count)
```

### 模式 2: Agent 主动声明

```python
set_flag("app.research_done", "true")
```

### 模式 3: Hook 监控与拦截

```bash
if [ "$flag_name" = "app.test_passed" ] && [ "$flag_value" != "true" ]; then
    echo "Tests must pass before completion" >&2
    exit 2
fi
```

## 与 Hooks 的关系

```text
Agent Flag  <-  状态声明
     ↓
Agent Hooks <-  消费 Flag，执行干预
     ↓
   Agent   <-  接收反馈，调整行为
```

Flag 是状态总线，Hooks 是控制逻辑，两者配合实现完整的控制平面。
