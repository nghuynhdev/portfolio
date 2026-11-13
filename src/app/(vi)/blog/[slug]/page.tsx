import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import BlogPost, { postMetadata, postStaticParams } from '@/components/blog/BlogPost'
import { getPostBySlug, postUrl } from '@/lib/blog'

export function generateStaticParams() {
  return postStaticParams('vi', 'blog')
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return postMetadata((await params).slug, 'vi', 'blog')
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!getPostBySlug(slug, 'vi', 'blog')) {
    // Series posts lived at /blog/<slug> before they moved to /ai-for-devs: keep old links working.
    if (getPostBySlug(slug, 'vi', 'ai')) permanentRedirect(postUrl(slug, 'vi', 'ai'))
    notFound()
  }
  return <BlogPost slug={slug} lang="vi" section="blog" />
}
