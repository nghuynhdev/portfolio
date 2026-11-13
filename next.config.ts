import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Two root layouts (vi / en) -> unmatched URLs render app/global-not-found.tsx.
  experimental: { globalNotFound: true },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'huynh-portfolio.vercel.app' }],
        destination: 'https://www.huynhnguyen.info.vn/:path*',
        permanent: true,
      },
      // /blog is the index of every post. Old /blog/<slug> links to series posts
      // (from before the series moved to /ai-for-devs) are redirected by the /blog/[slug] page.
      // Posts merged into longer guides (content review, 2026-11).
      { source: '/ai-for-devs/hybrid-search-va-reranking-cho-rag', destination: '/ai-for-devs/rag-production-tu-ingestion-den-hybrid-search', permanent: true },
      { source: '/ai-for-devs/ingestion-tai-lieu-cho-rag', destination: '/ai-for-devs/rag-production-tu-ingestion-den-hybrid-search', permanent: true },
      { source: '/ai-for-devs/workflow-ai-ben-vung-va-idempotency', destination: '/ai-for-devs/do-tin-cay-llm-timeout-retry-idempotency', permanent: true },
      { source: '/ai-for-devs/timeout-retry-va-fallback-llm', destination: '/ai-for-devs/do-tin-cay-llm-timeout-retry-idempotency', permanent: true },
      { source: '/ai-for-devs/observability-va-tracing-cho-ai', destination: '/ai-for-devs/van-hanh-llm-tracing-version-rollout', permanent: true },
      { source: '/ai-for-devs/trien-khai-prompt-model-an-toan', destination: '/ai-for-devs/van-hanh-llm-tracing-version-rollout', permanent: true },
      { source: '/ai-for-devs/ui-ux-pro-max-cho-claude-code', destination: '/ai-for-devs/lam-ui-voi-claude-code-skills', permanent: true },
      { source: '/ai-for-devs/frontend-design-skill-claude-code', destination: '/ai-for-devs/lam-ui-voi-claude-code-skills', permanent: true },
      { source: '/ai-for-devs/web-design-guidelines-claude-code', destination: '/ai-for-devs/lam-ui-voi-claude-code-skills', permanent: true },
      // Page 1 is canonical at the series root.
      { source: '/ai-for-devs/page/1', destination: '/ai-for-devs', permanent: true },
      { source: '/en/ai-for-devs/page/1', destination: '/en/ai-for-devs', permanent: true },
      { source: '/blog/page/1', destination: '/blog', permanent: true },
      { source: '/en/blog/page/1', destination: '/en/blog', permanent: true },
    ]
  },
}

export default nextConfig