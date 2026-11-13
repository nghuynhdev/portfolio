import BlogIndex, { blogIndexMetadata } from '@/components/blog/BlogIndex'

export const metadata = blogIndexMetadata(1, 'vi', 'blog')

/** Every post: the AI for Devs series plus general tech posts. */
export default function BlogHomePage() {
  return <BlogIndex page={1} scope="blog" />
}
