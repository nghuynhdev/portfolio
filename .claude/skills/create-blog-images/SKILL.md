---
name: create-blog-images
description: Tạo hoặc làm lại ảnh bìa blog công nghệ dùng chung tiếng Việt và tiếng Anh, dựa trên việc đọc toàn bộ bài, thiết kế ý tưởng riêng cho từng chủ đề và kiểm tra độ dễ hiểu ở kích thước thumbnail. Dùng khi yêu cầu tạo ảnh bài viết hoặc cải thiện bộ ảnh bìa; không dùng cho viết bài hay thay ảnh bằng ảnh tìm trên mạng.
---

# Tạo ảnh blog từ nội dung đã đọc đầy đủ

Ảnh phải giúp người đọc nhận ra bài đang giải quyết vấn đề gì. Chất lượng đến từ ý tưởng chính xác, bố cục và khả năng đọc hình, không phải thêm hiệu ứng hoặc nhiều chi tiết. Không hứa ảnh chắc chắn đẹp; phải xem kết quả rồi mới đánh giá.

## Phạm vi và công cụ

- Tạo ảnh bằng công cụ `image_gen` tích hợp. Khi có skill `imagegen`, đọc và tuân theo skill đó về công cụ, ảnh tham chiếu và lưu file. Không tự chuyển sang API/CLI hoặc ảnh tải trên mạng khi công cụ không dùng được.
- Yêu cầu tạo skill, viết prompt hoặc lên ý tưởng không đồng nghĩa với yêu cầu sinh ảnh ngay. Chỉ sinh hoặc thay ảnh trong phạm vi người dùng giao.
- Tạo mới và làm lại ảnh là hai việc khác nhau. Bài đã có ảnh thì giữ ảnh đó cho đến khi bản thay thế qua review. Không commit/push khi chưa được yêu cầu.
- Không thêm link nguồn ảnh hoặc chú thích nguồn vào trang theo mặc định. Việc kiểm chứng một chi tiết kỹ thuật mới vẫn phải dùng tài liệu chính thức khi cần.

## 1. Đọc hết trước khi thiết kế

Tìm bài gốc, bản dịch và quy tắc chọn ảnh trong repo. Với site portfolio này:

| Nhóm | Nội dung Việt | Nội dung Anh | Ảnh bìa |
| --- | --- | --- | --- |
| Blog thường | `content/posts/NN-*.md` | `content/posts/en/NN-*.md` | `public/images/blog/posts/<basename-vi>.webp` |
| AI for Devs | `content/blog/NN-*.md` | `content/blog/en/NN-*.md` | `public/images/blog/<basename-vi>.webp` |

Ghép bản dịch theo số `NN` trong cùng nhóm, không theo slug tiếng Anh. Xác nhận lại cơ chế trong `src/lib/blog.ts` nếu repo đã đổi. Nếu chuyển sang repo khác, khám phá quy ước của repo đó thay vì tạo các thư mục trên một cách máy móc.

**Đọc toàn bộ từng file Việt và Anh**, gồm phần cuối bài, code, ví dụ, chú thích và giới hạn. Không thay bằng title, description, headings, `head`, một đoạn trích hay bản tóm tắt. File dài thì đọc liên tiếp từng đoạn đến EOF. Nếu output bị cắt, đọc phần còn thiếu. Không ghi là đã đọc hết nếu chưa đọc hết.

Trước khi gọi sinh ảnh, lập một brief theo [references/visual-brief.md](references/visual-brief.md):

- Ghi đường dẫn hai bài và phạm vi đã đọc; đối chiếu từng mục `##` với một câu ý chính. Với phần code, ghi hành vi mà code thực hiện, không chép nguyên code.
- Chốt một thông điệp chính, một tình huống cụ thể và các giới hạn có thể làm thay đổi ý nghĩa hình ảnh. Lấy cả giới hạn ở cuối bài.
- Phân biệt nội dung có trong bài với ý tưởng hình ảnh do mình thêm. Bản dịch thiếu hoặc khác ý thì ghi rõ, không tự sửa bài hay che giấu khác biệt.
- Chọn thông điệp chung cho hai bản. Nếu mâu thuẫn làm thay đổi ý nghĩa ảnh, xử lý mâu thuẫn trước khi sinh ảnh.

Không bắt đầu sinh ảnh khi còn phần nội dung chưa đọc. Ảnh bìa chỉ cần một thông điệp; đọc hết để chọn đúng thông điệp, không phải nhét toàn bộ bài vào ảnh.

## 2. Chọn ngôn ngữ thị giác riêng cho bài

Xem ảnh hiện tại, vài ảnh lân cận và layout hiển thị. Dùng ảnh cũ để nhận biết điểm cần cải thiện, không mặc định dùng nó làm style reference.

Nghĩ ít nhất hai hướng khác nhau về cách kể, rồi tự chọn hướng rõ nhất; không cần bắt người dùng duyệt từng bước nếu họ đã giao tạo ảnh. Ví dụ: cận cảnh một trạng thái sai và đúng, một thao tác đang diễn ra, hay sơ đồ quan hệ. Chỉ đổi màu trong cùng bố cục không tính là hướng khác.

