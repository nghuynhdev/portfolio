/** UI strings and URL bases for the blog pages. Safe to import from client components. */
export type BlogLang = 'vi' | 'en'
/** 'ai' = the AI for Devs series, 'blog' = the general blog (which also lists the series). */
export type BlogSection = 'ai' | 'blog'

/** Public URL prefix of each section in each language. */
export const SECTION_BASES: Record<BlogSection, Record<BlogLang, string>> = {
  ai: { vi: '/ai-for-devs', en: '/en/ai-for-devs' },
  blog: { vi: '/blog', en: '/en/blog' },
}

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
    search: {
      label: 'Tìm bài viết',
      placeholder: 'Tìm bài viết: RAG, MCP, Claude Code…',
      clear: 'Xóa từ khóa',
      topics: 'Chủ đề gợi ý',
      latest: 'Bài mới nhất',
      results: (n: number) => `${n} bài phù hợp`,
      noResults: (q: string) => `Chưa có bài nào khớp với “${q}”`,
      noResultsHint: 'Thử từ khóa ngắn hơn hoặc chọn một chủ đề bên dưới.',
      hintNavigate: 'di chuyển',
      hintOpen: 'mở bài',
      hintClose: 'đóng',
    },
    /** Link to the other-language version, written in that language. */
    translationLink: 'Read in English',
    seriesName: 'AI for Devs',
    /** Label for general (non-series) posts. */
    techLabel: 'Công nghệ',
    filterLabel: 'Lọc bài viết',
    filterAll: 'Tất cả bài viết',
    filterSeries: 'Series AI for Devs',
    /** The /blog index: same keys as the series fields above. */
    blog: {
      name: 'Blog',
      seriesTitle: 'Blog — AI và công nghệ web thực chiến',
      seriesDescription:
        'Blog của Nguyễn Huỳnh: ghi chép thực chiến về React, Next.js, Node.js và làm sản phẩm với AI, viết từ dự án thật, có code chạy được.',
      seriesKeywords:
        'blog lập trình, React, Next.js, Node.js, NestJS, TypeScript, AI cho developer, kinh nghiệm lập trình web',
      heroTitle: 'Blog',
      heroIntroBefore: 'Mình là ',
      heroIntroLink: 'Nguyễn Huỳnh, một Full Stack Developer',
      heroIntroAfter:
        '. Ở đây có series AI for Devs và những ghi chép về công nghệ web mình dùng hằng ngày: React, Next.js, Node.js, TypeScript.',
      pageTitle: (n: number) => `Blog — Trang ${n}`,
      pageDescription: (n: number, total: number) =>
        `Trang ${n}/${total} của blog Nguyễn Huỳnh: bài viết thực chiến về công nghệ web và AI cho developer.`,
    },
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
    search: {
      label: 'Search posts',
      placeholder: 'Search posts: RAG, MCP, Claude Code…',
      clear: 'Clear search',
      topics: 'Suggested topics',
      latest: 'Latest posts',
      results: (n: number) => `${n} matching ${n === 1 ? 'post' : 'posts'}`,
      noResults: (q: string) => `No posts match “${q}”`,
      noResultsHint: 'Try a shorter keyword or pick a topic below.',
      hintNavigate: 'navigate',
      hintOpen: 'open',
      hintClose: 'close',
    },
    translationLink: 'Đọc bản tiếng Việt',
    seriesName: 'AI for Devs',
    techLabel: 'Tech',
    filterLabel: 'Filter posts',
    filterAll: 'All posts',
    filterSeries: 'AI for Devs series',
    blog: {
      name: 'Blog',
      seriesTitle: 'Blog — Practical Web Tech and AI',
      seriesDescription:
        "Nguyen Huynh's blog: practical notes on React, Next.js, Node.js and building products with AI, from real projects, with code that runs.",
      seriesKeywords:
        'programming blog, React, Next.js, Node.js, NestJS, TypeScript, AI for developers, web development',
      heroTitle: 'Blog',
      heroIntroBefore: "I'm ",
      heroIntroLink: 'Nguyen Huynh, a Full Stack Developer',
      heroIntroAfter:
        '. Here you will find the AI for Devs series and notes on the web tech I use every day: React, Next.js, Node.js, TypeScript.',
      pageTitle: (n: number) => `Blog — Page ${n}`,
      pageDescription: (n: number, total: number) =>
        `Page ${n} of ${total} of Nguyen Huynh's blog: practical articles on web technology and AI for developers.`,
    },
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

/** Which blog language a pathname belongs to, or null outside the blog pages. */
export function blogLangFromPath(pathname: string): BlogLang | null {
  // English bases are checked first: '/en/blog' must not be mistaken for a Vietnamese path.
  for (const lang of ['en', 'vi'] as const) {
    for (const bases of Object.values(SECTION_BASES)) {
      if (pathname === bases[lang] || pathname.startsWith(`${bases[lang]}/`)) return lang
    }
  }
  return null
}

/** Home page of each language: English at the root, Vietnamese at /vi. */
export const HOME_URLS: Record<BlogLang, string> = { en: '/', vi: '/vi' }

/** Home page URL for a language, optionally pointing at a section (`homeUrl('vi', 'contact')`). */
export function homeUrl(lang: BlogLang, section = ''): string {
  return `${HOME_URLS[lang]}${section ? `#${section}` : ''}`
}

/** Which language a home page pathname is in, or null when it is not a home page. */
export function homeLangFromPath(pathname: string): BlogLang | null {
  const path = pathname.replace(/\/$/, '') || '/'
  if (path === HOME_URLS.en) return 'en'
  if (path === HOME_URLS.vi) return 'vi'
  return null
}

/** Blog index (all posts) for a language. */
export function blogHome(lang: BlogLang): string {
  return SECTION_BASES.blog[lang]
}
