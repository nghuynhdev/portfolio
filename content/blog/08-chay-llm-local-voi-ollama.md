---
title: "Chạy LLM local với Ollama: khi nào nên, khi nào đừng"
seoTitle: "Chạy LLM local với Ollama: hướng dẫn và khi nào nên dùng"
slug: chay-llm-local-voi-ollama
description: "Dựng một LLM chạy ngay trên máy bằng Ollama trong vài phút, gọi từ Node/Next.js. Phân tích thẳng thắn khi nào local đáng dùng và khi nào API cloud vẫn hơn."
keywords: "Ollama, LLM local, chạy model offline, self-host LLM, local AI, AI cho developer"
tags: "AI, Ollama, Local LLM, Developer"
date: 2025-09-02
---

# Chạy LLM local với Ollama: khi nào nên, khi nào đừng

Có hai thứ khiến dev muốn chạy LLM ngay trên máy mình: không phải trả tiền theo token, và dữ liệu không rời khỏi máy. Cả hai đều chính đáng. Nhưng trước khi hào hứng gỡ hết OpenAI ra, cần nhìn thẳng vào cái giá của nó. Bài này cho bạn dựng một model local trong vài phút bằng Ollama, rồi bàn thật lòng khi nào nên và khi nào đừng.

## Dựng trong vài phút

Ollama đóng gói việc tải và chạy model local gọn tới mức gần như không có gì để cấu hình.

```bash
# cài (macOS/Linux), rồi kéo một model nhỏ về
ollama pull llama3.2

# chạy thử ngay trong terminal
ollama run llama3.2 "Giải thích closure trong JavaScript ngắn gọn"
```

Ollama mở sẵn một HTTP server ở `localhost:11434`, nên gọi từ code y như gọi một API thường.

## Gọi từ Node/Next.js

Điểm tiện nhất: Ollama phơi ra endpoint tương thích OpenAI, nên bạn dùng lại đúng SDK quen thuộc, chỉ đổi `baseURL`.

```ts
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama', // bỏ qua, chỉ để thư viện khỏi than
});

const res = await client.chat.completions.create({
  model: 'llama3.2',
  messages: [{ role: 'user', content: 'Viết hàm debounce bằng TypeScript' }],
});
console.log(res.choices[0].message.content);
```

Nhờ vậy, code viết cho cloud có thể trỏ về local lúc dev mà gần như không sửa gì. Nhiều người dùng chính cách này: dev và test bằng model local cho đỡ tốn, production thì trỏ lên model cloud mạnh hơn.

## Nó còn làm được gì hay

- **Embedding local** cho [RAG](/ai-for-devs/rag-tu-a-z-cho-dev-js): `ollama pull nomic-embed-text` rồi gọi endpoint embeddings. Toàn bộ pipeline RAG chạy offline, dữ liệu không ra ngoài.
- **Structured output**: Ollama hỗ trợ ép định dạng JSON, nên vẫn làm được trích xuất field có schema.
- **Streaming**: có sẵn, dùng y như API cloud.

## Khi nào local thật sự đáng

- **Dữ liệu nhạy cảm, không được phép rời máy** (y tế, pháp lý, nội bộ). Đây là lý do mạnh nhất, nhiều khi là bắt buộc.
- **Khối lượng lớn, tác vụ đơn giản.** Gắn nhãn, phân loại, tóm tắt hàng loạt offline — chạy local có thể rẻ hơn nhiều so với trả token cloud.
- **Dev và test.** Nghịch thoải mái, không lo hóa đơn, không cần mạng.
- **Cần chạy offline** hoặc độ trễ mạng là vấn đề.

## Khi nào đừng tự huyễn hoặc

Phải nói thẳng, vì chỗ này nhiều người vỡ mộng:

- **Chất lượng không bằng model cloud hàng đầu.** Model chạy vừa trên laptop nhỏ hơn và yếu hơn đáng kể so với model to trên cloud. Việc cần suy luận sâu, viết code phức tạp — khoảng cách là thật.
- **"Miễn phí" chỉ đúng một nửa.** Bạn không trả token, nhưng trả bằng phần cứng (RAM/GPU), điện, và công vận hành. Phục vụ nhiều người dùng cùng lúc cần GPU không rẻ; lúc đó cloud thường lại kinh tế hơn.
- **Vận hành không đơn giản ở quy mô.** Chạy một mình thì dễ; phục vụ production với nhiều request đồng thời, tự lo scaling, cập nhật, giám sát — đó là cả một mảng việc.
- **Tốc độ phụ thuộc máy.** Trên laptop không GPU, model to chạy chậm tới mức khó dùng cho real-time.

## Lời khuyên gọn

Dùng local cho: dev/test, dữ liệu nhạy cảm, và tác vụ đơn giản chạy theo lô. Dùng cloud cho: chất lượng cao nhất và phục vụ nhiều người mà không muốn ôm hạ tầng. Một kiến trúc thực dụng là **lai**: local cho phần nhạy cảm hoặc rẻ tiền, cloud cho phần khó — và nhờ endpoint tương thích OpenAI, chuyển qua lại chỉ là đổi `baseURL`.

Ollama hạ rào cản xuống gần như bằng không, nên cứ thử. Chỉ cần tỉnh táo: local giải quyết bài toán *riêng tư* và *chi phí ở khối lượng lớn* (các đòn giảm chi phí khác nằm trong [bài tối ưu chi phí LLM](/ai-for-devs/giam-chi-phi-do-tre-llm-production)), chứ không phải viên đạn bạc thay thế mọi thứ.

Nếu bạn đang cân nhắc local hay cloud cho một dự án cụ thể và muốn trao đổi, [liên hệ mình tại đây](/#contact).
