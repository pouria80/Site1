(()=>{
  const go=()=>{window.location.assign('/')};
  const mount=()=>{
    const top=document.querySelector('.topbar');
    if(!top||top.querySelector('.hubStoreBtn')) return false;
    const b=document.createElement('button');
    b.type='button'; b.className='hubStoreBtn'; b.setAttribute('aria-label','Marketplace');
    b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h16l-1 11H5L4 9Z"/><path d="M7 9V6a5 5 0 0 1 10 0v3"/><path d="M9 13h6"/></svg><span>Store</span>';
    b.addEventListener('click',go);
    const search=top.querySelector('.search');
    top.insertBefore(b,search||null);
    const sync=()=>{
      const fa=document.documentElement.lang==='fa' || document.querySelector('.app')?.getAttribute('data-lang')==='fa';
      b.querySelector('span').textContent=fa?'فروشگاه':'Store';
      b.setAttribute('aria-label',fa?'فروشگاه':'Marketplace');
    };
    sync();
    new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
    return true;
  };
  if(!mount()) new MutationObserver((_,obs)=>{if(mount()) obs.disconnect()}).observe(document.documentElement,{childList:true,subtree:true});
})();
