---
title: "Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?"
source: "arXiv preprint"
authors:
  - "Thibaud Gloaguen"
  - "Niels Mündler"
  - "Mark Müller"
  - "Veselin Raychev"
  - "Martin Vechev"
affiliation: "ETH Zurich / LogicStar.ai"
date_published: "2026-02-13"
date_saved: "2026-02-22"

type: "reference"
reference_type: "academic_paper"
curation_context: "AgentHooks 文献策展"
curation_date: "2026-02-22"
curation_location: ".references/"
original_language: "en"

description: "首篇系统性评估 AGENTS.md 效果的学术论文。基于 AGENTBENCH（138 个实例）的严格实验发现：人工编写的上下文文件仅边际提升性能（4%），LLM 生成的文件甚至有轻微负面影响（-3%），且增加推理成本 20%+。"

topics:
  - "AGENTS.md"
  - "Context Files"
  - "Coding Agents"
  - "Empirical Study"
  - "SWE-bench"

key_findings:
  - "人工编写的 AGENTS.md 仅边际提升性能（4%）"
  - "LLM 生成的 AGENTS.md 有轻微负面效果（-3%）"
  - "上下文文件增加推理成本 20%+"
  - "上下文文件导致更多探索（更多测试、文件读取）"
  - "Agent 倾向于遵循上下文文件中的指令"

methodology:
  dataset: "AGENTBENCH（138 个 Python 实例）+ SWE-bench Lite"
  agents_tested:
    - "Claude Code (Sonnet-4.5)"
    - "Codex (GPT-5.2, GPT-5.1 Mini)"
    - "Qwen Code (Qwen3-30B-Coder)"
  settings:
    - "NONE: 无上下文文件"
    - "LLM: LLM 生成的上下文文件"
    - "HUMAN: 开发者提供的上下文文件"

limitations:
  - "主要集中在 Python 语言"
  - "未评估代码效率和安全性"
  - "未探索规划和持续学习能力"

related_materials:
  - "../AgentHooks：生产级 Agent 系统的确定性基础.md"
  - "./AGENTS.md Outperforms Skills - Vercel.md"
  - "./Claude Code Hooks - Karan Bansal.md"
---

**Authors**: Thibaud Gloaguen¹, Niels Mündler¹, Mark Müller², Veselin Raychev², Martin Vechev¹  
**Affiliation**: ¹Department of Computer Science, ETH Zurich; ²LogicStar.ai  
**Date**: February 13, 2026  
**Source**: arXiv preprint

---

## Abstract

A widespread practice in software development is to tailor coding agents to repositories using context files, such as `AGENTS.md`, by either manually or automatically generating them. Although this practice is strongly encouraged by agent developers, there is currently no rigorous investigation into whether such context files are actually effective for real-world tasks.

**Key Findings**:

- Developer-provided context files only **marginally improve performance** (4% on average)
- LLM-generated context files have a **small negative effect** on agent performance (decrease of 3% on average)
- Context files lead to **increased inference cost by over 20%**
- Context files encourage broader exploration (more thorough testing and file traversal)
- Coding agents tend to respect their instructions

**Conclusion**: Unnecessary requirements from context files make tasks harder. Human-written context files should describe only minimal requirements.

---

## 1. Introduction

Coding agents are being rapidly adopted across the software engineering industry, and providing context files like `AGENTS.md` (a README specifically targeting agents) has become common practice.

### The Problem

Context files are now supported by most popular agent frameworks and included in over 60,000 open-source repositories. These files typically contain:

- Repository overview
- Information on relevant developer tooling
- Guidelines to help agents navigate the repository

However, the impact of context files on coding agents' ability to solve complex software engineering tasks has **not been rigorously studied**.

### Challenges

1. Context files are not available for prior benchmarks
2. Popular repositories used for benchmarks are not representative of most codebases

### This Work

The authors construct **AGENTBENCH**, a novel benchmark comprising Python software engineering tasks from real GitHub issues. The benchmark contains **138 unique instances** across 12 repositories, all featuring developer-written context files.

---

## 2. Background and Related Work

### Coding Agents

