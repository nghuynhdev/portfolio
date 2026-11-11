---
title: "Context engineering: cho AI nhớ đúng thứ, đúng lúc"
seoTitle: "Context engineering là gì? Quản lý context và memory cho AI"
slug: context-engineering-va-memory
description: "Quản lý context cho chatbot và agent: chia ngân sách token, tóm tắt lịch sử, giữ trạng thái công việc và lưu memory có nguồn, có hạn dùng."
keywords: "context engineering, AI memory, context window, conversation summary, AI agent, AI cho developer"
tags: "AI, Context, Memory, Developer"
date: 2026-04-21
---

# Context engineering: cho AI nhớ đúng thứ, đúng lúc

Một cuộc chat dài có thể chứa yêu cầu ban đầu, ba lần đổi ý, log lỗi cũ và một tool trả về hàng nghìn dòng. Gửi lại toàn bộ thì tốn; cắt những tin nhắn đầu thì có thể mất ràng buộc quan trọng. Vấn đề thực tế là chọn thông tin nào model cần cho bước tiếp theo.

Đó là cách mình nhìn **context engineering**: thiết kế dữ liệu đầu vào của từng lượt, bao gồm chỉ thị, trạng thái, lịch sử và bằng chứng. Prompt chỉ là một phần trong đó.

## Tách ba thứ thường bị gọi chung là memory

**Lịch sử hội thoại** ghi lại những gì đã nói. **Trạng thái công việc** ghi điều đang có hiệu lực: mục tiêu, quyết định đã chốt, bước đã làm và việc còn thiếu. **Memory lâu dài** là thông tin có thể dùng ở lần tương tác khác, chẳng hạn tùy chọn ngôn ngữ do người dùng chọn.

Chúng có thời hạn và độ tin cậy khác nhau. “Hôm nay tôi thử Python” không tự động trở thành “người này luôn dùng Python”. Một kết quả tool cách đây một tháng cũng không chứng minh trạng thái hệ thống hiện tại.

## Đặt ngân sách cho từng phần

Context window hữu hạn, và cách tính token còn phụ thuộc model, tool use cùng các chế độ xử lý. [Tài liệu context window của Claude](https://platform.claude.com/docs/en/build-with-claude/context-windows) là một ví dụ về những thành phần phải tính khi hội thoại dài lên. Với provider đang dùng, kiểm tra bộ đếm token và giới hạn tương ứng.

Có thể bắt đầu bằng bộ chia ngân sách độc lập sau:

```ts
function availableEvidenceTokens(input: {
  contextLimit: number;
  instructions: number;
  taskState: number;
  recentMessages: number;
  reservedOutput: number;
  safetyMargin: number;
}) {
  const available = input.contextLimit
    - input.instructions
    - input.taskState
    - input.recentMessages
    - input.reservedOutput
    - input.safetyMargin;

  if (available < 0) throw new Error('Context budget exceeded');
  return available;
}
```

Đầu vào là số token đã đo, không phải `string.length`. Các phần phụ như mô tả tool cũng phải được tính vào ngân sách phù hợp. Nếu phần bắt buộc đã quá lớn, nên dừng hoặc thu gọn có chủ đích thay vì âm thầm cắt bất kỳ thứ gì.

## Tóm tắt để tiếp tục công việc

Một bản tóm tắt tốt cần giữ “khách đã chọn phương án B và chưa cho phép gửi email”, chứ không chỉ ghi “đã trao đổi về các phương án”. Mẫu trạng thái có thể gồm mục tiêu, quyết định, ràng buộc, bước hoàn tất, câu hỏi đang chờ và id nguồn.

Tóm tắt do model viết vẫn có thể sai. Giữ lịch sử gốc trong kho được kiểm soát, kèm mốc tin nhắn mà bản tóm tắt bao phủ. Trạng thái có hậu quả như phê duyệt, số tiền và quyền truy cập nên lấy từ dữ liệu có cấu trúc của ứng dụng. Một câu tóm tắt không được tự tạo ra quyền hành động.

Khi thu gọn lịch sử, giữ nguyên các cặp tool call và tool result mà API yêu cầu. Cắt còn một nửa cặp có thể làm request không hợp lệ hoặc khiến model hiểu sai diễn biến.

## Memory cần nguồn và cách hết hiệu lực

Một bản ghi lâu dài nên có `userId`, phạm vi tenant, nội dung, nguồn, thời điểm tạo và hạn dùng nếu cần. Cho người dùng sửa hoặc xóa tùy chọn đã lưu. Nếu họ thay đổi ngôn ngữ mặc định, bản cũ cần bị thay thế rõ ràng, không để hai “sự thật” cạnh tranh nhau.

Đừng biến mọi câu trong tài liệu ngoài thành memory. Nội dung không tin cậy có thể chứa chỉ thị hoặc thông tin sai; lưu nó lâu dài chỉ làm [rủi ro injection](/ai-for-devs/bao-mat-ai-prompt-injection) tồn tại lâu hơn.

## Đo khả năng tiếp tục sau khi thu gọn

Thêm ca eval có hội thoại dài: người dùng đổi ý, hủy một bước, cung cấp một ràng buộc ở đầu rồi nhắc việc khác nhiều lượt. Sau khi tóm tắt, hỏi hệ thống phải làm gì tiếp và không được làm gì.

Nếu agent giữ được mục tiêu, quyết định và bằng chứng cần thiết sau khi bỏ bớt lịch sử, cơ chế context đang giúp ích. Nếu nó nhớ nhiều câu chữ nhưng làm sai bước tiếp theo, hãy sửa cách biểu diễn trạng thái trước khi tăng context window.

Những bài trong series đều viết từ góc nhìn [developer làm sản phẩm](/), ưu tiên thứ chạy được trên production.
