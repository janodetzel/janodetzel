import { site } from '~/config'

export function seo(options: {
  title?: string
  description?: string
  url?: string
  image?: string
}) {
  const title = options.title ?? site.name
  const description = options.description ?? site.description
  const url = options.url ? `https://${site.domain}${options.url}` : `https://${site.domain}`
  const image = options.image

  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: site.name },
    ...(image ? [{ property: 'og:image', content: image }] : []),
    { name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    ...(site.twitter ? [{ name: 'twitter:creator', content: `@${site.twitter}` }] : []),
    ...(image ? [{ name: 'twitter:image', content: image }] : []),
  ]
}
