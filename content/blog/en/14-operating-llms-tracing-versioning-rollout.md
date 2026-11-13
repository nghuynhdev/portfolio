---
title: "Operating LLMs in Production: Tracing, Versioning and Safe Rollouts"
seoTitle: "LLMOps: Tracing, Prompt Versioning and Safe Rollouts"
slug: operating-llms-tracing-versioning-rollout
description: "Operate LLMs like an engineer: OpenTelemetry tracing, versioning prompt, model and index together, rollout via evals and canaries."
keywords: "LLM observability, AI tracing, OpenTelemetry, prompt versioning, canary release, shadow traffic, AI rollback, LLMOps, AI for developers"
tags: "AI, Observability, Deployment, Backend"
date: 2026-05-14
updated: 2026-11-11
cover: /images/blog/14-van-hanh-llm-tracing-version-rollout-v2.webp
---

# Operating LLMs in Production: Tracing, Versioning and Safe Rollouts

The API returns 200, no exceptions, latency within limits — the dashboard is all green. Yet the chatbot just answered a customer using an expired document. Or a prompt edit kept the types intact, the build passed, and the bot started refusing far too many valid questions.

For AI applications, "the system runs" and "the results are usable" are two different questions. This post brings together two things that help answer the second one: **observing** every run, and **shipping changes** so there's always a way back. Both revolve around one idea: the prompt, the model and the retrieved data are all parts of one **behavior version**.

## Part 1 — Trace the path of a single question

For a RAG request, a trace might contain spans for: authentication, creating the embedding, finding candidates, reranking, building context, calling the model, checking the output. An agent adds spans for each tool and each loop iteration.

[OpenTelemetry for JavaScript supports creating spans with `startActiveSpan`](https://opentelemetry.io/docs/languages/js/instrumentation/). A small helper wraps every step:

```ts
import { trace, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('ai-app');

export async function traceStep<T>(name: string, run: () => Promise<T>): Promise<T> {
  return tracer.startActiveSpan(name, async (span) => {
    try {
      const result = await run();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      // Record only the error category; never push the raw payload into telemetry
      span.setAttribute('app.failure_kind', 'step_failed');
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      span.end();
    }
  });
}
```

The parent span needs to be created at the start of the request; with queues, you have to propagate context across the producer/consumer boundary. If every worker opens its own detached trace, you'll still struggle to follow the workflow no matter how much you log.

### Measure what maps to user experience

- **Streaming:** separate time to first token from time to completion.
- **Agents:** number of steps, failed tools, steps that needed reconciliation.
- **RAG:** number of sources, index revision, candidates left after permission filtering.
- **Cost:** take tokens from the provider's usage data; clearly flag when usage is missing because of a disconnect, and don't record estimated tokens as confirmed cost.

Metrics should use labels with a bounded set of values (task type, error category). Don't put request IDs, user IDs or raw questions into metric labels — the number of series explodes quickly; those fields belong in traces.

### Don't log full prompts by default

Prompts, tool results and answers can contain customer data. Log only metadata by default. If you need content samples for debugging, decide upfront the sampling rate, how data is masked, who can see it and how long it's kept. Even exception messages can contain URLs or payloads — which is why the helper above records only an error category.

## Part 2 — Package changes into versions

A trace is only useful if it tells you **which version** was running. Don't store just a `MODEL_NAME` variable; have a manifest:

```json
{
  "release": "support-v8",
  "promptVersion": "support-prompt-v14",
  "modelConfigVersion": "model-config-v3",
  "toolSchemaVersion": "support-tools-v2",
  "retrievalConfigVersion": "search-v5",
  "documentIndexRevision": "docs-2026-11-11-a",
  "outputSchemaVersion": "answer-v2"
}
```

Attach `release` to every trace. When quality drops after a deployment, you compare `prompt-v13` with `prompt-v14` instead of guessing which string just changed. If your provider only offers a model alias that can update itself, record that reproducibility limit and use a pinned snapshot when one is available.

Attribute names like `app.prompt_version` are your application's own convention. If you want to follow a shared standard, look at the OpenTelemetry GenAI semantic conventions for the version you use.

## Part 3 — Roll out with a way back

### Offline before real traffic

Run your [eval suite](/ai-for-devs/evals-do-chat-luong-llm) on a representative set and on the error groups you've hit before, check the output and tool contracts, and compare quality, latency and cost per task type rather than as one average. Example blocking criteria: don't break mandatory permission cases; the valid-output rate doesn't drop beyond a threshold; cost per task stays within budget.

### Shadow traffic: run in parallel, side effects off

Shadow mode runs the new version on a sample of inputs while users keep receiving results from the old one — good for comparing format, retrieval and answers. The shadow branch must never send emails, modify orders or take payments: use read-only tools, or record "proposed actions" in a simulated environment.

### Canaries with stable groups

Google SRE describes a canary as a limited deployment followed by a decision on whether to expand. For a chatbot, keep the same group for the whole conversation so behavior doesn't change every turn:

```ts
import { createHash } from 'node:crypto';

function inCanary(tenantId: string, conversationId: string, percent: number) {
  if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
    throw new Error('Invalid rollout percentage');
  }
  const key = JSON.stringify(['support-v8', tenantId, conversationId]);
  const digest = createHash('sha256').update(key).digest();
  return digest.readUInt32BE(0) / 2 ** 32 < percent / 100;
}
```

Hashing gives a stable assignment, but doesn't guarantee small samples hit the exact percentage. Store the release assigned at the start of a conversation so it doesn't change midway when you increase the percentage.

Compare the canary against a control group **over the same time window**: schema errors, failed tools, user feedback, latency, task completion rate. A higher refusal rate can be good or bad depending on the questions — read samples against a rubric rather than treating it as an absolute signal. With little traffic, observe for longer; a few successful attempts don't prove the new version is better.

### Roll back everything that travels with the model

Keep the old configuration ready, but consider schemas, indexes and in-flight workflows too: new embeddings may not be compatible with old vectors; a workflow waiting for approval may need to continue with the tool version it was created with. And rolling back a prompt doesn't recall an email that was already sent — that's the job of [idempotency and reconciliation](/ai-for-devs/do-tin-cay-llm-timeout-retry-idempotency).

## Connect traces to quality

Tie the user's feedback button to the request ID. When an answer is reported as wrong, open the trace to see which documents were retrieved, which step was slow and which release was running; then add an anonymized case to your eval set.

Traces explain **each individual run**. Evals tell you whether a change fixes **a whole class of problems**. Canary rollouts limit the **damage** when both miss something. With all three, you can change prompts or upgrade models without guessing.

Want to know more about [my product experience](/#experience)? Visit my homepage.
