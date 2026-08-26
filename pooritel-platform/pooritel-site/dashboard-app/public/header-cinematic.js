(() => {
  const mount = () => {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;

    topbar.classList.add('topbar-cinematic-shift');

    if (!topbar.querySelector('.cinematic-orbs')) {
      const orbs = document.createElement('div');
      orbs.className = 'cinematic-orbs';
      orbs.innerHTML = `
        <span class="cinematic-orb"></span>
        <span class="cinematic-orb"></span>
        <span class="cinematic-orb"></span>
        <span class="cinematic-orb"></span>
        <span class="cinematic-label">POORITEL HUB · ACTIVE</span>
      `;
      topbar.appendChild(orbs);
    }

    let store = topbar.querySelector('.storeHeaderBtn');
    if (!store) {
      store = document.createElement('a');
      store.className = 'storeHeaderBtn';
      store.href = '/';
    }
    store.textContent = document.documentElement.lang === 'fa' ? 'فروشگاه' : 'STORE';

    const controls = [...topbar.children].filter((node) =>
      !node.classList.contains('cinematic-orbs') &&
      !node.classList.contains('mobileMenu') &&
      !node.classList.contains('storeHeaderBtn') &&
      !node.classList.contains('topTitle') &&
      !node.classList.contains('search') &&
      !node.classList.contains('notifications')
    );

    controls.forEach((node) => {
      if (!node.classList.contains('header-controls')) {
        let wrap = topbar.querySelector('.header-controls');
        if (!wrap) {
          wrap = document.createElement('div');
          wrap.className = 'header-controls';
          topbar.appendChild(wrap);
        }
        wrap.appendChild(node);
      }
    });

    const wrap = topbar.querySelector('.header-controls');
    if (wrap && store.parentElement !== wrap) wrap.appendChild(store);

    const refreshStore = () => {
      const isFa = document.documentElement.lang === 'fa';
      store.textContent = isFa ? 'فروشگاه' : 'STORE';
      store.setAttribute('aria-label', isFa ? 'ورود به فروشگاه' : 'Open Store');
    };
    refreshStore();
    window.addEventListener('pooritel:languagechange', refreshStore);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
