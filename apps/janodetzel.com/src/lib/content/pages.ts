import matter from 'gray-matter'
import type { PageContent } from './types'
import { slugFromTitle } from './parse'

const modules = import.meta.glob<string>('/content/pages/*.md', { query: '?raw', import: 'default', eager: true })

function loadAll(): Map<string, PageContent> {
  const map = new Map<string, PageContent>()
  for (const [path, raw] of Object.entries(modules)) {
    const { data, content } = matter(raw)
    const slug = data.slug ?? slugFromTitle(data.title ?? path.split('/').pop()!.replace('.md', ''))
    map.set(slug, { ...data, slug, content, type: 'page' } as PageContent)
  }
  return map
}

let cache: Map<string, PageContent> | null = null

function getCache() {
  if (!cache) cache = loadAll()
  return cache
}

export async function getPageBySlug(slug: string): Promise<PageContent | null> {
  return getCache().get(slug) ?? null
}
