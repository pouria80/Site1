import React,{useState} from 'react';
import{createRoot}from'react-dom/client';
import{ArrowUpRight,Bell,ChevronLeft,ChevronRight,Clock3,Gamepad2,Headphones,Languages,LayoutDashboard,Moon,Plus,Search,Settings,ShieldCheck,ShoppingBag,Sparkles,Sun,UserRound,WalletCards,Zap}from'lucide-react';
import'./command-deck.css';

const orders=[
{id:'PT-10492',name:'Telegram Premium · 12 months',amount:'$21.90',status:'در حال بررسی'},
{id:'PT-10471',name:'Steam Wallet · 20 USD',amount:'$20.45',status:'تکمیل شده'},
{id:'PT-10466',name:'Dota 2 Item Bundle',amount:'$15.00',status:'تکمیل شده'}
];
const nav=[
['نمای کلی','Overview',LayoutDashboard],['کیف پول','Wallet',WalletCards],['سفارش‌ها','Orders',ShoppingBag],['پروفایل','Profile',UserRound],['امنیت و احراز','Security & Verify',ShieldCheck],['تنظیمات','Settings',Settings],['پشتیبانی و تیکت','Support & Tickets',Headphones]
];
function App(){
const[open,setOpen]=useState(true);const[usd,setUsd]=useState(true);const[active,setActive]=useState(0);const[dark,setDark]=useState(false);const[lang,setLang]=useState<'FA'|'EN'>('FA');
const fa=lang==='FA';
return <div className={`app ${open?'open':'closed'} ${dark?'theme-dark':'theme-light'}`}>
<aside className="side">
<div className="brand"><div className="brandmark"><Sparkles size={18}/></div><div><b>PooriTel</b><span>PLAYER SPACE</span></div></div>
<button className="collapse" onClick={()=>setOpen(v=>!v)}>{open?<ChevronRight/>:<ChevronLeft/>}</button>
<div className="side-search"><Search size={14}/><span>{fa?'جستجو':'Search'}</span></div>
<nav><div className="label">WORKSPACE</div>{nav.slice(0,3).map(([f,e,I],i)=><button key={e} className={active===i?'active':''} onClick={()=>setActive(i)}><I/><span>{fa?f:e}</span></button>)}<div className="label">ACCOUNT</div>{nav.slice(3).map(([f,e,I],i)=><button key={e} className={active===i+3?'active':''} onClick={()=>setActive(i+3)}><I/><span>{fa?f:e}</span></button>)}</nav>
<div className="side-footer-actions"><button className="lang-switch" onClick={()=>setLang(v=>v==='FA'?'EN':'FA')}><Languages size={14}/><span>{lang}</span><small>{fa?'English':'فارسی'}</small></button><div className="side-footer-note"><Zap size={12}/><span>POORITEL ENGINE · ONLINE</span></div></div>
<div className="user-mini"><div className="avatar">P</div><div className="user-copy"><b>Pouria</b><span>customer@example.com</span></div></div>
</aside>
<main>
<div className="topbar"><div><div className="eyebrow"><Gamepad2/> {fa?'PLAYER HUB · CUSTOMER':'PLAYER HUB · CUSTOMER'}</div><h1>{fa?'فضای شخصی تو':'Your Player Space'}</h1><p>{fa?'خریدها، موجودی و اتفاق‌های مهمت در یک نگاه.':'Purchases, balance and important activity in one place.'}</p></div><div className="top-actions"><button onClick={()=>setDark(v=>!v)}>{dark?<Sun/>:<Moon/>}</button><button><Bell/></button></div></div>
<div className="deck">
<section className="core-stage"><div className="grid-lines"/><div className="scanline"/><div className="stage-copy"><div className="eyebrow">POORITEL CORE · ONLINE</div><h2>{fa?'مرکز فرمان تو':'Your command center'}</h2><p>{fa?'این صفحه برای دیدن همه‌چیز ساخته نشده؛ فقط چیزهایی را نگه می‌دارد که همین لحظه به آن‌ها نیاز داری.':'Not everything belongs on the home screen. Only what matters right now stays here.'}</p><div className="stage-actions"><button className="primary"><Plus size={14}/>{fa?'شارژ کیف پول':'Add funds'}</button><button className="ghost"><ArrowUpRight size={14}/>{fa?'برداشت':'Withdraw'}</button></div></div><div className="core-ring"><div className="core-node"><Sparkles/></div><div className="data-orbit orbit-one"><span className="orbit-dot"/> SYSTEM READY</div><div className="data-orbit orbit-two"><span className="orbit-dot"/> SECURE SESSION</div></div></section>
<div className="right-rail">
<section className="wallet-card"><div className="row-head"><span className="eyebrow-small">AVAILABLE BALANCE</span><div className="currency-pill"><button className={usd?'active':''} onClick={()=>setUsd(true)}>USD</button><button className={!usd?'active':''} onClick={()=>setUsd(false)}>IRT</button></div></div><div className="wallet-value"><b>{usd?'$124.50':'۱۲٬۴۵۰٬۰۰۰'}</b></div><div className="wallet-sub">{fa?'موجودی قابل استفاده':'Available to use'}</div><div className="wallet-actions"><button>{fa?'شارژ':'Add'}</button><button>{fa?'برداشت':'Withdraw'}</button></div></section>
<section className="snapshot"><div className="snapshot-head"><h3>{fa?'آخرین سفارش‌ها':'Recent orders'}</h3><span className="eyebrow-small">03</span></div><div className="snapshot-list">{orders.map(o=><div className="snapshot-item" key={o.id}><div className="snap-icon"><ShoppingBag/></div><div className="snap-copy"><b>{o.name}</b><span>#{o.id}</span></div><div className="snap-amt"><b>{o.amount}</b><span className={o.status==='تکمیل شده'?'done':'pending'}>{fa?o.status:o.status==='تکمیل شده'?'Completed':'Reviewing'}</span></div></div>)}</div></section>
</div></div>
<section className="market-card"><div className="market-art"><div className="market-orbit"/><div className="market-orb">P</div></div><div className="market-copy"><div className="eyebrow">FEATURED DROP · MARKETPLACE</div><h2>Telegram Premium</h2><p>{fa?'یک پیشنهاد منتخب برای خرید بعدی؛ محصولی که می‌تواند همین حالا توجهت را جلب کند.':'A featured marketplace pick designed to earn a place in your next purchase.'}</p><div className="market-meta"><span className="sale-badge">{fa?'تا ۲۰٪ تخفیف':'UP TO 20% OFF'}</span><button className="market-button">{fa?'مشاهده محصول':'View product'}<ArrowUpRight size={13}/></button></div></div></section>
<section className="lower"><div className="activity-panel"><div className="row-head"><h3>{fa?'نبض فعالیت':'Activity pulse'}</h3><span className="eyebrow-small">LIVE</span></div><div className="activity-stream"><div className="activity-row"><i className="activity-dot"/><div><b>{fa?'سفارش PT-10492 ثبت شد':'Order PT-10492 created'}</b><span>{fa?'Telegram Premium · نیازمند بررسی':'Telegram Premium · awaiting review'}</span></div><time>2m</time></div><div className="activity-row"><i className="activity-dot"/><div><b>{fa?'جلسه جدید مرورگر':'New browser session'}</b><span>{fa?'ورود امن شناسایی شد':'Secure login detected'}</span></div><time>18m</time></div><div className="activity-row"><i className="activity-dot"/><div><b>{fa?'موجودی به‌روزرسانی شد':'Wallet updated'}</b><span>{fa?'آخرین همگام‌سازی موفق بود':'Last synchronization completed'}</span></div><time>42m</time></div></div></div>
<div className="support-panel"><div className="eyebrow"><Headphones/> SUPPORT</div><h3>{fa?'نیاز به کمک داری؟':'Need a hand?'}</h3><p>{fa?'یک تیکت باز کن یا وضعیت درخواست‌های قبلی‌ات را ببین. پشتیبانی از همین‌جا در دسترس است.':'Open a ticket or follow an existing request without leaving your player space.'}</p><button className="ticket-button"><Headphones size={14}/>{fa?'مشاهده پشتیبانی و تیکت‌ها':'Open support'}</button></div></section>
<footer><span>{fa?'آخرین به‌روزرسانی · همین الان':'Updated · just now'}</span><span>POORITEL · PLAYER SPACE</span></footer>
</main></div>}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);