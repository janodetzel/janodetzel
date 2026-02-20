#!/usr/bin/env tsx
/**
 * One-time script to convert Notion HTML/CSV export to markdown content.
 * Run: npm run convert-content
 *
 * Reads from tmp/ExportBlock-164023fb-7c98-4e3e-a765-5420504ebdc6-Part-1/
 * Writes to content/blog, content/projects, content/pages
 */

import { readFile, writeFile, readdir, mkdir, copyFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import TurndownService from 'turndown'

const EXPORT_ROOT = join(process.cwd(), 'tmp/ExportBlock-164023fb-7c98-4e3e-a765-5420504ebdc6-Part-1')
const JANODETZEL = join(EXPORT_ROOT, 'janodetzel com')
const CONTENT_ROOT = join(process.cwd(), 'content')
const PUBLIC_ROOT = join(process.cwd(), 'public')

function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^→\s*/, '')
    .replace(/^-|-$/g, '')
}

function parseDate(s: string): string {
  if (!s) return ''
  const m = s.match(/@?([A-Za-z]+\s+\d{1,2},?\s+\d{4}(?:\s+\d{1,2}:\d{2}(?:\s*[AP]M)?)?)/)
  if (m) {
    try {
      return new Date(m[1]!.trim()).toISOString().slice(0, 10)
    } catch {
      return s
    }
  }
  return s
}

function parseTags(s: string): string[] {
  if (!s) return []
  return s.split(',').map((t) => t.trim()).filter(Boolean)
}

function extractBodyFromHtml(html: string): string {
  const match = html.match(/<div class="page-body">([\s\S]*?)<\/div>\s*<\/article>/)
  if (!match) return ''
  return match[1]!.trim()
}

function htmlToMarkdown(html: string): string {
  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
  })
  td.addRule('removePropertiesTable', {
    filter: ['table'],
    replacement: () => '',
  })
  td.addRule('bookmarkAsLink', {
    filter: (node) => {
      if (node.nodeName !== 'FIGURE') return false
      const a = node.querySelector('a.bookmark')
      return !!a
    },
    replacement: (content, node) => {
      const a = node.querySelector('a.bookmark') as HTMLAnchorElement
      const title = node.querySelector('.bookmark-title')?.textContent?.trim()
      const href = a?.href || ''
      return title ? `[${title}](${href})\n\n` : `[${href}](${href})\n\n`
    },
  })
  return td.turndown(html)
}

function buildFrontmatter(meta: Record<string, string>, overrides: Record<string, unknown> = {}): string {
  const lines: string[] = ['---']
  const add = (key: string, val: unknown) => {
    if (val === undefined || val === null || val === '') return
    if (Array.isArray(val)) lines.push(`${key}: [${val.map((v) => `"${String(v).replace(/"/g, '\\"')}"`).join(', ')}]`)
    else if (typeof val === 'boolean') lines.push(`${key}: ${val}`)
    else lines.push(`${key}: "${String(val).replace(/"/g, '\\"')}"`)
  }
  add('title', meta.title ?? meta.Name ?? meta['Page Title'] ?? overrides.title)
  add('description', meta.description ?? overrides.description)
  add('publishedAt', parseDate(meta.Published ?? meta.Created ?? ''))
  add('updatedAt', parseDate(meta['Last Updated'] ?? meta['Last Edited'] ?? ''))
  add('tags', parseTags(meta.Tags ?? ''))
  add('featured', meta.Featured === 'Yes')
  add('public', meta.Public === 'Yes')
  add('tweet', meta.Tweet ?? '')
  add('slug', overrides.slug ?? meta.Slug ?? '')
  Object.entries(overrides).forEach(([k, v]) => {
    if (!['title', 'description', 'publishedAt', 'updatedAt', 'tags', 'featured', 'public', 'tweet', 'slug'].includes(k))
      add(k, v)
  })
  lines.push('---')
  return lines.join('\n')
}

