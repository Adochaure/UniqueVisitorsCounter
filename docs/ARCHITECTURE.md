# Architecture

This repository is an npm-workspace monorepo: `packages/sdk` is the publishable browser SDK, while `server` is a private backend workspace.

## SDK

The SDK source is split by responsibility: `index.ts` defines `createCounter`, `client.ts` sends API requests, `storage.ts` retains an anonymous browser UUID in localStorage, `types.ts` holds public types, and `errors.ts` describes SDK errors. tsup produces ESM, CommonJS, and declarations. The package also includes the `uvc` CLI for reading a site's count.

## Backend

The Express app composes middleware, the health route, and visitor routes. Controllers validate requests, services coordinate operations, and repositories perform PostgreSQL access. Environment values are centralized in `config/env.ts`.

## Database

`database/schema.sql` defines the websites and visitors tables. Each visitor is unique within a website. The PostgreSQL pool is configured only when `DATABASE_URL` is provided; apply the schema manually before using visitor routes.

## Request lifecycle

On page load or refresh, the SDK gets the browser's localStorage UUID (creating one if missing), posts it with the site ID, and returns the lifetime count. The database uniqueness constraint makes repeat visits from that browser idempotent. The CLI reads the same aggregate through a separate GET endpoint. `GET /health` returns a static status response.
