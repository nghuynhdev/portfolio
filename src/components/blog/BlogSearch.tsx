'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { blogStrings, type BlogLang } from '@/lib/blog-i18n'

export interface SearchItem {
  url: string
  order: number
  title: string
  description: string
  keywords: string
  tags: string[]
}

const MAX_RESULTS = 6
const MAX_LATEST = 4
const MAX_TOPICS = 8
/** Tags on nearly every post: useless as topic suggestions. */
const GENERIC_TAGS = new Set(['AI', 'Developer'])

/**
 * Lowercases and strips Vietnamese diacritics so "bao mat" finds "Bảo mật".
 * `map[i]` is the index in the original string of folded character i,
 * which lets a match in the folded text be highlighted in the original.
 */
function fold(text: string): { folded: string; map: number[] } {
  let folded = ''
  const map: number[] = []
  for (let i = 0; i < text.length; i++) {
    const base = text[i]
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[đĐ]/g, 'd')
      .toLowerCase()
    for (const ch of base) {
      folded += ch
      map.push(i)
    }
  }
  return { folded, map }
}

const foldText = (text: string) => fold(text).folded

interface IndexedItem extends SearchItem {
  fTitle: string
  fTags: string[]
  fKeywords: string
  fDescription: string
}

/** Every query word must appear somewhere; title and tag hits rank highest. */
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

/** Wraps every occurrence of a query word in <mark>, ignoring case and diacritics. */
function highlight(text: string, tokens: string[]): ReactNode {
  if (tokens.length === 0) return text
  const { folded, map } = fold(text)
  const hit = new Array<boolean>(text.length).fill(false)
  for (const token of tokens) {
    let from = 0
    for (;;) {
      const at = folded.indexOf(token, from)
      if (at === -1) break
      for (let i = at; i < at + token.length; i++) hit[map[i]] = true
      from = at + token.length
    }
  }
  const parts: ReactNode[] = []
  let start = 0
  for (let i = 1; i <= text.length; i++) {
    if (i === text.length || hit[i] !== hit[start]) {
      const chunk = text.slice(start, i)
      parts.push(
        hit[start] ? (
          <mark key={start} className="bg-transparent font-semibold text-accent">
            {chunk}
          </mark>
        ) : (
          chunk
        ),
      )
      start = i
    }
  }
  return parts
}

