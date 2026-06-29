# Engineering as Code 旧版归档

本目录存放 Engineering as Code（EaC）系列的**旧版中文草稿**，保留作为历史记录与写作回溯，不再作为站点主入口渲染。

## 归档内容

| 文件 | 说明 |
|------|------|
| `index.md` | 旧版中文总览，聚焦 IDC 机房扩容场景下的声明式设计、FS as DB 与 CI/CD 质量左移。内容与 `content/domains/eac.md` 重复。 |
| `eac-01-为何AI还无法胜任工程设计.md` | 第一卷：围绕 Circuit as Code 缺失与质量左移断层的思辨。 |
| `eac-02-x-drc.md` | 第二卷。 |
| `eac-03-adl.md` | 第三卷。 |
| `eac-04-epm-assemblyhub.md` | 第四卷。 |
| `eac-05-rlvr-benchmark.md` | 第五卷。 |
| `EAC.txt` | 早期拼合备份文件，内含 `content/eac/` 路径的 HTML 注释标记，疑似一次批量导出或迁移的中间产物。 |

## 为什么归档

站点渲染逻辑（`lib/content.ts`）只识别固定 section（如 `content/eac/`、`content/domains/`）。旧版文件原位于 `content/Engineering as Code Series/`，既不符合 section 命名规范，也未被站点索引；同时其内容已复制到 `content/domains/eac.md` 作为当前公开入口。

为避免与新版英文正式稿混淆、避免在内容树中留下不可渲染的孤儿文件，现将旧版中文稿整体移入 `_archive`，保留完整 Git 历史，便于日后回溯、对比或复用素材。

## 相关位置

- 当前公开入口：`content/eac/index.md` → `/eac/`
- 新版英文正式稿：`content/eac/`
- 归档目录：本目录 `content/_archive/eac-old/`
