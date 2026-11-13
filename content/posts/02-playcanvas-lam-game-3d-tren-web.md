---
title: "PlayCanvas: làm game 3D ngay trong trình duyệt mà không cần cài gì"
seoTitle: "PlayCanvas là gì? Làm game 3D trên trình duyệt"
slug: playcanvas-lam-game-3d-tren-trinh-duyet
description: "PlayCanvas là engine 3D mã nguồn mở có editor chạy trên trình duyệt. Nó gồm những gì, nặng bao nhiêu, mạnh ở đâu và khi nào nên chọn thay cho Three.js."
keywords: "PlayCanvas, PlayCanvas là gì, game 3D trên web, WebGL, WebGPU, Gaussian Splatting, SuperSplat, so sánh Three.js PlayCanvas"
tags: "PlayCanvas, WebGL, WebGPU, Game Dev"
date: 2026-11-13
cover: /images/blog/posts/02-playcanvas-lam-game-3d-tren-web-v2.webp
---

# PlayCanvas: làm game 3D ngay trong trình duyệt mà không cần cài gì

PlayCanvas là một engine 3D viết cho web, đi kèm một editor mở bằng đường link. Lý do nó đáng để ý khá cụ thể.

Làm 3D bằng Three.js thì mọi thứ nằm trong code. Muốn dời một cái đèn sang trái, bạn sửa một con số, lưu, chờ trang tải lại, nhìn, rồi sửa tiếp. Một cảnh nhỏ thì chịu được. Một game vài chục cảnh, lại có người làm đồ họa không viết code, thì không. Unity giải quyết chuyện đó bằng editor, nhưng bản build cho web của Unity nặng, mà người chơi web thì không chờ.

PlayCanvas đi hướng khác: engine viết riêng cho trình duyệt, còn editor thì chạy luôn trên trình duyệt.

## PlayCanvas gồm hai phần

Người ta hay gọi chung một tên, nhưng thật ra có hai thứ tách biệt.

