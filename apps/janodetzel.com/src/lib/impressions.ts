import { createServerFn } from '@tanstack/react-start'

const KV_KEY_PREFIX = 'blog:impressions:'

async function readImpressions(slugs: string[]): Promise<Record<string, number>> {
  const empty = Object.fromEntries(slugs.map((s) => [s, 0]))

  try {
    const { env } = await import(/* @vite-ignore */ 'cloudflare:workers')
    const kv = env.BLOG_IMPRESSIONS
    if (!kv) return empty

    const result: Record<string, number> = {}
    const keys = slugs.map((s) => `${KV_KEY_PREFIX}${s}`)
    const values = await kv.get(keys)

    for (const slug of slugs) {
      const key = `${KV_KEY_PREFIX}${slug}`
      const val = values.get(key)
      result[slug] = val ? parseInt(val, 10) : 0
    }

    return result
  } catch {
    return empty
  }
}

export const getImpressions = createServerFn({ method: 'GET' })
  .inputValidator((slugs: unknown) => (Array.isArray(slugs) ? slugs.filter((s) => typeof s === 'string') : []))
  .handler(async ({ data }) => readImpressions(data))

export const getAndIncrementImpression = createServerFn({ method: 'POST' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data }) => {
    try {
      const { env } = await import(/* @vite-ignore */ 'cloudflare:workers')
      const kv = env.BLOG_IMPRESSIONS
      if (!kv) return 0

      const key = `${KV_KEY_PREFIX}${data}`
      const current = await kv.get(key)
      const count = current ? parseInt(current, 10) + 1 : 1
      await kv.put(key, String(count))
      return count
    } catch {
      return 0
    }
  })
