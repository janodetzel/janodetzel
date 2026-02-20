import { createFileRoute, Link } from '@tanstack/react-router'
import { getBlogPosts } from '~/lib/content/blog'
import { seo } from '~/utils/seo'
import { site } from '~/config'

export const Route = createFileRoute('/blog/')({
  loader: () => getBlogPosts(),
  head: () => ({
    meta: [...seo({ title: `Blog | ${site.name}`, description: site.description, url: '/blog' })],
  }),
  component: BlogIndex,
})

function BlogIndex() {
  const posts = Route.useLoaderData()
  return (
    <div className="container" style={{ padding: '3rem 24px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Blog</h1>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {posts.map((post) => (
          <li key={post.slug} style={{ marginBottom: '1rem' }}>
            <Link to="/blog/$slug" params={{ slug: post.slug! }} style={{ fontWeight: 500, color: 'var(--fg)' }}>
              {post.title}
            </Link>
            {post.description && (
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: 'var(--fg-muted)' }}>{post.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
