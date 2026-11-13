import BlogIndex, { blogIndexMetadata } from '@/components/blog/BlogIndex'

export const metadata = blogIndexMetadata(1, 'en', 'blog')

/** Every English post: the AI for Devs series plus general tech posts. */
export default function EnglishBlogHomePage() {
  return <BlogIndex page={1} lang="en" scope="blog" />
}
