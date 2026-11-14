---
title: "CLAUDE.md và rules: để Claude hiểu quy ước dự án mà không phải nhắc lại"
seoTitle: "CLAUDE.md là gì? Cách viết rules cho Claude Code"
slug: claude-md-va-rules-cho-du-an
description: "Viết CLAUDE.md và rules cho dự án: giữ CLAUDE.md ngắn, chia rules theo phạm vi, ghi lệnh kiểm tra thật và giữ context gọn."
keywords: "CLAUDE.md, Claude Code rules, project instructions, AI context, Claude workflow"
tags: "AI, Claude Code, Context, Developer"
date: 2026-10-01
updated: 2026-11-13
cover: /images/blog/24-claude-md-va-rules-cho-du-an-v2.webp
---

# CLAUDE.md và rules: để Claude hiểu quy ước dự án mà không phải nhắc lại

**CLAUDE.md là file Markdown đặt trong repo, chứa hướng dẫn dự án mà Claude Code tự đọc khi bắt đầu phiên làm việc: quy ước code, lệnh build và test, cấu trúc thư mục.** Rules là các file hướng dẫn chia nhỏ theo chủ đề hoặc theo đường dẫn, dùng khi một file CLAUDE.md không còn đủ gọn.

Bạn muốn Claude dùng component đã có nhưng nó cứ tạo một nút mới. Bạn muốn giữ nội dung tiếng Việt nhưng mỗi lần làm trang lại xuất hiện placeholder tiếng Anh. Những thông tin ổn định đó nên có nơi lưu chung, thay vì dựa vào việc nhớ nhắc trong từng prompt.

[Tài liệu memory của Claude Code](https://code.claude.com/docs/en/memory) mô tả cách các file này được tải và sự khác biệt với auto memory.

## Ghi điều repo thật sự cần

Một bản hướng dẫn hữu ích cho repo blog có thể như sau. Đây là mẫu cần điều chỉnh, không phải cấu hình đã được cài vào dự án của bạn:

```markdown
Quy ước dự án

- Nội dung blog nằm trong content/blog; mỗi bài có slug duy nhất.
- Nội dung viết bằng tiếng Việt, giữ tên API và identifier trong code.
- Tái dùng component và design token hiện có trước khi tạo mới.
- Với thay đổi nội dung, kiểm tra frontmatter và liên kết nội bộ.
- Khi sửa code, đọc scripts trong package.json để chọn lệnh kiểm tra.
- Báo riêng phần đã xác minh và phần chưa chạy được.
```

Các dòng này trả lời những câu hỏi thường xuất hiện lúc làm việc. “Viết code thật tốt” hay “luôn là chuyên gia” không chỉ ra quyết định cụ thể, nên khó kiểm tra xem có giúp ích hay không.

## Lệnh kiểm tra phải tồn tại

Nếu hướng dẫn ghi `npm test` nhưng repo không có script đó, agent sẽ liên tục đi vào ngõ cụt. Xem scripts thực tế, môi trường cần thiết và giới hạn của từng kiểm tra.

Với thay đổi bài viết, kiểm tra parser và liên kết có thể đủ cho phần nội dung. Với sửa routing, cần kiểm tra đường đi tương ứng. Không dùng một lệnh duy nhất như bằng chứng cho mọi loại thay đổi.

Khi đổi package manager hay framework, cập nhật hướng dẫn trong cùng thay đổi. File mô tả repo cũ đôi khi gây hại hơn việc chưa có hướng dẫn vì nó khiến lựa chọn sai trông có vẻ đã được xác nhận.

## Chia rules theo công việc liên quan

Theo tài liệu chính thức, `.claude/rules/` hỗ trợ chia nội dung và dùng `paths` để áp theo nhóm file. Ví dụ rule cho bài blog:

```yaml
---
paths:
  - "content/blog/**/*.md"
---
```

Bên dưới frontmatter, viết các quy tắc như metadata bắt buộc, cách dùng link nội bộ và yêu cầu ghi nguồn cho thông tin thay đổi theo thời gian. Đừng cho cùng rule này chịu trách nhiệm cả database migration và thiết kế button.

Kiểm tra cách tải rules trên phiên bản Claude Code đang dùng. Nếu repo dùng nhiều loại file hướng dẫn, đọc cơ chế ưu tiên hiện hành và giữ nội dung nhất quán; không mặc định mọi tên file đều được mọi agent đọc giống nhau.

## Tách hướng dẫn bền vững khỏi dữ liệu của một việc

“Tất cả bài blog có frontmatter” là quy ước bền vững. “Hôm nay viết thêm bài số 31” là yêu cầu tác vụ. “Chúng ta đang chờ khách xác nhận tên sản phẩm” là trạng thái công việc.

Nếu đưa cả ba vào file gốc mà không quản lý vòng đời, sau vài tháng Claude có thể đọc các yêu cầu đã hết hiệu lực như quy tắc hiện tại. Giữ brief đang làm ở nơi rõ phạm vi, rồi dọn khi xong.

## Nội dung hướng dẫn không phải cơ chế phân quyền

Một câu “không được đọc bí mật” là chỉ thị, không thay thế quyền filesystem, [quyền tool](https://code.claude.com/docs/en/permissions) hay cấu hình runtime. Không đưa token và mật khẩu vào `CLAUDE.md` để agent “biết mà tránh dùng”. Dùng cơ chế quản lý bí mật của ứng dụng.

Vì vậy thêm câu “bỏ qua mọi giới hạn” vào `CLAUDE.md` cũng không “jailbreak” được gì; mình phân tích kỹ trong bài [Jailbreak Claude và giới hạn của CLAUDE.md](/ai-for-devs/jailbreak-claude-va-gioi-han-claude-md).

Tương tự, file hướng dẫn không chứng minh code đã tuân thủ mọi quy tắc. Vẫn cần kiểm tra hành vi và đọc diff, nhất là nơi có dữ liệu hoặc tác dụng phụ.

## Khi nào chuyển sang skill?

Nếu nội dung là một quy trình chỉ dùng khi audit SEO, review blog hoặc kiểm thử giao diện, [skill](/ai-for-devs/chon-skill-cho-claude-code) là chỗ phù hợp hơn để đóng gói. Giữ phần luôn đúng ngắn và dễ tìm; chuyển hướng dẫn dài theo tác vụ sang tài liệu chuyên biệt. Có thể bắt đầu bằng [một skill review blog nhỏ](/ai-for-devs/viet-skill-rieng-cho-claude-code) rồi đánh giá trên vài bài thật.

Mẫu quy ước ở đầu bài được viết cho một repo blog kiểu [portfolio của mình](/): nội dung Markdown nằm cạnh ứng dụng Next.js.
