# AGENTS.md

Guidance for AI coding agents working in this repository. Read this first, then consult version-matched docs for the tools below before writing code.

> **Rules of engagement** — never `git commit`, `git push`, `pnpm build`, run migrations, or take any other irreversible/destructive action unless the user explicitly asks. Always confirm before doing any of those, even when the change looks "ready". This applies to the repo as a whole, not just the file you're editing.

## Project

A 3D print shop (storefront + print-on-demand) built as a single Next.js app:

- **Storefront** — sell ready-made printed products (catalog → cart → Stripe checkout).
- **Print-on-demand** — customers upload STL/3MF, get an instant quote, order a custom print; the uploaded file is stored and the admin downloads it to slice locally.
- **Admin** — role-gated `/admin` for products, filaments, printers/profiles, and orders.

## Stack (all newer than typical training data — verify behavior)

| Layer    | Choice                                            | Notes                                              |
| -------- | ------------------------------------------------- | -------------------------------------------------- |
| App      | Next.js 16 (App Router, fullstack) + TypeScript   | Turbopack default, async request APIs              |
| UI       | Tailwind v4 + shadcn/ui (Base UI, "Nova" preset)  | `render` prop, NOT `asChild`                       |
| Data     | PostgreSQL + Prisma 7 (`prisma-client` generator) | Client generated to `generated/prisma`, pg adapter |
| Auth     | Auth.js (NextAuth v5)                             | Google + Resend magic-link, JWT sessions           |
| Payments | Stripe (Checkout + webhook)                       | lazy client via `getStripe()`                      |
| Files    | MinIO (S3-compatible) via `@aws-sdk/client-s3`    | swap to R2/B2 later                                |
| Viewer   | three.js + @react-three/fiber + drei              | STL + 3MF                                          |

## Commands

```bash
pnpm dev            # next dev (localhost:10000, bound to 0.0.0.0)
pnpm build          # production build
pnpm lint           # eslint (there is NO `next lint`)
pnpm typecheck      # tsc --noEmit
pnpm format         # prettier --write . (do this before committing)
pnpm format:check   # prettier --check . (CI / pre-push)
pnpm db:migrate     # prisma migrate dev
pnpm db:seed        # prisma db seed (K1C + profiles + filaments + sample product)
pnpm db:admin <email>  # promote a user to ADMIN (after they sign in)
docker compose up   # postgres + minio (+ stripe-cli with --profile stripe)
```

Setup: copy `.env.example` → `.env`. Most features run without secrets; auth needs `AUTH_GOOGLE_ID/SECRET` (+ `AUTH_RESEND_KEY`), payments need `STRIPE_*`.

## Structure & conventions (the rules this repo follows)

```
app/                    # routes only
  (store)/              #   public storefront (route group, no URL segment)
  admin/                #   role-gated admin
  api/                  #   ONLY auth/[...nextauth] + stripe/webhook
components/             # ui/ = shadcn primitives; otherwise only shared components
hooks/                  # shared, cross-feature hooks (e.g. use-model)
queries/                # ALL reads — Prisma lives here (products, orders, ...)
lib/                    # framework-free infra (db, auth, stripe, storage, pricing, cart, estimate)
workers/                # standalone scripts (promote.ts — promote a user to ADMIN)
prisma/                 # schema + migrations + seed
proxy.ts                # middleware (renamed from middleware.ts in Next 16)
```

- **Components are the entry point.** Read a feature by reading its component, which calls a named query (read) or a server action (write). No repository/service layers beyond that.
- **Prisma is touched only by `queries/` and `lib/db.ts`** (and server-action files for writes). Never import `db` into a component.
- **Reads** live in `queries/*.ts`. **Writes** are server actions (`"use server"`) colocated in an `_actions/` folder inside the route folder that uses them — one file per action, named after the action (e.g. `products/_actions/save-product.ts`).
- **Route folders keep one file per concern and never mix kinds**: `_components/` (components only, one component per file), `_hooks/` (feature hooks), `_utils/` (types/helpers), `_actions/` (server actions), `_stores/` (client state, e.g. Zustand). No multi-component files; components with heavy logic move that logic into a hook.
- **Cart** is cookie-backed (`lib/cart.ts`), mutated via `app/(store)/cart/_actions/*.ts`.

## Code style

Formatting is enforced by **Prettier** (`.prettierrc.json`: 4-space indent, width 100, double quotes, semicolons, trailing commas). Run `pnpm format` before committing; `pnpm format:check` in CI. Don't hand-format — let Prettier own it.

Treat code like prose: group statements that belong together into **blocks**, and separate blocks with **one blank line**. Don't run everything together, and never use two blank lines.

- **Imports are one contiguous block** — no blank lines between them. The only blank line is after the `"use client"` / `"use server"` directive, and after the last import (before the first declaration).
- Blank line between top-level declarations (types, helpers, functions).
- Inside a function, blank lines between the major paragraphs: state/hook setup → the operation (setup → work → result) → the `return`.
- Statements that do one thing stay together with no blank lines (e.g. a group of `useState` calls, or a run of `data.append(...)` lines).
- `try {` / `} finally {` / `} catch {` stay tight to their content; blank lines go _inside_ the block between its paragraphs, not right after `{`.

```ts
"use client";

import { useState } from "react";
import { doThing } from "@/lib/thing";

type Args = { id: string };

export function useSomething() {
    const [pending, setPending] = useState(false);
    const [done, setDone] = useState(false);

    async function run(args: Args) {
        setPending(true);

        try {
            const data = new FormData();

            data.append("id", args.id);

            await doThing(data);

            setDone(true);
        } finally {
            setPending(false);
        }
    }

    return { run, pending, done };
}
```

## Gotchas (do NOT regress these)

- **Next 16 async APIs**: `params`, `searchParams`, `cookies()`, `headers()`, `draftMode()` are all Promises — `await` them. Typed helpers `PageProps<'/route'>` and `LayoutProps<'/route'>` are global (no import). `middleware` is now `proxy.ts` (default export `proxy`, or `auth` wrapper).
- **Prisma 7**: client is generated to `generated/prisma` (gitignored) — run `pnpm prisma generate` after any schema change. Import from `@/generated/prisma/client` (server) / `@/generated/prisma/browser` (types only). Instantiate with the pg adapter (`lib/db.ts`). DB URL lives in `prisma7.config.ts`, not the schema. `Prisma.validator` is gone — use `satisfies`.
- **shadcn Base UI**: components use `render={<Element/>}` instead of Radix's `asChild`. For link-styled buttons, use `buttonVariants({...})` on a `<Link>` (do NOT use `<Button render={<Link/>}>` without `nativeButton={false}` — it assigns `role="button"` to anchors).
- **Stripe client is lazy** (`getStripe()`) — don't import `stripe` at module scope or builds fail with empty keys.
- **Money** is stored as Prisma `Decimal`; convert with `Number(...)` in queries before passing to client components.

## Next.js version note

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
