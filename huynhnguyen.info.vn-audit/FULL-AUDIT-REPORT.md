# SEO Audit — huynhnguyen.info.vn (2026-11-12)

Phạm vi: bản build production **local** (`next build` + `next start`, 59 URL trong sitemap) và site **live** trên Vercel.
Loại site: Personal brand / portfolio + blog kỹ thuật song ngữ (VI/EN).

## SEO Health Score

| Hạng mục | Trọng số | Điểm (local build) |
|---|---|---|
| Technical SEO | 22% | 85 |
| Content Quality | 23% | 72 |
| On-Page SEO | 20% | 80 |
| Schema | 10% | 85 |
| Performance (lab) | 10% | 90 |
| AI Search Readiness | 10% | 75 |
| Images | 5% | 85 |
| **Tổng** | | **≈ 80 / 100** |

**Live site hiện tại ≈ 50/100**: toàn bộ blog chưa được deploy (xem C1).

> **Cập nhật 2026-11-12:** đã sửa H2, M1, M2, M3 (59/59 trang: title ≤ 60, description ≤ 160, og:image JPG). H1 giữ nguyên theo quyết định của chủ site.

## Critical

**C1. Blog chưa có trên production.** Live: `/ai-for-devs` → 404, `/en/ai-for-devs` → 404, `/blog` → 404, sitemap live chỉ có 1 URL. Local có 59 URL. Ngoài ra nhiều file cần thiết vẫn **untracked** (`content/blog/en/`, toàn bộ `public/images/blog/*.webp`) — nếu chỉ commit phần đã stage, build trên Vercel sẽ thiếu bản EN và ảnh cover.

## High

**H1. `datePublished` lùi về quá khứ.** 26 bài có `date` từ 2024-02-15 đến 2026-11-11, nhưng nội dung mới được tạo tuần này và URL chưa từng tồn tại trên site (live 404). Google biết ngày nó crawl lần đầu; ngày xuất bản không khớp thực tế là tín hiệu thiếu tin cậy (E-E-A-T) và có thể bị coi là làm giả độ "lâu năm". Nên dùng ngày publish thật (ngày deploy), giữ `updated` cho lần sửa.

**H2. Title quá dài, bị cắt trên SERP.** Template `'%s | Huynh. Portfolio'` (RootDocument.tsx:36) cộng thêm 19 ký tự → title bài viết dài 61–105 ký tự (đa số 75–100). Google cắt ở ~60 ký tự. Gợi ý: bỏ suffix cho bài viết (`title: { absolute: ... }`) hoặc đổi suffix ngắn (`| Huynh`), và rút gọn headline dài.

## Medium

- **M1. Trang index blog không có `og:image`.** `BlogIndex.tsx:42` ghi đè `openGraph` mà không có `images` → `/ai-for-devs`, `/en/ai-for-devs`, page/2, page/3 share lên Facebook/LinkedIn không có ảnh.
- **M2. Meta description dài.** Nhiều trang 170–224 ký tự (vd. `/en/.../llm-reliability-...` 224, `/ai-for-devs` 189). Giữ ≤ 155–160.
- **M3. OG image dạng WebP.** Cover 1600×900 WebP dùng làm `og:image`; một số nền tảng (LinkedIn, Zalo, một số bot chat) hiển thị WebP không ổn định. Nên xuất thêm bản JPG/PNG cho OG.
- **M4. Trang chủ chỉ index được tiếng Anh.** `/` render `lang="en"`, chuyển VI bằng client toggle, không có hreflang. Nội dung tiếng Việt của trang chủ không có URL riêng để Google index. Cân nhắc `/vi` hoặc ít nhất đưa nội dung VI quan trọng vào HTML.
- **M5. Thiếu security headers.** Live chỉ có HSTS; thiếu `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`/CSP `frame-ancestors`. Thêm qua `headers()` trong next.config.ts.

## Low

- **L1. Contrast:** nhãn footer "LINKS/CONNECT" (#6b7280 trên #0b0e18, 3.98:1) và text "Cập nhật …" (3.9:1) dưới 4.5:1.
- **L2. Accessible name lệch nhãn:** nút ngôn ngữ ("🇻🇳 VI" vs aria-label "Đổi ngôn ngữ: Tiếng Việt"), nút share LinkedIn ("in").
- **L3. Person schema công khai email + số điện thoại** trên mọi trang — hợp lệ nhưng tăng spam; cân nhắc bỏ `telephone`.
- **L4. `llms.txt` chưa có** (tuỳ chọn, Google không dùng; ChatGPT/Perplexity có thể dùng).
- **L5. Pagination page/3** mỏng (~200 từ, 1 bài) — chấp nhận được, không cần noindex.

## Những gì đang tốt

- 59/59 URL trả 200, canonical đúng tuyệt đối, không trùng title/description, không trang mồ côi; mọi trang đều link về trang chủ.
- hreflang vi/en/x-default đầy đủ ở cả HTML và sitemap (116 link alternate), `<html lang>` đúng theo từng route group.
- Schema: Person (@id dùng chung), WebSite, Blog, BlogPosting (có `inLanguage`, `workTranslation`, `dateModified`), BreadcrumbList — JSON-LD hợp lệ.
- Redirect 308 đúng: apex → www, http → https, `/blog/*` → `/ai-for-devs/*`, bài đã gộp, `/page/1` → root, trailing slash.
- 404 trả status 404 thật cho URL lạ / slug lạ / page vượt quá.
- Bài viết 1.000–1.860 từ, 1 H1/trang, ảnh đều có alt, robots.txt chặn `/api/`.
- Lighthouse mobile (local): SEO 100, Agentic Browsing 100, Accessibility 96, Best Practices 96 (lỗi console duy nhất là script Vercel Analytics 404 khi chạy local — không phải lỗi production). LCP 76 ms, CLS 0 (lab, không throttle; chưa có dữ liệu CrUX).

## Giới hạn

- Không có dữ liệu Google Search Console / CrUX / backlink (chưa cấu hình API).
- Performance là số lab trên localhost, chưa throttle mạng; cần đo lại trên production sau deploy.
