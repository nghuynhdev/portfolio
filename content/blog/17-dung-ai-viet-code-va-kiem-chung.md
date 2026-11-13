---
title: "Dùng AI viết code: giao việc rõ và kiểm chứng bằng hành vi"
seoTitle: "Dùng AI viết code: quy trình giao việc và kiểm chứng"
slug: dung-ai-viet-code-va-kiem-chung
description: "Dùng AI viết code mà vẫn kiểm chứng được: context vừa đủ, chia nhỏ thay đổi, review diff và viết test từ yêu cầu."
keywords: "AI coding assistant, AI viết code, code review, testing, developer workflow, AI cho developer"
tags: "AI, Coding, Testing, Developer"
date: 2026-06-28
cover: /images/blog/17-dung-ai-viet-code-va-kiem-chung-v2.webp
---

# Dùng AI viết code: giao việc rõ và kiểm chứng bằng hành vi

Một bản sửa dài 300 dòng có thể được sinh trong vài phút. Đọc xem nó có giữ đúng quyền truy cập, xử lý lỗi cũ và không đổi hành vi ngoài yêu cầu lại mất nhiều thời gian hơn. Tốc độ gõ code không phải thước đo đủ tốt cho tốc độ hoàn thành công việc.

Mình thích dùng AI như một cộng sự có thể đọc, đề xuất và sửa code, còn tiêu chí hoàn tất phải đến từ hành vi cần đạt. Quy trình này áp dụng được với nhiều coding assistant, không phụ thuộc tên model.

## Viết yêu cầu có ranh giới kiểm chứng

Thay vì “sửa API cho an toàn”, mô tả tình huống cụ thể: người dùng chỉ đọc được đơn của mình; id không tồn tại và id không có quyền đều không lộ dữ liệu; giữ định dạng response hiện tại.

Một đề bài hữu ích có bốn phần: hành vi trước/sau, file hoặc luồng liên quan, ràng buộc cần giữ và cách xác nhận. Nếu chưa biết nguyên nhân, yêu cầu đọc luồng trước khi sửa. Không cần bịa vị trí lỗi để prompt trông có vẻ chi tiết.

```text
Sửa endpoint đọc đơn hàng.

Yêu cầu:
- Dùng danh tính từ session phía server.
- Chỉ trả đơn thuộc người đang đăng nhập.
- Không nhận ownerId từ body/query làm căn cứ phân quyền.
- Giữ response hiện tại khi đọc được đơn.

Hãy kiểm tra route, lớp truy vấn và test liên quan,
rồi thực hiện thay đổi nhỏ nhất giải quyết đủ các trường hợp trên.
```

Đưa cả quy ước và lệnh kiểm tra thực sự tồn tại trong repo. AI có thể đề xuất một API hoặc script nghe hợp lý nhưng không có trong phiên bản bạn dùng.

## Cung cấp context có mục đích

Cho nó đọc route, service, schema và test sát luồng cần sửa. Nếu repo có hướng dẫn kiến trúc, chỉ rõ file đó. Nhồi nhiều file không liên quan có thể che khuất ràng buộc quan trọng.

Với thay đổi lớn, chia theo hành vi có thể kiểm tra: sửa phân quyền trước, thay đổi truy vấn sau nếu cần, rồi chỉnh UI tương ứng. Một diff gọn giúp người review nhận ra điều gì thực sự thay đổi.

## Test phải đứng về phía yêu cầu

Ví dụ logic phân quyền sau là hàm độc lập để minh họa. Trong ứng dụng, danh tính người gọi phải lấy từ session đã xác thực; repository phải thực thi cùng điều kiện quyền, không chỉ dựa vào việc ẩn nút trên UI.

```ts
import assert from 'node:assert/strict';

type Order = { id: string; ownerId: string };

function canReadOrder(userId: string | null, order: Order) {
  return userId !== null && order.ownerId === userId;
}

const order = { id: 'order-1', ownerId: 'alice' };

assert.equal(canReadOrder('alice', order), true);
assert.equal(canReadOrder('bob', order), false);
assert.equal(canReadOrder(null, order), false);
```

Ba assertion này chỉ kiểm tra hàm, chưa chứng minh endpoint an toàn. Cần kiểm tra tích hợp xác nhận route lấy đúng session và query không trả bản ghi trái quyền. Test chỉ mock service thành công sẽ bỏ qua chính phần có rủi ro.

Một câu hỏi tốt khi review test là: “Nếu bỏ điều kiện quyền khỏi code, test nào thất bại?” Nếu không có test nào, bộ test chưa giữ được yêu cầu quan trọng.

## Đọc diff trước khi tin báo cáo

Xem AI có thêm dependency, đổi lockfile, sửa cấu hình hoặc nới validation ngoài yêu cầu không. Từng thay đổi có thể hợp lý riêng lẻ nhưng làm phạm vi review phình ra.

Đối chiếu lệnh kiểm tra đã chạy với output thật. “Đã kiểm tra” cần phân biệt typecheck, unit test và chạy ứng dụng; chúng bắt các loại lỗi khác nhau. Nếu môi trường không chạy được một kiểm tra, ghi lại giới hạn đó thay vì coi nó đã qua.

## AI review là một nguồn gợi ý

AI có thể chỉ ra lỗi thật, bỏ sót lỗi hoặc báo nhầm. [Tài liệu responsible use của GitHub](https://github.com/github/docs/blob/main/content/copilot/responsible-use/agents.md) cũng nêu các giới hạn như bỏ sót vấn đề và đề xuất code sai hoặc không an toàn. Một lời nhận xét tự tin vẫn cần kiểm tra trên code và hành vi thực tế. Mình dùng AI viết code hằng ngày trong công việc [fullstack](/#overview), và quy trình dưới đây là thứ giúp mình vẫn tin được code mình merge.

Để đo hiệu quả, theo dõi thời gian từ lúc bắt đầu đến khi thay đổi được xác nhận, số vòng sửa và lỗi lọt sau merge. Khi đề bài, diff và bằng chứng kiểm tra đều rõ, AI giúp giảm nhiều công việc lặp mà vẫn để developer nắm được phần mình chuẩn bị đưa vào sản phẩm.
