---
title: "Xây dựng AI Agent đầu tiên: hiểu function/tool calling cho đúng"
seoTitle: "AI Agent là gì? Function calling và tool calling cho dev"
slug: ai-agent-dau-tien-function-calling
description: "Tool calling biến LLM thành agent biết hành động: vòng lặp agent, định nghĩa tool bằng schema và ranh giới an toàn bắt buộc."
keywords: "AI agent, tool calling, function calling, LLM agent, AI SDK tools, AI cho developer"
tags: "AI, Agent, Tool Calling, Developer"
date: 2024-12-03
updated: 2026-11-11
cover: /images/blog/05-ai-agent-dau-tien-function-calling-v2.webp
---

# Xây dựng AI Agent đầu tiên: hiểu function/tool calling cho đúng

Cụm "AI agent" bị marketing làm cho nghe huyền bí quá mức. Bóc tách ra, một agent chỉ là một LLM được cho thêm **công cụ (tool)** để gọi, và một **vòng lặp** để nó gọi tool, đọc kết quả, rồi quyết bước tiếp theo. Hết. Không có ý thức, không có mưu đồ, chỉ là đoán token cộng với khả năng nói "tôi muốn chạy hàm này với tham số kia".

Bài này mình đi từ cơ chế [tool calling](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) đến cách dựng một agent nhỏ chạy được, và quan trọng hơn: những chỗ phải chặn để nó không làm bậy.

## Tool calling thực chất là gì

Bản thân LLM không chạy được code, không gọi được API, không biết giờ hiện tại. Tool calling lấp khoảng trống đó. Bạn mô tả cho model một danh sách hàm — tên, công dụng, tham số (dưới dạng schema). Khi gặp câu hỏi cần hàm nào đó, model **không tự bịa kết quả**, mà trả về một yêu cầu: "hãy gọi `getWeather` với `{ city: 'Đà Nẵng' }`". Code của bạn thực thi hàm thật, lấy kết quả, đưa ngược lại cho model. Model dùng kết quả đó viết câu trả lời.

Điểm mấu chốt cần nhớ: **model chỉ đề nghị gọi hàm, code của bạn mới là bên thực thi.** Nghĩa là mọi ranh giới an toàn nằm ở tay bạn.

## Vòng lặp agent

```
Người dùng hỏi
   -> gửi câu hỏi + danh sách tool cho model
   -> model: "gọi tool X với tham số Y"
   -> code chạy tool X, lấy kết quả
   -> gửi kết quả về cho model
   -> model gọi tool tiếp HOẶC trả lời cuối
   (lặp cho tới khi có câu trả lời, hoặc chạm giới hạn bước)
```

Cái "lặp cho tới khi" là linh hồn của agent: nó có thể gọi nhiều tool nối tiếp (tra dữ liệu, rồi tính toán, rồi gửi mail) để hoàn thành một việc nhiều bước.

## Định nghĩa tool bằng schema và chạy vòng lặp

Với [AI SDK](https://ai-sdk.dev/docs/foundations/tools), bạn khai báo tool kèm schema tham số; SDK lo luôn vòng lặp gọi lại model sau mỗi tool.

```ts
import { generateText, tool, isStepCount } from 'ai';
import { z } from 'zod';

const getWeather = tool({
  description: 'Lấy thời tiết hiện tại của một thành phố',
  inputSchema: z.object({ city: z.string() }),
  execute: async ({ city }) => {
    const data = await fetchWeatherApi(city); // API thật của bạn
    return { tempC: data.temp, condition: data.condition };
  },
});

const { text } = await generateText({
  model: 'anthropic/claude-haiku-5-5',
  tools: { getWeather },
  stopWhen: isStepCount(5), // chặn vòng lặp vô tận
  prompt: 'Thời tiết Đà Nẵng giờ sao, có nên mang áo mưa không?',
});
```

Phần `description` và schema cực quan trọng: model dựa vào đó để quyết khi nào gọi và truyền tham số gì. Mô tả mơ hồ thì model gọi sai hoặc không gọi. Coi nó như viết docstring cho đồng nghiệp — mà đồng nghiệp này chỉ đọc đúng dòng mô tả bạn viết.

## Những ranh giới bắt buộc phải có

Đây là phần nhiều người bỏ qua rồi lãnh hậu quả. Vì model là bên *đề nghị* còn code là bên *thực thi*, bạn phải tự dựng rào:

- **Giới hạn số bước.** Luôn đặt `stopWhen`. Không là một vòng lặp hỏng có thể gọi tool mãi, đốt tiền và thời gian.
- **Phân loại tool theo mức rủi ro.** Tool chỉ đọc (tra cứu, tính toán) thì cho chạy tự do. Tool có tác dụng phụ (gửi mail, xóa dữ liệu, thanh toán) thì **phải có người duyệt** trước khi thực thi, hoặc giới hạn nghiêm ngặt. Cách để agent chạy lại mà không gửi mail hai lần mình viết trong bài [độ tin cậy cho LLM](/ai-for-devs/do-tin-cay-llm-timeout-retry-idempotency).
- **Kiểm tra tham số bằng schema ở phía thực thi.** Đừng tin mù tham số model đưa. `city` có thể là chuỗi lạ; một tool "chạy SQL" mà tin thẳng input của model là mời gọi thảm họa.
- **Đừng để tool làm được nhiều hơn mức cần.** Tool "đọc file" nên giới hạn trong một thư mục, không cho đọc cả máy. Nguyên tắc đặc quyền tối thiểu, y như khi thiết kế API.
- **Ghi log mọi lần gọi tool.** Khi agent làm sai, log tool call là thứ duy nhất giúp bạn hiểu nó đã "nghĩ" gì và chạy gì.

## Đừng vội nhảy lên "multi-agent"

Xu hướng hay thấy là dựng cả một dàn agent gọi lẫn nhau cho nó "xịn". Thực tế, phần lớn bài toán giải gọn bằng *một* agent với vài tool được định nghĩa tốt. Nhiều agent đồng nghĩa nhiều chỗ hỏng, khó debug, và đắt gấp bội. Bắt đầu từ một agent, vài tool, giới hạn bước rõ ràng; chỉ tách thêm khi thật sự cần.

Khi số tool nhiều lên và cần dùng chung giữa nhiều app, hãy xem [MCP](/ai-for-devs/mcp-model-context-protocol-la-gi). Và vì tool là cửa ngõ để kẻ xấu lợi dụng, đọc thêm bài [prompt injection](/ai-for-devs/bao-mat-ai-prompt-injection).

Khi đã nắm vòng lặp "model đề nghị — code thực thi — trả kết quả về", bạn sẽ thấy xây agent không khác gì viết một cái orchestrator gọi API, chỉ là người quyết gọi API nào lại là model. Và vì model hay nhầm, phần việc kỹ sư của bạn chính là dựng đủ rào để cái nhầm đó không thành sự cố.

Mình viết series này từ góc nhìn của [một fullstack developer](/) — người phải chịu trách nhiệm khi agent làm sai trên production, chứ không chỉ lúc demo.
