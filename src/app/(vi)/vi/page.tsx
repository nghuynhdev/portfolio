import type { Metadata } from 'next'
import HomePage, { homeAlternates } from '@/components/HomePage'
import { HOME_URLS } from '@/lib/blog-i18n'

const TITLE = 'Nguyễn Huỳnh (Huynh Nguyen) - Lập trình viên Full Stack'
const DESCRIPTION =
  'Nguyễn Huỳnh (Huynh Nguyen), lập trình viên Full Stack tại TP. Hồ Chí Minh với 4 năm xây dựng ứng dụng web bằng React.js, Next.js và NestJS.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: homeAlternates('vi'),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: HOME_URLS.vi,
    siteName: 'Nguyễn Huỳnh',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    creator: '@nghuynhit',
  },
}

/** Vietnamese home page, server-rendered with <html lang="vi">; the English one is /. */
export default function VietnameseHome() {
  return <HomePage />
}
