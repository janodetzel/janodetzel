---
title: "How I Organize My Thoughts in Obsidian with Neovim"
description: "My personal note-taking workflow with Obsidian and Neovim: daily notes, templates, linking ideas, and a practical Zettelkasten-inspired setup using obsidian.nvim."
publishedAt: "2026-03-14"
updatedAt: "2026-03-14"
tags: ["Obsidian", "Neovim", "Zettelkasten", "Productivity", "Workflow"]
featured: true
public: true
slug: "obsidian-neovim-zettelkasten-workflow"
---

I use Obsidian as my thinking system and Neovim as my writing interface.

For me, this combination solves two problems at once:

- I can capture ideas quickly, with almost no friction.
- I can connect ideas over time, so notes become useful later when I write.

This post is my practical setup: how I organize notes, how I use daily pages, where Zettelkasten principles fit in, and why `obsidian.nvim` became a core part of my workflow.

## Why Obsidian works for me

Obsidian gives me local Markdown files, fast search, and links that turn isolated notes into a graph of ideas. I do not treat it as a fancy notebook. I treat it as a long-term thinking environment.

The core behavior is simple:

1. I capture thoughts fast.
2. I rewrite them in my own words.
3. I link them to related notes.
4. I revisit and connect them while writing.

That sounds obvious, but the key is consistency. The value compounds over time.

## My vault structure

I keep the structure intentionally small:

- `notes/` for topic notes and evergreen ideas
- `daily/` for day-to-day capture and rough drafts
- `templates/` for recurring note formats

This maps directly to my Neovim plugin setup, where I configured:

```lua
opts = {
  workspaces = {
    { name = "work", path = "~/documents/Vaults/Work" },
    { name = "personal", path = "~/documents/Vaults/Personal" },
  },
  notes_subdir = "notes",
  new_notes_location = "notes_subdir",
  daily_notes = {
    folder = "daily",
    date_format = "%Y-%m-%d",
  },
  templates = {
    folder = "templates",
    date_format = "%Y-%m-%d",
    time_format = "%H:%M",
  },
}
```

I like this setup because it keeps capture and organization separate:

- Daily notes are quick and disposable.
- Permanent notes are intentional and linkable.

## My daily workflow

Most ideas start in a daily note.

I use a daily page as an inbox for:

- meeting notes
- quick ideas
- links to read later
- short reflections
- potential blog topics

Then I promote what matters into `notes/`.

When something deserves to become a permanent note, I clean it up:

- one core idea per note
- clearer title
- references or source links
- links to existing related notes

This keeps my system from turning into a random archive.

## Where Zettelkasten helps

I do not follow any strict, purist Zettelkasten implementation. But I use its principles heavily.

The most useful idea for me is this: prioritize **connection over collection**.

From classic Zettelkasten practice (especially inspired by Niklas Luhmann's slip-box method), I borrow four things:

1. **Atomic notes**: one idea per note when possible.
2. **Links with intent**: I link notes because of a specific relationship, not just keyword overlap.
3. **Entry points**: I keep index notes (MOCs) as starting points for larger topics.
4. **Backlinks as discovery**: I use backlinks to find where ideas reappear in different contexts.

If you want to dive deeper, these are useful references:

- [Introduction to the Zettelkasten Method](https://zettelkasten.de/introduction/)
- [Communicating with Slip Boxes (Niklas Luhmann)](https://luhmann.surge.sh/communicating-with-slip-boxes)
- [Wikipedia overview of Zettelkasten](https://en.wikipedia.org/wiki/Zettelkasten)

The practical effect is huge: writing gets easier because I am usually writing from connected notes, not from a blank page.

## Why I write notes in Neovim

Obsidian app is great, especially for visual navigation and mobile capture. But when I am in deep writing mode, I want Neovim.

That is where [`obsidian.nvim`](https://github.com/obsidian-nvim/obsidian.nvim) fits in.

The plugin is not trying to replace Obsidian. Even the maintainers describe it as a complement, which matches my experience exactly.
It is a community-maintained fork, which matters because it keeps pace with today's Neovim ecosystem and integrations.

I get:

- fast keyboard-first note creation
- better editing speed for long-form writing
- quick search and switching between notes
- backlinks and link navigation from inside Neovim
- completion for links and tags while typing

In my config, completion is enabled via `blink.cmp`:

```lua
completion = {
  blink = true,
  nvim_cmp = false,
}
```

That means when I type `[[` I can move through note suggestions quickly without breaking flow.

Useful setup notes from the project docs:

- Neovim `>= 0.10.0` is required.
- `ripgrep` powers search and parts of completion flow.
- On macOS, `pngpaste` enables `:Obsidian paste_img` for quickly inserting screenshots into notes.

## Commands I use all the time

The plugin has one entry command (`:Obsidian`) with subcommands. These are the ones I use most:

- `:Obsidian today` to open/create today’s daily note
- `:Obsidian quick_switch` to jump to another note
- `:Obsidian search` to search with ripgrep + picker
- `:Obsidian backlinks` to see references to the current note
- `:Obsidian new` to create a new note
- `:Obsidian tags` to navigate by tags

For me this covers 90% of the workflow.

When I need visual graph exploration, canvases, or mobile review, I open the Obsidian app. When I need speed and writing ergonomics, I stay in Neovim.

## Obsidian linking features I rely on

Obsidian's internal linking system is the base layer that makes this whole workflow work:

- Wikilinks like `[[My Note]]`
- heading links like `[[My Note#Section]]`
- block links like `[[My Note#^block-id]]`
- custom display text like `[[My Note|Readable label]]`

The official docs are worth reading if you are setting up your own conventions:

- [Internal links (Obsidian Help source)](https://raw.githubusercontent.com/obsidianmd/obsidian-help/master/en/Linking%20notes%20and%20files/Internal%20links.md)
- [Backlinks plugin (Obsidian Help source)](https://raw.githubusercontent.com/obsidianmd/obsidian-help/master/en/Plugins/Backlinks.md)

One underrated feature: Obsidian can automatically update internal links when files are renamed. That makes refactoring note titles much less risky.

## What changed after adopting this setup

Three concrete improvements:

1. I lose fewer ideas because capture is immediate.
2. I think clearer because I rewrite and connect notes.
3. I publish faster because blog drafts start from linked building blocks.

If you already use Obsidian and Neovim separately, combining them is a high-leverage upgrade. Keep the folder structure simple, apply a light Zettelkasten mindset, and let links do the heavy lifting.

_— Jano_
