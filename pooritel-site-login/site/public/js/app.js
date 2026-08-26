import { initI18n, toggleLanguageMenu, setLanguage, closeLanguageMenu, getLanguage, t } from './i18n.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

async function boot() {
  await initI18n();
  setupLanguage();
  setupHero();
  setupMarketFilters();
  setupDiscovery();
  setupDemoButtons();
  setupAuthState();
  updatePrices();
}

function setupLanguage() {
  $('#langSwitch')?.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleLanguageMenu();
  });

  $('#langTargetOption')?.addEventListener('click', (event) => {
    event.stopPropagation();
    const target = $('#langTargetOption')?.dataset.lang;
    if (target) setLanguage(target);
  });

  document.addEventListener('click', (event) => {
    const dropdown = $('#langDropdown');
    if (dropdown && !dropdown.contains(event.target)) {
      closeLanguageMenu();
    }
  });

  window.addEventListener('pooritel:languagechange', () => {
    updatePrices();
    window.dispatchEvent(new Event('pooritel:refresh-products'));
  });
}

function setupHero() {
  const world = $('#heroWorld');
  if (!world) return;

  document.addEventListener('mousemove', (event) => {
    if (window.innerWidth <= 780) {
      world.style.transform = '';
      return;
    }

    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;

    world.style.transform = `translate(${x * 14}px, ${y * 10}px) rotateY(${x * 5}deg) rotateX(${y * -4}deg)`;
  });

  $('#discoverButton')?.addEventListener('click', () => {
    $('#explore')?.scrollIntoView({ behavior: 'smooth' });
  });

  $('#enterMarket')?.addEventListener('click', () => {
    $('#market')?.scrollIntoView({ behavior: 'smooth' });
  });
}

function setupMarketFilters() {
  const filters = $$('.market-filter');
  const cards = $$('.market-grid .product-card');

  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      filters.forEach((item) => item.classList.remove('active'));
      filter.classList.add('active');

      const selected = filter.dataset.filter;

      cards.forEach((card) => {
        if (selected === 'all') {
          card.style.display = '';
          return;
        }

        const tags = (card.dataset.tags || '').split(' ');
        card.style.display = tags.includes(selected) ? '' : 'none';
      });
    });
  });
}

function getNumericPrice(card) {
  return getLanguage() === 'fa'
    ? Number(card.dataset.priceFa || 0)
    : Number(card.dataset.priceEn || 0);
}

function setupDiscovery() {
  const search = $('#productSearch');
  const sort = $('#sortSelect');
  const filters = $$('.discovery-filter');
  const grid = $('#discoveryGrid');
  const empty = $('#discoveryEmpty');
  const count = $('#productCount');
  const cards = $$('.discovery-card');
  let activeCategory = 'all';

  const update = () => {
    const query = search.value.trim().toLowerCase();

    let visible = cards.filter((card) => {
      const title = (card.dataset.title || '').toLowerCase();
      const matchesSearch = !query || title.includes(query);
      const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    visible.sort((a, b) => {
      const pa = getNumericPrice(a);
      const pb = getNumericPrice(b);
      const ra = Number(a.dataset.rating || 0);
      const rb = Number(b.dataset.rating || 0);

      if (sort.value === 'price-low') return pa - pb;
      if (sort.value === 'price-high') return pb - pa;
      if (sort.value === 'rating') return rb - ra;
      return 0;
    });

    cards.forEach((card) => {
      card.style.display = 'none';
    });

    visible.forEach((card) => {
      card.style.display = '';
      grid.insertBefore(card, empty);
    });

    count.textContent = visible.length;
    empty.style.display = visible.length ? 'none' : 'block';
  };

  search?.addEventListener('input', update);
  sort?.addEventListener('change', update);

  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      filters.forEach((item) => item.classList.remove('active'));
      filter.classList.add('active');
      activeCategory = filter.dataset.category;
      update();
    });
  });

  window.addEventListener('pooritel:refresh-products', update);
  update();
}

function updatePrices() {
  const language = getLanguage();
  const isEnglish = language === 'en';

  $$('.price-value').forEach((element) => {
    const value = isEnglish
      ? Number(element.dataset.priceEn)
      : Number(element.dataset.priceFa);

    if (!Number.isFinite(value)) return;

    element.textContent = isEnglish
      ? `$${value.toFixed(2)}`
      : new Intl.NumberFormat('fa-IR').format(value);
  });

  $$('.currency-label').forEach((element) => {
    element.textContent = t('common.currency');
  });
}

function readSession() {
  try {
    const raw = localStorage.getItem('pooritel_session');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setupAuthState() {
  const loginLink = document.querySelector('a.login[href="/auth/"]');
  if (!loginLink) return;

  const sync = () => {
    const session = readSession();
    loginLink.classList.toggle('is-authenticated', Boolean(session?.authenticated));
    if (session?.authenticated) {
      loginLink.dataset.authenticated = 'true';
      loginLink.title = 'Account';
    } else {
      delete loginLink.dataset.authenticated;
      loginLink.title = '';
    }
  };

  window.addEventListener('storage', sync);
  window.addEventListener('pageshow', sync);
  sync();
}

function setupDemoButtons() {
  $$('[data-demo-click]').forEach((button) => {
    button.addEventListener('click', () => {
      button.blur();
      const target = button.dataset.demoClick;
      if (target === 'product') {
        window.location.href = '/pages/product.html';
        return;
      }
      alert(t('common.buyLater'));
    });
  });
}

boot().catch((error) => {
  console.error('PooriTel boot failed:', error);
});
