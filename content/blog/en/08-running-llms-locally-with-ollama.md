---
title: "Running LLMs Locally with Ollama: When It Makes Sense and When It Doesn't"
seoTitle: "Run LLMs Locally with Ollama: Guide and Trade-offs"
slug: running-llms-locally-with-ollama
description: "Run an LLM locally with Ollama and call it from Node/Next.js, plus when local is worth it and when cloud APIs still win."
keywords: "Ollama, local LLM, run models offline, self-hosted LLM, local AI, AI for developers"
tags: "AI, Ollama, Local LLM, Developer"
date: 2026-02-20
updated: 2026-11-13
cover: /images/blog/08-chay-llm-local-voi-ollama-v2.webp
---

# Running LLMs Locally with Ollama: When It Makes Sense and When It Doesn't

Two things make developers want to run an LLM on their own machine: no per-token bill, and data that never leaves the machine. Both are legitimate. But before you excitedly rip out OpenAI, you need to look honestly at the cost. This post gets a local model running in a few minutes with [Ollama](https://ollama.com/), then talks frankly about when to use it and when not to.

## Up and running in minutes

Ollama packages downloading and running local models so neatly that there's almost nothing to configure.

```bash
# install (macOS/Linux), then pull a small model
ollama pull llama3.2

# try it right in the terminal
ollama run llama3.2 "Briefly explain closures in JavaScript"
```

Ollama exposes an HTTP server at `localhost:11434`, so calling it from code is just like calling any other API.

## Calling it from Node/Next.js

The handiest part: Ollama exposes an [OpenAI-compatible endpoint](https://docs.ollama.com/api/openai-compatibility), so you reuse the SDK you already know and only change `baseURL`.

```ts
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama', // ignored, just keeps the library happy
});

const res = await client.chat.completions.create({
  model: 'llama3.2',
  messages: [{ role: 'user', content: 'Write a debounce function in TypeScript' }],
});
console.log(res.choices[0].message.content);
```

That means code written for the cloud can point at a local model during development with almost no changes. Many people work exactly this way: develop and test against a local model to save money, then point production at a stronger cloud model.

## What else it does well

- **Local embeddings** for [RAG](/ai-for-devs/rag-tu-a-z-cho-dev-js): `ollama pull nomic-embed-text` and call the embeddings endpoint. The whole RAG pipeline runs offline and no data leaves the machine.
- **Structured output**: Ollama supports enforcing a JSON format, so schema-based field extraction still works.
- **Streaming**: built in, used just like a cloud API.

## When local is genuinely worth it

- **Sensitive data that may not leave the machine** (medical, legal, internal). This is the strongest reason, and sometimes it's mandatory.
- **High volume, simple tasks.** Bulk offline labeling, classification and summarization can be much cheaper locally than paying for cloud tokens.
- **Development and testing.** Experiment freely with no bill and no network.
- **You need to work offline**, or network latency is a problem.

## When not to fool yourself

This needs saying plainly, because it's where many people get disillusioned:

- **Quality doesn't match top cloud models.** A model that fits on a laptop is considerably smaller and weaker than the big models in the cloud. For deep reasoning or complex code, the gap is real.
- **"Free" is only half true.** You don't pay for tokens, but you pay in hardware (RAM/GPU), electricity and operational effort. Serving many concurrent users needs GPUs that aren't cheap; at that point the cloud is often more economical again.
- **Operating it at scale isn't simple.** Running it for yourself is easy; serving production traffic with many concurrent requests — handling scaling, updates and monitoring yourself — is a whole area of work.
- **Speed depends on your machine.** On a laptop without a GPU, large models run too slowly for real-time use.

## The short version

Use local for: development and testing, sensitive data, and simple batch tasks. Use the cloud for: top quality and serving many users without owning the infrastructure. A pragmatic architecture is **hybrid**: local for the sensitive or cheap parts, cloud for the hard parts — and thanks to the OpenAI-compatible endpoint, switching is just changing `baseURL`.

Ollama lowers the barrier to almost zero, so give it a try. Just stay clear-headed: local solves *privacy* and *cost at high volume* (other ways to cut cost are in [the LLM cost optimization post](/ai-for-devs/giam-chi-phi-do-tre-llm-production)); it isn't a silver bullet that replaces everything.

If you're weighing local versus cloud for a specific project and want to talk it through, [get in touch with me here](/#contact).
