# web-shop

A 3D print shop — storefront + print-on-demand — built as a single fullstack Next.js app.

- **Storefront** — sell ready-made printed products (catalog → cart → Stripe checkout).
- **Print-on-demand** — customers upload STL/3MF, get an instant quote, order a custom print. The uploaded file is stored in object storage and the admin downloads it to slice locally.
- **Admin** — role-gated `/admin` for products, filaments, printers/profiles, and orders.

## Stack

| Layer    | Choice                                                           |
| -------- | ---------------------------------------------------------------- |
| App      | Next.js 16 (App Router, fullstack) + TypeScript                  |
| UI       | Tailwind v4 + shadcn/ui (Base UI)                                |
| Data     | PostgreSQL + Prisma 7 (pg adapter)                               |
| Auth     | Auth.js (NextAuth v5) — Google + Resend magic link, JWT sessions |
| Payments | Stripe (Checkout + webhook)                                      |
| Files    | MinIO (S3-compatible) via `@aws-sdk/client-s3`                   |
| Viewer   | three.js + @react-three/fiber + drei (STL + 3MF)                 |
| i18n     | next-intl (English + Slovenian)                                  |

## Getting started

Prerequisites: Node.js, [pnpm](https://pnpm.io), Docker.

```bash
pnpm install
cp .env.example .env
docker compose up        # postgres + minio
pnpm db:migrate          # apply migrations
pnpm db:seed             # sample printer, profiles, filaments, product + test users
pnpm dev                 # http://localhost:10000
```

The app runs on `http://localhost:10000` (bound to `0.0.0.0`). Most features work without any secrets; see `.env.example` for what each optional key enables.

### Optional services

- **Auth** — needs `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET` (Google) and `AUTH_RESEND_KEY` (magic-link email). For local development, set `AUTH_TEST_PASSWORD` to enable a "Test login" option that signs in as any seeded user.
- **Payments** — needs `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET`. `docker compose --profile stripe up` runs `stripe-cli` to forward webhooks to the local app.

### Test users

Seeded via `pnpm db:seed` (sign in with the "Test login" using `AUTH_TEST_PASSWORD`):

| Email               | Role       |
| ------------------- | ---------- |
| `admin@test.com`    | `ADMIN`    |
| `customer@test.com` | `CUSTOMER` |

## Commands

```bash
pnpm dev              # next dev (localhost:10000)
pnpm build            # production build
pnpm lint             # eslint
pnpm typecheck        # tsc --noEmit
pnpm format           # prettier --write .
pnpm format:check     # prettier --check .
pnpm db:migrate       # prisma migrate dev
pnpm db:seed          # prisma db seed
pnpm db:admin <email> # promote a user to ADMIN (after they sign in)
```

## Project structure

```
app/                    # routes only
  (store)/              #   public storefront (route group, no URL segment)
  admin/                #   role-gated admin
  api/                  #   auth/[...nextauth] + stripe/webhook
components/             # ui/ = shadcn primitives; otherwise shared components
hooks/                  # shared, cross-feature hooks
queries/                # ALL reads — Prisma lives here
lib/                    # framework-free infra (db, auth, stripe, storage, pricing, cart, estimate)
workers/                # standalone scripts (e.g. promote.ts)
prisma/                 # schema + migrations + seed
proxy.ts                # middleware (renamed from middleware.ts in Next 16)
```

- Components are the entry point — read a feature by reading its component, which calls a named query (read) or a server action (write).
- Prisma is touched only by `queries/` and `lib/db.ts` (plus server-action files for writes).
- Reads live in `queries/*.ts`; writes are `"use server"` actions colocated in an `_actions/` folder inside the route that uses them.

## Notes

- **Prisma 7** — client is generated to `generated/prisma` (gitignored); run `pnpm prisma generate` after schema changes. DB URL lives in `prisma7.config.ts`.
- **Next 16** — `params`, `searchParams`, `cookies()`, `headers()`, `draftMode()` are async; `middleware.ts` is now `proxy.ts`.
- **Money** is stored as Prisma `Decimal`; convert with `Number(...)` before passing to client components.
- **Stripe client is lazy** (`getStripe()`) — don't import `stripe` at module scope.
