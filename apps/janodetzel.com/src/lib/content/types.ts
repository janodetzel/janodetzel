export interface ContentFrontmatter {
  title: string
  description?: string
  publishedAt?: string
  updatedAt?: string
  tags?: string[]
  featured?: boolean
  public?: boolean
  tweet?: string
  slug?: string
}

export interface BlogPost extends ContentFrontmatter {
  type: 'blog'
  content: string
}

export interface Project extends ContentFrontmatter {
  type: 'project'
  content: string
  cover?: string
  icon?: string
}

export interface PageContent extends ContentFrontmatter {
  type: 'page'
  content: string
  email?: string
  cover?: string
  avatar?: string
  footerTitle?: string
  footerContent?: string
}
