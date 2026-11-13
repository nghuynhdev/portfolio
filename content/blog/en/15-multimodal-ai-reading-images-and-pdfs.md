---
title: "AI That Reads Images and PDFs: Extracting Data You Can Verify"
seoTitle: "Multimodal AI: Extracting Data from Images and PDFs"
slug: multimodal-ai-reading-images-and-pdfs
description: "Read images and PDFs with multimodal AI: pick the right pages, require evidence, allow missing data, check business rules in code."
keywords: "multimodal AI, vision model, PDF extraction, OCR, document AI, AI for developers"
tags: "AI, Multimodal, Documents, Developer"
date: 2026-06-05
cover: /images/blog/15-multimodal-ai-doc-anh-va-pdf-v2.webp
---

# AI That Reads Images and PDFs: Extracting Data You Can Verify

A scanned form has a slightly blurry order-code box. The model returns JSON that matches the schema, every field filled in, looking great. But the last character of the order code is a guess. If the system writes the result straight into the database, a well-formed extraction can still cause a business error.

Multimodal models help read visual content, but they don't remove the need for verification. For document problems, I design the output so a person or code can go back to the exact evidence.

## OCR, vision, or both?

OCR fits when you need lots of text and want to keep its position. Vision models help when you need to understand layout, link labels to input boxes, or read charts and images. A pipeline can use both: OCR produces text and coordinates, the model handles the harder parts.

Some APIs accept PDFs directly and process both text and images; [Claude's PDF documentation](https://platform.claude.com/docs/en/build-with-claude/pdf-support) describes this capability. Page limits, size limits and how resources are counted depend on the model and platform, so check them when integrating instead of hard-coding a universal number.

For long document sets, don't send every page for every question. You can use an index or a page-classification step to narrow it down, but measure what gets missed: an appendix page sometimes holds exactly the data you need.

## Design fields that are allowed to not know

Instead of forcing every field into a string, distinguish read, missing and unclear. The example below is an application type, not yet the schema sent to the provider:

```ts
type EvidenceField =
  | {
      status: 'read';
      value: string;
      page: number;
      quote: string;
    }
  | {
      status: 'missing' | 'unclear';
      value: null;
      page: number | null;
      quote: string | null;
    };

type ExtractedForm = {
  orderCode: EvidenceField;
  requestedDate: EvidenceField;
  contactName: EvidenceField;
};
```

After receiving output, validate it at runtime with [JSON Schema](https://json-schema.org/) or a suitable library. TypeScript doesn't check JSON that arrives over the network. [Structured output](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) constrains the shape; it doesn't prove the order code or date was read correctly.

In the prompt, require the model not to fill in blurry characters, not to infer missing dates, and to number pages starting from 1. For a date like `03/04`, if the document doesn't state its convention and there isn't enough evidence, keep the original value for a later step to handle.

## Evidence helps verification — but it can be wrong too

A `quote` produced by the model isn't automatically a real quotation. If you have OCR text, check that the excerpt exists after reasonable normalization. If the evidence is in an image, the UI should open the right page and region for the reviewer.

Coordinates guessed by the model can drift; for more reliable highlighting, use coordinates from a layout analyzer or OCR and keep the mapping when images are resized. A nicely highlighted box on screen doesn't mean the evidence has been confirmed.

## Let code do the deterministic checks

The order code must match the system's format, dates must be valid, line counts must be within business limits. If there are number tables, use a decimal library or the appropriate smallest unit to check calculations; don't ask the model to guarantee every sum is right.

A self-reported "confidence 0.98" from the model is not a calibrated probability. Decisions to route to a human reviewer should be based on a labeled sample set, validation failures, image quality and how much the field matters.

## Measure per field and per document type

Prepare samples that are blurry, rotated, handwritten, multi-page, and forms that look alike. Measure order-code accuracy separately from contact-name accuracy; an average can hide an important field that is often wrong.

Store the revisions of the file, pipeline and model for traceability. Input documents are still untrusted data: a sentence like "ignore the rules" inside an image must never become a system instruction. Use reviewed results as data for your [eval suite](/ai-for-devs/evals-do-chat-luong-llm), rather than treating unverified output as the ground truth.

Have a specific document-extraction problem? [Send me a few lines](/#contact).
