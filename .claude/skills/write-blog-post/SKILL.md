---
name: write-blog-post
description: Viết một bài blog chia sẻ kiến thức công nghệ cho site này (song ngữ vi + en) từ một chủ đề, ghi chú hoặc transcript video mà người dùng dán vào. Dùng khi người dùng nói "viết bài", "thêm bài", "tạo bài về cái này" hoặc dán một đoạn nội dung kèm yêu cầu làm thành bài viết. Quy trình gồm kiểm chứng từng ý với nguồn chính thức, viết giọng người thật, tạo file Markdown đúng chỗ và kiểm tra trang hiển thị.
---

# Viết bài blog cho site này

Đầu vào thường là một transcript video ngắn hoặc vài dòng ghi chú. Đầu ra là một bài chia sẻ kiến thức đứng độc lập, đã kiểm chứng, có bản tiếng Việt và tiếng Anh.

Đầu vào chỉ là **chủ đề và danh sách ý cần kiểm**, không phải nội dung để chép lại.

## 1. Đọc đầu vào

- Transcript thường sai chữ do nhận dạng giọng nói. Đoán lại thuật ngữ đúng trước khi làm gì khác. Ví dụ đã gặp: "hell check" là health check, "3.0.js" là Three.js, "WebCPU" là WebGPU, "IPA ping" là API ping, "Livernet / ZDNet" là liveness / readiness.
- Liệt kê từng ý có thể kiểm được: con số, tên sản phẩm, tên tính năng, đường dẫn menu, tên công ty được nhắc, lời khẳng định kiểu "X luôn làm Y".

## 2. Kiểm chứng từng ý

- Ưu tiên tài liệu chính thức của sản phẩm (docs, README trên GitHub, trang hỗ trợ của Google/Cloudflare/Microsoft...). Bài tổng hợp của bên thứ ba chỉ dùng khi không có nguồn gốc.
- Con số nào tự đo được thì tự đo (ví dụ dung lượng bản build trên npm sau khi nén gzip) và ghi rõ phiên bản đã đo.
- Xếp mỗi ý vào một trong ba loại:
  - **Đúng**: dùng, đặt link nguồn ngay cạnh câu liên quan.
  - **Sai hoặc lệch**: viết lại theo số liệu đúng. Có thể nhắc một câu rằng con số hay gặp trên mạng là không đúng, không cần nói nguồn nào sai.
  - **Không có nguồn**: bỏ. Không lặp lại như sự thật. Nếu ý đó quan trọng thì nói rõ là tùy trường hợp.
- Nội dung gốc hay đơn giản hóa quá mức. Tìm chỗ cần nói thêm cho chính xác (ví dụ: VPN không hẳn là forward proxy; liveness probe không nên kiểm tra database).

## 3. Chọn góc viết

- Viết **bài chia sẻ kiến thức**, không phải bài phân tích hay phản biện một video. Không nhắc tới video, kênh, hay việc "xem xong rồi kiểm lại".
- Không dùng lại ví dụ, nhân vật, phép so sánh hay câu chốt của nguồn. Tự nghĩ ví dụ riêng.
- Thêm ít nhất một phần có giá trị mà nguồn không có: lỗi hay gặp khi làm thật, giới hạn của công cụ, khi nào không nên dùng. Tác giả là Full Stack Developer (React, Next.js, Node.js, NestJS), nên code mẫu ưu tiên stack này.
- Kết bài bằng thứ người đọc làm được ngay (thứ tự xử lý, tiêu chí chọn), không kết bằng lời kêu gọi theo dõi.

## 4. Giọng văn

Người đọc phải thấy đây là người viết, không phải máy.

