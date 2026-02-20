import { createFileRoute, Link, useNavigate, useSearch } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import { getBlogPosts } from '~/lib/content/blog'
import { getExcerpt } from '~/lib/search'
import type { SearchableItem } from '~/lib/search'
import { seo } from '~/utils/seo'
import { site } from '~/config'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

export type BlogSort = 'newest' | 'oldest' | 'title-asc' | 'title-desc'

export const Route = createFileRoute('/blog/')({
  validateSearch: (search: Record<string, unknown>): { sort?: BlogSort } => ({
    sort:
      search.sort === 'newest' ||
      search.sort === 'oldest' ||
      search.sort === 'title-asc' ||
      search.sort === 'title-desc'
        ? search.sort
        : undefined,
  }),
  loader: () => getBlogPosts(),
  head: () => ({
    meta: [...seo({ title: `Blog | ${site.name}`, description: site.description, url: '/blog' })],
  }),
  component: BlogIndex,
})

const SORT_OPTIONS: { value: BlogSort; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'title-asc', label: 'Title A–Z' },
  { value: 'title-desc', label: 'Title Z–A' },
]

function formatDate(d: string | undefined): string {
  if (!d) return ''
  try {
    const date = new Date(d)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return d
  }
}

function sortPosts(posts: Awaited<ReturnType<typeof getBlogPosts>>, sort: BlogSort) {
  const sorted = [...posts]
  const getDate = (p: (typeof posts)[0]) =>
    new Date(p.updatedAt ?? p.publishedAt ?? 0).getTime()
  const getTitle = (p: (typeof posts)[0]) => (p.title ?? '').toLowerCase()

  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => getDate(b) - getDate(a))
    case 'oldest':
      return sorted.sort((a, b) => getDate(a) - getDate(b))
    case 'title-asc':
      return sorted.sort((a, b) => getTitle(a).localeCompare(getTitle(b)))
    case 'title-desc':
      return sorted.sort((a, b) => getTitle(b).localeCompare(getTitle(a)))
    default:
      return sorted.sort((a, b) => getDate(b) - getDate(a))
  }
}

function BlogIndex() {
  const posts = Route.useLoaderData()
  const { sort = 'newest' } = useSearch({ from: '/blog/' })
  const navigate = useNavigate()

  const sortedPosts = sortPosts(posts, sort)
  const currentLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Newest first'

  return (
    <div className="mx-auto max-w-[720px] px-6 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold">Blog</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              Sort: {currentLabel}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[10rem]">
            <DropdownMenuRadioGroup
              value={sort}
              onValueChange={(value) =>
                navigate({ to: '/blog', search: { sort: value as BlogSort } })
              }
            >
              {SORT_OPTIONS.map((opt) => (
                <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                  {opt.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="space-y-4">
        {sortedPosts.map((post) => {
          const excerpt = getExcerpt(post as SearchableItem)
          const date = post.updatedAt ?? post.publishedAt
          return (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug! }}
              className="group text-inherit no-underline transition-colors focus:outline-none block"
            >
              <Card className="overflow-hidden border-transparent transition-all hover:border-border hover:brightness-[1.02] hover:shadow-md dark:hover:shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  {excerpt && (
                    <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                      {excerpt}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {(post.tags ?? []).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {date && (
                    <time className="text-muted-foreground text-xs">
                      {formatDate(date)}
                    </time>
                  )}
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
