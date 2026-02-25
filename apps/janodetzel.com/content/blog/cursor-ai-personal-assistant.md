---
title: "How I Built a Personal AI Assistant with Cursor Cloud Agents"
description: "I configured a Cursor Cloud Agent as my personal assistant — with persistent memory, custom skills, and a growing knowledge base. Here's the setup and what it can do."
publishedAt: "2026-02-25"
updatedAt: "2026-02-25"
tags: ["Cursor", "AI Agents", "Productivity", "Workflow", "Automation"]
featured: true
public: true
slug: "cursor-ai-personal-assistant"
---

Most people use AI assistants for one-off tasks. Ask a question, get an answer, context gone.

I wanted something different: an AI that remembers me, learns over time, and has real skills — not just chat.

So I built one using Cursor Cloud Agents.

## The idea

Cursor Cloud Agents run autonomously in the cloud. They have access to a full development environment — terminal, browser, file system, git. They can read and write files, run scripts, search the web, and push code.

The key insight: if the agent has a **persistent repository**, it can store everything it learns. Every conversation adds context. Every task refines its understanding.

Instead of starting fresh every session, the agent picks up where it left off.

## The setup

The foundation is a single GitHub repository that acts as the agent's workspace.

### AGENTS.md — the brain

At the root of the repo sits an `AGENTS.md` file. This is the agent's instruction manual — who I am, how I work, what I care about, and how the agent should behave.

It includes:

- **Behavioral rules** — tone, communication style, decision-making approach
- **Personal context** — my interests, work situation, preferences
- **Git workflow** — push directly to main, no PRs unless asked
- **Continuous learning rule** — after every conversation, the agent updates `AGENTS.md` with new information it learned about me

That last point is critical. The agent doesn't just follow instructions — it actively maintains and expands its own context file. Over time, it gets sharper.

### Skills — reusable capabilities

Instead of explaining the same task every time, I created **skill files** — markdown documents that define exactly how to perform a specific type of task.

Each skill has:

- **Trigger** — when to activate (e.g. "Tech Radar", or sharing a link)
- **Execution steps** — what to research, how to structure output
- **Output format** — where and how to save results
- **Rules** — formatting, sourcing, language preferences

Currently I have skills for:

| Skill | What it does |
|-------|-------------|
| **Tech Radar** | Weekly trend summary across my industries — researches news, compiles a structured PDF |
| **Finance Radar** | Portfolio performance, market overview, macro trends, investment recommendations |
| **Content Vault** | Stores and categorizes links, images, recipes, products with metadata for later retrieval |
| **Journal** | Personal reflection partner — listens, documents, tracks patterns over time |

When I say "Tech Radar", the agent reads the skill file, executes the research, generates the output, saves it, and commits to the repo. No further instructions needed.

### The Vault — persistent storage

The `vault/` directory is where the agent stores everything I share with it — recipes, product research, articles, inspiration. Each item gets:

- A structured markdown file with extracted content
- Metadata (tags, source, date, category)
- Images saved locally
- An entry in `vault/index.json` for fast retrieval

Later I can ask "what was that recipe with the chicken?" and the agent searches the index, finds the entry, and returns the full details.

### Tools

The workspace includes installed npm packages and Python tools the agent can use:

- **pdfkit** for generating formatted PDF reports
- **sharp** for image processing
- **axios + cheerio** for web scraping
- **Excalidraw** for visual diagrams in the browser

The agent uses these tools autonomously when a task requires them.

## What makes this different from ChatGPT

Three things:

**1. Persistent memory.** The agent remembers everything across sessions because it writes to files in a git repo. ChatGPT forgets. This agent compounds.

**2. Real skills, not prompts.** Skills are versioned, structured, and reusable. They define process, not just intent. The agent executes them consistently every time.

**3. It acts, not just talks.** The agent runs scripts, generates PDFs, pushes to git, scrapes websites, processes images. It doesn't just suggest what to do — it does it.

## The cost

Cursor Cloud Agents run on a usage-based model. For my use case — a few conversations per day, some research tasks, occasional PDF generation — the cost is marginal compared to the value of having a persistent, skilled assistant.

The real investment is upfront: defining the skills, structuring the vault, writing good instructions. Once that's done, the system runs itself.

## What's next

The setup grows organically. Every new task type can become a skill. Every piece of information shared gets stored. The agent gets more useful the more I use it.

If you're already using Cursor for coding, extending it into a personal assistant is a natural next step. The infrastructure is there — you just need to give it structure.

_— Jano_
