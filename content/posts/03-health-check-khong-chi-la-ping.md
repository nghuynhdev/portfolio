---
title: "Health check: vì sao /ping trả về pong vẫn chưa nói lên điều gì"
seoTitle: "Health check đúng cách: không chỉ là /ping"
slug: health-check-khong-chi-la-ping
description: "Endpoint /ping chỉ cho biết process còn chạy. Bài này giải thích health check đúng nghĩa, liveness khác readiness thế nào, và cách làm với NestJS Terminus."
keywords: "health check, liveness probe, readiness probe, NestJS Terminus, Spring Boot Actuator, ASP.NET Core health checks, Kubernetes probe, giám sát backend"
tags: "Backend, NestJS, Kubernetes, Monitoring"
date: 2026-11-13
---

# Health check: vì sao /ping trả về pong vẫn chưa nói lên điều gì

Hầu như dự án backend nào cũng có một endpoint kiểu này:

```ts
@Get('ping')
ping() {
  return 'pong'
}
```

Gọi vào thấy `pong` là yên tâm, màn hình giám sát hiện màu xanh. Rồi một tối nào đó Redis treo, người dùng bấm đặt hàng thì báo lỗi liên tục, còn màn hình giám sát vẫn xanh. Không ai được báo động cho tới khi khách nhắn vào fanpage.

Endpoint `/ping` không sai. Nó chỉ trả lời một câu hỏi rất hẹp, và người ta hay hiểu nhầm là nó trả lời câu hỏi rộng hơn.

## /ping thật ra đo cái gì

Nó cho biết đúng một điều: process còn sống và còn nhận được request HTTP.

Còn app có nói chuyện được với database không, Redis có phản hồi không, hàng đợi có kết nối không, bucket lưu ảnh có cho ghi không, thì `/ping` không hề hỏi tới. Một app mất hết các kết nối đó vẫn trả `pong` rất nhanh, vì trả một chuỗi cố định thì chẳng cần tới thứ gì.

Health check đúng nghĩa là đi hỏi từng thứ mà app phụ thuộc vào, gom kết quả lại, rồi trả lời bằng mã HTTP mà máy đọc được: 200 nếu ổn, 503 nếu không.

## Các framework đều có sẵn

Bạn không phải tự viết từ đầu. Tên gọi khác nhau nhưng ý tưởng như nhau: một đường dẫn, bên trong là danh sách các phép kiểm tra.

- **Spring Boot** có Actuator. Thêm thư viện là có `/actuator/health`. Database, Redis và dung lượng ổ đĩa được kiểm tra tự động nếu app có dùng. Kafka thì không nằm trong [danh sách có sẵn](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html), bạn phải tự viết một `HealthIndicator`. Chỉ cần một thành phần `DOWN` là cả endpoint trả 503.
- **ASP.NET Core** có sẵn middleware: gọi `AddHealthChecks()` rồi `MapHealthChecks("/healthz")`. Mặc định nó chưa kiểm tra thành phần nào, bạn khai báo thêm từng cái. Kiểm tra database cần cài thêm gói.
- **NestJS** có `@nestjs/terminus`, là thứ mình dùng và sẽ lấy làm ví dụ.

## Làm với NestJS Terminus

Cài gói:

```bash
npm install @nestjs/terminus
```

Terminus có sẵn một số indicator: TypeORM, Prisma, Mongoose, Sequelize, MikroORM cho database, HTTP để gọi thử một dịch vụ khác, cùng với bộ nhớ và ổ đĩa. Một controller cơ bản trông thế này:

```ts
import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus'
import { RedisHealthIndicator } from './redis.health'

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly redis: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.redis.isHealthy('redis'),
    ])
  }
}
```

Khi mọi thứ ổn, endpoint trả 200 với `"status": "ok"`. Khi có thành phần hỏng, nó trả 503, `status` chuyển thành `"error"` và thành phần hỏng nằm trong mục `error` của JSON.

