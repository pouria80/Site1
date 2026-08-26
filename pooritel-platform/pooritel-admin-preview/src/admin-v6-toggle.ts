function mountPersistentSidebarToggle(){
  if(document.querySelector('.pt-sidebar-reopen')) return;
  const btn=document.createElement('button');
  btn.className='pt-sidebar-reopen';
  btn.type='button';
  btn.setAttribute('aria-label','Toggle sidebar');
  btn.innerHTML='<span class="sr-chevron">‹</span>';
  const sync=()=>{
    const sidebar=document.querySelector('.sidebar') as HTMLElement|null;
    if(!sidebar) return;
    const collapsed=sidebar.classList.contains('collapsed');
    btn.classList.toggle('is-collapsed',collapsed);
    btn.setAttribute('aria-expanded',String(!collapsed));
  };
  btn.addEventListener('click',()=>{
    const target=document.querySelector('.sidebar .collapse') as HTMLButtonElement|null;
    if(target) target.click();
    sync();
    window.setTimeout(sync,40);
  });
  document.body.appendChild(btn);
  const observer=new MutationObserver(sync);
  observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
  window.setTimeout(sync,80);
  const sig=document.createElement('div');
  sig.className='admin-v6-signature';
  sig.innerHTML='<span class="sig-dot"></span>POORITEL';
  document.body.appendChild(sig);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mountPersistentSidebarToggle); else mountPersistentSidebarToggle();
