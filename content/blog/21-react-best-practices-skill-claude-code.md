---
title: "React Best Practices: dùng Claude tối ưu đúng nút thắt"
seoTitle: "React Best Practices skill: tối ưu React với Claude Code"
slug: react-best-practices-skill-claude-code
description: "Skill React Best Practices của Vercel trong Claude Code: tìm waterfall, kiểm tra bundle, ranh giới server/client, đo trước và sau."
keywords: "vercel-react-best-practices, Claude Code React, Next.js performance, React skill, Vercel agent skills"
tags: "AI, Claude Code, Skills, React"
date: 2026-09-15
cover: /images/blog/21-react-best-practices-skill-claude-code-v2.webp
---

# React Best Practices: dùng Claude tối ưu đúng nút thắt

Trang mở chậm không có nghĩa việc đầu tiên cần làm là thêm [`memo`](https://react.dev/reference/react/memo). Có thể hai request độc lập đang đợi nhau, một thư viện lớn bị tải ở mọi route, hoặc toàn bộ trang trở thành [client component](https://nextjs.org/docs/app/getting-started/server-and-client-components) vì một nút tương tác nhỏ.

Skill **vercel-react-best-practices** trong [bộ agent skills của Vercel](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices) cung cấp hướng dẫn về hiệu năng React/Next.js, có ưu tiên cho vấn đề như waterfall và bundle. Cách mình dùng nó là hỗ trợ điều tra một triệu chứng có thể đo.

## Cài rồi đưa ra triệu chứng cụ thể

Nếu dùng Skills CLI:

```bash
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices -a claude-code
```

Lệnh chỉ định Claude Code; chọn scope phù hợp trong trình cài. Trước khi refactor, yêu cầu đọc `package.json`, cách routing và component liên quan. Khuyến nghị phụ thuộc phiên bản framework; API của React mới hơn không tự dùng được trong repo React cũ.

```text
Dùng React Best Practices điều tra trang dashboard tải chậm.
Đọc phiên bản React/Next.js và luồng fetch hiện tại trước.
Tìm nút thắt có bằng chứng, chưa refactor hàng loạt.
Đề xuất một thay đổi nhỏ, nêu cách đo trước/sau
và kiểm tra dữ liệu cùng phân quyền không thay đổi.
```

## Xác nhận dữ liệu có thật sự độc lập

Ví dụ TypeScript độc lập sau chỉ minh họa cách chạy hai thao tác song song:

```ts
async function loadDashboard<TProfile, TOrders>(
  loadProfile: () => Promise<TProfile>,
  loadOrders: () => Promise<TOrders>,
) {
  const [profile, orders] = await Promise.all([
    loadProfile(),
    loadOrders(),
  ]);
  return { profile, orders };
}
```

Nếu orders cần id từ profile hoặc cần xác thực xong mới được truy vấn, không chạy cả hai ngay từ đầu. Độc lập về cú pháp không có nghĩa độc lập về nghiệp vụ. Cũng phải quyết định khi một nhánh lỗi thì màn hình thất bại toàn bộ hay hiển thị phần còn lại.

Ví dụ này không cam kết giảm thời gian ở mọi môi trường. Hãy xem waterfall thực tế, giới hạn connection và chi phí downstream; tăng song song quá mức có thể đẩy tải sang nơi khác.

## Kiểm tra thứ người dùng thật sự phải tải

Với một bảng có biểu đồ mở khi bấm, xem thư viện biểu đồ có nằm trong bundle khởi đầu không. Nếu chỉ dùng ở một tương tác hiếm, có thể cân nhắc tải khi cần. Đo cả thời gian lần đầu mở biểu đồ để tránh chỉ chuyển độ trễ sang bước kế tiếp mà không nhận ra.

Với Next.js, quan sát phần nào cần tương tác client. Một nút lọc không tự yêu cầu cả vùng nội dung tĩnh chạy phía client. Tuy nhiên, tách component cần giữ hợp đồng props và cách cập nhật trạng thái; đừng chuyển ranh giới chỉ để đạt một cấu trúc được coi là đẹp.

## Cache phải giữ đúng phạm vi dữ liệu

Nếu đề xuất cache, yêu cầu Claude nêu khóa, thời hạn, cơ chế invalidation và phạm vi người dùng/tenant. Một cache trả nhanh nhưng trộn dữ liệu của hai người là thay đổi sai.

Không tự áp hướng dẫn cache theo ký ức của phiên bản Next.js khác. Kiểm tra tài liệu của đúng phiên bản và cấu hình route. Khi chưa rõ freshness cần bao lâu, hỏi từ yêu cầu sản phẩm thay vì chọn thời hạn ngẫu nhiên.

## Đo kết quả với cùng điều kiện

Ghi lại route, dữ liệu mẫu, chế độ build và thiết bị/mạng dùng để đo. So sánh thời gian tải, tương tác hoặc bundle theo đúng triệu chứng ban đầu. Không so dev mode của bản cũ với production build của bản mới.

Khi đã có thay đổi, kiểm tra cả lỗi và loading state. Một refactor tối ưu tốt cần giữ hành vi người dùng. Dùng [review UI](/ai-for-devs/lam-ui-voi-claude-code-skills) và [kiểm thử trình duyệt](/ai-for-devs/webapp-testing-playwright-claude-code) cho phần giao diện chịu tác động, thay vì coi điểm hiệu năng là đủ kết luận.

Xem thêm [các công nghệ React/Next.js mình dùng](/#skills) trên trang giới thiệu.
