# janodetzel.com

Personal portfolio site built with [TanStack Start](https://tanstack.com/start) and deployed on [Cloudflare Workers](https://workers.cloudflare.com/).

## Tech Stack

- **Framework**: TanStack Start (React, Vite, TanStack Router)
- **Hosting**: Cloudflare Workers
- **Content**: Markdown files in `content/` (blog, projects, pages)

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build & Deploy

```bash
npm run build
npm run deploy
```

Deploy requires a Cloudflare account. Configure `wrangler.jsonc` for your project and run `wrangler deploy` (or `npm run deploy`).

## Content

- `content/blog/*.md` – Blog posts
- `content/projects/*.md` – Project pages
- `content/pages/*.md` – Static pages (home, site-notice)

Frontmatter fields: `title`, `description`, `publishedAt`, `updatedAt`, `tags`, `featured`, `public`, `slug`, `tweet`.

## Routes

| Path | Description |
|------|-------------|
| `/` | Home |
| `/blog` | Blog index |
| `/blog/:slug` | Blog post |
| `/projects` | Projects index |
| `/projects/:slug` | Project page |
| `/site-notice` | Site notice |
| `/vscode-neovim` | Redirects to `/blog/vscode-neovim` |
| `/feed.xml` | RSS feed |
| `/sitemap.xml` | Sitemap |
| `/robots.txt` | Robots file |

## Migration from Notion

Content was migrated from a Notion export using `npm run convert-content`. The conversion script reads from `tmp/ExportBlock-*` and writes markdown to `content/`. Run once; edit markdown directly afterward.
