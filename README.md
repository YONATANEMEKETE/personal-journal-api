# Personal Journal API

This project runs the Node.js app on your machine and PostgreSQL in Docker.
That gives you a repeatable local database while keeping the app easy to
develop and debug.

## Prerequisites

- Node.js 24 or newer
- `pnpm`
- Docker Desktop or another Docker engine

## First-time setup

1. Install dependencies.

```powershell
pnpm install
```

2. Create your local env file.

```powershell
Copy-Item .env.example .env
```

3. Start PostgreSQL.

```powershell
docker compose up -d
```

4. Check that the app can reach the database.

```powershell
pnpm db:check
```

5. Apply the database migrations.

```powershell
pnpm exec prisma migrate dev
```

6. Seed the database if you want sample data.

```powershell
pnpm db:seed
```

7. Start the API.

```powershell
pnpm dev
```

## Normal startup

When the project is already set up, the usual path is:

```powershell
docker compose up -d
pnpm db:check
pnpm dev
```

If the schema changed, run:

```powershell
pnpm exec prisma migrate dev
```

## Common commands

- `pnpm dev` starts the API in watch mode.
- `pnpm build` compiles TypeScript into `dist/`.
- `pnpm start` runs the compiled app.
- `pnpm typecheck` checks TypeScript without building.
- `pnpm test` runs the test suite.
- `pnpm db:check` verifies that the database is reachable.
- `pnpm db:seed` loads sample data.
- `pnpm exec prisma generate` regenerates the Prisma client.
- `pnpm exec prisma migrate dev` creates and applies a new migration during development.
- `pnpm exec prisma migrate deploy` applies existing migrations without creating new ones.

## Environment

The app reads these values from `.env`:

- `NODE_ENV`
- `PORT`
- `LOG_LEVEL`
- `DATABASE_URL`
- `SESSION_SECRET`

The Postgres container is created with these values from `docker-compose.yml`:

- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`

The important rule is simple:

- `DATABASE_URL` must point to the database container that Docker Compose started.
- In this project, the app runs on your machine, so `localhost` is correct.

If you later containerize the app itself, the database host would change to the
Compose service name instead of `localhost`.

## Reset local data

To stop the database container:

```powershell
docker compose down
```

To stop the container and delete the database volume:

```powershell
docker compose down -v
```

Only use `-v` when you want to wipe local database data.

## Failure modes to know

- If the app starts but cannot connect to the database, check `DATABASE_URL`.
- If Docker says the port is already in use, something else is already using
  `5432`.
- If migration or seed commands fail, make sure the database container is
  running first.
- If `pnpm start` fails, it should point to the compiled server file in `dist/`.

