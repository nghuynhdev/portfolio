---
title: "CLAUDE.md and Rules: Teach Claude Your Project's Conventions Once"
seoTitle: "What Is CLAUDE.md? Writing Rules for Claude Code"
slug: claude-md-and-rules-for-your-project
description: "Write CLAUDE.md and rules for your project: keep CLAUDE.md short, scope rules, list real check commands, keep context lean."
keywords: "CLAUDE.md, Claude Code rules, project instructions, AI context, Claude workflow"
tags: "AI, Claude Code, Context, Developer"
date: 2026-10-01
updated: 2026-11-13
cover: /images/blog/24-claude-md-va-rules-cho-du-an-v2.webp
---

# CLAUDE.md and Rules: Teach Claude Your Project's Conventions Once

**CLAUDE.md is a Markdown file in your repo with project instructions that Claude Code reads at the start of a session: code conventions, build and test commands, folder layout.** Rules are smaller instruction files split by topic or path, for when a single CLAUDE.md stops being compact.

You want Claude to use the existing components, but it keeps creating a new button. You want content kept in Vietnamese, but every new page comes with English placeholders. That kind of stable information deserves a shared home, instead of relying on remembering to mention it in every prompt.

[Claude Code's memory documentation](https://code.claude.com/docs/en/memory) describes how these files are loaded and how they differ from auto memory.

## Write down what the repo really needs

A useful set of instructions for a blog repo might look like this. It's a template to adapt, not configuration already installed in your project:

```markdown
Project conventions

- Blog content lives in content/blog; every post has a unique slug.
- Content is written in Vietnamese; keep API names and code identifiers as they are.
- Reuse existing components and design tokens before creating new ones.
- For content changes, check frontmatter and internal links.
- When editing code, read the scripts in package.json to choose the check command.
- Report what was verified separately from what couldn't be run.
```

These lines answer questions that come up during real work. "Write really good code" or "always act as an expert" don't point to any specific decision, so it's hard to tell whether they help.

## Check commands must exist

If the instructions say `npm test` but the repo has no such script, the agent will keep walking into dead ends. Look at the actual scripts, the environment they need and the limits of each check.

For post edits, checking the parser and links may be enough for the content. For routing changes, you need to check the corresponding paths. Don't use a single command as evidence for every kind of change.

When you change the package manager or framework, update the instructions in the same change. A file describing the old repo is sometimes worse than having no instructions, because it makes wrong choices look confirmed.

## Split rules by the work they relate to

According to the official documentation, `.claude/rules/` lets you split content and use `paths` to apply rules to groups of files. For example, a rule for blog posts:

```yaml
---
paths:
  - "content/blog/**/*.md"
---
```

Below the frontmatter, write rules such as required metadata, how to use internal links, and the requirement to cite sources for information that changes over time. Don't make the same rule responsible for both database migrations and button design.

Check how rules are loaded in the Claude Code version you use. If your repo uses several kinds of instruction files, read the current precedence rules and keep the content consistent; don't assume every file name is read the same way by every agent.

## Separate durable instructions from one task's data

"All blog posts have frontmatter" is a durable convention. "Write post number 31 today" is a task request. "We're waiting for the client to confirm the product name" is work state.

If you put all three into the root file without managing their lifecycle, a few months later Claude may read expired requests as current rules. Keep the active brief somewhere clearly scoped, and clean it up when you're done.

## Instructions are not an authorization mechanism

A line saying "never read secrets" is an instruction; it doesn't replace filesystem permissions, [tool permissions](https://code.claude.com/docs/en/permissions) or runtime configuration. Don't put tokens and passwords into `CLAUDE.md` so the agent "knows to avoid them". Use your application's secret management.

That's also why adding "ignore all restrictions" to `CLAUDE.md` doesn't "jailbreak" anything; I go into this in detail in [Jailbreaking Claude and the limits of CLAUDE.md](/ai-for-devs/jailbreak-claude-va-gioi-han-claude-md).

Likewise, an instruction file doesn't prove the code follows every rule. You still need to check behavior and read the diff, especially where data or side effects are involved.

## When should it become a skill?

If the content is a workflow used only for SEO audits, blog reviews or UI testing, a [skill](/ai-for-devs/chon-skill-cho-claude-code) is a better place to package it. Keep the always-true part short and easy to find; move long task-specific instructions into dedicated documents. You can start with [a small blog-review skill](/ai-for-devs/viet-skill-rieng-cho-claude-code) and evaluate it on a few real posts.

The convention template at the top of this post was written for a blog repo like [my portfolio](/): Markdown content living alongside a Next.js application.
