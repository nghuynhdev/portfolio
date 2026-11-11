import BlogIndex, { blogIndexMetadata } from '@/components/blog/BlogIndex'

export const metadata = blogIndexMetadata(1, 'en')

export default function EnglishBlogIndexPage() {
  return <BlogIndex page={1} lang="en" />
}
