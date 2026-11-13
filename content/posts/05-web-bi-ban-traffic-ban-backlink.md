---
title: "Web bị bắn traffic, bắn backlink: nhận biết và xử lý sao cho đúng"
seoTitle: "Web bị bắn traffic, bắn backlink: xử lý thế nào?"
slug: web-bi-ban-traffic-ban-backlink
description: "Bắn traffic và bắn backlink là hai kiểu chơi xấu để kéo web đối thủ rớt hạng. Bài này chỉ cách nhận biết, kiểm tra Manual Actions, chặn bot bằng Cloudflare và khi nào mới nên dùng Disavow."
keywords: "bắn traffic, bắn backlink, negative SEO, SEO bẩn, Manual Actions, Disavow links, Bot Fight Mode, Cloudflare chặn bot, web rớt top Google"
tags: "SEO, Security, Cloudflare, Web"
date: 2026-11-13
---

# Web bị bắn traffic, bắn backlink: nhận biết và xử lý sao cho đúng

Có một kiểu cạnh tranh không cần sản phẩm tốt hơn, giá rẻ hơn hay bài viết hay hơn. Người ta chỉ cần kéo web của bạn xuống để web họ nhích lên. Dân SEO gọi chung là negative SEO, còn ở Việt Nam hay gọi theo cách làm: **bắn traffic** và **bắn backlink**.

Người bị thường là chủ shop, chủ doanh nghiệp nhỏ. Họ không rành kỹ thuật, một sáng thấy đơn hàng im bặt, lên Google tìm không thấy web mình đâu. Lúc hoảng là lúc dễ làm sai nhất: trả tiền cho dịch vụ "gỡ phạt cấp tốc", hoặc tự tay từ chối hàng loạt link và làm web tụt thêm.

Bài này đi qua từng bước: hai kiểu tấn công là gì, nhìn vào đâu để biết, và việc nào nên làm, việc nào không.

## Hai kiểu chơi xấu

**Bắn traffic** là thả một đàn bot vào web. Mục đích trước mắt là làm server quá tải, web chậm hoặc sập. Khách vào không được, Googlebot vào thu thập dữ liệu cũng gặp lỗi.

**Bắn backlink** là tạo ra hàng trăm, hàng nghìn link từ các trang rác trỏ về web bạn, thường kèm từ khóa cờ bạc hoặc nội dung người lớn. Kẻ làm trò này mong Google nghĩ rằng chính bạn đi mua link và phạt bạn.

Hai kiểu khác nhau về cách làm nên cách xử lý cũng khác nhau. Gộp chung lại rồi xử lý một kiểu là dễ sai.

## Trước hết: có chắc là bị tấn công không

Rớt hạng có rất nhiều nguyên nhân, và phần lớn không phải do ai hại mình. Google cập nhật thuật toán, đối thủ ra nội dung tốt hơn, web vừa đổi giao diện làm hỏng thẻ tiêu đề, hoặc server chập chờn mấy ngày liền.

Vậy nên hãy xem bằng chứng trước khi kết luận. Có hai chỗ để xem.

**Trong Google Analytics:** lượt truy cập tăng vọt bất thường, tới từ một vài quốc gia hoặc nguồn lạ, và gần như ai vào cũng thoát ngay. Người thật không hành xử đồng loạt như thế.

**Trong Search Console, mục Links:** danh sách trang trỏ về xuất hiện nhiều tên miền lạ hoắc, không liên quan gì tới ngành của bạn, tăng nhanh trong thời gian ngắn.

Thấy một trong hai dấu hiệu này thì mới đáng nghi. Còn nếu cả hai đều bình thường, hãy quay lại tìm nguyên nhân ở chính web mình.

## Bị bắn backlink: đừng hoảng

