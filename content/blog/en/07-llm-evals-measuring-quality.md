---
title: "Evals: How to Know Your Prompt and Model Are Good Enough"
seoTitle: "LLM Evals: How to Measure Prompt and Model Quality"
slug: llm-evals-measuring-quality
description: "'Looks fine' isn't enough. Build LLM evals for an AI feature: a test set, assertions, LLM-as-judge grading and evals in CI."
keywords: "LLM evals, AI evaluation, LLM as judge, prompt testing, AI regression, AI for developers"
tags: "AI, Evals, Testing, Developer"
date: 2025-06-17
cover: /images/blog/07-evals-do-chat-luong-llm-v2.webp
---

# Evals: How to Know Your Prompt and Model Are Good Enough

There is one kind of "testing" almost everyone uses when they start with AI: type a few questions, see that the model answers sensibly, nod "looks good", ship it. The problem is that "a few questions that looked fine" tells you nothing about the thousands of real questions users will ask. Worse: the next day you change one word in the prompt, 20% of the cases that used to pass now fail, and nobody notices until customers complain.

The answer is **evals** — automated evaluation for AI features. Put simply: unit tests, but for something whose output isn't fixed.

## Why you can't test it like normal code

Normal code: same input, same output, `expect(x).toBe(y)`. LLMs involve probability; the same prompt can produce different wording that is still correct. So an eval doesn't ask "is every word right?" but "does it meet the criteria?" across **a large and varied enough set**. The goal isn't 100% perfection, it's a number you can track: did this change make things better or worse?

## Step 1: build a test set

This is the most laborious part and the most valuable. Collect 30–100 cases including:
- Common cases (the happy path).
- Edge cases, hard cases, ambiguous cases.
- **Cases that failed before** — every time you see the model answer badly in the real world, add it to the set. The eval set grows with your bugs, just like regression tests.

Each case has an input and either a "correct answer" or pass criteria.

```ts
const cases = [
  { input: 'When will order #123 arrive?', expect: { mustContain: ['#123'], mustNotHallucinateDate: true } },
  { input: 'How do I cancel an order?', expect: { topic: 'cancellation' } },
  // ... add cases from real failures
];
```

## Step 2: choose how to grade

Different outputs call for different methods — usually combined:

- **Exact match / enum.** For classification or field extraction, the output has a clear answer. Grade with `===` and you're done — cheap and reliable.
- **Assertions / rules.** Check conditions: does it contain the order ID, is it valid JSON, is the length within range, did it avoid banned words? Plain code, fast and free.

```ts
function grade(output, e) {
  if (e.mustContain?.some((s) => !output.includes(s))) return 0;
  if (e.topic && classifyTopic(output) !== e.topic) return 0;
  return 1;
}
```

- **[LLM-as-judge](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests).** For free-form output (answers, summaries), have another model grade against a rubric: "does the answer stick to the context, does it address the question, score 1–5". Powerful, but be careful: give the judge very clear criteria, and periodically compare its scores against human judgment to make sure it isn't grading on a whim.

```ts
const judgePrompt = `Grade the answer on a scale of 1-5.
Criteria: (1) uses only information from the CONTEXT, (2) answers the question asked, (3) invents nothing.
Return only the number.
Context: ${context}
Question: ${q}
Answer: ${answer}`;
```

## Step 3: run it and read the results

Run the whole set and print the pass rate and — importantly — **the list of failed cases**. The overall number (say 86%) is for tracking trends; the failures tell you what to fix. When you change the prompt or the model, rerun and compare: where did it improve, where did it break? You'll often find that a change that was "obviously better" drags down a few other cases — exactly what evals exist to catch.

## Step 4: put it in CI

Once the eval set is trustworthy, run it in CI every time you edit a prompt, switch models or upgrade the SDK. Set a threshold: if the pass rate drops below what's acceptable, block the merge. From then on you can upgrade models or tweak prompts without holding your breath, because you have a safety net. The step after CI is [rollout with canaries and tracing](/ai-for-devs/van-hanh-llm-tracing-version-rollout) to check behavior on real traffic.

## A few honest notes

- **Start small.** 20 cases graded with assertions beat dreaming about a perfect eval system and doing nothing. Grow it gradually.
- **Don't let the judge flatter itself.** LLM-as-judge is convenient but biased; prefer assertions wherever possible and use a judge only for genuinely subjective parts.
- **Evals cost money and time too.** Keep the set lean and representative; you don't need to run a thousand cases on every commit.

With evals in place, questions like "should we switch to the new model?" or "is this prompt change safe?" are no longer answered by gut feeling, but by a number. That's the line between playing with AI and putting AI into a product professionally.

You can read more about [my background and experience](/#overview) to see where the examples in this post come from.
