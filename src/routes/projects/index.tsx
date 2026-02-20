import { createFileRoute, Link } from '@tanstack/react-router'
import { getProjects } from '~/lib/content/projects'
import { seo } from '~/utils/seo'
import { site } from '~/config'

export const Route = createFileRoute('/projects/')({
  loader: () => getProjects(),
  head: () => ({
    meta: [...seo({ title: `Projects | ${site.name}`, description: site.description, url: '/projects' })],
  }),
  component: ProjectsIndex,
})

function ProjectsIndex() {
  const projects = Route.useLoaderData()
  return (
    <div className="container" style={{ padding: '3rem 24px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Projects</h1>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {projects.map((project) => (
          <li key={project.slug} style={{ marginBottom: '1rem' }}>
            <Link to="/projects/$slug" params={{ slug: project.slug! }} style={{ fontWeight: 500, color: 'var(--fg)' }}>
              {project.title}
            </Link>
            {project.description && (
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: 'var(--fg-muted)' }}>{project.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
