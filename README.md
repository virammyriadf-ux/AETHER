# AETHER

Next.js application with a shadcn/ui foundation.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.3.3 (App Router, Turbopack) |
| Language | TypeScript 5 |
| UI runtime | React 19.2.8 |
| Styling | Tailwind CSS v4 (CSS-first config, no `tailwind.config`) |
| Components | shadcn/ui base — `components.json`, `cn()`, CSS-variable theme |
| Animation | framer-motion 13.1.1 |
| Icons | lucide-react |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Layout

```
src/
  app/            # App Router routes
    globals.css   # Tailwind v4 entry + shadcn theme tokens (:root / .dark)
  components/ui/  # shadcn components
  lib/utils.ts    # cn() — clsx + tailwind-merge
components.json   # shadcn config: paths, aliases, base color
```

## Adding components

The shadcn base is set up so registry components drop in directly. The
`components.json` aliases resolve to `@/components/ui` and `@/lib/utils`.

```bash
npx shadcn@latest add button dialog
```

Components from [21st.dev](https://21st.dev) install through the same shadcn
registry mechanism:

```bash
npx shadcn@latest add "https://21st.dev/r/<author>/<component>"
```

> **Note:** both `ui.shadcn.com` and `21st.dev` are blocked by the egress policy
> in the Claude Code remote sandbox, so these commands must be run locally. The
> base they install onto (deps, `cn()`, theme tokens, `components.json`) is
> already committed, so pulled components work without further setup.

## Theming

Colors are CSS variables in `src/app/globals.css`, authored in `oklch` and
mapped into Tailwind via `@theme inline`. Dark mode is class-based — add
`class="dark"` to `<html>`. Change a token in `:root` / `.dark` and every
component follows.

## Agent notes

`AGENTS.md` (referenced by `CLAUDE.md`) is generated and refreshed by
`next dev`; commit it with your changes to keep the tree clean.
`.claude/skills/` holds the UI/UX Pro Max design-intelligence skill suite.
