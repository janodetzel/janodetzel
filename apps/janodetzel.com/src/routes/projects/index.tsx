import { createFileRoute, Link } from '@tanstack/react-router'
import { getProjects } from '~/lib/content/projects'
import { seo } from '~/utils/seo'
import { site } from '~/config'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent } from '~/components/ui/card'

export const Route = createFileRoute('/projects/')({
  loader: () => getProjects(),
  head: () => ({
    meta: [...seo({ title: `Projects | ${site.name}`, description: site.description, url: '/projects' })],
  }),
  component: ProjectsIndex,
})

function formatProjectDate(d: string | undefined): string {
  if (!d) return ''
  try {
    const date = new Date(d)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return d
  }
}

function ProjectsIndex() {
  const projects = Route.useLoaderData()
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Projects</h1>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-[6vmin]">
        {projects.map((project) => (
          <Link
            key={project.slug}
            to="/projects/$slug"
            params={{ slug: project.slug! }}
            className="group text-inherit no-underline transition-colors focus:outline-none"
          >
            <Card className="overflow-hidden border-transparent transition-all hover:border-border hover:brightness-[1.02] hover:shadow-md dark:hover:shadow-lg">
              {project.cover ? (
                <img
                  src={project.cover}
                  alt=""
                  className="aspect-video w-full object-cover rounded-t-lg"
                />
              ) : (
                <div className="aspect-video w-full rounded-t-lg bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm font-medium">
                    {project.title ?? project.slug}
                  </span>
                </div>
              )}
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-2">{project.title ?? project.slug}</h3>
                {project.description && (
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                    {project.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mb-2">
                  {(project.tags ?? []).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {(project.publishedAt || project.updatedAt) && (
                  <time className="text-muted-foreground text-xs">
                    {formatProjectDate(project.updatedAt ?? project.publishedAt)}
                  </time>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
