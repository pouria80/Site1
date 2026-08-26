import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

type Lang = 'fa' | 'en';
type Theme = 'dark' | 'light';

type Product = { id: string; title: string; fa: string; price: string; tag: string; tone: string };

const products: Product[] = [
  { id:'tg', title:'Telegram Premium · 12 Months', fa:'تلگرام پریمیوم · ۱۲ ماهه', price:'$21.90', tag:'TRENDING', tone:'tg' },
  { id:'steam', title:'Steam Wallet · $20', fa:'استیم والت · ۲۰ دلار', price:'$20.00', tag:'POPULAR', tone:'steam' },
  { id:'dota', title:'Dota 2 · Immortal Bundle', fa:'دوتا ۲ · باندل ایمورتال', price:'$34.50', tag:'FOR YOU', tone:'dota' },
  { id:'spot', title:'Spotify Premium · 3 Months', fa:'اسپاتیفای پریمیوم · ۳ ماهه', price:'$14.99', tag:'NEW DROP', tone:'spot' },
];

const fa = {
  hub:'هاب', wallet:'کیف پول', orders:'سفارش‌ها', profile:'پروفایل', security:'امنیت و احراز', settings:'تنظیمات', support:'پشتیبانی و تیکت',
  now:'اکنون · سیگنال فعال', moving:'سفارش شما در حرکت است', processing:'در حال پردازش', view:'مشاهده سفارش', paid:'پرداخت', review:'بررسی', delivery:'تحویل', complete:'تکمیل',
  walletTitle:'کیف پول', balance:'موجودی در دسترس', add:'افزایش موجودی', withdraw:'برداشت وجه', quick:'دسترسی سریع', myOrders:'سفارش‌های من',
  world:'دنیای شما', recent:'بازدیدهای اخیر', saved:'ذخیره‌شده', continue:'ادامه بده', discover:'کشف کن', picked:'پیشنهاد برای تو',
  journey:'مسیر شما', help:'کمک لازم داری؟', helpSub:'مشکلی پیش آمده؟ تیم ما اینجاست.', ticket:'تیکت جدید', helpCenter:'مرکز راهنمایی',
  search:'جستجوی محصول یا سفارش…', allQuiet:'همه‌چیز آرام است', quietSub:'فعلاً مأموریت فعالی نداری؛ کشف بعدی همین پایین منتظر توست.', explore:'ادامه گشت‌وگذار', theme:'تم', language:'زبان', current:'اکنون', open:'باز'
};
const en = {
  hub:'Hub', wallet:'Wallet', orders:'Orders', profile:'Profile', security:'Security & Verification', settings:'Settings', support:'Support & Tickets',
  now:'NOW · CURRENT SIGNAL', moving:'Your order is moving', processing:'Processing', view:'View Order', paid:'Payment', review:'Review', delivery:'Delivery', complete:'Complete',
  walletTitle:'Wallet', balance:'Available balance', add:'Add Funds', withdraw:'Withdraw', quick:'QUICK ACTIONS', myOrders:'My Orders',
  world:'YOUR WORLD', recent:'Recently viewed', saved:'Saved', continue:'Continue', discover:'DISCOVER', picked:'Picked for you',
  journey:'YOUR JOURNEY', help:'NEED HELP?', helpSub:'Something went wrong? Our crew is here.', ticket:'New Ticket', helpCenter:'Help Center',
  search:'Search products, orders…', allQuiet:"You're all caught up", quietSub:'No active mission right now. Your next discovery is below.', explore:'Continue exploring', theme:'Theme', language:'Language', current:'NOW', open:'OPEN'
};

