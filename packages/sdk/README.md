# Unique Visitor Counter

<p align="center"><img src="https://ik.imagekit.io/adochaure/uvc_icon.webp?updatedAt=1795192359048" alt="Unique Visitor Counter logo" width="120" /></p>

Add a lifetime unique visitor count to your website with a small JavaScript SDK.

**[Website](https://unique-visitors-counter.vercel.app/) · [GitHub](https://github.com/Adochaure/UniqueVisitorsCounter) · [npm](https://www.npmjs.com/package/unique-visitor-counter)**

## Install

Choose your package manager:

```sh
npm install unique-visitor-counter
```

```sh
yarn add unique-visitor-counter
```

```sh
pnpm add unique-visitor-counter
```

```sh
bun add unique-visitor-counter
```

## Set up your site

From your website project's folder, run `npx uvc init`, `yarn uvc init`, `pnpm exec uvc init`, or `bunx uvc init`:

```sh
npx uvc init
```

The command creates a site ID and saves it in `.uvc.json`. Copy the printed ID into the example for your framework. Keep using the same ID for every page on this website.

## React

```tsx
import { VisitorCount } from 'unique-visitor-counter/react';

export function Footer() {
  return <VisitorCount siteId="your-site-id" />;
}
```

Replace `your-site-id` with the ID printed by `npx uvc init`. On the first visit, the component shows `Loading...` until the count arrives. Later visits show the saved number while it refreshes, without a loading message. It keeps the saved number if a refresh fails. Use `loadingText` or `errorText` to customize the first-load messages.

## Other JavaScript frameworks

Use this API with Vue, Angular, Svelte, or browser JavaScript:

```ts
import { createCounter } from 'unique-visitor-counter';

const counter = createCounter({ siteId: 'your-site-id' });
const count = await counter.getCount();
document.querySelector('#visitor-count')!.textContent = `${count} unique visitors`;
```

Replace `your-site-id` with the ID printed by `npx uvc init`. Call `getCount()` when the page loads. The count updates on the next page load or refresh.

## Check your count

From the website project's folder, run:

```sh
npx uvc count
```

## Privacy

The SDK stores a random browser ID in `localStorage`. It does not use IP tracking or browser fingerprinting. Clearing browser storage or switching browsers may count as a new visitor.
