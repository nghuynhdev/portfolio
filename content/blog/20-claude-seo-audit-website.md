---
title: "Claude SEO: audit blog bằng Claude Code và biến báo cáo thành việc cần sửa"
seoTitle: "Claude SEO: audit blog bằng Claude Code"
slug: claude-seo-audit-website
description: "Dùng Claude SEO trong Claude Code: cài plugin, audit từng trang, kiểm tra technical SEO và schema, rồi biến phát hiện thành thay đổi có bằng chứng."
keywords: "Claude SEO, Claude Code SEO skill, SEO audit, technical SEO, blog SEO, AgriciDaniel"
tags: "AI, Claude Code, Skills, SEO"
date: 2026-08-12
---

# Claude SEO: audit blog bằng Claude Code và biến báo cáo thành việc cần sửa

Một báo cáo SEO dài có thể chứa rất nhiều việc nhưng chưa cho biết nên sửa gì trước. Với developer, phần hữu ích nhất là nối được phát hiện với URL, đoạn HTML hoặc file nguồn, rồi xác nhận thay đổi đã giải quyết đúng vấn đề.

Bài này nói về **Claude SEO của AgriciDaniel**, bộ skill/plugin cộng đồng dành cho Claude Code, không phải mọi repo có chữ “SEO” trong tên. [Repo gốc](https://github.com/AgriciDaniel/claude-seo) có hướng dẫn cài, runtime và các khả năng tích hợp dữ liệu ngoài.

## Cài rồi bắt đầu bằng phạm vi nhỏ

Nhập trong Claude Code theo hướng dẫn của dự án:

```text
/plugin marketplace add AgriciDaniel/claude-seo
/plugin install claude-seo@agricidaniel-claude-seo
/seo setup
```

Kiểm tra menu sau cài để biết tên lệnh có namespace hay không. Các lệnh ví dụ dưới dùng dạng ngắn được skill SEO công bố:

```text
/seo page https://example.com/blog/bai-viet
/seo technical https://example.com
/seo schema https://example.com/blog/bai-viet
```

Thay `example.com` bằng website cần kiểm tra. `/seo setup` chuẩn bị môi trường chạy của plugin; dùng `/seo doctor` để kiểm tra khi có lỗi, theo README của đúng phiên bản. Chưa cần kết nối mọi API SEO để kiểm tra một trang công khai.

## Yêu cầu báo cáo có bằng chứng

Mình sẽ bổ sung yêu cầu bằng ngôn ngữ tự nhiên:

```text
Audit trước, chưa sửa hoặc xuất bản nội dung.
Mỗi phát hiện cần URL, bằng chứng đã quan sát, tác động,
cách tái kiểm tra và đề xuất sửa nhỏ nhất.
Tách lỗi đã xác nhận khỏi giả thuyết cần dữ liệu bổ sung.
Không suy ra traffic, search volume hoặc thứ hạng khi chưa có nguồn.
```

Đây là ràng buộc cho tác vụ, không phải đảm bảo tool tự có đủ dữ liệu. Nếu không tải được trang, kết luận đúng phải là chưa quan sát được. Nếu chỉ đọc source repo, báo cáo nên phân biệt cấu hình dự kiến với HTML website đang phục vụ.

## Với blog, kiểm tra một hành trình hoàn chỉnh

Chọn trang danh sách, một bài viết và một URL không tồn tại. Xem title, mô tả, nội dung chính, link nội bộ và trạng thái HTTP có phù hợp từng trang không. Kiểm tra sitemap có các URL đang phục vụ, tránh chỉ xác nhận file XML tồn tại.

Canonical cần chỉ đúng trang đại diện, không gom mọi bài về trang chủ. Google mô tả canonical là tín hiệu ưu tiên, không phải mệnh lệnh chắc chắn được chọn. Khi sửa, xem cả redirect và liên kết nội bộ có cùng hướng đến URL mong muốn không.

## Schema phải mô tả nội dung thật

Với bài blog, đối chiếu tác giả, tiêu đề và ngày trong JSON-LD với nội dung hiển thị. Không tạo review, đánh giá sao hay thông tin tác giả không có thật chỉ để lấp field. Google giải thích structured data như cách cung cấp thông tin có cấu trúc; việc hợp lệ không bảo đảm được hiển thị rich result.

Sau sửa, dùng công cụ xác thực phù hợp và xem HTML từ bản triển khai. Một object JSON đúng trong source chưa chứng minh trang cuối đã xuất đúng dữ liệu.

## Ưu tiên việc sửa và đo lại

Mình sẽ xử lý lỗi cản truy cập hoặc nội dung chính trước, rồi metadata/canonical/schema sai, sau đó mới đến cải thiện nội dung. Mỗi đợt chọn một nhóm nhỏ để dễ review và đối chiếu trước/sau.

Với nội dung, dùng tiêu chí hữu ích cho người đọc của Google: bài giải quyết câu hỏi gì, có ví dụ kiểm chứng được không, có thông tin riêng vượt qua việc diễn đạt lại nguồn không? Không lấy việc lặp từ khóa làm mục tiêu viết bài. Ví dụ trong bài lấy bối cảnh một blog cá nhân như [website của mình](/): trang giới thiệu cộng một series bài viết.

Điểm audit là đầu vào để quyết định, không phải lời hứa tăng hạng. Sau khi triển khai, theo dõi trạng thái crawl/index và dữ liệu Search Console nếu bạn có quyền truy cập. Ghi riêng ngày thay đổi để đánh giá theo thời gian, thay vì coi một lần chạy lại báo cáo là bằng chứng traffic đã tăng.
