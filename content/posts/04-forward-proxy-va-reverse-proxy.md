---
title: "Forward proxy và reverse proxy: khác nhau ở chỗ nó làm việc cho ai"
seoTitle: "Forward proxy và reverse proxy khác nhau thế nào?"
slug: forward-proxy-va-reverse-proxy
description: "Forward proxy đứng về phía client, reverse proxy đứng về phía server. Mỗi loại làm gì, HTTPS đi qua proxy ra sao, và lỗi req.ip khi app Node.js nằm sau Nginx."
keywords: "forward proxy, reverse proxy, proxy là gì, Nginx reverse proxy, X-Forwarded-For, trust proxy Express, load balancer, VPN khác proxy"
tags: "Networking, Nginx, Backend, Node.js"
date: 2026-11-13
cover: /images/blog/posts/04-forward-proxy-va-reverse-proxy-v2.webp
---

# Forward proxy và reverse proxy: khác nhau ở chỗ nó làm việc cho ai

Lần đầu đưa một app Node.js lên server thật, kiểu gì bạn cũng gặp chữ "reverse proxy": hướng dẫn nào cũng bảo đặt Nginx phía trước. "Forward proxy" thì thường gặp ở chỗ khác hẳn, trong phần cài đặt mạng của máy công ty. Tên gần giống nhau, và vẽ ra giấy thì cả hai đều là một cái hộp nằm giữa client và server.

Chúng khác nhau ở một điểm: **cái hộp đó do ai dựng lên, và nó làm việc cho ai.**

## Proxy chỉ là người đứng giữa

Proxy là một máy nhận request từ bên này rồi thay mặt gửi sang bên kia. Bên nhận chỉ thấy proxy, không thấy bên gửi thật.

Về kỹ thuật, forward proxy và reverse proxy làm cùng một việc: nhận request, chuyển tiếp, trả response về. Có phần mềm làm được cả hai vai. Thứ khác nhau là vị trí của nó trong mối quan hệ: nó thuộc về phía người dùng hay phía dịch vụ.

## Forward proxy: người đại diện của client

Forward proxy do phía client dựng lên, thường là công ty hoặc trường học. Máy tính trong mạng nội bộ không ra thẳng internet mà đi qua proxy.

Từ góc nhìn của trang web, người truy cập là proxy. Trang web thấy địa chỉ IP của proxy chứ không thấy máy của bạn. Vì vậy forward proxy **che client**.

Người ta dùng nó để:

- Chặn một số trang, ví dụ mạng xã hội trong giờ làm.
- Ghi lại ai truy cập gì, phục vụ kiểm tra an ninh.
- Lưu đệm nội dung hay được tải, đỡ tốn băng thông.
- Gom toàn bộ truy cập ra ngoài về một vài địa chỉ IP cố định, để đối tác chỉ cần cho phép các IP đó.

Client **biết** là mình đang dùng proxy: trình duyệt hoặc hệ điều hành phải được cấu hình để gửi request qua đó.

### HTTPS đi qua forward proxy thế nào

Nếu mọi thứ đã mã hóa thì proxy chuyển tiếp kiểu gì?

Trình duyệt gửi cho proxy một request đặc biệt dùng phương thức `CONNECT`:

```http
CONNECT example.com:443 HTTP/1.1
Host: example.com:443
```

Proxy mở một kết nối TCP tới `example.com`, rồi chuyển dữ liệu qua lại giữa hai bên mà không đọc. Theo [mô tả của MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/CONNECT), proxy chuyển tiếp "một cách mù" cho tới khi đường hầm đóng lại. Bước bắt tay TLS diễn ra trực tiếp giữa trình duyệt và trang web, bên trong đường hầm đó.

Kết quả là proxy biết bạn vào **trang nào** nhưng không đọc được **nội dung**. Chặn theo tên miền thì làm được, đọc mật khẩu của bạn thì không.

Có một ngoại lệ: công ty cài chứng chỉ gốc của họ lên máy nhân viên. Khi đó proxy tự giải mã, xem nội dung, rồi mã hóa lại. Máy công ty cấp thường thuộc trường hợp này, nên đừng mặc định rằng HTTPS trên máy công ty là riêng tư.

### VPN có phải forward proxy không

Gần giống về kết quả, khác về cách làm.

Cả hai đều khiến trang web thấy một địa chỉ IP khác thay cho IP của bạn. Nhưng forward proxy làm việc ở tầng ứng dụng, thường chỉ với HTTP và HTTPS, và từng ứng dụng phải được cấu hình để đi qua nó. VPN làm việc ở tầng mạng: nó tạo một đường hầm mã hóa và đẩy toàn bộ lưu lượng của máy qua đó, ứng dụng không cần biết gì.

Tương tự, khi wifi trường chặn YouTube thì chưa chắc đó là forward proxy. Nhiều nơi chặn bằng DNS hoặc tường lửa, cách làm khác nhưng người dùng thấy kết quả như nhau.

## Reverse proxy: người gác cổng của server

Reverse proxy do phía dịch vụ dựng lên. Người dùng gọi vào một địa chỉ duy nhất, ví dụ `api.example.com`. Đằng sau địa chỉ đó là Nginx, một load balancer của nhà cung cấp cloud, hoặc Cloudflare. Nó nhận request rồi quyết định chuyển cho server nào xử lý.

