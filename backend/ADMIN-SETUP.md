# MySQL admin setup

The admin uses Next.js on port 3001 and Express on the configured backend `PORT`. All `/admin-api` requests are proxied by Next.js. Storefront checkout and public APIs are not connected by this change.

For local development, run `npm run dev` from `adminpanel/`. This starts the existing bundled MySQL installation when available, applies pending migrations, starts Express using `backend/.env`, and starts Next.js. It reuses services already running. `ADMIN_API_ORIGIN` must match backend `PORT` (this workspace uses 7000). No database is initialized or reset. For an external MySQL installation, start that service yourself first. Use `npm run dev:web` to run only Next.js when managing the backend separately.

1. Install backend dependencies with `npm install` (Node.js 22 or newer).
2. Configure local `backend/.env` using `.env.example`. Use a **MySQL** connection URL and a random `ADMIN_SESSION_SECRET` of at least 32 characters. Existing PostgreSQL credentials are not compatible. Do not overwrite or reset an existing database.
3. Create a dedicated empty MySQL database, then run `npm run migrate:deploy` to apply `prisma/mysql/migrations`.
4. Set `ADMIN_EMAIL`, `ADMIN_NAME`, and `ADMIN_PASSWORD` (at least 12 characters) locally; run `npm run admin:create`. Remove the provisioning password afterward. Public signup cannot grant administrator access.
5. Run `npm run dev` in backend and in adminpanel. Sign in at http://localhost:3001/admin/login.

The original PostgreSQL schema/migrations are retained for reference; all backend Prisma scripts now target `prisma/mysql/schema.prisma`. Existing PostgreSQL data needs a separately planned migration; no existing data is deleted or copied automatically.

Catalog modules, commerce records and settings are persisted in a MySQL JSON workspace row with compare-and-swap revision control; media uses a separate MySQL blob table. This intentionally keeps the existing admin record contract. It is not a normalized public commerce database. API validation and server-side stock/order rules apply before the atomic write. There is no automatic demo seed or browser-storage fallback. Orders/customers start empty; storefront order ingestion is outside this task.

For deployments, serve the Next.js application over HTTPS, set NODE_ENV=production (secure session cookies), configure ADMIN_API_ORIGIN server-side and use a protected backend network. The legacy `/api_v1` APIs retain their original behavior and are outside this admin integration.

Validation: `npm run build` in backend; `npm run typecheck` and `npm run lint` in adminpanel; `npx playwright test tests/admin-api.spec.ts` for isolated frontend API-contract checks. The older admin.spec.ts exercises the retired browser-only signup/storage implementation.

## First administrator signup

For a new store with no administrator, open `/admin/signup` to create the first account and sign in automatically. MySQL migrations and ADMIN_SESSION_SECRET must be configured first. Initial signup is available in development; production requires `ADMIN_ALLOW_INITIAL_SIGNUP=true` during controlled setup only. Disable it afterward. A durable setup marker prevents bootstrap signup from reopening if accounts are later removed. Existing administrators use Sign in; additional account provisioning stays owner-managed. This supersedes the CLI-only initial provisioning instructions above.
