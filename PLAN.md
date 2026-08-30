# 3D Print Shop — Plan

Two products on one platform:

1. **Storefront** — sell ready-made printed items (catalog → cart → checkout).
2. **Print-on-demand** — customers upload STL/3MF, get a quote, order a custom print.

Both share one foundation: users, orders, payments, catalog, and a print-time/pricing engine.

---

## Stack

| Layer    | Choice                                             |
| -------- | -------------------------------------------------- |
| App      | Next.js 15 (App Router, fullstack) + TypeScript    |
| UI       | Tailwind + shadcn/ui                               |
| Data     | PostgreSQL + Prisma                                |
| Auth     | Auth.js (NextAuth v5) — magic-link + Google, roles |
| Slicer   | OrcaSlicer CLI, wrapped in a TypeScript worker     |
| Payments | Stripe Checkout + webhooks (test mode)             |
| Files    | MinIO (S3-compatible) locally → R2/B2 later        |
| Viewer   | three.js + @react-three/fiber + drei               |

No Turborepo, no C#, no separate admin app. One Next.js app, one Postgres.

---

## App structure

Root-level `app/`. Feature colocation via private folders (prefix `_` opts out of routing).

```
app/
  (store)/
    layout.tsx              # store shell: header, footer, cart drawer
    page.tsx                # home — server component, calls queries
    products/
      page.tsx              # calls queries.products.list(...)
      [slug]/page.tsx       # calls queries.products.bySlug(...)
      _components/
        ProductCard.tsx
        ProductGrid.tsx
        ProductFilters.tsx
      _actions.ts           # server actions for this feature
    cart/
      page.tsx
    checkout/
      page.tsx
      _components/
    upload/
      page.tsx
      _components/
        UploadDropzone.tsx
        MaterialPicker.tsx
    _components/
      StoreHeader.tsx
      CartDrawer.tsx
  admin/
    layout.tsx              # role-gated
    page.tsx
    products/ ... filaments/ ... profiles/ ... orders/ ... print-queue/ ...
  api/                      # only real HTTP endpoints
    auth/[...nextauth]/route.ts
    stripe/webhook/route.ts

components/
  ui/                       # shadcn primitives
  ModelViewer.tsx           # shared 3D viewer (product page + upload)

queries/                    # all data access — Prisma lives ONLY here
  products.ts
  orders.ts
  files.ts
  print-jobs.ts
  filaments.ts
  profiles.ts

lib/                        # framework-free infra
  db.ts        # prisma client singleton
  auth.ts
  stripe.ts
  slicer.ts    # OrcaSlicer client
  storage.ts   # MinIO/S3
  pricing.ts
  queue.ts

prisma/schema.prisma
```

### Rules

- **Components are the main thing you read** to understand a feature; they delegate to named queries/actions.
- **Queries (reads)** live in the central `queries/` folder and are imported wherever needed.
- **Server actions (mutations)** are colocated as `_actions.ts` in the route folder that uses them.
- **Prisma is touched only by `queries/` and `lib/db.ts`.** No repository/service layers beyond that.
- `components/ui` = shadcn primitives; `components/` otherwise holds only genuinely shared components.
- `api/` is reserved for Auth.js and the Stripe webhook — everything else is server actions.

---

## Pages & shadcn components

### Browse → buy

| Page           | Components                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Home           | `Button`, `Card`, `Badge`, `Separator`                                                                                   |
| Catalog        | `Card`, `Badge`, `Sheet` (mobile filters), `Checkbox`/`RadioGroup`, `Select`, `Slider` (price), `Pagination`, `Skeleton` |
| Product detail | `Button`, `Badge`, `RadioGroup`/`ToggleGroup` (variants), `Select`, `Tabs` (description/specs), `Separator`              |
| Cart           | `Table`, `Button`, `Separator`                                                                                           |
| Checkout       | `Card`, `Input`, `Label`, `Separator`                                                                                    |

### Upload → quote

| Page   | Components                                                                                                                |
| ------ | ------------------------------------------------------------------------------------------------------------------------- |
| Upload | custom dropzone (`Input` fallback), `Progress`, `RadioGroup`/`Select`, `Card` (quote summary), `Skeleton` (while slicing) |

### Account

