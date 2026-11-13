import type { Metadata } from 'next'
import HomePage, { homeAlternates } from '@/components/HomePage'

export const metadata: Metadata = { alternates: homeAlternates('en') }

/** English home page; the Vietnamese one is /vi. */
export default function Home() {
  return <HomePage />
}
