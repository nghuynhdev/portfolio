---
title: "Skill, MCP, Connector, Plugin: vì sao cùng một AI mà người khác để nó tự làm việc?"
seoTitle: "Skill, MCP, Connector, Plugin khác nhau thế nào?"
slug: skill-mcp-connector-plugin-khac-nhau-the-nao
description: "Skill, MCP, Connector và Plugin khác nhau ra sao, ghép thế nào để Claude tự làm việc thay vì chờ bạn gõ từng lệnh."
keywords: "Claude skill, MCP, Claude connector, Claude Code plugin, AI agent, tự động hóa với AI"
tags: "AI, Claude Code, Skills, MCP"
date: 2026-11-12
updated: 2026-11-13
cover: /images/blog/27-skill-mcp-connector-plugin-v2.webp
---

# Skill, MCP, Connector, Plugin: vì sao cùng một AI mà người khác để nó tự làm việc?

Bạn và đồng nghiệp dùng cùng một model. Bạn vẫn copy số liệu vào khung chat, dán lại mẫu báo cáo, nhắc nó “nhớ gửi cho anh A”. Đồng nghiệp chỉ gõ “làm báo cáo tuần” rồi đi pha cà phê, quay lại thì bản nháp đã nằm trong hộp thư.

Model không khác nhau. Khác nhau ở những thứ được gắn quanh model. Bốn mảnh hay bị nhắc tới nhất là **Skill, MCP, Connector và Plugin**, và người mới thường gộp chúng làm một. Bài này tách từng mảnh, chỉ ra mảnh nào giải quyết vấn đề gì và nên bắt đầu từ đâu.

## Hình dung AI như một nhân viên mới

Một nhân viên mới có thể rất giỏi nhưng ngày đầu đi làm vẫn vướng hai chuyện:

1. **Chưa biết quy trình của công ty:** báo cáo theo mẫu nào, số liệu lấy ở đâu, gửi cho ai.
2. **Chưa có tài khoản vào phần mềm:** chưa mở được Gmail, Drive, Notion hay hệ thống CRM.

Bốn mảnh ghép dưới đây lần lượt xử lý hai chuyện đó, rồi gom lại để bạn không phải thiết lập từng thứ một.

| Mảnh | Vai trò trong ví dụ nhân viên mới | Giải quyết chuyện gì |
|---|---|---|
| Skill | Sổ tay quy trình | Biết **cách làm** một việc |
| MCP | Chuẩn cổng cắm chung (kiểu USB-C) | Quy ước để AI **nói chuyện với app** |
| Connector | Sợi dây đã cắm sẵn vào một app cụ thể | **Truy cập** Gmail, Drive, Notion… |
| Plugin | Bộ đồ nghề đóng gói sẵn | **Cài một lần** đủ cả quy trình lẫn kết nối |

## Skill: cuốn sổ tay quy trình

Skill là nơi bạn viết sẵn cách làm một việc lặp lại. Ví dụ báo cáo tuần: lấy số từ bảng nào, theo mẫu nào, viết giọng gì, gửi cho ai, kiểm tra gì trước khi gửi.

Có người nói skill chỉ là “prompt được bọc lại”. Câu đó đúng một nửa. Trong Claude, một skill là một thư mục có file `SKILL.md`, ngoài phần hướng dẫn còn có thể kèm **file mẫu, script và tài liệu tham khảo**. Điểm quan trọng hơn là cách nạp: lúc đầu Claude chỉ thấy tên và mô tả ngắn của skill, đến khi việc đang làm khớp với mô tả thì mới mở toàn bộ nội dung. Cài mười skill không có nghĩa là cả mười cuốn sổ tay bị nhồi vào mọi câu hỏi.

Một skill tối giản trong dự án Claude Code nằm ở `.claude/skills/bao-cao-tuan/SKILL.md`:

