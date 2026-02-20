import { createFileRoute, notFound } from '@tanstack/react-router'
import { getProjectBySlug } from '~/lib/content/projects'
import { Markdown } from '~/components/Markdown'
import { seo } from '~/utils/seo'
import { site } from '~/config'

export const Route = createFileRoute('/projects/$slug')({
  loader: async ({ params }) => {
    const project = await getProjectBySlug(params.slug)
    if (!project) throw notFound()
    return project
  },
  head: ({ loaderData }) => {
    const project = loaderData
    if (!project) return { meta: [] }
    return {
      meta: [
        ...seo({
          title: `${project.title} | ${site.name}`,
          description: project.description ?? site.description,
          url: `/projects/${project.slug}`,
        }),
      ],
    }
  },
  component: ProjectPage,
})

function ProjectPage() {
  const project = Route.useLoaderData()
  return (
    <article className="container" style={{ padding: '3rem 24px' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{project.title}</h1>
        {project.description && (
          <p style={{ color: 'var(--fg-muted)', marginTop: '0.5rem' }}>{project.description}</p>
        )}
      </header>
      <Markdown content={project.content} />
    </article>
  )
}
