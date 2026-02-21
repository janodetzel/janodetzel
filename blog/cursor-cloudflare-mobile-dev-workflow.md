# Code from Your Phone: Cursor AI Agents + Cloudflare Preview Deployments

*How I combined Cursor's background agents with Cloudflare's automatic preview deployments to build features from my phone.*

---

## The Dream: Ship Code Without Touching a Keyboard

What if you could ship a new feature, write a blog post, or spin up a project—without ever opening a laptop? Just create an issue on GitHub from your phone, drop a comment telling an AI agent what to build, and watch it get deployed to a live preview URL moments later?

That's the workflow I've set up. Here's how it works.

## The Stack

- **Cursor** — An AI-powered code editor with *Background Agents* that can autonomously execute tasks in your repository
- **Cloudflare** — Automatic preview deployments on every pull request via Cloudflare Pages or Workers
- **GitHub** — Issues, PRs, and the mobile app as your control center

## The Workflow

### 1. Create an Issue (From Your Phone)

It starts with an idea. You're on the train, walking the dog, or waiting for coffee. Open the GitHub app, create a new issue, and describe what you want:

> *"Build a new project description landing page"*  
> *"Add a blog post about our API integration"*  
> *"Create a learning page for the documentation"*

### 2. Tell the Background Agent to Build

In the comments, you invoke the agent. A simple `@cursor build this` or a more detailed prompt is enough. Cursor's Background Agent picks up the context from the issue and PR, understands the codebase, and starts implementing.

The agent:
- Reads the issue description and any comments
- Explores the repository structure
- Writes code, creates files, and follows best practices
- Commits and pushes changes to the branch

### 3. Cloudflare Deploys a Preview

As soon as the agent pushes to the PR branch, Cloudflare kicks in. If you've connected your GitHub repo to Cloudflare Pages (or use Workers with a similar setup), every pull request gets its own preview deployment.

You get a unique URL like:
```
https://pr-42.your-project.pages.dev
```

That preview is live, shareable, and isolated from production. You can tap the link on your phone and review the changes in the browser.

### 4. Review and Merge to Production

When you're happy with the preview:
- Approve the PR (from your phone or laptop)
- Merge to `main`
- Cloudflare automatically deploys to production

No SSH, no build commands, no CI configuration tweaking—just merge.

## Why This Matters

**Speed** — From idea to live preview in minutes, not hours.  
**Flexibility** — Code from anywhere. Your phone becomes a development terminal.  
**Safety** — Every change gets a preview before production. No surprises.  
**Iteration** — Comment on the PR, ask the agent to refine, get a new preview. Repeat until it's right.

## Setting It Up

### Cursor + Background Agents

1. Use Cursor with a repository connected to GitHub
2. Create a branch and open a PR linked to your issue
3. Use the Background Agent feature; it receives context from the PR and comments
4. The agent works autonomously—committing, pushing, and iterating as needed

### Cloudflare Preview Deployments

1. Connect your GitHub repository to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Configure the build settings (or use a static site with no build)
3. Enable *Preview deployments* for pull requests in the Cloudflare dashboard
4. Each PR gets an automatic preview URL

### The GitHub Side

1. Create issues with clear descriptions
2. Reference `@cursor` in comments when you want the agent to act
3. Link PRs to issues for full context
4. Use the GitHub mobile app to create, comment, and merge

## Real Example: This Blog Post

This very blog post was built using this workflow. An issue was created asking for a post about Cursor and Cloudflare integration. A comment invoked the background agent. The agent wrote this content, and when the PR was merged, it deployed to production.

All without touching a keyboard.

## What's Next?

The workflow keeps improving. Richer agent instructions, better context passing, and finer control over deployments are all on the table. For now, I'm enjoying the ability to ship code from my phone—one issue and one comment at a time.

---

*If you're building something similar or have questions about this setup, I'd love to hear from you. You can find me at [janodetzel.com](https://janodetzel.com) or on [LinkedIn](https://linkedin.com/in/janodetzel).*
