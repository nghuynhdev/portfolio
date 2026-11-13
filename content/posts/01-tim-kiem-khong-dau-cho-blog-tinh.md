---
title: "Tìm kiếm tiếng Việt không dấu cho blog tĩnh: không cần Algolia, không cần server"
seoTitle: "Tìm kiếm tiếng Việt không dấu cho blog tĩnh"
slug: tim-kiem-tieng-viet-khong-dau-cho-blog-tinh
description: "Cách làm ô tìm kiếm có gợi ý cho blog Next.js tĩnh: bỏ dấu tiếng Việt đúng cách, chấm điểm kết quả và tô sáng từ khóa, chạy hoàn toàn trên trình duyệt."
keywords: "tìm kiếm không dấu, bỏ dấu tiếng Việt JavaScript, normalize NFD, search blog Next.js, autocomplete React, client-side search"
tags: "Search, TypeScript, React, Next.js"
date: 2026-11-13
---

# Tìm kiếm tiếng Việt không dấu cho blog tĩnh: không cần Algolia, không cần server

Người Việt tìm kiếm thường không gõ dấu. Gõ `bao mat` mà ô tìm kiếm không ra bài "Bảo mật" thì với người đọc, ô đó coi như hỏng. Khi thêm tìm kiếm cho chính blog này, mình cần ba thứ: gõ không dấu vẫn ra, có gợi ý ngay khi đang gõ, và không phải dựng thêm dịch vụ nào.

Blog này nằm chung với [trang portfolio của mình](/), chỉ có vài chục bài, sinh tĩnh từ Markdown. Với quy mô đó, toàn bộ việc tìm kiếm chạy được trên trình duyệt bằng một component React và vài hàm TypeScript. Bài này đi qua ba phần khó hơn mình tưởng: bỏ dấu, xếp hạng và tô sáng.

## Vì sao không dùng dịch vụ tìm kiếm

Algolia, Meilisearch hay Elasticsearch giải quyết bài toán lớn hơn nhiều: hàng trăm nghìn bản ghi, sửa lỗi chính tả, phân quyền. Đổi lại bạn phải đồng bộ dữ liệu mỗi lần đăng bài, giữ API key và trả tiền khi lượng truy vấn tăng.

Với vài chục bài, dữ liệu cần tìm chỉ là tiêu đề, mô tả, từ khóa và tag. Server render sẵn danh sách này rồi truyền xuống component dưới dạng props, nên không có request nào phát sinh khi người đọc gõ. Kết quả hiện ra ngay ở từng phím bấm, kể cả khi mạng chậm.

## Bỏ dấu tiếng Việt cho đúng

Cách phổ biến là chuẩn hóa chuỗi về dạng NFD rồi xóa các dấu tổ hợp. Ở dạng NFD, chữ `ế` được tách thành `e` cộng hai ký tự dấu (dấu mũ và dấu sắc), nằm trong khoảng Unicode U+0300 đến U+036F:

```ts
function foldText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
}

foldText('Bảo mật')   // "bao mat"
foldText('Độ trễ')    // "do tre"
```

Dòng thay `đ` là chỗ hay bị quên. Chữ `đ` là một ký tự riêng trong Unicode chứ không phải `d` cộng dấu, nên `normalize('NFD')` để nguyên nó. Thiếu dòng đó, gõ `do tre` sẽ không bao giờ ra "Độ trễ".

Cả từ khóa lẫn dữ liệu đều đi qua cùng hàm này trước khi so sánh. Dữ liệu chỉ cần xử lý một lần, nên mình gói trong `useMemo` thay vì bỏ dấu lại ở mỗi phím bấm.

## Xếp hạng: khớp ở tiêu đề quan trọng hơn khớp ở mô tả

Chỉ lọc "có chứa từ khóa" thì thứ tự kết quả gần như ngẫu nhiên. Mình tách câu truy vấn thành từng từ và áp hai quy tắc:

1. Mọi từ đều phải xuất hiện ở đâu đó trong bài. Thiếu một từ là loại.
2. Mỗi từ được chấm theo vị trí tốt nhất mà nó khớp.

```ts
function scoreItem(item: IndexedItem, tokens: string[]): number {
  let score = 0
  for (const token of tokens) {
    let best = 0
    const at = item.fTitle.indexOf(token)
    if (at !== -1) {
      // Khớp ở đầu một từ được điểm cao hơn khớp giữa từ.
      best = at === 0 || /[^a-z0-9]/.test(item.fTitle[at - 1]) ? 12 : 8
    }
    if (item.fTags.some((t) => t.includes(token))) best = Math.max(best, 7)
    if (item.fKeywords.includes(token)) best = Math.max(best, 4)
    if (item.fDescription.includes(token)) best = Math.max(best, 2)
    if (best === 0) return 0
    score += best
  }
  return score
}
```

