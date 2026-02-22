---
title: "AGENTS.md Outperforms Skills in Our Agent Evals"
source: "https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals"
author: "Vercel AI Team"
date_published: "2026"
date_saved: "2026-02-22"

type: "reference"
reference_type: "industry_research"
curation_context: "AgentHooks 文献策展"
curation_date: "2026-02-22"
curation_location: ".references/"
original_language: "en"

description: "Vercel AI 团队的实验研究。在 Next.js 16 API 测试中，8KB 的 AGENTS.md 文档索引达到 100% 通过率，而 Skills 仅 79%（即使显式指令也只有 79%，默认触发率仅 56%）。提出'被动上下文优于主动检索'理论。"

topics:
  - "AGENTS.md"
  - "Agent Skills"
  - "Passive Context"
  - "Active Retrieval"
  - "Next.js"

key_findings:
  - "AGENTS.md 文档索引：100% 通过率"
  - "Skills 默认触发率仅 56%，+0pp vs 基线"
  - "Skills + 显式指令：79% 通过率"
  - "指令措辞敏感性：'先探索' vs '先调用'产生显著差异"
  - "关键提示词：'Prefer retrieval-led reasoning over pre-training-led reasoning'"

methodology:
  domain: "Next.js 16 APIs"
  test_apis:
    - "connection()"
    - "'use cache'"
    - "cacheLife()"
    - "forbidden()"
    - "unauthorized()"
  configurations:
    - "Baseline: 无文档（53%）"
    - "Skill 默认: 53%"
    - "Skill + 显式指令: 79%"
    - "AGENTS.md 索引: 100%"

theory: "被动上下文优于主动检索（Passive Context beats Active Retrieval）"

caveats:
  - "仅限于框架文档场景"
  - "Skills 在交互式场景仍有价值"
  - "需要'hardened eval suite'确保结果可信"

related_materials:
  - "../AgentHooks Specification.md"
  - "./Evaluating AGENTS.md - ETH Zurich.md"
  - "./Claude Code Hooks - Karan Bansal.md"
---

Source: https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals

We expected skills to be the solution for teaching coding agents framework-specific knowledge. After building evals focused on Next.js 16 APIs, we found something unexpected.

A compressed 8KB docs index embedded directly in `AGENTS.md` achieved a 100% pass rate, while skills maxed out at 79% even with explicit instructions telling the agent to use them. Without those instructions, skills performed no better than having no documentation at all.

Here's what we tried, what we learned, and how you can set this up for your own Next.js projects.

## The problem we were trying to solve

AI coding agents rely on training data that becomes outdated. Next.js 16 introduces APIs like `'use cache'`, `connection()`, and `forbidden()` that aren't in current model training data. When agents don't know these APIs, they generate incorrect code or fall back to older patterns.

The reverse can also be true, where you're running an older Next.js version and the model suggests newer APIs that don't exist in your project yet. We wanted to fix this by giving agents access to version-matched documentation.

## Two approaches for teaching agents framework knowledge

Before diving into results, a quick explanation of the two approaches we tested:

- **Skills** are an open standard for packaging domain knowledge that coding agents can use. A skill bundles prompts, tools, and documentation that an agent can invoke on demand. The idea is that the agent recognizes when it needs framework-specific help, invokes the skill, and gets access to relevant docs.

- **`AGENTS.md`** is a markdown file in your project root that provides persistent context to coding agents. Whatever you put in `AGENTS.md` is available to the agent on every turn, without the agent needing to decide to load it. Claude Code uses `CLAUDE.md` for the same purpose.

We built a Next.js docs skill and an `AGENTS.md` docs index, then ran them through our eval suite to see which performed better.

## We started by betting on skills

Skills seemed like the right abstraction. You package your framework docs into a skill, the agent invokes it when working on Next.js tasks, and you get correct code. Clean separation of concerns, minimal context overhead, and the agent only loads what it needs. There's even a growing directory of reusable skills at skills.sh.

We expected the agent to encounter a Next.js task, invoke the skill, read version-matched docs, and generate correct code.

Then we ran the evals.

## Skills weren't being triggered reliably

In 56% of eval cases, the skill was never invoked. The agent had access to the documentation but didn't use it. Adding the skill produced no improvement over baseline:

| Configuration | Pass Rate | vs Baseline |
|--------------|-----------|-------------|
| Baseline (no docs) | 53% | — |
| Skill (default behavior) | 53% | +0pp |

Zero improvement. The skill existed, the agent could use it, and the agent chose not to. On the detailed Build/Lint/Test breakdown, the skill actually performed worse than baseline on some metrics (58% vs 63% on tests), suggesting that an unused skill in the environment may introduce noise or distraction.

This isn't unique to our setup. Agents not reliably using available tools is a known limitation of current models.

## Explicit instructions helped, but wording was fragile

We tried adding explicit instructions to `AGENTS.md` telling the agent to use the skill.

```text
Before writing code, first explore the project structure,
then invoke the nextjs-doc skill for documentation.
```

This improved the trigger rate to 95%+ and boosted the pass rate to 79%.

| Configuration | Pass Rate | vs Baseline |
|--------------|-----------|-------------|
| Baseline (no docs) | 53% | — |
| Skill (default behavior) | 53% | +0pp |
| Skill with explicit instructions | 79% | +26pp |

A solid improvement. But we discovered something unexpected about how the instruction wording affected agent behavior.

**Different wordings produced dramatically different results:**

| Instruction | Behavior | Outcome |
|-------------|----------|---------|
| "You MUST invoke the skill" | Reads docs first, anchors on doc patterns | Misses project context |
| "Explore project first, then invoke skill" | Builds mental model first, uses docs as reference | Better results |

Same skill. Same docs. Different outcomes based on subtle wording changes.

