# unique-visitor-counter

Show a lifetime unique visitor count on a website. The SDK stores an anonymous browser UUID in `localStorage`; the API counts each browser once per site. It does not use IP tracking or browser fingerprinting.

## Install

```sh
npm install unique-visitor-counter
```

## Create a site ID

Run this in your website project folder after installing the package:

```sh
npx uvc init
```

The command creates `.uvc.json` with a random ID for this website and prints the ID. Keep `.uvc.json` with your project (it is an identifier, not a secret). Use the same ID in all pages and deployments of this website. Run `npx uvc init` again in the same folder to display the existing ID.

## React

Import the component from the React entry point and paste the generated ID:

```tsx
import { VisitorCount } from 'unique-visitor-counter/react';

export function Footer() {
  return <VisitorCount siteId="site_PASTE_THE_ID_FROM_UVC_INIT" />;
}
```

The component fetches the count when it mounts and shows a loading message until the request completes. It accepts optional `className`, `loadingText`, `errorText`, and `apiUrl` props.

React is an optional peer dependency. React projects already have it; non-React projects do not need to install React.

## Other JavaScript projects

Use the framework-independent API in Vue, Angular, Svelte, or browser JavaScript:

```ts
import { createCounter } from 'unique-visitor-counter';

const counter = createCounter({ siteId: 'site_PASTE_THE_ID_FROM_UVC_INIT' });
const count = await counter.getCount();
document.querySelector('#visitor-count')!.textContent = `${count} unique visitors`;
```

Call `getCount()` on page load. A refresh in the same browser reuses the stored ID and leaves the total unchanged. The SDK uses `https://uniquevisitorscounter.onrender.com` by default; pass `apiUrl` only if using another API deployment.

## CLI

Read this site's current total from its project folder:

```sh
npx uvc count
```

Or provide an ID explicitly from any folder:

```sh
npx uvc site_PASTE_THE_ID_FROM_UVC_INIT count
```

Set `UVC_API_URL` if the API has a different base URL. The CLI prints the count and does not add a visitor.

## Privacy and limitations

- No IP tracking or browser fingerprinting.
- A browser ID stays in that site's `localStorage`.
- Clearing browser storage or using another browser/device can create another counted visitor.
- The browser ID is anonymous, not a verified person identity.
