import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, ArrowDownLeft, ArrowUpRight, Bell, ChevronLeft, ChevronRight, Compass, Headphones, Heart, LayoutDashboard, Languages, Moon, Package, Plus, Search, Settings, ShieldCheck, ShoppingBag, Sparkles, Sun, Ticket, UserRound, WalletCards, Zap } from 'lucide-react';
import './style.css';

const products = [
  { title: 'Telegram Premium', sub: '12 Months', price: '$21.90', tone: 'violet', tag: 'Because you bought Premium' },
  { title: 'Steam Wallet', sub: '20 USD', price: '$20.45', tone: 'amber', tag: 'Popular right now' },
  { title: 'Dota 2 Bundle', sub: 'Arcana Pack', price: '$15.00', tone: 'teal', tag: 'Players like you' },
  { title: 'Spotify Premium', sub: '12 Months', price: '$39.00', tone: 'pink', tag: 'Trending' },
];

const orders = [
  { id: 'PT-10492', title: 'Telegram Premium · 12 Months', status: 'Processing', amount: '$21.90', step: 3 },
  { id: 'PT-10471', title: 'Steam Wallet · 20 USD', status: 'Completed', amount: '$20.45', step: 4 },
];

const activities = [
  ['Wallet charged', '+$50.00', '2h ago'],
  ['Order PT-10492 created', '-$21.90', '1h ago'],
  ['Steam Wallet viewed', 'Discovery', '38m ago'],
  ['Security session renewed', 'Secure', '12m ago'],
];

