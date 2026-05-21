---
title: "Agent Hooks 规范"
date: "2026-03-24"
description: "Session/Turn/ReAct 三层生命周期的事件钩子规范——pre/post 钩子和质量门"
tags: ["Agent Architecture,Hooks"]
---

# Agent Hooks 规范

Agent Hooks 是 AI Agent 事件驱动 Hooks 的开放格式，允许拦截、修改或对 Agent 生命周期事件做出反应。

## 生命周期模型

### 三层嵌套结构

```text
Session Loop (宏观)
    └── Turn Loop (中观)
            └── ReAct Loop (微观)
```

### Session Loop

- **粒度**: 宏观
- **职责**: 全局资源加载、状态持久化、生命周期管理
- **Hook 切入点**: `pre-session`, `post-session`

### Turn Loop

- **粒度**: 中观
- **职责**: 人机交互边界、检查点机制、状态同步
- **Hook 切入点**: `pre-agent-turn`, `post-agent-turn`, `pre-agent-turn-stop`, `post-agent-turn-stop`

### ReAct Loop

- **粒度**: 微观
- **职责**: 认知迭代、工具调用、观察处理
- **Hook 切入点**: `pre-tool-call`, `post-tool-call`, `post-tool-call-failure`

## 事件类型

### Session 级别

| 事件 | 触发时机 | 阻断性 | 模式 |
|------|----------|--------|------|
| `pre-session` | Session 开始前 | 是 | Sync |
| `post-session` | Session 结束后 | 是 | Sync |

### Turn 级别

| 事件 | 触发时机 | 阻断性 | 模式 |
|------|----------|--------|------|
| `pre-agent-turn` | Agent 处理输入前 | 是 | Sync |
| `post-agent-turn` | Agent 完成处理后 | 是 | Sync |

### 质量门事件

| 事件 | 触发时机 | 阻断性 | 模式 |
|------|----------|--------|------|
| `pre-agent-turn-stop` | Agent 停止响应前 | **质量门** | Sync |
| `post-agent-turn-stop` | Agent 停止响应后 | 是 | Sync |

**质量门特殊行为**: `pre-agent-turn-stop` 阻断时，Agent 收到反馈后继续工作，而非完全停止。

### Tool 级别

| 事件 | 触发时机 | 阻断性 | 模式 |
|------|----------|--------|------|
| `pre-tool-call` | 工具执行前 | 推荐 | Sync |
| `post-tool-call` | 工具成功后 | 是 | Sync |
| `post-tool-call-failure` | 工具失败后 | 是 | Sync |

### Subagent 级别

| 事件 | 触发时机 | 阻断性 | 模式 |
|------|----------|--------|------|
| `pre-subagent` | Subagent 启动前 | 是 | Sync |
| `post-subagent` | Subagent 停止后 | 是 | Sync |

### Context 级别

| 事件 | 触发时机 | 阻断性 | 模式 |
|------|----------|--------|------|
| `pre-context-compact` | 上下文压缩前 | 是 | Sync |
| `post-context-compact` | 上下文压缩后 | 是 | Sync |

## Hook 定义

### 目录结构

```text
~/.config/agents/hooks/          # 用户级 (XDG)
└── {hook-name}/
    ├── HOOK.md                  # 元数据和配置
    └── scripts/
        └── run                  # 可执行脚本 (入口)

./.agents/hooks/                 # 项目级
└── {hook-name}/
    ├── HOOK.md
    └── scripts/
        └── run
```

### HOOK.md Frontmatter

```yaml
---
name: {hook-name}
description: {hook-description}
trigger: {event-type}
matcher:                        # 可选
  tool: {tool-name-regex}       # 工具名匹配
  pattern: {input-pattern-regex} # 参数内容匹配
timeout: 30000                  # 毫秒，默认 30000
async: false                    # 默认 false
priority: 100                   # 0-1000，默认 100，高值先执行
---
```

### 脚本入口优先级

1. `scripts/run` (无扩展名，可执行)
2. `scripts/run.sh`
3. `scripts/run.py`

## 协议规范

### 输出协议

| 流 | 用途 | 说明 |
|----|------|------|
| Exit Code | 执行结果信号 | 0=成功继续, 2=阻断操作 |
| stdout | 机器可读 JSON | 控制和通信 (exit 0 时有效) |
| stderr | 人类可读文本 | 错误和反馈 (exit 2 时显示给用户) |

### 退出码语义

| 退出码 | 含义 | 行为 |
|--------|------|------|
| 0 | 成功/允许 | 继续执行，stdout JSON 有效 |
| 2 | 阻断 | 阻止操作执行，stderr 显示给用户 |
| 其他 | 错误 | 根据配置决定 (默认允许继续) |

### 阻断示例

```bash
echo "Dangerous command blocked" >&2
exit 2
```

### 修改参数示例

```bash
echo '{"decision": "allow", "modified_input": {"command": "ls"}}'
exit 0
```

### 事件数据结构

Tool 事件通过 stdin 接收 JSON:

```json
{
  "event_type": "pre-tool-call",
  "timestamp": "2024-01-15T10:30:00Z",
  "session_id": "sess-abc123",
  "work_dir": "/home/user/project",
  "tool_name": "Shell",
  "tool_input": {"command": "rm -rf /tmp"},
  "tool_use_id": "tool_123"
}
```

## 执行模式

### Sync (同步)

- 等待 Hook 执行完成
- 可阻断后续操作
- 可修改输入参数
- **默认模式**

### Async (异步)

- 立即返回，不等待完成
- 不可阻断操作
- 仅用于日志、通知等副作用

## 多 Hook 执行顺序

1. 用户级 hooks 先执行
2. 项目级 hooks 后执行
3. 同名 hook: 项目级覆盖用户级
4. 同 trigger 多 hooks: 按 `priority` 降序排列
5. 首个阻断者 (exit 2) 停止后续执行

## 关键原则

- **Fail Open**: Hook 失败或超时，允许操作继续
- **阻断唯一方式**: `exit 2`
- **渐进式披露**: 元数据(启动加载) → 配置(触发加载) → 脚本(执行加载)
