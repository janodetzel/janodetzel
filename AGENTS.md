# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

This is a personal portfolio/blog website (`janodetzel.com`) built with **TanStack Start**, **React 19**, **Vite 7**, and **Tailwind CSS v4**, deployed to **Cloudflare Workers**. It is a single app located at `apps/janodetzel.com/`. There are no databases or external services — all content comes from local Markdown files in `content/`.

### Running the dev server

```bash
cd apps/janodetzel.com
npm run dev
```

The Vite dev server starts on **port 3000**. The Cloudflare Workers environment is simulated locally via `@cloudflare/vite-plugin`.

### Build

```bash
cd apps/janodetzel.com
npm run build
```

### TypeScript

`npx tsc --noEmit` reports pre-existing errors (Vite-specific patterns like `import.meta.glob` and CSS URL imports that `tsc` doesn't recognize). These do not affect the dev server or production build — Vite handles them at build time. There is no separate lint script configured in `package.json`.

### Content

Blog posts, projects, and static pages are authored as Markdown with YAML frontmatter in `apps/janodetzel.com/content/`. Changes to content files are picked up by Vite HMR automatically.

### Key scripts in `package.json`

See `apps/janodetzel.com/package.json` for all available scripts (`dev`, `build`, `preview`, `deploy`, `cf-typegen`, `convert-content`).
