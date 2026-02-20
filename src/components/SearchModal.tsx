'use client'

import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronDown, FileText, Folder, Search } from 'lucide-react'
import type { BlogPost } from '~/lib/content/types'
import type { Project } from '~/lib/content/types'
import {
  type SearchFilter,
  type SearchableItem,
  filterSearchResults,
  getExcerpt,
} from '~/lib/search'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '~/components/ui/item'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { ScrollArea } from '~/components/ui/scroll-area'

const FILTER_OPTIONS: { value: SearchFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'blog', label: 'Blog' },
  { value: 'projects', label: 'Projects' },
]

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  posts: BlogPost[]
  projects: Project[]
}

export function SearchModal({ isOpen, onClose, posts, projects }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<SearchFilter>('all')

  const { posts: filteredPosts, projects: filteredProjects } = filterSearchResults(
    posts,
    projects,
    query,
    filter
  )
  const hasQuery = Boolean(query.trim())
  const hasResults = filteredPosts.length > 0 || filteredProjects.length > 0

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setFilter('all')
    }
  }, [isOpen])

  const currentFilterLabel = FILTER_OPTIONS.find((o) => o.value === filter)?.label ?? 'All'

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>
            Search blog posts and projects.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 rounded-md border border-input bg-transparent px-3">
            <Search className="h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder={`Search ${filter === 'all' ? 'blog posts and projects' : filter === 'blog' ? 'blog posts' : 'projects'} ...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filter:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 px-2 font-normal text-foreground"
                >
                  {currentFilterLabel}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-28">
                {FILTER_OPTIONS.map((opt) => (
                  <DropdownMenuCheckboxItem
                    key={opt.value}
                    checked={filter === opt.value}
                    onCheckedChange={(checked) => checked && setFilter(opt.value)}
                  >
                    {opt.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {hasQuery && (



            <ScrollArea className="h-[min(300px,50vh)]">
              <div>
                {!hasQuery && (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    Start typing to search blog posts and projects...
                  </div>
                )}
                {hasQuery && !hasResults && (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No results for &quot;{query}&quot;. Try different keywords.
                  </div>
                )}
                {hasQuery && hasResults && (
                  <>
                    {filteredPosts.length > 0 && (
                      <>
                        <div className="py-1.5 text-xs font-medium text-muted-foreground">
                          Blog posts
                        </div>
                        {filteredPosts.map((post) =>
                          post.slug ? (
                            <Item
                              key={post.slug}
                              asChild
                              size="sm"
                              className="cursor-pointer"
                            >
                              <Link
                                to="/blog/$slug"
                                params={{ slug: post.slug }}
                                onClick={onClose}
                              >
                                <ItemMedia variant="icon">
                                  <FileText className="size-4" />
                                </ItemMedia>
                                <ItemContent>
                                  <ItemTitle>{post.title}</ItemTitle>
                                  {(post.description || post.content) && (
                                    <ItemDescription>
                                      {getExcerpt(post as SearchableItem)}
                                    </ItemDescription>
                                  )}
                                </ItemContent>
                              </Link>
                            </Item>
                          ) : null
                        )}
                      </>
                    )}
                    {filteredProjects.length > 0 && (
                      <>
                        <div className="mt-2 px-2 py-1.5 text-xs font-medium text-muted-foreground">
                          Projects
                        </div>
                        {filteredProjects.map((project) =>
                          project.slug ? (
                            <Item
                              key={project.slug}
                              asChild
                              size="sm"
                              className="cursor-pointer"
                            >
                              <Link
                                to="/projects/$slug"
                                params={{ slug: project.slug }}
                                onClick={onClose}
                              >
                                <ItemMedia variant="icon">
                                  <Folder className="size-4" />
                                </ItemMedia>
                                <ItemContent>
                                  <ItemTitle>{project.title ?? project.slug}</ItemTitle>
                                  {(project.description || project.content) && (
                                    <ItemDescription>
                                      {getExcerpt(project as SearchableItem)}
                                    </ItemDescription>
                                  )}
                                </ItemContent>
                              </Link>
                            </Item>
                          ) : null
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
