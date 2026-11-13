---
title: "RAG từ A–Z cho dev JS/TS: cho LLM 'đọc' tài liệu của bạn"
seoTitle: "RAG là gì? Hướng dẫn RAG từ A–Z cho dev JavaScript"
slug: rag-tu-a-z-cho-dev-js
description: "RAG cho dev fullstack JS: embedding, chunking, vector search, ghép context vào prompt. Kèm code tối giản và lỗi hay gặp."
keywords: "RAG, retrieval augmented generation, embedding, vector database, chunking, semantic search, AI cho developer"
tags: "AI, RAG, Embedding, Developer"
date: 2024-09-24
updated: 2026-11-11
cover: /images/blog/04-rag-tu-a-z-cho-dev-js-v2.webp
---

# RAG từ A–Z cho dev JS/TS: cho LLM "đọc" tài liệu của bạn

**RAG (Retrieval-Augmented Generation) là kỹ thuật cho LLM trả lời dựa trên tài liệu của bạn: trước khi hỏi model, hệ thống tìm vài đoạn tài liệu liên quan nhất rồi đưa vào prompt làm ngữ cảnh.** Nhờ đó model trả lời theo dữ liệu riêng và mới cập nhật mà không cần huấn luyện lại.

Câu hỏi muôn thuở khi làm chatbot cho công ty: "làm sao để nó trả lời dựa trên tài liệu nội bộ của mình?". Nhiều người phản xạ đầu tiên là nhồi hết tài liệu vào prompt. Làm thử là thấy ngay hai vấn đề: tài liệu dài hơn [context window](https://platform.claude.com/docs/en/build-with-claude/context-windows), và mỗi câu hỏi lại gửi lại cả núi chữ nên vừa chậm vừa đốt tiền.

Lời giải đúng là RAG. Nghe đao to búa lớn, nhưng model không cần nhớ toàn bộ tài liệu, nó chỉ cần đọc đúng mẩu bạn đưa.

## Nhắc lại một ý từ bài đầu: embedding

RAG đứng trên [embedding](https://platform.claude.com/docs/en/build-with-claude/embeddings). Nhớ lại từ [bài LLM hoạt động thế nào](/ai-for-devs/llm-hoat-dong-the-nao-cho-dev): embedding biến một đoạn văn bản thành một vector (dãy số), và hai đoạn **gần nghĩa** thì hai vector **gần nhau**. Nhờ đó ta tìm theo *nghĩa* chứ không chỉ khớp từ khóa — người dùng hỏi "cách hoàn tiền" vẫn ra được đoạn viết "chính sách refund".

## Luồng RAG gồm hai pha

**Pha 1 — Index (làm một lần, hoặc mỗi khi tài liệu đổi):**
1. Cắt tài liệu thành các đoạn nhỏ (chunk).
2. Tính embedding cho từng chunk.
3. Lưu chunk + vector vào một vector store.

**Pha 2 — Truy vấn (mỗi lần người dùng hỏi):**
1. Tính embedding của câu hỏi.
2. Tìm vài chunk có vector gần nhất.
3. Dán các chunk đó vào prompt rồi hỏi model.

Chỉ vậy. Giờ đi vào code.

## Pha index: cắt nhỏ và nhúng

```ts
import { embedMany } from 'ai';

// chunk: cắt theo đoạn, ~500-800 ký tự, có overlap để không đứt ý
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

// lưu vào vector store (pgvector, Pinecone, Qdrant...).
// Ví dụ với Postgres + pgvector:
for (let i = 0; i < chunks.length; i++) {
  await db.query(
    'INSERT INTO docs (content, embedding) VALUES ($1, $2)',
    [chunks[i], JSON.stringify(embeddings[i])],
  );
}
```

## Pha truy vấn: tìm gần nhất rồi hỏi

```ts
import { embed, generateText } from 'ai';

async function ask(question: string) {
  const { embedding } = await embed({
    model: 'openai/text-embedding-3-small',
    value: question,
  });

  // lấy 5 chunk gần nhất bằng cosine distance của pgvector
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
      'Chỉ trả lời dựa trên NGỮ CẢNH được cung cấp. ' +
      'Nếu ngữ cảnh không có thông tin, nói thẳng là không biết.',
    prompt: `Ngữ cảnh:\n${context}\n\nCâu hỏi: ${question}`,
  });
  return text;
}
```

Để ý phần `instructions`: ép model bám ngữ cảnh và được phép nói "không biết". Đây là thứ giảm bịa mạnh nhất — thà nó nói không biết còn hơn tự chế ra một chính sách công ty không tồn tại.

## Những chỗ quyết định chất lượng (và hay bị làm ẩu)

RAG dựng cho chạy thì một buổi là xong. Nhưng chạy *tốt* hay không nằm ở mấy chỗ này:

- **Cắt chunk.** Cắt quá nhỏ thì mất ngữ cảnh, quá to thì nhiễu và tốn token. Cắt theo cấu trúc (tiêu đề, đoạn) tốt hơn cắt mù theo số ký tự. Có overlap để câu không bị đứt giữa hai chunk.
- **Số chunk lấy về (top-k).** Lấy ít thì thiếu thông tin, lấy nhiều thì model loãng chú ý và đắt. Thường 3–6 là hợp lý, nên đo thử.
- **Chất lượng tài liệu nguồn.** Rác vào thì rác ra. PDF scan, bảng biểu vỡ định dạng, nội dung trùng lặp đều kéo chất lượng xuống.
- **Trích nguồn.** Lưu kèm mỗi chunk một id/đường dẫn, rồi cho model trả về "nguồn" để người dùng kiểm chứng. Vừa tăng tin cậy vừa dễ debug khi nó trả lời sai.
- **Đánh giá.** Dựng một bộ câu hỏi có đáp án đúng để đo, mỗi lần chỉnh chunking hay top-k thì chạy lại xem tốt lên hay tệ đi. Mình có một bài riêng về [evals](/ai-for-devs/evals-do-chat-luong-llm).

## Khi nào RAG, khi nào không

RAG hợp khi kiến thức thay đổi thường xuyên (tài liệu, sản phẩm, giá) và bạn cần câu trả lời bám nguồn. Nếu chỉ cần model giỏi một kỹ năng chung chung (viết, dịch) thì không cần RAG. Và đừng nhầm RAG với "dạy" model kiến thức mới — model không học gì cả, bạn chỉ đang đưa tài liệu cho nó đọc ngay lúc hỏi.

Hiểu đúng bản chất "đi tìm rồi dán vào prompt", bạn sẽ thấy RAG không phải phép màu, mà là một bài toán search cộng với một chút kỷ luật về dữ liệu — rất đúng tạng của dev. Khi bản cơ bản đã chạy, bước tiếp theo là [RAG production: ingestion, hybrid search và rerank](/ai-for-devs/rag-production-tu-ingestion-den-hybrid-search).

Có câu hỏi về RAG cho dự án của bạn? Cứ [nhắn cho mình](/#contact).
