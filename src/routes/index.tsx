import { createFileRoute, Link } from '@tanstack/react-router'
import { getBlogPosts } from '~/lib/content/blog'
import { getProjects } from '~/lib/content/projects'
import { getPageBySlug } from '~/lib/content/pages'
import { Markdown } from '~/components/Markdown'
import { site } from '~/config'

export const Route = createFileRoute('/')({
  loader: async () => {
    const [posts, projects, homePage] = await Promise.all([
      getBlogPosts(),
      getProjects(),
      getPageBySlug('home'),
    ])
    const featured = [...posts.filter((p) => p.featured), ...projects.filter((p) => p.featured)]
    return { posts, projects, homePage, featured }
  },
  component: HomePage,
})

function HomePage() {
  const { homePage, featured } = Route.useLoaderData()
  return (
    <div className="container" style={{ padding: '3rem 24px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{site.name}</h1>
      <p style={{ color: 'var(--fg-muted)', marginBottom: '2rem' }}>{site.description}</p>
      {homePage?.content && <Markdown content={homePage.content} />}
      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Featured</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {featured.slice(0, 4).map((item) => (
            <li key={item.slug} style={{ marginBottom: '0.5rem' }}>
              <Link
                to={item.type === 'blog' ? '/blog/$slug' : '/projects/$slug'}
                params={{ slug: item.slug! }}
              >
                {item.title ?? item.slug}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <p style={{ marginTop: '2rem' }}>
        <Link to="/blog">Blog</Link> · <Link to="/site-notice">Site notice</Link>
      </p>
    </div>
  )
}
