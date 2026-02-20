import { createFileRoute, notFound } from '@tanstack/react-router'
import { getBlogPostBySlug } from '~/lib/content/blog'
import { Markdown } from '~/components/Markdown'
import { seo } from '~/utils/seo'
import { site } from '~/config'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await getBlogPostBySlug(params.slug)
    if (!post) throw notFound()
    return post
  },
  head: ({ loaderData }) => {
    const post = loaderData
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

function BlogPost() {
  const post = Route.useLoaderData()
  return (
    <article className="mx-auto max-w-[720px] px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        {(post.publishedAt || post.updatedAt) && (
          <time className="text-muted-foreground text-sm">
            {post.updatedAt ?? post.publishedAt}
          </time>
        )}
      </header>
      <Markdown content={post.content} />
    </article>
  )
}
