import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'huynh-portfolio.vercel.app' }],
        destination: 'https://www.huynhnguyen.info.vn/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig