import matter from 'gray-matter'
import type { BlogPost } from './types'
import { slugFromTitle } from './parse'

const modules = import.meta.glob<string>('/content/blog/*.md', { query: '?raw', import: 'default', eager: true })

function loadAll(): BlogPost[] {
  const posts: BlogPost[] = []
  for (const [path, raw] of Object.entries(modules)) {
    const { data, content } = matter(raw)
    if (data.public === false) continue
    const slug = data.slug ?? slugFromTitle(data.title ?? path.split('/').pop()!.replace('.md', ''))
    posts.push({
      ...data,
      slug,
      content,
      type: 'blog',
    } as BlogPost)
  }
  return posts.sort((a, b) => {
    const aDate = (a.updatedAt ?? a.publishedAt ?? '').toString()
    const bDate = (b.updatedAt ?? b.publishedAt ?? '').toString()
    return bDate.localeCompare(aDate)
  })
}

let cache: BlogPost[] | null = null

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (cache) return cache
  cache = loadAll()
  return cache
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts()
  return posts.find((p) => p.slug === slug) ?? null
}
