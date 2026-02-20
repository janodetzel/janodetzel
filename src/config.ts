export const site = {
  name: 'Jano Detzel',
  domain: 'janodetzel.com',
  author: 'Jano Detzel',
  description: 'Full stack developer based in Germany',
  github: 'janodetzel',
  language: 'en',
} as const

export const host =
  typeof window !== 'undefined'
    ? window.location.origin
    : `https://${site.domain}`
