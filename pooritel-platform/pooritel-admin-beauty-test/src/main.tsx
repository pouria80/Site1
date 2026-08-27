import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Lang = 'en' | 'fa';

type Action = {
  id: string;
  type: string;
  label: string;
  detail: string;
  amount?: string;
  age: string;
  tone: 'cyan' | 'sage' | 'amber' | 'rose';
};

const actions: Action[] = [
  { id: 'SR-182', type: 'SELLER', label: 'NightFox wants to become a seller', detail: '2 identity documents • 42 prior orders • Trust 96', age: '18m', tone: 'cyan' },
  { id: 'LS-491', type: 'LISTING', label: 'CS2 DreamHollow needs approval', detail: '1 item • $84.50 • ownership proof attached', age: '41m', tone: 'amber' },
  { id: 'PT-10492', type: 'ORDER', label: 'Order PT-10492 is waiting for approval', detail: 'Ali Reza → NightFox • Payment confirmed', amount: '$84.50', age: '12m', tone: 'sage' },
  { id: 'WD-1182', type: 'PAYOUT', label: 'Seller withdrawal request', detail: 'NightFox • destination verified • payout pending', amount: '$84.50', age: '27m', tone: 'rose' },
];

const labels = {
  en: {
    control: 'OPERATIONS AURORA',
    title: 'PooriTel Command Surface',
    subtitle: 'A visual experiment for decisions, money and trust — not another dashboard grid.',
    overview: 'Overview',
    live: 'LIVE SYSTEM',
    decision: 'DECISION QUEUE',
    money: 'PLATFORM MONEY',
    activity: 'SIGNAL STREAM',
    trust: 'TRUST PULSE',
    open: 'Open workspace',
    inspect: 'Inspect',
    wallet: 'Available commission',
    pending: 'Pending settlement',
    reserve: 'Refund reserve',
    today: 'Today',
    all: 'All systems nominal',
    lang: 'FA',
  },
  fa: {
    control: 'آرورا عملیات',
    title: 'سطح فرمان PooriTel',
    subtitle: 'یک آزمایش بصری برای تصمیم، پول و اعتماد؛ نه یک داشبورد تکراری.',
    overview: 'نمای کلی',
    live: 'سیستم زنده',
    decision: 'صف تصمیم‌ها',
    money: 'منابع مالی پلتفرم',
    activity: 'جریان سیگنال',
    trust: 'نبض اعتماد',
    open: 'باز کردن محیط',
    inspect: 'بررسی',
    wallet: 'کمیسیون در دسترس',
    pending: 'تسویه در انتظار',
    reserve: 'ذخیره بازگشت وجه',
    today: 'امروز',
    all: 'همه سیستم‌ها عادی',
    lang: 'EN',
  },
};

