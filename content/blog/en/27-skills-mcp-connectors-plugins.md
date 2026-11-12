---
title: "Skills, MCP, Connectors, Plugins: Why Does the Same AI Do the Work for Other People?"
seoTitle: "Skills vs MCP vs Connectors vs Plugins in Claude"
slug: skills-mcp-connectors-plugins-explained
description: "How Skills, MCP, Connectors and Plugins differ, and how they fit together so Claude does the work instead of waiting for commands."
keywords: "Claude skills, MCP, Claude connectors, Claude Code plugins, AI agent, AI automation"
tags: "AI, Claude Code, Skills, MCP"
date: 2026-11-12
---

# Skills, MCP, Connectors, Plugins: Why Does the Same AI Do the Work for Other People?

You and a coworker use the same model. You still copy numbers into the chat box, paste the report template again, and remind it to "send this to Alex". Your coworker types "do the weekly report", goes to make coffee, and comes back to a draft in their inbox.

The model isn't different. What's attached to it is. The four pieces people mention most are **Skills, MCP, Connectors and Plugins**, and newcomers tend to lump them together. This post separates them, shows which problem each one solves, and suggests where to start.

## Think of the AI as a new hire

A new hire can be very capable and still be stuck on day one for two reasons:

1. **They don't know the company's processes yet:** which report template to use, where the numbers come from, who gets the result.
2. **They don't have accounts yet:** no access to Gmail, Drive, Notion or the CRM.

The four pieces below handle those two problems, then bundle everything so you don't have to set each part up by hand.

| Piece | Role in the new-hire picture | What it solves |
|---|---|---|
| Skill | Process handbook | Knowing **how to do** a task |
| MCP | A shared port standard (like USB-C) | The rules for the AI to **talk to apps** |
| Connector | A cable already plugged into a specific app | **Access** to Gmail, Drive, Notion… |
| Plugin | A pre-packed toolkit | **Install once**, get both process and access |

## Skills: the process handbook

A skill is where you write down how to do a recurring task. Take the weekly report: which sheet the numbers come from, which template, what tone, who receives it, what to check before sending.

Some people say a skill is just a "wrapped prompt". That's half right. In Claude, a skill is a folder with a `SKILL.md` file, and besides the instructions it can carry **templates, scripts and reference documents**. The more important part is how it loads: at first Claude only sees each skill's name and short description, and it opens the full content only when the current task matches that description. Installing ten skills doesn't mean ten handbooks get stuffed into every question.

A minimal skill in a Claude Code project lives at `.claude/skills/weekly-report/SKILL.md`:

```markdown
---
name: weekly-report
description: Write the team's weekly report. Use when the user mentions the weekly report.
---

1. Pull this week's numbers from `data/weekly.csv`.
2. Fill in `template.md` from the skill folder, keeping every section.
3. Keep it short: at most three bullets per section, with the change versus last week.
4. Before returning the result, check the totals against the source file.
```

The `description` decides when the skill is used, so write it as the answer to "when should this handbook be opened?". How to write and test your own skill is covered in [the post on writing a Claude Code skill](/ai-for-devs/viet-skill-rieng-cho-claude-code).

But a handbook only teaches the steps. It can't open Gmail. For the AI to touch other apps, you need the next piece.

## MCP: the shared port standard

**MCP (Model Context Protocol)** is an open protocol that defines how an AI application connects to tools and data sources. The USB-C comparison holds up well: a manufacturer builds a port to the standard, and any device that supports the standard can plug in.

Before MCP, every AI app wrote its own integration for every tool. With MCP, a service only needs one **MCP server**, and every MCP client (Claude, Claude Code, Cursor, VS Code…) can use it. That server exposes tools to the AI, such as "search email", "read file" or "create a Notion page".

MCP is a **standard**, not a product you click to install. A deeper explanation, with an MCP server written in TypeScript, is in [the post on what MCP is](/ai-for-devs/mcp-model-context-protocol-la-gi).

