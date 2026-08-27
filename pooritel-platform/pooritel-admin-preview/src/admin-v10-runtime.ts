type RuntimePage = 'overview' | 'other';

function isOverviewPage(): boolean {
  const root = document.querySelector('.admin-v3') as HTMLElement | null;
  if (!root) return false;
  const crumb = root.querySelector('.crumb strong')?.textContent?.trim().toLowerCase() || '';
  if (crumb === 'overview' || crumb === 'نمای کلی') return true;
  const active = root.querySelector('.nav.active span')?.textContent?.trim().toLowerCase() || '';
  return active === 'overview' || active === 'نمای کلی';
}

function cleanRadar() {
  document.querySelectorAll('.v7-exception').forEach((el) => el.remove());
}

function normalizeModal() {
  document.querySelectorAll('.drawer, .drawerpanel, .drawer-panel, .decision-drawer, .drawer-panel, .detail').forEach((el) => {
    const element = el as HTMLElement;
    if (element.classList.contains('drawer') || element.classList.contains('decision-drawer')) {
      element.classList.add('v10-modal');
    }
    if (element.classList.contains('drawerpanel') || element.classList.contains('drawer-panel') || element.classList.contains('detail')) {
      element.classList.add('v10-modal-panel');
    }
  });
}

function enforceOverviewOnly() {
  const overview = isOverviewPage();
  document.documentElement.classList.toggle('v10-overview', overview);
  document.documentElement.classList.toggle('v10-not-overview', !overview);
  if (!overview) cleanRadar();
  normalizeModal();
}

function watchApp() {
  const root = document.querySelector('#root');
  if (!root) return;
  const observer = new MutationObserver(() => window.requestAnimationFrame(enforceOverviewOnly));
  observer.observe(root, {subtree: true, childList: true, attributes: true, attributeFilter: ['class']});
  enforceOverviewOnly();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', watchApp);
} else {
  watchApp();
}
