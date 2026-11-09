# Unique Visitor Counter

A privacy-first visitor counter for websites. Site owners use a small npm SDK to display lifetime unique browser counts and can read the current count from the `uvc` command-line tool.

## Core functionality

The SDK generates an anonymous UUID in the browser, retains it in `localStorage`, and sends it with the site ID to the API on each page load or refresh. PostgreSQL stores visitor records and the API returns the lifetime unique count. A browser is counted once per website while its local storage remains available. Run `uvc my-portfolio count` to read the current count in a terminal.

The service implements visitor registration and count reading. `GET /health` is also available.

For a production server, configure `DATABASE_URL` and `CORS_ORIGIN` in the hosting provider. See [Environment variables](docs/DEVELOPMENT.md#environment-variables) for the full list and example values.

## Website usage

```ts
import { createCounter } from 'unique-visitor-counter';

const counter = createCounter({ siteId: 'my-portfolio' });
document.querySelector('[data-visitor-count]')!.textContent = String(await counter.getCount());
```

Call `getCount()` when the page loads. It registers the browser once (using its localStorage UUID), fetches the lifetime total, and updates the element. The count is refreshed on the next page load or refresh.

## CLI

With the SDK package installed and built:

```sh
uvc my-portfolio count
```

The command prints the current total. Set `UVC_API_URL` to use a hosted API or a non-default local URL.

## Privacy principles

- No IP tracking.
- No browser fingerprinting.
- Anonymous browser IDs stay in browser localStorage.
- Counting is scoped to a website and depends on browser storage availability.

## Technology

TypeScript, Node.js, Express, PostgreSQL, npm workspaces, tsup, ESLint, Prettier, and Vitest.

## Development setup

Use Node.js 20+ and npm 10+.

```sh
npm install
npm run build
npm run dev:server
```

The health endpoint runs at `http://localhost:3000/health`. See [Development](docs/DEVELOPMENT.md) for workspace commands.

## Project structure

- `packages/sdk`: publishable browser SDK source and build configuration.
- `server`: private Express API foundation, environment config, and PostgreSQL schema draft.
- `docs`: architecture, API contract, and developer instructions.
- `examples`: reserved browser integration example.
- `.github/workflows`: CI checks for lint, type safety, and builds.

See [Architecture](docs/ARCHITECTURE.md) for component responsibilities and [API](docs/API.md) for endpoint details.
