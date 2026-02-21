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
    <div className="mx-auto max-w-[720px] px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
      <Markdown content={page.content} />
    </div>
  )
}
