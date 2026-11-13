---
title: "Superpowers for Claude Code: Debug With Hypotheses, Fix With Evidence"
seoTitle: "Superpowers for Claude Code: Systematic AI Debugging"
slug: superpowers-debugging-claude-code
description: "Debugging with Superpowers skills in Claude Code: reproduce the bug, test hypotheses and avoid guess-driven fixes."
keywords: "Superpowers Claude Code, obra superpowers, systematic debugging, verification before completion, AI debugging"
tags: "AI, Claude Code, Skills, Debugging"
date: 2026-10-08
cover: /images/blog/23-superpowers-debugging-claude-code-v2.webp
---

# Superpowers for Claude Code: Debug With Hypotheses, Fix With Evidence

A search bug appears after changing the filters a few times. Claude fixes the debounce; the bug is still there. It keeps changing state, adds a timeout, and in the end the component is more complex but the cause still isn't clear. At that point, what needs improving is the way you investigate.

**Superpowers** by `obra` is a set of skills and software development workflows for coding agents. The [original repo](https://github.com/obra/superpowers) has installation instructions for Claude Code. In this post I focus on two parts: systematic investigation, and verification before concluding.

## Install the workflow following the original instructions

One install method published in the README is the project's marketplace. Type this in Claude Code:

```text
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

Check the installed version and the workflow descriptions before using them. A full workflow set can add steps for planning, splitting work and review; for small tasks you still need to state the scope and the expected output. Don't install several versions side by side without knowing which rules are being loaded.

## Require investigation before trying fixes

The [systematic-debugging](https://github.com/obra/superpowers/tree/main/skills/systematic-debugging) skill emphasizes finding the root cause by reading errors, reproducing and checking evidence. Applied to the search bug, the task could be:

```text
Investigate the bug where search results jump back to an old query.
Steps: type "react", then immediately replace it with "rag".
Expected: only results for the latest query are shown.
Reproduce it, state hypotheses and test each one.
Before changing code, show evidence of where it goes wrong.
Keep the current API and UI.
```

This is an illustrative scenario. In a real repo, confirm the UI, the requests and the data before assigning a cause.

## A hypothesis needs a test that tells causes apart

Suppose the request for "react" returns after the request for "rag". An old response might be overwriting the new state. But a cache might also be returning the wrong key, or the URL might sync late. Each cause needs a different test.

Record a sequence ID, the query and the completion time in the dev environment, then deliberately add different delays with test data. Watch which response updates the UI. Don't log sensitive content just to have more data.

If a race condition is confirmed, possible fixes include cancelling the old request or only applying a response that still matches the current query. Choose based on the library you use, and test the case where the API keeps processing even after the client aborts.

## Keep one change answering one cause

Don't swap the fetch library, restructure the component and add caching all at once just to fix a race condition. A tightly scoped diff tells you what changed the behavior and is easy to revert if the hypothesis was wrong.

A regression test should make the old response arrive later and confirm the UI keeps the new results. If the test only checks that the request returns 200, it doesn't protect the symptom users experienced.

## Read the output before saying it's fixed

The verification-before-completion skill requires evidence from checks before claiming completion. In this example, the evidence must include the original reproduction and the post-fix scenario; typechecking alone doesn't prove the response order is now correct.

State the commands or journeys run, their results and what wasn't checked. If the browser couldn't launch, you can confirm the logic test passed but you can't say the real interaction was verified.

## Use the workflow at the right scale

Not every one-word change needs a big investigation. I use this workflow when a bug has several plausible causes, is hard to reproduce, or earlier fix attempts have failed. The goal is fewer guess-driven fixes and keeping [behavioral evidence](/ai-for-devs/dung-ai-viet-code-va-kiem-chung) — not longer reports for every task.

Have a tricky bug you want to talk through? [Get in touch](/#contact) — I enjoy debugging cases like this.
