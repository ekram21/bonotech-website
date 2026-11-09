import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const dist = resolve('dist')
const publicOrigin = (process.env.PORTFOLIO_PUBLIC_ORIGIN || 'https://bonotech-website.web.app').replace(/\/$/, '')
const title = 'Bonotech — Portfolio'
const description = 'Explore Bonotech’s portfolio of custom software, connected platforms, and AI-native products built to move businesses forward.'
const image = `${publicOrigin}/portfolio-og.png`
const canonical = `${publicOrigin}/portfolio`

const escapeAttribute = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')

function setMeta(html, attribute, key, value) {
  const matcher = new RegExp(`<meta\\s+${attribute}="${key}"[^>]*>`, 'i')
  const tag = `<meta ${attribute}="${key}" content="${escapeAttribute(value)}" />`
  return matcher.test(html)
    ? html.replace(matcher, tag)
    : html.replace('</head>', `  ${tag}\n</head>`)
}

let html = await readFile(resolve(dist, 'index.html'), 'utf8')
html = html.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`)
html = setMeta(html, 'name', 'description', description)
html = setMeta(html, 'property', 'og:type', 'website')
html = setMeta(html, 'property', 'og:title', title)
html = setMeta(html, 'property', 'og:description', description)
html = setMeta(html, 'property', 'og:url', canonical)
html = setMeta(html, 'property', 'og:image', image)
html = setMeta(html, 'property', 'og:image:width', '1200')
html = setMeta(html, 'property', 'og:image:height', '630')
html = setMeta(html, 'property', 'og:image:alt', 'Bonotech portfolio — selected digital products and enterprise platforms')
html = setMeta(html, 'name', 'twitter:card', 'summary_large_image')
html = setMeta(html, 'name', 'twitter:title', title)
html = setMeta(html, 'name', 'twitter:description', description)
html = setMeta(html, 'name', 'twitter:image', image)

const canonicalTag = `<link rel="canonical" href="${escapeAttribute(canonical)}" />`
if (/<link\s+rel="canonical"/i.test(html)) {
  html = html.replace(/<link\s+rel="canonical"[^>]*>/i, canonicalTag)
} else {
  html = html.replace('</head>', `  ${canonicalTag}\n</head>`)
}

await writeFile(resolve(dist, 'portfolio.html'), html)
console.log(`Generated dist/portfolio.html for ${canonical}`)
