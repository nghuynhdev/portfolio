---
title: "MCP (Model Context Protocol) là gì và vì sao dev nên quan tâm"
seoTitle: "MCP (Model Context Protocol) là gì? Hướng dẫn cho dev"
slug: mcp-model-context-protocol-la-gi
description: "MCP (Model Context Protocol) là gì: biến bài toán tích hợp AI N×M thành N+M, cách hoạt động và một MCP server bằng TypeScript."
keywords: "MCP, Model Context Protocol, AI tool integration, MCP server, AI agent, AI cho developer"
tags: "AI, MCP, Agent, Developer"
date: 2026-03-18
cover: /images/blog/10-mcp-model-context-protocol-v2.webp
---

# MCP (Model Context Protocol) là gì và vì sao dev nên quan tâm

**MCP ([Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro)) là giao thức mở do Anthropic khởi xướng, chuẩn hóa cách ứng dụng AI kết nối với công cụ và nguồn dữ liệu bên ngoài.** Viết một MCP server cho công cụ của bạn một lần, mọi client hỗ trợ MCP như Claude, Cursor hay VS Code đều dùng được.

Ở [bài về tool calling](/ai-for-devs/ai-agent-dau-tien-function-calling), ta thấy một agent mạnh lên nhờ được cắm thêm công cụ: tra dữ liệu, gọi API, đọc file. Nhưng làm nhiều rồi sẽ đụng một nỗi đau rất kỹ sư: mỗi ứng dụng AI lại phải tự viết lại cách kết nối tới từng công cụ. App A muốn đọc GitHub thì viết tích hợp GitHub; app B cũng muốn đọc GitHub thì... viết lại từ đầu. Nhân lên với hàng chục công cụ và hàng chục app, đó là bài toán tích hợp **N×M** kinh điển.

**MCP — Model Context Protocol** sinh ra để biến N×M thành **N+M**. Và đó là lý do nó đáng để một dev để mắt tới, dù bạn chưa làm AI.

## Ý tưởng cốt lõi: một chuẩn giao tiếp chung

MCP là một giao thức mở, chuẩn hóa cách một ứng dụng AI (gọi là *host/client*) nói chuyện với một nguồn công cụ và dữ liệu bên ngoài (gọi là *server*). Thay vì mỗi app tự chế cách nối riêng, tất cả nói chung một "ngôn ngữ".

Ví von hay dùng: MCP giống **cổng USB-C cho AI**. Trước USB, mỗi thiết bị một đầu cắm riêng. Có chuẩn chung rồi, bất kỳ thiết bị nào cắm vào bất kỳ cổng nào cũng chạy. Với MCP: viết *một* server cho công cụ của bạn (ví dụ "truy vấn CRM nội bộ"), thì *mọi* client hỗ trợ MCP đều dùng được — khỏi viết lại cho từng app.

## Một server MCP phơi ra ba thứ

- **Tools** — hành động model có thể gọi (query DB, tạo issue, gửi tin). Giống tool calling ở bài trước, nhưng theo chuẩn chung.
- **[Resources](https://modelcontextprotocol.io/specification/2025-06-18/server/resources)** — dữ liệu model có thể đọc (file, bản ghi, tài liệu).
- **Prompts** — mẫu prompt dựng sẵn cho các tác vụ hay dùng.

Client (một IDE có AI, một app chat, một agent) kết nối tới server, hỏi "bạn có những gì", rồi để model dùng các tool/resource đó qua đúng một giao thức.

## Một MCP server tối giản bằng TypeScript

Để thấy nó không có gì đáng sợ, đây là một server phơi ra một tool:

```ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({ name: 'crm', version: '1.0.0' });

server.tool(
  'get_customer',
  'Lấy thông tin khách hàng theo id',
  { id: z.string() },
  async ({ id }) => {
    const customer = await db.customers.find(id); // dữ liệu thật của bạn
    return { content: [{ type: 'text', text: JSON.stringify(customer) }] };
  },
);

await server.connect(new StdioServerTransport());
```

Viết xong, bất kỳ client MCP nào (ví dụ một IDE có trợ lý AI) cũng cắm vào và dùng được tool `get_customer`, mà bạn không phải biết nội tình từng client.

## Vì sao điều này quan trọng với bạn

- **Khỏi viết lại tích hợp.** Một server dùng cho nhiều ứng dụng AI — hôm nay là trợ lý trong IDE, mai là chatbot nội bộ, cùng một server.
- **Hệ sinh thái sẵn có.** Đã có nhiều MCP server viết sẵn cho GitHub, cơ sở dữ liệu, hệ thống file, nhiều SaaS... Nhiều khi bạn chỉ cần cắm vào chứ không phải xây.
- **Ranh giới rõ ràng.** Server là nơi bạn kiểm soát model được chạm cái gì — một chỗ tập trung để áp phân quyền và giới hạn, thay vì rải rác trong từng app.

## Đừng quên bài học bảo mật

MCP cho model cánh cổng vào công cụ và dữ liệu thật, nên mọi điều ở [bài bảo mật](/ai-for-devs/bao-mat-ai-prompt-injection) áp dụng nguyên vẹn, thậm chí gắt hơn. Một MCP server kết nối tới hệ thống nội bộ là một bề mặt tấn công: áp đặc quyền tối thiểu cho từng tool, bắt duyệt với hành động có tác dụng phụ, và coi mọi yêu cầu từ client/model là không đáng tin cho tới khi kiểm. Tiện lợi của chuẩn chung không miễn cho bạn phần kiểm soát.

Về bản chất, MCP không phải công nghệ AI gì cao siêu — nó là một chuẩn tích hợp, đúng kiểu bài toán mà dev giải hoài: giảm sự trùng lặp, tách phần kết nối ra khỏi phần ứng dụng. Nếu bạn từng mừng khi có REST hay GraphQL làm chuẩn chung, thì MCP là cùng một tinh thần đó, lần này cho việc nối AI với thế giới bên ngoài. Đáng để theo dõi và thử dựng một server nhỏ.

Thêm về mình và những gì mình đang làm: [trang giới thiệu Nguyễn Huỳnh](/).
