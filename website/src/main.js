import './style.css';
import * as React from 'react';
import { createCounter } from 'unique-visitor-counter';
import { createRoot } from 'react-dom/client';
import { CopyButton } from './components/CopyButton.jsx';

const siteId = 'site_f321ea1a-9b0a-4f4b-8e02-b017a9f2648d';
const loadingText="...";
const installCommand = 'npm install unique-visitor-counter';

function renderHome() {
  document.title = 'Unique Visitor Counter — count your unique visitors';
  document.querySelector('#app').innerHTML = `
    <main class="page">
      <div class="content">
        <header class="topline fade-in fade-late">
          <a class="release" href="https://www.npmjs.com/package/unique-visitor-counter">v0.3.0 is out!</a>
          <div class="visitor-stat" aria-label="Unique visitors"><span class="visitor-icon" aria-hidden="true"><i></i><i></i><i></i></span><span id="visitor-count" aria-live="polite">${loadingText}</span><span class="visitor-label">unique visitors</span></div>
        </header>
        <section class="intro" aria-label="Unique Visitor Counter">
          <p class="headline-line"><span class="word word-one">Count</span><span class="word word-two">your</span><span class="word word-three">unique</span></p>
          <p class="headline-line"><span class="word word-four accent">visitors.</span></p>
        </section>
        <div class="install-command fade-in fade-command"><span>npm install&nbsp;<strong>unique-visitor-counter</strong></span><span id="install-copy-button"></span></div>
        <nav class="bottom-links fade-in fade-late" aria-label="Project links">
          <a href="/docs">[docs]</a>
          <span class="right-links"><a href="https://github.com/Adochaure/UniqueVisitorsCounter" target="_blank" rel="noreferrer">[github]</a><a href="https://www.npmjs.com/package/unique-visitor-counter" target="_blank" rel="noreferrer">[npm]</a></span>
        </nav>
        <p class="microcopy fade-in fade-late">A simple lifetime count. No cookies, IP tracking, or fingerprinting.</p>
      </div>
    </main>`;

  createRoot(document.querySelector('#install-copy-button')).render(
    React.createElement(CopyButton, { content: installCommand, 'aria-label': 'Copy install command' }),
  );

  createCounter({ siteId }).getCount().then((count) => {
    document.querySelector('#visitor-count').textContent = count.toLocaleString();
  }).catch(() => {
    document.querySelector('#visitor-count').textContent = '—';
  });
}

