# Unique Visitor Counter

A privacy-first visitor counter for websites. Site owners use a small npm SDK to display lifetime unique browser counts and can read the current count from the `uvc` command-line tool.

## Core functionality

The SDK generates an anonymous UUID in the browser, retains it in `localStorage`, and sends it with the site ID to the API on each page load or refresh. PostgreSQL stores visitor records and the API returns the lifetime unique count. A browser is counted once per website while its local storage remains available. Run `npx uvc count` from a website project to read its current total.

The service implements visitor registration and count reading. `GET /health` is also available.

For a production server, configure `DATABASE_URL` and `CORS_ORIGIN` in the hosting provider. See [Environment variables](docs/DEVELOPMENT.md#environment-variables) for the full list and example values.

## Create a site ID

In your website project's terminal, install the SDK and generate a per-website site ID:

```sh
npm install unique-visitor-counter
npx uvc init
```

This creates `.uvc.json` in that website project and prints a stable random ID. Commit that file so the same website uses the same ID across deployments. It contains no secret.

## React usage

```tsx
import { VisitorCount } from 'unique-visitor-counter/react';

export function Footer() {
  return <VisitorCount siteId="site_PASTE_THE_ID_FROM_UVC_INIT" />;
}
```

## Other JavaScript frameworks

```ts
import { createCounter } from 'unique-visitor-counter';

const counter = createCounter({ siteId: 'site_PASTE_THE_ID_FROM_UVC_INIT' });
document.querySelector('[data-visitor-count]')!.textContent = String(await counter.getCount());
```

Call `getCount()` when the page loads. It registers the browser once (using its localStorage UUID), fetches the lifetime total, and updates the element. The count is refreshed on the next page load or refresh.

## CLI

With the SDK package installed and built:

```sh
npx uvc count
```

The command reads the ID from `.uvc.json` and prints the current total. You can also pass an ID explicitly: `npx uvc site_PASTE_THE_ID_FROM_UVC_INIT count`.

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

The deployed API health endpoint is `https://uniquevisitorscounter.onrender.com/health`; locally it is `http://localhost:3000/health`. See [Development](docs/DEVELOPMENT.md) for workspace commands.

## Project structure

- `packages/sdk`: publishable browser SDK source and build configuration.
- `server`: private Express API foundation, environment config, and PostgreSQL schema draft.
- `docs`: architecture, API contract, and developer instructions.
- `examples`: reserved browser integration example.
- `.github/workflows`: CI checks for lint, type safety, and builds.

See [Architecture](docs/ARCHITECTURE.md) for component responsibilities and [API](docs/API.md) for endpoint details.
