import type { Metadata } from 'next'
import RootDocument from '@/components/RootDocument'
import NotFoundView from '@/components/NotFoundView'

// Unmatched URLs belong to no route group, so they need their own document.
export const metadata: Metadata = {
  metadataBase: new URL('https://www.huynhnguyen.info.vn'),
  title: '404 - Page not found',
  robots: { index: false },
}

export default function GlobalNotFound() {
  return (
    <RootDocument lang="en">
      <NotFoundView />
    </RootDocument>
  )
}
