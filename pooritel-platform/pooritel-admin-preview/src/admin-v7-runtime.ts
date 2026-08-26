type SidebarState = { collapsed: boolean };

declare global { interface Window { __ptAdminV7?: { toggleSidebar: () => void } } }

function addExceptionRadar(){
  if(document.querySelector('.v7-exception')) return;
  const headings=[...document.querySelectorAll('h2')];
  const flowHeading=headings.find(h=>(h.textContent||'').toLowerCase().includes('12-day money flow') || (h.textContent||'').includes('گردش مالی ۱۲ روز اخیر'));
  const flowPanel=flowHeading?.closest('.panel') as HTMLElement|null;
  if(flowPanel){ flowPanel.classList.add('admin-v7-flow-removed'); flowPanel.remove(); }

  const anchor=document.querySelector('.lower')?.parentElement || document.querySelector('.content .stack');
  if(!anchor) return;
  const section=document.createElement('section');
  section.className='v7-exception';
  section.innerHTML=`
    <div class="v7-exception-head">
      <div><span class="eyebrow">EXCEPTION RADAR</span><h2>What needs attention next</h2><p>Operational exceptions surfaced before they become customer problems.</p></div>
      <span class="v7-live-chip">LIVE</span>
    </div>
    <div class="v7-exception-grid">
      <div class="v7-exception-card warn"><span>Failed / delayed payments</span><strong class="amber">3</strong><small>Payment attempts need review</small><div class="v7-exception-meta"><em>Highest impact</em><b>Open queue →</b></div></div>
      <div class="v7-exception-card danger"><span>Orders at SLA risk</span><strong class="red">5</strong><small>Delivery or confirmation is late</small><div class="v7-exception-meta"><em>Customer impact</em><b>Inspect →</b></div></div>
      <div class="v7-exception-card warn"><span>Listings with risk signals</span><strong class="amber">2</strong><small>Price, ownership or category mismatch</small><div class="v7-exception-meta"><em>Moderation</em><b>Review →</b></div></div>
      <div class="v7-exception-card good"><span>System / payments health</span><strong class="good">99.8%</strong><small>Core services operating normally</small><div class="v7-exception-meta"><em>Last check 1m</em><b>View health →</b></div></div>
    </div>`;
  const oldLower=document.querySelector('.lower');
  if(oldLower) oldLower.replaceWith(section); else anchor.appendChild(section);
}

function mountPersistentToggle(){
  if(document.querySelector('.admin-v7-toggle')) return;
  const admin=document.querySelector('.admin-v3') as HTMLElement|null;
  if(!admin) return;
  admin.classList.add('admin-v7-ready');
  const btn=document.createElement('button');
  btn.className='admin-v7-toggle';
  btn.type='button';
  btn.setAttribute('aria-label','Toggle sidebar');
  btn.setAttribute('aria-expanded','true');
  btn.innerHTML='<span class="v7-chevron">‹</span><span class="v7-pulse"></span>';
  const state:SidebarState={collapsed:false};
  const sync=()=>{
    const sidebar=document.querySelector('.sidebar') as HTMLElement|null;
    if(!sidebar) return;
    state.collapsed=sidebar.classList.contains('collapsed');
    btn.classList.toggle('is-collapsed',state.collapsed);
    btn.setAttribute('aria-expanded',String(!state.collapsed));
    (btn.querySelector('.v7-chevron') as HTMLElement).textContent=state.collapsed?'›':'‹';
  };
  btn.addEventListener('click',()=>{
    const legacy=document.querySelector('.sidebar > .collapse') as HTMLButtonElement|null;
    if(legacy) legacy.click();
    else {
      const sidebar=document.querySelector('.sidebar') as HTMLElement|null;
      if(sidebar){ sidebar.classList.toggle('collapsed'); }
      const main=document.querySelector('.main') as HTMLElement|null;
      if(main) main.style.marginRight=sidebar?.classList.contains('collapsed')?'82px':'276px';
    }
    sync();
  });
  document.body.appendChild(btn);
  const observer=new MutationObserver(sync);
  observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
  sync();
  window.__ptAdminV7={toggleSidebar:()=>btn.click()};
}

function run(){
  mountPersistentToggle();
  addExceptionRadar();
  // Re-check after React renders its page.
  window.setTimeout(addExceptionRadar,120);
  window.setTimeout(addExceptionRadar,500);
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
