import { ImageResponse } from 'next/og'

export const siteOgAlt = 'Nguyen Huynh - Full Stack Developer'
export const siteOgSize = { width: 1200, height: 630 }

/** Default social image, used by the opengraph-image route of each root layout. */
export default function renderSiteOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 96,
          background: '#0f1117',
          color: '#ffffff',
        }}
      >
        <div style={{ fontSize: 88, fontWeight: 700 }}>Nguyen Huynh</div>
        <div style={{ fontSize: 48, color: '#3b9dff', marginTop: 16 }}>Full Stack Developer</div>
        <div style={{ fontSize: 32, color: '#c7ccd6', marginTop: 48 }}>
          React.js · Next.js · Node.js · NestJS · TypeScript
        </div>
        <div style={{ fontSize: 28, color: '#8b93a3', marginTop: 16 }}>huynhnguyen.info.vn</div>
      </div>
    ),
    siteOgSize
  )
}
