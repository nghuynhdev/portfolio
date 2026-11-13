---
title: "Viết skill riêng cho Claude Code: bắt đầu bằng quy trình review blog"
seoTitle: "Cách tạo skill riêng cho Claude Code (SKILL.md)"
slug: viet-skill-rieng-cho-claude-code
description: "Viết skill riêng cho Claude Code để review blog: định nghĩa phạm vi, viết SKILL.md, yêu cầu bằng chứng và test trước khi chia sẻ."
keywords: "tạo Claude skill, SKILL.md, custom Claude Code skills, blog review, agent skills"
tags: "AI, Claude Code, Skills, Workflow"
date: 2026-10-31
cover: /images/blog/25-viet-skill-rieng-cho-claude-code-v2.webp
---

# Viết skill riêng cho Claude Code: bắt đầu bằng quy trình review blog

Nếu mỗi lần viết bài bạn đều yêu cầu Claude kiểm tra slug, link nội bộ, code mẫu và các câu khẳng định thiếu nguồn, đó là một quy trình có thể đóng gói. Không nhất thiết cần một skill pack lớn cho nhu cầu riêng của repo.

Bài này xây một mẫu **review blog**, có đầu ra là nhận xét chứ không tự sửa hoặc xuất bản. Mẫu nằm trong nội dung hướng dẫn; nó chưa tự tạo skill hoạt động trong repo đang đọc bài.

## Chọn một việc có điểm kết thúc rõ

“Hỗ trợ content” quá rộng. “Review một bài Markdown tiếng Việt trước đăng” dễ giới hạn hơn: có file đầu vào, tiêu chí cần kiểm và báo cáo đầu ra.

Mình sẽ xác định phạm vi như sau: đọc bài được chọn cùng các nguồn liên quan; kiểm tra metadata, tính nhất quán và liên kết; phân biệt lỗi đã xác nhận với điều chưa đủ bằng chứng. Chưa tự thay giọng văn, cài dependency hoặc chạy code có tác dụng phụ chỉ để kiểm tra ví dụ.

## Tạo cấu trúc tối thiểu

Như đã nói trong bài [chọn skill cho Claude Code](/ai-for-devs/chon-skill-cho-claude-code), skill dự án có thể đặt dưới `.claude/skills/` với file `SKILL.md`. Ví dụ:

```text
.claude/
  skills/
    review-blog-vi/
      SKILL.md
      references/
        editorial-checklist.md
```

Bắt đầu bằng một file chính. Chỉ thêm checklist dài khi nó thực sự giúp tái dùng; không cần tạo nhiều thư mục rỗng để mẫu trông đầy đủ.

## Viết mô tả và đầu ra cụ thể

Nội dung `SKILL.md` mẫu dưới đây do bài viết đề xuất:

```markdown
---
name: review-blog-vi
description: Review một bài blog Markdown tiếng Việt trước đăng, kiểm tra metadata, liên kết và bằng chứng kỹ thuật.
disable-model-invocation: true
---

Review file được chỉ định trong $ARGUMENTS.

1. Đọc file và xác nhận đây là bài blog, không phải README.
2. Đối chiếu metadata với bộ đọc blog thực tế của dự án.
3. Kiểm tra slug duy nhất và các liên kết nội bộ trong repo.
4. Rà soát code mẫu, nêu rõ dependency và phần chỉ minh họa.
5. Với khẳng định về API hoặc cài đặt, đối chiếu nguồn chính thức.
6. Báo phát hiện theo mức ảnh hưởng, kèm vị trí và cách xác minh.

Không sửa file hoặc xuất bản trong quy trình review này.
Nếu không truy cập được nguồn, đánh dấu chưa xác minh.
Không khẳng định đã chạy code nếu chỉ đọc hoặc phân tích cú pháp.
```

`disable-model-invocation: true` giữ quy trình này ở dạng người dùng gọi chủ động; `$ARGUMENTS` nhận phần tham số khi gọi. Đó là lựa chọn cho mẫu này, không phải yêu cầu mọi skill đều phải có. Hướng dẫn review trong file cũng không thay thế cơ chế quyền của công cụ.

Sau khi tạo và Claude Code nhận skill, có thể gọi theo mẫu:

```text
/review-blog-vi content/blog/bai-can-review.md
```

## Đừng nhét mọi tài liệu vào file chính

Trong checklist phụ, có thể ghi ví dụ lỗi slug, cách phân biệt nguồn gốc với bài tổng hợp và tiêu chí phân loại code mẫu. File chính nên chỉ rõ lúc nào cần đọc checklist, thay vì chép cùng nội dung ở nhiều nơi.

Quy tắc chung của repo vẫn ở [CLAUDE.md/rules](/ai-for-devs/claude-md-va-rules-cho-du-an). Skill này chỉ giữ phần quy trình review. Nếu một yêu cầu thay đổi, bạn không phải sửa ba bản gần giống rồi hy vọng không bỏ sót.

## Thử với bài tốt lẫn bài cố ý có lỗi

Tạo bản nháp kiểm thử có link nội bộ sai, slug trùng, code thiếu import hoặc một lệnh cài đã lỗi thời. Xem skill có chỉ đúng vị trí và lý do không. Thử thêm bài đúng để kiểm tra nó có bịa vấn đề chỉ nhằm tạo báo cáo không.

Đừng đánh giá bằng độ dài output. Một báo cáo hữu ích có thể chỉ có hai lỗi đã xác nhận và một câu hỏi cần nguồn. Khi chưa kiểm tra được API, kết luận “chưa xác minh” tốt hơn việc đề xuất một tên hàm nghe hợp lý.

## Duy trì như một phần của dự án

Review thay đổi của skill như review code: phạm vi có rộng hơn không, có thêm lệnh chạy hay truy cập dịch vụ không, đầu ra còn phù hợp không? Lưu các ca lỗi từng gặp để chạy lại khi chỉnh hướng dẫn.

Khi quy trình review đã tốt, có thể tạo một workflow sửa bài riêng với phạm vi rõ. Tách bước đánh giá khỏi bước thay đổi giúp bạn biết Claude đang báo vấn đề hay đang trực tiếp làm biến đổi nội dung cần kiểm tra.

Đây là một phần trong series AI for Devs của [Nguyễn Huỳnh](/) — đọc thêm [kinh nghiệm của mình](/#experience) nếu bạn muốn biết các quy trình này đến từ đâu.
