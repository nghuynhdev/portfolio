# Series blog: AI cho Developer

26 bài chia sẻ kiến thức AI dưới góc nhìn fullstack JS/TS. Mỗi file là một bài, có frontmatter (title, slug, description, keywords, tags, date, updated tuỳ chọn, cover tuỳ chọn) và thân bài Markdown, được route `/ai-for-devs` đọc tự động. Bài 1–10 xây nền tảng; bài 11–17 đi sâu vào dữ liệu và vận hành sản phẩm AI; bài 18–25 hướng dẫn dùng skill và tổ chức công việc với Claude Code; bài 26 phân tích jailbreak và ranh giới chỉ thị/quyền thực thi.

Cả 26 bài đã có bản tiếng Anh trong `en/` (dịch ngày 11/11/2026). Bản tiếng Anh nằm trong `en/`, cùng số thứ tự với bài gốc (ví dụ `en/01-how-llms-work-for-developers.md` ↔ `01-llm-hoat-dong-the-nao.md`), có slug tiếng Anh riêng và hiển thị ở `/en/ai-for-devs/<slug>`. Hai bản được ghép theo số thứ tự để sinh hreflang, sitemap và nút đổi ngôn ngữ; ảnh bìa dùng chung theo tên file tiếng Việt. Trong bài tiếng Anh, link nội bộ vẫn viết bằng URL tiếng Việt (`/ai-for-devs/<slug-vi>`); khi bài đích đã có bản tiếng Anh, link tự trỏ sang bản đó. Anchor `#...` lấy theo tiêu đề nên khác nhau giữa hai ngôn ngữ: bài tiếng Anh phải dùng anchor tiếng Anh (ví dụ bảng trong `en/18` trỏ vào các bước của bài 19). Khi sửa bài gốc, cập nhật bản dịch tương ứng.

Quy ước link nội bộ: mỗi bài có ít nhất một link về trang chủ (`/` hoặc `/#experience`, `/#skills`, `/#overview`, `/#contact`) với anchor text tự nhiên, khác nhau giữa các bài. Khi gộp hoặc đổi slug, thêm redirect 301 trong `next.config.ts`.

