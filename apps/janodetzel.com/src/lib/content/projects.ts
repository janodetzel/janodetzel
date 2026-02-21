import matter from 'gray-matter'
import type { Project } from './types'
import { slugFromTitle } from './parse'

const modules = import.meta.glob<string>('/content/projects/*.md', { query: '?raw', import: 'default', eager: true })

function loadAll(): Project[] {
  const projects: Project[] = []
  for (const [path, raw] of Object.entries(modules)) {
    const { data, content } = matter(raw)
    if (data.public === false) continue
    const slug = data.slug ?? slugFromTitle(data.title ?? path.split('/').pop()!.replace('.md', ''))
    projects.push({
      ...data,
      slug,
      content,
      type: 'project',
    } as Project)
  }
  return projects.sort((a, b) => {
    const aDate = (a.updatedAt ?? a.publishedAt ?? '').toString()
    const bDate = (b.updatedAt ?? b.publishedAt ?? '').toString()
    return bDate.localeCompare(aDate)
  })
}

let cache: Project[] | null = null

export async function getProjects(): Promise<Project[]> {
  if (cache) return cache
  cache = loadAll()
  return cache
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects()
  return projects.find((p) => p.slug === slug) ?? null
}
