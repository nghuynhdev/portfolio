import renderSiteOgImage, { siteOgAlt, siteOgSize } from '@/components/SiteOgImage'

// Next only reads these config exports when they are declared in the route file itself.
export const alt = siteOgAlt
export const size = siteOgSize
export const contentType = 'image/png'

export default function OpengraphImage() {
  return renderSiteOgImage()
}
