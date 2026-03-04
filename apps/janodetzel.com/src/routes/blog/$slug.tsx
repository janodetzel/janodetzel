import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { Eye } from 'lucide-react'
import { getBlogPostBySlug } from '~/lib/content/blog'
import { getAndIncrementImpression } from '~/lib/impressions'
import { Markdown } from '~/components/Markdown'
import { seo } from '~/utils/seo'
import { site } from '~/config'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await getBlogPostBySlug(params.slug)
    if (!post) throw notFound()
    const impressions = await getAndIncrementImpression(params.slug)
    return { post, impressions }
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post
    if (!post) return { meta: [] }
    return {
      meta: [
        ...seo({
          title: `${post.title} | ${site.name}`,
          description: post.description ?? site.description,
          url: `/blog/${post.slug}`,
        }),
      ],
    }
  },
  component: BlogPost,
})

function formatDate(d: string | undefined): string {
  if (!d) return ''
  try {
    const date = new Date(d)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return d
  }
}

function BlogPost() {
  const { post, impressions } = Route.useLoaderData()
  return (
    <article className="mx-auto max-w-[720px] px-6 py-12">
      <header className="mb-8">
        <Link
          to="/blog"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          ← Back to blog
        </Link>
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <div className="flex flex-col gap-0.5">
          {(post.publishedAt || post.updatedAt) && (
            <time className="text-muted-foreground text-sm">
              {formatDate(post.updatedAt ?? post.publishedAt)}
            </time>
          )}
          {impressions > 0 && (
            <span className="text-muted-foreground text-sm inline-flex items-center gap-1">
              <Eye className="h-4 w-4" aria-hidden />
              {impressions.toLocaleString()}
            </span>
          )}
        </div>
      </header>
      <Markdown content={post.content} />
    </article>
  )
}
