---
title: "Production RAG: From Ingesting Documents to Hybrid Search and Reranking"
seoTitle: "Production RAG: Ingestion, Hybrid Search and Reranking"
slug: production-rag-ingestion-hybrid-search
description: "Production RAG: structure-aware PDF parsing, metadata, safe index updates, hybrid search with RRF, reranking and recall@k."
keywords: "production RAG, RAG ingestion, hybrid search, reranking, RRF, PDF OCR, chunking, vector index, AI for developers"
tags: "AI, RAG, Search, Data Pipeline"
date: 2026-04-03
updated: 2026-11-13
cover: /images/blog/11-rag-production-ingestion-hybrid-search-v2.webp
---

# Production RAG: From Ingesting Documents to Hybrid Search and Reranking

The first version of RAG usually works nicely on a handful of clean Markdown files. Then it meets real data: a pricing PDF where the parser joins the plan name in the left column with another plan's price in the right column; a customer asks about the exact error code `PAYMENT_042` but vector search returns a generic "handling failed payments" passage. No amount of clever prompting rescues a wrong passage, or a right one that never made it into the context.

In [RAG from A to Z](/ai-for-devs/rag-tu-a-z-cho-dev-js) we built the skeleton: chunk, embed, find the nearest, paste into the prompt. This post covers the two halves that decide quality in production: **getting documents into the index correctly**, and **retrieving exactly the passage you need**.

## Part 1 — Ingestion: the model can only read what you put in

When RAG answers badly, don't look only at the prompt. Open the actual text sitting in the index — a lot of bugs live right there.

### Classify documents before processing them

Markdown and HTML usually have clear headings, paragraphs and lists. Text-based PDFs let you extract the words, but not necessarily in the right reading order. Scanned PDFs need OCR; documents with multiple columns and tables need their structure checked separately.

Unstructured describes several PDF partitioning strategies, such as fast text extraction, OCR and layout analysis. The lesson: choose the processing by document type instead of treating every file as one string to cut the same way.

For documents in languages with diacritics (Vietnamese in my case), sample pages with accents, number tables, multi-level headings and skewed scans, and eyeball the extraction before running the whole corpus. Look specifically at commonly confused characters like `0/O` and `1/l`, units and number separators.

### Keep a way back to the source

A chunk with only `text` is very hard to fix when a user reports a wrong answer. At minimum you need to know which document, which version and which position it came from, and who may read it:

```ts
type Chunk = {
  id: string;
  documentId: string;
  tenantId: string;
  revision: string;
  parserVersion: string;
  embeddingVersion: string;
  sourceUrl: string;
  page: number | null;
  section: string[];
  text: string;
};
```

`revision` can come from your document management system or a content hash. Parser and embedding versions need to be stored separately: the same PDF run through a new parser produces different text, and a new embedding model produces a different vector space — mixing them makes search results hard to explain.

`sourceUrl` should point to an access-controlled source. When displaying a citation, re-check permissions at the moment the user opens it, rather than relying on permissions at indexing time.

### Split by structure first, then cap the size

Prefer heading, paragraph and section boundaries; only split a section further when it exceeds your token budget. For tables, keep the column names with the data — a lone "299,000" is nearly meaningless.

You can prepend the heading path to each chunk, for example "Payments > Refunds > Processing time". Overlap needs measuring too: more overlap means more storage, more embedding cost, and a higher chance of retrieving near-duplicate passages.

### Update the index without users seeing half a version

The flow I prefer:

1. Read the new revision, parse it and check its quality.
2. Create all chunks and vectors for that revision in a staging area.
3. Mark the revision complete in a transactional metadata store.
4. Switch the "revision being served" pointer with an atomic update.
5. Retire the old revision after a buffer period.

This is an application-level design, not a feature every vector database gives you. At query time, read the active revision and use it for the whole request. If embedding fails halfway, users still see the complete old version.