function App() {
  const [open, setOpen] = useState(true);
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState<'FA' | 'EN'>('FA');
  const [currency, setCurrency] = useState<'USD' | 'IRT'>('USD');
  const [activeNav, setActiveNav] = useState('hub');
  const [liked, setLiked] = useState<number[]>([]);

  const fa = lang === 'FA';
  const balance = currency === 'USD' ? '$124.50' : '۱۲٬۴۵۰٬۰۰۰';
  const t = useMemo(() => ({
    hub: fa ? 'خانه' : 'Hub', wallet: fa ? 'کیف پول' : 'Wallet', orders: fa ? 'سفارش‌ها' : 'Orders', profile: fa ? 'پروفایل' : 'Profile', security: fa ? 'امنیت و احراز' : 'Security', settings: fa ? 'تنظیمات' : 'Settings', support: fa ? 'پشتیبانی و تیکت' : 'Support & Tickets'
  }), [fa]);

  return (
    <div className={`app ${open ? 'open' : 'closed'} ${dark ? 'dark' : 'light'}`}>
      <aside className="sidebar">
        <div className="brand"><div className="brand-orb"><Sparkles size={17}/></div><div><b>PooriTel</b><span>PERSONAL HUB</span></div></div>
        <button className="collapse" onClick={() => setOpen(v => !v)}>{open ? <ChevronRight/> : <ChevronLeft/>}</button>
        <div className="search"><Search size={15}/><span>{fa ? 'جستجو در Hub' : 'Search Hub'}</span></div>
        <nav>
          <small>SPACE</small>
          {[[LayoutDashboard,'hub',t.hub],[WalletCards,'wallet',t.wallet],[Package,'orders',t.orders]].map(([Icon,key,label]) => <button key={String(key)} className={activeNav===key?'active':''} onClick={()=>setActiveNav(String(key))}><Icon/><span>{label as string}</span>{activeNav===key&&<i/>}</button>)}
          <small>ACCOUNT</small>
          {[[UserRound,'profile',t.profile],[ShieldCheck,'security',t.security],[Settings,'settings',t.settings]].map(([Icon,key,label]) => <button key={String(key)} className={activeNav===key?'active':''} onClick={()=>setActiveNav(String(key))}><Icon/><span>{label as string}</span>{activeNav===key&&<i/>}</button>)}
          <small>HELP</small>
          <button className={activeNav==='support'?'active':''} onClick={()=>setActiveNav('support')}><Headphones/><span>{t.support}</span><em>2</em></button>
        </nav>
        <div className="side-bottom">
          <button className="lang" onClick={()=>setLang(v=>v==='FA'?'EN':'FA')}><Languages/><span>{lang}</span><small>{fa?'English':'فارسی'}</small></button>
          <button className="side-note"><Zap/><span>POORITEL SIGNAL ONLINE</span></button>
          <div className="mini-user"><div className="avatar">P</div><div><b>Pouria</b><span>customer@example.com</span></div></div>
        </div>
      </aside>

      <main>
        <header className="topbar"><div><div className="eyebrow"><Compass/> POORITEL HUB · {fa?'فضای شخصی':'PERSONAL SPACE'}</div><h1>{fa?'خوش برگشتی، پوریا':'Welcome back, Pouria'}</h1><p>{fa?'هر چیزی که الان برایت مهم است، همین‌جاست.':'Everything important right now, in one place.'}</p></div><div className="actions"><button onClick={()=>setDark(v=>!v)}>{dark?<Sun/>:<Moon/>}</button><button className="notify"><Bell/><b/></button><button className="profile">P</button></div></header>

        <section className="now cinematic">
          <div className="now-bg"><div className="grid-floor"/><div className="halo h1"/><div className="halo h2"/><div className="signal-core"><Sparkles/></div><div className="orbit o1"/><div className="orbit o2"/><div className="scan"/></div>
          <div className="now-copy"><span className="eyebrow white"><Activity/> NOW · {fa?'مهم‌ترین اتفاق':'CURRENT SIGNAL'}</span><h2>{fa?'سفارش تو در حال حرکت است':'Your order is moving'}</h2><p>{fa?'Telegram Premium · 12 ماه':'Telegram Premium · 12 Months'}</p><div className="order-line"><span className="done"/><span className="done"/><span className="live"/><span/><span/></div><div className="order-labels"><small>{fa?'پرداخت':'Paid'}</small><small>{fa?'بررسی':'Review'}</small><small>{fa?'تحویل':'Delivery'}</small><small>{fa?'تکمیل':'Complete'}</small></div><div className="now-footer"><span>#PT-10492 · {fa?'در حال پردازش':'Processing'} · 67%</span><button>{fa?'مشاهده سفارش':'View order'} <ArrowUpRight size={14}/></button></div></div>
          <div className="now-side"><div className="pulse-card"><span>SIGNAL</span><strong>ACTIVE</strong><small>delivery pipeline</small></div><div className="pulse-card"><span>ETA</span><strong>~ 04m</strong><small>{fa?'زمان تقریبی':'estimated'}</small></div></div>
        </section>

        <section className="utility-row">
          <article className="wallet-card"><div className="card-top"><span>{fa?'کیف پول':'Wallet'}</span><WalletCards size={15}/></div><div className="balance">{balance}</div><div className="currency"><button className={currency==='USD'?'active':''} onClick={()=>setCurrency('USD')}>USD</button><button className={currency==='IRT'?'active':''} onClick={()=>setCurrency('IRT')}>IRT</button></div><div className="wallet-actions"><button><Plus/> {fa?'شارژ':'Add funds'}</button><button><ArrowDownLeft/> {fa?'برداشت':'Withdraw'}</button></div></article>
          <article className="actions-card"><div className="card-top"><span>{fa?'دسترسی سریع':'Quick actions'}</span><Zap size={15}/></div><div className="quick-actions"><button><Plus/><span>{fa?'شارژ کیف پول':'Add funds'}</span><ArrowUpRight/></button><button><ArrowDownLeft/><span>{fa?'برداشت':'Withdraw'}</span><ArrowUpRight/></button><button><Package/><span>{fa?'سفارش‌های من':'My orders'}</span><ArrowUpRight/></button></div></article>
        </section>

        <section className="world"><div className="section-head"><div><span className="eyebrow"><Sparkles/> YOUR WORLD</span><h2>{fa?'دنیای تو':'Your world'}</h2></div><button>{fa?'نمایش همه':'View all'} <ArrowUpRight/></button></div><div className="world-grid"><article className="world-card"><div className="world-icon cyan"><Compass/></div><span>RECENTLY VIEWED</span><strong>Steam Wallet · 20 USD</strong><small>{fa?'۳۸ دقیقه پیش':'38 min ago'}</small><button>{fa?'ادامه':'Continue'} <ArrowUpRight/></button></article><article className="world-card"><div className="world-icon violet"><Heart/></div><span>SAVED</span><strong>3 {fa?'محصول ذخیره شده':'saved items'}</strong><small>{fa?'یک پیشنهاد جدید داری':'one new match'}</small><button>{fa?'مشاهده':'Open'} <ArrowUpRight/></button></article><article className="world-card"><div className="world-icon amber"><Ticket/></div><span>CONTINUE</span><strong>{fa?'Telegram Premium':'Telegram Premium'}</strong><small>{fa?'آخرین بازدید':'last viewed yesterday'}</small><button>{fa?'ادامه خرید':'Continue'} <ArrowUpRight/></button></article></div></section>

        <section className="discover"><div className="section-head"><div><span className="eyebrow"><Compass/> DISCOVER</span><h2>{fa?'برای تو انتخاب شده':'Picked for you'}</h2></div><button>{fa?'کشف بیشتر':'Explore more'} <ArrowUpRight/></button></div><div className="product-grid">{products.map((p,i)=><article key={p.title} className={`product ${p.tone}`}><div className="product-art"><div className="art-shape"/><button className="heart" onClick={()=>setLiked(v=>v.includes(i)?v.filter(x=>x!==i):[...v,i])}><Heart size={15} fill={liked.includes(i)?'currentColor':'none'}/></button><div className="hover-cta">{fa?'مشاهده محصول':'View product'} <ArrowUpRight size={14}/></div></div><div className="product-copy"><span>{p.tag}</span><h3>{p.title}</h3><small>{p.sub}</small><div><strong>{p.price}</strong><button>{fa?'خرید':'Buy'} <ArrowUpRight size={13}/></button></div></div></article>)}</div></section>

        <section className="lower"><article className="journey"><div className="section-head"><div><span className="eyebrow"><Activity/> YOUR JOURNEY</span><h2>{fa?'مسیر تو':'Your journey'}</h2></div></div><div className="timeline">{activities.map(([name,meta,time],i)=><div className="activity" key={name}><i className={i===1?'live':''}/><div><b>{fa?(["شارژ کیف پول","سفارش PT-10492 ایجاد شد","Steam Wallet دیده شد","Session امن شد"][i]):name}</b><span>{meta}</span></div><time>{time}</time></div>)}</div></article><article className="support"><div className="support-art"><Headphones size={46}/><span>SUPPORT SIGNAL</span></div><div className="support-copy"><span className="eyebrow"><Ticket/> SUPPORT</span><h2>{fa?'کمکی لازم داری؟':'Need help?'}</h2><p>{fa?'اگر چیزی طبق انتظار پیش نرفت، از اینجا مستقیم با پشتیبانی در تماس شو.':'Something not right? Reach support without leaving your Hub.'}</p><div><button>{fa?'تیکت جدید':'New ticket'} <ArrowUpRight/></button><small>2 {fa?'تیکت باز':'open tickets'}</small></div></div></article></section>
        <footer><span>POORITEL HUB · CUSTOMER PREVIEW</span><span>{fa?'آخرین به‌روزرسانی · همین الان':'Updated · just now'}</span></footer>
      </main>
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
