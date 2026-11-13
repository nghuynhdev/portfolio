---
title: "Evals: làm sao biết prompt và model của bạn đủ tốt"
seoTitle: "LLM evals: cách đánh giá chất lượng prompt và model"
slug: evals-do-chat-luong-llm
description: "'Thấy ổn' chưa đủ để lên production. Dựng bộ eval cho tính năng AI: tập test, cách chấm, LLM-as-judge và chạy eval trong CI."
keywords: "LLM evals, đánh giá AI, LLM as judge, test prompt, AI regression, AI cho developer"
tags: "AI, Evals, Testing, Developer"
date: 2025-06-17
cover: /images/blog/07-evals-do-chat-luong-llm-v2.webp
---

# Evals: làm sao biết prompt và model của bạn đủ tốt

Có một kiểu "test" mình thấy hầu như ai làm AI lúc đầu cũng dùng: gõ vài câu, thấy model trả lời xuôi tai, gật gù "ổn rồi", đẩy lên production. Vấn đề là "vài câu thấy ổn" không nói lên gì về mấy nghìn câu thật người dùng sẽ hỏi. Và tệ hơn: hôm sau bạn sửa một chữ trong prompt, 20% ca đang đúng bỗng sai, mà không ai hay cho tới khi khách phàn nàn.

Lời giải là **evals** — bộ đánh giá tự động cho tính năng AI. Nghĩ đơn giản: nó là unit test, nhưng cho thứ có đầu ra không cố định.

## Vì sao không test như code thường

Code thường: cùng input ra cùng output, `expect(x).toBe(y)`. LLM thì có yếu tố xác suất, cùng prompt có thể ra chữ khác nhau mà vẫn đúng ý. Nên eval không hỏi "có đúng từng chữ không", mà hỏi "có đạt tiêu chí không" trên **một tập đủ lớn và đa dạng**. Mục tiêu không phải 100% hoàn hảo, mà là một con số bạn theo dõi được: lần đổi này làm nó tốt lên hay tệ đi.

## Bước 1: dựng tập test

Đây là phần tốn công nhất và cũng giá trị nhất. Gom 30–100 ca gồm:
- Ca thường gặp (happy path).
- Ca biên, ca khó, ca mơ hồ.
- **Ca từng sai** — mỗi lần phát hiện model trả lời dở ngoài thực tế, thêm vào tập. Tập eval lớn dần theo bug, giống regression test.

Mỗi ca gồm input, và "đáp án đúng" hoặc tiêu chí đạt.

```ts
const cases = [
  { input: 'Đơn #123 bao giờ giao?', expect: { mustContain: ['#123'], mustNotHallucinateDate: true } },
  { input: 'Hủy đơn thế nào?', expect: { topic: 'cancellation' } },
  // ... thêm ca từ lỗi thực tế
];
```

## Bước 2: chọn cách chấm

Tùy loại output mà dùng cách khác nhau — thường phối hợp:

- **Khớp chính xác / enum.** Với việc phân loại hay trích xuất field, output có đáp án rõ ràng. Chấm `===` là xong, rẻ và chắc.
- **Assertion / quy tắc.** Kiểm các điều kiện: có chứa mã đơn không, có phải JSON hợp lệ không, độ dài trong khoảng không, có tránh được từ cấm không. Code thuần, nhanh, không tốn tiền.

```ts
function grade(output, e) {
  if (e.mustContain?.some((s) => !output.includes(s))) return 0;
  if (e.topic && classifyTopic(output) !== e.topic) return 0;
  return 1;
}
```

- **[LLM-as-judge](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests).** Với output tự do (câu trả lời, bản tóm tắt), dùng một model khác chấm theo rubric: "câu trả lời có bám ngữ cảnh không, có đúng trọng tâm không, cho điểm 1–5". Mạnh nhưng phải cẩn thận: cho judge tiêu chí thật rõ, và thỉnh thoảng đối chiếu điểm của judge với đánh giá của người để chắc nó không chấm tùy hứng.

```ts
const judgePrompt = `Chấm câu trả lời theo thang 1-5.
Tiêu chí: (1) chỉ dùng thông tin trong NGỮ CẢNH, (2) trả lời đúng câu hỏi, (3) không bịa.
Chỉ trả về số.
Ngữ cảnh: ${context}
Câu hỏi: ${q}
Trả lời: ${answer}`;
```

## Bước 3: chạy và đọc kết quả

Chạy toàn tập, in ra tỉ lệ đạt và — quan trọng — **danh sách ca trượt**. Con số tổng (ví dụ 86%) để theo dõi xu hướng; các ca trượt để biết cần sửa gì. Khi đổi prompt hay đổi model, chạy lại và so: tốt lên ở đâu, hỏng ra ở đâu. Nhiều lần bạn sẽ thấy một chỉnh sửa "rõ ràng là tốt hơn" lại kéo tụt vài ca khác — đó chính là thứ eval sinh ra để bắt.

## Bước 4: đưa vào CI

Khi bộ eval đã đáng tin, cho nó chạy trong CI mỗi lần sửa prompt, đổi model, hay nâng phiên bản SDK. Đặt ngưỡng: tỉ lệ đạt tụt dưới mức cho phép thì chặn merge. Từ đây bạn nâng cấp model hay nghịch prompt mà không nơm nớp, vì có lưới an toàn. Bước sau CI là [rollout có canary và trace](/ai-for-devs/van-hanh-llm-tracing-version-rollout) để kiểm tra trên traffic thật.

## Vài lưu ý thật

- **Bắt đầu nhỏ.** 20 ca chấm bằng assertion còn hơn mơ ước một hệ eval hoàn hảo rồi không làm gì. Thêm dần.
- **Đừng để judge tự sướng.** LLM-as-judge tiện nhưng có thiên lệch; ưu tiên assertion ở đâu có thể, chỉ dùng judge cho phần thật sự chủ quan.
- **Eval cũng tốn tiền và thời gian.** Giữ tập gọn, chạy đủ đại diện, không cần chạy nghìn ca mỗi commit.

Có evals rồi, câu hỏi "model mới ra có nên đổi không", "đổi prompt này an toàn chứ" không còn trả lời bằng cảm giác, mà bằng một con số. Đó là ranh giới giữa nghịch AI cho vui và đưa AI vào sản phẩm một cách chuyên nghiệp.

Bạn có thể xem thêm [nền tảng và kinh nghiệm của mình](/#overview) để biết các ví dụ trong bài đến từ đâu.
