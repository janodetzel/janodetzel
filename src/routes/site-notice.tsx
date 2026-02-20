import { createFileRoute } from '@tanstack/react-router'
import { getPageBySlug } from '~/lib/content/pages'
import { Markdown } from '~/components/Markdown'
import { seo } from '~/utils/seo'
import { site } from '~/config'

export const Route = createFileRoute('/site-notice')({
  loader: () => getPageBySlug('site-notice'),
  head: ({ loaderData }) => {
    const page = loaderData
    if (!page) return { meta: [] }
    return {
      meta: [
        ...seo({
          title: page ? `${page.title} | ${site.name}` : `Site Notice | ${site.name}`,
          description: page?.description ?? site.description,
          url: '/site-notice',
        }),
      ],
    }
  },
  component: SiteNoticePage,
})

function SiteNoticePage() {
  const page = Route.useLoaderData()
  if (!page) return null
  return (
    <div className="container" style={{ padding: '3rem 24px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{page.title}</h1>
      <Markdown content={page.content} />
    </div>
  )
}
