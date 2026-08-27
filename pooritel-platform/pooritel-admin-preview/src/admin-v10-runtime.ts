type AdminLang = 'en' | 'fa';

let lastRadarKey = '';

function isOverviewPage(): boolean {
  const root = document.querySelector('.admin-v3');
  if (!root) return false;
  const crumb = root.querySelector('.crumb strong')?.textContent?.trim().toLowerCase() || '';
  const active = root.querySelector('.nav.active span')?.textContent?.trim().toLowerCase() || '';
  return crumb === 'overview' || crumb === 'نمای کلی' || active === 'overview' || active === 'نمای کلی';
}

function currentLang(): AdminLang {
  const active = document.querySelector('.language button.active')?.textContent?.trim();
  return active === 'فا' ? 'fa' : 'en';
}

function radarText(lang: AdminLang) {
  if (lang === 'fa') {
    return {
      eyebrow: 'هشدارهای عملیاتی',
      title: 'چه چیزی بعدی نیاز به توجه دارد؟',
      desc: 'موارد استثنایی قبل از تبدیل شدن به مشکل مشتری نمایش داده می‌شوند.',
      live: 'زنده',
      cards: [
        ['پرداخت ناموفق / با تأخیر','۳','تلاش‌های پرداخت نیاز به بررسی دارند','بیشترین اثر','باز کردن صف ←'],
        ['سفارش‌های در معرض SLA','۵','تحویل یا تأیید دیر شده است','اثر روی مشتری','بررسی ←'],
        ['آگهی‌های دارای سیگنال ریسک','۲','قیمت، مالکیت یا دسته‌بندی نیاز به بررسی دارد','مدیریت آگهی','بررسی ←'],
        ['سلامت سیستم / پرداخت','۹۹.۸٪','سرویس‌های اصلی به‌صورت عادی کار می‌کنند','آخرین بررسی: ۱ دقیقه','مشاهده سلامت ←']
      ]
    };
  }
  return {
    eyebrow: 'EXCEPTION RADAR',
    title: 'What needs attention next',
    desc: 'Operational exceptions surfaced before they become customer problems.',
    live: 'LIVE',
    cards: [
      ['Failed / delayed payments','3','Payment attempts need review','Highest impact','Open queue →'],
      ['Orders at SLA risk','5','Delivery or confirmation is late','Customer impact','Inspect →'],
      ['Listings with risk signals','2','Price, ownership or category mismatch','Moderation','Review →'],
      ['System / payments health','99.8%','Core services operating normally','Last check 1m','View health →']
    ]
  };
}

function cleanRadar() {
  document.querySelectorAll('.v7-exception').forEach((el) => el.remove());
}

function addRadar() {
  const overview = isOverviewPage();
  const lang = currentLang();
  const key = `${overview ? 'overview' : 'page'}:${lang}`;
  if (key === lastRadarKey) return;
  lastRadarKey = key;

  cleanRadar();
  if (!overview) return;

  const anchor = document.querySelector('.content .stack');
  if (!anchor) return;
  const t = radarText(lang);
  const section = document.createElement('section');
  section.className = 'v7-exception v10-overview-only';
  section.innerHTML = `
    <div class="v7-exception-head">
      <div>
        <span class="eyebrow">${t.eyebrow}</span>
        <h2>${t.title}</h2>
        <p>${t.desc}</p>
      </div>
      <span class="v7-live-chip">${t.live}</span>
    </div>
    <div class="v7-exception-grid">
      ${t.cards.map((c, i) => `
        <div class="v7-exception-card ${i === 1 ? 'danger' : i === 3 ? 'good' : 'warn'}">
          <span>${c[0]}</span>
          <strong>${c[1]}</strong>
          <small>${c[2]}</small>
          <div class="v7-exception-meta"><em>${c[3]}</em><b>${c[4]}</b></div>
        </div>
      `).join('')}
    </div>`;
  anchor.appendChild(section);
}

function normalizeModal() {
  document.querySelectorAll('.drawer, .decision-drawer').forEach((el) => {
    el.classList.add('v10-modal');
    const panel = el.querySelector('.drawerpanel, .drawer-panel, .detail') as HTMLElement | null;
    if (panel) panel.classList.add('v10-modal-panel');
  });
  document.querySelectorAll('.drawerpanel, .drawer-panel, .detail').forEach((el) => {
    (el as HTMLElement).classList.add('v10-modal-panel');
  });
}

function enforce() {
  addRadar();
  normalizeModal();
}

function start() {
  const root = document.querySelector('#root');
  if (!root) return;
  let scheduled = false;
  const run = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      enforce();
    });
  };
  new MutationObserver(run).observe(root, {subtree: true, childList: true, attributes: true, attributeFilter: ['class']});
  enforce();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