| Page       | Components                         |
| ---------- | ---------------------------------- |
| Sign in/up | `Card`, `Input`, `Label`, `Button` |
| Orders     | `Table`, `Badge`, `Tabs`           |

### Static

About / FAQ / Contact / shipping & terms.

### Shared

`Sheet` (cart drawer + mobile nav), `NavigationMenu`/`DropdownMenu`, `Avatar`, `Dialog`, `Tooltip`, `Sonner` (toasts).

**The 3D viewer is custom** (react-three-fiber), not shadcn — it is the centerpiece of product detail and upload. Design around it: model takes ~60% of the viewport, controls overlaid in a corner.

### Layout shells

- **`(store)/layout.tsx`** — header (logo, nav, search, cart, account avatar) + footer. Cart slides in as a `Sheet`.
- **`upload/`** lives under the store layout but is a focused single-screen wizard.

---

## Design direction

- **Vibe:** clean & minimal — near-white/near-black surfaces, strong typography, the 3D model is the visual hero.
- **Theme:** dark/light following system (`next-themes` + shadcn `.dark` CSS variables).
- **Accent:** cyan/blue (`--primary` ≈ `hsl(200 85% 45%)`).
- **Font:** Geist or Inter.

---

## Key subsystems

### 1. 3D viewer

STL (`STLLoader`, binary + ascii) and 3MF (JSZip + parser). Orbit/zoom/pan, auto dimensions + mesh volume, build-volume validation (K1C: 220×220×250mm).

### 2. Slicer worker (TypeScript)

`{ file, profile }` → generate OrcaSlicer config → run `orca-slicer` headless → parse G-code header (`; estimated printing time`, `; filament used [g]`) → `{ timeSeconds, grams }`. Cached by `fileHash + profileId`. Runs async via a queue.

### 3. Pricing engine

`grams × $/g (filament) + time × machine-hour rate + setup fee + margin`. All DB-driven.

### 4. Profile system

`Filament` (type, density, cost/g, color) × `PrinterProfile` (nozzle, layer height, infill, speed). Admin generates the slicer config. Enables adding printers later.

### 5. Store + payments

Catalog, filters, cart, Stripe Checkout, webhooks → order status.

---

## Data model (Prisma)

`User`(role) · `Product`/`Category`/`Tag`/`ProductVariant` · `Filament` · `Printer` + `PrinterProfile` · `File`(S3 key, hash, volume, dims, format) · `Order` + `OrderItem` · `PrintJob`(file+profile → time, grams, price, status) · `Payment` · Auth.js tables

---

## Build order

1. **Scaffold** — Next.js, Prisma, shadcn/ui, Docker Compose (Postgres + MinIO + Stripe CLI).
2. **Viewer** — STL + 3MF render, dimensions/volume, build-volume check.
3. **Slicer worker** — OrcaSlicer wrapper, G-code parsing, job queue, caching.
4. **Auth** — Auth.js v5, roles.
5. **Catalog** — products, variants, filters, product pages with viewer.
6. **Cart + checkout** — Stripe test mode, webhooks.
7. **Print-on-demand** — upload → quote → order → print job tracking.
8. **Admin** — product/pricing/filament/profile management + order & print-queue dashboard.
9. **Polish** — email notifications, taxes, reviews, search.

---

## Hosting timeline

| Stage          | Setup                                                                   | Cost   |
| -------------- | ----------------------------------------------------------------------- | ------ |
| Now — dev/test | Docker Compose: Next.js + Postgres + MinIO + Stripe CLI                 | $0     |
| Test-in-prod   | Hetzner VPS (~€8/mo), same stack behind Caddy, Stripe test mode         | ~€8/mo |
| Live           | Re-evaluate: Vercel (web) + Neon (Postgres) + R2 (files) + VPS (slicer) | TBD    |

---

## Open items

1. **Product model** — are "your product", "print my file", and "customize a thing" three product _types_ in one catalog, or separate flows?
2. **Instant vs accurate quote** — browser-side rough estimate on upload, real slice at "add to cart"? Or slice on upload only?
3. **Job queue** — Postgres-backed queue (no Redis) vs Redis/BullMQ?
4. **3MF scope** — honor embedded settings or just read geometry and let the profile win?
5. **Pricing defaults** — machine-hour rate, setup fee, margin.