Coding agents are LLM-based systems designed for autonomous resolution of coding tasks. They typically consist of a harness that allows an LLM to interact with its environment using specialized tools (e.g., executing bash commands, conducting web searches, reading/modifying files).

### Context Files

As coding agents were more broadly adopted, a common need arose to provide agents with additional context about novel and little-known codebases. Model and agent developers recommend including context files like `AGENTS.md` or `CLAUDE.md` with codebases.

Many agent harnesses provide built-in commands to initialize such context files automatically using the coding agent itself (e.g., by providing a dedicated `/init` command).

---

## 3. AGENTBENCH

### 3.1 Notation and Definitions

The paper introduces notation to describe codebases, test suites, and changes:

- **Repository state** R after applying patch X is denoted as R ∘ X
- **Test suite** T is a collection of tests used to validate functionality
- **Instance** I is a task for autonomous completion by the coding agent

### 3.2 Generation of AGENTBENCH Instances

The five-stage construction process:

1. **Finding repositories**: Use GitHub search to find repositories with context files (`AGENTS.md` or `CLAUDE.md`), filtering for Python projects with test suites and at least 400 PRs

2. **Filtering pull requests**: Retain PRs that:
   - Reference at least one issue
   - Modify at least one Python file
   - Are assessed to introduce deterministic, testable behaviors

3. **Environment Set-Up**: Create execution environments where test suites can be run

4. **Task Descriptions**: Use an LLM agent to produce standardized task descriptions (description, steps to reproduce, expected behavior, observed behavior, specification, additional information)

5. **Generating Unit Tests**: Use LLM agent to generate unit tests that validate correctness

**Result**: 138 instances from 12 repositories

### Key Statistics (Table 1)

| Metric | Mean | Min | Max |
|--------|------|-----|-----|
| PR body # words | 415.3 | 5 | 4961 |
| Issue # words | 211.6 | 96 | 500 |
| Codebase # files | 3337 | 151 | 26602 |
| PR patch # lines edited | 118.9 | 12 | 1973 |
| PR patch # files edited | 2.5 | 1 | 23 |
| Test Coverage | 75% | 2.5% | 100% |
| Context file # words | 641.0 | 24 | 2003 |

---

## 4. Experimental Evaluation

### 4.1 Experimental Setup

**Coding Agents Evaluated**:

- **Claude Code** (Anthropic) with Sonnet-4.5
- **Codex** (OpenAI) with GPT-5.2 and GPT-5.1 Mini
- **Qwen Code** (QwenLM) with Qwen3-30B-Coder

**Datasets**:

- SWE-bench Lite (300 tasks from 11 popular Python repositories, no context files)
- AGENTBENCH (138 instances from 12 repositories with context files)

**Settings**:

1. **NONE**: No context files available
2. **LLM**: LLM-generated context file using agent recommendations
3. **HUMAN**: Developer-provided context file (AGENTBENCH only)

### 4.2 Main Results

#### LLM-generated context files increase cost and reduce performance

LLM-generated context files cause performance drops in 5 out of 8 settings:

| Configuration | SWE-bench Lite | AGENTBENCH |
|---------------|----------------|------------|
| | Resolution Rate | Cost | Resolution Rate | Cost |
| NONE (baseline) | ~60% | baseline | ~50% | baseline |
| LLM | Slightly lower | +20-23% | Slightly lower | +20-23% |
| HUMAN | Similar/slightly better | +19% | Slightly better | +19% |

**Key Observations**:

- Average resolution rate reduced by 0.5% (SWE-bench Lite) and 2% (AGENTBENCH)
- Context files increase the number of steps by 2.45 and 3.92 steps on average
- Cost increase of 20% and 23% on average

#### Human context files increase cost and performance

Developer-provided context files outperform LLM-generated ones for all four agents, despite not being agent-specific. They improve performance compared to no context files for all agents except Claude Code.

However, they also increase:

- Average number of steps by 3.34
- Cost by at most 19%

### 4.3 Trace Analysis

**Context files lead to more testing and exploration**:

When context files are present, coding agents:

