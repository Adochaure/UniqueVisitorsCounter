# Vanilla JavaScript example

Install the SDK in your project with `npm install unique-visitor-counter`, then add a count element:

```html
<p>Total visitors: <span data-visitor-count>…</span></p>
<script type="module" src="./main.js"></script>
```

In `main.js`, fetch and display the lifetime count when the page loads. It will refresh on the next page load or refresh.

```js
import { createCounter } from 'unique-visitor-counter';

const counter = createCounter({ siteId: 'my-portfolio' });
const count = await counter.getCount();
document.querySelector('[data-visitor-count]').textContent = String(count);
```

The SDK defaults to `https://uniquevisitorscounter.onrender.com`. Pass `apiUrl` to `createCounter` only if you are using a different API deployment.
