import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/vscode-neovim')({
  beforeLoad: () => {
    throw redirect({ to: '/blog/vscode-neovim' })
  },
})
