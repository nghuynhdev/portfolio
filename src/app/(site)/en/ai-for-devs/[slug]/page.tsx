import type { Metadata } from 'next'
import BlogPost, { postMetadata, postStaticParams } from '@/components/blog/BlogPost'

// Only posts that exist in this language are pre-rendered; other slugs 404.
export const dynamicParams = false

export function generateStaticParams() {
  return postStaticParams('en')
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return postMetadata((await params).slug, 'en')
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  return <BlogPost slug={(await params).slug} lang="en" />
}
