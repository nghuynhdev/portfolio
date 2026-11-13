# SEO Audit — www.huynhnguyen.info.vn (2026-11-13)

Phạm vi: site **live** trên Vercel, crawl toàn bộ 77 URL trong sitemap (không còn URL nào ngoài sitemap được tìm thấy qua link nội bộ).
Loại site: personal brand / portfolio + blog kỹ thuật song ngữ (VI/EN).
Bản audit trước: 2026-11-12 (xem lịch sử git của file này).

## SEO Health Score: 84 / 100

| Hạng mục | Trọng số | Điểm | Hôm qua (local build) |
|---|---|---|---|
| Technical SEO | 22% | 88 | 85 |
| Content Quality | 23% | 74 | 72 |
| On-Page SEO | 20% | 90 | 80 |
| Schema | 10% | 88 | 85 |
| Performance (lab) | 10% | 80 | 90 (không throttle) |
| AI Search Readiness | 10% | 80 | 75 |
| Images | 5% | 88 | 85 |

Live site hôm qua ≈ 50/100 vì blog chưa deploy. Hôm nay blog đã lên production, nên điểm live tăng lên 84.

## Đã sửa so với hôm qua

- **C1 (blog chưa deploy):** đã xong. 77/77 URL trả 200, sitemap live có 77 URL.
- **H2 (title dài):** 0 title > 60 ký tự.
- **M1 (index thiếu og:image):** 77/77 trang có `og:image`.
- **M2 (description dài):** 0 description > 160 ký tự.
- **M3 (OG WebP):** 54 bài AI for Devs đã dùng JPG. Còn sót 10 bài `/blog` mới (xem H2 bên dưới).

## Critical

Không có.

## High

**H1. `datePublished` lùi về quá khứ (giữ nguyên theo quyết định của chủ site).** 54 bài AI for Devs ghi ngày từ 2024-02-15 đến 2026-11-12 trong khi URL mới xuất hiện trên production tuần này. 22 bài trong số đó có `dateModified` = 2026-11-11, phần còn lại có `dateModified` trùng ngày cũ. Rủi ro E-E-A-T như đã nêu hôm qua; không đổi khuyến nghị.

**H2. 10 bài `/blog` và `/en/blog` dùng `og:image` WebP.** 5 bài mới (proxy, health check, PlayCanvas, tìm kiếm không dấu, negative SEO) ở cả hai ngôn ngữ trỏ `og:image` vào file `.webp` trong `public/images/blog/posts/`. `public/images/blog/og/` chỉ có JPG cho 27 bài series và 4 trang index. LinkedIn, Zalo và một số bot chat hiển thị WebP không ổn định. Cần xuất JPG 1200×630 cho 5 bài này.

**H3. File nội bộ đang public.** Các file sau trả 200 trên production:
- `/images/blog/PROMPTS.md`, `/images/blog/PROMPTS.json`, `/images/blog/BRIEFS-v2.json`
- `/images/blog/posts/PROMPTS.md`, `/images/blog/posts/PROMPTS.json`, `/images/blog/posts/BRIEFS-v2.json` (38 KB)
- `/img.png`

Đây là prompt và brief tạo ảnh bìa, không phải nội dung cho người đọc. Chúng không được link nên chưa chắc bị index, nhưng ai biết đường dẫn đều đọc được. Nên chuyển ra ngoài `public/` (ví dụ `content/` hoặc `scripts/`).

## Medium

