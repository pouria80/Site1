const MOBILE_QUERY = '(max-width: 1024px)';

function isMobile() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function getDrawer() {
  return document.querySelector<HTMLElement>('.sidebar');
}

function getBackdrop() {
  return document.querySelector<HTMLButtonElement>('.backdrop');
}

function syncBodyLock() {
  const drawer = getDrawer();
  const open = isMobile() && !!drawer?.classList.contains('mobile');
  document.body.classList.toggle('pooritel-menu-open', open);
  document.documentElement.classList.toggle('pooritel-menu-open', open);
}

function closeDrawer() {
  const backdrop = getBackdrop();
  if (backdrop) {
    backdrop.click();
    return;
  }
  document.body.classList.remove('pooritel-menu-open');
  document.documentElement.classList.remove('pooritel-menu-open');
}

function install() {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    if (!target || !isMobile()) return;

    const menuButton = target.closest('.mobileMenu .iconBtn');
    if (menuButton) {
      const drawer = getDrawer();
      if (drawer?.classList.contains('mobile')) {
        // Intercept the React handler when already open and close atomically.
        event.preventDefault();
        event.stopImmediatePropagation();
        closeDrawer();
        return;
      }
    }

    if (target.closest('.sidebar.mobile .collapse')) {
      // There is intentionally no second mobile close control.
      event.preventDefault();
      event.stopImmediatePropagation();
      closeDrawer();
    }
  }, true);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isMobile() && getDrawer()?.classList.contains('mobile')) {
      closeDrawer();
    }
  });

  const observer = new MutationObserver(syncBodyLock);
  const root = document.getElementById('root');
  if (root) observer.observe(root, { subtree: true, attributes: true, attributeFilter: ['class'] });

  window.addEventListener('resize', () => {
    if (!isMobile()) {
      document.body.classList.remove('pooritel-menu-open');
      document.documentElement.classList.remove('pooritel-menu-open');
    }
    syncBodyLock();
  });

  syncBodyLock();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', install, { once: true });
} else {
  install();
}
