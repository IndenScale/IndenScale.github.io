---
title: "AgentHooks Specification"
date: "2026-02-22"
description: "AgentHooks 协议完整规范。定义事件类型、执行模式、通信协议与实现细节。"
tags: ["AgentHooks", "Specification", "Protocol"]
---

本文档定义 AgentHooks 开放格式的完整规范，包括事件类型、执行模式、通信协议与推荐实践。

---

## 快速概览

**AgentHooks 是什么？**

AI Agent 的事件驱动拦截协议。允许在 Agent 生命周期的关键点挂载自定义逻辑，实现安全管控、质量门控与自动化工作流。

**核心设计原则：**

- **标准化接口**：统一的触发时机、数据格式、决策语义
- **可阻断**：同步 hooks 可强制拦截危险操作
- **逐层披露**：元数据 → 配置 → 脚本，按需加载
- **供应商无关**：不绑定特定 Agent 平台

---

## 第一层：Hook 基本结构

一个 Hook 是一个包含 `HOOK.md` 的文件夹：

```text
block-dangerous-commands/
├── HOOK.md              # 元数据与配置
└── scripts/
    └── check.sh         # 可执行脚本
```

### HOOK.md 格式

```markdown
---
name: block-dangerous-commands
description: 阻止危险的系统命令
trigger: pre-tool-call
matcher:
  tool: "Shell"
  pattern: "rm -rf /|mkfs|dd if=/dev/zero"
timeout: 5000
async: false
priority: 999
---

# 阻止危险命令

当检测到破坏性命令时阻断执行。

## 阻断模式

- `rm -rf /` - 递归删除根目录
- `mkfs` - 格式化文件系统
- `dd if=/dev/zero` - 清零磁盘
```

**Frontmatter 字段（第一层）：**

| 字段            | 必填 | 默认   | 说明                              |
| --------------- | ---- | ------ | --------------------------------- |
| `name`          | ✅   | -      | Hook 标识符（1-64 字符）          |
| `description`   | ✅   | -      | 功能描述（1-1024 字符）           |
| `trigger`       | ✅   | -      | 触发事件类型                      |
| `stderr_format` | ❌   | `text` | stderr 格式：`text`/`json`/`auto` |

---

## 第二层：执行模式

### 同步模式（默认）

```yaml
---
async: false # 默认，可省略
---
```

**特征：**

- 阻塞 Agent 执行，等待 Hook 完成
- 可通过 exit code 2 **阻断操作**
- 可通过 stdout JSON **修改输入参数**

**适用场景：** 安全校验、权限验证、输入审查

### 异步模式

```yaml
---
async: true
---
```

**特征：**

- 立即返回，不等待 Hook 完成
- **不可阻断**操作（exit code 仅用于日志）
- **不可修改**输入参数
- stdout/stderr 仅用于调试记录

**适用场景：** 代码格式化、通知推送、日志记录、分析统计

### 决策树

```text
需要阻断操作？
├── 是 → 同步模式
│       └── exit 2 + stderr 输出阻断原因
└── 否 → 异步模式（推荐）
        └── 无需等待结果时性能最优
```

---

## 第三层：通信协议

Hook 脚本通过 **stdin** 接收事件数据，通过 **exit code** 和 **输出流** 返回决策。

### 输入：stdin（JSON）

```json
{
  "event_type": "pre-tool-call",
  "timestamp": "2024-01-15T10:30:00Z",
  "session_id": "sess-abc123",
  "work_dir": "/home/user/project",
  "tool_name": "Shell",
  "tool_input": {
    "command": "rm -rf /tmp/old-files"
  },
  "tool_use_id": "tool_123"
}
```

**通用字段：**

| 字段         | 类型   | 说明            |
| ------------ | ------ | --------------- |
| `event_type` | string | 事件类型        |
| `timestamp`  | string | ISO 8601 时间戳 |
| `session_id` | string | 会话唯一标识    |
| `work_dir`   | string | 当前工作目录    |
| `context`    | object | 附加上下文      |

### 输出：Exit Codes

| 退出码 | 含义                            |
| ------ | ------------------------------- |
| `0`    | 执行成功，操作继续              |
| `2`    | 执行完成，**操作被阻断**        |
| 其他   | 执行失败，操作继续（Fail Open） |

### 输出：stdout（机器可读）

**触发条件：** 始终解析，无论 Exit Code。

