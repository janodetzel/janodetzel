import { createFileRoute } from '@tanstack/react-router'
import { getBlogPosts } from '~/lib/content/blog'
import { site } from '~/config'

const host = `https://${site.domain}`

export const Route = createFileRoute('/feed.xml')({
  server: {
    handlers: {
      GET: async () => {
        const posts = await getBlogPosts()
        const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${host}</link>
    <description>${escapeXml(site.description)}</description>
    <language>${site.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${host}/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${host}/blog/${p.slug}</link>
      <description>${escapeXml(p.description ?? '')}</description>
      <pubDate>${p.publishedAt ? new Date(p.publishedAt).toUTCString() : new Date().toUTCString()}</pubDate>
    </item>`
      )
      .join('')}
  </channel>
</rss>`
        return new Response(rss, {
          headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=86400, stale-while-revalidate=86400',
          },
        })
      },
    },
  },
})

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