function renderDocs() {
  document.title = 'Documentation — Unique Visitor Counter';
  document.querySelector('#app').innerHTML = `
    <main class="docs-page">
      <div class="docs-shell">
        <header class="docs-header"><a class="docs-brand" href="/">Unique Visitor Counter</a><nav><a href="/">[home]</a><a href="https://github.com/Adochaure/UniqueVisitorsCounter" target="_blank" rel="noreferrer">[github]</a></nav></header>
        <div class="docs-layout">
          <aside class="docs-toc"><span class="toc-label">ON THIS PAGE</span><a class="docs-toc-link" data-section="start" href="#start">Quick start</a><a class="docs-toc-link" data-section="react" href="#react">React</a><a class="docs-toc-link" data-section="javascript" href="#javascript">JavaScript</a><a class="docs-toc-link" data-section="counting" href="#counting">How counting works</a><a class="docs-toc-link" data-section="privacy" href="#privacy">Privacy</a><a class="docs-toc-link" data-section="cli" href="#cli">CLI</a><a class="docs-toc-link" data-section="troubleshooting" href="#troubleshooting">Troubleshooting</a></aside>
          <article class="docs-content">
            <p class="docs-eyebrow">DOCUMENTATION · V0.3.0</p>
            <h1>Count unique visitors.<br/><span>Keep it simple.</span></h1>
            <p class="docs-lede">A small JavaScript package for showing a lifetime unique visitor count on your website. Use the ready-made React component or call the SDK directly from JavaScript.</p>

            <section id="start"><h2>Quick start</h2><p>Install the package in your website project:</p><pre><code>npm install unique-visitor-counter</code></pre><p>Create a site ID from that same project folder:</p><pre><code>npx uvc init</code></pre><p>The command prints your site ID and saves it in <code>.uvc.json</code>. Use that same ID on every page of the same website. Keep it available to your app wherever you use the counter.</p></section>

            <section id="react"><h2>React</h2><p>Import the component from the React entry point and place it where you want the number to appear:</p><pre><code>import { VisitorCount } from 'unique-visitor-counter/react';

export function Footer() {
  return &lt;VisitorCount siteId="your-site-id" /&gt;;
}</code></pre><p>Replace <code>your-site-id</code> with the ID from <code>npx uvc init</code>. The component renders only the number after it loads.</p><h3>Loading and saved counts</h3><p>On a visitor’s first visit, the component shows <code>Loading...</code> while it fetches the count. It saves the last count in local storage. On later visits it shows that saved number immediately while it refreshes in the background. If a refresh fails, it keeps showing the saved number.</p><p>Customize the first-load and error messages with <code>loadingText</code> and <code>errorText</code>:</p><pre><code>&lt;VisitorCount
  siteId="your-site-id"
  loadingText="Getting the count..."
  errorText="Count is unavailable"
/&gt;</code></pre></section>

            <section id="javascript"><h2>JavaScript and other frameworks</h2><p>Use <code>createCounter()</code> in browser JavaScript, Vue, Angular, or Svelte:</p><pre><code>import { createCounter } from 'unique-visitor-counter';

const counter = createCounter({ siteId: 'your-site-id' });
const count = await counter.getCount();

document.querySelector('#visitor-count').textContent =
  String(count);</code></pre><p>Call <code>getCount()</code> when your page or component loads. The returned value is a number. Add your own label, formatting, and loading state as needed.</p></section>

            <section id="counting"><h2>How counting works</h2><ol><li>The SDK creates a random visitor ID in the browser and saves it in local storage.</li><li>It sends that ID and your site ID to the counter service.</li><li>The service records that browser once for that site and returns the site’s total.</li></ol><p>Calling the SDK again from the same browser and site refreshes the total without counting that browser again. A different browser, a different device, or cleared local storage gets a new ID and can count as a new visitor. This is a browser-based estimate of unique visitors, not a count of verified people.</p><p>The total is lifetime and is shared by everyone using the same site ID. Use a different site ID for a different website.</p></section>

            <section id="privacy"><h2>Privacy</h2><p>The SDK does not use cookies, IP addresses, or browser fingerprinting to identify visitors. It creates a random ID and keeps it in local storage so repeat visits from the same browser are recognized.</p><ul><li>The browser stores the random visitor ID and the last displayed count in local storage.</li><li>The service receives the site ID and random visitor ID, and stores a record for the unique site and visitor pair with a first-seen timestamp.</li><li>The package does not ask for a visitor’s name, email, or account.</li></ul><p>Clearing local storage or switching browsers can make the same person appear as a new visitor. Requests still travel through the API host, whose infrastructure may keep ordinary operational logs under its own policies. If you need a different retention policy or hosting setup, review the service configuration before using the counter.</p></section>

            <section id="cli"><h2>Command line</h2><p>From the website project folder, print the current count for its saved site ID:</p><pre><code>npx uvc count</code></pre><p>Or query a specific site ID:</p><pre><code>npx uvc your-site-id count</code></pre><p>The CLI reads the count without registering a browser visitor.</p></section>

            <section id="troubleshooting"><h2>Troubleshooting</h2><h3>The count does not appear</h3><p>Check that your site ID is copied correctly and that the page can reach the counter API. React shows your configured <code>errorText</code> when an initial request fails; the direct JavaScript API rejects the promise, so handle errors in your app.</p><h3>The count increased after I cleared browser data</h3><p>The random browser ID lives in local storage. Clearing site data removes that ID, so the next visit is treated as a new browser.</p><h3>Want to check a site’s count?</h3><p>Run <code>npx uvc count</code> in the project that contains its <code>.uvc.json</code> file.</p></section>

            <footer class="docs-footer"><a href="/">← Back to Unique Visitor Counter</a><a href="https://github.com/Adochaure/UniqueVisitorsCounter" target="_blank" rel="noreferrer">Source on GitHub ↗</a></footer>
          </article>
        </div>
      </div>
    </main>`;

  const tocLinks = [...document.querySelectorAll('.docs-toc-link')];
  const setActiveSection = (sectionId) => {
    tocLinks.forEach((link) => {
      const isActive = link.dataset.section === sectionId;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  setActiveSection('start');
  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleSections = entries.filter((entry) => entry.isIntersecting);
    if (visibleSections.length > 0) {
      visibleSections.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      setActiveSection(visibleSections[0].target.id);
    }
  }, { rootMargin: '-15% 0px -72% 0px', threshold: 0 });

  tocLinks.forEach((link) => {
    const section = document.getElementById(link.dataset.section);
    if (section) sectionObserver.observe(section);
  });
}

if (window.location.pathname.replace(/\/$/, '') === '/docs') renderDocs();
else renderHome();
