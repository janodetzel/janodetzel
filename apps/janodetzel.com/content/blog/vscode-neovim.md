---
title: "VSCode → Neovim"
publishedAt: "2022-06-23"
updatedAt: "2022-09-08"
tags: ["IDE", "Software Development"]
featured: false
public: true
tweet: "https://twitter.com/janodetzel1/status/1540129054753431552?s=21&t=ioZpLsUR8_N75qmmqRcXKg"
slug: "vscode-neovim"
---

🔥

Continuously documenting my journey of moving away from VSCode to Neovim as my IDE of choice for frontend development. Follow me along and read about what works, what doesn’t work - and how to make it work.

📌

My current configuration is available on my GitHub:

https://github.com/janodetzel/astrovim\_config

```Shell
# Clone my configuration directly to your config folder
git clone https://github.com/janodetzel/astronvim_config.git ~/.config/nvim/lua/user

# Initialize AstroVim
nvim  --headless -c 'autocmd User PackerComplete quitall' -c 'PackerSync'
```

# Goodbye VSCode. Hello Neovim, uhh AstroVim!

> **Neovim is the most loved editor.** _\-_ [_2021 Stackoverflow Developer Survey_](https://insights.stackoverflow.com/survey/2021#section-most-loved-dreaded-and-wanted-collaboration-tools)

But can it replace VSCode as my primary IDE for frontend development?  
After Notepad++ → Atom → IntelliJ Idea → VSCode let’s try it out!

[![](VSCode%20%E2%86%92%20Neovim/Untitled.png)](VSCode%20%E2%86%92%20Neovim/Untitled.png)

2021 Stackoverflow Developer Survey: Loved vs. Dreaded Collaboration tools

## Installing Neovim

* * *

Why Neovim? Read about the differences between Vim and Neovim on [differencesbetween.net](http://www.differencebetween.net/technology/difference-between-vim-and-neovim/).

```Shell
brew install neovim
```

See: [https://github.com/neovim/neovim/wiki/Installing-Neovim](https://github.com/neovim/neovim/wiki/Installing-Neovim)

### ✅ Installing AstroVim

AstroVim is a distribution of NeoVim and provides a good starting point for my personal configuration. It is feature-rich, yet extensible and easy to use.

```Shell
# Make a backup of your current nvim folder
mv ~/.config/nvim ~/.config/nvim.bak

# Clean old plugins (Optional but recommended)
mv ~/.local/share/nvim/site ~/.local/share/nvim/site.bak

# Clone the repository
git clone https://github.com/AstroNvim/AstroNvim ~/.config/nvim
```

See: [https://astronvim.github.io/](https://astronvim.github.io/)

### ✅ Setup AstroVim

Neovim provides an [LSP](https://neovim.io/doc/user/lsp.html#LSP) (Language Server Protocol) client, but the servers are provided by third parties. We can install required LSP clients with the following command:

`:LspInstall [server_name]`

Here is a list of my currently installed language servers

```Shell
cssls
emmet_ls
html
jsonls
marksman (markdown)
sumneko_lua (lua)
tailwindcss
tsserver (typescript, javascript)
vuels
```

Further details on setting up Lsp can be found on nvim-lspconfig Github.

[GitHub - neovim/nvim-lspconfig: Quickstart configs for Nvim LSP](https://github.com/neovim/nvim-lspconfig)

Next install the language parser for nvim tree-sitter parser.

`:TSInstall [parster_name]`

```Shell
css
html
javascript
json
lua
markdown
typescript
vue
```

Run `:PackerClean` to remove any disabled or unused plugins

Run `:PackerSync` to update and clean plugins

**Let’s fire up nvim and look what we’ve got 🚀**

[![](VSCode%20%E2%86%92%20Neovim/Untitled%201.png)](VSCode%20%E2%86%92%20Neovim/Untitled%201.png)

A basic guide on AstroVim can be found on: [https://astronvim.github.io/Basic Usage/walkthrough.](https://astronvim.github.io/Basic%20Usage/walkthrough)

## Configuring for frontend development

After learning the basic concepts and keybindings of AstroVim, I am ready to start configuring it as the IDE of my _dreams_. I am working on frontend code most of the time so I need solid JavaScript, TypeScript and Vue support. Furthermore I need `.jsx` and `.tsx` for writing React code. React Native might become a challenge as well.

**Let’s start by laying out my must-have features:**

*   JS and TSyntax highlighting
    

*   JSX and TSX Syntax highlighting
    

*   Go to definition / Go to implementation / Go to types
    

*   ESLint Language Features
    

*   Prettier code formatter
    

**Some VSCode perks would be nice to have**

*   Git-Lens → Git-Fuzzy
    

*   Organize Imports
    

*   GitHub Copilot
    

Here are some changes I made to configure AstroVim for frontend development:

### ✅  Formatting, Diagnostics, Code-Actions

Configure null-ls language server for formatting, diagnostics and code\_actions.

The list of null-ls built-in sources can be found on the null-ls.nvim Github.

[GitHub - jose-elias-alvarez/null-ls.nvim: Use Neovim as a language server to inject LSP diagnostics, code actions, and more via Lua.](https://github.com/jose-elias-alvarez/null-ls.nvim)

```Lua
local config = {
		plugins = {
				["null-ls"] = function(config)
			      local null_ls = require "null-ls"
			      config.sources = {
			        -- Set prettierd as default formatter
			        null_ls.builtins.formatting.prettierd,
			        -- Set eslint_d as default linter
			        null_ls.builtins.diagnostics.eslint_d.with({
			            only_local = "node_modules/.bin"
			          }),
							-- Set eslint_d as default code actions
			        null_ls.builtins.code_actions.eslint_d.with({
			            only_local = "node_modules/.bin"
			          })
			      }
			      config.on_attach = function(client)
							-- Enable formatting on save
			        if client.resolved_capabilities.document_formatting then
			          vim.api.nvim_create_autocmd("BufWritePre", {
			            desc = "Auto format before save",
			            pattern = "<buffer>",
			            callback = vim.lsp.buf.formatting_sync,
			          })
			        end
			      end
			      return config
			  end,
		}
}
```

### ✅ Organize imports, Rename files, Import all

Configure typescript language server `tsserver` and add keybindings for:

1.  Organize imports

2.  Rename file

3.  Import all missing imports

```Lua
-- Step 1: Add plugin
local config = {
		plugins = {
				init = {
						{ "nvim-lua/plenary.nvim" },
						{ "jose-elias-alvarez/nvim-lsp-ts-utils" },
				}
		}
}
-- Step 2: Configure tsserver with ts-utils
local config = {
		lsp = {
		    on_attach = function(client, bufnr)
		      if client.name == "tsserver" then
		        client.resolved_capabilities.document_formatting = false
		        local ts_utils = require("nvim-lsp-ts-utils")
		
		        -- defaults
		        ts_utils.setup({
		            debug = false,
		            disable_commands = false,
		            enable_import_on_completion = false,
		            -- import all
		            import_all_timeout = 5000,
		            import_all_priorities = {
		                same_file = 1, -- add to existing import statement
		                local_files = 2, -- git files or files with relative path markers
		                buffer_content = 3, -- loaded buffer content
		                buffers = 4, -- loaded buffer names
		            },
		            import_all_scan_buffers = 100,
		            import_all_select_source = false,
		            -- if false will avoid organizing imports
		            always_organize_imports = true,
		
		            -- filter diagnostics
		            filter_out_diagnostics_by_severity = {},
		            filter_out_diagnostics_by_code = {},
		
		            -- inlay hints
		            auto_inlay_hints = true,
		            inlay_hints_highlight = "Comment",
		            inlay_hints_priority = 200, -- priority of the hint extmarks
		            inlay_hints_throttle = 150, -- throttle the inlay hint request
		            inlay_hints_format = { -- format options for individual hint kind
		                Type = {},
		                Parameter = {},
		                Enum = {},
		            },
		
		            -- update imports on file move
		            update_imports_on_move = true,
		            require_confirmation_on_move = false,
		            watch_dir = nil,
		          })
		
		        ts_utils.setup_client(client)
		
		        -- key mappings
		        local opts = { silent = true }
		        vim.api.nvim_buf_set_keymap(bufnr, "n", "<space>lo", ":TSLspOrganize<CR>", opts)
		        vim.api.nvim_buf_set_keymap(bufnr, "n", "<space>lR", ":TSLspRenameFile<CR>", opts)
		        vim.api.nvim_buf_set_keymap(bufnr, "n", "<space>lA", ":TSLspImportAll<CR>", opts)
		
		      end
		    end,
				["server-settings"] = {
						 tsserver = {
						     init_options = require("nvim-lsp-ts-utils").init_options,
				     }
				},
		}
}

-- Step 3: Add keybings to which-key
local config = {
		["which-key"] = {
		    register_mappings = {
		      n = {
		        ["<leader>"] = {
		          l = {
		              o = { "Organize Imports" },
		              R = { "Rename current file" },
		              A = { "Import all missing" },
		          },
		        },
		      },
		    },
		},
}
```

### ✅ Github Copilot

Add Github Copilot to NeoVim

```Lua
-- Step 1: Add plugin
local config = {
		plugins = {
				init = {
						{ "github/copilot.vim" },
				}
		}
}

-- Step 2: Run :PackerSync to install plugin
-- Step 3: Add copilot completion keybindings on tab
local config = {
		plugins = {
				cmp = function(config)
			      local cmp_ok, cmp = pcall(require, "cmp")
			
			      if cmp_ok then
				      config.mapping['<Tab>'] = cmp.mapping(
				        function(fallback)
			            if cmp.visible() then
			              cmp.select_next_item()
			            elseif vim.b._copilot_suggestion ~= nil then
			              vim.fn.feedkeys(vim.api.nvim_replace_termcodes(vim.fn['copilot#Accept'](), true, true, true), '')
			            else
			              fallback()
			            end
			          end, {
			            'i',
			            's',
			          })
			      end
			      return config
			   end,
				}
		}
}

-- Step 4: Add keybinding to open copilot panel
local config = {
		["which-key"] = {
		    register_mappings = {
		      n = {
		        ["<leader>"] = {
		          l = {
									p = { "<cmd>Copilot panel<cr>", "Copilot panel" },
		          },
		        },
		      },
		    },
		},
}

-- Step 5: Add keybinding to accept copilot suggestion manually
local config = {
		plugins = {
				mappings = {
				    i = {
				      ["<C-p>"] = { "copilot#Accept('<CR>')", desc = "Copilot accept", expr=true },
				      s = false
				    },
				},
		}
}
```

### ✅ Auto-rename tags

To automatically rename tags I installed the `tagalong.nvim` plugin.

[GitHub - AndrewRadev/tagalong.vim: Change an HTML(ish) opening tag and take the closing one along as well](https://github.com/AndrewRadev/tagalong.vim)

```Lua
-- Step 1: Add plugin
local config = {
		plugins = {
				init = {
						{ "AndrewRadev/tagalong.vim" },
				}
		}
}

-- Step 2: Run :PackerSync to install plugin
```

### ✅ Git-Gui → Lazygit

Lazygit is a simple terminal UI for git commands, written in Go.

[GitHub - jesseduffield/lazygit: simple terminal UI for git commands](https://github.com/jesseduffield/lazygit)

[![](https://github.com/jesseduffield/lazygit/raw/assets/staging.gif)](https://github.com/jesseduffield/lazygit/raw/assets/staging.gif)

There is already a default configuration available in AstroVim. To enable it I need to install in via Brew.

```Shell
brew install jesseduffield/lazygit/lazygit
brew install lazygit
```

To use Lazygit we can open it by pressing `<”leader”> g g` or `<”leader”> t l`

## Configuring system tools

In the last section we showcased Lazygit. Astrovim provides a great default integration of several terminal applications.

[![](VSCode%20%E2%86%92%20Neovim/Untitled%202.png)](VSCode%20%E2%86%92%20Neovim/Untitled%202.png)

*   Open floating, horizontal or vertical terminal windows with `<”leader”> t ( f | h | v)`

*   Open node floating terminal with `<”leader”> t n`

*   Open python floating terminal with `<”leader”> t p`

*   Open NCDU disk usage analyzer with `<”leader”> t u`

*   Open htop process viewer with `<”leader”> t h`

⚠️

To use any of the system tools, it is required to install them on the system first.  
Check the documentation!

### ✅ Btop process viewer

To enhance the usage of system tools inside Neovim even more, I added btop. Btop is similar to htop and a resource monitor that shows usage and stats for processor, memory, disks, network and processes.

[GitHub - aristocratos/btop: A monitor of resources](https://github.com/aristocratos/btop)

```Shell
local config = {
		["which-key"] = {
		    register_mappings = {
		      n = {
		        ["<leader>"] = {
							t = {
			            b = {
			                function()
			                  local Terminal  = require('toggleterm.terminal').Terminal
			                  local btop = Terminal:new({ cmd = "btop", hidden = true, direction = "float" })
			                  btop:toggle()
			                end,
			                "ToggleTerm btop"}
								   },
							  },
						},
				},
		},
}
```

## Neovim as system editor

To enable opening files from Finder we need to write a small AppleScript which opens iTerm and starts nvim.

1.  Open `automator` app on your Mac

2.  Create new application

3.  Paste this AppleScript

```Bash
on run {input, parameters}
	-- If run without input, open random file at $HOME
	try
		set filename to POSIX path of input
		set directory to do shell script "dirname " & quoted form of filename
	on error
		set filename to "nvim-" & (do shell script "date +%F") & "__" & (random number from 1000 to 9999) & ".txt"
		set directory to home folder
	end try
	
	-- Set your editor here
	set myEditor to "/opt/homebrew/bin/nvim"
	
	-- Open the file and auto exit after done
	set changeDirectory to "cd" & " " & quote & directory & quote
	set openEditor to myEditor & " " & quote & filename & quote & " &&exit"
	tell application "iTerm"
		create window with profile "Neovim"
		tell current session of current window
			write text changeDirectory
			write text openEditor
		end tell
	end tell
	
	return input
end run
```

1.  Save the automation in `~/Applications` folder

2.  Select the saved automation as default for different filetypes in Finder.  
    Don’t forget to click “Change All”
    
    [![](VSCode%20%E2%86%92%20Neovim/Untitled%203.png)](VSCode%20%E2%86%92%20Neovim/Untitled%203.png)