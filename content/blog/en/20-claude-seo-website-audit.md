---
title: "Claude SEO: Audit Your Blog With Claude Code and Turn the Report Into Fixes"
seoTitle: "Claude SEO: How to Audit a Website With Claude Code"
slug: claude-seo-website-audit
description: "Website SEO audit with Claude SEO in Claude Code: install the plugin, audit each page, check technical SEO and schema, then fix."
keywords: "Claude SEO, Claude Code SEO skill, SEO audit, technical SEO, blog SEO, AgriciDaniel"
tags: "AI, Claude Code, Skills, SEO"
date: 2026-08-06
updated: 2026-11-13
cover: /images/blog/20-claude-seo-audit-website-v2.webp
---

# Claude SEO: Audit Your Blog With Claude Code and Turn the Report Into Fixes

A long SEO report can contain lots of tasks without telling you what to fix first. For a developer, the most useful part is connecting each finding to a URL, an HTML snippet or a source file, then confirming the change actually solved the problem.

This post is about **AgriciDaniel's Claude SEO**, a community skill/plugin set for Claude Code — not every repo with "SEO" in its name. The [original repo](https://github.com/AgriciDaniel/claude-seo) has the install instructions, runtime requirements and the external data integrations it supports.

## Install, then start with a small scope

Type these inside Claude Code, following the project's instructions:

```text
/plugin marketplace add AgriciDaniel/claude-seo
/plugin install claude-seo@agricidaniel-claude-seo
/seo setup
```

Check the menu after installing to see whether commands carry a namespace. The example commands below use the short form published by the SEO skill:

```text
/seo page https://example.com/blog/a-post
/seo technical https://example.com
/seo schema https://example.com/blog/a-post
```

Replace `example.com` with the site you want to check. `/seo setup` prepares the plugin's runtime; use `/seo doctor` to diagnose errors, per the README of your exact version. You don't need to connect every SEO API to check a public page.

## Require a report backed by evidence

I add requirements in plain language:

```text
Audit first; don't edit or publish content yet.
Each finding needs the URL, the evidence observed, the impact,
how to recheck it and the smallest fix.
Separate confirmed issues from hypotheses that need more data.
Don't infer traffic, search volume or rankings without a source.
```

These are constraints on the task, not a guarantee the tool has enough data. If a page can't be fetched, the correct conclusion is "not observed". If it only read the repo source, the report should distinguish intended configuration from the HTML the site actually serves.

## For a blog, check one complete journey

Pick the listing page, one post and a URL that doesn't exist. Check whether the title, description, main content, internal links and HTTP status fit each page. Check that the sitemap contains the URLs being served, rather than just confirming the XML file exists.

The canonical must point to the right representative page, not funnel every post to the homepage. [Google describes canonicals](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) as a preference signal, not a command that is guaranteed to be followed. When fixing, also check that redirects and internal links point to the same desired URL.

## Schema must describe the real content

For blog posts, compare the author, title and dates in JSON-LD with what's displayed. Don't create reviews, star ratings or fake author information just to fill fields. [Google explains structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) as a way to provide structured information; being valid doesn't guarantee a rich result.

After fixing, use an appropriate validator and look at the HTML from the deployed build. A correct JSON object in source doesn't prove the final page outputs the right data.

## Prioritize fixes and measure again

I handle issues that block access or the main content first, then wrong metadata/canonicals/schema, and only then content improvements. Each round takes a small group so it's easy to review and compare before/after.

For content, use Google's helpful-content criteria: what question does the post answer, does it have verifiable examples, does it offer original information beyond rephrasing its sources? Don't make keyword repetition the goal of writing. The examples in this post assume a personal blog like [my website](/): a portfolio page plus a series of posts.

An audit score is input for decisions, not a promise of better rankings. After deploying, monitor crawl/index status and [Search Console](https://search.google.com/search-console/about) data if you have access. Record the date of each change so you can evaluate over time, instead of treating one rerun of the report as proof that traffic went up.
