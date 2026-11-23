import * as React from 'react';
import { createCounter } from 'unique-visitor-counter';
import { createRoot } from 'react-dom/client';
import { CopyButton } from './components/CopyButton.jsx';

const growthApiBaseUrl = import.meta.env.DEV
  ? 'http://localhost:3000'
  : 'https://uniquevisitorscounter.onrender.com';
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

const growthForm = document.querySelector('#growth-form');
if (growthForm) {
  const growthSiteInput = document.querySelector('#growth-site-id');
  const growthRange = document.querySelector('#growth-range');
  const growthResults = document.querySelector('#growth-results');
  const growthChart = document.querySelector('#growth-chart');
  const growthTooltip = document.querySelector('#growth-tooltip');
  const growthTotal = document.querySelector('#growth-total');
  const growthStatus = document.querySelector('#growth-status');
  const growthError = document.querySelector('#growth-error');
  const growthSubmit = growthForm.querySelector('button[type="submit"]');
  const svgNamespace = 'http://www.w3.org/2000/svg';
  let activeSiteId = '';

  const svgElement = (tag, attributes = {}, textContent) => {
    const element = document.createElementNS(svgNamespace, tag);
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, String(value)));
    if (textContent !== undefined) element.textContent = textContent;
    return element;
  };

  let growthChartPoints = [];
  const hideGrowthTooltip = () => {
    growthTooltip.hidden = true;
  };
  const showGrowthTooltip = (point) => {
    const visitorLabel = `${point.count.toLocaleString()} new unique visitor${point.count === 1 ? '' : 's'}`;
    const svgPoint = growthChart.createSVGPoint();
    svgPoint.x = point.x;
    svgPoint.y = point.y;
    const clientPoint = svgPoint.matrixTransform(growthChart.getScreenCTM());
    const chartBounds = growthTooltip.parentElement.getBoundingClientRect();
    growthTooltip.textContent = `${point.date}: ${visitorLabel}`;
    growthTooltip.style.left = `${Math.min(chartBounds.width - 12, Math.max(12, clientPoint.x - chartBounds.left))}px`;
    growthTooltip.style.top = `${clientPoint.y - chartBounds.top}px`;
    growthTooltip.hidden = false;
  };

  growthChart.addEventListener('pointermove', (event) => {
    if (!growthChartPoints.some((point) => point.count > 0)) return;
    const matrix = growthChart.getScreenCTM();
    if (!matrix) return;
    const pointer = growthChart.createSVGPoint();
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    const chartPoint = pointer.matrixTransform(matrix.inverse());
    if (chartPoint.x < 42 || chartPoint.x > 706 || chartPoint.y < 18 || chartPoint.y > 202) {
      hideGrowthTooltip();
      return;
    }
    const closestPoint = growthChartPoints.reduce((closest, point) => (
      Math.abs(point.x - chartPoint.x) < Math.abs(closest.x - chartPoint.x) ? point : closest
    ));
    showGrowthTooltip(closestPoint);
  });
  growthChart.addEventListener('pointerleave', hideGrowthTooltip);

  const renderGrowthChart = (days, entries) => {
    const byDate = new Map(entries.map(({ date, count }) => [date, count]));
    const today = new Date();
    const end = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    const points = Array.from({ length: days }, (_, index) => {
      const date = new Date(end - (days - index - 1) * 86_400_000).toISOString().slice(0, 10);
      return { date, count: byDate.get(date) ?? 0 };
    });
    const left = 42;
    const right = 706;
    const top = 18;
    const bottom = 202;
    const max = Math.max(1, ...points.map((point) => point.count));
    const tickMax = Math.ceil(max / 4) * 4 || 4;
    const coordinates = points.map((point, index) => ({
      ...point,
      x: left + (points.length === 1 ? 0 : index / (points.length - 1)) * (right - left),
      y: bottom - (point.count / tickMax) * (bottom - top),
    }));
    growthChartPoints = coordinates;
    growthChart.replaceChildren();
    growthChart.setAttribute('aria-label', `Daily new unique visitors over the last ${days} days`);
    growthTooltip.hidden = true;

    for (let tick = 0; tick <= 4; tick += 1) {
      const value = (tickMax / 4) * tick;
      const y = bottom - (tick / 4) * (bottom - top);
      growthChart.append(
        svgElement('line', { x1: left, x2: right, y1: y, y2: y, class: 'growth-grid-line' }),
        svgElement('text', { x: left - 9, y: y + 3, 'text-anchor': 'end', class: 'growth-axis-label' }, String(value)),
      );
    }

    const linePath = coordinates.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const areaPath = `${linePath} L ${right} ${bottom} L ${left} ${bottom} Z`;
    growthChart.append(svgElement('path', { d: areaPath, class: 'growth-area' }));
    growthChart.append(svgElement('path', { d: linePath, class: 'growth-line' }));

    const labelCount = Math.min(5, points.length);
    for (let index = 0; index < labelCount; index += 1) {
      const pointIndex = Math.round((points.length - 1) * index / Math.max(1, labelCount - 1));
      const point = coordinates[pointIndex];
      const label = new Date(`${point.date}T00:00:00Z`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' });
      growthChart.append(svgElement('text', {
        x: point.x,
        y: 230,
        'text-anchor': index === 0 ? 'start' : index === labelCount - 1 ? 'end' : 'middle',
        class: 'growth-date-label',
      }, label));
    }

    if (points.every((point) => point.count === 0)) {
      growthChart.append(svgElement('text', {
        x: (left + right) / 2,
        y: 112,
        'text-anchor': 'middle',
        class: 'growth-axis-label',
      }, 'No new visitors in this period'));
    } else {
      coordinates.forEach((point) => {
        const visitorLabel = `${point.date}: ${point.count.toLocaleString()} new unique visitor${point.count === 1 ? '' : 's'}`;
        const hitTarget = svgElement('circle', {
          cx: point.x,
          cy: point.y,
          r: 9,
          class: 'growth-hit-target',
          tabindex: 0,
          role: 'img',
          'aria-label': visitorLabel,
          'aria-describedby': 'growth-tooltip',
        });
        hitTarget.addEventListener('focus', () => showGrowthTooltip(point));
        hitTarget.addEventListener('blur', hideGrowthTooltip);
        growthChart.append(hitTarget);
        const marker = svgElement('circle', { cx: point.x, cy: point.y, r: points.length > 45 ? 2.3 : 3.2, class: 'growth-point' });
        growthChart.append(marker);
      });
    }
  };

  const loadGrowth = async () => {
    if (!activeSiteId) return;
    const days = Number(growthRange.value);
    growthError.hidden = true;
    growthStatus.textContent = 'Loading visitor data…';
    growthSubmit.disabled = true;
    try {
      const response = await fetch(`${growthApiBaseUrl}/v1/visitors/${encodeURIComponent(activeSiteId)}/growth?days=${days}`);
      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) {
        throw new Error('The growth API is not available on the server yet. Deploy the latest server version, then try again.');
      }
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error?.message || 'Could not load growth data.');
      growthTotal.textContent = Number(result.total ?? 0).toLocaleString();
      renderGrowthChart(days, Array.isArray(result.daily) ? result.daily : []);
      growthStatus.textContent = `Showing daily new unique visitors for ${activeSiteId}.`;
      growthResults.hidden = false;
    } catch (error) {
      growthError.textContent = error instanceof Error ? error.message : 'Could not load growth data. Please try again.';
      growthError.hidden = false;
      growthStatus.textContent = '';
    } finally {
      growthSubmit.disabled = false;
    }
  };

  growthForm.addEventListener('submit', (event) => {
    event.preventDefault();
    activeSiteId = growthSiteInput.value.trim();
    if (!activeSiteId) return;
    loadGrowth();
  });
  growthRange.addEventListener('change', loadGrowth);
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