Redis không có indicator sẵn, nên phải tự viết. Theo [tài liệu của Terminus](https://docs.nestjs.com/recipes/terminus), cách hiện tại là dùng `HealthIndicatorService`:

```ts
import { Inject, Injectable } from '@nestjs/common'
import { HealthIndicatorService } from '@nestjs/terminus'
import type Redis from 'ioredis'

@Injectable()
export class RedisHealthIndicator {
  constructor(
    @Inject('REDIS') private readonly redis: Redis,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string) {
    const indicator = this.healthIndicatorService.check(key)
    try {
      await withTimeout(this.redis.ping(), 1000)
      return indicator.up()
    } catch (error) {
      return indicator.down({ message: (error as Error).message })
    }
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`timeout after ${ms}ms`)), ms)),
  ])
}
```

Hàm `withTimeout` không phải để cho đẹp. Một Redis bị treo thường không từ chối kết nối, nó chỉ im lặng. Lệnh `ping()` khi đó chờ mãi, kéo theo cả endpoint health chờ mãi, và hệ thống giám sát ghi nhận một request quá hạn thay vì một câu trả lời rõ ràng. Mỗi phép kiểm tra phải có giới hạn thời gian riêng, ngắn hơn giới hạn của bên gọi.

## Liveness và readiness: hai câu hỏi khác nhau

Tới đây nhiều người dừng lại: một endpoint `/health` kiểm tra đủ thứ, đưa cho Kubernetes dùng cho mọi loại probe. Đây là chỗ dễ tự gây sự cố.

Kubernetes hỏi hai câu, và phản ứng với mỗi câu rất khác nhau:

- **Liveness:** app có bị kẹt cứng không? Nếu probe này hỏng quá số lần cho phép, Kubernetes khởi động lại container.
- **Readiness:** app có sẵn sàng nhận request không? Nếu hỏng, pod bị rút khỏi danh sách nhận traffic. Container không bị khởi động lại.

Giờ thử nghĩ: nếu liveness cũng kiểm tra Redis, thì khi Redis sập, toàn bộ pod của bạn bị khởi động lại, hết lượt này tới lượt khác. Khởi động lại app không sửa được Redis. Bạn chỉ có thêm một sự cố thứ hai chồng lên sự cố đầu.

Tài liệu Spring Boot nói thẳng rằng liveness probe không nên phụ thuộc vào health check của hệ thống bên ngoài. [Tài liệu Kubernetes](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/) cũng cảnh báo liveness cấu hình sai có thể gây lỗi dây chuyền, và nó chỉ nên báo hỏng với những lỗi không tự phục hồi được như deadlock.

Nên mình tách làm hai đường dẫn:

```ts
@Get('live')
@HealthCheck()
live() {
  // Chỉ cần process trả lời được là đủ. Không hỏi tới thứ gì bên ngoài.
  return this.health.check([])
}

@Get('ready')
@HealthCheck()
ready() {
  return this.health.check([
    () => this.db.pingCheck('database'),
    () => this.redis.isHealthy('redis'),
  ])
}
```

Và khai báo tương ứng trong Kubernetes:

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 3000
readinessProbe:
  httpGet:
    path: /health/ready
    port: 3000
```

Buồn cười ở chỗ `/health/live` gần như chính là `/ping` ban đầu. Vậy là `/ping` vẫn có chỗ dùng, miễn là dùng đúng câu hỏi.

## Không phải thứ gì cũng đáng đưa vào readiness

Ngay cả readiness cũng cần chọn lọc. Câu hỏi nên đặt cho từng phụ thuộc là: thiếu nó thì app còn làm được việc gì không?

Database chính thì gần như chắc chắn nên kiểm tra, vì mất nó là mọi request đều lỗi. Nhưng nếu kho ảnh chỉ phục vụ chức năng đổi ảnh đại diện, mà bạn rút cả pod khỏi traffic vì kho ảnh trục trặc, thì người dùng mất luôn cả những chức năng đang chạy tốt.

Còn một trường hợp nữa: phụ thuộc dùng chung cho mọi pod. Khi nó hỏng, tất cả pod cùng báo chưa sẵn sàng, và không còn pod nào nhận request. Người dùng thấy lỗi gateway trống trơn thay vì một thông báo lỗi tử tế từ app. Với những phụ thuộc như vậy, nhiều khi để app tự trả lỗi có nội dung lại tốt hơn.

Mấy phụ thuộc không sống còn thì vẫn nên theo dõi, nhưng ở một endpoint riêng cho hệ thống giám sát và cảnh báo, không gắn vào probe.

## Mấy chỗ hay bị bỏ sót

- **Đừng để lộ chi tiết ra ngoài.** JSON của health check kể tên từng thành phần hạ tầng và thông báo lỗi, rất có ích cho kẻ đi dò hệ thống. Spring Boot mặc định ẩn phần chi tiết. Với NestJS bạn tự lo: chỉ mở endpoint trong mạng nội bộ, hoặc chặn ở tầng gateway.
- **Health check cũng tốn tài nguyên.** Probe chạy vài giây một lần trên mỗi pod. Phép kiểm tra chỉ nên là một lệnh rẻ như `SELECT 1` hay `PING`, đừng chạy truy vấn thật.
- **Kết nối được chưa chắc là làm việc được.** `PING` thành công không có nghĩa là tài khoản còn quyền ghi. Nếu quyền truy cập là thứ hay hỏng ở hệ thống của bạn, hãy kiểm tra đúng thao tác đó.
- **Tắt app cho êm.** Terminus có tùy chọn `gracefulShutdownTimeoutMs` để app báo chưa sẵn sàng một lúc trước khi dừng hẳn, cho load balancer kịp ngừng gửi request. Nhớ bật shutdown hooks thì nó mới nhận được tín hiệu.

## Tóm lại một câu

`/ping` trả lời "process còn sống không", và đó là câu hỏi đúng cho liveness. Còn "app có phục vụ được người dùng không" là câu hỏi khác, phải đi hỏi từng phụ thuộc quan trọng, có giới hạn thời gian, và trả lời ở một đường dẫn riêng cho readiness.

Chuyện đặt giới hạn thời gian và xử lý khi phụ thuộc bên ngoài chậm mình có viết kỹ hơn trong bài về [timeout, retry và fallback](/ai-for-devs/do-tin-cay-llm-timeout-retry-idempotency). Bài đó nói về LLM nhưng nguyên tắc dùng được cho mọi dịch vụ bên ngoài. Còn nếu bạn muốn biết mình đã làm backend ở những dự án nào thì xem [phần kinh nghiệm trên trang chủ](/#experience).