async function copyImages(htmlDir: string, slug: string, targetSubdir: string, assetDirName?: string): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  try {
    const entries = await readdir(htmlDir, { withFileTypes: true })
    const imgDir = assetDirName
      ? entries.find((e) => e.isDirectory() && e.name === assetDirName)
      : entries.find((e) => e.isDirectory() && !e.name.includes(' '))
    if (!imgDir) return map
    const imgPath = join(htmlDir, imgDir.name)
    const files = await readdir(imgPath)
    const outDir = join(PUBLIC_ROOT, targetSubdir, slug)
    await mkdir(outDir, { recursive: true })
    for (const f of files) {
      const ext = f.split('.').pop()?.toLowerCase()
      if (!['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext || '')) continue
      const src = join(imgPath, f)
      const dest = join(outDir, f)
      await copyFile(src, dest)
      map.set(join(imgDir.name, f), `/${targetSubdir}/${slug}/${f}`)
    }
  } catch {
    // ignore
  }
  return map
}

function rewriteImagePaths(md: string, imgMap: Map<string, string>): string {
  let out = md
  for (const [oldPath, newPath] of imgMap) {
    const escaped = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    out = out.replace(new RegExp(escaped, 'g'), newPath)
    out = out.replace(new RegExp(encodeURIComponent(oldPath).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPath)
  }
  return out
}

interface CsvRow {
  Name: string
  [key: string]: string | undefined
}

function parseCsv(content: string): CsvRow[] {
  const lines = content.trim().split('\n')
  if (lines.length < 2) return []
  const headers = lines[0]!.split(',').map((h) => h.trim())
  const rows: CsvRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]!)
    const row: CsvRow = {}
    headers.forEach((h, j) => {
      row[h] = values[j]?.trim() ?? ''
    })
    rows.push(row)
  }
  return rows
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      inQuotes = !inQuotes
    } else if (c === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += c
    }
  }
  result.push(current.trim())
  return result
}

async function findHtmlByTitleOrId(dir: string, title: string, id?: string): Promise<{ path: string; assetDirName: string } | null> {
  const files = await readdir(dir, { withFileTypes: true })
  const titleSlug = slugFromTitle(title)
  for (const e of files) {
    if (!e.isFile() || !e.name.endsWith('.html')) continue
    const f = e.name
    const hasId = id && f.includes(id.replace(/-/g, ''))
    const namePart = f.replace(/\s+[a-f0-9]{32}\.html$/i, '').trim()
    if (hasId || namePart === title || slugFromTitle(namePart) === titleSlug) {
      const assetDirName = namePart
      const assetDir = files.find((x) => x.isDirectory() && x.name === assetDirName)
      return { path: join(dir, f), assetDirName: assetDir ? assetDirName : '' }
    }
  }
  return null
}

