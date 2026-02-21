---
title: "Code from Your Phone: Cursor AI Agents + Cloudflare Preview Deployments"
description: "How to ship code from your phone using Cursor Background Agents and Cloudflare's automatic preview deployments for every PR."
publishedAt: "2026-02-21"
updatedAt: "2026-02-21"
tags: ["Cursor", "Cloudflare", "AI Agents", "Workflow", "GitHub"]
featured: true
public: true
slug: "cursor-cloudflare-mobile-dev-workflow"
---

I recently set up a workflow that lets me ship code from my phone: create an issue, tell a background agent to build it, and get a live preview in minutes — no laptop required.

## The workflow

1. **Create an issue** from the GitHub mobile app (or anywhere) with a description of what you want built.
2. **Comment** `@cursor build this` on the PR so the Cursor Background Agent picks it up.
3. **Cloudflare** automatically deploys a preview URL when the PR is pushed.
4. **Review** the preview, and when you're happy, merge — production deploys automatically.

You go from "I want a new blog post" or "I want a feature" to a live preview without touching a keyboard. The agent writes the code, pushes to the branch, and Cloudflare serves it.

## The stack

- **Cursor Background Agents** — Autonomous AI coding that reads your PR context and implements changes.
- **Cloudflare** — Preview deployments per PR (or branch), plus production on merge.
- **GitHub** — Issues, PRs, comments, and mobile control.

Together they give you: describe the task → agent does it → preview goes live → you merge when ready.

## Setup

### 1. Cursor Background Agents

Enable Background Agents in Cursor and connect your repo. When you comment `@cursor build this` on a PR, the agent gets the PR title, description, and comments as context and starts implementing.

No extra config beyond connecting your GitHub account and using the right comments.

### 2. Cloudflare preview deployments

Use Cloudflare Pages (or Workers) with GitHub integration. Configure:

- **Production branch**: usually `main`.
- **Preview branches**: all other branches (or PR branches).

Each PR gets a unique preview URL (e.g. `pr-42.your-project.pages.dev`). Merge to main and production updates.

### 3. GitHub

Create issues from the mobile app, convert them to PRs or create PRs directly. The agent works off the PR branch, so any push triggers a new Cloudflare preview.

## A meta note

This blog post was created using this workflow. I described the idea in a PR, commented `@cursor build this`, and the agent wrote and pushed this article. Cloudflare deployed the preview so it could be reviewed before merging.

If you want to ship more from your phone and less from your desk, this setup is worth trying.

_— Jano_
