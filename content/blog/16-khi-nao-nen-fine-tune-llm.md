---
title: "Khi nào nên fine-tune LLM? Bắt đầu từ lỗi, đừng bắt đầu từ GPU"
seoTitle: "Khi nào nên fine-tune LLM? So sánh fine-tuning và RAG"
slug: khi-nao-nen-fine-tune-llm
description: "Khi nào nên fine-tune LLM thay vì prompt hay RAG: phân loại lỗi, chuẩn bị dữ liệu huấn luyện, đánh giá chất lượng và chi phí."
keywords: "LLM fine tuning, LoRA, PEFT, training data, RAG vs fine tuning, AI cho developer"
tags: "AI, Fine Tuning, Data, Developer"
date: 2026-06-17
cover: /images/blog/16-khi-nao-nen-fine-tune-llm-v2.webp
---

# Khi nào nên fine-tune LLM? Bắt đầu từ lỗi, đừng bắt đầu từ GPU

“Cho model học toàn bộ tài liệu công ty” nghe hợp lý cho đến khi chính sách đổi vào tuần sau. Nếu mục tiêu là trả lời theo dữ liệu mới và chỉ rõ nguồn, [RAG](/ai-for-devs/rag-tu-a-z-cho-dev-js) thường là điểm khởi đầu dễ cập nhật hơn.

Fine-tuning điều chỉnh tham số bằng dữ liệu huấn luyện. Nó có thể giúp model thích nghi với tác vụ và cách trả lời cụ thể, nhưng không tự biến thành kho tài liệu có phiên bản, quyền truy cập và trích dẫn.

## Xác định model đang sai kiểu gì

Mình sẽ phân loại ca lỗi trước khi chọn giải pháp:

| Biểu hiện | Thử sửa ở đâu trước |
|---|---|
| Thiếu chính sách mới nhất | Nguồn dữ liệu và retrieval |
| Không hiểu yêu cầu đầu ra | Prompt, ví dụ và schema |
| Phân loại sai các trường hợp đặc thù lặp lại | Nhãn, ví dụ, rồi thử fine-tuning |
| Thường viết sai giọng đã được định nghĩa rõ | Few-shot, bộ đánh giá giọng, rồi thử fine-tuning |
| Gọi nhầm tool hoặc sai quyền | Mô tả tool, routing và tầng thực thi |

Đây là thứ tự điều tra mình đề xuất, không phải ranh giới tuyệt đối. RAG và fine-tuning cũng có thể dùng cùng nhau: một phần cung cấp bằng chứng mới, một phần giúp cách xử lý tác vụ phù hợp hơn.

## LoRA giảm phần phải huấn luyện

Thay vì cập nhật mọi trọng số, [LoRA giữ trọng số gốc cố định](https://arxiv.org/abs/2106.09685) và học các ma trận cập nhật nhỏ hơn. [Tài liệu PEFT của Hugging Face giải thích cơ chế này](https://huggingface.co/docs/peft/main/en/conceptual_guides/lora). Nó có thể giảm tài nguyên dành cho fine-tuning, nhưng không khiến mọi model đều chạy vừa laptop.

Bạn vẫn phải tính bộ nhớ cho base model, activation, độ dài chuỗi và cấu hình huấn luyện. Khi triển khai, adapter phải tương thích với base model và cách phục vụ. Kiểm tra điều kiện sử dụng model trước khi biến thử nghiệm thành tính năng sản phẩm.

## Dữ liệu cần phản ánh tác vụ thật

Với phân loại ticket, một mẫu cần có nội dung đầu vào, nhãn đúng và tiêu chí gán nhãn nhất quán. Với trợ lý trả lời, cần cả những trường hợp thiếu thông tin và cách từ chối suy đoán phù hợp.

Đừng chỉ gom các câu dễ mà model đã làm đúng. Xem các nhóm lỗi có giá trị, xử lý nhãn mâu thuẫn và loại thông tin không cần thiết. Dữ liệu do model sinh có thể dùng để đề xuất mẫu, nhưng cần kiểm tra; nếu chép cả lỗi của model vào đáp án, bạn đang dạy lại chính lỗi đó.

## Chia tập trước khi tạo biến thể

Nếu một ticket gốc có mười bản diễn đạt lại, cả mười nên ở cùng một tập. Đưa tám bản vào train và hai bản gần giống vào test sẽ làm kết quả đẹp hơn khả năng tổng quát thực tế.

Ví dụ chia ổn định theo nhóm bằng TypeScript:

```ts
import { createHash } from 'node:crypto';

function datasetSplit(groupId: string): 'train' | 'validation' | 'test' {
  const digest = createHash('sha256')
    .update(`dataset-v1:${groupId}`)
    .digest();
  const bucket = digest.readUInt32BE(0) % 100;
  return bucket < 80 ? 'train' : bucket < 90 ? 'validation' : 'test';
}
```

Tỷ lệ 80/10/10 chỉ minh họa. Với nhóm ít hoặc chênh lệch kích thước lớn, cách hash không bảo đảm cân bằng nhãn hay số mẫu; kiểm tra thống kê sau khi chia. Nếu mục tiêu là xử lý dữ liệu tương lai, cân nhắc tập test theo thời gian và loại gần trùng qua ranh giới.

## So với baseline đủ nghiêm túc

Giữ một baseline gồm model gốc, prompt rõ và ví dụ tốt. Dùng validation để chọn cấu hình; chỉ mở test cho đánh giá cuối, tránh sửa đi sửa lại theo cùng bộ test.

Đo trên từng nhóm: nhãn hiếm, câu dài, tiếng Việt không dấu, tình huống thiếu bằng chứng. Với tác vụ phân loại, xem precision/recall theo nhãn thay vì chỉ accuracy tổng. Với câu trả lời tự do, dùng rubric và lấy mẫu người đánh giá.

Ghi thêm chi phí huấn luyện, chi phí phục vụ và độ trễ. Nếu adapter chỉ nhỉnh hơn baseline ở ca dễ nhưng làm hỏng nhóm quan trọng, chưa có lý do triển khai. Một thử nghiệm fine-tuning hữu ích phải trả lời được: nó sửa loại lỗi nào, với đánh đổi gì, và có lặp lại kết quả đó trên dữ liệu chưa dùng để chọn cấu hình không?

Mình là [Huỳnh](/), fullstack developer ở TP.HCM — series AI for Devs là nơi mình ghi lại những quyết định kiểu này.