async function main() {
  await mkdir(join(CONTENT_ROOT, 'blog'), { recursive: true })
  await mkdir(join(CONTENT_ROOT, 'projects'), { recursive: true })
  await mkdir(join(CONTENT_ROOT, 'pages'), { recursive: true })
  await mkdir(join(PUBLIC_ROOT, 'assets', 'blog'), { recursive: true })
  await mkdir(join(PUBLIC_ROOT, 'assets', 'projects'), { recursive: true })

  // Blog posts
  const postsCsv = await readFile(
    join(JANODETZEL, 'Blog', 'Posts 3ec46bd14d4f4cb3b1447e147d45a597.csv'),
    'utf-8'
  )
  const postsDir = join(JANODETZEL, 'Blog', 'Posts')
  const postsRows = parseCsv(postsCsv).filter((r) => r.Public === 'Yes')

  for (const row of postsRows) {
    const title = row.Name!
    const found = await findHtmlByTitleOrId(postsDir, title)
    if (!found) {
      console.warn('Blog HTML not found:', title)
      continue
    }
    const { path: htmlPath, assetDirName } = found
    const html = await readFile(htmlPath, 'utf-8')
    const bodyHtml = extractBodyFromHtml(html)
    const mdBody = htmlToMarkdown(bodyHtml || `<p>${row.Description || ''}</p>`)
    const slug = row.Slug || slugFromTitle(title)
    const imgMap = await copyImages(dirname(htmlPath), slug, 'assets/blog', assetDirName || undefined)
    const mdContent = rewriteImagePaths(mdBody, imgMap)
    const frontmatter = buildFrontmatter(row as unknown as Record<string, string>, { slug })
    const outPath = join(CONTENT_ROOT, 'blog', `${slug}.md`)
    await writeFile(outPath, `${frontmatter}\n\n${mdContent}`, 'utf-8')
    console.log('Blog:', slug)
  }

  // Projects
  const projectsCsv = await readFile(
    join(JANODETZEL, 'Jano Detzel', 'Projects 6ecad6388f0549ed91f178ad201062b6.csv'),
    'utf-8'
  )
  const projectsDir = join(JANODETZEL, 'Jano Detzel', 'Projects')
  const projectsRows = parseCsv(projectsCsv).filter((r) => r.Public === 'Yes')

  for (const row of projectsRows) {
    const title = row.Name!
    const found = await findHtmlByTitleOrId(projectsDir, title)
    if (!found) {
      console.warn('Project HTML not found:', title)
      continue
    }
    const { path: htmlPath, assetDirName } = found
    const html = await readFile(htmlPath, 'utf-8')
    const bodyHtml = extractBodyFromHtml(html)
    const mdBody = htmlToMarkdown(bodyHtml || `<p>${row.Description || ''}</p>`)
    const slug = row.Slug || slugFromTitle(title)
    const imgMap = await copyImages(dirname(htmlPath), slug, 'assets/projects', assetDirName || undefined)
    const mdContent = rewriteImagePaths(mdBody, imgMap)
    const frontmatter = buildFrontmatter(row as unknown as Record<string, string>, { slug })
    const outPath = join(CONTENT_ROOT, 'projects', `${slug}.md`)
    await writeFile(outPath, `${frontmatter}\n\n${mdContent}`, 'utf-8')
    console.log('Project:', slug)
  }

  // Pages: Site Notice, Jano Detzel (home)
  const siteNoticePath = join(JANODETZEL, 'Site Notice 33bd457e4b11404e80298b5b47e99483.html')
  const siteNoticeHtml = await readFile(siteNoticePath, 'utf-8')
  const siteNoticeBody = extractBodyFromHtml(siteNoticeHtml)
  const siteNoticeMd = htmlToMarkdown(siteNoticeBody || '')
  const siteNoticeFm = buildFrontmatter(
    { 'Page Title': 'Site Notice', Description: 'site notice', Slug: '', Public: 'Yes' } as Record<string, string>,
    { slug: 'site-notice', public: true }
  )
  await writeFile(join(CONTENT_ROOT, 'pages', 'site-notice.md'), `${siteNoticeFm}\n\n${siteNoticeMd}`, 'utf-8')
  console.log('Page: site-notice')

  const homePath = join(JANODETZEL, 'Jano Detzel d7e1dc5a47b749df84a580ba2591cd1c.html')
  const homeHtml = await readFile(homePath, 'utf-8')
  const homeBody = extractBodyFromHtml(homeHtml)
  let homeMd = htmlToMarkdown(homeBody || '')
  const homeFm = buildFrontmatter(
    { 'Page Title': 'Jano Detzel', Description: 'full stack developer', Slug: '', Public: 'Yes' } as Record<string, string>,
    { slug: 'home', public: true }
  )
  await writeFile(join(CONTENT_ROOT, 'pages', 'home.md'), `${homeFm}\n\n${homeMd}`, 'utf-8')
  console.log('Page: home')

  // Copy home page assets (Jano Detzel folder) - root-level files and subdirectory images
  try {
    const homeAssetsDir = join(JANODETZEL, 'Jano Detzel')
    const homeAssets = await readdir(homeAssetsDir, { withFileTypes: true })
    const outDir = join(PUBLIC_ROOT, 'assets', 'pages', 'home')
    await mkdir(outDir, { recursive: true })
    const dirName = 'Jano Detzel'

    const copyAndRewrite = async (srcPath: string, f: string, oldPathPrefix: string) => {
      await copyFile(join(srcPath, f), join(outDir, f))
      const oldPath = `${oldPathPrefix}/${f}`
      const oldPathEnc = encodeURIComponent(oldPathPrefix) + '/' + f
      homeMd = homeMd.replace(new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `/assets/pages/home/${f}`)
      homeMd = homeMd.replace(new RegExp(oldPathEnc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `/assets/pages/home/${f}`)
    }

    for (const e of homeAssets) {
      if (e.isFile()) {
        const ext = e.name.split('.').pop()?.toLowerCase()
        if (!['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext || '')) continue
        await copyAndRewrite(homeAssetsDir, e.name, dirName)
      } else if (e.isDirectory()) {
        const subFiles = await readdir(join(homeAssetsDir, e.name))
        for (const f of subFiles) {
          const subExt = f.split('.').pop()?.toLowerCase()
          if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(subExt || '')) {
            await copyAndRewrite(join(homeAssetsDir, e.name), f, `${dirName}/${e.name}`)
          }
        }
      }
    }
    await writeFile(join(CONTENT_ROOT, 'pages', 'home.md'), `${homeFm}\n\n${homeMd}`, 'utf-8')
    console.log('Copied home page assets')
  } catch {
    // ignore
  }

  console.log('\nDone.')
}

main().catch(console.error)