- **M1. Mỗi bài chỉ có 0–4 link nguồn ra ngoài.** Trừ link profile (GitHub, Facebook, LinkedIn) và nút share, bài series thường còn đúng 1 link tài liệu, ví dụ bài CLAUDE.md chỉ link `code.claude.com/docs/en/memory`. Với bài kỹ thuật 1.000–1.800 từ có nhiều nhận định về API và sản phẩm, đây là điểm yếu nhất về độ tin cậy và khả năng được AI trích dẫn. Mục tiêu: 3–5 link tới tài liệu chính thức cho mỗi bài.
- **M2. Trang chủ chỉ index được tiếng Anh.** `/` có `lang="en"`, không có hreflang, bản tiếng Việt chỉ hiện qua toggle phía client. 76 trang còn lại đều có cặp vi/en/x-default. (Trùng M4 hôm qua.)
- **M3. Thiếu security headers.** Chỉ có `strict-transport-security`. Thiếu `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` hoặc CSP `frame-ancestors`, `Permissions-Policy`. `next.config.ts` chưa có `headers()`. (Trùng M5 hôm qua.)
- **M4. LCP bài viết 3,6 s trên mobile throttle.** Đo lab (Slow 4G, CPU 4x): TTFB 563 ms, tải ảnh bìa 3.007 ms, render delay 20 ms. Ảnh bìa đã có `priority` và `sizes`, bản 828w nặng 40 KB, nên phần lớn thời gian là băng thông chia cho font + JS. Trang chủ đạt 2,0 s. Ngưỡng tốt là ≤ 2,5 s. Chưa có dữ liệu CrUX nên đây là ước lượng lab.
- **M5. 3 link ngoài bị redirect 301.** `aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/`, `expressjs.com/en/guide/behind-proxies.html`, `kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/`. Vẫn tới đích, nên cập nhật URL mới.

## Low

- **L1. Contrast footer:** nhãn "LINKS / CONNECT" (#6b7280 trên #0b0e18) đạt 3,98:1, cần 4,5:1. Chưa sửa từ hôm qua.
- **L2. Accessible name lệch nhãn:** nút ngôn ngữ ("🇺🇸 EN" với `aria-label="English"`) và nút share LinkedIn ("in"). Chưa sửa.
- **L3. `/blog` liệt kê cả bài AI for Devs.** `/blog` có 3 trang vì gồm cả 26 bài series, trong khi chỉ 5 bài thuộc `/blog/*`. Canonical của từng bài vẫn đúng nên không trùng lặp nội dung; chỉ là hai trang index chồng nhau 26/31 mục. Đây là chủ ý (ghi trong `next.config.ts`).
- **L4. Title trang phân trang ngắn:** "Blog — Trang 2 | Huynh" (22 ký tự). Không ảnh hưởng nhiều.
- **L5. `llms.txt` chưa có** (404). Tuỳ chọn, Google không dùng.
- **L6. Person schema công khai email và số điện thoại** trên mọi trang.

## Những gì đang tốt

- 77/77 URL trả 200, 0 link nội bộ hỏng, 0 link ngoài chết (24 trả 200, còn lại là redirect của nút share và profile).
- Canonical tự trỏ đúng trên cả 77 trang, `index, follow`, không trùng title hay description, 1 H1 mỗi trang.
- hreflang vi/en/x-default có ở 76/77 trang, đối xứng hai chiều, `<html lang>` khớp.
- Redirect 308: apex → www, http → https. URL lạ trả 404 thật.
- Schema hợp lệ (0 lỗi JSON-LD): Person, WebSite, Blog, BlogPosting (đủ `headline`, `datePublished`, `dateModified`, `author`, `publisher`, `image`, `inLanguage`, `workTranslation`), BreadcrumbList.
- 443 thẻ `<img>`, 100% có alt, tất cả qua `next/image` (WebP, srcset).
- Bài viết: trung vị 1.156 từ, bài ngắn nhất 948 từ. Có trải nghiệm thật (ví dụ từ chính repo portfolio), có byline và ngày.
- Lighthouse mobile (production): SEO 100, Best Practices 100, Agentic Browsing 100, Accessibility 97. CLS 0.
- robots.txt cho phép mọi bot, chặn `/api/`. GPTBot, ClaudeBot, PerplexityBot, Google-Extended đều nhận 200.
- TTFB trung vị 0,25 s, mọi trang prerender và cache HIT trên Vercel.

## Giới hạn của lần audit này

- Runtime của plugin Claude SEO chưa được cài (`/seo setup`), nên các script chuyên biệt (`render_page.py`, drift, Common Crawl backlink, PDF) và các subagent không chạy. Audit được làm bằng crawler tự viết, Lighthouse và performance trace của Chrome DevTools.
- PageSpeed Insights API hết quota trong ngày; số performance là lab từ một lần chạy cho mỗi trang (trang chủ và một bài viết).
- Không có dữ liệu Search Console, CrUX, GA4, backlink. Chưa chụp screenshot, chưa phân tích SERP hay cluster từ khoá.
- `findings/*.md` theo từng hạng mục không được tạo; mọi phát hiện nằm trong file này.
