import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'

const STORAGE_KEY = 'cookie-consent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const consent = localStorage.getItem(STORAGE_KEY)
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 px-4 py-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/90 sm:px-6"
      role="dialog"
      aria-label="Cookie notice"
    >
      <div className="mx-auto flex max-w-[1100px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          This site uses localStorage for theme preference and may load images from third parties (e.g. Giphy).{' '}
          <Link
            to="/privacy"
            className="text-foreground underline underline-offset-2 hover:no-underline"
          >
            Privacy & cookies
          </Link>
        </p>
        <Button
          variant="default"
          size="sm"
          onClick={accept}
          className="shrink-0 sm:w-auto"
        >
          Accept
        </Button>
      </div>
    </div>
  )
}
