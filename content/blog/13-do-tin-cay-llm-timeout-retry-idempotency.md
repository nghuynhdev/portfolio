---
title: "Độ tin cậy cho LLM: timeout, retry, fallback và idempotency"
seoTitle: "Retry, timeout và fallback cho LLM: làm app AI chịu lỗi"
slug: do-tin-cay-llm-timeout-retry-idempotency
description: "Làm ứng dụng LLM chịu lỗi: deadline cho cả request, retry có ngân sách với backoff + jitter, fallback giữ hợp đồng và idempotency chống chạy trùng."
keywords: "LLM retry, timeout, exponential backoff, jitter, model fallback, idempotency, durable AI workflow, outbox, AI agent, AI cho developer"
tags: "AI, Reliability, Agent, Backend"
date: 2026-05-02
updated: 2026-11-11
---

# Độ tin cậy cho LLM: timeout, retry, fallback và idempotency

Hai sự cố rất đời thường khi đưa LLM lên production:

- Một request chậm làm frontend thử lại. Backend có retry riêng. SDK cũng retry. Mỗi tầng cho ba lần, lồng vào nhau — một cú bấm của người dùng thành **27 lần gọi** model, đúng lúc provider đang quá tải.
- Agent soạn thư, gọi dịch vụ gửi email, rồi worker chết trước khi ghi "đã gửi". Job chạy lại từ đầu — khách nhận **hai email giống nhau**.

Hai chuyện này là hai mặt của cùng một bài toán: hệ thống phải biết làm gì khi một lần gọi thất bại hoặc không rõ kết quả. Với thao tác chỉ đọc, câu trả lời là retry có kiểm soát. Với thao tác có tác dụng phụ, câu trả lời là idempotency và đối soát. Bài này đi qua cả hai.

## Phần 1 — Thao tác chỉ đọc: timeout và retry có ngân sách

### Chọn một nơi sở hữu retry

Kiểm tra mặc định của SDK, gateway và queue trước khi viết thêm vòng lặp. Một nơi nên quyết định số lần thử và thời gian còn lại; các tầng khác phối hợp thay vì tự nhân retry lên.

[AWS phân tích timeout, retry và backoff với jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/) và nhấn mạnh một điểm hay bị quên: **timeout không chứng minh tác dụng phụ chưa xảy ra**. Một lần gọi model bị ngắt vẫn có thể đã tính tiền; một tool gửi thông báo có thể đã gửi xong.

### Deadline cho toàn request

Timeout từng lần gọi là chưa đủ. Mỗi lần chờ 20 giây, thử ba lần, người dùng đợi gần một phút cộng backoff. Cần một deadline tổng bao gồm xếp hàng, retrieval, gọi model và chờ thử lại. Khi caller hủy, truyền tín hiệu hủy xuống mọi thao tác đang chạy.

```ts
async function requestWithBudget(url: string, payload: unknown, budgetMs = 12_000) {
  const deadline = performance.now() + budgetMs;

  for (let attempt = 0; attempt < 3; attempt++) {
    const remaining = Math.floor(deadline - performance.now());
    if (remaining <= 0) throw new Error('Deadline exceeded');

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(remaining),
    });

    if (response.ok) return await response.json();

    const retryable = [408, 429, 502, 503, 504].includes(response.status);
    await response.body?.cancel();
    if (!retryable || attempt === 2) {
      throw new Error(`Upstream HTTP ${response.status}`);
    }

    // Full jitter: chờ ngẫu nhiên trong khoảng tăng dần, có trần
    const delay = Math.floor(Math.random() * Math.min(2_000, 250 * 2 ** attempt));
    if (performance.now() + delay >= deadline) throw new Error('Retry budget exhausted');
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error('Attempts exhausted');
}
```

Hàm này chỉ dành cho thao tác đọc hoặc sinh kết quả chưa hiển thị. Trong ứng dụng thật, đọc header `Retry-After` (cả dạng giây lẫn ngày HTTP) và dừng nếu thời điểm thử lại vượt deadline; phân biệt 429 do giới hạn tốc độ với hết quota. Lỗi xác thực, payload sai hay model không hỗ trợ tính năng cần sửa cấu hình — gọi lại y hệt chỉ tốn thêm tiền.

### Streaming không thể phát lại âm thầm

Nếu người dùng đã thấy nửa câu trả lời, retry rồi nối phần mới vào phần cũ sẽ tạo nội dung lặp hoặc mâu thuẫn. Giao diện nên đánh dấu "bị gián đoạn" và cho tạo lại một lượt rõ ràng (xem phần xử lý lỗi trong [bài streaming Next.js](/ai-for-devs/tich-hop-ai-vao-nextjs-streaming)).

### Fallback phải giữ cùng hợp đồng

