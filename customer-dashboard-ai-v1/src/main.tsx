import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight, Bell, ChevronLeft, ChevronRight, Clock3, Gamepad2,
  LayoutDashboard, Moon, Plus, Search, Settings, ShieldCheck,
  ShoppingBag, Sparkles, Sun, UserRound, WalletCards, Zap, Tag
} from 'lucide-react';
import './style.css';

const orders = [
  { id: 'PT-10492', name: 'Telegram Premium · 12 months', amount: '$21.90', status: 'در حال بررسی' },
  { id: 'PT-10471', name: 'Steam Wallet · 20 USD', amount: '$20.45', status: 'تکمیل شده' },
  { id: 'PT-10466', name: 'Dota 2 Item Bundle', amount: '$15.00', status: 'تکمیل شده' },
];

const nav = [
  { label: 'نمای کلی', icon: LayoutDashboard },
  { label: 'کیف پول', icon: WalletCards },
  { label: 'سفارش‌ها', icon: ShoppingBag },
  { label: 'پروفایل', icon: UserRound },
  { label: 'امنیت و احراز', icon: ShieldCheck },
  { label: 'تنظیمات', icon: Settings },
];

function App() {
  const [open, setOpen] = useState(true);
  const [usd, setUsd] = useState(true);
  const [active, setActive] = useState(0);
  const [dark, setDark] = useState(false);

  return (
    <div className={`app ${open ? 'open' : 'closed'} ${dark ? 'theme-dark' : 'theme-light'}`}>
      <aside className="side">
        <div className="brand">
          <div className="brandmark"><Sparkles size={19} /></div>
          <div><b>PooriTel</b><span>PLAYER SPACE</span></div>
        </div>
        <button className="collapse" onClick={() => setOpen(v => !v)} aria-label="باز و بسته کردن منو">
          {open ? <ChevronRight /> : <ChevronLeft />}
        </button>

        <div className="side-search"><Search size={15} /><span>جستجو در داشبورد</span></div>

        <nav>
          <div className="label">WORKSPACE</div>
          {nav.slice(0, 3).map(({ label, icon: Icon }, i) => (
            <button key={label} className={active === i ? 'active' : ''} onClick={() => setActive(i)}>
              <Icon /><span>{label}</span>{active === i && <i />}
            </button>
          ))}
          <div className="label">ACCOUNT</div>
          {nav.slice(3).map(({ label, icon: Icon }, i) => (
            <button key={label} className={active === i + 3 ? 'active' : ''} onClick={() => setActive(i + 3)}>
              <Icon /><span>{label}</span>{active === i + 3 && <i />}
            </button>
          ))}
        </nav>

        <div className="side-footer-note"><Zap size={13} /><span>POORITEL ENGINE · ONLINE</span></div>
        <div className="user-mini"><div className="avatar">P</div><div className="user-copy"><b>Pouria</b><span>customer@example.com</span></div></div>
      </aside>

      <main>
        <header>
          <div className="welcome">
            <div className="eyebrow"><Gamepad2 /> PLAYER HUB · CUSTOMER</div>
            <h1>سلام پوریا، آماده‌ای؟</h1>
            <p>مهم‌ترین وضعیت حساب و خریدهایت همین‌جا جمع شده.</p>
          </div>
          <div className="header-actions">
            <button className="icon-btn theme-toggle" onClick={() => setDark(v => !v)} aria-label="تغییر تم">
              {dark ? <Sun /> : <Moon />}
            </button>
            <button className="icon-btn notify"><Bell /><b /></button>
            <button className="profile-dot">P</button>
          </div>
        </header>

        <section className="hero">
          <div className="hero-placeholder-art" aria-hidden="true">
            <div className="placeholder-core"><Sparkles /></div>
            <div className="placeholder-ring ring-a" />
            <div className="placeholder-ring ring-b" />
            <span className="placeholder-tag tag-a">WALLET CORE</span>
            <span className="placeholder-tag tag-b">READY</span>
          </div>
          <div className="hero-glow glow-a" /><div className="hero-glow glow-b" /><div className="scan" />
          <div className="hero-copy">
            <span className="kicker">AVAILABLE BALANCE</span>
            <div className="balance-row">
              <strong>{usd ? '$124.50' : '۱۲٬۴۵۰٬۰۰۰'}</strong>
              <div className="currency-switch">
                <button className={usd ? 'on' : ''} onClick={() => setUsd(true)}>USD</button>
                <button className={!usd ? 'on' : ''} onClick={() => setUsd(false)}>IRT</button>
              </div>
            </div>
            <p>یک موجودی نمایشی · قابل تغییر توسط خودت</p>
            <div className="hero-actions">
              <button className="primary"><Plus /> شارژ کیف پول</button>
              <button className="ghost"><ArrowUpRight /> برداشت</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="status-chip"><span className="live-dot" /> SYSTEM ONLINE</div>
            <div className="ring r1" /><div className="ring r2" /><div className="ring r3" />
            <div className="core"><Sparkles /></div>
            <div className="orbit-label l1">SECURE</div><div className="orbit-label l2">READY</div>
          </div>
        </section>

        <section className="mini-grid">
          <div className="mini-card compact-balance"><div className="mini-icon cyan"><WalletCards /></div><div><span>AVAILABLE</span><b>{usd ? '$124.50' : '۱۲٬۴۵۰٬۰۰۰'}</b></div><small>+ شارژ سریع</small></div>
          <div className="mini-card"><div className="mini-icon purple"><ShoppingBag /></div><div><span>ACTIVE ORDERS</span><b>03</b></div><small>۱ مورد نیازمند بررسی</small></div>
          <div className="mini-card"><div className="mini-icon amber"><Tag /></div><div><span>MARKET PICK</span><b>−20%</b></div><small>پیشنهاد ویژه امروز</small></div>
        </section>

        <section className="quick">
          <div className="section-title"><span>دسترسی سریع</span><small>۳ عملیات اصلی</small></div>
          <div className="quick-grid">
            <button className="qcard q1"><div className="qicon"><Plus /></div><div><b>شارژ کیف پول</b><span>افزایش موجودی</span></div><ArrowUpRight /></button>
            <button className="qcard q2"><div className="qicon"><ArrowUpRight /></div><div><b>برداشت</b><span>درخواست برداشت</span></div><ArrowUpRight /></button>
            <button className="qcard q3"><div className="qicon"><ShoppingBag /></div><div><b>سفارش‌های من</b><span>۳ سفارش اخیر</span></div><ArrowUpRight /></button>
          </div>
        </section>

        <section className="grid">
          <div className="panel orders">
            <div className="panel-head"><div><span className="eyebrow"><Clock3 /> LATEST DROP</span><h2>آخرین سفارش‌ها</h2></div><button className="text-btn">همه سفارش‌ها <ArrowUpRight /></button></div>
            {orders.map(o => <div className="order" key={o.id}><div className="product-icon"><ShoppingBag /></div><div className="od"><b>{o.name}</b><span>#{o.id}</span></div><div className="oa"><b>{o.amount}</b><span className={o.status === 'تکمیل شده' ? 'done' : 'pending'}>{o.status}</span></div></div>)}
          </div>
          <div className="panel promo">
            <div className="promo-art"><span className="promo-glow" /><div className="promo-mark">P</div></div>
            <div className="promo-copy"><span className="eyebrow"><Sparkles /> FEATURED DROP</span><h2>Telegram Premium</h2><p>یک پیشنهاد ویژه برای خرید بعدی‌ات.</p><div className="promo-bottom"><strong>تا ۲۰٪ تخفیف</strong><button className="promo-btn">مشاهده محصول <ArrowUpRight /></button></div></div>
          </div>
        </section>

        <footer><span>آخرین به‌روزرسانی · همین الان</span><span>POORITEL · CUSTOMER SPACE</span></footer>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