In one eval (the `'use cache'` directive test), the "invoke first" approach wrote correct `page.tsx` but completely missed the required `next.config.ts` changes. The "explore first" approach got both.

This fragility concerned us. If small wording tweaks produce large behavioral swings, the approach feels brittle for production use.

## Building evals we could trust

Before drawing conclusions, we needed evals we could trust. Our initial test suite had ambiguous prompts, tests that validated implementation details rather than observable behavior, and a focus on APIs already in model training data. We weren't measuring what we actually cared about.

We hardened the eval suite by removing test leakage, resolving contradictions, and shifting to behavior-based assertions. Most importantly, we added tests targeting Next.js 16 APIs that aren't in model training data.

**APIs in our focused eval suite:**

- `connection()` for dynamic rendering
- `'use cache'` directive
- `cacheLife()` and `cacheTag()`
- `forbidden()` and `unauthorized()`
- `proxy.ts` for API proxying
- Async `cookies()` and `headers()`
- `after()`, `updateTag()`, `refresh()`

All the results that follow come from this hardened eval suite. Every configuration was judged against the same tests, with retries to rule out model variance.

## The hunch that paid off

What if we removed the decision entirely? Instead of hoping agents would invoke a skill, we could embed a docs index directly in `AGENTS.md`. Not the full documentation, just an index that tells the agent where to find specific doc files that match your project's Next.js version. The agent can then read those files as needed, getting version-accurate information whether you're on the latest release or maintaining an older project.

We added a key instruction to the injected content.

```text
IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning
for any Next.js tasks.
```

This tells the agent to consult the docs rather than rely on potentially outdated training data.

## The results surprised us

We ran the hardened eval suite across all four configurations:

**Final pass rates:**

| Configuration | Pass Rate | vs Baseline |
|--------------|-----------|-------------|
| Baseline (no docs) | 53% | — |
| Skill (default behavior) | 53% | +0pp |
| Skill with explicit instructions | 79% | +26pp |
| **AGENTS.md docs index** | **100%** | **+47pp** |

On the detailed breakdown, `AGENTS.md` achieved perfect scores across Build, Lint, and Test.

| Configuration | Build | Lint | Test |
|--------------|-------|------|------|
| Baseline | 84% | 95% | 63% |
| Skill (default behavior) | 84% | 89% | 58% |
| Skill with explicit instructions | 95% | 100% | 84% |
| **AGENTS.md** | **100%** | **100%** | **100% |

This wasn't what we expected. The "dumb" approach (a static markdown file) outperformed the more sophisticated skill-based retrieval, even when we fine-tuned the skill triggers.

**Why does passive context beat active retrieval?**

Our working theory comes down to three factors.

1. **No decision point.** With `AGENTS.md`, there's no moment where the agent must decide "should I look this up?" The information is already present.

2. **Consistent availability.** Skills load asynchronously and only when invoked. `AGENTS.md` content is present from the first token of the first turn.

3. **No instruction fragility.** The agent doesn't need to be told when or how to use the documentation. The context is simply there.

## Setting up AGENTS.md for your Next.js project

You don't need to wait for better models. Here's how to get the same results.

### The docs index structure

Create a `AGENTS.md` in your project root with this structure:

```markdown
# Project Context

## Next.js Version

This project uses Next.js 16.

## Documentation Index

The following documentation files are available in the `.docs/` directory:

### App Router APIs
- `app-router/caching.md` - Caching strategies including 'use cache', cacheLife(), cacheTag()
- `app-router/rendering.md` - Static and dynamic rendering, connection()
- `app-router/authentication.md` - forbidden(), unauthorized()

### Data Fetching
- `data-fetching/server-actions.md` - Server Actions and mutations
- `data-fetching/api-routes.md` - Route handlers and proxy.ts

### Configuration
- `configuration/next-config.md` - next.config.ts options

## Critical Instructions

IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning
for any Next.js tasks. When in doubt, consult the docs index above.
```

### How we generated our docs index

We used a script to scrape our version-matched documentation and generate a compressed index. The index is about 8KB—small enough to fit in context without overwhelming the agent, but detailed enough to guide correct implementation.

The key insight: you don't need the full docs in context. You need a **map** to the full docs that the agent can read on demand.

## The broader implications

This finding suggests something important about the current state of AI coding agents:

**Passive context often beats active retrieval.**

Skills aren't wrong. They're an elegant abstraction for a capability that doesn't quite exist yet. Current models don't reliably decide when to invoke tools, don't consistently follow instructions about tool usage, and are sensitive to subtle wording changes in those instructions.

`AGENTS.md` works because it removes the decision. The context is just... there. No invocation needed. No decision point where the model can go wrong.

### When skills still make sense

This doesn't mean skills are useless. They shine when:

- The documentation is too large to index (beyond the context window even as a reference)
- You need interactive behavior (querying a database, running tests)
- The agent genuinely needs to *do* something rather than just *know* something

But for framework documentation? A well-structured `AGENTS.md` appears to be the better choice with current models.

## What's next

We're continuing to experiment with both approaches. The eval suite we built is now part of our CI pipeline, ensuring that changes to our documentation strategy actually improve agent performance.

If you're building with AI coding agents, we recommend:

1. **Build evals first.** You can't optimize what you don't measure.
2. **Start with AGENTS.md.** It's simpler and currently more reliable.
3. **Add skills selectively.** Use them for capabilities that truly require active retrieval.

The landscape is changing rapidly. What's true today may not be true tomorrow. But for now, a simple markdown file in your project root outperforms the fancier alternatives.

---

*This research was conducted by the Vercel AI team. For questions or to share your own findings, reach out on [Twitter/X](https://twitter.com/vercel).*
