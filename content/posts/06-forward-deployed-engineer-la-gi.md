---
title: "Forward Deployed Engineer là gì: công việc, kỹ năng và cái bẫy ít ai nói"
seoTitle: "Forward Deployed Engineer (FDE) là gì?"
slug: forward-deployed-engineer-la-gi
description: "Forward Deployed Engineer viết code ngay trong hệ thống của khách hàng. FDE khác kỹ sư phần mềm và consultant ở đâu, cần kỹ năng gì, khi nào không hợp."
keywords: "forward deployed engineer, FDE là gì, forward deployed software engineer, Palantir Delta, FDE OpenAI, FDE Anthropic, nghề lập trình AI, kỹ sư triển khai"
tags: "Career, Software Engineering, AI, Full Stack"
date: 2026-11-14
---

# Forward Deployed Engineer là gì: công việc, kỹ năng và cái bẫy ít ai nói

Mở trang tuyển dụng của OpenAI hay Anthropic lúc này, bạn sẽ thấy một chức danh không có trong giáo trình nào: Forward Deployed Engineer, gọi tắt là FDE. Lương cao, yêu cầu vài năm kinh nghiệm, và phần mô tả nghe vừa giống lập trình viên vừa giống người đi gặp khách.

FDE là kỹ sư phần mềm làm việc **bên trong** tổ chức của khách hàng, chịu trách nhiệm đưa sản phẩm của công ty mình chạy được thật trong hệ thống của họ. Họ không bán hàng, cũng không viết báo cáo tư vấn. Họ viết code, deploy, sửa lỗi production, chỉ là "production" ở đây nằm trong nhà người khác.

## Chức danh này đến từ Palantir