Đây là tin tốt mà ít người biết. Google nói rõ trong [tài liệu về công cụ Disavow](https://support.google.com/webmasters/answer/2648487) rằng trong hầu hết trường hợp, họ tự đánh giá được link nào đáng tin mà không cần bạn hướng dẫn, và đa số trang web không cần dùng tới công cụ này.

Nghĩ một chút thì cũng hợp lý. Nếu link rác trỏ về là đủ để một trang bị phạt, thì ai cũng hạ được đối thủ chỉ bằng vài chục nghìn tiền mua link. Google buộc phải xử lý chuyện này từ lâu, và cách của họ là bỏ qua link rác thay vì trừng phạt trang nhận link.

### Xem mình có bị phạt thật không

Vào Search Console, mở mục **Manual Actions** (Thao tác thủ công).

Thao tác thủ công là khi một nhân viên của Google xem xét và xác định trang vi phạm chính sách chống spam. Nếu có, nó được ghi rõ ở đây kèm lý do. Nếu không có, bạn thấy một dấu tích xanh và dòng thông báo không phát hiện vấn đề.

Dấu tích xanh nghĩa là bạn **chưa bị phạt thủ công**. Lúc này ai gọi điện hứa "gỡ phạt trong 48 giờ" là đang bán một thứ bạn không cần.

### Khi nào mới dùng Disavow

Disavow là công cụ để nói với Google: "đừng tính những link này cho tôi". Nghe thì có vẻ cứ dùng cho chắc, nhưng Google ghi điều kiện rất hẹp. Chỉ nên dùng khi có đủ cả hai:

1. Có một lượng đáng kể link rác, link giả tạo hoặc kém chất lượng trỏ về trang, và
2. Những link đó đã gây ra thao tác thủ công, hoặc nhiều khả năng sẽ gây ra.

Google cũng cảnh báo đây là tính năng nâng cao, dùng sai có thể làm hại kết quả tìm kiếm của chính bạn. Lý do dễ hiểu: người không rành rất dễ từ chối nhầm cả những link tốt đang giúp web lên hạng.

Nếu Manual Actions thật sự báo "Unnatural links to your site", quy trình Google hướng dẫn là:

1. Tải danh sách link về từ Search Console.
2. Lọc ra những link vi phạm, bắt đầu từ các trang trỏ về nhiều nhất và các link mới xuất hiện.
3. Liên hệ chủ các trang đó nhờ gỡ. Với trang rác thì thường không ai trả lời, nhưng cứ ghi lại là mình đã thử.
4. Phần không gỡ được thì đưa vào file disavow.
5. Bấm Request Review và kể lại những gì đã làm.

File disavow là một file `.txt`, mỗi dòng một tên miền hoặc một URL:

```text
# Link rác xuất hiện từ ngày 10/11
domain:trang-rac-vi-du.xyz
domain:mot-trang-khac.top
https://vi-du.com/bai-viet-spam.html
```

Sau khi tải lên, Google cần vài tuần để áp dụng. Việc xét duyệt lại cũng tính bằng ngày tới tuần. Không có đường nào "cấp tốc".

## Bị bắn traffic: chặn ở cửa

Trước hết nói về tác hại thật của nó. Nhiều người lo rằng bot vào rồi thoát ngay làm tỷ lệ thoát tăng, và Google nhìn thấy sẽ đánh tụt hạng. Người của Google đã nhiều lần nói họ không dùng dữ liệu Google Analytics để xếp hạng.

Tác hại thật nằm ở chỗ khác:

- **Server quá tải.** Web chậm hoặc trả lỗi. Khách thật bỏ đi, và nếu Googlebot liên tục gặp lỗi khi vào thu thập, thứ hạng bị ảnh hưởng thật.
- **Số liệu bị nhiễu.** Bạn không còn biết chiến dịch nào hiệu quả vì lượt truy cập thật lẫn trong lượt ảo.
- **Tốn tiền.** Băng thông, tài nguyên server, và cả tiền quảng cáo nếu bot bấm vào quảng cáo.

### Bật Bot Fight Mode trên Cloudflare

Nếu web đã chạy qua Cloudflare, gói Free có sẵn một lớp chặn bot. Theo [tài liệu của Cloudflare](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/), cách bật như sau:

1. Vào **Security**, chọn **Settings**.
2. Lọc theo **Bot traffic**.
3. Tìm **Bot fight mode** và bật lên.

Nó nhận diện những request khớp với mẫu bot đã biết và bắt chúng giải một bài toán tốn CPU. Người dùng thật gần như không nhận ra, còn kẻ chạy bot thì mỗi request tốn kém hơn hẳn.

### Bật xong phải thử lại ngay

Phần này hay bị bỏ qua, và nó có thể gây thiệt hại còn hơn cả bị tấn công.

Bot Fight Mode ở gói Free áp dụng cho toàn bộ tên miền, và **không tạo ngoại lệ được**. Tài liệu ghi rõ: các rule dạng Skip hay Allow không có tác dụng với nó. Nó cũng có thể thách thức cả lưu lượng API và ứng dụng di động.

Nghĩa là những thứ tự động mà web bạn cần cũng có thể bị chặn theo: cổng thanh toán gọi về báo đơn đã trả tiền, app di động gọi API, công cụ giám sát uptime. Web vẫn mở bình thường trên trình duyệt, nhưng đơn hàng không chuyển sang trạng thái đã thanh toán.

Nên ngay sau khi bật, hãy tự làm một lượt:

- Đăng nhập và đăng ký tài khoản.
- Đặt một đơn và thanh toán thử tới bước cuối, kiểm tra đơn có được cập nhật không.
- Mở app di động nếu có.
- Kiểm tra các tích hợp bên thứ ba còn chạy không.

Hỏng chỗ nào thì tắt đi và chuyển sang cách bên dưới, hoặc cân nhắc gói trả phí có Super Bot Fight Mode, loại này cho phép tạo ngoại lệ.

### Chặn đúng nguồn bằng Custom Rule

Khi biết lượt truy cập ảo dồn về từ đâu, chặn đúng chỗ đó tốt hơn là siết toàn bộ. Gói Free cho tạo 5 custom rule.

Vào phần quy tắc bảo mật của Cloudflare, tạo một custom rule mới, chọn hành động **Managed Challenge**. Hành động này bắt người truy cập qua một bước xác minh: người thật qua được, bot đơn giản thì không. Biểu thức điều kiện viết theo nguồn bạn thấy trong số liệu, ví dụ theo quốc gia:

```text
(ip.src.country eq "XX")
```

hoặc theo nhà mạng, nếu bot tới từ cùng một hệ thống máy chủ:

```text
(ip.src.asnum eq 12345)
```

Đừng dùng Block với cả một quốc gia nếu bạn có khách thật ở đó. Managed Challenge là lựa chọn an toàn hơn vì người thật vẫn vào được.

Một lưu ý: tất cả những điều trên chỉ có tác dụng khi lưu lượng thật sự đi qua Cloudflare. Nếu web chạy trên nền tảng khác thì dùng tường lửa của nền tảng đó, nguyên tắc vẫn vậy: nhận diện nguồn, thách thức thay vì chặn hẳn, rồi thử lại các luồng quan trọng.

## Những việc không nên làm

- **Trả tiền cho dịch vụ gỡ phạt khi chưa xem Manual Actions.** Không có thông báo phạt thì không có gì để gỡ.
- **Disavow hàng loạt cho yên tâm.** Bạn có thể tự tay bỏ đi những link đang giúp mình.
- **Chặn hẳn cả dải IP hoặc cả quốc gia khi chưa xem số liệu.** Bạn chặn luôn khách của mình.
- **Bắn lại đối thủ.** Ngoài chuyện đạo đức, link bạn mua để hại người khác có khi còn bị Google bỏ qua, tiền mất mà không được gì.

## Thứ tự xử lý, gọn lại

1. Mở Analytics và mục Links trong Search Console, xem có dấu hiệu bất thường thật không.
2. Mở Manual Actions. Thấy tích xanh thì chưa bị phạt, không làm gì thêm với link.
3. Nếu có thông báo phạt vì link: lọc link, nhờ gỡ, disavow phần còn lại, gửi yêu cầu xét lại.
4. Nếu bị bot: bật Bot Fight Mode hoặc tạo custom rule đúng nguồn, rồi thử lại đăng nhập và thanh toán.
5. Theo dõi vài tuần. Thứ hạng không hồi ngay trong một đêm.

Làm ăn tử tế thì không cần chơi bẩn, nhưng nên biết web mình đang được bảo vệ tới đâu. Nếu bạn muốn rà lại phần SEO kỹ thuật của web cho chắc, mình có viết cách [audit một trang web bằng Claude SEO](/ai-for-devs/claude-seo-audit-website). Còn nếu cần người xem giúp trực tiếp thì [nhắn cho mình ở trang chủ](/#contact).
