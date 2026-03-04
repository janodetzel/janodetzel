import { createFileRoute } from '@tanstack/react-router'
import { getAndIncrementImpression } from '~/lib/impressions'

export const Route = createFileRoute('/api/blog/$slug/impression')({
  server: {
    handlers: {
      POST: async ({ params }) => {
        const count = await getAndIncrementImpression(params.slug)
        return Response.json({ count })
      },
    },
  },
})
