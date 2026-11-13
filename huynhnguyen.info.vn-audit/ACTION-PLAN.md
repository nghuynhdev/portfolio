# Action Plan — www.huynhnguyen.info.vn (2026-11-13)

Điểm hiện tại: 84/100. Chi tiết và bằng chứng: `FULL-AUDIT-REPORT.md`.

## Trạng thái sau khi sửa (2026-11-13, chưa deploy)

Đã kiểm trên bản build production chạy local (`next build` + `next start`).

| # | Việc | Trạng thái |
|---|---|---|
| 1 | JPG `og:image` cho 5 bài `/blog` | Xong. `npm run og-images` giờ xử lý cả `public/images/blog/posts/`; 10 trang trỏ vào `/images/blog/posts/og/*.jpg` |
| 2 | Dời file nội bộ khỏi `public/` | Xong. 6 file PROMPTS/BRIEFS chuyển sang `content/cover-prompts/`, URL cũ trả 404. `public/img.png` là logo "H." nên giữ nguyên |
| 3 | Ngày xuất bản lùi quá khứ | Không đổi, theo quyết định của chủ site |
| 4 | Link nguồn chính thức | Thêm 55 link cho mỗi ngôn ngữ, đã kiểm từng URL trả 200. Trong 32 bài: 16 bài có ≥ 3 link, 14 bài có 2, bài 07 và 25 có 1 |
| 5 | Security headers | Xong. `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`. Chưa có CSP |
| 6 | Trang chủ tiếng Việt | Xong. `/vi` render sẵn tiếng Việt với `lang="vi"`, hreflang en/vi/x-default hai chiều, có trong sitemap (78 URL). Nút đổi ngôn ngữ ở trang chủ giờ chuyển giữa `/` và `/vi` |
| 7 | 3 link ngoài đang 301 | Xong |
| 8 | LCP bài viết | Chưa làm; cần dữ liệu thật sau deploy |
| Low | Contrast footer, aria-label nút ngôn ngữ và nút share | Xong. Lighthouse Accessibility 100 trên bài viết |
| Low | `llms.txt` | Xong. Sinh tự động từ danh sách bài lúc build |
| Low | `telephone` trong Person schema | Không đổi; số điện thoại vốn hiển thị công khai ở trang chủ |

Còn lại sau deploy: kiểm 6 URL cũ trả 404 trên production, submit lại sitemap, đo LCP thật.

## Tuần này (High)

| # | Việc | Ở đâu | Công | Kiểm tra xong khi |
|---|---|---|---|---|
| 1 | Xuất JPG 1200×630 cho 5 bài `/blog` và trỏ `og:image` vào đó | `public/images/blog/og/`, logic OG trong `src/components/blog/BlogPost.tsx` | 30 phút | 0/77 trang có `og:image` đuôi `.webp` |
| 2 | Chuyển `PROMPTS.md`, `PROMPTS.json`, `BRIEFS-v2.json` (2 thư mục) và `img.png` ra khỏi `public/` | `public/images/blog/`, `public/images/blog/posts/`, `public/img.png` | 15 phút | 7 URL đó trả 404 trên production |
| 3 | Ngày xuất bản lùi quá khứ | frontmatter `date` trong `content/blog/` | — | Chủ site đã quyết định giữ; chỉ ghi lại rủi ro |

## Trong tháng (Medium)

| # | Việc | Ở đâu | Công | Kiểm tra xong khi |
|---|---|---|---|---|
| 4 | Thêm 3–5 link tài liệu chính thức cho mỗi bài, ưu tiên 12 bài hiện chỉ có 1 link | `content/blog/vi/`, `content/blog/en/` | 10–15 phút mỗi bài | Mỗi bài có ≥ 3 link ngoài không phải profile hay share |
| 5 | Thêm security headers | `headers()` trong `next.config.ts` | 20 phút | `curl -I` thấy `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy` |
| 6 | Cho trang chủ tiếng Việt một URL riêng (`/vi`) kèm hreflang, hoặc chấp nhận chỉ index bản EN | `src/app/(site)/page.tsx`, `src/app/sitemap.ts` | 2–4 giờ | Trang chủ có hreflang vi/en/x-default |
| 7 | Sửa 3 link ngoài đang 301 (AWS Builders' Library, Express behind proxies, Kubernetes probes) | bài reliability, proxy, health check | 10 phút | 0 link nguồn trả 301 |
| 8 | Đo lại LCP bài viết sau khi có dữ liệu thật | Search Console → Core Web Vitals | — | LCP p75 mobile ≤ 2,5 s; nếu không đạt thì giảm font preload và JS đầu trang |

## Backlog (Low)

- Contrast nhãn footer: đổi `text-gray-400/500` sang màu đạt 4,5:1 (`src/components/Footer.tsx`).
- `aria-label` nút ngôn ngữ và nút share LinkedIn phải chứa phần chữ hiển thị (`src/components/LanguageToggle.tsx`, `src/components/blog/BlogPost.tsx`).
- Thêm `llms.txt` (tuỳ chọn).
- Cân nhắc bỏ `telephone` khỏi Person schema (`src/components/RootDocument.tsx`).

## Theo dõi

- Kết nối Search Console để có dữ liệu index và CrUX; submit `sitemap.xml` (77 URL).
- Chạy `/seo setup` nếu muốn lần audit sau dùng đủ subagent, drift baseline và báo cáo PDF.
- Audit lại sau khi làm xong mục 1, 2, 4, 5.
