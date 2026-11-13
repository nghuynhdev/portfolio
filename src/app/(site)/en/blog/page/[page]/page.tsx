import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogIndex, { blogIndexMetadata } from '@/components/blog/BlogIndex'
import { getTotalPages } from '@/lib/blog'

// Only pre-rendered page numbers exist; anything else is a 404.
export const dynamicParams = false

export function generateStaticParams() {
  // Page 1 lives at /en/blog (and /en/blog/page/1 redirects there).
  return Array.from({ length: getTotalPages('en', 'blog') - 1 }, (_, i) => ({ page: String(i + 2) }))
}

function parsePage(raw: string): number | null {
  const n = Number(raw)
  return Number.isInteger(n) && n >= 2 && n <= getTotalPages('en', 'blog') ? n : null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>
}): Promise<Metadata> {
  const page = parsePage((await params).page)
  return page ? blogIndexMetadata(page, 'en', 'blog') : {}
}

export default async function EnglishBlogPaginatedPage({
  params,
}: {
  params: Promise<{ page: string }>
}) {
  const page = parsePage((await params).page)
  if (!page) notFound()
  return <BlogIndex page={page} lang="en" scope="blog" />
}
