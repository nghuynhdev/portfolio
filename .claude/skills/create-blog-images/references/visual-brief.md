# Brief và ví dụ kiểm tra ý nghĩa

Dùng trước mỗi ảnh. Brief có thể nằm trong ghi chú làm việc; lưu bản rút gọn với prompt cuối để người sau biết vì sao chọn hình này. Không cần tạo file brief riêng cho mỗi bản nháp.

## Mẫu brief

```text
Article pair:
  VI: <path>
  EN: <path, or missing>
Reading coverage:
  <từng heading ##, ý chính và hành vi quan trọng trong code>
  <xác nhận đã đọc tới cuối cả hai file, phần khác biệt nếu có>
Main message: <một câu cụ thể>
Reader should see: <chủ thể + hành động/khác biệt + kết quả>
Critical caveats: <giới hạn từ nội dung bài, gồm phần cuối>
Must not imply: <các cách hiểu sai có thể xuất hiện trong ảnh>
Concept A / B: <hai cách kể khác nhau>
Chosen direction and why: <ưu tiên hiểu nhanh và đúng nội dung>
Visual treatment: <medium, bố cục, tương phản, màu/chất liệu có lý do>
Exact visible text: <chuỗi chính xác; vai trò của từng nhãn>
Bilingual check: <vì sao người đọc hai ngôn ngữ đều hiểu>
Neighbor check: <khác gì các ảnh liền kề>
Thumbnail prediction: <thứ phải còn nhìn thấy ở 320×180>
Final review: <nhận xét từ ảnh thật; lỗi đã sửa, phần chưa kiểm tra>
```

## Các ví dụ về bẫy ngữ nghĩa của repo này

Đây là ví dụ lựa chọn hình và lỗi cần tránh, không phải prompt tái sử dụng. Phải đọc phiên bản bài hiện tại trước khi áp dụng.

### Tìm kiếm tiếng Việt không dấu

Thông điệp: query không dấu vẫn khớp tiêu đề có dấu bằng cách chuẩn hóa dữ liệu dùng để so sánh, giữ nguyên văn bản hiển thị.

Một hướng: phóng to trường tìm kiếm `bao mat` cùng kết quả `Bảo mật` được highlight. Hướng khác: query và tiêu đề đi qua hai nhánh chuẩn hóa trước khi so khớp; kết quả trả về vẫn có dấu.

Tránh vẽ `bao mat` qua bộ bỏ dấu rồi biến thành `bảo mật`. NFD không tự xóa dấu; bước bỏ combining marks là bước tiếp theo. Không vẽ chuỗi từ khóa đi lên cloud nếu ví dụ trong bài chạy hoàn toàn trên client. Không cố đưa NFD, xếp hạng, highlight và toàn bộ UI vào cùng một thumbnail.

### Health check

Thông điệp phù hợp: process vẫn sống nhưng khả năng phục vụ một yêu cầu có thể đã hỏng; liveness và readiness dẫn tới các hành động khác nhau.

Một hướng: cận cảnh cùng một app với tín hiệu process còn hoạt động, nhưng request phụ thuộc vào DB thất bại. Hai tín hiệu phân biệt bằng nhãn/hình dạng, không chỉ màu xanh/đỏ. Hướng khác: so sánh kiểm tra nội bộ process và kiểm tra phụ thuộc thiết yếu, làm rõ nhánh restart so với ngừng nhận traffic.

Đọc kỹ phần cuối: không phải phụ thuộc nào cũng thuộc readiness. Nếu DB dùng chung hỏng, không tự vẽ traffic chuyển sang một pod khác vẫn khỏe với cùng DB. Không vẽ DB hỏng làm liveness thất bại hoặc tự restart DB. Không cần minh họa mọi framework được nhắc trong bài.

### Forward proxy và reverse proxy

Thông điệp: khác ở bên được đại diện, không đơn giản là mũi tên đi ngược chiều.

Một hướng: client và forward proxy cùng trong một vùng sở hữu; reverse proxy và origin cùng trong vùng dịch vụ. Hướng khác: một yêu cầu cụ thể đi qua hai quan hệ khác nhau, phía được đại diện được nhấn bằng enclosure.

Không chỉ đổi chữ trên hai hộp giống nhau. Không ngầm bảo proxy luôn giải mã được HTTPS hoặc giống hệt VPN. Đường đi request và response phải nhất quán nếu thể hiện cả hai.

### PlayCanvas

Chọn một cảnh editor đang thao tác với một scene có mục đích; gizmo gắn đúng vật thể và preview giữ scene tương ứng. Vật thể/ánh sáng có thể giàu chi tiết hơn hình luồng dữ liệu vì nội dung bài nói về dựng cảnh 3D.

Không lấy logo hoặc cube phát sáng làm toàn bộ ý tưởng. Không gọi UI được sinh là screenshot thật. Không thể hiện editor và engine là hai công cụ hoàn toàn không liên quan.

### Traffic và backlink

Hai hành vi khác nhau: request làm ảnh hưởng tài nguyên/khả năng truy cập, còn backlink là quan hệ từ trang khác. Nếu ảnh chọn so sánh, người xem phải nhìn thấy hai loại tác động thay vì một lá chắn chung.

Không ngầm mô tả mọi bot đều xấu, mọi backlink lạ đều gây phạt, hay chặn request sẽ gỡ backlink. Không vẽ cảnh thứ hạng tự phục hồi vì bấm Disavow. Có thể chỉ tập trung vào một hành động chính nếu hai luồng khiến ảnh quá rối, nhưng ghi rõ lựa chọn đó trong brief.
