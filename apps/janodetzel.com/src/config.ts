export const site = {
  name: 'Jano Detzel',
  domain: 'janodetzel.com',
  author: 'Jano Detzel',
  description: 'Full stack developer based in Germany',
  github: 'janodetzel',
  linkedin: 'jano-detzel-6749762a1/',
  instagram: 'jm.roverlanding',
  language: 'en',
} as const

export const host =
  typeof window !== 'undefined'
    ? window.location.origin
    : `https://${site.domain}`
