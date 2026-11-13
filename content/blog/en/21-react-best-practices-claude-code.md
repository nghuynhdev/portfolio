---
title: "React Best Practices: Use Claude to Optimize the Real Bottleneck"
seoTitle: "React Best Practices Skill: Optimize React With Claude"
slug: react-best-practices-claude-code
description: "Vercel's React Best Practices skill in Claude Code: find waterfalls, check the bundle and server/client boundary, measure gains."
keywords: "vercel-react-best-practices, Claude Code React, Next.js performance, React skill, Vercel agent skills"
tags: "AI, Claude Code, Skills, React"
date: 2026-09-15
cover: /images/blog/21-react-best-practices-skill-claude-code-v2.webp
---

# React Best Practices: Use Claude to Optimize the Real Bottleneck

A slow page doesn't mean the first thing to do is add [`memo`](https://react.dev/reference/react/memo). Two independent requests might be waiting on each other, a large library might be loaded on every route, or the whole page might have become a [client component](https://nextjs.org/docs/app/getting-started/server-and-client-components) because of one small interactive button.

The **vercel-react-best-practices** skill in [Vercel's agent skills collection](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices) provides guidance on React/Next.js performance, prioritizing problems like waterfalls and bundle size. I use it to help investigate a symptom that can be measured.

## Install it, then describe a concrete symptom

If you use the Skills CLI:

```bash
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices -a claude-code
```

The command targets Claude Code; choose the right scope in the installer. Before refactoring, ask it to read `package.json`, the routing setup and the relevant components. Recommendations depend on the framework version; newer React APIs aren't available in a repo on an older React.

```text
Use React Best Practices to investigate why the dashboard page loads slowly.
Read the React/Next.js versions and the current fetch flow first.
Find a bottleneck with evidence; don't refactor in bulk yet.
Propose one small change, explain how to measure before/after,
and check that data and permissions stay the same.
```

## Confirm the data really is independent

This standalone TypeScript example only illustrates running two operations in parallel:

```ts
async function loadDashboard<TProfile, TOrders>(
  loadProfile: () => Promise<TProfile>,
  loadOrders: () => Promise<TOrders>,
) {
  const [profile, orders] = await Promise.all([
    loadProfile(),
    loadOrders(),
  ]);
  return { profile, orders };
}
```

If orders need an ID from the profile, or may only be queried after authentication completes, don't start both at once. Syntactically independent doesn't mean independent in the business logic. You also have to decide whether one failing branch fails the whole screen or the rest is still shown.

This example doesn't promise a speedup in every environment. Look at the real waterfall, connection limits and downstream cost; too much parallelism can just push load somewhere else.

## Check what users actually have to download

For a table with a chart that opens on click, check whether the charting library is in the initial bundle. If it's used only in a rare interaction, consider loading it on demand. Also measure the time to open the chart the first time, so you don't quietly shift the delay to the next step.

In Next.js, look at which parts actually need client interactivity. A filter button doesn't require the whole static content area to run on the client. However, splitting a component has to preserve its props contract and how state updates; don't move the boundary just to reach a structure considered "clean".

## Caches must keep the right data scope

If it proposes caching, ask Claude to state the key, the lifetime, the invalidation mechanism and the user/tenant scope. A cache that responds fast but mixes two people's data is a wrong change.

Don't apply caching advice from memory of another Next.js version. Check the documentation for your exact version and route configuration. When you don't know how fresh the data needs to be, ask the product requirements instead of picking a random lifetime.

## Measure under the same conditions

Record the route, sample data, build mode and the device/network used for measuring. Compare load time, interaction or bundle size according to the original symptom. Don't compare the old version in dev mode with the new version's production build.

Once there's a change, check the error and loading states too. A good optimization refactor preserves user behavior. Use [UI review](/ai-for-devs/lam-ui-voi-claude-code-skills) and [browser testing](/ai-for-devs/webapp-testing-playwright-claude-code) for the affected interface, instead of treating a performance score as enough to conclude.

See [the React/Next.js technologies I use](/#skills) on my homepage.
