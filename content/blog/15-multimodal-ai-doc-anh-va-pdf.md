---
title: "AI đọc ảnh và PDF: trích xuất dữ liệu sao cho kiểm chứng được"
seoTitle: "Multimodal AI: trích xuất dữ liệu từ ảnh và PDF"
slug: multimodal-ai-doc-anh-va-pdf
description: "Đọc ảnh và PDF bằng AI đa phương thức: chọn trang, yêu cầu bằng chứng, cho phép thiếu dữ liệu và kiểm tra quy tắc bằng code."
keywords: "multimodal AI, vision model, PDF extraction, OCR, document AI, AI cho developer"
tags: "AI, Multimodal, Documents, Developer"
date: 2026-05-28
updated: 2026-11-13
cover: /images/blog/15-multimodal-ai-doc-anh-va-pdf-v2.webp
---

# AI đọc ảnh và PDF: trích xuất dữ liệu sao cho kiểm chứng được

Một biểu mẫu scan có ô mã đơn hơi mờ. Model trả JSON đúng schema, đủ mọi field, nhìn rất đẹp. Nhưng ký tự cuối của mã đơn là do nó đoán. Nếu hệ thống tự ghi thẳng kết quả vào database, một bản trích xuất có hình thức tốt vẫn có thể gây sai nghiệp vụ.

Model đa phương thức giúp đọc nội dung thị giác, nhưng không xóa nhu cầu kiểm chứng. Với bài toán tài liệu, mình thiết kế đầu ra để người hoặc code có thể quay lại đúng bằng chứng.

## OCR, vision hay kết hợp?

OCR phù hợp khi cần lấy nhiều chữ và giữ vị trí của chúng. Model vision hữu ích khi cần hiểu bố cục, liên hệ nhãn với ô nhập, hoặc đọc biểu đồ và hình ảnh. Một pipeline có thể dùng cả hai: OCR tạo text và tọa độ, model xử lý những phần khó hơn.

Một số API nhận PDF trực tiếp và xử lý cả văn bản lẫn hình ảnh; [tài liệu PDF của Claude](https://platform.claude.com/docs/en/build-with-claude/pdf-support) mô tả khả năng đó. Giới hạn trang, kích thước và cách tính tài nguyên phụ thuộc model cùng nền tảng, nên kiểm tra khi tích hợp thay vì hard-code một con số chung.

Với bộ hồ sơ dài, đừng gửi mọi trang cho mọi câu hỏi. Có thể dùng chỉ mục hoặc bước phân loại trang để thu hẹp, nhưng cần đo việc bỏ sót: trang phụ lục đôi khi chứa đúng dữ liệu cần lấy.

## Thiết kế field có quyền không biết

Thay vì buộc mọi field thành chuỗi, phân biệt đọc được, thiếu và không rõ. Ví dụ sau là kiểu dữ liệu ứng dụng, chưa phải schema gửi cho provider:

```ts
type EvidenceField =
  | {
      status: 'read';
      value: string;
      page: number;
      quote: string;
    }
  | {
      status: 'missing' | 'unclear';
      value: null;
      page: number | null;
      quote: string | null;
    };

type ExtractedForm = {
  orderCode: EvidenceField;
  requestedDate: EvidenceField;
  contactName: EvidenceField;
};
```

Sau khi nhận output, validate runtime bằng [JSON Schema](https://json-schema.org/) hoặc thư viện phù hợp. TypeScript không kiểm tra dữ liệu JSON từ mạng. [Structured output](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) giúp ràng buộc hình dạng; nó không chứng minh mã đơn hoặc ngày đã đọc đúng.

Trong prompt, yêu cầu không tự bổ sung ký tự mờ, không suy ngày còn thiếu và ghi trang bắt đầu từ 1. Với ngày `03/04`, nếu tài liệu không nêu quy ước và không đủ bằng chứng, giữ nguyên giá trị gốc để bước sau xử lý.

## Bằng chứng giúp kiểm tra, nhưng cũng có thể sai

`quote` do model tạo không mặc nhiên là trích dẫn thật. Nếu có text OCR, kiểm tra đoạn trích có tồn tại sau chuẩn hóa hợp lý. Nếu bằng chứng nằm trong hình, giao diện nên mở đúng trang và vùng ảnh để người duyệt xem.

Tọa độ do model tự đoán có thể lệch; muốn highlight đáng tin hơn, dùng tọa độ từ bộ phân tích bố cục hoặc OCR và giữ ánh xạ khi resize ảnh. Một ô được tô đẹp trên UI chưa có nghĩa bằng chứng đã được xác nhận.

## Để code làm kiểm tra xác định được

Mã đơn phải khớp định dạng hệ thống, ngày phải hợp lệ, số dòng phải nằm trong giới hạn nghiệp vụ. Nếu có bảng số, dùng thư viện decimal hoặc đơn vị nhỏ nhất phù hợp để kiểm tra phép tính; không yêu cầu model tự bảo đảm mọi phép cộng đều đúng.

Điểm “confidence 0.98” do model tự khai chưa phải xác suất đã hiệu chuẩn. Quyết định chuyển người duyệt nên dựa vào tập mẫu đã gán nhãn, lỗi kiểm tra, chất lượng ảnh và mức ảnh hưởng của field.

## Đo theo field và theo loại tài liệu

Chuẩn bị mẫu scan mờ, xoay, có ghi tay, nhiều trang và biểu mẫu gần giống nhau. Đo độ đúng mã đơn tách khỏi độ đúng tên liên hệ; một điểm trung bình có thể che mất field quan trọng đang sai nhiều.

Lưu revision của file, pipeline và model để truy vết. Tài liệu đầu vào vẫn là dữ liệu không tin cậy: một câu “hãy bỏ qua quy tắc” trong ảnh không được biến thành chỉ thị hệ thống. Dùng kết quả đã duyệt làm dữ liệu cho [bộ eval](/ai-for-devs/evals-do-chat-luong-llm), thay vì lấy output chưa kiểm chứng làm đáp án chuẩn.

Bạn có bài toán trích xuất tài liệu cụ thể? [Gửi mình vài dòng](/#contact).
