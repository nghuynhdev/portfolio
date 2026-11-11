---
title: "LLM Reliability: Timeouts, Retries, Fallbacks and Idempotency"
seoTitle: "LLM Retries, Timeouts and Fallbacks: Reliable AI Apps"
slug: llm-reliability-timeouts-retries-idempotency
description: "Make LLM apps fault-tolerant: request deadlines, budgeted retries with backoff and jitter, contract-preserving fallbacks, and idempotent agent actions."
keywords: "LLM retry, timeout, exponential backoff, jitter, model fallback, idempotency, durable AI workflow, outbox, AI agent, AI for developers"
tags: "AI, Reliability, Agent, Backend"
date: 2026-05-02
updated: 2026-11-11
---

# LLM Reliability: Timeouts, Retries, Fallbacks and Idempotency

Two very ordinary incidents when you put an LLM into production:

- A slow request makes the frontend retry. The backend has its own retry. So does the SDK. Each layer allows three attempts, nested inside each other — one user click becomes **27 calls** to the model, right when the provider is overloaded.
- An agent drafts an email, calls the email service, and the worker dies before recording "sent". The job restarts from the beginning — the customer receives **two identical emails**.

These are two sides of the same problem: the system has to know what to do when a call fails or its outcome is unknown. For read-only operations, the answer is controlled retries. For operations with side effects, the answer is idempotency and reconciliation. This post covers both.

## Part 1 — Read-only operations: timeouts and budgeted retries

### Pick one owner for retries

Check the defaults of your SDK, gateway and queue before writing another loop. One place should decide the number of attempts and the time remaining; the other layers cooperate instead of multiplying retries.

[AWS analyzes timeouts, retries and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/) and stresses a point that's easy to forget: **a timeout doesn't prove the side effect didn't happen**. A model call that was cut off may still have been billed; a notification tool may have already sent its message.

### A deadline for the whole request

A per-call timeout isn't enough. Wait 20 seconds per call, try three times, and the user waits nearly a minute plus backoff. You need an overall deadline covering queueing, retrieval, model calls and retry waits. When the caller cancels, propagate the cancellation to every running operation.

```ts
async function requestWithBudget(url: string, payload: unknown, budgetMs = 12_000) {
  const deadline = performance.now() + budgetMs;

  for (let attempt = 0; attempt < 3; attempt++) {
    const remaining = Math.floor(deadline - performance.now());
    if (remaining <= 0) throw new Error('Deadline exceeded');

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(remaining),
    });

    if (response.ok) return await response.json();

    const retryable = [408, 429, 502, 503, 504].includes(response.status);
    await response.body?.cancel();
    if (!retryable || attempt === 2) {
      throw new Error(`Upstream HTTP ${response.status}`);
    }

    // Full jitter: wait a random time within a growing, capped window
    const delay = Math.floor(Math.random() * Math.min(2_000, 250 * 2 ** attempt));
    if (performance.now() + delay >= deadline) throw new Error('Retry budget exhausted');
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error('Attempts exhausted');
}
```

This function is only for reads or for generating results that haven't been shown yet. In a real application, read the `Retry-After` header (both the seconds and HTTP-date forms) and stop if the retry time exceeds the deadline; distinguish a 429 from rate limiting from an exhausted quota. Authentication errors, malformed payloads or a model that doesn't support a feature need configuration fixes — repeating the identical call just costs more money.

### Streaming can't be silently replayed

If the user has already seen half an answer, retrying and appending the new output to the old creates repeated or contradictory content. The UI should mark the answer as "interrupted" and offer an explicit regenerate (see the error-handling part of [the Next.js streaming post](/ai-for-devs/tich-hop-ai-vao-nextjs-streaming)).

### Fallbacks must keep the same contract

A fallback model has to meet the same schema, language, tools and data policy. Don't automatically push internal documents to a provider that isn't approved for that kind of data. If the fallback can only produce a draft, the product must show that state.

Finally, limit concurrent requests and queue length. Google SRE treats overload handling as part of reliability: when the budget is gone, returning "try again later" beats letting every request hang and then fail together.

## Part 2 — Operations with side effects: idempotency and durable workflows

[The tool-calling loop](/ai-for-devs/ai-agent-dau-tien-function-calling) explains how a model chooses an action. To run it for real, you also have to answer: how does the work continue after an error, a timeout, or an approval wait that lasts hours? **Don't apply the retry function above to send/delete/payment tools.**

### Move progress out of process memory

Important state must not live only in a JavaScript variable or in the chat history. Store a workflow record with an ID, owner, version, current state and the result of each step:

```text
created -> collecting -> drafted -> awaiting_approval
                                  -> rejected
awaiting_approval -> approved -> sending -> sent
                                        -> needs_reconciliation
```

Every state transition needs a clear condition. A worker only takes the `approved -> sending` step when the version still matches — use a conditional update or a database lock so two workers can't take the same step. Frameworks such as LangGraph have checkpointing for recovery, but a checkpoint doesn't magically make an external API "exactly once".

### An idempotency key represents one action

When the target service supports idempotency, resending with the same key means "complete this action", not "create a new one". The key is tied to a durably stored action:

```ts
type ApprovedAction = {
  id: string;
  revision: number;
  recipient: string;
  subject: string;
  body: string;
  approvedPayloadHash: string;
};

function deliveryKey(action: ApprovedAction) {
  return `email:${action.id}:revision:${action.revision}`;
}
```

The action must be stored before the API is called. Editing the content creates a new revision that needs approval again; never reuse an old key for a different payload.

If the service supports neither idempotency nor status lookup, a timeout leaves the outcome **unknown**. Move to reconciliation instead of marking it failed and sending again — "no response" doesn't prove the email wasn't sent.

### Approvers must approve the exact payload that will run

The approval screen shows the recipient, subject, content and impact. When someone approves, the server checks identity, permissions and revision; if the content changes afterwards, the old approval is void. A sentence like "the user agreed" in model output is not proof of approval — store the decision in your application data, tied to a specific payload.

### An outbox connects the database to the worker

In the same transaction that stores the approved action, write an outbox record. A worker reads the outbox and calls the sending service; if the worker dies, the record is still there. An outbox can deliver more than once, so you still need idempotency or reconciliation at the destination, plus rules for expiry, cancelling actions and handling workers that hold a lease too long.

## Test by breaking things on purpose

The cases most worth running are not the happy path:

- The provider returns 503 repeatedly → the request stops at the deadline without exceeding the attempt count.
- A crash right after the email API succeeds → the re-run doesn't send a second time.
- Two workers pick up the same job → only one executes it.
- The user edits the content after approval → the old action is rejected. Most of this post is familiar backend discipline that I apply in [my full-stack projects](/#experience) — there's just an LLM in the middle now.

If your system knows whether to continue, refuse or ask for reconciliation in each case, you have a far more trustworthy foundation than an agent that only runs smoothly in a demo. The next step is [tracing every step](/ai-for-devs/van-hanh-llm-tracing-version-rollout) so that when an incident happens, you know where it stopped.