Palantir dùng mô hình này từ rất sớm và gọi tên nó rõ ràng. Trong bài [Dev versus Delta](https://blog.palantir.com/dev-versus-delta-demystifying-engineering-roles-at-palantir-ad44c2a6e87) (2019), họ giải thích hai vai trò kỹ sư lớn nhất của công ty: Software Engineer, gọi nội bộ là "Dev", và Forward Deployed Software Engineer, gọi là "Delta". Chữ Delta là tàn dư từ thời các nhóm phát triển kinh doanh được đặt tên theo bảng chữ cái NATO.

Dev xây nền tảng (Foundry, Gotham) để dùng cho nhiều khách. Delta thuộc khối Business Development, mỗi người gắn với một khách hàng, và được đo bằng kết quả trên mục tiêu của khách đó. Palantir tóm lại bằng một cặp đối xứng dễ nhớ: Dev là "một năng lực, nhiều khách hàng", Delta là "một khách hàng, nhiều năng lực".

Vài năm gần đây chức danh này lan ra khắp các công ty AI. a16z có hẳn một bài tên [Trading Margin for Moat](https://a16z.com/services-led-growth/) (6/2025) gọi đây là công việc hot nhất trong giới startup. Lý do họ đưa ra khá thực tế: doanh nghiệp mua sản phẩm AI cần nó nối vào database, API và quy trình nội bộ thì mới dùng được, và phần nối đó không tự làm được bằng một nút "Sign up".

## FDE làm gì mỗi ngày

Tin tuyển dụng là nguồn mô tả công việc đáng tin nhất, vì công ty phải viết đúng thứ họ cần.

Ở [tin FDE tại London của OpenAI](https://openai.com/careers/forward-deployed-engineer-london-london-uk/), FDE sở hữu cả vòng: tìm hiểu bài toán, xác định phạm vi kỹ thuật, thiết kế hệ thống, xây, và đưa lên production cùng đội kỹ thuật của khách. Thành công được đo bằng mức độ khách thật sự dùng trong production và tác động đo được lên quy trình. Tin này yêu cầu 5 năm kinh nghiệm trở lên có phần làm việc trực tiếp với khách, viết code production cả frontend lẫn backend, và đi công tác tới 50%.

[Tin FDE tại London của Anthropic](https://job-boards.greenhouse.io/anthropic/jobs/5423029008) cụ thể hơn về sản phẩm đầu ra: xây ứng dụng production với Claude trong hệ thống của khách, và giao các thành phần như MCP server, sub-agent, agent skill. Đi công tác 25 đến 50%.

Nếu bạn chưa rõ MCP server là gì thì bài [MCP là gì](/ai-for-devs/mcp-model-context-protocol-la-gi) giải thích phần đó. Nó đúng là loại việc một FDE ở công ty AI làm thường xuyên: viết lớp nối giữa model và hệ thống nội bộ của khách.

Gộp lại, một tuần của FDE thường xen giữa mấy kiểu việc. Có hôm ngồi với người dùng cuối của khách để xem họ làm việc thế nào. Có hôm viết code, review PR, debug một lỗi chỉ xảy ra trên hạ tầng của khách. Và có những buổi họp với đội sản phẩm bên mình để báo rằng tính năng X đang thiếu.

## Khác gì kỹ sư phần mềm, consultant, solutions engineer

Ba vai trò này hay bị nhập làm một với FDE.

| | Software Engineer | FDE | Consultant | Solutions Engineer |
|---|---|---|---|---|
| Làm cho ai | Sản phẩm, nhiều khách | Một khách cụ thể | Một khách cụ thể | Đội bán hàng |
| Đầu ra chính | Code trong sản phẩm lõi | Hệ thống chạy trong production của khách | Phân tích, khuyến nghị | Demo, PoC, trả lời câu hỏi kỹ thuật |
| Thời điểm | Liên tục | Sau khi ký, kéo dài | Theo dự án | Trước khi ký |
| Đo bằng | Chất lượng, tốc độ ra tính năng | Khách dùng thật, kết quả kinh doanh | Báo cáo được chấp nhận | Hợp đồng ký được |

Chỗ khác consultant được chính các Delta của Palantir nói rõ: consultant thường tạo ra một phân tích hay giải pháp một lần, còn FDE triển khai phần mềm có sẵn và để lại thứ khách tiếp tục dùng. Tức là FDE viết nhiều code hơn hẳn.

Với solutions engineer thì khác ở thời điểm. Solutions engineer giúp thắng hợp đồng. FDE làm cho hợp đồng đó không bị hủy năm sau.

Ranh giới giữa các công ty không chặt. Có nơi gọi solutions engineer là FDE cho dễ tuyển, có nơi gọi FDE là "implementation engineer". Đọc phần mô tả công việc, đừng đọc chức danh.

## Kỹ năng cần có

Phần kỹ thuật không có gì bí ẩn, chỉ rộng. Bạn phải đọc nhanh một codebase lạ, nối vào API và database của người khác, deploy lên hạ tầng mình không chọn. Tin của OpenAI ghi rõ cần viết code production cả frontend lẫn backend bằng Python, JavaScript hoặc tương đương, và đã từng xây hệ thống chạy bằng LLM.

Với người làm full stack theo hướng React, Next.js, Node.js, NestJS, phần lớn bộ kỹ năng đã có sẵn: dựng một giao diện nội bộ nhanh, viết service gọi API bên thứ ba, xử lý auth và phân quyền. Phần hay thiếu là đánh giá chất lượng đầu ra của model (bài về [evals cho LLM](/ai-for-devs/evals-do-chat-luong-llm) nói chuyện này) và làm hệ thống chịu được khi API của khách chậm hoặc trả lỗi.

Khó hơn là thứ Palantir gọi là "technical decomp": nhận một bài toán kinh doanh mơ hồ kiểu "giảm số sản phẩm lỗi trên dây chuyền", rồi bẻ nó ra cho tới từng dòng code cần viết. Bạn phải hỏi đúng câu, nhận ra yêu cầu nào là thật và yêu cầu nào chỉ là cách người dùng mô tả triệu chứng.

Cuối cùng là chịu được việc thiếu cấu trúc. Không có PM nào đưa ticket viết sẵn. Bạn tự quyết thứ tự, tự chịu kết quả.

## Cái bẫy: mỗi khách hàng thành một bản fork

Các bài giới thiệu nghề ít nhắc tới chuyện này, nhưng nó là lỗi dễ mắc nhất khi làm thật.

FDE được đo bằng việc khách dùng được. Cách nhanh nhất để khách dùng được là sửa thẳng vào code: thêm một `if (customer === 'acme')`, copy một module rồi chỉnh. Mười khách sau, công ty có mười phiên bản sản phẩm, không ai dám nâng cấp bản nào.

Palantir nêu đúng lựa chọn này trong bài của họ: FDE thường xuyên phải quyết định nên đầu tư xây tính năng vào nền tảng lõi, hay làm một thứ riêng giao được nhanh hơn. Cả hai đều có lúc đúng. Cái sai là quyết định ngầm, không ghi lại.

Cách giữ cho phần riêng không lan vào lõi là đặt ranh giới bằng interface. Lõi chỉ biết một hợp đồng, mỗi khách có một adapter:

```ts
// core/ticket-source.ts: lõi chỉ biết interface này
export interface Ticket {
  id: string
  subject: string
  body: string
  createdAt: Date
}

export interface TicketSource {
  fetchSince(since: Date): Promise<Ticket[]>
}

// customers/acme/ticket-source.ts: phần riêng của một khách
type AcmeRow = { ticket_no: number; title: string; content: string; created: string }
type Query = (sql: string, params: unknown[]) => Promise<AcmeRow[]>

export class AcmeTicketSource implements TicketSource {
  constructor(private readonly query: Query) {}

  async fetchSince(since: Date): Promise<Ticket[]> {
    const rows = await this.query(
      'SELECT ticket_no, title, content, created FROM support_tickets WHERE created > $1',
      [since.toISOString()],
    )
    return rows.map((r) => ({
      id: String(r.ticket_no),
      subject: r.title,
      body: r.content,
      // Hệ thống của khách lưu giờ địa phương dạng "2026-11-14T09:30:00", không kèm múi giờ.
      // Ghi rõ giả định ở adapter, đừng để lõi phải đoán.
      createdAt: new Date(`${r.created}+07:00`),
    }))
  }
}
```

Phần còn lại của hệ thống, ví dụ pipeline phân loại ticket bằng LLM, chỉ nhận `TicketSource`. Khi khách thứ hai dùng Zendesk thay vì database riêng, bạn viết `ZendeskTicketSource`, lõi không đổi một dòng.

Đi kèm là một quy tắc: thứ gì bạn phải viết lần thứ hai cho khách thứ hai thì đưa về lõi, và báo cho đội sản phẩm. Cả OpenAI lẫn Anthropic đều ghi việc này vào mô tả công việc: gom các mẫu triển khai lặp lại thành công cụ dùng chung và đưa phản hồi từ thực tế về cho đội sản phẩm. FDE giỏi để lại ít code riêng hơn sau mỗi khách, không phải nhiều hơn.

## Khi nào nghề này không hợp

Đi công tác 25 đến 50% là con số trong tin tuyển dụng, không phải trường hợp xấu nhất. Nếu bạn cần lịch ổn định thì đây là điểm loại trừ đầu tiên.

Bạn sẽ ít khi được làm một thứ thật sâu và thật đẹp. Phần lớn code của FDE là lớp nối, script chuyển dữ liệu, xử lý những định dạng kỳ quặc của hệ thống cũ. Ai thích tối ưu một thuật toán cả tuần sẽ thấy khó chịu.

Áp lực đến từ hai phía. Khách muốn có ngay, đội sản phẩm muốn bạn đừng làm bẩn lõi. Bạn đứng giữa và phải nói "không" với cả hai bên vào những lúc khác nhau.

Ngược lại, nếu bạn chán cảnh chỉ nhận ticket mà không biết code mình viết ra rồi ai dùng, FDE cho đúng thứ đó: thấy tận mắt người dùng làm việc với cái mình vừa deploy. Palantir cũng kể nhiều người chuyển qua lại giữa Dev và Delta, nên đây không phải ngõ cụt.

## Muốn thử thì bắt đầu từ đâu

Bạn không cần đổi việc để biết mình có hợp không. Mấy việc làm được ngay trong công việc hiện tại:

1. Xin đi cùng một buổi onboarding hoặc triển khai cho khách, kể cả khách nội bộ. Ghi lại bao nhiêu phần thời gian là code và bao nhiêu là hỏi chuyện.
2. Lần tới nhận một yêu cầu tích hợp, tự viết phần adapter tách khỏi lõi như ví dụ trên, rồi xem lần thứ hai có dùng lại được không.
3. Xây một thứ nhỏ nối LLM vào dữ liệu thật, ví dụ một MCP server đọc database nội bộ. Tin tuyển FDE của các công ty AI gần như đều hỏi kinh nghiệm này.
4. Đọc kỹ tin tuyển của hai ba công ty, gạch những dòng bạn chưa có bằng chứng làm được. Danh sách đó là lộ trình học.

Đặt cột "full stack" trong các tin tuyển ở trên cạnh [danh sách kỹ năng trên trang chủ](/#skills) của site này, bạn sẽ thấy phần trùng nhau khá nhiều.