**Engine** là một thư viện JavaScript để vẽ 3D. Cài bằng `npm install playcanvas`, giấy phép MIT, mã nguồn nằm trên [GitHub](https://github.com/playcanvas/engine). Ngoài phần vẽ, nó có sẵn vật lý, animation, âm thanh, xử lý input và WebXR cho kính VR. Bạn dùng engine mà không đụng tới editor cũng được.

**Editor** là công cụ dựng cảnh chạy hoàn toàn trên trình duyệt. Mở một đường link là thấy cây đối tượng bên trái, khung nhìn 3D ở giữa, bảng thuộc tính bên phải. Ai từng mở Unity sẽ thấy quen ngay. Khác ở chỗ không phải tải hay cài gì, và dự án tự lưu lên cloud.

## Nhiều người sửa chung một cảnh

Cả nhóm mở cùng một cảnh và sửa cùng lúc được, giống cách người ta làm việc chung trên một file thiết kế.

Theo [tài liệu chính thức](https://developer.playcanvas.com/user-manual/editor/), bạn thấy được người khác đang nhìn vào đâu trong cảnh, và có khung chat ngay bên trong. Người làm đồ họa chỉnh ánh sáng trong lúc lập trình viên viết script, không ai phải chờ ai gửi file.

Mấy thứ đi kèm cũng đủ dùng cho một dự án nghiêm túc:

- Quản lý phiên bản làm riêng cho dự án 3D: checkpoint để quay lại, branch để thử tính năng, merge có giao diện xử lý xung đột.
- Trình soạn code trong trình duyệt, có gợi ý và báo lỗi. Ai quen VS Code thì có extension để làm ở máy.
- Nút Launch mở bản đang làm ở một tab mới. Gửi đường link đó sang điện thoại là test được trên thiết bị thật.
- Xuất bản ra web (dùng hosting của PlayCanvas hoặc tự host), app iOS và Android, bản desktop, và cả dạng quảng cáo chơi được.

## Engine nặng bao nhiêu

Trên mạng hay gặp con số "runtime chỉ khoảng 200 KB". Mình tải bản build về đo thì không phải vậy.

Với bản 2.24.1 trên npm, file `playcanvas.min.js` nặng khoảng 2,9 MB. Sau khi nén gzip, tức là dung lượng thật sự đi qua mạng, còn khoảng 750 KB. Đó là bản đầy đủ mọi tính năng. Engine hỗ trợ tree-shaking, nên một dự án thật chỉ đóng gói những phần nó dùng và sẽ nhẹ hơn con số này.

Để dễ hình dung, mình đo Three.js theo cùng cách: hai file build chính cộng lại khoảng 195 KB sau khi nén. Three.js nhẹ hơn hẳn, nhưng nó chỉ lo phần vẽ. Vật lý, âm thanh, quản lý tài nguyên bạn phải tự ghép thêm thư viện.

Với một game, 750 KB không phải là nặng. Một file nhạc nền hay vài texture đã cỡ đó rồi, và nó vẫn nhỏ hơn nhiều so với bản build WebGL của Unity. Cứ nhớ con số đúng là được: vài trăm KB tới dưới 1 MB cho engine, chứ không phải 200 KB.

## WebGL2 và WebGPU

Engine chạy được trên cả hai. Trình duyệt nào có WebGPU thì dùng WebGPU, không có thì tự lùi về WebGL2, bạn không phải viết hai phiên bản. PlayCanvas là một trong những engine đầu tiên đưa WebGPU vào dùng thật, kể cả compute shader.

Về tốc độ, đừng tin lời hứa kiểu "luôn 60 khung hình trên điện thoại" của bất kỳ engine nào. Tốc độ khung hình do cảnh của bạn quyết định: bao nhiêu tam giác, bao nhiêu đèn, texture nặng cỡ nào. Engine chỉ quyết định bạn bắt đầu từ mức nào, và ở điểm này PlayCanvas được thiết kế cho thiết bị yếu ngay từ đầu.

## Gaussian Splatting và SuperSplat

PlayCanvas đầu tư vào mảng này khá sớm.

Gaussian Splatting là cách dựng lại một không gian thật từ ảnh chụp hoặc video. Thay vì lưới tam giác, cảnh được tạo từ hàng triệu đốm màu mờ xếp chồng lên nhau. Kết quả nhìn rất giống ảnh thật, nhất là ở những thứ khó dựng bằng tam giác như tán cây, tóc hay mặt kính.

Engine đọc và vẽ được splat sẵn, không cần plugin. Đi kèm là [SuperSplat](https://github.com/playcanvas/supersplat), một công cụ miễn phí và cũng mã nguồn mở, dùng để cắt gọt, dọn nhiễu và tối ưu splat ngay trên trình duyệt trước khi đưa lên web. Bản 3.0 gần đây được viết lại trên WebGPU.

Nếu bạn làm bất động sản, bảo tàng hay showroom và muốn khách "đi dạo" trong một không gian đã quét bằng điện thoại, đây là lý do đủ để thử PlayCanvas.

## Người ta dùng nó vào việc gì

Danh sách người dùng trong README của engine có BMW, Disney, Samsung, Snap, King, Zynga, Miniclip. Nhìn vào [các dự án họ giới thiệu](https://playcanvas.com/industries/games) thì thấy ba nhóm việc chính:

- **Game chơi ngay trên nền tảng có sẵn:** Snapchat, Facebook Instant Games, YouTube Playables, và các cổng game web như CrazyGames hay Poki. Ở đây người chơi bấm vào là phải chơi được liền, nên tải nhanh là điều kiện bắt buộc.
- **Quảng cáo chơi được và trang cấu hình sản phẩm:** kiểu xoay một chiếc xe, đổi màu sơn, đổi mâm ngay trên web.
- **Không gian quét thực tế:** nhờ phần Gaussian Splatting ở trên.

## Thử một khối hộp xoay

Đoạn dưới đây rút gọn từ ví dụ trong README, chỉ dùng engine, không cần Editor:

```js
import { Application, Color, Entity, FILLMODE_FILL_WINDOW, RESOLUTION_AUTO } from 'playcanvas'

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)

const app = new Application(canvas)
app.setCanvasFillMode(FILLMODE_FILL_WINDOW)
app.setCanvasResolution(RESOLUTION_AUTO)

const box = new Entity('cube')
box.addComponent('render', { type: 'box' })
app.root.addChild(box)

const camera = new Entity('camera')
camera.addComponent('camera', { clearColor: new Color(0.1, 0.2, 0.3) })
camera.setPosition(0, 0, 3)
app.root.addChild(camera)

const light = new Entity('light')
light.addComponent('light')
light.setEulerAngles(45, 0, 0)
app.root.addChild(light)

app.on('update', (dt) => box.rotate(10 * dt, 20 * dt, 30 * dt))
app.start()
```

Mọi thứ trong cảnh là một `Entity`, muốn nó làm gì thì gắn component vào. Hộp có component `render`, camera có component `camera`, đèn có component `light`. Mô hình này giống Unity và rất hợp khi cảnh lớn dần. Với Three.js, bạn tự ghép scene, camera, renderer và tự viết vòng lặp vẽ.

## Chọn PlayCanvas hay Three.js

Hai thứ này không hẳn là đối thủ, chúng hợp với hai kiểu việc khác nhau.

Chọn **PlayCanvas** khi bạn làm game hoặc một trải nghiệm 3D có nhiều cảnh, và trong nhóm có người không viết code. Editor giúp họ tự chỉnh cảnh, còn bạn khỏi phải làm trung gian cho từng thay đổi nhỏ.

Chọn **Three.js** khi bạn chỉ cần một chút 3D trong một trang web có sẵn: mô hình sản phẩm xoay được, hiệu ứng nền, biểu đồ 3D. Nó nhẹ hơn, và nếu đang dùng React thì React Three Fiber cho phép viết cảnh 3D như viết component. Phần nền hạt ở [trang chủ của mình](/) dùng đúng bộ đó.

## Chi phí

Engine là MIT, dùng tự do kể cả cho sản phẩm thương mại.

Editor là dịch vụ. Gói miễn phí cho bạn dự án công khai không giới hạn, 1 GB lưu trữ và hosting. Chữ "công khai" là điểm cần để ý: ai cũng xem được dự án của bạn. Muốn dự án riêng tư thì phải lên gói trả phí.

Nên cách thử hợp lý là thế này: mở Editor bằng gói miễn phí, dựng thử một cảnh nhỏ để xem cách làm việc có hợp với nhóm không. Nếu chỉ cần engine thì cài qua npm và dùng như mọi thư viện JavaScript khác.
