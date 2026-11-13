---
title: "Tích hợp AI vào app Next.js: làm luồng chat streaming cho tử tế"
seoTitle: "Tích hợp AI vào Next.js: chat streaming với Vercel AI SDK"
slug: tich-hop-ai-vao-nextjs-streaming
description: "Gắn chat AI streaming vào Next.js App Router: route handler stream token, useChat ở client, hủy request, giữ API key ở server."
keywords: "Next.js AI, streaming chat, Vercel AI SDK, useChat, streamText, App Router, AI cho developer"
tags: "AI, Next.js, Streaming, Developer"
date: 2024-07-16
updated: 2026-11-11
cover: /images/blog/03-tich-hop-ai-vao-nextjs-streaming-v2.webp
---

# Tích hợp AI vào app Next.js: làm luồng chat streaming cho tử tế

Cái chatbox AI đầu tiên mình làm có một lỗi UX chết người: bấm gửi xong là một con spinner quay tròn 12–15 giây, rồi cả đoạn trả lời hiện ra một cục. Người dùng tưởng treo, bấm gửi lại lần nữa. Trong khi đó ChatGPT chữ chạy ra mượt mà, và bí mật không nằm ở model nhanh hơn, mà ở chỗ nó **stream** từng token về ngay khi model sinh ra.

Bài này đi thẳng vào cách làm luồng chat streaming trong Next.js App Router sao cho chạy được và không dính mấy cái bẫy thường gặp.

## Vì sao phải stream

Hai lý do rất thực tế:

- **Cảm giác nhanh.** Model sinh token dần dần; stream cho phép hiện chữ ngay từ token đầu thay vì đợi câu cuối. Thời gian tới chữ đầu tiên chỉ vài trăm ms, dù cả câu mất chục giây.
- **Tránh timeout.** Một câu trả lời dài có thể vượt giới hạn thời gian của một request thường. Stream giữ kết nối mở và đẩy dữ liệu liên tục nên ít bị cắt ngang.

Một hiểu lầm hay gặp: "muốn stream phải chạy Edge runtime". Không cần. Trên Next.js, route handler chạy Node.js bình thường vẫn stream được (`ReadableStream`, SSE), lại giữ đầy đủ Node API. Đừng thêm `export const runtime = 'edge'` chỉ để stream.

## Phần server: một route handler đẩy token

Mình dùng Vercel AI SDK cho gọn, vì nó lo sẵn phần định dạng stream giữa server và client. Model gọi qua gateway bằng chuỗi `"provider/model"` nên đổi nhà cung cấp chỉ là đổi chuỗi.

```ts
// app/api/chat/route.ts
import { streamText, convertToModelMessages, type UIMessage } from 'ai';

// KHÔNG cần runtime = 'edge'; Node.js stream tốt.
export const maxDuration = 30; // giây, cho câu dài

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-haiku-5-5',
    instructions: 'Bạn là trợ lý kỹ thuật, trả lời ngắn gọn, có ví dụ code khi cần.',
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

API key để trong biến môi trường phía server (ví dụ `OPENAI_API_KEY`), SDK tự đọc. Tuyệt đối không gọi provider trực tiếp từ client — lộ key là mất tiền.

## Phần client: `useChat` lo hết phần lằng nhằng

Ở phía giao diện, hook `useChat` quản lý danh sách tin nhắn, trạng thái đang chạy, và việc ghép token stream lại:

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
          <button type="button" onClick={stop}>Dừng</button>
        ) : (
          <button type="submit">Gửi</button>
        )}
      </form>
    </div>
  );
}
```

Chữ sẽ chạy ra dần trong `messages`. Cái nút **Dừng** gọi `stop()` để hủy giữa chừng — nghe nhỏ nhưng là thứ người dùng rất cần khi model đang lan man.

## Mấy cái bẫy mình từng dính

- **Quên hủy khi người dùng rời trang.** Request stream vẫn chạy ngầm, vẫn tính tiền token. `useChat` xử lý phần lớn, nhưng nếu tự viết fetch thì nhớ truyền `AbortController` và abort khi unmount.
- **Không giới hạn gì cả.** Phải có rate limit theo user/IP, giới hạn độ dài input, và một ngân sách token mỗi request. Không là một người spam vài trăm request là bay tiền.
- **Đổ cả stream vào state mỗi token rồi re-render nặng.** Với câu dài, render lại liên tục có thể giật. Hook lo phần này ổn, nhưng khi tự làm thì gom token theo khung thời gian (ví dụ 50ms) thay vì mỗi token một lần.
- **Lỗi giữa stream bị nuốt.** Model hoặc mạng có thể đứt giữa chừng. Bắt lỗi và hiện cho người dùng một thông báo tử tế, kèm nút thử lại, thay vì để câu trả lời cụt lủn.

## Gắn thêm cho ra sản phẩm thật

Khi đã chạy, những thứ nên thêm tiếp: lưu lịch sử hội thoại vào DB (nhớ phần context window ở [bài đầu series](/ai-for-devs/llm-hoat-dong-the-nao-cho-dev) — càng dài càng tốn), chèn dữ liệu của bạn vào câu trả lời bằng [RAG](/ai-for-devs/rag-tu-a-z-cho-dev-js), và cho model gọi công cụ bằng [tool calling](/ai-for-devs/ai-agent-dau-tien-function-calling). Khi lên production, đọc thêm [timeout, retry và fallback](/ai-for-devs/do-tin-cay-llm-timeout-retry-idempotency) để một lỗi mạng không biến thành ba hóa đơn. Nhưng khung xương thì chỉ có bấy nhiêu: một route handler stream, một hook ở client, và kỷ luật về chi phí cùng việc hủy request. Next.js là stack mình dùng hằng ngày (xem [các kỹ năng mình hay dùng](/#skills)), nên bài này đi thẳng vào App Router.

Làm được cái chatbox chạy chữ mượt rồi, bạn sẽ thấy phần "AI" hóa ra là phần dễ; phần khó và đáng tiền là UX, giới hạn, và xử lý lỗi — đúng chất việc của một fullstack dev.