## Connectors: the pre-plugged cable

If MCP is the port standard, a connector is a specific cable already plugged into one app: Gmail, Google Drive, Google Calendar, Notion, GitHub… Most connectors in Claude are MCP servers packaged with a sign-in step, so people who don't write code can use them.

In the Claude app, open **Connectors** in settings or customization (the exact menu name can change between versions), pick a service, click **Connect** and sign in. Then ask "what's on my calendar tomorrow afternoon?" and Claude calls the Calendar connector itself instead of asking you to paste your schedule.

In Claude Code, the equivalent is adding an MCP server from the terminal:

```bash
claude mcp add --transport http service-name https://example.com/mcp
```

Two things to keep in mind when plugging in:

- **A connector carries your account's permissions.** Letting the AI read Gmail also means email content, including mail from strangers, enters its context. That's exactly how [prompt injection](/ai-for-devs/bao-mat-ai-prompt-injection) gets in, so only enable what you need and watch any action that can write or send.
- **Pick trusted sources.** Prefer the service's official connector or Claude's connector directory, and read the requested permissions before you approve.

## Plugins: the whole kit, pre-packed

Installing skills one by one, wiring each connector, setting up your own shortcuts… it gets tiring after a few rounds. A plugin bundles those into one package: skills, MCP servers or connectors, slash commands, subagents and hooks. One install and you have everything.

A plugin for a sales team might include:

- A skill that drafts outreach emails in the company's voice.
- A connector to the CRM for the customer list and conversation history.
- A `/follow-up` command that drafts reminders for customers who haven't replied in 7 days.

In Claude Code, plugins are installed from a marketplace with the `/plugin` command inside a session. Like any package, a plugin can run code and hooks on your machine, so look at the source repo before installing. Choosing and vetting sources is covered in [the post on choosing Claude Code skills](/ai-for-devs/chon-skill-cho-claude-code).

## The four-line summary

- **Skills** teach the AI *how to do it*.
- **MCP** is the *plug standard* for the AI to talk to apps.
- **Connectors** are the *cables* into specific apps using that standard.
- **Plugins** *bundle it all* for a single install.

## Where to start

1. **Write a skill first.** Pick a task you do every week where you keep repeating the same instructions. Turn it into a skill, run it a few times, and tune the description until Claude recognizes on its own when to use it.
2. **Add connectors next.** Once the skill works on data you paste in, connect the source so Claude fetches the data itself. Start read-only if you can.
3. **Install a plugin when you need the whole kit.** If a plugin already does what you need, install it instead of assembling your own. If not, the skills and connectors you've already tested are the raw material for a plugin your team can share later.

## Four pieces still isn't the finish line

"Four pieces" videos and posts usually stop here. From using Claude Code every day, I'd add three things that decide whether the AI really does the work for you:

- **Project context.** Conventions that always apply (which libraries, which test command, which language to write in) belong in [CLAUDE.md and rules](/ai-for-devs/claude-md-va-rules-cho-du-an), not in a skill.
- **Execution permissions.** Neither skills nor connectors grant permission to run commands or send email on their own. You decide that through permission modes: read-only work can run on its own, while sending, deleting or paying should ask first.
- **Verification.** "Done" doesn't mean "correct". A good process always includes a check: run the tests, [try it in a real browser](/ai-for-devs/webapp-testing-playwright-claude-code), compare numbers against the source.

A real example from the repo behind [this portfolio](/#overview): one Claude Code session converted the avatar to WebP and recompressed heavy images, removed a redundant breadcrumb on the AI for Devs page, and tightened mobile spacing. I didn't type a compression command for each image. Claude ran the compression tool, opened the page in its built-in browser, shrank the viewport to phone size to screenshot and check it, and only then committed. I described what I wanted and reviewed the end result. None of the pieces is magic; they just have to be put in the right place.

This post is part of the AI for Devs series by Nguyen Huynh, a fullstack developer who uses Claude Code daily for both work and this blog.
