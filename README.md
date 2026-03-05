# PlaceMe

A **placement and recruitment platform** for connecting students with companies. Built as a Turborepo monorepo with separate apps for students, admins, and a shared API.

---

## What's inside?

PlaceMe helps manage:

- **Companies** — Company profiles, departments, locations, HR contacts  
- **Jobs** — Openings with departments, locations, employment types, and pipelines  
- **Students** — Profiles, applications, and offer tracking  
- **Applications** — Student applications tied to jobs and pipeline stages  
- **Pipelines & stages** — Custom hiring workflows per company  
- **Offers** — Offer lifecycle (draft, sent, signed, declined)  
- **Notifications & audit logs** — User notifications and company audit trails  

---

## Tech stack

| Layer        | Technology                          |
|-------------|--------------------------------------|
| Monorepo    | [Turborepo](https://turborepo.dev)   |
| Package manager | [Bun](https://bun.sh)           |
| Backend API | Express (Bun runtime)                |
| Frontend    | Next.js 16, React 19                 |
| Database    | PostgreSQL + [Prisma](https://prisma.io) (driver adapter `@prisma/adapter-pg`) |
| Validation  | [Zod](https://zod.dev)               |
| Styling     | Tailwind CSS 4                      |
| Language    | TypeScript 5                         |

---

## Project structure

```
PlaceMe/
├── apps/
│   ├── admin/          # Next.js app — admin dashboard (port 3001)
│   ├── http-server/    # Express API — auth & business logic (Bun)
│   └── student/        # Next.js app — student portal (port 3000)
├── packages/
│   ├── db/             # Prisma schema, client, migrations
│   ├── zod/            # Shared Zod schemas (e.g. Signup, Login)
│   ├── ui/             # Shared React components
│   ├── tailwind-config/# Shared Tailwind config
│   ├── eslint-config/  # Shared ESLint config
│   └── typescript-config/ # Shared tsconfig
├── package.json
├── turbo.json
└── README.md
```

---

## Prerequisites

- **Node.js** ≥ 18  
- **Bun** (recommended; project uses `bun` as `packageManager`)  
- **PostgreSQL** (local or remote instance)

---

## Getting started

### 1. Clone and install

```bash
git clone <repo-url>
cd PlaceMe
bun install
```

### 2. Environment variables

Create env files from the examples (note: repo has `.env.exampale` — copy to `.env`).

**Root / API (`apps/http-server/`):**

```bash
# apps/http-server/.env
PORT=5501
DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DATABASE"
```

**Database package (`packages/db/`)** — used for Prisma CLI (migrate, generate):

```bash
# packages/db/.env
DATABASE_URL="postgres://postgres:mysecretpassword@localhost:5432/placeme"
```

Use the same `DATABASE_URL` format for your PostgreSQL instance.

### 3. Database setup

Create the database (e.g. `placeme`) in PostgreSQL, then run migrations:

```bash
# From repo root, with DATABASE_URL set (e.g. in packages/db/.env)
bun --env-file=packages/db/.env bunx prisma migrate dev --schema=packages/db/prisma/schema.prisma
```

Or from the `db` package:

```bash
cd packages/db
bunx prisma migrate dev
```

Generate the Prisma client after schema changes:

```bash
cd packages/db && bunx prisma generate
```

### 4. Run the apps

**All apps (recommended):**

```bash
bun run dev
```

**Single app:**

```bash
# API server (default port in env, e.g. 5501)
bun run dev --filter=http-server

# Student app — http://localhost:3000
bun run dev --filter=student

# Admin app — http://localhost:3001
bun run dev --filter=admin
```

---

## Scripts

| Command | Description |
|--------|-------------|
| `bun run dev` | Run all apps in dev mode (Turbo) |
| `bun run build` | Build all apps and packages |
| `bun run lint` | Lint all workspaces |
| `bun run format` | Format code with Prettier |
| `bun run check-types` | Type-check all workspaces |

---

## API (http-server)

- **Health:** `GET /health`  
- **Auth:**  
  - `POST /api/auth/signup` — body validated with `SignupSchema` (from `@repo/zod`)  
  - `POST /api/auth/login` — body validated with `LoginSchema`  

The server uses `@repo/db` (Prisma + PostgreSQL adapter) and `@repo/zod` for validation.

---

## Packages

| Package | Purpose |
|--------|--------|
| `@repo/db` | Prisma client, schema, and migrations (PostgreSQL via `@prisma/adapter-pg`) |
| `@repo/zod` | Shared Zod schemas (auth, etc.) |
| `@repo/ui` | Shared React UI components |
| `@repo/tailwind-config` | Shared Tailwind configuration |
| `@repo/eslint-config` | Shared ESLint config |
| `@repo/typescript-config` | Shared TypeScript configs |

---

## Database overview

Main entities:

- **Company** — status, tier, departments, jobs, pipelines, offers, locations, HR contacts  
- **User** — email, password, role, linked to **Student** or **IC**  
- **Job** — company, department, location, employment type, open/close dates, applications  
- **Application** — student, job, pipeline/stage, status  
- **Pipeline / Stage** — company hiring workflow  
- **Offer** — application, company, job, status (draft/sent/signed/declined)  
- **Notification**, **AuditLog**  

Enums include: `CompanyStatus`, `TIER`, `HRDesignation`, `Role`, `EmploymentType`, `ApplicationStatus`, `jobStatus`, `OfferStatus`.

---

## Useful links

- [Turborepo docs](https://turborepo.dev/docs) — tasks, caching, filters  
- [Prisma docs](https://www.prisma.io/docs) — schema, migrations, client  
- [Bun](https://bun.sh/docs) — runtime and package manager  

---

## License

Private — see repository settings.