function Icon({name, size=18}:{name:string;size?:number}) {
  const p={width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'} as React.SVGProps<SVGSVGElement>;
  const m:Record<string,React.ReactNode>={
    grid:<><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="4" rx="2"/><rect x="14" y="10" width="7" height="11" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/></>,
    wallet:<><rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18"/><circle cx="16.5" cy="14.5" r="1.2"/></>,
    box:<><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></>,
    user:<><circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c.8-3.6 3.8-5.4 7.5-5.4s6.7 1.8 7.5 5.4"/></>,
    shield:<><path d="M12 3l7 3v6c0 4.7-3 7.7-7 9-4-1.3-7-4.3-7-9V6z"/><path d="M9 12l2 2 4-4"/></>,
    gear:<><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/></>,
    life:<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M6 6l3 3M18 6l-3 3M6 18l3-3M18 18l-3-3"/></>,
    bell:<><path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9"/><path d="M10 20a2.2 2.2 0 0 0 4 0"/></>,
    search:<><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></>,
    moon:<path d="M20 14.4A8.6 8.6 0 0 1 9.6 4a8.6 8.6 0 1 0 10.4 10.4z"/>,
    sun:<><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    globe:<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 2.5 4 5.6 4 9s-1.2 6.5-4 9c-2.8-2.5-4-5.6-4-9s1.2-6.5 4-9z"/></>,
    menu:<path d="M4 7h16M4 12h16M4 17h10"/>,
    arrow:<path d="M5 12h14M13 6l6 6-6 6"/>,
    plus:<path d="M12 5v14M5 12h14"/>,
    down:<><path d="M12 4v12"/><path d="M6 10l6 6 6-6"/></>,
    heart:<path d="M12 20s-7.4-4.6-9.2-9.2C1.6 7.6 3.7 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.3 0 5.4 3.1 4.2 6.3C19.4 15.4 12 20 12 20z"/>,
    check:<path d="M5 12.5l4.5 4.5L19 7.5"/>,
  };
  return <svg {...p}>{m[name]}</svg>;
}

function App(){
  const [lang,setLang]=useState<Lang>('fa');
  const [theme,setTheme]=useState<Theme>('dark');
  const [open,setOpen]=useState(true);
  const [mobile,setMobile]=useState(false);
  const [active,setActive]=useState('hub');
  const [currency,setCurrency]=useState<'USD'|'IRT'>('USD');
  const [balance,setBalance]=useState(124.5);
  const [saved,setSaved]=useState<string[]>([]);
  const [query,setQuery]=useState('');
  const [notif,setNotif]=useState(false);
  const [toast,setToast]=useState('');
  const [orderOpen,setOrderOpen]=useState(false);
  const t=lang==='fa'?fa:en;
  const dir=lang==='fa'?'rtl':'ltr';
  const filtered=useMemo(()=>products.filter(p=>(p.title+' '+p.fa).toLowerCase().includes(query.toLowerCase())),[query]);

  useEffect(()=>{document.documentElement.lang=lang;document.documentElement.dir=dir},[lang,dir]);
  useEffect(()=>{if(!toast)return;const id=setTimeout(()=>setToast(''),2400);return()=>clearTimeout(id)},[toast]);

  const section=(id:string)=>{setActive(id);setMobile(false);document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})};
  const addFunds=()=>{setBalance(v=>+(v+50).toFixed(2));setToast(lang==='fa'?'کیف پول +$50 شارژ شد':'Wallet charged +$50')};
  const withdraw=()=>setToast(lang==='fa'?'درخواست برداشت ثبت شد':'Withdrawal request sent');

  const nav=[
    {id:'hub',label:t.hub,icon:'grid',target:'top'},
    {id:'wallet',label:t.wallet,icon:'wallet',target:'wallet'},
    {id:'orders',label:t.orders,icon:'box',target:'now'},
    {id:'profile',label:t.profile,icon:'user',target:'world'},
    {id:'security',label:t.security,icon:'shield',target:'support'},
    {id:'settings',label:t.settings,icon:'gear',target:'support'},
    {id:'support',label:t.support,icon:'life',target:'support'},
  ];

  return <div className="app" data-theme={theme} data-lang={lang} dir={dir}>
    <div className="atmo"/><div className="grain"/>
    <aside className={'sidebar '+(!open?'closed':'')+(mobile?' mobile':'')}>
      <div className="brand"><div className="brandmark">P</div>{open&&<div><b>PooriTel</b><small>PLAYER HUB</small></div>}</div>
      <button className="collapse" onClick={()=>setOpen(v=>!v)} aria-label="collapse"><Icon name="menu"/></button>
      <div className="group">SPACE</div>
      {nav.slice(0,3).map(n=><button key={n.id} className={'nav '+(active===n.id?'active':'')} onClick={()=>{setActive(n.id);section(n.target)}}><span><Icon name={n.icon}/></span>{open&&<label>{n.label}</label>}</button>)}
      <div className="group">ACCOUNT</div>
      {nav.slice(3,6).map(n=><button key={n.id} className={'nav '+(active===n.id?'active':'')} onClick={()=>{setActive(n.id);section(n.target)}}><span><Icon name={n.icon}/></span>{open&&<label>{n.label}</label>}</button>)}
      <div className="group">HELP</div>
      {nav.slice(6).map(n=><button key={n.id} className={'nav '+(active===n.id?'active':'')} onClick={()=>{setActive(n.id);section(n.target)}}><span><Icon name={n.icon}/></span>{open&&<label>{n.label}</label>}</button>)}
      <div className="sidebottom">
        {open&&<div className="seg"><button className={lang==='en'?'on':''} onClick={()=>setLang('en')}>EN</button><button className={lang==='fa'?'on':''} onClick={()=>setLang('fa')}>FA</button></div>}
        <button className="themeRow" onClick={()=>setTheme(v=>v==='dark'?'light':'dark')}><Icon name={theme==='dark'?'sun':'moon'}/>{open&&<span>{theme==='dark'?(lang==='fa'?'حالت روشن':'Light'):(lang==='fa'?'حالت تاریک':'Dark')}</span>}</button>
        <div className="user"><div className="avatar">P</div>{open&&<div><b>Pouria</b><small>pouria@mail.com</small></div>}</div>
      </div>
    </aside>
    {mobile&&<button className="backdrop" onClick={()=>setMobile(false)} aria-label="close"/>}
    <main className="main" id="top">
      <header className="topbar">
        <div className="mobileMenu"><button className="iconBtn" onClick={()=>setMobile(true)}><Icon name="menu"/></button></div>
        <div className="topTitle"><b>PooriTel</b><span>PLAYER HUB</span></div>
        <div className="search"><Icon name="search"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search}/></div>
        <button className="iconBtn" onClick={()=>setTheme(v=>v==='dark'?'light':'dark')}><Icon name={theme==='dark'?'sun':'moon'}/></button>
        <button className="iconBtn notif" onClick={()=>setNotif(v=>!v)}><Icon name="bell"/><i/></button>
        <button className="langBtn" onClick={()=>setLang(v=>v==='fa'?'en':'fa')}><Icon name="globe"/>{lang.toUpperCase()}</button>
        {notif&&<div className="notifications"><div className="notifHead"><b>{lang==='fa'?'اعلان‌ها':'Notifications'}</b><button onClick={()=>setNotif(false)}>{lang==='fa'?'بستن':'Close'}</button></div><div className="notifItem"><b>{lang==='fa'?'سفارش PT-10492 وارد مرحله تحویل شد':'Order PT-10492 moved to Delivery'}</b><small>5 min ago</small></div><div className="notifItem"><b>{lang==='fa'?'قیمت استیم والت کاهش یافت':'Steam Wallet price dropped'}</b><small>2 h ago</small></div></div>}
      </header>
      <div className="content">
        <div className="proto"><span className="statusDot"/>{lang==='fa'?'پروتوتایپ مستقل · آماده اتصال به API':'Independent prototype · API-ready architecture'}</div>

        <section id="now" className="hero">
          <div className="scan"/>
          <div className="heroText">
            <div className="eyebrow">{t.now}</div>
            <h1>{t.moving}</h1>
            <p>{lang==='fa'?'تلگرام پریمیوم · ۱۲ ماهه':'Telegram Premium · 12 Months'}</p>
            <div className="orderChip"><span className="productMini">TP</span><div><b>#PT-10492</b><small>{t.processing}</small></div><span className="live">67%</span></div>
            <div className="heroBtns"><button className="primary" onClick={()=>setOrderOpen(v=>!v)}>{t.view} <Icon name="arrow"/></button><button className="ghost" onClick={()=>setToast(lang==='fa'?'فاکتور نمایش داده شد':'Invoice opened')}>{lang==='fa'?'مشاهده فاکتور':'View invoice'}</button></div>
            {orderOpen&&<div className="orderDetails"><span><b>{t.paid}</b> Wallet · Visa ••4021</span><span><b>{t.review}</b> Security check</span><span><b>{t.delivery}</b> Today · 18:00</span></div>}
          </div>
          <div className="heroVisual"><div className="orbital o1"><i/></div><div className="orbital o2"><i/></div><div className="core"><div className="coreGlow"/><strong>67%</strong><span>{t.delivery}</span></div><div className="stageList"><div className="stage done"><i><Icon name="check" size={13}/></i><div><b>{t.paid}</b><small>14:01</small></div></div><div className="stage done"><i><Icon name="check" size={13}/></i><div><b>{t.review}</b><small>14:04</small></div></div><div className="stage current"><i/><div><b>{t.delivery}</b><small>In progress</small></div></div><div className="stage"><i/><div><b>{t.complete}</b><small>Waiting</small></div></div></div></div>
        </section>

        <section className="moneyGrid" id="wallet">
          <div className="walletCard"><div className="eyebrow">{t.walletTitle}</div><span className="walletLabel">{t.balance}</span><strong>{currency==='USD'?'$'+balance.toFixed(2):Math.round(balance*98500).toLocaleString()}</strong><div className="currency"><button className={currency==='USD'?'on':''} onClick={()=>setCurrency('USD')}>USD</button><button className={currency==='IRT'?'on':''} onClick={()=>setCurrency('IRT')}>IRT</button></div><div className="walletBtns"><button className="primary small" onClick={addFunds}><Icon name="plus" size={15}/>{t.add}</button><button className="ghost small" onClick={withdraw}><Icon name="down" size={15}/>{t.withdraw}</button></div></div>
          <div className="quickBlock"><div className="sectionHead"><div className="eyebrow">{t.quick}</div></div><div className="quickGrid"><button className="quickCard" onClick={addFunds}><span className="quickIcon"><Icon name="plus"/></span><b>{t.add}</b><small>{lang==='fa'?'شارژ آنی':'Instant top-up'}</small><em><Icon name="arrow" size={15}/></em></button><button className="quickCard" onClick={withdraw}><span className="quickIcon orange"><Icon name="down"/></span><b>{t.withdraw}</b><small>{lang==='fa'?'بانک یا کریپتو':'Bank or crypto'}</small><em><Icon name="arrow" size={15}/></em></button><button className="quickCard" onClick={()=>section('now')}><span className="quickIcon violet"><Icon name="box"/></span><b>{t.myOrders}</b><small>{lang==='fa'?'پیگیری مأموریت‌ها':'Track your missions'}</small><em><Icon name="arrow" size={15}/></em></button></div></div>
        </section>

        <section id="world"><div className="sectionTitle"><span>{t.world}</span><small>{lang==='fa'?'آخرین رفتارهای شما':'Your latest activity'}</small></div><div className="worldGrid">
          <div className="worldCard"><div className="cardKicker">{t.recent}</div><div className="worldItem"><div className="art steamArt">S</div><div><b>{lang==='fa'?'استیم والت · ۲۰ دلار':'Steam Wallet · $20'}</b><small>38 {lang==='fa'?'دقیقه پیش':'min ago'}</small></div><button onClick={()=>setQuery('Steam')}><Icon name="arrow" size={15}/></button></div><div className="worldItem"><div className="art dotaArt">D</div><div><b>{lang==='fa'?'دوتا ۲ · باندل ایمورتال':'Dota 2 · Immortal Bundle'}</b><small>2 h {lang==='fa'?'پیش':'ago'}</small></div><button><Icon name="arrow" size={15}/></button></div></div>
          <div className="worldCard"><div className="cardKicker">{t.saved}</div>{saved.length===0?<div className="empty"><span>♡</span><b>{lang==='fa'?'هنوز چیزی ذخیره نکردی':'Nothing saved yet'}</b><small>{lang==='fa'?'محصولات مورد علاقه‌ات را اینجا نگه دار':'Keep your favorites here'}</small></div>:<div className="worldItem"><div className="art spotArt">S</div><div><b>Spotify Premium</b><small>Saved</small></div></div>}</div>
          <div className="worldCard"><div className="cardKicker">{t.continue}</div><div className="continueItem"><div className="progressRing"><svg viewBox="0 0 42 42"><circle cx="21" cy="21" r="17"/><circle className="val" cx="21" cy="21" r="17"/></svg><b>80%</b></div><div><b>{lang==='fa'?'تکمیل پرداخت · اسپاتیفای':'Complete payment · Spotify'}</b><small>{lang==='fa'?'۲ دقیقه مانده':'2 min left'}</small></div><button onClick={()=>setToast(lang==='fa'?'ادامه پرداخت':'Continue payment')}><Icon name="arrow" size={15}/></button></div><button className="tinyAction" onClick={()=>setToast(lang==='fa'?'ادامه عملیات':'Continue action')}>{t.explore} <Icon name="arrow" size={14}/></button></div>
        </div></section>

        <section id="discover"><div className="sectionTitle"><span>{t.discover}</span><small>{t.picked}</small></div><div className="productGrid">{filtered.map((p,i)=><button key={p.id} className="productCard" onClick={()=>{setSaved(v=>v.includes(p.id)?v.filter(x=>x!==p.id):[...v,p.id]);setToast(lang==='fa'?'محصول به ذخیره‌ها اضافه شد':'Product saved')}}><div className={'productArt '+p.tone}><span>{p.tag}</span><div className="artifact"><i/><b>{p.id==='tg'?'T':p.id==='steam'?'S':p.id==='dota'?'D':'P'}</b></div><div className="artGlow"/></div><div className="productInfo"><div><b>{lang==='fa'?p.fa:p.title}</b><small>{lang==='fa'?'بازار دیجیتال':'Digital marketplace'}</small></div><strong>{p.price}</strong></div><div className="hoverLine"><span>{lang==='fa'?'مشاهده محصول':'View product'}</span><Icon name="arrow" size={15}/></div>{saved.includes(p.id)&&<div className="savedMark"><Icon name="heart" size={14}/></div>}</button>)}</div></section>

        <section className="journeyGrid"><div id="journey" className="journeyCard"><div className="sectionTitle"><span>{t.journey}</span><small>{lang==='fa'?'امروز':'Today'}</small></div><div className="journeyItem"><i className="positive"><Icon name="plus" size={14}/></i><div><b>{lang==='fa'?'شارژ کیف پول':'Wallet charged'}</b><small>+$50.00 · 14:02</small></div></div><div className="journeyItem"><i className="neutral"><Icon name="box" size={14}/></i><div><b>{lang==='fa'?'ثبت سفارش PT-10492':'Order PT-10492 created'}</b><small>-$21.90 · 13:47</small></div></div><div className="journeyItem"><i className="purple"><Icon name="search" size={14}/></i><div><b>{lang==='fa'?'بازدید استیم والت':'Steam Wallet viewed'}</b><small>Discovery · 12:10</small></div></div><div className="journeyItem"><i className="positive"><Icon name="shield" size={14}/></i><div><b>{lang==='fa'?'تمدید امنیت':'Security renewed'}</b><small>Yesterday</small></div></div></div>
          <div id="support" className="supportCard"><div className="eyebrow">{t.help}</div><h2>{t.helpSub}</h2><p>{lang==='fa'?'سؤالت درباره سفارش، پرداخت یا حساب است؟ سریع از اینجا تیکت باز کن.':'Questions about an order, payment or account? Open a ticket here.'}</p><div className="supportBtns"><button className="primary" onClick={()=>setToast(lang==='fa'?'تیکت جدید آماده شد':'New ticket ready')}>{t.ticket}<Icon name="arrow" size={15}/></button><button className="ghost" onClick={()=>setToast(lang==='fa'?'مرکز راهنمایی باز شد':'Help center opened')}>{t.helpCenter}</button></div><div className="supportMeta"><span><i/>2 {lang==='fa'?'تیکت باز':'open tickets'}</span><span>{lang==='fa'?'پاسخ میانگین ۴ دقیقه':'Avg. reply 4 min'}</span></div></div></section>
        <div className="footer">POORITEL · CUSTOMER HUB · UI PROTOTYPE</div>
      </div>
    </main>
    {toast&&<div className="toast"><span/>{toast}</div>}
  </div>
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
