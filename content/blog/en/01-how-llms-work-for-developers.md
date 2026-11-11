---
title: "How Do LLMs Actually Work? A Developer's Explanation, Minus the Mystique"
seoTitle: "How Do LLMs Work? A Developer's Explanation"
slug: how-llms-work-for-developers
description: "A developer's mental model of LLMs: tokens, next-token probability, context windows and why models make things up. No math required."
keywords: "what is an LLM, large language model, tokens, context window, hallucination, AI for developers"
tags: "AI, LLM, Developer, Fundamentals"
date: 2024-02-15
updated: 2026-11-11
---

# How Do LLMs Actually Work? A Developer's Explanation, Minus the Mystique

When I first started using ChatGPT to write code, I made a pretty naive mistake: I assumed it *understood* my question, as if there were a little brain in there thinking things through before answering. It wasn't until it confidently invented an `Array.prototype.flatMapAsync` function that doesn't exist that I sat down and figured out what is really going on underneath.

This post is for developers — people who don't need derivatives or matrices, but do need a *mental model* that is accurate enough to avoid being fooled by an LLM, and to understand why their AI integration works great one minute and falls apart the next.

## All it really does is guess the next token

Strip away the fancy vocabulary. At its core, a Large Language Model does exactly one thing: **given a sequence of text, predict the most likely next piece**. Repeat that many times, stitch the pieces together, and you get an answer.

That "next piece" isn't a word — it's a **token**, the unit text is chopped into. In English, a token is usually a short word or part of a word. Other languages are often split less efficiently because most training data is English. In Vietnamese, my native language, a single accented word like "nghiêng" can become two or three tokens.

You can check this yourself:

```js
// npm i gpt-tokenizer
import { encode } from 'gpt-tokenizer';

console.log(encode('hello world').length);        // 2 tokens
console.log(encode('xin chào thế giới').length);  // ~7-8 tokens ("hello world" in Vietnamese)
```

Same meaning, three to four times the tokens. And **you pay per token**. This has very practical consequences: the same chatbot costs more to run for users in some languages than others, and if you stuff long, wordy prompts into it, your API bill at the end of the month will remind you.

## "Guessing" means probabilities — and you can tune them

At each step, the model doesn't pick a single token outright. It computes a probability for *every* token in its vocabulary — token A 60%, token B 25%, token C 8%… — and then samples one from that distribution.

The `temperature` parameter controls how adventurous that sampling is:

- `temperature: 0` → almost always picks the most likely token. Stable, repeatable, a bit dry. Use it for data extraction, classification, generating JSON.
- `temperature: 0.7–1` → lets less likely tokens through. More varied and creative, but also easier to drift. Use it for writing content and brainstorming.

I see a lot of people leave it at the default and then complain that "it answers differently every time". If you need output stable enough to parse in code, set `temperature: 0`. Don't rely on the default.

```ts
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'anthropic/claude-haiku-5-5',
  temperature: 0,          // we need stable output to parse
  prompt,
});
```

One important consequence: because sampling is involved, **the same prompt can produce two different results**. Don't write tests like `expect(output).toBe('...')` against LLM output. It is not a pure function.

## The context window: short-term memory that isn't free

The model has no memory. It doesn't "remember" what you said in the previous message. The illusion of memory comes from the fact that **on every call, you send the whole conversation history** for it to read from the top.

Everything you send plus everything it generates has to fit inside the **context window** — the model's token limit (for example, 128k tokens). Two takeaways:

1. The longer the conversation, the more tokens each call costs (because you resend everything). Cost grows with length; it isn't constant.
2. Once you exceed the window, you have to trim the history — and the model "forgets" whatever was cut. That "I already told you this" feeling happens because you dropped that part from the context, not because the model got confused.

This is also why "just dump the whole codebase into the prompt" sounds great but in practice is both expensive and dilutes the model's attention. The proper way to let a model "read your docs" is RAG, which I cover in [RAG from A to Z for JS/TS developers](/ai-for-devs/rag-tu-a-z-cho-dev-js).

## Why it makes things up (hallucination)

Back to the phantom `flatMapAsync` from the beginning. Once you understand the mechanism, hallucination stops being mysterious: the model's goal is to produce a sequence of tokens that **sounds linguistically plausible**, not one that is **factually true**. It doesn't look anything up. Its training data is full of `flatMap` and full of `...Async` functions, so `flatMapAsync` is a very "plausible" token sequence — it just happens to be wrong.

The model has no sense of "I don't know". When information is missing, it doesn't stop; it fills the gap with whatever sounds most natural. The rarer the subject in its training data (internal APIs, specific figures, less famous people), the more confidently it invents things.

In day-to-day coding, this is how I deal with it:
- Never trust numbers, dates or API names from a model without checking them. Treat it like a very fluent junior who often misremembers.
- Anything that must be exactly right (billing, database queries) is done by code; the LLM only handles the language part.
- To reduce hallucination, **put real data into the prompt** (grounding) instead of asking it to recall things.

## Embeddings: when text becomes coordinates

One more piece to complete the picture. Besides generating text, models can turn a piece of text into a **vector** — a list of numbers like `[0.01, -0.23, 0.88, ...]`, a few hundred to a few thousand dimensions long. That is an embedding.

The neat part: two pieces of text that **mean similar things** have vectors that are **close together in that space**. "dog" and "puppy" are close; "dog" and "tax invoice" are far apart. That lets us search by meaning instead of just matching keywords. RAG, semantic search and "related posts" suggestions are all built on this idea. For now, just remember: **embedding = text → coordinates, similar meaning means nearby**.

## What developers should remember

Here it is in a few sentences you can use right away:

- An LLM predicts the next token by probability. It doesn't understand, and it doesn't look things up.
- Tokens are not equal across languages — that directly affects cost and speed.
- Low `temperature` for tasks that need stability, higher for tasks that need creativity. Don't leave the default and then complain.
- "Memory" is just you resending the history; the longer it gets, the more it costs, and past the window it forgets.
- It makes things up because it optimizes for "sounds plausible", not "is correct". If something has to be right, don't hand it over completely. I'm [Nguyen Huynh](/), a full-stack developer working with React, Next.js and NestJS, and this series is what I've learned from putting AI into real products.

You don't need a single line of math, but this mental model alone will save you from most of the "why is it so dumb?" moments when building with AI. The following posts in the series go into each part in more detail — starting with [how to write prompts that produce usable results](/ai-for-devs/prompt-engineering-thuc-chien-cho-dev).