**用途：** 传输 JSON 配置对象，指示 Agent 允许、拒绝、修改输入或添加上下文。

**Exit Code 为 `0` 时：**

```bash
# 允许操作
echo '{"decision": "allow", "log": "命令已验证"}'
exit 0

# 修改输入参数
echo '{"decision": "modify", "tool_input": {"command": "rm -rf /tmp/safe-path"}}'
exit 0
```

**Exit Code 为 `2` 时（阻断）：**

```bash
# 结构化阻断响应
echo '{
  "decision": "deny",
  "error": {
    "code": "DANGEROUS_COMMAND",
    "message": "rm -rf / would destroy the system",
    "severity": "critical",
    "category": "security",
    "suggestion": "Use 'rm -rf /tmp/specific-path' instead"
  },
  "routing": {
    "notify_user": true,
    "notify_manager": true,
    "log_to_observability": true
  }
}'
exit 2
```

**阻断响应字段：**

| 字段             | 类型   | 必需 | 说明                           |
| ---------------- | ------ | ---- | ------------------------------ |
| `decision`       | string | ✅   | `"deny"` 表示阻断              |
| `error.code`     | string | ✅   | 机器可读错误码                 |
| `error.message`  | string | ✅   | 人类可读消息                   |
| `error.severity` | string | ❌   | `info`/`warning`/`critical`    |
| `error.category` | string | ❌   | 错误类别（如 `security`）      |
| `routing`        | object | ❌   | 路由提示（用户/经理/可观测性） |

### 输出：stderr（诊断输出）

stderr 根据 `stderr_format` 配置支持文本或 JSON 格式：

**格式模式：**

| 模式           | 行为                            |
| -------------- | ------------------------------- |
| `text`（默认） | 纯文本诊断信息，人类可读        |
| `json`         | 必须为有效 JSON，用于结构化路由 |
| `auto`         | 自动检测是否为 JSON             |

**触发条件：**

- Exit Code `2`（阻断）：stderr 内容作为阻断原因展示给用户，同时可被中间件解析
- 其他非零退出码：stderr 仅用于调试日志

**纯文本示例：**

```bash
echo "危险命令被阻断：rm -rf / 会摧毁系统" >&2
exit 2
```

**JSON 格式示例（用于多接收方路由）：**

```bash
echo '{
  "messages": {
    "user": "操作因安全原因被阻断",
    "manager": "用户尝试执行特权操作",
    "observability": {
      "event": "security.block",
      "command": "rm -rf /",
      "timestamp": "2026-02-22T10:30:00Z"
    }
  }
}' >&2
exit 2
```

**设计原则：**

- **stdout** = 协议通道（机器优先）
- **stderr** = 诊断通道（人类优先，可选结构化）

---

## 第四层：完整参考

### 14 个事件类型

| 事件                     | 触发时机         | 可阻断          | 推荐模式 |
| ------------------------ | ---------------- | --------------- | -------- |
| `pre-session`            | 会话开始前       | ✅              | 同步     |
| `post-session`           | 会话结束后       | ✅              | 同步     |
| `pre-agent-turn`         | Agent 处理输入前 | ✅              | 同步     |
| `post-agent-turn`        | Agent 完成处理后 | ✅              | 同步     |
| `pre-agent-turn-stop`    | Agent 即将停止前 | ✅ **质量门控** | **同步** |
| `post-agent-turn-stop`   | Agent 停止后     | ✅              | 同步     |
| `pre-tool-call`          | 工具执行前       | ✅ **推荐**     | **同步** |
| `post-tool-call`         | 工具执行成功后   | ✅              | 同步     |
| `post-tool-call-failure` | 工具执行失败后   | ✅              | 同步     |
| `pre-subagent`           | 子 Agent 启动前  | ✅              | 同步     |
| `post-subagent`          | 子 Agent 停止后  | ✅              | 同步     |
| `pre-context-compact`    | 上下文压缩前     | ✅              | 同步     |
| `post-context-compact`   | 上下文压缩后     | ✅              | 同步     |

### 匹配器（Matcher）

仅适用于工具相关事件：

```yaml
matcher:
  tool: "Shell" # 工具名称正则
  pattern: "rm -rf /" # 参数内容正则
```

**逻辑：**

- 指定 `tool`：仅该工具触发
- 指定 `pattern`：仅匹配参数内容触发
- 两者都指定：**必须同时匹配**
- 都未指定：所有工具都触发

### 优先级与执行顺序

