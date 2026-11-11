---
title: "Cutting LLM Cost and Latency in Production"
seoTitle: "How to Reduce LLM Cost and Latency in Production"
slug: reduce-llm-cost-and-latency-in-production
description: "Cut LLM cost and latency in production: pick models per task, use prompt caching, trim tokens, stream responses and measure."
keywords: "LLM cost, token optimization, prompt caching, model routing, LLM latency, AI for developers"
tags: "AI, LLM, Performance, Cost, Developer"
date: 2025-03-11
updated: 2026-11-11
---

# Cutting LLM Cost and Latency in Production

In a demo, any model will do and a few seconds of delay is fine. Once you're in production with a few thousand users, two numbers hit you in the face: the monthly bill and latency. I once saw a harmless "summarize" feature cost more than the rest of the infrastructure combined, simply because it called a large model for a job a small model could easily handle.

This post collects the moves that actually reduce cost and latency, ordered by what's worth doing first.

## 1. Pick the right model for the job

The biggest lever — do it first. You don't always need the strongest model. Sentiment classification, field extraction, routing questions — a small model, tens of times cheaper, handles these well. Save the big model for parts that really need reasoning.

A common architecture is **routing**: a small model classifies a question as easy or hard; easy ones it answers itself, hard ones go to the big model.

```ts
const level = await classify(question); // small, cheap model
const model = level === 'hard' ? 'anthropic/claude-sonnet-5-5' : 'anthropic/claude-haiku-5-5';
const { text } = await generateText({ model, prompt: question });
```

If most queries land on the cheap branch, the bill already looks very different.

## 2. Caching — free, and often forgotten

Lots of questions repeat. If two people ask exactly the same thing, you don't need to call the model twice.

- **Cache results by content.** Hash (prompt + parameters) as the key and store it in Redis. On a cache hit, return immediately — zero cost, zero latency.

```ts
const key = 'llm:' + sha256(model + '|' + prompt);
const hit = await redis.get(key);
if (hit) return hit;

const { text } = await generateText({ model, prompt });
await redis.set(key, text, { EX: 3600 }); // keep for 1 hour
return text;
```

- **Provider prompt caching.** If many requests share a long prompt prefix (system prompt, background documents), providers let you cache that prefix and charge much less for it next time. Tip: put the fixed part at the *start* of the prompt and the changing part at the end, so the shared prefix is as long as possible.

## 3. Trim unnecessary tokens

You pay for both input and output tokens.

- **Input:** don't stuff in the whole conversation history or entire documents when you don't need to. Summarize older history, and use [RAG](/ai-for-devs/rag-tu-a-z-cho-dev-js) to include only the relevant passages instead of whole files.
- **Output:** cap `maxTokens` and state the desired length in the prompt. "Answer in 3 sentences" is both cheaper and faster than an essay.
- Remember from [the first post in the series](/ai-for-devs/llm-hoat-dong-the-nao-cho-dev): some languages cost more tokens than English. A long system prompt in such a language is multiplied across every request.

## 4. Stream to feel fast without being faster

Streaming doesn't reduce total time, but it cuts **time to first text** to a few hundred milliseconds. Users perceive it as fast, and that's what they care about. Almost every chat interface should stream — how to do it in Next.js is in [the streaming post](/ai-for-devs/tich-hop-ai-vao-nextjs-streaming).

## 5. Parallelize and batch

If a request needs several independent calls (say, summarizing 5 passages), don't call them one after another. Run them in parallel:

```ts
const summaries = await Promise.all(
  chunks.map((c) => generateText({ model: 'anthropic/claude-haiku-5-5', prompt: `Summarize: ${c}` })),
);
```

Total time becomes the slowest call instead of the sum. For batch work that doesn't need to be real-time (bulk labeling), consider the provider's batch API if it has one — it's usually noticeably cheaper.

## 6. Measure before you optimize

Don't guess. Log for every request: model used, input/output tokens, estimated cost, duration. For something more rigorous than hand-rolled logs, see [tracing and rollout for LLMs](/ai-for-devs/van-hanh-llm-tracing-version-rollout). Only with numbers will you know which three endpoints eat 80% of the bill, so you can focus there instead of optimizing places that don't matter.

```ts
log.info({
  model, inputTokens: usage.inputTokens, outputTokens: usage.outputTokens,
  ms: Date.now() - start,
});
```

This is the part I care about most as a [full-stack developer](/#overview): however good an AI feature is, it has to survive its bill and its latency.

The order I recommend: measure first, then re-pick models for each job, then cache, then trim tokens. The first three moves usually cut most of the bill. The rest is discipline: treat every LLM call like an expensive query, because that's exactly what it is.