| # | Tiêu đề | File |
|---|---------|------|
| 1 | LLM hoạt động thế nào? Giải thích kiểu dev, bỏ qua mấy thứ huyền bí | `01-llm-hoat-dong-the-nao.md` |
| 2 | Prompt engineering thực chiến cho developer (không phải trò 'thần chú') | `02-prompt-engineering-thuc-chien.md` |
| 3 | Tích hợp AI vào app Next.js: làm luồng chat streaming cho tử tế | `03-tich-hop-ai-vao-nextjs-streaming.md` |
| 4 | RAG từ A–Z cho dev JS/TS: cho LLM 'đọc' tài liệu của bạn | `04-rag-tu-a-z-cho-dev-js.md` |
| 5 | Xây dựng AI Agent đầu tiên: hiểu function/tool calling cho đúng | `05-ai-agent-dau-tien-function-calling.md` |
| 6 | Giảm chi phí và độ trễ khi gọi LLM trong production | `06-giam-chi-phi-do-tre-llm-production.md` |
| 7 | Evals: làm sao biết prompt và model của bạn đủ tốt | `07-evals-do-chat-luong-llm.md` |
| 8 | Chạy LLM local với Ollama: khi nào nên, khi nào đừng | `08-chay-llm-local-voi-ollama.md` |
| 9 | Bảo mật khi đưa AI vào sản phẩm: prompt injection và rò rỉ dữ liệu | `09-bao-mat-ai-prompt-injection.md` |
| 10 | MCP (Model Context Protocol) là gì và vì sao dev nên quan tâm | `10-mcp-model-context-protocol.md` |
| 11 | RAG production: từ đưa tài liệu vào index đến hybrid search và rerank | `11-rag-production-ingestion-hybrid-search.md` |
| 12 | Context engineering: cho AI nhớ đúng thứ, đúng lúc | `12-context-engineering-va-memory.md` |
| 13 | Độ tin cậy cho LLM: timeout, retry, fallback và idempotency | `13-do-tin-cay-llm-timeout-retry-idempotency.md` |
| 14 | Vận hành LLM trong production: tracing, phiên bản và rollout an toàn | `14-van-hanh-llm-tracing-version-rollout.md` |
| 15 | AI đọc ảnh và PDF: trích xuất dữ liệu sao cho kiểm chứng được | `15-multimodal-ai-doc-anh-va-pdf.md` |
| 16 | Khi nào nên fine-tune LLM? Bắt đầu từ lỗi, đừng bắt đầu từ GPU | `16-khi-nao-nen-fine-tune-llm.md` |
| 17 | Dùng AI viết code: giao việc rõ và kiểm chứng bằng hành vi | `17-dung-ai-viet-code-va-kiem-chung.md` |
| 18 | Chọn skill cho Claude Code: cài đúng việc, dùng đúng lúc | `18-chon-skill-cho-claude-code.md` |
| 19 | Làm UI với Claude Code: UI UX Pro Max, frontend-design và Web Design Guidelines | `19-lam-ui-voi-claude-code-skills.md` |
| 20 | Claude SEO: audit blog bằng Claude Code và biến báo cáo thành việc cần sửa | `20-claude-seo-audit-website.md` |
| 21 | React Best Practices: dùng Claude tối ưu đúng nút thắt | `21-react-best-practices-skill-claude-code.md` |
| 22 | webapp-testing: để Claude kiểm tra web bằng trình duyệt thật | `22-webapp-testing-playwright-claude-code.md` |
| 23 | Superpowers cho Claude Code: debug có giả thuyết, sửa có bằng chứng | `23-superpowers-debugging-claude-code.md` |
| 24 | CLAUDE.md và rules: để Claude hiểu quy ước dự án mà không phải nhắc lại | `24-claude-md-va-rules-cho-du-an.md` |
| 25 | Viết skill riêng cho Claude Code: bắt đầu bằng quy trình review blog | `25-viet-skill-rieng-cho-claude-code.md` |
| 26 | Jailbreak Claude: một file CLAUDE.md có thật sự 'mở khóa' được AI? | `26-jailbreak-claude-va-gioi-han-claude-md.md` |

Các bài mới có liên kết nội bộ bằng slug và nguồn tham khảo chính thức đặt cạnh phần giải thích liên quan. Ví dụ độc lập hoặc phần cần hạ tầng bổ sung được ghi rõ trong bài.

Gợi ý đọc tiếp theo nhu cầu:

- Cải thiện RAG: bài 4 → 11, kết hợp bài 7 để đo chất lượng.
- Xây agent có trạng thái: bài 5 → 12 → 13, kèm bài 9 về bảo mật.
- Vận hành production: bài 6 → 13 → 14.
- Xử lý tài liệu và thích nghi model: bài 15 → 16.
- Dùng AI trong công việc lập trình: bài 2 → 17.
- Chọn và dùng skill trong Claude Code: bài 18 → 24 → 25.
- Thiết kế và kiểm tra frontend với Claude: bài 19 → 22; bài 21 cho hiệu năng React/Next.js.
- Audit SEO cho blog/portfolio bằng Claude SEO: bài 20.
- Điều tra lỗi với quy trình Superpowers: bài 23, kết hợp bài 17 và 22 để xác minh.
- Hiểu jailbreak và phân biệt chỉ thị với quyền thực thi trong Claude Code: bài 24 → 26, kèm bài 9 về prompt injection.

Các bài 18–25 được đối chiếu tài liệu và repo nguồn ngày 11/11/2026. Lệnh cài nằm trong bài để người đọc tham khảo; việc viết bài không cài plugin/skill vào repo hoặc tài khoản. Mẫu `CLAUDE.md`, rules và `SKILL.md` chỉ là ví dụ trong Markdown. Cả 26 bài có ảnh bìa WebP riêng trong `public/images/blog/`, trùng tên file Markdown. Ảnh minh họa cơ chế chính của bài, chỉ dùng vài nhãn kỹ thuật tiếng Anh để dùng chung cho nội dung Anh/Việt; prompt nằm trong `public/images/blog/PROMPTS.md` và `PROMPTS.json`.
