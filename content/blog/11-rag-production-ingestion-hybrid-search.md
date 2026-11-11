---
title: "RAG production: từ đưa tài liệu vào index đến hybrid search và rerank"
seoTitle: "RAG production: ingestion, hybrid search và reranking"
slug: rag-production-tu-ingestion-den-hybrid-search
description: "Đưa RAG từ demo lên production: parse PDF giữ cấu trúc, lưu metadata, cập nhật index an toàn, hybrid search bằng RRF, thêm reranker và đo recall@k."
keywords: "RAG production, RAG ingestion, hybrid search, reranking, RRF, PDF OCR, chunking, vector index, AI cho developer"
tags: "AI, RAG, Search, Data Pipeline"
date: 2026-03-29
updated: 2026-11-11
---

# RAG production: từ đưa tài liệu vào index đến hybrid search và rerank

Bản RAG đầu tiên thường chạy rất ổn trên vài file Markdown sạch sẽ. Rồi nó gặp dữ liệu thật: một PDF bảng giá mà parser ghép tên gói ở cột trái với giá của gói khác ở cột phải; một khách hỏi đúng mã lỗi `PAYMENT_042` nhưng vector search lại trả về đoạn "xử lý thanh toán thất bại" chung chung. Prompt viết khéo đến đâu cũng không cứu được một đoạn tài liệu sai, hay một đoạn đúng chưa từng vào context.

Ở [bài RAG từ A–Z](/ai-for-devs/rag-tu-a-z-cho-dev-js) ta đã dựng khung: cắt chunk, nhúng, tìm gần nhất, dán vào prompt. Bài này đi tiếp hai nửa quyết định chất lượng khi lên production: **đưa tài liệu vào index cho đúng**, và **tìm lại đúng đoạn cần thiết**.

## Phần 1 — Ingestion: model chỉ đọc được thứ bạn đưa vào

Khi RAG trả lời kém, đừng chỉ nhìn prompt. Hãy mở chính đoạn text đang nằm trong index — rất nhiều lỗi nằm ngay ở đó.

### Phân loại tài liệu trước khi xử lý

Markdown và HTML thường có tiêu đề, đoạn văn, danh sách khá rõ. PDF có text thì trích được chữ, nhưng thứ tự đọc chưa chắc đúng. PDF scan cần OCR; tài liệu nhiều cột và bảng cần kiểm tra cấu trúc riêng.

Unstructured mô tả các chiến lược phân tích PDF như trích text nhanh, OCR và phân tích bố cục. Bài học rút ra: chọn cách xử lý theo loại tài liệu, đừng coi mọi file là một chuỗi text cắt giống nhau.

Với kho tài liệu tiếng Việt, lấy mẫu có dấu, bảng số, tiêu đề nhiều cấp và trang scan nghiêng; xem kết quả trích xuất bằng mắt trước khi chạy toàn kho. Soi riêng các ký tự hay nhầm `0/O`, `1/l`, đơn vị và dấu phân cách số.

### Giữ đường quay về nguồn

Chunk chỉ có `text` sẽ rất khó sửa khi người dùng báo câu trả lời sai. Ít nhất cần biết nó thuộc tài liệu nào, phiên bản nào, vị trí nào và ai được đọc:

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

`revision` có thể lấy từ hệ quản lý tài liệu hoặc hash nội dung. Phiên bản parser và embedding cần lưu riêng: cùng một PDF nhưng parser mới tạo text khác, model embedding mới tạo không gian vector khác — trộn lẫn là kết quả tìm kiếm khó giải thích.

`sourceUrl` nên trỏ đến nguồn có kiểm soát truy cập. Khi hiển thị trích dẫn, kiểm tra lại quyền tại thời điểm người dùng mở, không dựa vào quyền lúc index.

### Cắt theo cấu trúc, rồi mới giới hạn kích thước

Ưu tiên ranh giới tiêu đề, đoạn và mục; mục nào quá lớn mới chia tiếp theo ngân sách token. Với bảng, giữ tên cột đi cùng dữ liệu — một dòng "299.000" đứng riêng gần như mất nghĩa.

Có thể thêm đường dẫn tiêu đề vào đầu chunk, ví dụ "Thanh toán > Hoàn tiền > Thời gian xử lý". Overlap cũng cần đo: tăng overlap là tăng lưu trữ, chi phí embedding và nguy cơ lấy về nhiều đoạn trùng nhau.

### Cập nhật index mà không để người dùng thấy nửa phiên bản

Luồng mình ưu tiên:

1. Đọc revision mới, parse và kiểm tra chất lượng.
2. Tạo toàn bộ chunk và vector cho revision đó ở vùng staging.
3. Đánh dấu revision hoàn tất trong kho metadata có giao dịch.
4. Chuyển con trỏ "revision đang phục vụ" bằng một cập nhật nguyên tử.
5. Thu hồi revision cũ sau một khoảng đệm.

Đây là thiết kế ở tầng ứng dụng, không phải tính năng tự có của mọi vector database. Khi truy vấn, lấy revision đang hoạt động rồi dùng nó xuyên suốt request. Nếu bước embedding lỗi giữa chừng, người dùng vẫn đọc bản cũ hoàn chỉnh.