Các con số 12, 8, 7, 4, 2 không có gì thần bí. Điều quan trọng là thứ tự: tiêu đề hơn tag, tag hơn từ khóa, từ khóa hơn mô tả. Quy tắc "đầu từ" giúp gõ `rag` ưu tiên bài có chữ "RAG" đứng riêng thay vì bài có chữ "storage".

Khi hai bài bằng điểm, bài mới hơn đứng trước. Mình không cần viết thêm gì cho việc này: danh sách đầu vào đã xếp mới nhất trước và `Array.prototype.sort` giữ nguyên thứ tự của các phần tử bằng nhau.

## Tô sáng từ khóa trong chuỗi còn dấu

Tìm thì dùng chuỗi đã bỏ dấu, nhưng hiển thị phải dùng chuỗi gốc. Vấn đề là vị trí trong hai chuỗi không phải lúc nào cũng trùng nhau. Nếu văn bản gốc đang ở dạng tổ hợp sẵn (mỗi chữ có dấu là một ký tự) thì hai chuỗi dài bằng nhau. Nhưng văn bản gõ trên một số hệ thống lại lưu ở dạng tách rời, khi đó chuỗi gốc dài hơn chuỗi đã bỏ dấu và mọi vị trí đều lệch.

Cách chắc chắn là bỏ dấu từng ký tự và ghi lại mỗi ký tự kết quả đến từ vị trí nào trong chuỗi gốc:

```ts
function fold(text: string): { folded: string; map: number[] } {
  let folded = ''
  const map: number[] = []
  for (let i = 0; i < text.length; i++) {
    for (const ch of foldText(text[i])) {
      folded += ch
      map.push(i) // ký tự này của chuỗi đã bỏ dấu ứng với text[i]
    }
  }
  return { folded, map }
}
```

Tìm thấy từ khóa ở vị trí `at` trong `folded` thì các ký tự cần tô trong chuỗi gốc là `map[at]` đến `map[at + token.length - 1]`. Mình đánh dấu chúng trong một mảng boolean, rồi gộp các đoạn liền nhau thành thẻ `<mark>`.

## Gợi ý khi chưa gõ gì

Ô tìm kiếm trống là lúc người đọc chưa biết blog có gì. Thay vì để trống, khung gợi ý hiện hai thứ: các chủ đề xuất hiện nhiều nhất (đếm từ tag của các bài, bỏ những tag bài nào cũng có) và vài bài mới nhất. Bấm một chủ đề là điền luôn vào ô tìm.

Trường hợp không có kết quả cũng dùng lại danh sách chủ đề này, để người đọc luôn có bước tiếp theo thay vì một dòng "không tìm thấy".

## Bàn phím và trình đọc màn hình

Một ô gợi ý tử tế phải dùng được mà không cần chuột. Phần này theo mẫu combobox của WAI-ARIA:

- Ô nhập có `role="combobox"`, `aria-expanded` và `aria-controls` trỏ tới danh sách.
- Danh sách có `role="listbox"`, mỗi dòng là `role="option"`.
- Mũi tên lên xuống đổi dòng đang chọn. Tiêu điểm vẫn nằm ở ô nhập, còn dòng đang chọn được báo qua `aria-activedescendant`.
- `Enter` mở bài đang chọn, `Esc` đóng khung.

Có một lỗi nhỏ dễ gặp: bấm chuột vào một gợi ý làm ô nhập mất tiêu điểm, khung đóng lại trước khi cú bấm kịp có tác dụng. Gọi `preventDefault()` ở sự kiện `mousedown` của khung gợi ý sẽ giữ tiêu điểm ở ô nhập, và cú bấm chạy bình thường.

## Khi nào cách này hết phù hợp

Cách làm này có giới hạn rõ ràng:

- **Số bài lên vài trăm:** gửi toàn bộ tiêu đề và mô tả xuống mọi lượt xem bắt đầu tốn. Lúc đó nên tách chỉ mục thành file JSON riêng, chỉ tải khi người đọc bấm vào ô tìm.
- **Cần tìm trong toàn bộ nội dung bài:** nên dùng công cụ dựng chỉ mục lúc build như Pagefind hoặc thư viện như FlexSearch, MiniSearch.
- **Cần chịu lỗi gõ sai hoặc tìm theo nghĩa:** `indexOf` không làm được. Tìm theo nghĩa là bài toán của embedding, mình đã viết ở bài về [hybrid search và rerank](/ai-for-devs/rag-production-tu-ingestion-den-hybrid-search).

Còn với một blog cá nhân, vài hàm ở trên là đủ, và bạn hiểu từng dòng của nó.