- Xưng "mình", gọi người đọc là "bạn". Câu ngắn dài xen kẽ. Nói thẳng ý chính trước rồi mới giải thích.
- Không dùng dấu gạch ngang dài. Không dùng khuôn "không chỉ... mà còn", không xếp ba ý cho đủ bộ, không mở bài bằng "Trong thế giới công nghệ ngày nay".
- Không dùng từ sáo: "mạnh mẽ", "toàn diện", "liền mạch", "tối ưu vượt trội", "hành trình".
- Được có ý kiến ("mình thấy phần này đáng giá nhất") miễn là có lý do đi kèm.
- **Không bịa trải nghiệm cá nhân.** Chỉ viết điều kiểm được: thứ có trong repo này (ví dụ site dùng Three.js với React Three Fiber, chạy trên Vercel) hoặc việc vừa làm trong phiên (đã tải bản build về đo). Câu nào nói thay tác giả mà chưa chắc đúng thì phải báo lại ở bước 7.
- Bản tiếng Anh là bản viết lại tự nhiên, cùng cấu trúc và cùng số liệu, không dịch từng chữ.

## 5. Tạo file

Bài công nghệ nói chung thuộc mục Blog:

| | Tiếng Việt | Tiếng Anh |
|---|---|---|
| File | `content/posts/NN-slug-khong-dau.md` | `content/posts/en/NN-english-slug.md` |
| URL | `/blog/<slug>` | `/en/blog/<slug>` |

`NN` là số kế tiếp trong `content/posts/`. Hai bản phải cùng số, vì site ghép bản dịch theo số này. Bài thuộc series AI for Devs thì đặt trong `content/blog/` theo quy ước ở `content/blog/README.md` và cập nhật bảng trong README đó.

Frontmatter:

```yaml
---
title: "Tiêu đề đầy đủ, nói rõ bài giúp được gì"
seoTitle: "Bản rút gọn, tối đa 60 ký tự"
slug: slug-khong-dau
description: "Một đến hai câu, khoảng 150-160 ký tự, có từ khóa chính."
keywords: "tu khoa 1, tu khoa 2, tu khoa 3"
tags: "Chủ đề chính, Tag 2, Tag 3, Tag 4"
date: 2026-01-31
---
```

- Dòng đầu thân bài là `# ` trùng với `title` (site tự bỏ H1 này khi hiển thị).
- Tag đầu tiên hiện trên ảnh bìa thay thế và dùng để gợi ý bài liên quan, nên chọn tag cụ thể. Tránh `AI` và `Developer` ở vị trí đầu.
- Chia mục bằng `##`. Mục lục của bài lấy từ các tiêu đề `##`.
- Mỗi bài có ít nhất một link về trang chủ với chữ neo tự nhiên (`/#skills`, `/#experience`, `/#contact`, `/#overview`), và link sang bài liên quan nếu có.
- Trong bản tiếng Anh, link nội bộ vẫn viết bằng URL tiếng Việt (`/blog/<slug-vi>`, `/ai-for-devs/<slug-vi>`). Site tự đổi sang bản dịch khi có.
- Link nguồn đặt ngay trong câu dùng tới nó.
- Code mẫu ngắn, chạy được, có chú thích ở chỗ dễ sai. Code chưa chạy thử thì báo ở bước 7.
- Ảnh bìa (không bắt buộc): `public/images/blog/posts/<tên-file-vi>.webp`. Không có thì site dùng khung thay thế. Script `npm run og-images` hiện chỉ xử lý ảnh của series AI for Devs.

## 6. Kiểm tra

1. Chuỗi escape trong code mẫu: tìm lại `\u` trong file vừa ghi. Công cụ ghi file từng đổi `\u0300` thành ký tự thật, làm regex trong bài hiển thị sai.
2. `npx tsc --noEmit` phải sạch.
3. Mở cả hai URL trên dev server và kiểm tra trả về 200. Trang tiếng Anh của bài mới có thể trả 404 cho tới khi dev server nạp lại route; `touch` file `src/app/(site)/en/blog/[slug]/page.tsx` rồi thử lại.
4. Kiểm tra bài xuất hiện ở `/blog`, và link nội bộ trong bản tiếng Anh đã trỏ sang bản dịch.

## 7. Báo lại cho người dùng

- Hai URL để xem thử.
- Bảng đối chiếu: từng ý trong đầu vào và kết quả kiểm (đúng, sai và đã sửa thành gì, không có nguồn nên đã bỏ).
- Những gì đã thêm ngoài nội dung gốc.
- Những chỗ cần người dùng xem lại: câu nói thay tác giả, code chưa chạy thử, bài chưa có ảnh bìa.
- Danh sách nguồn dạng link.

Không commit khi chưa được yêu cầu.
