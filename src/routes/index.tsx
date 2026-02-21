import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Github, Linkedin, Instagram } from 'lucide-react'
import { Avatar, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { site } from '~/config'
import { getBlogPosts } from '~/lib/content/blog'
import { getPageBySlug } from '~/lib/content/pages'
import { getProjects } from '~/lib/content/projects'
import type { SearchableItem } from '~/lib/search'
import { getExcerpt } from '~/lib/search'

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): { search?: string } => ({
    search: typeof search.search === 'string' ? search.search : undefined,
  }),
  loader: async () => {
    const [projects, homePage, posts] = await Promise.all([
      getProjects(),
      getPageBySlug('home'),
      getBlogPosts(),
    ])
    const latestPost = posts[0] ?? null
    return { projects, homePage, latestPost }
  },
  component: HomePage,
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

function HomePage() {
  const { projects, homePage, latestPost } = Route.useLoaderData()
  const tags = homePage?.tags ?? []
  const email = homePage?.email ?? 'hello@janodetzel.com'

  return (
    <article>
      <header className="mb-8 w-full overflow-hidden">
        <img
          src={homePage?.cover ?? 'https://media.giphy.com/media/JoVV55m3KZHdxlpFZ6/giphy.gif'}
          alt=""
          className="block w-full max-h-[30vh] object-cover object-center"
        />
      </header>
      <div className="mx-auto max-w-[900px] px-6 py-12">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">{site.name}</h1>
          <div className="flex flex-wrap justify-center items-center gap-2 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
          <a
            href={`mailto:${email}`}
            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {email}
          </a>
        </header>

        <div className="grid grid-cols-[68.75%_31.25%] gap-8 mb-8 max-md:grid-cols-1">
          <div className="flex flex-col justify-between min-h-[202px] max-md:min-h-0 max-md:justify-start">
            <div>
              <h2 className="text-3xl font-semibold mb-2">
                {homePage?.title}
              </h2>
              <p className="text-muted-foreground m-0">
                {homePage?.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 max-md:mt-4">
              {site.github && (
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="w-fit gap-2 px-6 py-6 text-base"
                >
                  <a
                    href={`https://github.com/${site.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    Github
                    <Github size={20} aria-hidden />
                  </a>
                </Button>
              )}
              {site.linkedin && (
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="w-fit gap-2 px-6 py-6 text-base"
                >
                  <a
                    href={`https://linkedin.com/in/${site.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    LinkedIn
                    <Linkedin size={20} aria-hidden />
                  </a>
                </Button>
              )}
              {site.instagram && (
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="w-fit gap-2 px-6 py-6 text-base"
                >
                  <a
                    href={`https://instagram.com/${site.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    Instagram
                    <Instagram size={20} aria-hidden />
                  </a>
                </Button>
              )}
            </div>
          </div>
          <div className="flex flex-row items-start gap-4">
            <Avatar className="size-[202px] shrink-0 overflow-visible rounded-none">
              <AvatarImage
                src={homePage?.avatar ?? '/assets/pages/home/profile-2.png'}
                alt="Jano Detzel"
                className="!aspect-auto object-contain"
              />
            </Avatar>
          </div>
        </div>

        <Separator className="my-8" />

        {latestPost?.slug && (
          <section className="mb-8">
            <h4 className="text-base font-semibold mb-4">Latest from the blog</h4>
            <Link
              to="/blog/$slug"
              params={{ slug: latestPost.slug }}
              className="group block text-inherit no-underline focus:outline-none"
            >
              <Card className="overflow-hidden border-transparent transition-all hover:border-border hover:brightness-[1.02] hover:shadow-md dark:hover:shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-2">{latestPost.title}</h3>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                    {getExcerpt(latestPost as SearchableItem)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {(latestPost.tags ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {(latestPost.tags ?? []).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {(latestPost.updatedAt || latestPost.publishedAt) && (
                      <time className="text-muted-foreground text-xs">
                        {formatProjectDate(latestPost.updatedAt ?? latestPost.publishedAt)}
                      </time>
                    )}
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground group-hover:underline">
                      Read more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </section>
        )}

        <Separator className="my-8" />

        <section>
          <h4 className="text-base font-semibold mb-4">Projects</h4>
          <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-[6vmin]">
            {projects.map((project) =>
              project.slug ? (
                <Link
                  key={project.slug}
                  to="/projects/$slug"
                  params={{ slug: project.slug }}
                  className="group"
                >
                  <Card className="overflow-hidden border-transparent transition-all hover:border-border hover:brightness-[1.02] hover:shadow-md dark:hover:shadow-lg">
                    {project.cover ? (
                      <img
                        src={project.cover}
                        alt=""
                        className="aspect-video w-full object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="aspect-video w-full rounded-t-lg bg-muted" />
                    )}
                    <CardContent className="px-4 py-6">
                      <h3 className="text-xl font-semibold mb-2">{project.title ?? project.slug}</h3>
                      <p className="text-muted-foreground text-sm m-0">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(project.tags ?? []).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {project.publishedAt && (
                        <time className="block mt-2 text-muted-foreground text-xs">
                          {formatProjectDate(project.publishedAt)}
                        </time>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ) : null)}
          </div>
        </section>

        <Separator className="my-8" />

        <section>
          <h2 className="text-xl font-semibold mb-2">
            {homePage?.footerTitle ?? '📮 Contact'}
          </h2>
          <p className="text-muted-foreground">
            {homePage?.footerContent ?? 'The best way to get in touch with me is to email'}{' '}
            <a href={`mailto:${email}`} className="hover:text-foreground transition-colors">
              {email}
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  )
}