Xóa tài liệu cũng là một kiểu cập nhật: chặn phục vụ bằng metadata trước, rồi dọn chunk, vector, cache và bản trích xuất liên quan. Chỉ xóa file gốc thì bản sao trong index vẫn xuất hiện trong câu trả lời. Job chạy lại cần một khóa duy nhất (tenant + document + revision + phiên bản pipeline) để không nhân đôi chunk — dùng ràng buộc unique trong database, vì "kiểm tra rồi mới insert" vẫn có thể đua với worker khác.

## Phần 2 — Retrieval: tìm đúng đoạn, không chỉ đoạn gần nghĩa

### Hai cách tìm, hai kiểu mạnh

Tìm kiếm từ khóa hợp với mã sản phẩm, tên hàm, số hiệu tài liệu, cụm từ đặc biệt. Vector search mạnh khi câu hỏi diễn đạt khác tài liệu: "lấy lại tiền" vẫn khớp với "chính sách hoàn phí". Thực tế cần cả hai.

**Hybrid search** lấy ứng viên từ hai nhánh rồi hợp nhất. Đừng cộng thẳng điểm keyword với cosine similarity — chúng không cùng thang đo. Cách khởi đầu dễ kiểm soát là **Reciprocal Rank Fusion (RRF)**: cộng đóng góp theo thứ hạng thay vì điểm gốc ([tài liệu RRF của Elasticsearch](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion)).

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

const lexical = [{ id: 'a', text: 'Mã lỗi PAYMENT_042' }];
const semantic = [
  { id: 'b', text: 'Xử lý thanh toán thất bại' },
  { id: 'a', text: 'Mã lỗi PAYMENT_042' },
];

console.log(fuseRankings([lexical, semantic])); // 'a' lên đầu
```

`k = 60` là điểm xuất phát phổ biến; số ứng viên mỗi nhánh và tập truy vấn thật mới quyết định cấu hình hợp sản phẩm.

### Reranker đứng sau retrieval

Sau khi có tập ứng viên, reranker đọc câu hỏi cùng từng đoạn rồi xếp hạng lại. Cross-encoder xét hai phần cùng lúc nên chính xác hơn nhưng tốn hơn tra vector, vì vậy chỉ chạy trên tập đã thu hẹp (Sentence Transformers mô tả pipeline retrieve rồi re-rank).

Một cấu hình thử nghiệm: lấy 30 ứng viên mỗi nhánh, hợp nhất, rerank tối đa 40 đoạn, chọn vài đoạn vừa ngân sách context. Nhớ rằng reranker không tìm lại được đoạn đã bị loại từ bước trước — nếu tài liệu đúng không có trong tập ứng viên, sửa tìm kiếm chứ đừng sửa reranker.

### Lọc quyền ngay trong từng nhánh

Với dữ liệu nhiều khách hàng, cả keyword lẫn vector search đều phải lọc theo tenant và quyền người đang hỏi; chỉ gửi ứng viên được phép đọc sang reranker. Đừng lấy tài liệu của mọi người rồi trông chờ model "bỏ qua phần không thuộc quyền" — đó là [lỗ hổng bảo mật](/ai-for-devs/bao-mat-ai-prompt-injection), không phải tính năng.

Khi nhiều chunk đến từ cùng một tài liệu, kiểm tra trùng lặp: năm đoạn gần giống nhau có thể chiếm hết context trong khi câu trả lời cần hai nguồn khác nhau.

## Đo từng tầng trước khi thêm tầng mới

Tạo tập câu hỏi có nhãn đoạn đúng, rồi đo riêng từng tầng:

- **Ingestion:** số trang lỗi, chunk rỗng, bảng mất tiêu đề, chunk không truy vết được nguồn.
- **Retrieval:** `recall@k` (đoạn cần thiết có nằm trong k kết quả không), thứ hạng kết quả đúng đầu tiên, độ trễ. Chia tập theo mã lỗi, câu hỏi tự nhiên, tiếng Việt có dấu và không dấu.
- **Câu trả lời cuối:** chạy [bộ evals](/ai-for-devs/evals-do-chat-luong-llm).

Đọc kết quả theo thứ tự đó. Tài liệu đúng không xuất hiện → sửa ingestion hoặc tìm kiếm. Retrieval tốt lên mà câu trả lời không khá hơn → xem cách dựng context và hướng dẫn trích nguồn. Chỉ khi hai tầng dưới ổn mới nghĩ đến đổi model sinh câu trả lời.

Một index nhỏ nhưng sạch, cộng hybrid search và reranker được đo đàng hoàng, thường đáng giá hơn một kho vector khổng lồ chứa nội dung hỏng. Muốn theo dõi các tầng này khi đã chạy thật, xem tiếp bài [vận hành LLM: tracing và rollout](/ai-for-devs/van-hanh-llm-tracing-version-rollout).

Nếu bạn đang dựng RAG cho dữ liệu nội bộ và muốn một góc nhìn thứ hai, [liên hệ mình](/#contact).