Deleting a document is also an update: stop serving it via metadata first, then clean up the related chunks, vectors, caches and extracted copies. Deleting only the original file leaves its copies in the index, still showing up in answers. Re-run jobs need a unique key (tenant + document + revision + pipeline version) so chunks aren't duplicated — use a unique constraint in the database, because "check, then insert" can still race with another worker.

## Part 2 — Retrieval: find the right passage, not just a similar one

### Two ways to search, two kinds of strength

Keyword search is good for product codes, function names, document numbers and distinctive phrases. Vector search shines when the question is phrased differently from the document: "get my money back" still matches "refund policy". In practice you need both.

**Hybrid search** takes candidates from both branches and merges them. Don't simply add keyword scores to cosine similarity — they aren't on the same scale. An easy, controllable starting point is **Reciprocal Rank Fusion (RRF)**: combine contributions by rank instead of raw scores ([Elasticsearch's RRF documentation](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion)).

```ts
type Hit = { id: string; text: string };

function fuseRankings(lists: Hit[][], k = 60): Hit[] {
  const merged = new Map<string, { hit: Hit; score: number }>();

  for (const list of lists) {
    const seen = new Set<string>();
    list.forEach((hit, index) => {
      if (seen.has(hit.id)) return;
      seen.add(hit.id);
      const item = merged.get(hit.id) ?? { hit, score: 0 };
      item.score += 1 / (k + index + 1);
      merged.set(hit.id, item);
    });
  }

  return [...merged.values()]
    .sort((a, b) => b.score - a.score || a.hit.id.localeCompare(b.hit.id))
    .map(({ hit }) => hit);
}

const lexical = [{ id: 'a', text: 'Error code PAYMENT_042' }];
const semantic = [
  { id: 'b', text: 'Handling failed payments' },
  { id: 'a', text: 'Error code PAYMENT_042' },
];

console.log(fuseRankings([lexical, semantic])); // 'a' comes first
```

`k = 60` is a common starting point; the number of candidates per branch and a set of real queries decide the right configuration for your product.

### The reranker sits after retrieval

Once you have a candidate set, a reranker reads the question together with each passage and reorders them. A cross-encoder considers both at once, so it's more accurate but more expensive than a vector lookup — which is why it runs only on the narrowed set ([Sentence Transformers](https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html) describes this retrieve-then-rerank pipeline).

A configuration to start experimenting with: take 30 candidates per branch, merge them, rerank at most 40 passages, and keep the few that fit your context budget. Remember the reranker can't recover a passage that was dropped earlier — if the right document isn't in the candidate set, fix the search, not the reranker.

### Filter permissions inside each branch

With multi-customer data, both keyword and vector search must filter by tenant and by the asking user's permissions; send only readable candidates to the reranker. Don't fetch everyone's documents and hope the model "ignores what the user isn't allowed to see" — that's a [security hole](/ai-for-devs/bao-mat-ai-prompt-injection), not a feature.

When several chunks come from the same document, check for duplication: five nearly identical passages can fill the entire context when the answer needs two different sources.

## Measure each layer before adding another

Build a set of questions labeled with their correct passages, then measure each layer separately:

- **Ingestion:** pages that failed, empty chunks, tables that lost their headers, chunks you can't trace back to a source.
- **Retrieval:** `recall@k` (is the needed passage within the top k results?), the rank of the first correct result, latency. Split the set into error codes, natural-language questions, and text with and without diacritics.
- **Final answers:** run your [eval suite](/ai-for-devs/evals-do-chat-luong-llm).

Read results in that order. The right document never appears → fix ingestion or search. Retrieval improves but answers don't → look at how context is assembled and how citations are instructed. Only when both lower layers are solid should you think about changing the generation model.

A small but clean index, plus hybrid search and a reranker that are properly measured, is usually worth more than a huge vector store full of broken content. To monitor these layers once you're live, continue with [operating LLMs: tracing and rollout](/ai-for-devs/van-hanh-llm-tracing-version-rollout).

If you're building RAG over internal data and want a second opinion, [get in touch](/#contact).
