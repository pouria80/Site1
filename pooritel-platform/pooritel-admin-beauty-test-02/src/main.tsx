import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Lang = 'en'|'fa';
type ModalKind = 'seller'|'listing'|'order'|'payout'|'kyc'|null;

const copy = {
  en: {
    eyebrow:'POORITEL CONSTELLATION', title:'Operations, connected.', subtitle:'A living map of money, trust and marketplace decisions.',
    decisions:'DECISIONS', wallet:'PLATFORM RESERVE', activity:'SIGNAL STREAM', trust:'TRUST FIELD',
    seller:'Seller application', listing:'New listing', order:'Trade approval', payout:'Withdrawal', kyc:'Verification',
    inspect:'Inspect', open:'Open', healthy:'Healthy', live:'LIVE', store:'Open store ↗', search:'Search...',
    available:'Available', commission:'Commission', reserve:'Reserve', payouts:'Payouts',
    sellerDesc:'Identity + buyer history + intended listing', listingDesc:'Preview + price + ownership evidence', orderDesc:'Buyer + seller + item + settlement', payoutDesc:'Amount + account + risk controls', kycDesc:'Documents + risk + history'
  },
  fa: {
    eyebrow:'صورت فلکی پُری‌تل', title:'عملیات، متصل.', subtitle:'نقشه‌ای زنده از پول، اعتماد و تصمیم‌های مارکت‌پلیس.',
    decisions:'تصمیم‌ها', wallet:'ذخیره پلتفرم', activity:'جریان سیگنال', trust:'میدان اعتماد',
    seller:'درخواست فروشندگی', listing:'آگهی جدید', order:'تأیید معامله', payout:'برداشت', kyc:'احراز هویت',
    inspect:'بررسی', open:'باز کردن', healthy:'سالم', live:'زنده', store:'ورود به فروشگاه ↗', search:'جستجو...',
    available:'موجودی', commission:'کمیسیون', reserve:'ذخیره', payouts:'برداشت‌ها',
    sellerDesc:'هویت + سابقه خرید + آگهی پیشنهادی', listingDesc:'پیش‌نمایش + قیمت + مدرک مالکیت', orderDesc:'خریدار + فروشنده + آیتم + تسویه', payoutDesc:'مبلغ + حساب + کنترل ریسک', kycDesc:'مدارک + ریسک + سابقه'
  }
} as const;

const queue = [
  { id:'seller', tone:'cyan', title:['Seller application','درخواست فروشندگی'], desc:['Identity + buyer history + intended listing','هویت + سابقه خرید + آگهی پیشنهادی'], count:'17' },
  { id:'listing', tone:'violet', title:['New listing','آگهی جدید'], desc:['Preview + price + ownership evidence','پیش‌نمایش + قیمت + مدرک مالکیت'], count:'09' },
  { id:'order', tone:'amber', title:['Trade approval','تأیید معامله'], desc:['Buyer + seller + item + settlement','خریدار + فروشنده + آیتم + تسویه'], count:'06' },
  { id:'payout', tone:'mint', title:['Withdrawal','برداشت'], desc:['Amount + account + risk controls','مبلغ + حساب + کنترل ریسک'], count:'11' },
  { id:'kyc', tone:'rose', title:['Verification','احراز هویت'], desc:['Documents + risk + history','مدارک + ریسک + سابقه'], count:'04' },
];

function Orb({active, onClick}:{active:boolean; onClick:()=>void}){
  return <button className={`core-orb ${active?'active':''}`} onClick={onClick} aria-label="Open overview">
    <span className="core-glow"/><span className="core-ring r1"/><span className="core-ring r2"/><span className="core-ring r3"/>
    <span className="core-dot"/><span className="core-value">$12.8K</span><small>GMV TODAY</small>
  </button>
}

