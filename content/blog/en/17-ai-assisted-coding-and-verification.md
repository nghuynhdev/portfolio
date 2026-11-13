---
title: "Coding With AI: Give Clear Tasks and Verify Through Behavior"
seoTitle: "AI-Assisted Coding: How to Delegate and Verify AI Code"
slug: ai-assisted-coding-and-verification
description: "AI-assisted coding you can verify: give just enough context, split changes, review the diff and write tests from requirements."
keywords: "AI coding assistant, AI code generation, code review, testing, developer workflow, AI for developers"
tags: "AI, Coding, Testing, Developer"
date: 2026-06-28
cover: /images/blog/17-dung-ai-viet-code-va-kiem-chung-v2.webp
---

# Coding With AI: Give Clear Tasks and Verify Through Behavior

A 300-line change can be generated in a few minutes. Reading it to check that it preserves access control, keeps old error handling and doesn't change behavior beyond the request takes much longer. Typing speed isn't a good enough measure of how fast work gets done.

I like using AI as a collaborator that can read, propose and edit code, while the definition of done comes from the behavior we need. This workflow applies to many coding assistants and doesn't depend on a particular model.

## Write requests with verifiable boundaries

Instead of "make the API secure", describe the concrete situation: a user can only read their own orders; a non-existent ID and an ID without permission both leak no data; the current response format is preserved.

A useful task has four parts: behavior before/after, the relevant files or flow, constraints to keep, and how to confirm it. If you don't know the cause yet, ask it to read the flow before editing. There's no need to invent a bug location just to make the prompt look detailed.

```text
Fix the endpoint that reads an order.

Requirements:
- Use the identity from the server-side session.
- Only return orders that belong to the signed-in user.
- Do not use ownerId from the body/query as the basis for authorization.
- Keep the current response when the order can be read.

Check the route, the query layer and the related tests,
then make the smallest change that covers all the cases above.
```

Include the conventions and the check commands that actually exist in the repo. AI can suggest an API or script that sounds plausible but doesn't exist in the version you use.

## Give context with a purpose

Have it read the route, service, schema and tests closest to the flow being changed. If the repo has an architecture guide, point to that file. Stuffing in unrelated files can bury an important constraint.

For large changes, split by testable behavior: fix authorization first, then change the query if needed, then adjust the UI. A tight diff helps the reviewer see what really changed.

## Tests must side with the requirements

The authorization logic below is a standalone function for illustration. In the application, the caller's identity must come from an authenticated session; the repository must enforce the same permission condition, not rely on hiding a button in the UI.

```ts
import assert from 'node:assert/strict';

type Order = { id: string; ownerId: string };

function canReadOrder(userId: string | null, order: Order) {
  return userId !== null && order.ownerId === userId;
}

const order = { id: 'order-1', ownerId: 'alice' };

assert.equal(canReadOrder('alice', order), true);
assert.equal(canReadOrder('bob', order), false);
assert.equal(canReadOrder(null, order), false);
```

These three assertions only check the function; they don't prove the endpoint is safe. You need integration checks confirming the route reads the right session and the query doesn't return records the user isn't allowed to see. A test that only mocks a successful service skips exactly the risky part.

A good question when reviewing tests: "If I remove the permission check from the code, which test fails?" If none does, the test suite isn't protecting an important requirement.

## Read the diff before trusting the report

Check whether the AI added dependencies, changed the lockfile, edited configuration or loosened validation beyond the request. Each change might be reasonable on its own, but together they inflate the scope of the review.

Compare the check commands it ran with their real output. "Checked" needs to distinguish typechecking, unit tests and running the application; they catch different kinds of bugs. If the environment can't run a check, record that limitation rather than treating it as passed.

## AI review is a source of suggestions

AI can point out real bugs, miss bugs or raise false alarms. [GitHub's responsible use documentation](https://github.com/github/docs/blob/main/content/copilot/responsible-use/agents.md) also lists limitations such as missing issues and suggesting incorrect or insecure code. A confident comment still needs checking against the code and real behavior. I use AI to write code every day in my [full-stack work](/#overview), and the workflow here is what lets me keep trusting the code I merge.

To measure whether it helps, track the time from starting to a confirmed change, the number of revision rounds, and bugs that slip past the merge. When the task, the diff and the verification evidence are all clear, AI removes a lot of repetitive work while the developer stays in control of what goes into the product.
