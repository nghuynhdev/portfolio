---
title: "Vận hành LLM trong production: tracing, phiên bản và rollout an toàn"
seoTitle: "LLMOps: tracing, versioning và rollout LLM an toàn"
slug: van-hanh-llm-tracing-version-rollout
description: "Vận hành LLM như kỹ sư: tracing bằng OpenTelemetry, version prompt/model/index cùng nhau, rollout qua eval, canary và rollback."
keywords: "LLM observability, AI tracing, OpenTelemetry, prompt versioning, canary release, shadow traffic, AI rollback, LLMOps, AI cho developer"
tags: "AI, Observability, Deployment, Backend"
date: 2026-05-14
updated: 2026-11-11
---

# Vận hành LLM trong production: tracing, phiên bản và rollout an toàn

API trả 200, không exception, độ trễ trong ngưỡng — dashboard xanh rì. Nhưng chatbot vừa dùng tài liệu hết hạn để trả lời khách. Hoặc một lần sửa prompt giữ nguyên type, build vẫn qua, vậy mà bot bắt đầu từ chối quá nhiều câu hỏi hợp lệ.

Với ứng dụng AI, "hệ thống chạy được" và "kết quả dùng được" là hai câu hỏi khác nhau. Bài này gom hai thứ giúp trả lời câu hỏi thứ hai: **quan sát** từng lần chạy, và **triển khai thay đổi** sao cho luôn có đường quay về. Cả hai xoay quanh cùng một ý: prompt, model và dữ liệu truy xuất là các phần của một **phiên bản hành vi**.

## Phần 1 — Trace theo đường đi của một câu hỏi

Với một request RAG, trace có thể gồm các span: xác thực, tạo embedding, tìm ứng viên, rerank, dựng context, gọi model, kiểm tra output. Agent có thêm span cho từng tool và từng vòng lặp.

