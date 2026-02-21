import { Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'

export function DefaultCatchBoundary() {
  return (
    <div className="mx-auto max-w-[720px] px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
      <p className="text-muted-foreground mb-6">An error occurred. Please try again.</p>
      <Button asChild variant="link">
        <Link to="/">Go home</Link>
      </Button>
    </div>
  )
}
