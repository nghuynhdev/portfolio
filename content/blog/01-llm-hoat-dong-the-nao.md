---
title: "LLM hoạt động thế nào? Giải thích kiểu dev, bỏ qua mấy thứ huyền bí"
seoTitle: "LLM hoạt động thế nào? Giải thích dễ hiểu cho developer"
slug: llm-hoat-dong-the-nao-cho-dev
description: "Mental model để một developer hiểu LLM: token, xác suất token kế tiếp, context window, vì sao model 'bịa'. Không toán, chỉ đủ để code cho đúng."
keywords: "LLM là gì, large language model, token, context window, hallucination, AI cho developer"
tags: "AI, LLM, Developer, Fundamentals"
date: 2024-02-15
updated: 2026-11-11
---

# LLM hoạt động thế nào? Giải thích kiểu dev, bỏ qua mấy thứ huyền bí

Hồi mới dùng ChatGPT để viết code, mình mắc một lỗi tư duy khá ngớ ngẩn: mình tưởng nó *hiểu* câu hỏi của mình, kiểu như có một bộ não con con ngồi suy nghĩ rồi trả lời. Đến khi nó tự tin bịa ra một hàm `Array.prototype.flatMapAsync` không hề tồn tại, mình mới chịu ngồi xuống tìm hiểu thật sự bên dưới nó là cái gì.

Bài này mình viết cho dev — những người không cần biết đạo hàm hay ma trận, nhưng cần một *mental model* đủ đúng để không bị LLM lừa, và để biết vì sao code tích hợp AI của mình lúc thì ngon lúc thì dở.

## Thực chất nó chỉ đoán token kế tiếp

Bỏ hết mấy từ hoa mỹ đi. Một Large Language Model, ở mức cốt lõi, làm đúng một việc: **cho một chuỗi văn bản, đoán mẩu tiếp theo có xác suất cao nhất là gì**. Lặp lại việc đó nhiều lần, ghép lại, ra một câu trả lời.

"Mẩu tiếp theo" không phải là từ, mà là **token**. Token là đơn vị văn bản sau khi bị băm nhỏ. Với tiếng Anh, một token thường là một từ ngắn hoặc một phần của từ. Với tiếng Việt thì việc tách này khá xấu, vì model được huấn luyện chủ yếu trên tiếng Anh — một chữ có dấu như "nghiêng" có thể bị tách thành 2–3 token.

Bạn tự kiểm chứng được. Thử đoạn này:

```js
// npm i gpt-tokenizer
import { encode } from 'gpt-tokenizer';

console.log(encode('hello world').length);        // 2 token
console.log(encode('xin chào thế giới').length);  // ~7-8 token
```

Cùng một ý nghĩa, tiếng Việt tốn gấp 3–4 lần token. Mà **bạn trả tiền theo token**. Đây là lý do rất thực tế: cùng một app chatbot, phục vụ user Việt sẽ đắt hơn user Mỹ, và nếu bạn nhồi prompt tiếng Việt dài dòng thì hóa đơn API cuối tháng sẽ nhắc bạn nhớ điều này.

## "Đoán" nghĩa là có xác suất, và bạn chỉnh được

Ở mỗi bước, model không chọn đúng một token. Nó tính ra một bảng xác suất cho *toàn bộ* từ vựng: token A 60%, token B 25%, token C 8%… rồi bốc một token theo phân phối đó.

Tham số `temperature` chính là nút điều khiển độ "liều" khi bốc:

- `temperature: 0` → gần như luôn chọn token xác suất cao nhất. Kết quả ổn định, lặp lại được, hơi khô. Dùng cho trích xuất dữ liệu, phân loại, sinh JSON.
- `temperature: 0.7–1` → cho phép bốc cả những token ít khả năng hơn. Kết quả đa dạng, sáng tạo hơn, nhưng cũng dễ lạc. Dùng cho viết content, brainstorm.

Mình thấy nhiều người để mặc định rồi than "sao nó trả lời lúc thế này lúc thế kia". Nếu bạn cần output ổn định để parse trong code, hãy để `temperature: 0`. Đừng mặc định.

```ts
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'anthropic/claude-haiku-5-5',
  temperature: 0,          // cần ổn định để parse
  prompt,
});
```

Một hệ quả quan trọng: vì có yếu tố bốc xác suất, **cùng một prompt có thể ra hai kết quả khác nhau**. Đừng viết test kiểu `expect(output).toBe('...')` cho output của LLM. Nó không phải hàm thuần.

## Context window: trí nhớ ngắn hạn, và nó không miễn phí

Model không có bộ nhớ. Nó không "nhớ" bạn vừa nói gì ở tin nhắn trước. Ảo giác về trí nhớ đến từ việc **mỗi lần gọi, bạn gửi lại toàn bộ lịch sử hội thoại** cho nó đọc từ đầu.