Chọn hình thức theo thông điệp:

| Thông điệp | Cách thể hiện phù hợp |
| --- | --- |
| Thao tác trực quan, editor, vật thể 3D | Một cảnh thao tác với kết quả rõ; chi tiết có chủ đích, vật liệu và chiều sâu hỗ trợ điểm nhìn |
| Luồng dữ liệu, thứ tự xử lý | Sơ đồ có hướng, đầu vào/đầu ra và trạng thái rõ ràng; mỗi đường nối có nghĩa |
| Hai khái niệm dễ nhầm | Hai vùng so sánh cùng quy mô, làm nổi bật đúng khác biệt; tránh hai cảnh gần như giống hệt |
| Lỗi vận hành, bảo mật | Một sự cố cụ thể và tác động hoặc ranh giới kiểm soát; tránh biểu tượng khiên/khóa chung chung |
| Cơ chế tìm kiếm, chuẩn hóa, xếp hạng | Dữ liệu ví dụ thật ngắn, phép biến đổi hoặc kết quả được chọn nhìn thấy được |

Đây là gợi ý, không phải template bắt buộc. Có thể kết hợp khi một cảnh duy nhất vẫn đọc được.

- Đặt một điểm nhìn chính, các yếu tố phụ có thứ bậc. Chọn góc nhìn, tương phản, vật liệu và nền theo nội dung.
- Không mặc định navy + cyan + amber, kính mờ, khối server, đường phát sáng cho mọi bài. Tránh robot, bộ não, chip hoặc chữ viết tắt làm vật trang trí khi không giải thích được nội dung.
- Độ chi tiết phục vụ câu chuyện: có thể giàu chi tiết ở cảnh editor hoặc vật thể, nhưng chữ và cơ chế chính vẫn phải rõ. Không ép mọi ảnh thành vài hình khối sơ sài; cũng không biến ảnh bìa thành poster dày chữ.
- Với một bộ ảnh, xem cạnh nhau: thay đổi có chủ đích về bố cục, mật độ, tông sáng/tối và hình thức minh họa. Giữ chất lượng chung, không đồng phục hóa mọi chủ đề. Chỉ giữ style cố định nếu người dùng muốn bộ nhận diện như vậy.

## 3. Dùng chung cho Việt và Anh

Ưu tiên một ảnh dùng chung, không lặp toàn bộ nhãn bằng hai ngôn ngữ.

- Hình ảnh phải truyền tải phần lớn ý nghĩa khi che nhãn. Dùng thuật ngữ kỹ thuật tiếng Anh quen thuộc khi nhãn giúp phân biệt, chẳng hạn `Client`, `Server`, `Live`, `Ready`.
- Không đặt số lượng nhãn cứng nhắc. Chỉ giữ chữ cần cho việc đọc hình, chữ đủ lớn ở thumbnail; tránh tiêu đề dài, đoạn văn, bảng code và UI giả đầy chữ nhỏ.
- Ví dụ tiếng Việt cần giữ dấu nếu dấu là nội dung bài. Ghi nguyên văn chuỗi vào prompt và kiểm tra dấu từng chữ sau khi sinh.
- Không để ảnh dùng chung phụ thuộc vào một câu giải thích dài chỉ người đọc tiếng Việt hoặc tiếng Anh hiểu được.
- Chỉ làm hai biến thể ngôn ngữ khi có yêu cầu hoặc nội dung thật sự cần chữ dài. Trước khi tạo hai bản, xác nhận site có cách chọn ảnh theo ngôn ngữ; hiện quy ước mặc định ghép một ảnh theo số bài.
- Không gọi UI do AI minh họa là screenshot sản phẩm thật. Nếu người dùng cần UI chính xác, dùng screenshot họ cung cấp hoặc chụp ứng dụng thực trong phạm vi được giao.

## 4. Viết prompt có cấu trúc và có điều kiện đúng/sai

Prompt bằng tiếng Anh để mô tả hình ảnh rõ ràng; giữ nguyên các chuỗi hiển thị thuộc ngôn ngữ khác.

Điền brief trước, sau đó chuyển thành prompt. Prompt cần có:

1. Mục đích ảnh, tỉ lệ ngang 16:9, thông điệp người xem cần nhận ra.
2. Chủ thể, hành động và kết quả cụ thể; vị trí tương đối hoặc chiều mũi tên khi chúng mang nghĩa kỹ thuật.
3. Hình thức thể hiện đã chọn, điểm nhìn chính, cách dùng ánh sáng/màu/chất liệu để đọc hình.
4. Text chính xác được phép có, hoặc yêu cầu không chữ khi phù hợp.
5. Các điều kiện kỹ thuật phải đúng và cách hiểu sai phải tránh, trích từ nội dung vừa đọc.
6. Vùng an toàn cho chủ thể/nhãn khi hiển thị `object-cover`, nền hợp layout; không thêm logo/watermark.

Không dùng một prefix dài cố định để buộc mọi bài cùng style. Không thêm kiến trúc, số liệu, sản phẩm hay lời hứa không có trong bài. Sự khác nhau phải có trong mô tả cảnh, không chỉ ở phần tên chủ đề.

