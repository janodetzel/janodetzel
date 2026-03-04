const KV_KEY_PREFIX = 'blog:impressions:'

export async function getAndIncrementImpression(slug: string): Promise<number> {
  if (!import.meta.env.SSR) return 0
  try {
    const { env } = await import(/* @vite-ignore */ 'cloudflare:workers')
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
}

export async function getImpressions(slugs: string[]): Promise<Record<string, number>> {
  const result: Record<string, number> = {}
  if (!import.meta.env.SSR) return Object.fromEntries(slugs.map((s) => [s, 0]))
  try {
    const { env } = await import(/* @vite-ignore */ 'cloudflare:workers')
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
}