Toàn bộ những gì bạn gửi + những gì nó sinh ra phải nằm gọn trong **context window** — giới hạn số token của model (ví dụ 128k token). Hai điều rút ra:

1. Hội thoại càng dài, mỗi lượt gọi càng tốn token (vì phải gửi lại hết). Chi phí tăng tuyến tính theo độ dài, không phải hằng số.
2. Vượt quá cửa sổ, bạn buộc phải cắt bớt lịch sử — và model sẽ "quên" phần bị cắt. Cảm giác "nãy nói rồi mà giờ hỏi lại" là do bạn đã cắt mất đoạn đó khỏi context, chứ không phải nó lú.

Đây cũng là lý do trò "nhồi cả codebase vào prompt" nghe thì sướng nhưng thực tế vừa đắt vừa làm model loãng sự chú ý. Giải pháp đàng hoàng cho việc cho model "đọc tài liệu" là RAG — mình viết riêng trong bài [RAG từ A–Z cho dev JS/TS](/ai-for-devs/rag-tu-a-z-cho-dev-js).

## Vì sao nó bịa (hallucination)

Quay lại con hàm ma `flatMapAsync` ở đầu bài. Hiểu được cơ chế rồi thì chuyện bịa không còn bí ẩn: mục tiêu của model là sinh ra chuỗi token **nghe hợp lý về mặt ngôn ngữ**, chứ không phải chuỗi token **đúng sự thật**. Nó không tra cứu gì cả. Trong dữ liệu huấn luyện có đầy `flatMap`, có đầy hàm `...Async`, nên ghép ra `flatMapAsync` là một chuỗi token rất "hợp lý" — chỉ tiếc là sai.

Model không có cảm giác "mình không biết". Khi thiếu thông tin, nó không dừng lại, nó lấp đầy bằng thứ nghe xuôi tai nhất. Càng hỏi về thứ ít xuất hiện trong dữ liệu (API nội bộ, số liệu cụ thể, tên người ít nổi tiếng), nó càng dễ bịa một cách rất tự tin.

Thực tế khi code, mình xử lý thế này:
- Không bao giờ tin số liệu, ngày tháng, tên API do model đưa ra mà không kiểm. Coi nó như một junior nói rất trôi chảy nhưng hay nhớ nhầm.
- Việc nào cần đúng tuyệt đối (tính tiền, truy vấn DB) thì để code làm, LLM chỉ lo phần ngôn ngữ.
- Muốn giảm bịa thì **đưa dữ liệu thật vào prompt** (grounding) thay vì bắt nó tự nhớ.

## Embedding: khi văn bản biến thành tọa độ

Thêm một mảnh nữa để bạn đủ bức tranh. Ngoài việc sinh text, model còn biết biến một đoạn văn bản thành một **vector** — một dãy số, kiểu `[0.01, -0.23, 0.88, ...]` dài vài trăm tới vài nghìn chiều. Đó gọi là embedding.

Điểm hay: hai đoạn văn bản **gần nghĩa nhau** thì hai vector của chúng **gần nhau trong không gian**. "chó" và "cún" gần nhau; "chó" và "hóa đơn thuế" xa nhau. Nhờ vậy ta "tìm theo nghĩa" được, chứ không chỉ khớp từ khóa. Toàn bộ RAG, semantic search, gợi ý "bài liên quan" đều đứng trên ý tưởng này. Giờ chỉ cần nhớ: **embedding = văn bản → tọa độ, gần nghĩa thì gần nhau**.

## Vậy dev cần nhớ gì

Gói lại thành vài câu dùng được ngay:

- LLM đoán token kế tiếp theo xác suất, không hiểu, không tra cứu.
- Token tiếng Việt tốn hơn tiếng Anh nhiều — ảnh hưởng trực tiếp tới tiền và tốc độ.
- `temperature` thấp cho việc cần ổn định, cao cho việc cần sáng tạo. Đừng để mặc định rồi than.
- "Trí nhớ" chỉ là bạn gửi lại lịch sử; càng dài càng đắt, quá cửa sổ là quên.
- Nó bịa vì nó tối ưu "nghe hợp lý", không phải "đúng". Thứ gì cần đúng, đừng giao trọn cho nó. Mình là [Nguyễn Huỳnh](/), làm fullstack với React, Next.js và NestJS, và series này là những gì mình rút ra khi đưa AI vào sản phẩm thật.

Không cần biết một dòng toán nào, nhưng có đúng mental model này thôi là bạn đã tránh được phần lớn những cú "ủa sao nó ngu vậy" khi làm sản phẩm với AI. Mấy bài sau trong series, mình sẽ đi vào từng phần cụ thể hơn — bắt đầu từ [cách viết prompt cho ra kết quả dùng được](/ai-for-devs/prompt-engineering-thuc-chien-cho-dev).
