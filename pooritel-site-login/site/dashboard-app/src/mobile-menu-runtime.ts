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

function getMenuButton() {
  return document.querySelector<HTMLButtonElement>('.mobileMenu .iconBtn');
}

function setBodyLock(open: boolean) {
  document.body.classList.toggle('pooritel-menu-open', open);
  document.documentElement.classList.toggle('pooritel-menu-open', open);
}

function syncBodyLock() {
  const drawer = getDrawer();
  const open = isMobile() && !!drawer?.classList.contains('mobile');
  setBodyLock(open);
  const button = getMenuButton();
  if (button) button.setAttribute('aria-expanded', String(open));
}

function closeDrawer() {
  const backdrop = getBackdrop();
  if (backdrop) {
    backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  } else {
    setBodyLock(false);
  }
  requestAnimationFrame(syncBodyLock);
}

function install() {
  // Make the header a single, deterministic mobile navigation control.
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 1024px) {
      .topbar { direction:ltr !important; }
      .mobileMenu { order:99 !important; margin-left:auto !important; margin-right:0 !important; }
      .sidebar .collapse, .sidebar.mobile .collapse { display:none !important; visibility:hidden !important; pointer-events:none !important; }
    }
  `;
  document.head.appendChild(style);

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    if (!target || !isMobile()) return;

    const menuButton = target.closest('.mobileMenu .iconBtn');
    if (menuButton) {
      const drawer = getDrawer();
      // React opens the drawer; when it is already open we atomically close it.
      if (drawer?.classList.contains('mobile')) {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeDrawer();
      }
      return;
    }

    // No second close button exists on mobile. Any legacy/old control is inert and hidden.
    if (target.closest('.sidebar .collapse')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
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
    if (!isMobile()) setBodyLock(false);
    syncBodyLock();
  });

  syncBodyLock();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', install, { once: true });
} else {
  install();
}