[OpenTelemetry JavaScript hỗ trợ tạo span bằng `startActiveSpan`](https://opentelemetry.io/docs/languages/js/instrumentation/). Một helper nhỏ bọc mọi bước:

```ts
import { trace, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('ai-app');

export async function traceStep<T>(name: string, run: () => Promise<T>): Promise<T> {
  return tracer.startActiveSpan(name, async (span) => {
    try {
      const result = await run();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      // Chỉ ghi nhóm lỗi; không đẩy nguyên payload vào telemetry
      span.setAttribute('app.failure_kind', 'step_failed');
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      span.end();
    }
  });
}
```

Span cha cần được tạo ở đầu request; với queue, phải truyền context qua ranh giới producer/consumer. Nếu mỗi worker tự mở một trace rời, bạn vẫn khó lần theo workflow dù log rất nhiều.

### Đo thứ gắn với trải nghiệm

- **Streaming:** tách thời gian tới token đầu và thời gian hoàn tất.
- **Agent:** số bước, tool lỗi, bước phải đối soát.
- **RAG:** số nguồn, revision index, số ứng viên sau lọc quyền.
- **Chi phí:** token lấy từ usage của provider; đánh dấu rõ khi thiếu usage do ngắt kết nối, và đừng ghi token ước tính thành chi phí đã xác nhận.

Metric dùng nhãn có tập giá trị hữu hạn (loại tác vụ, nhóm lỗi). Đừng đưa request id, user id hay nguyên câu hỏi vào nhãn metric — số chuỗi giá trị sẽ phình rất nhanh; những trường đó thuộc về trace.

### Không mặc định ghi toàn bộ prompt

Prompt, tool result và câu trả lời có thể chứa dữ liệu khách hàng. Mặc định chỉ ghi metadata. Nếu cần lưu mẫu nội dung để debug, quy định trước tỉ lệ lấy mẫu, cách che dữ liệu, ai được xem và lưu bao lâu. Ngay cả exception message cũng có thể chứa URL hay payload — đó là lý do helper trên chỉ ghi nhóm lỗi.

## Phần 2 — Đóng gói thay đổi thành phiên bản

Một trace chỉ hữu ích khi nó cho biết **bản nào** đang chạy. Đừng chỉ lưu một biến `MODEL_NAME`; hãy có một manifest:

```json
{
  "release": "support-v8",
  "promptVersion": "support-prompt-v14",
  "modelConfigVersion": "model-config-v3",
  "toolSchemaVersion": "support-tools-v2",
  "retrievalConfigVersion": "search-v5",
  "documentIndexRevision": "docs-2026-11-11-a",
  "outputSchemaVersion": "answer-v2"
}
```

Gắn `release` vào mọi trace. Khi chất lượng giảm sau một đợt triển khai, bạn so `prompt-v13` với `prompt-v14` thay vì đoán string nào vừa đổi. Nếu provider chỉ cho alias model có thể tự cập nhật, ghi nhận giới hạn tái lập đó và dùng snapshot cố định khi có.

Tên thuộc tính như `app.prompt_version` là quy ước riêng của ứng dụng. Nếu muốn theo chuẩn chung, xem semantic conventions GenAI của OpenTelemetry đúng phiên bản bạn dùng.

## Phần 3 — Rollout có đường quay về

### Offline trước traffic thật

Chạy [bộ evals](/ai-for-devs/evals-do-chat-luong-llm) trên tập đại diện và các nhóm lỗi từng gặp, kiểm tra hợp đồng output/tool, so chất lượng – độ trễ – chi phí theo từng loại tác vụ thay vì một điểm trung bình. Tiêu chí chặn ví dụ: không làm hỏng ca phân quyền bắt buộc; tỉ lệ output hợp lệ không giảm quá ngưỡng; chi phí mỗi tác vụ trong ngân sách.

### Shadow traffic: chạy song song, tắt tác dụng phụ

Shadow chạy bản mới trên một mẫu đầu vào trong khi người dùng vẫn nhận kết quả bản cũ — tốt để so format, retrieval và câu trả lời. Nhánh shadow tuyệt đối không được gửi email, sửa đơn hay thanh toán: dùng tool chỉ đọc hoặc ghi lại "đề nghị hành động" trong môi trường mô phỏng.

### Canary với nhóm ổn định

Google SRE mô tả canary là triển khai giới hạn rồi quyết định có mở rộng không. Với chatbot, giữ cùng một nhóm cho cả hội thoại để không mỗi lượt một hành vi:

```ts
import { createHash } from 'node:crypto';

function inCanary(tenantId: string, conversationId: string, percent: number) {
  if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
    throw new Error('Invalid rollout percentage');
  }
  const key = JSON.stringify(['support-v8', tenantId, conversationId]);
  const digest = createHash('sha256').update(key).digest();
  return digest.readUInt32BE(0) / 2 ** 32 < percent / 100;
}
```

Hash cho cách gán ổn định nhưng không bảo đảm mẫu nhỏ đúng tỉ lệ. Lưu release được gán lúc bắt đầu hội thoại để nó không đổi giữa chừng khi bạn tăng phần trăm.

So canary với nhóm đối chứng **cùng khoảng thời gian**: lỗi schema, tool thất bại, phản hồi người dùng, độ trễ, tỉ lệ hoàn tất tác vụ. Tỉ lệ từ chối tăng có thể tốt hoặc xấu tùy câu hỏi — đọc mẫu theo rubric chứ đừng coi nó là tín hiệu tuyệt đối. Traffic ít thì kéo dài thời gian quan sát; vài lượt thử thành công chưa chứng minh bản mới tốt hơn.

### Rollback cả những thứ đi cùng model

Giữ bản cấu hình cũ sẵn sàng, nhưng xét cả schema, index và workflow đang dở: embedding mới có thể không tương thích vector cũ; một workflow đang chờ duyệt có thể cần chạy tiếp bằng phiên bản tool lúc nó được tạo. Và rollback prompt không thu hồi được email đã gửi — phần đó thuộc về [idempotency và đối soát](/ai-for-devs/do-tin-cay-llm-timeout-retry-idempotency).

## Nối trace với chất lượng

Gắn nút phản hồi của người dùng với request id. Khi một câu trả lời bị báo sai, mở trace xem tài liệu nào được lấy, bước nào chậm, release nào đang chạy; rồi thêm một ca đã ẩn danh vào bộ eval.

Trace giải thích **từng lần chạy**. Eval cho biết một thay đổi có sửa được **cả nhóm vấn đề** không. Rollout có canary giới hạn **thiệt hại** khi cả hai bỏ sót. Có đủ ba thứ, bạn đổi prompt hay nâng model mà không phải đoán mò.

Muốn biết thêm về [kinh nghiệm làm sản phẩm của mình](/#experience)? Ghé trang giới thiệu.
