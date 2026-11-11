---
title: "Adding AI to a Next.js App: Building a Proper Streaming Chat"
seoTitle: "Next.js AI Chat with Streaming: Vercel AI SDK Guide"
slug: nextjs-ai-chat-streaming
description: "Add a streaming AI chat to the Next.js App Router: a route handler that streams tokens, useChat, cancellation and server-side keys."
keywords: "Next.js AI, streaming chat, Vercel AI SDK, useChat, streamText, App Router, AI for developers"
tags: "AI, Next.js, Streaming, Developer"
date: 2024-07-16
updated: 2026-11-11
---

# Adding AI to a Next.js App: Building a Proper Streaming Chat

The first AI chat box I built had a fatal UX flaw: after you hit send, a spinner spun for 12–15 seconds and then the whole answer appeared in one block. Users thought it had frozen and hit send again. Meanwhile ChatGPT's text flowed out smoothly — and the secret wasn't a faster model, it was **streaming** each token back as soon as the model produced it.

This post goes straight to building a streaming chat in the Next.js App Router that works and avoids the usual traps.

## Why stream at all

Two very practical reasons:

- **It feels fast.** Models generate tokens gradually; streaming shows text from the first token instead of waiting for the last. Time to first text is a few hundred milliseconds, even if the whole answer takes ten seconds.
- **It avoids timeouts.** A long answer can exceed the time limit of a normal request. Streaming keeps the connection open and pushes data continuously, so it is less likely to be cut off.

A common misconception: "you need the Edge runtime to stream". You don't. In Next.js, a route handler on the regular Node.js runtime streams fine (`ReadableStream`, SSE) and keeps the full Node API. Don't add `export const runtime = 'edge'` just to stream.

## Server side: a route handler that pushes tokens

I use the Vercel AI SDK to keep things short, since it handles the stream format between server and client. Models are called through the gateway with a `"provider/model"` string, so switching providers is just changing the string.

```ts
// app/api/chat/route.ts
import { streamText, convertToModelMessages, type UIMessage } from 'ai';

// No need for runtime = 'edge'; Node.js streams fine.
export const maxDuration = 30; // seconds, for long answers

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-haiku-5-5',
    instructions: 'You are a technical assistant. Answer concisely, with code examples when useful.',
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

The API key lives in a server-side environment variable (for example `OPENAI_API_KEY`), which the SDK reads automatically. Never call the provider directly from the client — a leaked key means lost money.

## Client side: `useChat` handles the fiddly parts

On the UI side, the `useChat` hook manages the message list, the running state and stitching streamed tokens together:

```tsx
'use client';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export default function Chat() {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });
  const [input, setInput] = useState('');

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id} data-role={m.role}>
          {m.parts.map((p, i) =>
            p.type === 'text' ? <span key={i}>{p.text}</span> : null,
          )}
        </div>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        {status === 'streaming' ? (
          <button type="button" onClick={stop}>Stop</button>
        ) : (
          <button type="submit">Send</button>
        )}
      </form>
    </div>
  );
}
```

Text appears progressively in `messages`. The **Stop** button calls `stop()` to cancel mid-stream — a small thing, but users really want it when the model starts rambling.

## Traps I've fallen into

- **Not cancelling when the user leaves the page.** The streaming request keeps running in the background and keeps costing tokens. `useChat` handles most of this, but if you write your own fetch, pass an `AbortController` and abort on unmount.
- **No limits at all.** You need rate limiting per user/IP, a cap on input length, and a token budget per request. Otherwise one person spamming a few hundred requests burns your money.
- **Pushing every token into state and re-rendering heavily.** With long answers, constant re-renders can stutter. The hook handles this well, but if you roll your own, batch tokens over a time window (say 50ms) instead of once per token.
- **Errors mid-stream get swallowed.** The model or network can drop halfway. Catch the error and show the user a decent message with a retry button, instead of leaving a truncated answer.

## Turning it into a real product

Once it runs, the next things to add: store conversation history in a database (remember the context window from [the first post in the series](/ai-for-devs/llm-hoat-dong-the-nao-cho-dev) — longer means more expensive), bring your own data into answers with [RAG](/ai-for-devs/rag-tu-a-z-cho-dev-js), and let the model call tools with [tool calling](/ai-for-devs/ai-agent-dau-tien-function-calling). Before going to production, read about [timeouts, retries and fallbacks](/ai-for-devs/do-tin-cay-llm-timeout-retry-idempotency) so one network error doesn't turn into three invoices. But the skeleton is just this: a streaming route handler, a hook on the client, and discipline about cost and cancellation. Next.js is the stack I use every day (see [the skills I work with](/#skills)), which is why this post goes straight to the App Router.

Once you have a chat box with smoothly flowing text, you'll find the "AI" part is the easy part; the hard and valuable parts are UX, limits and error handling — exactly a full-stack developer's job.
