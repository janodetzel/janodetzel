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
    <article className="mx-auto max-w-[720px] px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
        {project.description && (
          <p className="text-muted-foreground mt-2">{project.description}</p>
        )}
      </header>
      <Markdown content={project.content} />
    </article>
  )
}
