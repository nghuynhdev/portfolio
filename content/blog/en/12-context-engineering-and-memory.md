---
title: "Context Engineering: Helping AI Remember the Right Things at the Right Time"
seoTitle: "What Is Context Engineering? AI Context and Memory"
slug: context-engineering-and-memory
description: "Managing context for chatbots and agents: split the token budget, summarize history, keep task state, and store memories with a source and an expiry."
keywords: "context engineering, AI memory, context window, conversation summary, AI agent, AI for developers"
tags: "AI, Context, Memory, Developer"
date: 2026-04-21
---

# Context Engineering: Helping AI Remember the Right Things at the Right Time

**Context engineering is designing what goes into the context window on each model call: instructions, task state, conversation history, memory and tool evidence.** The prompt is only one part of it. The goal is for the model to have exactly the information it needs for the next step, nothing missing and nothing extra.

A long chat can contain the original request, three changes of mind, old error logs and a tool that returned thousands of lines. Resending all of it is expensive; dropping the earliest messages can lose an important constraint. The practical problem is choosing what information the model needs for its next step.

Choosing that information turn by turn is the job of context engineering.

## Separate three things that all get called "memory"

**Conversation history** records what was said. **Task state** records what is currently in effect: the goal, decisions made, steps done and what's still missing. **Long-term memory** is information that can be reused in a later interaction, such as the language a user picked.

They have different lifetimes and different reliability. "I'm trying Python today" doesn't automatically become "this person always uses Python". A tool result from a month ago doesn't prove the current state of the system either.

## Budget each part

The context window is finite, and how tokens are counted also depends on the model, tool use and processing modes. [Claude's context window documentation](https://platform.claude.com/docs/en/build-with-claude/context-windows) is one example of what has to be accounted for as conversations grow. For the provider you use, check its token counter and the matching limits.

You can start with a standalone budget splitter like this:

```ts
function availableEvidenceTokens(input: {
  contextLimit: number;
  instructions: number;
  taskState: number;
  recentMessages: number;
  reservedOutput: number;
  safetyMargin: number;
}) {
  const available = input.contextLimit
    - input.instructions
    - input.taskState
    - input.recentMessages
    - input.reservedOutput
    - input.safetyMargin;

  if (available < 0) throw new Error('Context budget exceeded');
  return available;
}
```

The inputs are measured token counts, not `string.length`. Extras such as tool descriptions also need to be counted in the right bucket. If the mandatory parts are already too large, stop or compact deliberately instead of silently cutting whatever happens to be there.

## Summarize so the work can continue

A good summary must keep "the customer chose option B and has not allowed sending the email", not just "options were discussed". A state template might include the goal, decisions, constraints, completed steps, open questions and source IDs.

A model-written summary can still be wrong. Keep the original history in a controlled store, along with which messages the summary covers. State with consequences — approvals, amounts, access rights — should come from your application's structured data. A summary sentence must never create permission to act.

When compacting history, keep tool call and tool result pairs intact as the API requires. Cutting a pair in half can make the request invalid or mislead the model about what happened.

## Memories need a source and a way to expire

A long-term record should have a `userId`, a tenant scope, the content, its source, a creation time and an expiry if needed. Let users edit or delete saved preferences. If they change their default language, the old record must be explicitly replaced, not left to compete as a second "truth".

Don't turn every sentence from external documents into memory. Untrusted content can carry instructions or false information; storing it long-term only makes the [injection risk](/ai-for-devs/bao-mat-ai-prompt-injection) last longer.

## Measure whether the work survives compaction

Add eval cases with long conversations: the user changes their mind, cancels a step, gives a constraint at the start and then talks about other things for many turns. After summarizing, ask the system what it should do next and what it must not do.

If the agent keeps the goal, the decisions and the necessary evidence after history is trimmed, your context mechanism is helping. If it remembers lots of wording but takes the wrong next step, fix how state is represented before reaching for a bigger context window.

Every post in this series is written from the perspective of [a developer who builds products](/), prioritizing what actually runs in production.
