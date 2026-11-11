---
title: "webapp-testing: Let Claude Test Your Web App in a Real Browser"
seoTitle: "webapp-testing: Let Claude Test Your App in a Browser"
slug: webapp-testing-playwright-claude-code
description: "Using Anthropic's webapp-testing skill in Claude Code to reproduce interactions, check states and save evidence with Playwright instead of only reading source."
keywords: "webapp-testing skill, Claude Code Playwright, browser testing, E2E testing, Anthropic skills"
tags: "AI, Claude Code, Skills, Testing"
date: 2026-09-27
updated: 2026-11-11
---

# webapp-testing: Let Claude Test Your Web App in a Real Browser

Claude reads the code and says the search button works. But on the running page, a loading overlay still covers the form, so users can't click it. That's the kind of bug you won't necessarily find by looking at the event handler.

The **webapp-testing** skill in [Anthropic's repo](https://github.com/anthropics/skills/tree/main/skills/webapp-testing) guides interacting with and testing local web applications using Playwright, including behavior checks, screenshots and browser logs. It's useful when you want to connect a code fix to evidence in the UI.

## Installing the skill doesn't mean you have a browser

If you use the Skills CLI, choose Claude Code when installing:

```bash
npx skills add anthropics/skills --skill webapp-testing -a claude-code
```

According to its `SKILL.md`, the skill uses Python Playwright and includes a helper for managing servers. Your machine still needs the matching runtime, dependencies and browsers. When using the helper, check `--help` for your exact install first, because paths depend on where it was installed.

If a browser can't be launched in the current environment, report what wasn't checked. Don't switch from "I ran it" to "reading the code, it looks right" while keeping the same conclusion.

## Hand it a journey with a clear outcome

I tried it on the blog you're reading. The AI for Devs series is paginated (`/en/ai-for-devs`, `/en/ai-for-devs/page/2`…), and `/en/ai-for-devs/page/1` must redirect to the series root to avoid duplicate content. The task I gave it:

```text
Use webapp-testing to check pagination of /en/ai-for-devs in the local environment.
Identify the URL and port of the running server before interacting.
From page 1, go to page 2, open the first post, then go back.
Confirm /en/ai-for-devs/page/1 redirects to /en/ai-for-devs and a non-existent page number returns 404.
Record the steps run, assertions, relevant console errors and a screenshot on failure.
Don't edit post content to make the test pass.
```

That way Claude has to prove navigation really works, not just that the page-number buttons appear on screen.

## Observe first, then pick locators

Playwright recommends testing user-visible behavior and using resilient locators. Labels and roles usually express intent better than selectors based on the position of a `div`.

This blog's pagination is a `nav` labeled "Pagination", and each page number is a link labeled "Page N". The Python script sticks to those labels:

```python
import re
from playwright.sync_api import sync_playwright, expect

BASE = "http://localhost:3000"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    page.goto(f"{BASE}/en/ai-for-devs")
    pager = page.get_by_role("navigation", name="Pagination")
    pager.get_by_role("link", name="Page 2").click()
    expect(page).to_have_url(re.compile(r"/en/ai-for-devs/page/2$"))
    expect(page.get_by_role("heading", level=1)).to_contain_text("Page 2")

    # Open the first post on page 2, then go back
    page.get_by_role("main").get_by_role("listitem").first.get_by_role("link").click()
    expect(page.get_by_role("heading", level=1)).to_be_visible()
    page.go_back()
    expect(page).to_have_url(re.compile(r"/en/ai-for-devs/page/2$"))

    # /page/1 must not exist alongside the series root
    page.goto(f"{BASE}/en/ai-for-devs/page/1")
    expect(page).to_have_url(re.compile(r"/en/ai-for-devs$"))

    response = page.goto(f"{BASE}/en/ai-for-devs/page/99")
    assert response is not None and response.status == 404

    browser.close()
```

Choose assertions based on the state you need to reach instead of adding a long sleep. If the app polls continuously, waiting for `networkidle` may not fit; locators and assertions should key off content that is ready to use.

## A screenshot is evidence of one state

Screenshots help you see overflow, cropping and spacing. They don't prove that search filters correctly, that the save button calls the right API, or that data survives a reload. Add assertions for the behavior you need to protect.

When a test fails, save the reproduction steps and the URL/data state too. An image without context is hard for someone else to investigate. Conversely, a console log with unrelated warnings isn't enough to conclude that the user flow is broken.

## Keep tests isolated and in scope

Use test accounts and test data for anything that writes data. Don't trial-run sending emails or deleting real records just because the script says to click the final button. For external services, pick a test environment or a deliberate mock and record that limitation.

After fixing a bug, rerun exactly the journey that made it appear. A good report states what has been proven and what hasn't; that's the foundation for combining it with [UI review](/ai-for-devs/lam-ui-voi-claude-code-skills) and an [evidence-driven debugging](/ai-for-devs/superpowers-debugging-claude-code) workflow.

The blog and [my homepage](/) run in the same Next.js application, so this test suite protects both.
