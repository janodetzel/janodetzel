import { createFileRoute } from '@tanstack/react-router'
import { site } from '~/config'

const host = `https://${site.domain}`

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const isProduction = url.hostname === site.domain
        const body = isProduction
          ? `User-agent: *
Allow: /

Sitemap: ${host}/sitemap.xml
`
          : `User-agent: *
Disallow: /

Sitemap: ${host}/sitemap.xml
`
        return new Response(body, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=86400, immutable',
          },
        })
      },
    },
  },
})
