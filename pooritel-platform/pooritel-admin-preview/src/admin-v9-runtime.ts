const radarFa = {
  eyebrow:'هشدارهای عملیاتی', title:'چه چیزی بعدی نیاز به توجه دارد؟', desc:'موارد استثنایی قبل از تبدیل شدن به مشکل مشتری نمایش داده می‌شوند.', live:'زنده',
  cards:[['پرداخت ناموفق / با تأخیر','۳','تلاش‌های پرداخت نیاز به بررسی دارند','بیشترین اثر','باز کردن صف ←'],['سفارش‌های در معرض SLA','۵','تحویل یا تأیید دیر شده است','اثر روی مشتری','بررسی ←'],['آگهی‌های دارای سیگنال ریسک','۲','قیمت، مالکیت یا دسته‌بندی نیاز به بررسی دارد','مدیریت آگهی','بررسی ←'],['سلامت سیستم / پرداخت','۹۹.۸٪','سرویس‌های اصلی به‌صورت عادی کار می‌کنند','آخرین بررسی: ۱ دقیقه','مشاهده سلامت ←']]
};
const radarEn = {
  eyebrow:'EXCEPTION RADAR', title:'What needs attention next', desc:'Operational exceptions surfaced before they become customer problems.', live:'LIVE',
  cards:[['Failed / delayed payments','3','Payment attempts need review','Highest impact','Open queue →'],['Orders at SLA risk','5','Delivery or confirmation is late','Customer impact','Inspect →'],['Listings with risk signals','2','Price, ownership or category mismatch','Moderation','Review →'],['System / payments health','99.8%','Core services operating normally','Last check 1m','View health →']]
};
function isFa(){return [...document.querySelectorAll('.language button')].some(b=>(b as HTMLElement).classList.contains('active')&&(b.textContent||'').trim()==='فا');}
function purgeFlow(){for(const p of [...document.querySelectorAll('.panel')]){const text=(p.textContent||'').toLowerCase();if(text.includes('12-day money flow')||text.includes('گردش مالی ۱۲ روز اخیر'))p.remove();}}
function renderRadar(){
  purgeFlow();
  const old=document.querySelector('.v7-exception'); old?.remove();
  const stack=document.querySelector('.content .stack'); if(!stack)return;
  const t=isFa()?radarFa:radarEn;
  const section=document.createElement('section');section.className='v7-exception';
  section.innerHTML=`<div class="v7-exception-head"><div><span class="eyebrow">${t.eyebrow}</span><h2>${t.title}</h2><p>${t.desc}</p></div><span class="v7-live-chip">${t.live}</span></div><div class="v7-exception-grid">${t.cards.map((c,i)=>`<div class="v7-exception-card ${i===1?'danger':i===3?'good':'warn'}"><span>${c[0]}</span><strong>${c[1]}</strong><small>${c[2]}</small><div class="v7-exception-meta"><em>${c[3]}</em><b>${c[4]}</b></div></div>`).join('')}</div>`;
  stack.appendChild(section);
}
function styleModal(el:HTMLElement){el.classList.add('pt-v9-glass-modal');Object.assign(el.style,{position:'relative',inset:'auto',margin:'0 auto',width:'min(820px, calc(100vw - 48px))',maxHeight:'min(86vh,860px)',height:'auto',background:'linear-gradient(135deg, rgba(255,255,255,.82), rgba(238,247,241,.62))',backgroundColor:'rgba(255,255,255,.70)',backdropFilter:'blur(30px) saturate(165%)',WebkitBackdropFilter:'blur(30px) saturate(165%)',border:'1px solid rgba(255,255,255,.28)',borderRadius:'26px',boxShadow:'0 35px 110px rgba(0,0,0,.24), inset 0 1px 0 rgba(255,255,255,.75)',zIndex:'2'});}
function enforceModals(){
  const roots=[...document.querySelectorAll('.drawer')];
  for(const root of roots){(root as HTMLElement).style.cssText += ';position:fixed!important;inset:0!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:24px!important;z-index:1000!important;';const panel=root.querySelector('.drawerpanel,.detail,.drawer-panel') as HTMLElement|null;if(panel)styleModal(panel);const back=root.querySelector('.backdrop') as HTMLElement|null;if(back)Object.assign(back.style,{position:'absolute',inset:'0',background:'rgba(7,12,10,.50)',backdropFilter:'blur(14px) saturate(135%)',WebkitBackdropFilter:'blur(14px) saturate(135%)'});document.body.classList.add('pt-modal-open');}
  if(!roots.length)document.body.classList.remove('pt-modal-open');
}
let queued=false;
function sync(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;const overview=!!document.querySelector('.heading h1, .admin-heading h1');if(overview)renderRadar();else purgeFlow();enforceModals();});}
const observer=new MutationObserver(sync);observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync);else sync();
