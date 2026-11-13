---
title: "When Should You Fine-Tune an LLM? Start From the Errors, Not the GPUs"
seoTitle: "When to Fine-Tune an LLM: Fine-Tuning vs RAG"
slug: when-to-fine-tune-an-llm
description: "When to fine-tune an LLM vs. prompting or RAG: diagnose the error type, prepare clean training data, and judge quality and cost."
keywords: "LLM fine tuning, LoRA, PEFT, training data, RAG vs fine tuning, AI for developers"
tags: "AI, Fine Tuning, Data, Developer"
date: 2026-06-17
cover: /images/blog/16-khi-nao-nen-fine-tune-llm-v2.webp
---

# When Should You Fine-Tune an LLM? Start From the Errors, Not the GPUs

"Have the model learn all of our company documents" sounds reasonable until the policy changes next week. If the goal is to answer from fresh data and cite the source, [RAG](/ai-for-devs/rag-tu-a-z-cho-dev-js) is usually an easier-to-update starting point.

Fine-tuning adjusts parameters using training data. It can help a model adapt to a specific task and way of answering, but it doesn't turn into a document store with versions, access control and citations.

## Pin down how the model is wrong

I classify failure cases before choosing a solution:

| Symptom | Try fixing here first |
|---|---|
| Missing the latest policy | Data sources and retrieval |
| Doesn't understand the output requirements | Prompt, examples and schema |
| Repeatedly misclassifies specific edge cases | Labels, examples, then try fine-tuning |
| Often misses a clearly defined voice | Few-shot, a voice rubric, then try fine-tuning |
| Calls the wrong tool or acts without permission | Tool descriptions, routing and the execution layer |

This is the investigation order I recommend, not a hard boundary. RAG and fine-tuning can also work together: one provides fresh evidence, the other makes task handling fit better.

## LoRA shrinks what you have to train

Instead of updating every weight, LoRA keeps the original weights frozen and learns smaller update matrices. [Hugging Face's PEFT documentation explains how this works](https://huggingface.co/docs/peft/main/en/conceptual_guides/lora). It can reduce the resources needed for fine-tuning, but it doesn't make every model fit on a laptop.

You still need memory for the base model, activations, sequence length and training configuration. In deployment, the adapter must be compatible with the base model and the way you serve it. Check the model's usage terms before turning an experiment into a product feature.

## Data must reflect the real task

For ticket classification, each sample needs the input, the correct label and consistent labeling criteria. For an answering assistant, you also need cases with missing information and the right way to decline to guess.

Don't just collect easy examples the model already gets right. Look at the error groups that matter, resolve contradictory labels and drop unnecessary information. Model-generated data can propose samples, but it needs checking; copy the model's mistakes into your answers and you're teaching it those mistakes again.

## Split before creating variants

If one original ticket has ten paraphrases, all ten belong in the same split. Putting eight in train and two near-identical ones in test makes results look better than real-world generalization.

An example of stable group-based splitting in TypeScript:

```ts
import { createHash } from 'node:crypto';

function datasetSplit(groupId: string): 'train' | 'validation' | 'test' {
  const digest = createHash('sha256')
    .update(`dataset-v1:${groupId}`)
    .digest();
  const bucket = digest.readUInt32BE(0) % 100;
  return bucket < 80 ? 'train' : bucket < 90 ? 'validation' : 'test';
}
```

The 80/10/10 ratio is just an illustration. With few groups or very uneven sizes, hashing doesn't guarantee balanced labels or sample counts; check the statistics after splitting. If the goal is handling future data, consider a time-based test set and remove near-duplicates across the boundary.

## Compare against a serious baseline

Keep a baseline of the original model with a clear prompt and good examples. Use validation to choose configurations; open the test set only for the final evaluation, so you don't keep tuning against the same test.

Measure each group: rare labels, long inputs, text without diacritics, cases with missing evidence. For classification, look at precision/recall per label rather than overall accuracy. For free-form answers, use a rubric and have humans grade a sample.

Also record training cost, serving cost and latency. If the adapter beats the baseline only on easy cases but breaks an important group, there's no reason to deploy it. A useful fine-tuning experiment has to answer: which kind of error does it fix, at what trade-off, and does the result hold on data that wasn't used to choose the configuration?

I'm [Huynh](/), a full-stack developer in Ho Chi Minh City — the AI for Devs series is where I write down decisions like this.
