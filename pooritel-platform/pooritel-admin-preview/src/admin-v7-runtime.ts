const radarText = (fa:boolean) => fa ? {
  eyebrow:'هشدارهای عملیاتی', title:'چه چیزی بعدی نیاز به توجه دارد؟', desc:'موارد استثنایی قبل از تبدیل شدن به مشکل مشتری نمایش داده می‌شوند.', live:'زنده',
  cards:[
    ['پرداخت ناموفق / با تأخیر','۳','تلاش‌های پرداخت نیاز به بررسی دارند','بیشترین اثر','باز کردن صف ←'],
    ['سفارش‌های در معرض SLA','۵','تحویل یا تأیید دیر شده است','اثر روی مشتری','بررسی ←'],
    ['آگهی‌های دارای سیگنال ریسک','۲','قیمت، مالکیت یا دسته‌بندی نیاز به بررسی دارد','مدیریت آگهی','بررسی ←'],
    ['سلامت سیستم / پرداخت','۹۹.۸٪','سرویس‌های اصلی به‌صورت عادی کار می‌کنند','آخرین بررسی: ۱ دقیقه','مشاهده سلامت ←']
  ]
} : {
  eyebrow:'EXCEPTION RADAR', title:'What needs attention next', desc:'Operational exceptions surfaced before they become customer problems.', live:'LIVE',
  cards:[
    ['Failed / delayed payments','3','Payment attempts need review','Highest impact','Open queue →'],
    ['Orders at SLA risk','5','Delivery or confirmation is late','Customer impact','Inspect →'],
    ['Listings with risk signals','2','Price, ownership or category mismatch','Moderation','Review →'],
    ['System / payments health','99.8%','Core services operating normally','Last check 1m','View health →']
  ]
};

function addExceptionRadar(){
  const existing=document.querySelector('.v7-exception');
  if(existing) existing.remove();
  const headings=[...document.querySelectorAll('h2')];
  const flowHeading=headings.find(h=>(h.textContent||'').toLowerCase().includes('12-day money flow') || (h.textContent||'').includes('گردش مالی ۱۲ روز اخیر'));
  const flowPanel=flowHeading?.closest('.panel') as HTMLElement|null;
  if(flowPanel) flowPanel.remove();
  const anchor=document.querySelector('.content .stack');
  if(!anchor) return;
  const fa=document.documentElement.lang==='fa';
  const t=radarText(fa);
  const section=document.createElement('section');
  section.className='v7-exception';
  section.innerHTML=`<div class="v7-exception-head"><div><span class="eyebrow">${t.eyebrow}</span><h2>${t.title}</h2><p>${t.desc}</p></div><span class="v7-live-chip">${t.live}</span></div><div class="v7-exception-grid">${t.cards.map((c,i)=>`<div class="v7-exception-card ${i===1?'danger':i===3?'good':'warn'}"><span>${c[0]}</span><strong>${c[1]}</strong><small>${c[2]}</small><div class="v7-exception-meta"><em>${c[3]}</em><b>${c[4]}</b></div></div>`).join('')}</div>`;
  anchor.appendChild(section);
}

function mountPersistentToggle(){
  // The original React .collapse-fixed control is the only sidebar toggle.
  // This runtime intentionally does not create another visible button.
  const old=document.querySelector('.admin-v7-toggle');
  if(old) old.remove();
  const legacy=document.querySelector('.sidebar .collapse-fixed') as HTMLElement|null;
  if(legacy) legacy.classList.add('v7-single-toggle');
}

function run(){
  mountPersistentToggle();
  addExceptionRadar();
  window.setTimeout(addExceptionRadar,150);
  window.setTimeout(addExceptionRadar,500);
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