function App(){
  const [lang,setLang] = useState<Lang>('en');
  const [dark,setDark] = useState(true);
  const [active,setActive] = useState('overview');
  const [modal,setModal] = useState<ModalKind>(null);
  const t = copy[lang];
  const flow = useMemo(()=>[
    {label: t.available, value:'$8,420', icon:'◉'},
    {label: t.commission, value:'$1,284', icon:'✦'},
    {label: t.reserve, value:'$620', icon:'◇'},
  ],[t]);
  return <div className={`app ${dark?'dark':'light'}`}>
    <div className="noise"/>
    <header className="top">
      <div className="brand"><span className="brand-mark">P</span><div><b>PooriTel</b><small>CONSTELLATION ADMIN</small></div></div>
      <div className="top-center"><span className="status-dot"/> {t.healthy} <i>·</i> <span>{t.live}</span></div>
      <div className="top-actions"><input placeholder={t.search}/><button onClick={()=>setLang(lang==='en'?'fa':'en')}>{lang==='en'?'فا':'EN'}</button><button onClick={()=>setDark(v=>!v)}>{dark?'☀':'◐'}</button><button className="store">{t.store}</button></div>
    </header>

    <aside className="left-rail">
      <div className="rail-label">SYSTEM</div>
      {['Overview','Marketplace','Orders','Finance','Verification','Risk','Support'].map((x,i)=><button key={x} className={active===x.toLowerCase()?'rail-btn active':''} onClick={()=>setActive(x.toLowerCase())}><span>{['◉','⌘','□','◈','✓','⚡','?'][i]}</span>{x}</button>)}
      <div className="rail-bottom"><div className="mini-avatar">P</div><span>Super Admin</span></div>
    </aside>

    <main className="canvas">
      <section className="intro"><div><span className="eyebrow">{t.eyebrow}</span><h1>{t.title}</h1><p>{t.subtitle}</p></div><button className="ghost">⌘ K</button></section>

      <section className="hero-field">
        <div className="starfield"/>
        <div className="orbit-layer orbit-a"/><div className="orbit-layer orbit-b"/><div className="orbit-layer orbit-c"/>
        <div className="link-line l1"/><div className="link-line l2"/><div className="link-line l3"/>
        <Orb active={active==='overview'} onClick={()=>setActive('overview')}/>
        <button className="node node-a" onClick={()=>setModal('seller')}><b>17</b><span>{t.seller}</span></button>
        <button className="node node-b" onClick={()=>setModal('listing')}><b>09</b><span>{t.listing}</span></button>
        <button className="node node-c" onClick={()=>setModal('order')}><b>06</b><span>{t.order}</span></button>
        <button className="node node-d" onClick={()=>setModal('payout')}><b>11</b><span>{t.payout}</span></button>
        <button className="node node-e" onClick={()=>setModal('kyc')}><b>04</b><span>{t.kyc}</span></button>
        <div className="field-caption"><span>POORITEL / LIVE OPS</span><b>Connected marketplace state</b></div>
      </section>

      <section className="lower-grid">
        <div className="decision-panel glass">
          <div className="panel-head"><div><span className="eyebrow">{t.decisions}</span><h2>Next actions</h2></div><span className="count-chip">47 OPEN</span></div>
          <div className="decision-list">{queue.map((q,i)=><button key={q.id} className={`decision-row ${q.tone}`} onClick={()=>setModal(q.id as ModalKind)}><span className="row-index">0{i+1}</span><div className="row-icon">{['↗','▦','□','$','✓'][i]}</div><div className="row-copy"><b>{lang==='fa'?q.title[1]:q.title[0]}</b><small>{lang==='fa'?q.desc[1]:q.desc[0]}</small></div><strong>{q.count}</strong><em>→</em></button>)}</div>
        </div>

        <div className="side-stack">
          <div className="wallet glass"><div className="panel-head"><div><span className="eyebrow">{t.wallet}</span><h2>Money field</h2></div><span className="pulse">●</span></div><div className="wallet-core"><div className="wallet-orb"><span>$8.4K</span><small>AVAILABLE</small></div><div className="wallet-lines">{flow.map(x=><div key={x.label}><span>{x.icon} {x.label}</span><b>{x.value}</b></div>)}</div></div></div>
          <div className="signal glass"><div className="panel-head"><div><span className="eyebrow">{t.activity}</span><h2>Recent signals</h2></div></div><div className="signal-wave"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div><div className="signal-list"><div><b>12:41</b><span>Listing submitted</span><em>NightFox</em></div><div><b>12:38</b><span>Payout requested</span><em>$84.50</em></div><div><b>12:34</b><span>Identity updated</span><em>Mina K</em></div></div></div>
        </div>
      </section>

      <section className="trust-strip glass"><div><span className="eyebrow">{t.trust}</span><h2>Trust field</h2></div><div className="trust-metric"><span>GLOBAL</span><b>94.7</b><small>SAFE</small></div><div className="trust-bar"><i style={{width:'94.7%'}}/></div><div className="trust-marks"><span>Seller risk 1.8%</span><span>Disputes 0.7%</span><span>KYC completion 96%</span></div></section>
    </main>

    {modal&&<Modal kind={modal} lang={lang} close={()=>setModal(null)}/>} 
  </div>
}

function Modal({kind,lang,close}:{kind:Exclude<ModalKind,null>;lang:Lang;close:()=>void}){
  const names:Record<string,[string,string]>={seller:['Seller application','درخواست فروشندگی'],listing:['New listing','آگهی جدید'],order:['Trade approval','تأیید معامله'],payout:['Withdrawal review','بررسی برداشت'],kyc:['Verification review','بررسی احراز هویت']};
  const [en,fa]=names[kind]; const title=lang==='fa'?fa:en;
  return <div className="modal-backdrop" onMouseDown={close}><div className="glass-modal" onMouseDown={e=>e.stopPropagation()}><button className="close" onClick={close}>×</button><span className="eyebrow">DECISION WORKSPACE</span><h2>{title}</h2><p className="modal-sub">{lang==='fa'?'شواهد، تاریخچه و اطلاعات تصمیم در یک فضای واحد.':'Evidence, history and decision context in one workspace.'}</p><div className="evidence-grid"><div><span>ACCOUNT</span><b>{kind==='seller'?'NightFox':'PT-10492'}</b></div><div><span>RISK</span><b className="accent">{kind==='kyc'?'MEDIUM':'LOW'}</b></div><div><span>EVIDENCE</span><b>{kind==='kyc'?'2 documents':'Preview ready'}</b></div><div><span>LAST ACTION</span><b>12 min ago</b></div></div><div className="preview-pane"><div className="preview-orb">P</div><div><span className="eyebrow">PREVIEW / EVIDENCE</span><h3>{kind==='listing'?'CS2 DreamHollow':kind==='order'?'CS2 DreamHollow · $84.50':'Verification package'}</h3><p>{lang==='fa'?'تمام اطلاعات لازم برای تصمیم اینجا جمع شده است.':'All decision-critical context is assembled here.'}</p></div></div><div className="modal-actions"><button className="secondary">{lang==='fa'?'نگه‌داشتن':'Hold'}</button><button className="danger">{lang==='fa'?'رد':'Reject'}</button><button className="primary">{lang==='fa'?'تأیید':'Approve'} ✓</button></div></div></div>
}

createRoot(document.getElementById('root')!).render(<App/>);
