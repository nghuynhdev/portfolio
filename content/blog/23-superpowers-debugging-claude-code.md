---
title: "Superpowers cho Claude Code: debug có giả thuyết, sửa có bằng chứng"
seoTitle: "Superpowers Claude Code: debug có hệ thống bằng AI"
slug: superpowers-debugging-claude-code
description: "Debug với bộ skill Superpowers trong Claude Code: tái hiện lỗi, kiểm chứng giả thuyết và tránh sửa lan theo phỏng đoán."
keywords: "Superpowers Claude Code, obra superpowers, systematic debugging, verification before completion, AI debugging"
tags: "AI, Claude Code, Skills, Debugging"
date: 2026-10-08
cover: /images/blog/23-superpowers-debugging-claude-code-v2.webp
---

# Superpowers cho Claude Code: debug có giả thuyết, sửa có bằng chứng

Một lỗi tìm kiếm xuất hiện sau vài lần đổi bộ lọc. Claude sửa debounce, lỗi vẫn còn; tiếp tục đổi state, thêm timeout và cuối cùng component phức tạp hơn nhưng nguyên nhân vẫn chưa rõ. Khi ấy vấn đề cần cải thiện là cách điều tra.

**Superpowers** của `obra` là bộ skill và quy trình phát triển phần mềm cho coding agent. [Repo gốc](https://github.com/obra/superpowers) có hướng dẫn cài cho Claude Code. Trong bài này, mình tập trung vào hai phần: điều tra có hệ thống và xác minh trước khi kết luận.

## Cài bộ quy trình theo hướng dẫn gốc

Một cách cài được README công bố là marketplace của dự án. Nhập trong Claude Code:

```text
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

Kiểm tra bản cài và mô tả workflow trước khi dùng. Một bộ quy trình đầy đủ có thể thêm bước lập kế hoạch, chia việc và review; với việc nhỏ, bạn vẫn cần nói rõ phạm vi và đầu ra mong muốn. Không cài nhiều phiên bản song song mà không biết quy tắc nào đang được tải.

## Yêu cầu điều tra trước khi thử sửa

Skill [systematic-debugging](https://github.com/obra/superpowers/tree/main/skills/systematic-debugging) nhấn mạnh tìm nguyên nhân gốc qua đọc lỗi, tái hiện và kiểm tra bằng chứng. Để áp vào lỗi tìm kiếm, đề bài có thể là:

```text
Điều tra lỗi kết quả tìm kiếm nhảy về từ khóa cũ.
Các bước: nhập "react", rồi ngay lập tức thay bằng "rag".
Mong đợi: chỉ kết quả của truy vấn mới nhất được hiển thị.
Hãy tái hiện, nêu giả thuyết và kiểm tra từng giả thuyết.
Trước khi đổi code, chỉ ra bằng chứng vị trí gây sai.
Giữ API và giao diện hiện tại.
```

Đây là kịch bản minh họa. Trong repo thật, cần xác nhận UI, request và dữ liệu trước khi gán nguyên nhân.

## Một giả thuyết cần phép thử phân biệt

Giả sử request cho “react” trả về sau request cho “rag”. Có thể response cũ đang ghi đè state mới. Nhưng cũng có thể cache trả sai khóa hoặc URL đồng bộ trễ. Mỗi nguyên nhân đòi hỏi một phép thử khác nhau.

Ghi sequence id, query và thời điểm hoàn tất trong môi trường dev, rồi cố ý tạo độ trễ khác nhau với dữ liệu test. Quan sát response nào cập nhật UI. Không log nội dung nhạy cảm chỉ để có nhiều dữ liệu hơn.

Nếu xác nhận race condition, các hướng sửa có thể gồm hủy request cũ hoặc chỉ áp response còn tương ứng truy vấn hiện tại. Chọn theo thư viện đang dùng và kiểm tra cả trường hợp API không dừng xử lý dù client đã abort.

## Giữ một thay đổi trả lời một nguyên nhân

Đừng đồng thời thay thư viện fetch, đổi component và thêm cache chỉ để sửa một race condition. Một diff có phạm vi rõ giúp bạn biết hành vi thay đổi do đâu và dễ quay lại nếu giả thuyết sai.

Test hồi quy nên tạo điều kiện response cũ về sau rồi xác nhận UI giữ kết quả mới. Nếu test chỉ kiểm tra request trả 200, nó chưa bảo vệ triệu chứng người dùng gặp.

## Đọc output trước khi nói đã sửa

Skill verification-before-completion yêu cầu bằng chứng kiểm tra trước khẳng định hoàn tất. Với ví dụ này, bằng chứng cần gồm tái hiện ban đầu và kịch bản sau sửa; typecheck không tự chứng minh thứ tự response đã đúng.

Ghi rõ lệnh hoặc hành trình đã chạy, kết quả và phần chưa kiểm tra. Nếu browser không khởi chạy được, bạn có thể xác nhận test logic đã qua nhưng chưa được nói đã xác nhận tương tác thật.

## Dùng quy trình đúng mức

Không phải thay một câu chữ cũng cần một dự án điều tra lớn. Mình dùng workflow này khi lỗi có nhiều nguyên nhân khả dĩ, tái hiện khó hoặc các lần thử sửa trước đã thất bại. Mục tiêu là giảm sửa đoán và giữ [bằng chứng hành vi](/ai-for-devs/dung-ai-viet-code-va-kiem-chung), không làm báo cáo dài hơn cho mọi công việc.

Có lỗi khó muốn trao đổi? [Liên hệ mình](/#contact) — mình thích những ca debug kiểu này.
