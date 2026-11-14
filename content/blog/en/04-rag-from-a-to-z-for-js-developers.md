---
title: "RAG from A to Z for JS/TS Developers: Let Your LLM 'Read' Your Docs"
seoTitle: "What Is RAG? A Complete Guide for JavaScript Developers"
slug: rag-from-a-to-z-for-js-developers
description: "RAG for full-stack JS developers: embeddings, chunking, vector search and prompt context, with minimal code and common pitfalls."
keywords: "RAG, retrieval augmented generation, embeddings, vector database, chunking, semantic search, AI for developers"
tags: "AI, RAG, Embedding, Developer"
date: 2025-12-26
updated: 2026-11-13
cover: /images/blog/04-rag-tu-a-z-cho-dev-js-v2.webp
---

# RAG from A to Z for JS/TS Developers: Let Your LLM "Read" Your Docs

**RAG (Retrieval-Augmented Generation) is a technique that lets an LLM answer from your own documents: before asking the model, the system finds the few most relevant passages and adds them to the prompt as context.** The model then answers from your private, up-to-date data without being retrained.

The eternal question when building a company chatbot: "how do I make it answer based on our internal documents?". Many people's first instinct is to stuff every document into the prompt. Try it and two problems show up immediately: the documents are longer than the [context window](https://platform.claude.com/docs/en/build-with-claude/context-windows), and every question resends a mountain of text, which is slow and burns money.

The right answer is RAG. It sounds grand, but the model doesn't need to remember all your documents; it only needs to read the right excerpt you hand it.

## A recap from the first post: embeddings

RAG is built on [embeddings](https://platform.claude.com/docs/en/build-with-claude/embeddings). As covered in [how LLMs work](/ai-for-devs/llm-hoat-dong-the-nao-cho-dev), an embedding turns a piece of text into a vector (a list of numbers), and two passages with **similar meaning** have vectors that are **close together**. That lets us search by *meaning* rather than exact keywords — a user asking "how do I get my money back" still finds the passage titled "refund policy".

## The RAG flow has two phases

**Phase 1 — Indexing (done once, or whenever the documents change):**
1. Split documents into small pieces (chunks).
2. Compute an embedding for each chunk.
3. Store chunk + vector in a vector store.

**Phase 2 — Querying (every time a user asks):**
1. Compute the embedding of the question.
2. Find the few chunks whose vectors are closest.
3. Paste those chunks into the prompt and ask the model.

That's it. Now for the code.

## Indexing: split and embed

```ts
import { embedMany } from 'ai';

// chunk: split into ~500-800 characters, with overlap so ideas aren't cut in half
function chunk(text: string, size = 700, overlap = 100): string[] {
  const out: string[] = [];
  for (let i = 0; i < text.length; i += size - overlap) {
    out.push(text.slice(i, i + size));
  }
  return out;
}

const chunks = chunk(document);
const { embeddings } = await embedMany({
  model: 'openai/text-embedding-3-small',
  values: chunks,
});

// store in a vector store (pgvector, Pinecone, Qdrant...).
// Example with Postgres + pgvector:
for (let i = 0; i < chunks.length; i++) {
  await db.query(
    'INSERT INTO docs (content, embedding) VALUES ($1, $2)',
    [chunks[i], JSON.stringify(embeddings[i])],
  );
}
```

## Querying: find the nearest, then ask

```ts
import { embed, generateText } from 'ai';

async function ask(question: string) {
  const { embedding } = await embed({
    model: 'openai/text-embedding-3-small',
    value: question,
  });

  // fetch the 5 nearest chunks using pgvector's cosine distance
  const { rows } = await db.query(
    `SELECT content FROM docs
     ORDER BY embedding <=> $1
     LIMIT 5`,
    [JSON.stringify(embedding)],
  );
  const context = rows.map((r) => r.content).join('\n---\n');

  const { text } = await generateText({
    model: 'anthropic/claude-haiku-5-5',
    instructions:
      'Answer ONLY from the CONTEXT provided. ' +
      'If the context does not contain the information, say plainly that you do not know.',
    prompt: `Context:\n${context}\n\nQuestion: ${question}`,
  });
  return text;
}
```

Notice the `instructions`: they force the model to stick to the context and give it permission to say "I don't know". This is the single strongest lever against hallucination — far better for it to admit it doesn't know than to invent a company policy that doesn't exist.

## What actually decides quality (and is often done sloppily)

Getting RAG to *run* takes an afternoon. Whether it runs *well* comes down to these points:

- **Chunking.** Too small and you lose context; too large and you add noise and tokens. Splitting by structure (headings, paragraphs) beats blindly splitting by character count. Use overlap so sentences aren't cut between two chunks.
- **How many chunks to retrieve (top-k).** Too few and information is missing; too many and the model's attention is diluted and the call gets expensive. Three to six is usually reasonable — measure it.
- **Source document quality.** Garbage in, garbage out. Scanned PDFs, broken tables and duplicated content all drag quality down.
- **Citations.** Store an id or path with each chunk and have the model return its "sources" so users can verify. It builds trust and makes debugging much easier when an answer is wrong.
- **Evaluation.** Build a set of questions with known correct answers, and rerun it every time you change chunking or top-k to see whether things got better or worse. I have a separate post on [evals](/ai-for-devs/evals-do-chat-luong-llm).

## When to use RAG, and when not to

RAG fits when knowledge changes often (documentation, products, prices) and you need answers grounded in sources. If you only need the model to be good at a general skill (writing, translating), you don't need RAG. And don't confuse RAG with "teaching" the model new knowledge — the model learns nothing; you are just handing it documents to read at question time.

Once you see it as "go find, then paste into the prompt", RAG stops looking like magic. It is a search problem plus some data discipline — very much a developer's kind of problem. When the basic version works, the next step is [production RAG: ingestion, hybrid search and reranking](/ai-for-devs/rag-production-tu-ingestion-den-hybrid-search).

Have a question about RAG for your project? Feel free to [get in touch](/#contact).
