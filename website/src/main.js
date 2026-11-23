import * as React from 'react';
import { createCounter } from 'unique-visitor-counter';
import { createRoot } from 'react-dom/client';
import { CopyButton } from './components/CopyButton.jsx';

const siteId = 'site_f321ea1a-9b0a-4f4b-8e02-b017a9f2648d';
const packageManagerCommands = {
  npm: { action: 'npm install', command: 'npm install unique-visitor-counter@latest' },
  yarn: { action: 'yarn add', command: 'yarn add unique-visitor-counter@latest' },
  pnpm: { action: 'pnpm add', command: 'pnpm add unique-visitor-counter@latest' },
  bun: { action: 'bun add', command: 'bun add unique-visitor-counter@latest' },
};
const installCopySlot = document.querySelector('#install-copy-button');
if (installCopySlot) {
  const copyButtonRoot = createRoot(installCopySlot);
  const actionLabel = document.querySelector('#install-command-action');
  const commandText = document.querySelector('.install-command-text');
  const managerTabs = [...document.querySelectorAll('.package-manager-tab')];
  const managerIndicator = document.querySelector('.package-manager-indicator');
  const moveManagerIndicator = (tab) => {
    managerIndicator.style.width = `${tab.offsetWidth}px`;
    managerIndicator.style.transform = `translateX(${tab.offsetLeft - 3}px)`;
  };
  const updateInstallCommand = (manager) => {
    const selectedCommand = packageManagerCommands[manager];
    if (!selectedCommand) return;
    actionLabel.textContent = selectedCommand.action;
    commandText.classList.remove('command-change');
    void commandText.offsetWidth;
    commandText.classList.add('command-change');
    managerTabs.forEach((tab) => {
      const isSelected = tab.dataset.packageManager === manager;
      tab.setAttribute('aria-pressed', String(isSelected));
      if (isSelected) moveManagerIndicator(tab);
    });
    copyButtonRoot.render(
      React.createElement(CopyButton, {
        content: selectedCommand.command,
        'aria-label': `Copy ${selectedCommand.command} command`,
      }),
    );
  };
  managerTabs.forEach((tab) => {
    tab.addEventListener('click', () => updateInstallCommand(tab.dataset.packageManager));
  });
  updateInstallCommand('npm');
  window.addEventListener('resize', () => {
    const selectedTab = managerTabs.find((tab) => tab.getAttribute('aria-pressed') === 'true');
    if (selectedTab) moveManagerIndicator(selectedTab);
  });
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
