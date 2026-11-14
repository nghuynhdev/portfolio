---
title: "Làm UI với Claude Code: UI UX Pro Max, frontend-design và Web Design Guidelines"
seoTitle: "Làm UI với Claude Code: UI UX Pro Max và frontend-design"
slug: lam-ui-voi-claude-code-skills
description: "Làm UI với Claude Code bằng 3 skill: UI UX Pro Max chốt design system, frontend-design tạo hướng thị giác, guidelines để review."
keywords: "UI UX Pro Max, frontend-design skill, web-design-guidelines, Claude Code UI, Anthropic skills, Vercel skills, AI thiết kế giao diện, UI review"
tags: "AI, Claude Code, Skills, UI UX"
date: 2026-07-23
updated: 2026-11-13
cover: /images/blog/19-lam-ui-voi-claude-code-skills-v2.webp
---

# Làm UI với Claude Code: UI UX Pro Max, frontend-design và Web Design Guidelines

"Làm trang này đẹp hơn" để lại quá nhiều khoảng trống cho AI tự chọn. Cùng một đề bài, Claude có thể đổi font, thêm gradient, chế thêm một kiểu card và làm trang lệch hẳn hệ thống đang có. Ngược lại, một trang có đủ hero, ba card và nút CTA vẫn có thể không nói được sản phẩm khác gì sản phẩm khác. Và một nút chỉ có icon trông rất gọn trong screenshot, nhưng người dùng bàn phím hay trình đọc màn hình không biết nó làm gì.

Ba vấn đề đó tương ứng ba bước của một quy trình làm UI, và mỗi bước có một skill hợp:

| Bước | Câu hỏi | Skill |
|---|---|---|
| 1. Định hướng | Màu, chữ, khoảng cách, component dùng thế nào cho nhất quán? | **UI UX Pro Max** |
| 2. Triển khai | Trang này cần điểm nhấn gì để có bản sắc? | **frontend-design** (Anthropic) |
| 3. Review | Giao diện có lỗi tương tác, accessibility hay trạng thái nào bị bỏ sót? | **Web Design Guidelines** (Vercel) |

Dùng cả ba theo thứ tự, mỗi bước có đầu ra riêng: quyết định thiết kế, giao diện, và danh sách vấn đề có bằng chứng. Nếu chưa rõ skill khác plugin và MCP thế nào, đọc trước bài [chọn skill cho Claude Code](/ai-for-devs/chon-skill-cho-claude-code).

## Bước 1 — UI UX Pro Max: chốt design system trước khi vẽ

**UI UX Pro Max** của `nextlevelbuilder` cung cấp hướng dẫn thiết kế kèm dữ liệu tra cứu về phong cách, bảng màu, typography và UX. Đây là skill cộng đồng; [repo gốc](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) là nơi kiểm tra hướng dẫn cài và bản cập nhật. Theo README, nhập trong phiên Claude Code (không phải terminal):