```markdown
---
name: bao-cao-tuan
description: Soạn báo cáo tuần cho team. Dùng khi người dùng nhắc tới báo cáo tuần hoặc weekly report.
---

1. Lấy số liệu tuần này từ file `data/weekly.csv`.
2. Điền vào mẫu `template.md` trong thư mục skill, giữ nguyên các mục.
3. Viết ngắn, mỗi mục tối đa ba gạch đầu dòng, nêu rõ số tăng/giảm so với tuần trước.
4. Trước khi trả kết quả, đối chiếu lại tổng số với file gốc.
```

Phần `description` quyết định khi nào skill được dùng, nên hãy viết nó như câu trả lời cho câu hỏi “khi nào cần mở sổ tay này?”. Cách viết và kiểm tra một skill riêng có trong [bài viết skill cho Claude Code](/ai-for-devs/viet-skill-rieng-cho-claude-code).

Nhưng sổ tay chỉ dạy cách làm. Nó không tự mở được Gmail. Muốn AI chạm vào app khác, bạn cần mảnh tiếp theo.

## MCP: chuẩn cổng cắm chung

**MCP ([Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro))** là giao thức mở quy định cách một ứng dụng AI kết nối tới công cụ và nguồn dữ liệu. So sánh với USB-C khá sát: nhà sản xuất chỉ cần làm cổng theo chuẩn, thiết bị nào hỗ trợ chuẩn đó cũng cắm được.

Trước MCP, mỗi ứng dụng AI phải tự viết tích hợp riêng cho từng công cụ. Có MCP, dịch vụ chỉ cần một **MCP server**, và mọi client hỗ trợ MCP (Claude, Claude Code, Cursor, VS Code…) đều dùng được. Server đó cung cấp cho AI các tool như “tìm email”, “đọc file”, “tạo trang Notion”.

MCP là **chuẩn**, không phải một sản phẩm bạn bấm cài. Phần giải thích kỹ hơn và ví dụ tự viết MCP server bằng TypeScript nằm trong [bài MCP là gì](/ai-for-devs/mcp-model-context-protocol-la-gi).

## Connector: sợi dây đã cắm sẵn

Nếu MCP là chuẩn cổng thì connector là sợi dây cụ thể, đã nối sẵn vào một app: Gmail, Google Drive, Google Calendar, Notion, GitHub… Phần lớn connector trong Claude thực chất là MCP server được đóng gói kèm bước đăng nhập, để người không viết code cũng dùng được.

Trên ứng dụng Claude, bạn vào mục **Connectors** trong phần cài đặt/tùy chỉnh (tên menu có thể đổi theo phiên bản), chọn dịch vụ, bấm **Connect** rồi đăng nhập. Sau đó hỏi “chiều mai mình có lịch gì?”, Claude sẽ tự gọi connector Calendar để xem thay vì bảo bạn dán lịch vào.

Trong Claude Code, việc tương đương là thêm một MCP server bằng lệnh terminal:

```bash
claude mcp add --transport http ten-dich-vu https://example.com/mcp
```

Hai lưu ý khi nối dây:

- **Connector mang quyền của tài khoản bạn.** Cho AI đọc Gmail cũng có nghĩa là nội dung email (kể cả email lạ) đi vào ngữ cảnh của nó. Đây chính là đường vào của [prompt injection](/ai-for-devs/bao-mat-ai-prompt-injection), nên chỉ bật đúng thứ cần và để ý những thao tác có quyền ghi hoặc gửi.
- **Chọn nguồn đáng tin.** Ưu tiên connector chính thức của dịch vụ hoặc thư mục connector của Claude, đọc kỹ quyền được yêu cầu trước khi bấm cho phép.

## Plugin: cả bộ đóng gói sẵn