Model dự phòng phải đáp ứng cùng schema, ngôn ngữ, tool và chính sách dữ liệu. Đừng tự động đẩy tài liệu nội bộ sang một provider chưa được duyệt cho loại dữ liệu đó. Nếu model dự phòng chỉ làm được bản nháp, sản phẩm phải thể hiện trạng thái ấy.

Cuối cùng, giới hạn số request đồng thời và độ dài hàng đợi. Google SRE coi xử lý quá tải là một phần của độ tin cậy: khi hết ngân sách, trả về "thử lại sau" tốt hơn để mọi request treo rồi cùng thất bại.

## Phần 2 — Thao tác có tác dụng phụ: idempotency và workflow bền vững

[Vòng lặp tool calling](/ai-for-devs/ai-agent-dau-tien-function-calling) giải thích model chọn hành động ra sao. Để vận hành thật, còn phải trả lời: công việc tiếp tục thế nào sau lỗi, timeout, hay một lần chờ người duyệt kéo dài vài giờ? **Đừng áp hàm retry ở trên cho tool gửi/xóa/thanh toán.**

### Đưa tiến độ ra khỏi bộ nhớ process

Trạng thái quan trọng không được chỉ nằm trong biến JavaScript hay lịch sử chat. Lưu một bản ghi workflow có id, chủ sở hữu, phiên bản, trạng thái hiện tại và kết quả từng bước:

```text
created -> collecting -> drafted -> awaiting_approval
                                  -> rejected
awaiting_approval -> approved -> sending -> sent
                                        -> needs_reconciliation
```

Mỗi lần chuyển trạng thái cần điều kiện rõ. Worker chỉ nhận bước `approved -> sending` khi phiên bản còn khớp — dùng cập nhật có điều kiện hoặc khóa database để hai worker không cùng nhận một bước. Các framework như LangGraph có cơ chế checkpoint để khôi phục, nhưng checkpoint không tự biến một API bên ngoài thành "thực thi đúng một lần".

### Khóa idempotency đại diện cho một hành động

Khi dịch vụ đích hỗ trợ idempotency, gửi lại cùng khóa nghĩa là "hoàn tất hành động này", không phải "tạo hành động mới". Khóa gắn với một action đã lưu bền:

```ts
type ApprovedAction = {
  id: string;
  revision: number;
  recipient: string;
  subject: string;
  body: string;
  approvedPayloadHash: string;
};

function deliveryKey(action: ApprovedAction) {
  return `email:${action.id}:revision:${action.revision}`;
}
```

Action phải được lưu trước khi gọi API. Sửa nội dung thì tạo revision mới và duyệt lại; không tái dùng khóa cũ cho payload khác.

Nếu dịch vụ không hỗ trợ idempotency hay tra cứu trạng thái, timeout để lại kết quả **không xác định**. Chuyển sang đối soát thay vì đánh dấu thất bại rồi gửi tiếp — "không thấy phản hồi" không chứng minh email chưa gửi.

### Người duyệt phải duyệt đúng payload sắp chạy

Màn hình duyệt hiển thị người nhận, tiêu đề, nội dung và tác động. Khi bấm duyệt, server kiểm tra danh tính, quyền và revision; nội dung đổi sau đó thì phê duyệt cũ hết hiệu lực. Một câu "user đã đồng ý" trong output của model không phải chứng từ phê duyệt — lưu quyết định trong dữ liệu ứng dụng, gắn với payload cụ thể.

### Outbox nối database với worker

Trong cùng giao dịch lưu action đã duyệt, ghi thêm một bản ghi outbox. Worker đọc outbox rồi gọi dịch vụ gửi; worker chết thì bản ghi vẫn còn. Outbox có thể được giao nhiều lần, nên vẫn cần idempotency hoặc đối soát ở đích, cộng quy định hết hạn, hủy action và xử lý worker giữ lease quá lâu.

## Kiểm thử bằng cách cố ý làm hỏng

Những ca đáng chạy nhất không phải happy path:

- Provider trả 503 liên tục → request dừng đúng deadline, không vượt số lần thử.
- Crash ngay sau khi API gửi email thành công → lần chạy lại không gửi lần hai.
- Hai worker cùng nhận một job → chỉ một worker thực thi.
- Người dùng sửa nội dung sau khi duyệt → action cũ bị từ chối. Phần lớn nội dung bài này là kỷ luật backend quen thuộc mà mình áp dụng trong [các dự án fullstack](/#experience), chỉ là giờ có thêm LLM ở giữa.

Nếu hệ thống biết tiếp tục, từ chối hoặc yêu cầu đối soát trong từng trường hợp, bạn đã có nền vận hành đáng tin hơn hẳn một agent chỉ chạy trơn tru lúc demo. Bước tiếp theo là [tracing từng bước](/ai-for-devs/van-hanh-llm-tracing-version-rollout) để khi có sự cố còn biết nó dừng ở đâu.
