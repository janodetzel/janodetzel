import { useEffect, useState } from 'react'
import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  ScriptOnce,
} from '@tanstack/react-router'
import { Menu, Search } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '~/components/ui/navigation-menu'
import { seo } from '~/utils/seo'
import { Footer } from '~/components/Footer'
import { NotFound } from '~/components/NotFound'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { ThemeToggle } from '~/components/ThemeToggle'
import { SearchModal } from '~/components/SearchModal'
import { getBlogPosts } from '~/lib/content/blog'
import { getProjects } from '~/lib/content/projects'
import appCss from '~/styles/app.css?url'
import { site } from '~/config'

const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');else if(t==='light')document.documentElement.classList.remove('dark');else if(window.matchMedia('(prefers-color-scheme: dark)').matches)document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');}catch(e){}})();`

export const Route = createRootRoute({
  loader: async () => {
    const [posts, projects] = await Promise.all([getBlogPosts(), getProjects()])
    return { posts, projects }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ...seo({ title: site.name, description: site.description }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'alternate', type: 'application/rss+xml', href: '/feed.xml', title: site.name },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: NotFound,
  component: RootLayout,
})

function RootLayout() {
  const { posts, projects } = Route.useLoaderData()
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    if (params.get('search') === '1') {
      setSearchOpen(true)
      const url = new URL(window.location.href)
      url.searchParams.delete('search')
      window.history.replaceState({}, '', url.pathname + (url.search || ''))
    }
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ScriptOnce>{themeScript}</ScriptOnce>
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between gap-2 px-3 sm:gap-6 sm:px-6">
            <Link
              to="/"
              className="min-w-0 flex-1 truncate font-semibold text-foreground hover:opacity-80 sm:flex-none"
            >
              {site.name}
            </Link>
            <NavigationMenu className="hidden flex-1 justify-end sm:flex">
              <NavigationMenuList className="gap-1">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/" className={navigationMenuTriggerStyle()}>
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/blog" className={navigationMenuTriggerStyle()}>
                      Blog
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/projects" className={navigationMenuTriggerStyle()}>
                      Projects
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <div className="flex items-center gap-2 shrink-0">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
              >
                <Search size={20} strokeWidth={2} aria-hidden />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open navigation menu" className="sm:hidden">
                    <Menu size={20} strokeWidth={2} aria-hidden />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem asChild>
                    <Link to="/">Home</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/blog">Blog</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/projects">Projects</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
        <main>
          <Outlet />
        </main>
        <Footer />
        <SearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          posts={posts}
          projects={projects}
        />
        <Scripts />
      </body>
    </html>
  )
}
