import { createFileRoute } from '@tanstack/react-router'
import { getBlogPosts } from '~/lib/content/blog'
import { getProjects } from '~/lib/content/projects'
import { site } from '~/config'

const host = `https://${site.domain}`

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const [posts, projects] = await Promise.all([getBlogPosts(), getProjects()])
        const urls = [
          host,
          `${host}/`,
          `${host}/blog`,
          `${host}/projects`,
          `${host}/site-notice`,
          ...posts.map((p) => `${host}/blog/${p.slug}`),
          ...projects.map((p) => `${host}/projects/${p.slug}`),
        ]
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n  ')}
</urlset>`
        return new Response(xml, {
          headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=28800, stale-while-revalidate=28800',
          },
        })
      },
    },
  },
})
