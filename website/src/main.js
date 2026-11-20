import * as React from 'react';
import { createCounter } from 'unique-visitor-counter';
import { createRoot } from 'react-dom/client';
import { CopyButton } from './components/CopyButton.jsx';

const siteId = 'site_f321ea1a-9b0a-4f4b-8e02-b017a9f2648d';
const installCommand = 'npm install unique-visitor-counter';

const installCopySlot = document.querySelector('#install-copy-button');
if (installCopySlot) {
  createRoot(installCopySlot).render(
    React.createElement(CopyButton, { content: installCommand, 'aria-label': 'Copy install command' }),
  );
}

const downloadCount = document.querySelector('#download-count');
if (downloadCount) {
  const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1200;
  const start = performance.now();
  const animateDownloads = (now) => {
    const progress = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    downloadCount.textContent = Math.round(712 * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(animateDownloads);
  };
  requestAnimationFrame(animateDownloads);
}

const visitorCount = document.querySelector('#visitor-count');
if (visitorCount) {
  createCounter({ siteId }).getCount().then((count) => {
    visitorCount.textContent = count.toLocaleString();
  }).catch(() => {
    visitorCount.textContent = '—';
  });
}

document.querySelectorAll('.docs-content pre').forEach((codeBlock) => {
  const code = codeBlock.querySelector('code');
  if (!code) return;

  const copyButtonSlot = document.createElement('span');
  copyButtonSlot.className = 'docs-copy-slot';
  codeBlock.append(copyButtonSlot);
  createRoot(copyButtonSlot).render(
    React.createElement(CopyButton, {
      content: code.textContent,
      'aria-label': 'Copy code snippet',
    }),
  );
});

const tocLinks = [...document.querySelectorAll('.docs-toc-link')];
if (tocLinks.length > 0 && 'IntersectionObserver' in window) {
  const sections = tocLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleSections = entries.filter((entry) => entry.isIntersecting);
    if (visibleSections.length === 0) return;
    visibleSections.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    const activeId = visibleSections[0].target.id;
    tocLinks.forEach((link) => {
      const isActive = link.hash === `#${activeId}`;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-15% 0px -72% 0px', threshold: 0 });
  sections.forEach((section) => sectionObserver.observe(section));
}
