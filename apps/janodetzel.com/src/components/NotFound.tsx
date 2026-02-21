import { Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'

export function NotFound() {
  return (
    <div className="mx-auto max-w-[720px] px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold mb-2">404</h1>
      <p className="text-muted-foreground mb-6">This page doesn&apos;t exist.</p>
      <Button asChild variant="link">
        <Link to="/">Go home</Link>
      </Button>
    </div>
  )
}
