---
title: "Building UI With Claude Code: UI UX Pro Max, frontend-design and Web Design Guidelines"
seoTitle: "Building UI With Claude Code: UI UX Pro Max and More"
slug: building-ui-with-claude-code-skills
description: "Build UI with Claude Code skills: UI UX Pro Max for the design system, frontend-design for visuals, design guidelines for review."
keywords: "UI UX Pro Max, frontend-design skill, web-design-guidelines, Claude Code UI, Anthropic skills, Vercel skills, AI UI design, UI review"
tags: "AI, Claude Code, Skills, UI UX"
date: 2026-08-01
updated: 2026-11-11
---

# Building UI With Claude Code: UI UX Pro Max, frontend-design and Web Design Guidelines

"Make this page look better" leaves far too much for the AI to decide on its own. Given the same request, Claude might change the font, add a gradient, invent another card style and pull the page away from the existing system. On the other hand, a page with a hero, three cards and a CTA button can still fail to say how the product differs from anything else. And an icon-only button looks neat in a screenshot, but keyboard and screen-reader users have no idea what it does.

Those three problems map to three steps of a UI workflow, and each step has a matching skill:

| Step | Question | Skill |
|---|---|---|
| 1. Direction | How are color, type, spacing and components used consistently? | **UI UX Pro Max** |
| 2. Implementation | What should this page emphasize to have its own identity? | **frontend-design** (Anthropic) |
| 3. Review | Are there interaction, accessibility or state problems that were missed? | **Web Design Guidelines** (Vercel) |

Use all three in order; each step has its own output: design decisions, the interface, and a list of issues with evidence. If you're not sure how skills differ from plugins and MCP, read [choosing skills for Claude Code](/ai-for-devs/chon-skill-cho-claude-code) first.

## Step 1 — UI UX Pro Max: settle the design system before drawing

**UI UX Pro Max** by `nextlevelbuilder` provides design guidance with lookup data on styles, color palettes, typography and UX. It's a community skill; the [original repo](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) is where to check installation instructions and updates. According to the README, type these inside a Claude Code session (not the terminal):

```text
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

Some of the skill's lookups use Python — installing the plugin doesn't mean your machine has the runtime. If a tool is missing, handle it as the message says; don't let Claude skip the step and still report that it applied everything.

A good brief has a subject, users and a main job:

```text
Use UI UX Pro Max to improve the post management page.
Users: personal bloggers, mostly working on a laptop.
Main job: find a post, see its status and open a draft to edit.
Keep the logo, brand colors and existing library components.
Content is in Vietnamese, with long titles and posts without images.
Before editing, state the direction for typography, spacing, color and hierarchy.
Check mobile, empty state, loading and data-loading errors too.
```

Don't settle for one nice screenshot. Ask for **reusable rules**: type sizes, spacing, semantic colors, primary/secondary buttons, focus states. If the repo already has design tokens, map to those before creating new ones. Suggestions in the project's `SKILL.md` are reference input; the final decision still has to fit the brand and the content.

## Step 2 — frontend-design: add deliberate emphasis

The **frontend-design** skill in the `anthropics/skills` repo focuses on visual direction, typography and deliberate design choices — a good fit when building new UI or reworking a look. Install it with the Skills CLI in the terminal:

```bash
npx skills add anthropics/skills --skill frontend-design -a claude-code
```

The brief should say what the visitor is trying to judge. For a developer portfolio, the projects section usually deserves more priority than a generic self-introduction:

```text
Use frontend-design to design a page introducing an open-source project.
Readers are developers who want to know what it does and whether to try it.
Available content: a short description, usage examples, three limitations and a repo link.
Prioritize a runnable example together with getting-started instructions.
Keep the logo, brand colors and the tokens settled in the previous step; write in Vietnamese.
```

Choose **one** point of emphasis that serves the content: an image-processing library opens with a before/after interaction, a CLI tool opens with a sample command and its output, a technical blog shows featured posts and a reading path. Not every page needs to be unusual — a login page needs to be clear and familiar. Ask Claude to explain what the emphasis helps the reader understand or decide; if it can't answer, drop it.

Two notes when combining with step 1: keep the settled tokens as constraints rather than letting each skill pick its own palette; and don't let the AI invent testimonials, numbers or product images to fill the layout.

## Step 3 — Web Design Guidelines: evidence-based review

Vercel's **web-design-guidelines** skill reviews UI code against the Web Interface Guidelines. Its source is in `vercel-labs/agent-skills`:

```bash
npx skills add vercel-labs/agent-skills --skill web-design-guidelines -a claude-code
```

Give it one screen or component group at a time; don't "audit the whole app" on the first pass:

```text
Use web-design-guidelines to review the sign-up page and its components.
Don't change code on this first pass.
Prioritize issues that stop users from completing sign-up.
Each finding needs file/line, when it happens, evidence and how to verify it.
Separate visual-preference remarks from behavioral bugs.
```

A useful finding looks like: "The delete button has no accessible name; when buttons are listed, users can't tell which item it deletes; add a label tied to the item name and recheck in the accessibility tree." Whereas "the UX isn't great, make it more modern" points to neither a bug nor a definition of done.

Ask Claude to state which findings come from reading source and which were reproduced in a browser. Code tells you whether a `button` is used, whether it has a label, whether errors are handled; only the browser tells you whether the button is covered by another layer, text overflows, or focus is lost after a render. And one review is not a certificate of full accessibility compliance.

## Test with hard content and real states

Whatever skill you use, run the first version with "ugly" data, not short placeholders:

- Two-line Vietnamese titles, long author names, many tags, posts without images, images with odd aspect ratios.
- Forms: invalid data, submitting, server error, success, double-clicking submit.
- Modals and menus: open/close with the keyboard, focus returning to the right place, states that don't rely on color alone.
- Animation: turn on reduced motion; content must stay readable when effects don't run.

Finally, ask a real person to open the page and do the main job in a few steps. If they think it looks nice but don't know where to click, fix the information hierarchy instead of adding effects. To record behavioral evidence and rerun it after each change, add [webapp-testing with Playwright](/ai-for-devs/webapp-testing-playwright-claude-code); when the page is slow, move to [React Best Practices](/ai-for-devs/react-best-practices-skill-claude-code).

You can look at [my portfolio site](/) as an example of a consistent dark theme across the landing page and the blog.
