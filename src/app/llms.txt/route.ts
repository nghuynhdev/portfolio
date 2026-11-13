import { BLOG_SECTIONS, getAllPosts, postUrl, type BlogLang } from '@/lib/blog'
import { HOME_URLS, SECTION_BASES } from '@/lib/blog-i18n'

const SITE_URL = 'https://www.huynhnguyen.info.vn'

export const dynamic = 'force-static'

function postList(lang: BlogLang): string {
  return BLOG_SECTIONS.flatMap((section) =>
    getAllPosts(lang, section).map(
      (p) => `- [${p.title}](${SITE_URL}${postUrl(p.slug, lang, section)}): ${p.description}`
    )
  ).join('\n')
}

/** /llms.txt: a plain-text map of the site for AI assistants, built from the posts at build time. */
export function GET() {
  const body = `# Nguyễn Huỳnh (Huynh Nguyen)

> Portfolio and technical blog of Nguyễn Huỳnh, a Full Stack Developer in Ho Chi Minh City, Vietnam (React.js, Next.js, Node.js, NestJS). The blog covers practical AI for developers (LLMs, RAG, AI agents, MCP, Claude Code) and web technology. Every article exists in Vietnamese and English.

## Site

- [Home (English)](${SITE_URL}${HOME_URLS.en}): profile, work experience, skills, contact
- [Trang chủ (Tiếng Việt)](${SITE_URL}${HOME_URLS.vi}): hồ sơ, kinh nghiệm, kỹ năng, liên hệ
- [Blog (English)](${SITE_URL}${SECTION_BASES.blog.en}): every article in English
- [Blog (Tiếng Việt)](${SITE_URL}${SECTION_BASES.blog.vi}): toàn bộ bài viết tiếng Việt
- [AI for Devs series (English)](${SITE_URL}${SECTION_BASES.ai.en})
- [AI for Devs (Tiếng Việt)](${SITE_URL}${SECTION_BASES.ai.vi})

## Articles (English)

${postList('en')}

## Bài viết (Tiếng Việt)

${postList('vi')}
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