Người dùng không biết phía sau có bao nhiêu server, địa chỉ là gì, đang chạy phần mềm nào. Vì vậy reverse proxy **che server**.

Và khác với forward proxy, client **không biết** là có proxy. Với client, reverse proxy chính là server.

Vì mọi request đều phải đi qua nó, đây là chỗ tiện nhất để đặt các việc dùng chung:

- **Cân bằng tải:** chia request cho nhiều server, bỏ qua server đang hỏng.
- **Kết thúc TLS:** giải mã HTTPS ở proxy, bên trong mạng nội bộ đi HTTP thường. Chứng chỉ chỉ cần quản lý ở một chỗ.
- **Lưu đệm:** trả luôn nội dung tĩnh mà không cần hỏi server phía sau.
- **Giới hạn tần suất:** chặn một địa chỉ gọi quá nhiều trước khi nó chạm tới ứng dụng.
- **Lọc tấn công:** chặn request độc hại, hấp thụ DDoS.
- **Định tuyến theo đường dẫn:** `/api` vào dịch vụ này, `/images` vào dịch vụ khác.

Khi bạn mở một trang web lớn, thứ bạn chạm vào gần như chắc chắn là reverse proxy chứ không phải server ứng dụng. [Trang portfolio này](/) cũng vậy: nó chạy trên Vercel, và request của bạn đi qua lớp mạng biên của họ trước khi tới được trang.

Một cấu hình Nginx tối thiểu trông thế này:

```nginx
upstream api {
  server 10.0.0.11:3000;
  server 10.0.0.12:3000;
}

server {
  listen 443 ssl;
  server_name api.example.com;

  location / {
    proxy_pass http://api;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Ba dòng `proxy_set_header` dẫn tới vấn đề thực tế nhất của bài này.

## Lỗi hay gặp: app Node.js sau reverse proxy thấy sai IP

Khi app nằm sau reverse proxy, kết nối TCP tới app là từ proxy chứ không phải từ người dùng. Hậu quả:

- `req.ip` trả về địa chỉ nội bộ của proxy, kiểu `10.0.0.5`, cho mọi request.
- Giới hạn tần suất theo IP coi tất cả người dùng là một, và chặn hết cùng lúc.
- `req.protocol` báo `http` dù người dùng đang vào bằng HTTPS, làm sai các đường dẫn chuyển hướng và cookie `secure`.

Proxy biết địa chỉ thật của người dùng, và nó báo lại cho app qua header: `X-Forwarded-For` chứa IP, `X-Forwarded-Proto` chứa giao thức gốc. App chỉ cần đọc các header đó. Với Express, bạn bật bằng thiết lập `trust proxy`:

```ts
app.set('trust proxy', 1)
```

NestJS dùng Express bên dưới thì viết thế này:

```ts
const app = await NestFactory.create<NestExpressApplication>(AppModule)
app.set('trust proxy', 1)
```

Số `1` nghĩa là tin đúng một lớp proxy đứng ngay trước app. Có hai lớp, ví dụ Cloudflare rồi tới Nginx, thì là `2`.

Đừng viết `app.set('trust proxy', true)` cho nhanh. Header là thứ client tự gửi được. Biến `$proxy_add_x_forwarded_for` của Nginx **nối thêm** IP thật vào sau giá trị client gửi lên chứ không ghi đè. Nếu app tin tất cả và lấy giá trị ngoài cùng bên trái, kẻ tấn công chỉ cần tự thêm header `X-Forwarded-For: 1.2.3.4` là đổi được IP của mình trong mắt app, và vượt qua giới hạn tần suất. [Tài liệu Express](https://expressjs.com/en/guide/behind-proxies.html) cảnh báo đúng điều này: nếu bật `true`, proxy cuối cùng phải xóa hoặc ghi đè các header đó, không thì client gửi giá trị nào cũng được.

Khai báo đúng số lớp proxy thì Express đếm từ phải sang, lấy đúng địa chỉ do proxy của bạn ghi vào, bỏ qua phần client tự bịa.

## Đặt cạnh nhau

| | Forward proxy | Reverse proxy |
|---|---|---|
| Ai dựng lên | Phía client (công ty, trường học) | Phía dịch vụ |
| Che ai | Client | Server |
| Bên kia thấy gì | Trang web thấy IP của proxy | Người dùng thấy một địa chỉ duy nhất |
| Client có biết không | Có, phải cấu hình | Không |
| Dùng để | Chặn trang, ghi log, lưu đệm | Cân bằng tải, TLS, lưu đệm, giới hạn tần suất, lọc tấn công |
| Ví dụ | Squid, proxy công ty | Nginx, HAProxy, Cloudflare, load balancer của cloud |

Với người viết backend, mục `trust proxy` là thứ nên mở dự án đang chạy ra kiểm tra lại ngay. Lỗi này không hiện ra ở máy local, vì ở đó chẳng có proxy nào đứng trước app.

Reverse proxy cũng là bên gọi health check của các server phía sau để biết nên chia request cho ai. Phần đó nằm ở bài [health check không chỉ là /ping](/blog/health-check-khong-chi-la-ping).
