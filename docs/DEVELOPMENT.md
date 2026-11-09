# Development

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- PostgreSQL is required for visitor registration and count endpoints

## Install

From the repository root:

```sh
npm install
```

For local configuration, copy `.env.example` to `.env`. With Neon, `neon deploy` writes `DATABASE_URL` and related branch values to the root `.env.local`; the server loads both files. `.env.local` is ignored by Git. The health route does not require a database URL.

## Neon PostgreSQL

The repository is linked to its Neon production branch. To refresh the local environment values after changing Neon configuration, run:

```sh
neon deploy
```

The server uses the pooled `DATABASE_URL` with `pg`, appropriate for this long-running Node.js Express process. Apply `server/src/database/schema.sql` once to the Neon branch before using visitor endpoints.

## Environment variables

Set these in the hosting provider's server environment for production. For local development, put them in the root `.env`; do not commit `.env` or `.env.local`.

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=<pooled Neon connection string>
CORS_ORIGIN=https://your-website.example
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=1200
```

`CORS_ORIGIN` accepts a comma-separated list when the SDK is used from multiple website origins. `RATE_LIMIT_MAX` is the request cap during `RATE_LIMIT_WINDOW_MS`; the starter limiter uses one in-memory bucket per server process and does not use client IPs. Set `apiUrl` in `createCounter` and `UVC_API_URL` for the CLI to the deployed API's public URL; those are client-side settings, not server environment variables.

## Workspace commands

```sh
npm run build       # Build SDK and server
npm run build:sdk   # Build only the publishable SDK
npm run build:server
npm run typecheck
npm run lint
npm test
npm run dev:server  # Start the API foundation with file watching
```

The server health check is available at `http://localhost:3000/health`. Set `DATABASE_URL` in `.env` and apply `server/src/database/schema.sql` to PostgreSQL before calling visitor endpoints. Read a count with `uvc my-portfolio count`; set `UVC_API_URL` to point the CLI at the server.
