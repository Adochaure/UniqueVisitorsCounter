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
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=1200
```

`CORS_ORIGIN=*` allows the public SDK to work from any customer's website origin. You can instead set a comma-separated allowlist if the API should only serve specific websites. `RATE_LIMIT_MAX` is the request cap during `RATE_LIMIT_WINDOW_MS`; the starter limiter uses one in-memory bucket per server process and does not use client IPs. The SDK and CLI default to `https://uniquevisitorscounter.onrender.com`; set `apiUrl` in `createCounter` or `UVC_API_URL` for the CLI only when using a different API URL. These are client-side settings, not server environment variables.

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

The local server health check is available at `http://localhost:3000/health`; production health is at `https://uniquevisitorscounter.onrender.com/health`. Set `DATABASE_URL` in `.env` and apply `server/src/database/schema.sql` to PostgreSQL before calling visitor endpoints. In a website project, create its stable site ID with `npx uvc init`, then read its count from that folder with `npx uvc count`.
