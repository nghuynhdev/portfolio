import renderSiteOgImage, { siteOgAlt, siteOgSize } from '@/components/SiteOgImage'

// Next only reads these config exports when they are declared in the route file itself.
// /vi sets its own openGraph metadata, so it needs its own image route to keep og:image.
export const alt = siteOgAlt
export const size = siteOgSize
export const contentType = 'image/png'

export default function OpengraphImage() {
  return renderSiteOgImage()
}