export default function BlogSearch({
  items,
  lang = 'vi',
  className = '',
}: {
  items: SearchItem[]
  lang?: BlogLang
  className?: string
}) {
  const s = blogStrings[lang].search
  const router = useRouter()
  const id = useId()
  const listId = `${id}-list`
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)

  const indexed = useMemo<IndexedItem[]>(
    () =>
      items.map((item) => ({
        ...item,
        fTitle: foldText(item.title),
        fTags: item.tags.map(foldText),
        fKeywords: foldText(item.keywords),
        fDescription: foldText(item.description),
      })),
    [items],
  )

  /** Most-used tags across the series, minus the generic ones. */
  const topics = useMemo(() => {
    const counts = new Map<string, number>()
    for (const item of items) {
      for (const tag of item.tags) {
        if (!GENERIC_TAGS.has(tag)) counts.set(tag, (counts.get(tag) ?? 0) + 1)
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_TOPICS)
      .map(([tag]) => tag)
  }, [items])

  const tokens = useMemo(() => foldText(query).split(/\s+/).filter(Boolean), [query])
  const hasQuery = tokens.length > 0

  const results = useMemo(() => {
    if (!hasQuery) return indexed.slice(0, MAX_LATEST)
    return indexed
      .map((item) => ({ item, score: scoreItem(item, tokens) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score || b.item.order - a.item.order)
      .slice(0, MAX_RESULTS)
      .map((r) => r.item)
  }, [indexed, tokens, hasQuery])

  // "/" focuses the search from anywhere on the page, unless the reader is typing.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return
      const el = document.activeElement
      if (el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return
      e.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Keep the keyboard-highlighted option inside the scrollable list.
  useEffect(() => {
    if (active < 0) return
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const updateQuery = (value: string) => {
    setQuery(value)
    setOpen(true)
    // With a query, Enter opens the best match; with none, nothing is preselected.
    setActive(value.trim() ? 0 : -1)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) {
        setOpen(true)
        return
      }
      if (results.length === 0) return
      const step = e.key === 'ArrowDown' ? 1 : -1
      setActive((i) => (i + step + results.length) % results.length)
    } else if (e.key === 'Enter') {
      const target = results[active]
      if (open && target) {
        e.preventDefault()
        router.push(target.url)
      }
    } else if (e.key === 'Escape') {
      if (open) setOpen(false)
      else if (query) updateQuery('')
    }
  }

  const activeOption = open && active >= 0 && active < results.length ? `${id}-opt-${active}` : undefined

  return (
    <div className={`relative z-20 ${className}`} role="search">
      <label htmlFor={id} className="sr-only">
        {s.label}
      </label>

      <div className="relative">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>

        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="search"
          enterKeyHint="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeOption}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={query}
          placeholder={s.placeholder}
          onChange={(e) => updateQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="h-12 w-full rounded-2xl border border-black/[0.1] bg-white pl-12 pr-14 text-base text-gray-900 placeholder:text-gray-500 transition-colors hover:border-accent/40 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/25 dark:border-white/[0.1] dark:bg-card dark:text-white dark:placeholder:text-gray-400"
        />

        {query ? (
          <button
            type="button"
            aria-label={s.clear}
            // Keep focus in the input so the panel stays open after clearing.
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              updateQuery('')
              inputRef.current?.focus()
            }}
            className="absolute right-0.5 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl text-gray-500 transition-colors hover:text-accent dark:text-gray-400"
          >
            <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        ) : (
          <kbd
            aria-hidden
            className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-md border border-black/[0.12] px-1.5 py-0.5 font-sans text-xs text-gray-500 sm:block dark:border-white/[0.14] dark:text-gray-400"
          >
            /
          </kbd>
        )}
      </div>

      {/* Suggestions. preventDefault on mousedown keeps the input focused, so a click lands before blur closes the panel. */}
      <div
        hidden={!open}
        onMouseDown={(e) => e.preventDefault()}
        className="blog-search-panel absolute inset-x-0 top-full mt-2 overflow-hidden rounded-2xl border border-black/[0.1] bg-white shadow-2xl shadow-black/20 dark:border-white/[0.1] dark:bg-card dark:shadow-black/50"
      >
        <div className="max-h-[min(60vh,28rem)] overflow-y-auto overscroll-contain p-2">
          {hasQuery && results.length === 0 && (
            <div className="px-3 pb-1 pt-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{s.noResults(query.trim())}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{s.noResultsHint}</p>
            </div>
          )}

          {(!hasQuery || results.length === 0) && topics.length > 0 && (
            <div className="px-3 pb-2 pt-2">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                {s.topics}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {topics.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    tabIndex={-1}
                    onClick={() => updateQuery(tag)}
                    className="inline-flex min-h-9 items-center rounded-full border border-black/[0.1] px-3 text-sm text-gray-700 transition-colors hover:border-accent/50 hover:text-accent dark:border-white/[0.1] dark:text-gray-300"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div
              id={`${id}-heading`}
              className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400"
            >
              {hasQuery ? s.results(results.length) : s.latest}
            </div>
          )}

          <ul ref={listRef} id={listId} role="listbox" aria-label={s.label}>
            {results.map((item, i) => (
              <li
                key={item.url}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseMove={() => setActive(i)}
              >
                <Link
                  href={item.url}
                  tabIndex={-1}
                  className={`flex min-h-11 items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                    i === active ? 'bg-accent/10' : ''
                  }`}
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[11px] font-semibold text-accent">
                    {String(item.order).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium leading-snug text-gray-900 dark:text-white">
                      {highlight(item.title, tokens)}
                    </span>
                    {hasQuery && (
                      <span className="mt-0.5 block text-[13px] leading-snug text-gray-600 line-clamp-1 dark:text-gray-400">
                        {highlight(item.description, tokens)}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div
          aria-hidden
          className="hidden items-center gap-4 border-t border-black/[0.08] px-4 py-2 text-xs text-gray-500 sm:flex dark:border-white/[0.08] dark:text-gray-400"
        >
          <span><kbd className="font-sans">↑↓</kbd> {s.hintNavigate}</span>
          <span><kbd className="font-sans">↵</kbd> {s.hintOpen}</span>
          <span><kbd className="font-sans">esc</kbd> {s.hintClose}</span>
        </div>
      </div>

      {/* Announces the result count to screen readers as the query changes. */}
      <div aria-live="polite" className="sr-only">
        {open && hasQuery ? (results.length > 0 ? s.results(results.length) : s.noResults(query.trim())) : ''}
      </div>
    </div>
  )
}
