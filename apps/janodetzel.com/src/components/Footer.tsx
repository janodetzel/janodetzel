import { Link } from '@tanstack/react-router'
import { site } from '~/config'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'

export function Footer() {
  return (
    <footer className="mt-12 py-6 text-sm text-muted-foreground">
      <Separator className="mb-6" />
      <div className="mx-auto flex max-w-[720px] flex-wrap items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-2">
          <Button variant="link" asChild className="h-auto p-0 text-muted-foreground hover:text-foreground">
            <Link to="/">
              © {new Date().getFullYear()} {site.author}
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <Button variant="link" asChild className="h-auto p-0 text-muted-foreground hover:text-foreground">
            <Link to="/site-notice">Site notice</Link>
          </Button>
        </div>
        <div className="flex gap-4">
          {site.twitter && (
            <Button variant="link" asChild className="h-auto p-0 text-muted-foreground hover:text-foreground">
              <a
                href={`https://twitter.com/${site.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                Twitter
              </a>
            </Button>
          )}
          {site.github && (
            <Button variant="link" asChild className="h-auto p-0 text-muted-foreground hover:text-foreground">
              <a
                href={`https://github.com/${site.github}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                GitHub
              </a>
            </Button>
          )}
        </div>
      </div>
    </footer>
  )
}
