---
title: "webapp-testing: để Claude kiểm tra web bằng trình duyệt thật"
seoTitle: "webapp-testing: test web bằng Playwright với Claude Code"
slug: webapp-testing-playwright-claude-code
description: "Test webapp bằng Playwright với skill webapp-testing trong Claude Code: tái hiện tương tác, kiểm tra trạng thái và lưu bằng chứng."
keywords: "webapp-testing skill, Claude Code Playwright, browser testing, E2E testing, Anthropic skills"
tags: "AI, Claude Code, Skills, Testing"
date: 2026-09-27
updated: 2026-11-11
---

# webapp-testing: để Claude kiểm tra web bằng trình duyệt thật

Claude đọc code rồi nói nút tìm kiếm đã hoạt động. Nhưng trên trang chạy thật, một lớp loading vẫn phủ lên form nên người dùng không bấm được. Đây là loại lỗi mà chỉ nhìn hàm xử lý sự kiện chưa chắc phát hiện ra.

Skill **webapp-testing** trong [repo Anthropic](https://github.com/anthropics/skills/tree/main/skills/webapp-testing) hướng dẫn tương tác và kiểm thử ứng dụng web local bằng Playwright, gồm kiểm tra hành vi, screenshot và log trình duyệt. Nó hữu ích khi bạn muốn nối việc sửa code với bằng chứng ở UI.

## Cài skill không đồng nghĩa có sẵn browser

Nếu dùng Skills CLI, chọn Claude Code khi cài:

```bash
npx skills add anthropics/skills --skill webapp-testing -a claude-code
```

Theo `SKILL.md`, bộ này dùng Python Playwright và có helper quản lý server. Máy vẫn cần runtime, dependency và browser tương ứng. Khi dùng helper, xem `--help` của đúng bản cài trước, vì đường dẫn phụ thuộc vị trí cài đặt.

Nếu không khởi chạy được browser trong môi trường hiện tại, báo phần chưa kiểm tra. Không đổi từ “đã chạy thử” sang “đọc code thấy có vẻ đúng” mà vẫn giữ cùng kết luận.

## Giao một hành trình có kết quả rõ

Mình thử ngay trên blog bạn đang đọc. Series AI for Devs có phân trang (`/ai-for-devs`, `/ai-for-devs/page/2`…), và `/ai-for-devs/page/1` phải redirect về trang gốc để không trùng nội dung. Đề bài mình giao:

```text
Dùng webapp-testing kiểm tra phân trang của /ai-for-devs ở môi trường local.
Xác định URL và cổng server đang chạy trước khi thao tác.
Từ trang 1, bấm sang trang 2, mở bài đầu tiên rồi quay lại.
Xác nhận /ai-for-devs/page/1 chuyển về /ai-for-devs và số trang không tồn tại trả 404.
Ghi các bước đã chạy, assertion, lỗi console liên quan và screenshot khi lỗi.
Không sửa nội dung bài viết để làm test đi qua.
```

Như vậy Claude phải chứng minh điều hướng thật sự hoạt động, chứ không chỉ thấy các nút số trang hiện trên màn hình.

## Quan sát rồi mới chọn locator

Playwright khuyến khích kiểm tra hành vi người dùng nhìn thấy và dùng locator bền vững. Tên nhãn hay vai trò thường diễn đạt ý định tốt hơn selector dựa vào vị trí của `div`.

Thanh phân trang của blog này là một `nav` có nhãn “Phân trang”, mỗi số trang là link có nhãn “Trang N”. Kịch bản Python bám đúng các nhãn đó:

```python
import re
from playwright.sync_api import sync_playwright, expect

BASE = "http://localhost:3000"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    page.goto(f"{BASE}/ai-for-devs")
    pager = page.get_by_role("navigation", name="Phân trang")
    pager.get_by_role("link", name="Trang 2").click()
    expect(page).to_have_url(re.compile(r"/ai-for-devs/page/2$"))
    expect(page.get_by_role("heading", level=1)).to_contain_text("Trang 2")

    # Mở bài đầu tiên của trang 2 rồi quay lại
    page.get_by_role("main").get_by_role("listitem").first.get_by_role("link").click()
    expect(page.get_by_role("heading", level=1)).to_be_visible()
    page.go_back()
    expect(page).to_have_url(re.compile(r"/ai-for-devs/page/2$"))

    # /page/1 không được tồn tại song song với trang gốc
    page.goto(f"{BASE}/ai-for-devs/page/1")
    expect(page).to_have_url(re.compile(r"/ai-for-devs$"))

    response = page.goto(f"{BASE}/ai-for-devs/page/99")
    assert response is not None and response.status == 404

    browser.close()
```

Chọn assertion theo trạng thái cần đạt thay vì thêm một khoảng sleep dài. Nếu app có polling liên tục, đợi `networkidle` có thể không phù hợp; locator và assertion cần bám vào nội dung đã sẵn sàng để dùng.

## Screenshot là bằng chứng của một trạng thái

Ảnh chụp giúp thấy overflow, crop và khoảng cách. Nó chưa chứng minh tìm kiếm có lọc đúng, nút lưu gọi API đúng hay dữ liệu được giữ sau reload. Thêm assertion cho phần hành vi cần bảo vệ.

Khi test lỗi, lưu cả bước tái hiện và trạng thái URL/dữ liệu. Một ảnh không có ngữ cảnh khó giúp người khác điều tra. Ngược lại, log console có cảnh báo không liên quan cũng chưa đủ kết luận luồng người dùng đã hỏng.

## Giữ test tách biệt và đúng phạm vi

Dùng tài khoản cùng dữ liệu kiểm thử cho thao tác có ghi dữ liệu. Không chạy thử gửi email hay xóa bản ghi thật chỉ vì kịch bản yêu cầu bấm nút cuối. Với các dịch vụ ngoài, chọn môi trường test hoặc mock có chủ đích và ghi giới hạn đó.

Sau khi sửa một lỗi, chạy lại đúng hành trình đã làm nó xuất hiện. Báo cáo tốt nêu được điều gì đã được chứng minh và điều gì chưa; đó là nền để kết hợp với [review UI](/ai-for-devs/lam-ui-voi-claude-code-skills) và quy trình [debug có bằng chứng](/ai-for-devs/superpowers-debugging-claude-code).

Blog và [trang giới thiệu của mình](/) đều chạy cùng một ứng dụng Next.js, nên bộ test này bảo vệ cả hai.
