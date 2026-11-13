---
title: "Giảm chi phí và độ trễ khi gọi LLM trong production"
seoTitle: "Tối ưu chi phí và độ trễ LLM trong production"
slug: giam-chi-phi-do-tre-llm-production
description: "Cách giảm chi phí và độ trễ LLM: chọn model theo tác vụ, prompt caching, cắt token thừa, streaming và đo lường thực tế."
keywords: "chi phí LLM, tối ưu token, prompt caching, model routing, độ trễ LLM, AI cho developer"
tags: "AI, LLM, Performance, Cost, Developer"
date: 2025-03-11
updated: 2026-11-11
cover: /images/blog/06-giam-chi-phi-do-tre-llm-production-v2.webp
---

# Giảm chi phí và độ trễ khi gọi LLM trong production

Lúc làm demo, gọi model nào cũng được, chậm vài giây cũng kệ. Đến khi lên production với vài nghìn người dùng, hai con số đập vào mặt: hóa đơn cuối tháng và độ trễ. Mình từng thấy một tính năng "tóm tắt" vô hại ngốn nhiều tiền hơn cả phần hạ tầng còn lại, chỉ vì gọi model to cho một việc mà model nhỏ thừa sức làm.

Bài này gom những đòn thực sự hạ được chi phí và độ trễ, xếp theo mức "đáng làm trước".

## 1. Chọn đúng model cho đúng việc

Đòn lớn nhất, làm trước tiên. Model mạnh nhất không phải lúc nào cũng cần. Phân loại cảm xúc, trích xuất field, định tuyến câu hỏi — mấy việc này một model nhỏ, rẻ hơn hàng chục lần, làm vẫn tốt. Để dành model to cho phần thật sự cần suy luận.

Một kiến trúc hay dùng là **routing**: một model nhỏ phân loại câu hỏi dễ hay khó, dễ thì nó trả lời luôn, khó mới chuyển lên model to.

```ts
const level = await classify(question); // model nhỏ, rẻ
const model = level === 'hard' ? 'anthropic/claude-sonnet-5-5' : 'anthropic/claude-haiku-5-5';
const { text } = await generateText({ model, prompt: question });
```

Chỉ cần phần lớn truy vấn rơi vào nhánh rẻ là hóa đơn đã khác hẳn.

## 2. Cache — thứ miễn phí mà hay bị quên

Rất nhiều câu hỏi lặp lại. Nếu hai người hỏi y hệt, không cần gọi model hai lần.

- **Cache kết quả theo nội dung.** Lấy hash của (prompt + tham số) làm key, lưu vào Redis. Trúng cache thì trả luôn, 0 đồng, 0 độ trễ.

```ts
const key = 'llm:' + sha256(model + '|' + prompt);
const hit = await redis.get(key);
if (hit) return hit;

const { text } = await generateText({ model, prompt });
await redis.set(key, text, { EX: 3600 }); // sống 1 giờ
return text;
```

- **[Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) của nhà cung cấp.** Nếu nhiều request dùng chung một đoạn đầu prompt dài (system prompt, tài liệu nền), các provider cho cache phần tiền tố đó và tính giá rẻ hơn hẳn cho lần sau. Mẹo: đặt phần cố định lên *đầu* prompt, phần thay đổi xuống cuối, để tiền tố trùng nhau càng nhiều càng tốt.

## 3. Cắt token thừa

Bạn trả tiền cả token vào lẫn token ra.

- **Input:** đừng nhồi cả lịch sử hội thoại hay cả tài liệu khi không cần. Tóm tắt lịch sử cũ, dùng [RAG](/ai-for-devs/rag-tu-a-z-cho-dev-js) để chỉ đưa đúng đoạn liên quan thay vì cả file.
- **Output:** giới hạn `maxTokens` và nói rõ trong prompt độ dài mong muốn. "Trả lời trong 3 câu" vừa rẻ vừa nhanh hơn một bài luận.
- Nhớ lại [bài đầu series](/ai-for-devs/llm-hoat-dong-the-nao-cho-dev): tiếng Việt tốn token hơn tiếng Anh. Prompt hệ thống dài dòng bằng tiếng Việt nhân lên theo mỗi request.

## 4. Streaming để "nhanh" mà không cần nhanh hơn

Streaming không giảm tổng thời gian, nhưng giảm **thời gian tới chữ đầu tiên** xuống còn vài trăm ms. Người dùng cảm nhận là nhanh, và đó mới là cái họ quan tâm. Gần như mọi giao diện chat nên bật streaming — cách làm trong Next.js mình viết ở [bài streaming](/ai-for-devs/tich-hop-ai-vao-nextjs-streaming).

## 5. Song song và gộp việc

Nếu một request cần vài lời gọi độc lập (ví dụ tóm tắt 5 đoạn), đừng gọi tuần tự. Chạy song song:

```ts
const summaries = await Promise.all(
  chunks.map((c) => generateText({ model: 'anthropic/claude-haiku-5-5', prompt: `Tóm tắt: ${c}` })),
);
```

Tổng thời gian còn bằng lời gọi lâu nhất thay vì cộng dồn. Với việc theo lô không cần real-time (gắn nhãn hàng loạt), cân nhắc [batch API](https://platform.claude.com/docs/en/build-with-claude/batch-processing) nếu provider có — thường rẻ hơn đáng kể.

## 6. Đo trước khi tối ưu

Đừng đoán mò. Log cho mỗi request: model dùng, token in/out, chi phí ước tính, thời gian. Muốn đo bài bản hơn log thủ công, xem [tracing và rollout cho LLM](/ai-for-devs/van-hanh-llm-tracing-version-rollout). Có số rồi bạn mới biết 3 endpoint nào ăn 80% hóa đơn mà tập trung vào đó, thay vì tối ưu lung tung chỗ chẳng đáng.

```ts
log.info({
  model, inputTokens: usage.inputTokens, outputTokens: usage.outputTokens,
  ms: Date.now() - start,
});
```

Đây là phần mình quan tâm nhất với tư cách [fullstack developer](/#overview): tính năng AI hay đến đâu cũng phải sống được với hóa đơn và độ trễ.

Thứ tự mình khuyên: đo trước, rồi chọn lại model cho đúng việc, rồi cache, rồi cắt token. Ba đòn đầu thường đã cắt phần lớn hóa đơn. Phần còn lại là kỷ luật: coi mỗi lời gọi LLM như một truy vấn tốn tiền, vì nó đúng là vậy.
