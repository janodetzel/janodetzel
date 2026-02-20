import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { seo } from '~/utils/seo'
import { Footer } from '~/components/Footer'
import { NotFound } from '~/components/NotFound'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import appCss from '~/styles/app.css?url'
import { site } from '~/config'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ...seo({ title: site.name, description: site.description }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'alternate', type: 'application/rss+xml', href: '/feed.xml', title: site.name },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: NotFound,
  component: RootLayout,
})

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <nav className="container" style={{ padding: '1.5rem 24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ fontWeight: 600, color: 'var(--fg)' }}>{site.name}</Link>
          <Link to="/blog" style={{ color: 'var(--fg-muted)' }}>Blog</Link>
          <Link to="/projects" style={{ color: 'var(--fg-muted)' }}>Projects</Link>
        </nav>
        <main>
          <Outlet />
        </main>
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}
