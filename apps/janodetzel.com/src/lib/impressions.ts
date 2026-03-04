import { createServerFn } from '@tanstack/react-start'

const KV_KEY_PREFIX = 'blog:impressions:'

/**
 * Server function for impression count. Uses createServerFn so it runs only on
 * the server (with KV access) whether called from SSR or client-side navigation.
 * @see https://tanstack.com/start/latest/docs/framework/react/guide/server-functions
 */
export const getAndIncrementImpression = createServerFn({ method: 'POST' })
  .inputValidator((slug: unknown) => (typeof slug === 'string' ? slug : ''))
  .handler(async ({ data: slug }) => {
    if (!slug) return 0
    try {
      const { env } = await import('cloudflare:workers')
      const kv = env.BLOG_IMPRESSIONS
      if (!kv) return 0

      const key = `${KV_KEY_PREFIX}${slug}`
      const current = await kv.get(key)
      const count = current ? parseInt(current, 10) + 1 : 1
      await kv.put(key, String(count))
      return count
    } catch {
      return 0
    }
  })

/**
 * Server function for batch impression counts. Uses createServerFn so it runs
 * only on the server whether called from SSR or client-side navigation.
 */
export const getImpressions = createServerFn()
  .inputValidator((slugs: unknown) =>
    Array.isArray(slugs) ? slugs.filter((s): s is string => typeof s === 'string') : []
  )
  .handler(async ({ data: slugs }) => {
    if (!slugs.length) return {}
    const result: Record<string, number> = {}
    try {
      const { env } = await import('cloudflare:workers')
      const kv = env.BLOG_IMPRESSIONS
      if (!kv) return Object.fromEntries(slugs.map((s) => [s, 0]))

      const keys = slugs.map((s) => `${KV_KEY_PREFIX}${s}`)
      const values = await kv.get(keys)
      for (const slug of slugs) {
        const key = `${KV_KEY_PREFIX}${slug}`
        const val = values.get(key)
        result[slug] = val ? parseInt(val, 10) : 0
      }
      return result
    } catch {
      return Object.fromEntries(slugs.map((s) => [s, 0]))
    }
  })
