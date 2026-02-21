---
title: "Rebuilding janodetzel.com with TanStack Start and Cloudflare"
description: "Why I rebuilt my portfolio, what I learned using TanStack Start, and how I ship it on Cloudflare Workers."
publishedAt: "2026-02-21"
updatedAt: "2026-02-21"
tags: ["TanStack Start", "Cloudflare", "Web Development", "Portfolio"]
featured: true
public: true
slug: "rebuilding-janodetzel-dot-com-with-tanstack-start-and-cloudflare"
---

I just shipped a new version of [janodetzel.com](https://janodetzel.com), and this time I rebuilt it from scratch with [TanStack Start](https://tanstack.com/start) and [Cloudflare Workers](https://workers.cloudflare.com/).

This was not a "new coat of paint" project. I wanted a stack that feels modern, fast, and maintainable, without fighting my tooling every time I publish a project or blog update.

## Why I rebuilt it

The old setup worked, but I reached a point where small content changes took too much effort. I wanted:

- A clean developer experience
- Better performance out of the box
- A simpler deploy workflow
- Content that lives in the repo as markdown

My website is my digital home base, so if the foundation is shaky, everything else feels harder than it should.

## Why TanStack Start

I chose TanStack Start because it gave me exactly what I wanted for this type of site:

- File-based routing with TanStack Router
- A React-first workflow I already enjoy
- Vite-powered development and builds
- A flexible foundation that can scale past "portfolio site"

I also liked that the architecture stays close to the platform. It feels lightweight while still giving me structure.

## How content works now

One of the best changes is the content model. Posts, pages, and projects are markdown files in `content/`.

That means:

- Writing is simple and versioned in Git
- I can edit quickly without an external CMS
- Frontmatter keeps metadata consistent
- It is easy to generate feeds, sitemap, and route content

I previously migrated content from a Notion export, then moved to an "edit markdown directly" workflow. This is much faster for me.

## Why Cloudflare Workers

Cloudflare was the deployment target I wanted from day one for this rebuild.

- Global edge runtime
- Fast cold starts
- Straightforward deployment with Wrangler
- Great fit for Vite-based projects

My deploy command is intentionally boring: build, then deploy. Reliable > clever.

## What changed technically

The current setup is focused on speed and simplicity:

- TanStack Start + TanStack Router
- React 19
- Tailwind CSS v4
- Markdown content loading with frontmatter
- Worker deployment via `wrangler deploy`

I also keep routes like `/feed.xml`, `/sitemap.xml`, and `/robots.txt` in the project, so essentials are part of the codebase and not an afterthought.

## What I learned

Rebuilds are always a trade-off: you lose time upfront to gain clarity later.

For this project, the payoff was immediate:

- I can ship content faster
- The project structure is easier to reason about
- The deployment flow is simpler than before
- The site feels snappier and easier to evolve

Most importantly, I now enjoy working on my own website again.

## What's next

Next I want to iterate on small things continuously instead of waiting for big redesigns:

- Improve writing cadence on the blog
- Add more behind-the-scenes project notes
- Keep polishing the UI details over time

If you are thinking about rebuilding your own personal site: keep the stack small, choose tools that make publishing easy, and optimize for long-term maintainability.

_— Jano_