```yaml
priority: 999 # 范围 0-1000，默认 100
```

**规则：**

- **高值优先**执行
- 同优先级按配置顺序
- 首个阻断 Hook 停止后续执行

### 超时控制

```yaml
timeout: 30000 # 默认 30 秒，范围 100ms - 10 分钟
```

**超时行为：**

- 视为 Hook 失败
- **Fail Open**：操作继续
- 记录警告日志

### 完整配置示例

```yaml
---
name: enforce-test-coverage
description: 确保测试通过才允许完成
trigger: pre-agent-turn-stop
timeout: 120000
async: false
priority: 999
stderr_format: auto
---
```

**脚本实现（支持结构化输出）：**

```bash
#!/bin/bash

# 读取事件数据
event_data=$(cat)

# 运行测试
if ! npm test 2>&1; then
    # 输出结构化错误到 stdout
    echo '{
      "decision": "deny",
      "error": {
        "code": "TESTS_FAILED",
        "message": "测试未通过，无法完成",
        "severity": "warning",
        "category": "quality"
      }
    }'
    # 输出人类可读信息到 stderr
    echo "测试未通过，无法完成" >&2
    exit 2
fi

# 检查代码格式
if ! black --check . 2>&1; then
    echo '{
      "decision": "deny",
      "error": {
        "code": "NOT_FORMATTED",
        "message": "代码未格式化，请先运行 'black .'",
        "severity": "info",
        "suggestion": "Run: black ."
      }
    }'
    echo "代码未格式化，请先运行 'black .'" >&2
    exit 2
fi

# 所有检查通过
echo '{"decision": "allow"}'
exit 0
```

**质量门控行为：**

当 `pre-agent-turn-stop` Hook 阻断时，Agent 会收到 stderr 反馈并**继续工作**而非停止。这创建了强制质量标准：测试不通过 → 阻断完成 → Agent 修复 → 再次尝试。

### 完整字段参考

**HOOK.md Frontmatter：**

| 字段            | 类型    | 必填 | 默认   | 说明                          |
| --------------- | ------- | ---- | ------ | ----------------------------- |
| `name`          | string  | ✅   | -      | Hook 标识符（1-64 字符）      |
| `description`   | string  | ✅   | -      | 功能描述（1-1024 字符）       |
| `trigger`       | string  | ✅   | -      | 触发事件类型                  |
| `matcher`       | object  | ❌   | -      | 匹配条件（`tool`, `pattern`） |
| `timeout`       | integer | ❌   | 30000  | 超时（毫秒）                  |
| `async`         | boolean | ❌   | false  | 异步执行                      |
| `priority`      | integer | ❌   | 100    | 优先级（0-1000）              |
| `stderr_format` | string  | ❌   | `text` | 格式：`text`/`json`/`auto`    |

**stdout 阻断响应（exit 2）：**

| 字段                           | 类型    | 必需 | 说明                                      |
| ------------------------------ | ------- | ---- | ----------------------------------------- |
| `decision`                     | string  | ✅   | `"deny"`                                  |
| `error.code`                   | string  | ✅   | 机器可读错误码                            |
| `error.message`                | string  | ✅   | 人类可读消息                              |
| `error.severity`               | string  | ❌   | `info`/`warning`/`critical`               |
| `error.category`               | string  | ❌   | 类别（`security`/`compliance`/`quality`） |
| `error.suggestion`             | string  | ❌   | 修复建议                                  |
| `routing.notify_user`          | boolean | ❌   | 通知用户                                  |
| `routing.notify_manager`       | boolean | ❌   | 通知经理                                  |
| `routing.log_to_observability` | boolean | ❌   | 记录到可观测性系统                        |

---

## 发现机制

AgentHooks 支持两级发现路径：

```text
~/.config/agents/hooks/     # 用户级（XDG 规范）
./.agents/hooks/            # 项目级（优先级更高，可覆盖用户级）
```

---

## 参考实现

- [AgentHooks 参考实现（CLI & Python API）](https://github.com/IndenScale/agenthooks/tree/main/hooks-ref)
- [示例 Hooks 集合](https://github.com/IndenScale/agenthooks/tree/main/examples)

---

## 版本信息

- **协议版本**: 1.0.0
- **最后更新**: 2026-02-22
- **许可**: Apache 2.0

---

_本文档完整版本维护于 [GitHub](https://github.com/IndenScale/agenthooks)_
