# Unique Visitor Counter

Add a lifetime unique visitor count to your website with a small JavaScript SDK.

## Install

```sh
npm install unique-visitor-counter
```

## Set up your site

Run this in your website project's folder:

```sh
npx uvc init
```

It creates a site ID and saves it in `.uvc.json`. Copy the printed ID into the example for your framework. Use the same ID throughout your website.

## React

```tsx
import { VisitorCount } from 'unique-visitor-counter/react';

export function Footer() {
  return <VisitorCount siteId="your-site-id" />;
}
```

Replace `your-site-id` with the ID printed by `npx uvc init`. The component displays only the number, stays blank until the first result arrives, and keeps the previous number visible while updating.

## Other JavaScript frameworks

Use `createCounter()` with Vue, Angular, Svelte, or browser JavaScript:

```ts
import { createCounter } from 'unique-visitor-counter';

const counter = createCounter({ siteId: 'your-site-id' });
const count = await counter.getCount();
document.querySelector('#visitor-count')!.textContent = `${count} unique visitors`;
```

Call `getCount()` when the page loads. The count updates on the next page load or refresh.

## Check your count

Run this from your website project's folder:

```sh
npx uvc count
```

## Privacy

The SDK stores a random browser ID in `localStorage`. It does not use IP tracking or browser fingerprinting. Clearing browser storage or switching browsers may count as a new visitor.
