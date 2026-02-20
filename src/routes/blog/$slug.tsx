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
    <article className="container" style={{ padding: '3rem 24px' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{post.title}</h1>
        {(post.publishedAt || post.updatedAt) && (
          <time style={{ fontSize: '0.9rem', color: 'var(--fg-muted)' }}>
            {post.updatedAt ?? post.publishedAt}
          </time>
        )}
      </header>
      <Markdown content={post.content} />
    </article>
  )
}
