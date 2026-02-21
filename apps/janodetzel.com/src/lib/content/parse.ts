import matter from 'gray-matter'
import type { ContentFrontmatter } from './types'

export function parseMarkdown<T extends ContentFrontmatter>(
  raw: string,
  defaults: Partial<T> = {}
): { frontmatter: T; content: string } {
  const { data, content } = matter(raw)
  const frontmatter = {
    ...defaults,
    ...data,
    tags: Array.isArray(data?.tags) ? data.tags : (data?.tags ? String(data.tags).split(',').map((t: string) => t.trim()) : undefined),
  } as T
  return { frontmatter, content }
}

export function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
