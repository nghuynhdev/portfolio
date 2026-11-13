---
title: "Accent-Insensitive Search for a Static Blog: No Algolia, No Server"
seoTitle: "Accent-Insensitive Search for a Static Blog"
slug: accent-insensitive-search-for-a-static-blog
description: "How to build a search box with suggestions for a static Next.js blog: strip Vietnamese diacritics correctly, rank results and highlight matches, all in the browser."
keywords: "accent-insensitive search, remove diacritics JavaScript, normalize NFD, Next.js blog search, React autocomplete, client-side search"
tags: "Search, TypeScript, React, Next.js"
date: 2026-11-13
---

# Accent-Insensitive Search for a Static Blog: No Algolia, No Server

Vietnamese readers usually search without typing diacritics. If typing `bao mat` does not find the post titled "Bảo mật", the search box is broken as far as the reader is concerned. When I added search to this blog, I wanted three things: unaccented queries had to work, suggestions had to appear while typing, and I did not want to run another service.

The blog has a few dozen posts, statically generated from Markdown. At that size the whole search can run in the browser with one React component and a few TypeScript functions. This post covers the three parts that were harder than I expected: stripping diacritics, ranking and highlighting.

## Why not a search service

Algolia, Meilisearch and Elasticsearch solve a much bigger problem: hundreds of thousands of records, typo tolerance, access control. In return you have to sync data on every publish, look after an API key, and pay as query volume grows.

With a few dozen posts, the searchable data is just titles, descriptions, keywords and tags. The server renders that list once and passes it to the component as props, so no request is made while the reader types. Results show up on every keystroke, even on a slow connection.

## Stripping Vietnamese diacritics correctly

The common approach is to normalize the string to NFD and delete the combining marks. In NFD, `ế` is split into `e` plus two mark characters (circumflex and acute), which sit in the Unicode range U+0300 to U+036F:

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

The line that replaces `đ` is the one people forget. `đ` is its own Unicode character, not `d` plus a mark, so `normalize('NFD')` leaves it alone. Without that line, typing `do tre` will never find "Độ trễ".

Both the query and the data go through this same function before they are compared. The data only needs folding once, so I wrap it in `useMemo` instead of folding it again on every keystroke.

## Ranking: a title match beats a description match

If you only filter by "contains the query", the result order is close to random. I split the query into words and apply two rules:

1. Every word must appear somewhere in the post. One missing word drops the post.
2. Each word is scored by the best place it matches.

```ts
function scoreItem(item: IndexedItem, tokens: string[]): number {
  let score = 0
  for (const token of tokens) {
    let best = 0
    const at = item.fTitle.indexOf(token)
    if (at !== -1) {
      // A hit at the start of a word beats one in the middle of a word.
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

There is nothing special about 12, 8, 7, 4 and 2. What matters is the order: title over tags, tags over keywords, keywords over description. The start-of-word rule makes `rag` prefer a post with "RAG" as its own word over one that contains "storage".

When two posts tie, the newer one comes first. That needs no extra code: the input list is already newest-first, and `Array.prototype.sort` keeps equal elements in their original order.

## Highlighting matches in the accented text

Search runs on the folded string, but the display has to use the original. The catch is that positions in the two strings do not always line up. If the original text is precomposed (each accented letter is one character), both strings have the same length. Text typed on some systems is stored decomposed instead, and then the original is longer than the folded string and every position is off.

The reliable fix is to fold one character at a time and record which original position each output character came from:

```ts
function fold(text: string): { folded: string; map: number[] } {
  let folded = ''
  const map: number[] = []
  for (let i = 0; i < text.length; i++) {
    for (const ch of foldText(text[i])) {
      folded += ch
      map.push(i) // this folded character comes from text[i]
    }
  }
  return { folded, map }
}
```

When a word is found at position `at` in `folded`, the characters to highlight in the original run from `map[at]` to `map[at + token.length - 1]`. I mark them in a boolean array, then merge adjacent runs into `<mark>` elements.

## Suggestions before the reader types

An empty search box is where a reader does not yet know what the blog has. Instead of showing nothing, the panel shows two things: the most common topics (counted from post tags, skipping the tags every post has) and a few of the latest posts. Clicking a topic fills in the query.

The no-results state reuses the same topic list, so the reader always has a next step instead of a bare "nothing found" line.

## Keyboard and screen readers

A decent suggestion box has to work without a mouse. This part follows the WAI-ARIA combobox pattern:

- The input has `role="combobox"`, `aria-expanded`, and `aria-controls` pointing to the list.
- The list has `role="listbox"` and each row is a `role="option"`.
- Arrow keys change the selected row. Focus stays in the input, and the selected row is announced through `aria-activedescendant`.
- `Enter` opens the selected post and `Esc` closes the panel.

One small bug is easy to hit: clicking a suggestion blurs the input, and the panel closes before the click takes effect. Calling `preventDefault()` on the panel's `mousedown` event keeps focus in the input, and the click goes through normally.

## When this stops being enough

This approach has clear limits:

- **A few hundred posts:** sending every title and description with each page view starts to cost. Move the index into its own JSON file and load it only when the reader focuses the search box.
- **Searching full post content:** use a build-time indexer such as Pagefind, or a library such as FlexSearch or MiniSearch.
- **Typo tolerance or searching by meaning:** `indexOf` cannot do either. Searching by meaning is a job for embeddings, which I covered in the post on [hybrid search and reranking](/ai-for-devs/rag-production-tu-ingestion-den-hybrid-search).

For a personal blog, the few functions above are enough, and you understand every line of them. If you want to see what else I use when building products, the [skills section on my homepage](/#skills) has the full list.
