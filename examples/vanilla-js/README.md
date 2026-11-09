# Vanilla JavaScript example

Install the SDK in your project with `npm install unique-visitor-counter`, then add a count element:

Generate a stable ID for this website by running `npx uvc init` in the project folder. Paste the printed ID into the example below and keep `.uvc.json` with your project.

```html
<p>Total visitors: <span data-visitor-count>…</span></p>
<script type="module" src="./main.js"></script>
```

In `main.js`, fetch and display the lifetime count when the page loads. It will refresh on the next page load or refresh.

```js
import { createCounter } from 'unique-visitor-counter';

const counter = createCounter({ siteId: 'site_PASTE_THE_ID_FROM_UVC_INIT' });
const count = await counter.getCount();
document.querySelector('[data-visitor-count]').textContent = String(count);
```

The SDK defaults to `https://uniquevisitorscounter.onrender.com`. Pass `apiUrl` to `createCounter` only if you are using a different API deployment.
