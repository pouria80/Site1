(()=>{
  const me=()=>fetch('/api/auth/me',{credentials:'include',cache:'no-store'}).then(async r=>r.ok?r.json():null).catch(()=>null);
  const logout=()=>fetch('/api/auth/logout',{method:'POST',credentials:'include'}).finally(()=>location.assign('/auth/'));
  const mount=(user)=>{
    document.querySelectorAll('.topbar .sessionAccount,.topbar .sessionMenu').forEach(el=>el.remove());
    const topbar=document.querySelector('.topbar');
    const sideBottom=document.querySelector('.sidebar .sidebottom');
    if(!user){ location.assign('/auth/'); return; }
    const name=user.email?.split('@')[0]||'Account';
    const isFa=document.documentElement.lang==='fa';

    if(topbar && !topbar.querySelector('.storeHeaderBtn')){
      const store=document.createElement('a');
      store.className='storeHeaderBtn';
      store.href='/';
      store.textContent=isFa?'فروشگاه':'Store';
      topbar.appendChild(store);
    }

    if(!sideBottom)return;
    let account=document.querySelector('.sidebar .sessionAccountSide');
    if(!account){ account=document.createElement('div'); account.className='sessionAccountSide'; sideBottom.appendChild(account); }
    account.innerHTML=`<button class="sessionAccountTrigger" type="button" aria-expanded="false"><span class="sessionAvatar">${name.slice(0,1).toUpperCase()}</span><span class="sessionMeta"><b>${name}</b><small>${user.email||''}</small></span><span class="sessionChevron">⌄</span></button><div class="sessionSideMenu"><button type="button" data-session-logout>${isFa?'خروج از حساب':'Sign out'}</button></div>`;
    const trigger=account.querySelector('.sessionAccountTrigger');
    trigger.addEventListener('click',()=>{const open=account.classList.toggle('open');trigger.setAttribute('aria-expanded',String(open));});
    account.querySelector('[data-session-logout]').addEventListener('click',logout);
    document.addEventListener('click',(event)=>{if(!account.contains(event.target)){account.classList.remove('open');trigger.setAttribute('aria-expanded','false');}});
  };
  me().then(d=>mount(d?.authenticated?d.user:null));
})();
