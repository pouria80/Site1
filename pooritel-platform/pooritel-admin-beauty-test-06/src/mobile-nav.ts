const toggle = document.createElement('button');
toggle.type='button';
toggle.className='mobile-sidebar-trigger';
toggle.setAttribute('aria-label','Open navigation');
toggle.textContent='☰';
document.body.appendChild(toggle);

const sync=()=>{
  const sidebar=document.querySelector<HTMLElement>('.sidebar');
  const mobile=window.matchMedia('(max-width: 760px)').matches;
  toggle.style.display=mobile?'grid':'none';
  if(!sidebar)return;
  toggle.onclick=()=>sidebar.classList.toggle('mobile-open');
};
window.addEventListener('resize',sync);
const observer=new MutationObserver(sync);
observer.observe(document.body,{childList:true,subtree:true});
sync();
