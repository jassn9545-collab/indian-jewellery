# node-ts-2025 — Express + TypeScript + PostgreSQL (Prisma)

## Setup

Uses your local PostgreSQL on 5432. Connection string is in `.env`.

```bash
npm install              # also runs `prisma generate`
createdb -h 127.0.0.1 -U postgres node_js    # first time only
npm run migrate:deploy   # apply the schema
npm run seeder           # admin@apify.com / Admin@123
npm run dev              # http://localhost:7000
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with reload |
| `npm run build` | `prisma generate` + `tsc` |
| `npm run migrate` | `prisma migrate dev` — create + apply a migration |
| `npm run migrate:deploy` | `prisma migrate deploy` — apply migrations (prod/CI) |
| `npm run db:push` | `prisma db push` — sync schema without a migration file |
| `npm run studio` | `prisma studio` — browse the data |
| `npm run seeder` | Seed the admin row |

## Data layer

The schema lives in [`prisma/schema.prisma`](prisma/schema.prisma). Services call the
generated client directly (`prisma.user.findFirst(...)`) — there is no generic DAO
wrapper any more, so queries are type-checked against the schema at build time.

`src/models/user.ts` holds `USER_PUBLIC_SELECT`, the field list that is safe to return
from an endpoint (everything except `password` and `refreshToken`).

After editing `prisma/schema.prisma`, run `npm run migrate` — that regenerates the
client and writes the SQL migration.
