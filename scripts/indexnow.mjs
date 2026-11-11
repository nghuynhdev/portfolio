// Notify Bing (and other IndexNow engines: Yandex, Seznam, Naver...) about URLs on the live site.
// Run after a deploy has finished:
//   node scripts/indexnow.mjs                       -> every URL in the live sitemap
//   node scripts/indexnow.mjs --since 2026-11-01    -> only URLs with lastmod on/after that date
//   node scripts/indexnow.mjs /ai-for-devs/some-post /en/ai-for-devs/other-post
// The key file public/<KEY>.txt must already be deployed, or the engines reject the request.
const HOST = 'www.huynhnguyen.info.vn'
const SITE = `https://${HOST}`
const KEY = 'edc3a2b6c7d6c8ab07182ac81cf67be5'

const args = process.argv.slice(2)
const sinceIdx = args.indexOf('--since')
const since = sinceIdx >= 0 ? args[sinceIdx + 1] : null
const paths = args.filter((a, i) => a.startsWith('/') && !(sinceIdx >= 0 && i === sinceIdx + 1))

async function sitemapUrls() {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text()
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
    .map(([, block]) => ({
      loc: block.match(/<loc>(.*?)<\/loc>/)?.[1],
      lastmod: block.match(/<lastmod>(.*?)<\/lastmod>/)?.[1] ?? '',
    }))
    .filter((u) => u.loc && (!since || !u.lastmod || u.lastmod.slice(0, 10) >= since))
    .map((u) => u.loc)
}

const keyCheck = await fetch(`${SITE}/${KEY}.txt`)
if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) {
  console.error(`Key file ${SITE}/${KEY}.txt is not live yet. Deploy first.`)
  process.exit(1)
}

const urlList = paths.length ? paths.map((p) => SITE + p) : await sitemapUrls()
if (!urlList.length) {
  console.log('No URLs to submit.')
  process.exit(0)
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
})
// 200 = accepted, 202 = accepted while the key is being validated. Anything else is an error.
console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URL(s)`)
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text())
  process.exit(1)
}