## 5. Sinh, xem và sửa có mục tiêu

Sinh riêng từng ảnh bằng công cụ tích hợp. Với nhiều bài, phải có brief và prompt riêng cho từng bài trước khi sinh. Không gộp nhiều bài vào một collage rồi cắt để làm ảnh bìa.

Với bộ ảnh của repo này, xử lý tối đa **3 ảnh mỗi lượt** theo yêu cầu người dùng. Đọc đủ các bài trong lượt, tạo và review cả lượt, thay ảnh đạt yêu cầu rồi mới sang lượt tiếp theo. Khi người dùng yêu cầu xóa ảnh cũ, xác nhận cả hai ngôn ngữ đã dùng bản mới trước khi xóa; không giữ file ảnh cũ dư thừa trong repo. Prompt lịch sử có thể giữ để đối chiếu.

Xem ảnh thực tế, không suy ra chất lượng từ prompt hoặc thông báo thành công. Kiểm tra cả bản lớn và bản thu nhỏ **320 × 180**. Khi làm nhiều ảnh, tạo contact sheet để đọc bộ ảnh cạnh nhau. Có thể dùng công cụ ảnh thông thường để resize/convert/contact sheet; chỉnh nội dung ảnh thì theo workflow sửa ảnh của công cụ tạo ảnh.

Đánh giá từng điều kiện bằng bằng chứng từ hình:

| Điều kiện | Dấu hiệu đạt |
| --- | --- |
| Hiểu nhanh | Sau khoảng 5 giây, có thể mô tả đúng chủ thể và khác biệt/hành động chính mà không đọc bài |
| Đúng nội dung | Nhãn, đường nối, trạng thái và kết quả khớp brief; không ngầm khẳng định điều bài đã cảnh báo |
| Đọc ở thumbnail | Chủ thể còn rõ, nhãn thiết yếu đọc được; hình không thành đám khối nhỏ hoặc phụ thuộc vào chữ li ti |
| Dùng chung ngôn ngữ | Chuỗi chính xác, dấu đúng, không phải đọc một đoạn văn để hiểu; không có chữ vô nghĩa |
| Hoàn thiện và có cá tính | Không lỗi vật thể/đường nối, không crop mất ý chính; ảnh khác ảnh lân cận về cách kể, không chỉ màu |

Thiếu một điều kiện quan trọng thì chưa dùng ảnh đó làm bản cuối. Sửa lỗi cụ thể, giữ phần đúng; nếu thumbnail thất bại vì ý tưởng quá phức tạp, giảm cơ chế hoặc đổi bố cục trước khi tăng độ phân giải. Nếu hai lượt sửa liên tiếp không cải thiện, đổi hướng thiết kế thay vì lặp nguyên prompt. Báo lại giới hạn còn tồn tại, không đánh dấu đạt cho đủ checklist.

Với hình so sánh hoặc cơ chế, dùng thêm phép thử: bỏ nhãn hoặc đổi chỗ hai nhóm có còn nhận ra khác biệt không? Nếu câu trả lời là không, xem lại hình học và quan hệ thay vì thêm chữ.

## 6. Lưu và kiểm tra trên site

- Giữ kết quả gốc; lưu bản project vào repo. WebP 1600 × 900 là quy ước hiện tại. Resize hợp lý, không kéo méo hoặc cắt mất nhãn để ép 16:9. Nếu cần nhiều padding mới giữ đủ hình, ưu tiên sửa bố cục.
- Dùng đúng basename Việt để cả hai bản dịch tự nhận ảnh. Khi làm lại ảnh, giữ bản mới ở tên tạm ngoài nơi site tự chọn, chỉ thay file chính sau khi review đạt.
- Ghi prompt cuối, đường dẫn hai bài, thông điệp, giới hạn quan trọng và nhận xét review vào manifest của đợt ảnh. Giữ lịch sử prompt cũ khi hữu ích, phân biệt rõ bản đang dùng. Không đưa ghi chú kỹ thuật này vào UI bài viết.
- Mở trang danh sách và trang bài Việt/Anh; kiểm tra HTTP, ảnh tải được, crop và độ rõ trong khung thật, kể cả màn hình nhỏ. HTTP 200 không chứng minh ảnh đã hiển thị đúng.
- Nếu không mở được browser/server, kiểm tra file và cơ chế chọn ảnh, báo rõ chưa kiểm tra trực quan trên trang. Không báo đã xem trang nếu chỉ kiểm tra HTML.
- Không chạy TypeScript/test ứng dụng chỉ vì đổi file ảnh; chạy kiểm tra phù hợp nếu có sửa code hiển thị.

## Báo lại

Nêu ảnh/file đã tạo, thông điệp và lý do chọn cách thể hiện, kết quả kiểm tra thumbnail và hai ngôn ngữ, đường dẫn xem thử, điểm còn cần người dùng xem. Không cần dán toàn bộ brief/prompt vào chat nếu đã lưu file. Không kết luận "chất lượng cao" chỉ vì đã sinh đủ ảnh.