function App() {
  const [lang, setLang] = useState<Lang>('en');
  const [dark, setDark] = useState(false);
  const [active, setActive] = useState<Action | null>(null);
  const t = labels[lang];

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.documentElement.lang = lang;
  }, [dark, lang]);

  const heroMetric = useMemo(() => ({ value: '$24.8K', delta: '+18.4%' }), []);

  return (
    <div className="aurora-app" dir="ltr">
      <div className="aurora-noise" />
      <div className="aurora-glow glow-a" />
      <div className="aurora-glow glow-b" />
      <div className="aurora-glow glow-c" />

      <aside className="rail">
        <div className="rail-brand">
          <span className="rail-orb">P</span>
          <span className="rail-word">POORITEL</span>
        </div>
        <div className="rail-stack">
          <button className="rail-btn active"><span>◈</span><small>{t.overview}</small></button>
          <button className="rail-btn"><span>◉</span><small>{lang === 'fa' ? 'فروشندگان' : 'Sellers'}</small></button>
          <button className="rail-btn"><span>◇</span><small>{lang === 'fa' ? 'آگهی‌ها' : 'Listings'}</small></button>
          <button className="rail-btn"><span>◎</span><small>{lang === 'fa' ? 'معاملات' : 'Orders'}</small></button>
          <button className="rail-btn"><span>₿</span><small>{lang === 'fa' ? 'مالی' : 'Finance'}</small></button>
          <button className="rail-btn"><span>✦</span><small>{lang === 'fa' ? 'اعتماد' : 'Trust'}</small></button>
        </div>
        <div className="rail-bottom">
          <button className="mini-btn" onClick={() => setLang(lang === 'en' ? 'fa' : 'en')}>{t.lang}</button>
          <button className="mini-btn" onClick={() => setDark(v => !v)}>{dark ? '☼' : '◐'}</button>
        </div>
      </aside>

      <main className="surface">
        <header className="topbar">
          <div className="crumbs"><span>POORITEL /</span><strong>{t.overview}</strong></div>
          <div className="top-actions">
            <div className="status-pill"><i />{t.live}</div>
            <button className="top-btn">⌕</button>
            <button className="top-btn">◔<em>3</em></button>
            <button className="profile-pill"><span>P</span><b>Pouria</b></button>
          </div>
        </header>

        <section className="command-hero">
          <div className="hero-copy">
            <span className="eyebrow">{t.control}</span>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
            <div className="hero-actions">
              <button className="primary-cta">{t.open}<span>↗</span></button>
              <span className="soft-note">{t.today} · 12:48 UTC</span>
            </div>
          </div>
          <div className="orb-core" aria-hidden="true">
            <div className="orbit orbit-1"><span /></div>
            <div className="orbit orbit-2"><span /></div>
            <div className="orbit orbit-3"><span /></div>
            <div className="core-ring"><b>{heroMetric.value}</b><span>GMV / 24h</span></div>
          </div>
          <div className="hero-side-stat">
            <span>Momentum</span>
            <strong>{heroMetric.delta}</strong>
            <small>vs previous day</small>
          </div>
        </section>

        <section className="metric-strip">
          <Metric label="Seller approvals" value="17" note="6 urgent" tone="cyan" />
          <Metric label="Listing reviews" value="9" note="2 flagged" tone="amber" />
          <Metric label="Orders to approve" value="6" note="$166.49 total" tone="sage" />
          <Metric label="Withdrawals" value="$3.42K" note="11 requests" tone="rose" />
        </section>

        <section className="workspace-grid">
          <div className="decision-lane glass-panel">
            <div className="panel-head">
              <div><span className="eyebrow">{t.decision}</span><h2>What needs you now</h2></div>
              <span className="queue-count">04</span>
            </div>
            <div className="decision-stack">
              {actions.map((item, index) => (
                <button key={item.id} className={`decision-item ${index === 0 ? 'featured' : ''}`} onClick={() => setActive(item)}>
                  <span className={`signal ${item.tone}`}><i /></span>
                  <span className="decision-copy"><b>{item.type}</b><strong>{item.label}</strong><small>{item.detail}</small></span>
                  <span className="decision-meta">{item.amount && <em>{item.amount}</em>}<small>{item.age}</small><span>↗</span></span>
                </button>
              ))}
            </div>
          </div>

          <div className="money-zone glass-panel">
            <div className="panel-head"><div><span className="eyebrow">{t.money}</span><h2>Where the platform stands</h2></div><span className="ledger-dot">● ledger synced</span></div>
            <div className="money-orbit">
              <div className="money-ring ring-outer" />
              <div className="money-ring ring-inner" />
              <div className="money-center"><span>PLATFORM WALLET</span><strong>$8,420.50</strong><small>available</small></div>
              <div className="money-node node-top"><span>Commission</span><b>$1,284</b></div>
              <div className="money-node node-right"><span>Settlement</span><b>$3,420</b></div>
              <div className="money-node node-bottom"><span>Reserve</span><b>$620</b></div>
            </div>
            <div className="money-foot"><span>Collected today <b>+$428.50</b></span><span>Net commission <b>+$116.50</b></span></div>
          </div>

          <div className="signal-zone glass-panel">
            <div className="panel-head"><div><span className="eyebrow">{t.activity}</span><h2>Quiet signals</h2></div><span className="signal-live">LIVE</span></div>
            <div className="signal-chart"><div className="wave w1"/><div className="wave w2"/><div className="wave w3"/></div>
            <div className="signal-list">
              <SignalItem time="12:47" title="Payment confirmation" detail="PT-10492" tone="sage" />
              <SignalItem time="12:43" title="Identity package uploaded" detail="Mina K" tone="cyan" />
              <SignalItem time="12:41" title="Listing price drift detected" detail="CS2 DreamHollow" tone="amber" />
              <SignalItem time="12:37" title="Withdrawal destination verified" detail="NightFox" tone="rose" />
            </div>
          </div>
        </section>

        <section className="footer-grid">
          <div className="trust-panel glass-panel">
            <div className="panel-head"><div><span className="eyebrow">{t.trust}</span><h2>Trust pulse</h2></div><span className="trust-score">94.8</span></div>
            <div className="trust-bar"><span style={{ width: '94.8%' }} /></div>
            <div className="trust-facts"><div><span>Verified sellers</span><b>1,284</b></div><div><span>Open disputes</span><b>03</b></div><div><span>Risk cases</span><b>02</b></div></div>
          </div>
          <div className="attention-panel glass-panel">
            <span className="eyebrow">ATTENTION MAP</span>
            <div className="attention-cells">
              <span className="cell hot">Payouts<strong>11</strong></span>
              <span className="cell warm">Listings<strong>9</strong></span>
              <span className="cell cool">KYC<strong>4</strong></span>
              <span className="cell safe">Orders<strong>24</strong></span>
            </div>
            <small>{t.all}</small>
          </div>
        </section>
      </main>

      {active && <Modal item={active} lang={lang} close={() => setActive(null)} />}
    </div>
  );
}

function Metric({ label, value, note, tone }: { label: string; value: string; note: string; tone: string }) {
  return <div className={`metric tone-${tone}`}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>;
}

function SignalItem({ time, title, detail, tone }: { time: string; title: string; detail: string; tone: string }) {
  return <div className="signal-row"><time>{time}</time><i className={`tiny-dot ${tone}`} /><div><b>{title}</b><span>{detail}</span></div></div>;
}

function Modal({ item, lang, close }: { item: Action; lang: Lang; close: () => void }) {
  const fa = lang === 'fa';
  return <div className="modal-backdrop" onClick={close}><div className="modal-card" onClick={e => e.stopPropagation()}>
    <button className="modal-close" onClick={close}>×</button>
    <span className={`modal-tag ${item.tone}`}>{item.type}</span>
    <h2>{fa ? 'فضای تصمیم PooriTel' : 'PooriTel decision workspace'}</h2>
    <h3>{item.label}</h3>
    <p>{item.detail}</p>
    <div className="evidence-grid"><div><span>ID</span><b>{item.id}</b></div><div><span>AGE</span><b>{item.age}</b></div><div><span>STATUS</span><b>Pending review</b></div></div>
    <div className="modal-actions"><button className="quiet" onClick={close}>{fa ? 'بعداً' : 'Later'}</button><button className="approve" onClick={close}>{fa ? 'بررسی و تأیید' : 'Inspect & approve'} <span>↗</span></button></div>
  </div></div>;
}

createRoot(document.getElementById('root')!).render(<App />);