Cài từng skill, nối từng connector, tự đặt lệnh tắt… làm vài lần thì mệt. Plugin gom những thứ đó thành một gói: skill, MCP server/connector, lệnh tắt (slash command), [subagent](https://code.claude.com/docs/en/sub-agents) và [hook](https://code.claude.com/docs/en/hooks). Cài một lần là có đủ.

Ví dụ một plugin cho đội bán hàng có thể gồm:

- Skill soạn email chào hàng theo giọng của công ty.
- Connector tới CRM để lấy danh sách khách và lịch sử trao đổi.
- Lệnh `/follow-up` để soạn email nhắc cho những khách chưa phản hồi sau 7 ngày.

Trong Claude Code, plugin được cài từ [marketplace](https://code.claude.com/docs/en/discover-plugins) bằng lệnh `/plugin` gõ ngay trong phiên làm việc. Như mọi gói cài đặt, plugin có thể chạy code và hook trên máy bạn, nên hãy xem repo nguồn trước khi cài. Cách chọn và kiểm tra nguồn được nói kỹ trong [bài chọn skill cho Claude Code](/ai-for-devs/chon-skill-cho-claude-code).

## Tóm lại trong bốn dòng

- **Skill** dạy AI *cách làm*.
- **MCP** là *chuẩn cắm* để AI nói chuyện với app.
- **Connector** là *sợi dây* nối vào một app cụ thể theo chuẩn đó.
- **Plugin** *gói tất cả* lại để cài một lần.

## Nên bắt đầu từ đâu?

1. **Viết skill trước.** Chọn một việc bạn làm mỗi tuần và đang phải nhắc lại cùng một hướng dẫn. Viết nó thành skill, chạy thử vài lần, sửa phần mô tả cho tới khi Claude tự nhận ra lúc cần dùng.
2. **Nối connector sau.** Khi skill đã chạy ổn với dữ liệu bạn dán vào, mới nối connector để Claude tự lấy dữ liệu. Bắt đầu với quyền chỉ đọc nếu được.
3. **Cài plugin khi cần cả bộ.** Nếu đã có plugin làm đúng việc bạn cần, cài nó thay vì tự ghép. Nếu không, chính skill và connector bạn đã thử là nguyên liệu để sau này đóng thành plugin cho cả team.

## Đủ bốn mảnh vẫn chưa phải là xong

Video và bài viết dạng “bốn mảnh ghép” thường dừng ở đây. Theo kinh nghiệm dùng Claude Code hằng ngày của mình, còn ba thứ quyết định AI có thật sự làm thay bạn hay không:

- **Ngữ cảnh dự án.** Những quy ước luôn đúng (dùng thư viện nào, chạy lệnh test nào, viết bằng ngôn ngữ gì) nên nằm trong [CLAUDE.md và rules](/ai-for-devs/claude-md-va-rules-cho-du-an), không nhét vào skill.
- **Quyền thực thi.** Skill hay connector đều không tự cấp quyền chạy lệnh hoặc gửi email. Bạn quyết định qua chế độ quyền: việc chỉ đọc có thể để AI tự làm, việc gửi đi, xóa hay trả tiền thì nên để nó hỏi lại.
- **Cách kiểm chứng.** AI “làm xong” chưa chắc đã làm đúng. Quy trình tốt luôn có bước kiểm tra: chạy test, mở [trình duyệt thật để thử](/ai-for-devs/webapp-testing-playwright-claude-code), đối chiếu số liệu với nguồn.

Ví dụ thật từ chính repo của [portfolio này](/#overview): một buổi làm việc với Claude Code gồm chuyển avatar sang WebP và nén lại các ảnh nặng, bỏ breadcrumb thừa ở trang AI for Devs, rồi chỉnh khoảng cách trên mobile. Mình không phải tự gõ lệnh nén cho từng ảnh. Claude tự chạy công cụ nén, mở trang trong trình duyệt tích hợp, thu nhỏ khung xuống cỡ điện thoại để chụp màn hình kiểm tra, sau đó mới commit. Mình chỉ cần nói việc muốn làm và duyệt kết quả cuối. Không có mảnh nào thần kỳ cả, chỉ là các mảnh được ghép đúng chỗ.

Bài viết thuộc series AI for Devs của Nguyễn Huỳnh, fullstack developer dùng Claude Code mỗi ngày cho cả công việc lẫn blog này.
