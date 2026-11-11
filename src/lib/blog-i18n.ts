/** UI strings for the AI for Devs pages. Safe to import from client components. */
export type BlogLang = 'vi' | 'en'

export const blogStrings = {
  vi: {
    htmlLang: 'vi-VN',
    ogLocale: 'vi_VN',
    home: 'Trang chủ',
    seriesTitle: 'AI for Devs — Học AI thực chiến cho Developer',
    seriesDescription:
      'Series AI thực chiến cho lập trình viên: LLM, prompt engineering, RAG, AI agent, chi phí, bảo mật và MCP, viết từ dự án thật.',
    seriesKeywords:
      'AI cho developer, học AI, LLM, prompt engineering, RAG, AI agent, MCP, lập trình AI, AI thực chiến',
    heroTitle: 'AI thực chiến cho Developer',
    heroIntroBefore: 'Mình là ',
    heroIntroLink: 'Nguyễn Huỳnh, một Full Stack Developer',
    heroIntroAfter:
      ' (React.js, Next.js, Node.js, NestJS). Đây là nơi mình ghi lại những thứ học được khi làm sản phẩm với AI — viết từ trải nghiệm thật, có code chạy được.',
    page: (n: number) => `Trang ${n}`,
    pageTitle: (n: number) => `AI for Devs — Trang ${n}`,
    pageDescription: (n: number, total: number) =>
      `Trang ${n}/${total} của series AI for Devs: bài viết AI thực chiến cho developer về LLM, RAG, AI agent, MCP và Claude Code.`,
    pagination: 'Phân trang',
    prevPage: 'Trước',
    nextPage: 'Sau',
    readPost: 'Đọc bài',
    minRead: (n: number) => `${n} phút đọc`,
    postNumber: (n: string) => `Bài ${n}`,
    updated: 'Cập nhật',
    notFound: 'Không tìm thấy bài viết',
    aboutPost: 'Về bài viết',
    readingTimeStrong: (n: number) => `${n} phút`,
    readingTimeSuffix: ' đọc',
    seriesPositionBefore: 'Bài ',
    seriesPositionAfter: (total: number) => `/${total} trong series`,
    toc: 'Mục lục',
    share: 'Chia sẻ bài viết',
    shareOn: (s: string) => `Chia sẻ lên ${s}`,
    recommendedEyebrow: 'Đọc tiếp',
    recommended: 'Có thể bạn sẽ thích',
    allPosts: 'Tất cả bài viết',
    /** Link to the other-language version, written in that language. */
    translationLink: 'Read in English',
    author: {
      label: 'Tác giả',
      homeAria: 'Về trang chủ Nguyễn Huỳnh',
      role: 'Full Stack Developer · TP.HCM',
      bio: '4 năm kinh nghiệm React.js, Next.js, Node.js, NestJS. Mình viết về AI từ những gì làm thật trong dự án — không lý thuyết suông.',
      portfolio: 'Xem portfolio',
      contact: 'Liên hệ',
    },
  },
  en: {
    htmlLang: 'en-US',
    ogLocale: 'en_US',
    home: 'Home',
    seriesTitle: 'AI for Devs — Practical AI for Developers',
    seriesDescription:
      'A practical AI series for developers: LLMs, prompt engineering, RAG, AI agents, cost, security and MCP, from real full-stack work.',
    seriesKeywords:
      'AI for developers, learn AI, LLM, prompt engineering, RAG, AI agents, MCP, AI engineering, practical AI',
    heroTitle: 'Practical AI for Developers',
    heroIntroBefore: "I'm ",
    heroIntroLink: 'Nguyen Huynh, a Full Stack Developer',
    heroIntroAfter:
      ' (React.js, Next.js, Node.js, NestJS). This is where I write down what I learn building products with AI — from real projects, with code that runs.',
    page: (n: number) => `Page ${n}`,
    pageTitle: (n: number) => `AI for Devs — Page ${n}`,
    pageDescription: (n: number, total: number) =>
      `Page ${n} of ${total} in the AI for Devs series: practical AI articles for developers on LLMs, RAG, AI agents, MCP and Claude Code.`,
    pagination: 'Pagination',
    prevPage: 'Previous',
    nextPage: 'Next',
    readPost: 'Read',
    minRead: (n: number) => `${n} min read`,
    postNumber: (n: string) => `Part ${n}`,
    updated: 'Updated',
    notFound: 'Post not found',
    aboutPost: 'About this post',
    readingTimeStrong: (n: number) => `${n} min`,
    readingTimeSuffix: ' read',
    seriesPositionBefore: 'Part ',
    seriesPositionAfter: (total: number) => ` of ${total} in the series`,
    toc: 'Contents',
    share: 'Share this post',
    shareOn: (s: string) => `Share on ${s}`,
    recommendedEyebrow: 'Keep reading',
    recommended: 'You might also like',
    allPosts: 'All posts',
    translationLink: 'Đọc bản tiếng Việt',
    author: {
      label: 'Author',
      homeAria: "Nguyen Huynh's homepage",
      role: 'Full Stack Developer · Ho Chi Minh City',
      bio: '4 years with React.js, Next.js, Node.js and NestJS. I write about AI from what I actually ship in projects — no hand-waving.',
      portfolio: 'View portfolio',
      contact: 'Contact',
    },
  },
}

/** Which series language a pathname belongs to, or null outside the blog. */
export function blogLangFromPath(pathname: string): BlogLang | null {
  if (pathname === '/en/ai-for-devs' || pathname.startsWith('/en/ai-for-devs/')) return 'en'
  if (pathname === '/ai-for-devs' || pathname.startsWith('/ai-for-devs/')) return 'vi'
  return null
}

/** Series root for a language (client-safe twin of BLOG_BASES in lib/blog). */
export function blogHome(lang: BlogLang): string {
  return lang === 'en' ? '/en/ai-for-devs' : '/ai-for-devs'
}