- Run more tests
- Navigate the repository more (search more files with grep)
- Read more files
- Write more files
- Use more repository-specific tooling (e.g., `uv`, `repo_tool`)

**Instructions in context files are typically followed**:

If a tool name is mentioned in context files, its usage increases significantly. For example:

- `uv` is used 1.6 times per instance when mentioned vs <0.01 when not
- Repository-specific tools are used 2.5 times per instance when mentioned vs <0.05 when not

**Following context files requires more thinking**:

LLM-generated context files increase reasoning tokens by:

- 22% for GPT-5.2
- 14% for GPT-5.1 Mini

Developer-written context files increase reasoning tokens by:

- 20% for GPT-5.2
- 2% for GPT-5.1 Mini

### 4.4 Ablations

**Stronger models don't generate better context files**:

Comparing GPT-5.2 + Codex to standard agents:

- Improves performance on SWE-bench Lite by 2% on average
- Degrades performance on AGENTBENCH by 3% on average

**No difference between specific prompts**:

Comparing Codex vs Claude Code prompts for generating context files:

- No consistent impact on success rate
- Claude Code performs better with Codex-generated context files on SWE-bench Lite
- GPT-5.2 and GPT-5.1 Mini perform better with Codex prompt on SWE-bench Lite but worse on AGENTBENCH

---

## 5. Limitations and Future Work

### Niche Programming Languages

Current evaluation focuses heavily on Python. Future work may investigate context files on more niche programming languages that are less represented in training data.

### Context Files Beyond Task Resolution

Other relevant aspects not evaluated:

- Code efficiency
- Security (prior work found that prompting LLMs to generate secure code significantly improves security)

### Improving Context File Generation

Human developers appear to dominate per the evaluation. Future work could explore:

- Planning and continuous learning from prior tasks
- Meaningful self-improvement capabilities

---

## 6. Conclusion

The paper presents an extensive evaluation of context files on coding agent performance across four common coding agents on SWE-bench Lite and AGENTBENCH.

**Key Conclusions**:

1. **All context files consistently increase the number of steps** required to complete tasks
2. **LLM-generated context files have a marginal negative effect** on task success rates
3. **Developer-written context files provide a marginal performance gain**
4. Instructions in context files are generally followed and lead to more testing and broader exploration
5. Context files do **not** function as effective repository overviews
6. Context files have only **marginal effect on agent behavior** and are likely only desirable when manually written

This highlights a concrete gap between current agent-developer recommendations and observed outcomes, motivating future work on principled ways to automatically generate concise, task-relevant guidance for coding agents.

---

## A. Experimental Details

### A.1 Additional Experimental Details

For AGENTBENCH instances, coding agents run in Docker containers with basic tooling (python, apt-get, uv, ...) and Internet access. Git commit history and all remotes are removed to prevent cheating.

### A.2 Trace Analysis

Tool calls are aggregated into equivalence classes for comparison across agents. The analysis shows correlation between tool mentions in context files and actual usage.

### A.3 Per-repository Success Rate

No single repository shows significant impact from context files, validating the approach of building instances from diverse repositories.

---

## B. Prompts

### B.1 AGENTBENCH Instances Generation

Four main prompts used:

1. **Filtering pull requests**: Decide if PR introduces deterministic, testable behavior
2. **Setting up the instance**: Write commands to set up environment and run tests
3. **Describing the instance**: Format PR information into a clear GitHub Issue
4. **Generating test cases**: Create regression tests for the PR

### B.2 Analyzing Traces of Coding Agents

Prompt for categorizing tool call intents:

- Label tool calls with single intent category
- Categories should be: right-sized granularity, reusable, clean, format-compliant
- Return JSON with tool_name, tool_used, and reasoning

---

## Key Takeaways

1. **Context files are not a silver bullet** - their impact is marginal at best
2. **LLM-generated context files can hurt performance** - consider carefully before auto-generating
3. **Human-written context files are slightly helpful** but add cost
4. **Keep context files minimal** - unnecessary requirements make tasks harder
5. **Focus on specific tooling instructions** - these are actually followed by agents
6. **Don't rely on context files for repository overviews** - they don't work effectively for this purpose
