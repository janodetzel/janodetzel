import type { BlogPost } from '~/lib/content/types'
import type { Project } from '~/lib/content/types'

export type SearchableItem = (BlogPost | Project) & { slug: string }

export type SearchFilter = 'all' | 'blog' | 'projects'

function searchableText(item: SearchableItem): string {
  const parts = [
    item.title ?? '',
    item.description ?? '',
    item.slug ?? '',
    ...(item.tags ?? []),
  ]
  return parts.join(' ').toLowerCase()
}

export function matchesQuery(item: SearchableItem, q: string): boolean {
  if (!q.trim()) return true
  const terms = q.trim().toLowerCase().split(/\s+/)
  const text = searchableText(item)
  return terms.every((term) => text.includes(term))
}

export function getExcerpt(item: SearchableItem, maxLength = 160): string {
  if (item.description?.trim()) return item.description.trim()
  const content = (item as BlogPost | Project).content ?? ''
  const stripped = content
    .replace(/^---[\s\S]*?---/, '')
    .replace(/[#*`\[\]()_~]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
  if (!stripped) return ''
  return stripped.length <= maxLength ? stripped : stripped.slice(0, maxLength).trim() + '…'
}

export function filterSearchResults(
  posts: BlogPost[],
  projects: Project[],
  q: string,
  filter: SearchFilter
): { posts: BlogPost[]; projects: Project[] } {
  const filteredPosts = q ? posts.filter((p) => matchesQuery(p as SearchableItem, q)) : []
  const filteredProjects = q ? projects.filter((p) => matchesQuery(p as SearchableItem, q)) : []

  switch (filter) {
    case 'blog':
      return { posts: filteredPosts, projects: [] }
    case 'projects':
      return { posts: [], projects: filteredProjects }
    default:
      return { posts: filteredPosts, projects: filteredProjects }
  }
}
