import BlogIndex, { blogIndexMetadata } from '@/components/blog/BlogIndex'

export const metadata = blogIndexMetadata(1)

export default function BlogIndexPage() {
  return <BlogIndex page={1} />
}