```text
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

Một số thao tác tra cứu của skill dùng Python — cài plugin không có nghĩa máy đã có đủ runtime. Thiếu công cụ thì xử lý theo thông báo, đừng để Claude bỏ qua bước rồi vẫn báo đã áp dụng đầy đủ.

Brief tốt có chủ thể, người dùng và việc chính:

```text
Dùng UI UX Pro Max để cải thiện trang quản lý bài viết.
Người dùng: người viết blog cá nhân, chủ yếu thao tác trên laptop.
Việc chính: tìm bài, xem trạng thái và mở bản nháp để sửa.
Giữ logo, màu thương hiệu và component thư viện hiện có.
Nội dung tiếng Việt, có tiêu đề dài và bài chưa có ảnh.
Trước khi sửa, nêu hướng typography, spacing, màu và phân cấp thông tin.
Kiểm tra cả mobile, empty state, loading và lỗi tải dữ liệu.
```

Đừng chỉ nhận một ảnh chụp đẹp. Yêu cầu ghi thành **quy tắc dùng lại được**: cỡ chữ, khoảng cách, màu semantic, nút chính/phụ, trạng thái focus. Repo đã có design token thì ánh xạ vào đó trước khi tạo token mới. Gợi ý trong `SKILL.md` của dự án là đầu vào tham khảo; quyết định cuối vẫn phải hợp brand và nội dung.

## Bước 2 — frontend-design: tạo điểm nhấn có chủ đích

Skill **frontend-design** trong repo `anthropics/skills` tập trung vào hướng thị giác, typography và quyết định thiết kế có chủ đích — hợp khi xây UI mới hoặc làm lại diện mạo. Cài bằng Skills CLI trong terminal:

```bash
npx skills add anthropics/skills --skill frontend-design -a claude-code
```

Brief cần nói người xem đang cố đánh giá điều gì. Với một portfolio developer, khu dự án thường đáng được ưu tiên hơn một đoạn tự giới thiệu chung chung:

```text
Dùng frontend-design để thiết kế trang giới thiệu một dự án mã nguồn mở.
Người đọc là developer muốn biết dự án làm gì và có nên thử không.
Nội dung có sẵn: mô tả ngắn, ví dụ sử dụng, ba giới hạn và link repo.
Ưu tiên ví dụ chạy được cùng hướng dẫn bắt đầu.
Giữ logo, màu thương hiệu và các token đã chốt ở bước trước; dùng tiếng Việt.
```

Chọn **một** điểm nhấn phục vụ nội dung: thư viện xử lý ảnh mở bằng tương tác trước/sau, công cụ CLI mở bằng lệnh mẫu và output, blog kỹ thuật cho thấy bài nổi bật cùng lộ trình đọc. Không phải trang nào cũng cần khác lạ — trang đăng nhập cần rõ và quen. Yêu cầu Claude giải thích điểm nhấn giúp người đọc hiểu hay quyết định điều gì; nếu không trả lời được, bỏ nó.

Hai lưu ý khi dùng chung với bước 1: giữ các token đã chốt làm ràng buộc, đừng để mỗi skill tự quyết một bảng màu; và không để AI tự chế testimonial, số liệu hay ảnh sản phẩm cho đủ bố cục.

## Bước 3 — Web Design Guidelines: review có bằng chứng

Skill **web-design-guidelines** của Vercel review UI code theo [Web Interface Guidelines](https://vercel.com/design/guidelines). Nguồn ở `vercel-labs/agent-skills`:

```bash
npx skills add vercel-labs/agent-skills --skill web-design-guidelines -a claude-code
```

Giao từng màn hình hoặc nhóm component, đừng "audit toàn bộ app" ngay lượt đầu:

```text
Dùng web-design-guidelines review trang đăng ký và component của nó.
Chưa sửa code ở lượt đầu.
Ưu tiên vấn đề làm người dùng không hoàn tất được đăng ký.
Mỗi phát hiện cần file/dòng, tình huống xảy ra, bằng chứng và cách kiểm tra.
Tách nhận xét về sở thích thị giác khỏi lỗi hành vi.
```

Một phát hiện hữu ích trông như: "Nút xóa không có tên truy cập; khi liệt kê các nút, người dùng không biết nó xóa mục nào; thêm nhãn gắn với tên mục và kiểm tra lại bằng [accessibility tree](https://developer.mozilla.org/en-US/docs/Glossary/Accessibility_tree)." Còn "UX chưa tốt, hãy làm hiện đại hơn" thì không chỉ ra lỗi lẫn tiêu chí hoàn tất.

Yêu cầu Claude ghi rõ phát hiện nào đến từ đọc source, phát hiện nào đã tái hiện trên trình duyệt. Code cho biết có dùng `button`, có nhãn, có xử lý lỗi; trình duyệt mới cho biết nút có bị lớp khác che, text có tràn, focus có mất sau render. Một lần review cũng không phải chứng nhận đạt toàn bộ tiêu chuẩn accessibility.

## Kiểm bằng nội dung khó và trạng thái thật

Dù dùng skill nào, bản đầu tiên nên chạy với dữ liệu "xấu" chứ không phải placeholder ngắn:

- Tiêu đề tiếng Việt dài hai dòng, tên tác giả dài, nhiều tag, bài chưa có ảnh, ảnh có tỉ lệ lạ.
- Form: dữ liệu sai, đang gửi, server lỗi, gửi thành công, bấm gửi hai lần.
- Modal và menu: mở/đóng bằng bàn phím, focus quay về đúng chỗ, trạng thái không chỉ dựa vào màu.
- Animation: bật reduced motion, nội dung vẫn đọc được khi hiệu ứng không chạy.

Cuối cùng, nhờ một người thật mở trang và làm việc chính trong vài thao tác. Nếu họ thấy đẹp nhưng không biết bấm đâu, cần sửa phân cấp thông tin chứ không phải thêm hiệu ứng. Để lưu bằng chứng hành vi và chạy lại sau mỗi thay đổi, ghép thêm [webapp-testing với Playwright](/ai-for-devs/webapp-testing-playwright-claude-code); khi trang chậm, chuyển sang [React Best Practices](/ai-for-devs/react-best-practices-skill-claude-code).

Bạn có thể xem [trang portfolio của mình](/) như một ví dụ về giao diện dark theme nhất quán giữa trang giới thiệu và blog.
