import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Lang = 'fa'|'en';
const t = {
  fa:{brand:'PooriTel',sub:'LIVING MARKETPLACE',title:'مرکز فرمان زنده',desc:'پول، اعتماد و عملیات؛ همگی در یک میدان زنده.',open:'باز کردن',store:'فروشگاه',gmv:'حجم معاملات امروز',orders:'سفارش‌های باز',seller:'درخواست فروشندگی',payout:'برداشت‌های در انتظار',wallet:'کیف پول پلتفرم',signals:'سیگنال‌های زنده',health:'سلامت بازار',actions:'صف تصمیم',theme:'تم',language:'زبان'},
  en:{brand:'PooriTel',sub:'LIVING MARKETPLACE',title:'Living control center',desc:'Money, trust and marketplace operations in one responsive field.',open:'Open',store:'Store',gmv:'GMV today',orders:'Open orders',seller:'Seller requests',payout:'Pending payouts',wallet:'Platform wallet',signals:'Live signals',health:'Market health',actions:'Decision queue',theme:'Theme',language:'Language'}
} as const;

const items=[['seller','17','Seller applications','درخواست‌های فروشندگی'],['listing','09','New listings','آگهی‌های جدید'],['order','06','Trade approvals','تأیید معاملات'],['payout','11','Withdrawals','برداشت‌ها'],['kyc','04','Verification','احراز هویت']];

function App(){
 const [lang,setLang]=useState<Lang>('en'); const [dark,setDark]=useState(false); const [active,setActive]=useState('seller'); const [modal,setModal]=useState<string|null>(null); const c=t[lang];
 const stats=useMemo(()=>[[c.gmv,'$12,840','+18.4%'],[c.orders,'24','7 action'],[c.seller,'17','6 urgent'],[c.payout,'$3,420','11 requests']],[c]);
 return <div className={`app ${dark?'dark':''}`}>
  <div className="ambient a1"/><div className="ambient a2"/><div className="grain"/>
  <header className="topbar glass"><div className="brand"><span className="brand-orb">P</span><div><b>{c.brand}</b><small>{c.sub}</small></div></div><div className="status"><i/> {lang==='fa'?'سیستم پایدار':'Systems nominal'} <span>• {lang==='fa'?'زنده':'LIVE'}</span></div><div className="tools"><button onClick={()=>setLang(lang==='en'?'fa':'en')}>{lang==='en'?'فا':'EN'}</button><button onClick={()=>setDark(v=>!v)}>{dark?'☼':'◐'}</button><button className="store">{c.store} ↗</button></div></header>
  <aside className="rail glass"><div className="rail-dot active"/><div className="rail-dot"/><div className="rail-dot"/><div className="rail-dot"/><div className="rail-spacer"/><div className="rail-dot"/></aside>
  <main className="main">
   <section className="hero"><div><span className="eyebrow">POORITEL / {lang==='fa'?'عملیات':'OPERATIONS'}</span><h1>{c.title}</h1><p>{c.desc}</p></div><button className="orb-action" onClick={()=>setModal('overview')}><span className="orb-core"/><span>{c.open}</span></button></section>
   <section className="metrics">{stats.map((s,i)=><article className={`metric glass m${i}`} key={s[0]}><span>{s[0]}</span><strong>{s[1]}</strong><small>{s[2]}</small><i/></article>)}</section>
   <section className="field">
    <div className="field-map"><div className="gridline g1"/><div className="gridline g2"/><div className="gridline g3"/><div className="gridline g4"/>
      <div className="orbit o1"/><div className="orbit o2"/><div className="orbit o3"/>
      <div className="core glass"><div className="core-inner"><small>{lang==='fa'?'هسته بازار':'MARKET CORE'}</small><b>$12.8K</b><span>{lang==='fa'?'GMV امروز':'GMV TODAY'}</span></div></div>
      {items.map((it,i)=><button key={it[0]} className={`node n${i} ${active===it[0]?'active':''}`} onClick={()=>{setActive(it[0]);setModal(it[0])}}><strong>{it[1]}</strong><span>{lang==='fa'?it[3]:it[2]}</span><em>↗</em></button>)}
      <div className="energy e1"/><div className="energy e2"/><div className="energy e3"/>
    </div>
    <aside className="signal-panel glass"><div className="panel-title"><div><span className="eyebrow">{c.signals}</span><h2>Pulse</h2></div><span className="live-chip">LIVE</span></div><div className="wave">{Array.from({length:24}).map((_,i)=><i key={i} style={{height:`${10+(i%7)*7}px`}}/> )}</div><div className="signal-list"><div><b>12:41</b><span>{lang==='fa'?'آگهی ثبت شد':'Listing submitted'}</span><em>NightFox</em></div><div><b>12:38</b><span>{lang==='fa'?'برداشت درخواست شد':'Payout requested'}</span><em>$84.50</em></div><div><b>12:34</b><span>{lang==='fa'?'احراز بروزرسانی شد':'Identity updated'}</span><em>Mina K</em></div><div><b>12:29</b><span>{lang==='fa'?'معامله تأیید شد':'Trade approved'}</span><em>PT-10492</em></div></div></aside>
   </section>
   <section className="bottom">
    <div className="decision glass"><div className="panel-title"><div><span className="eyebrow">{c.actions}</span><h2>{lang==='fa'?'چه چیزهایی منتظر شما هستند؟':'What needs your decision?'}</h2></div><span className="count">47</span></div>{items.map((it,i)=><button className={`decision ${active===it[0]?'active':''}`} key={it[0]} onClick={()=>setModal(it[0])}><small>0{i+1}</small><span className={`glyph g${i}`}>{['↗','▦','□','$','✓'][i]}</span><div><b>{lang==='fa'?it[3]:it[2]}</b><em>{lang==='fa'?'اطلاعات و شواهد آماده است':'Evidence is ready for review'}</em></div><strong>{it[1]}</strong><i>→</i></button>)}</div>
    <div className="stack"><div className="wallet glass"><div className="panel-title"><div><span className="eyebrow">{c.wallet}</span><h2>{lang==='fa'?'منابع مالی':'Money field'}</h2></div><span className="wallet-ring"/></div><div className="wallet-main"><div className="wallet-orb"><b>$8.42K</b><span>{lang==='fa'?'در دسترس':'AVAILABLE'}</span></div><div className="wallet-bars"><div><span>{lang==='fa'?'کمیسیون':'Commission'}</span><b>$1,284</b></div><div><span>{lang==='fa'?'تسویه':'Settlement'}</span><b>$3,420</b></div><div><span>{lang==='fa'?'ذخیره':'Reserve'}</span><b>$620</b></div></div></div></div><div className="health glass"><div className="panel-title"><div><span className="eyebrow">{c.health}</span><h2>Signal board</h2></div></div><div className="health-row"><span>{lang==='fa'?'پرداخت‌ها':'Payments'}</span><b>99.8%</b><i className="good"/></div><div className="health-row"><span>{lang==='fa'?'احراز هویت':'Verification'}</span><b>96%</b><i className="good"/></div><div className="health-row"><span>{lang==='fa'?'اختلاف‌ها':'Disputes'}</span><b>0.7%</b><i className="warn"/></div></div></div>
   </section>
  </main>
  {modal&&<div className="modal-bg" onMouseDown={()=>setModal(null)}><div className="modal glass" onMouseDown={e=>e.stopPropagation()}><button className="x" onClick={()=>setModal(null)}>×</button><span className="eyebrow">DECISION WORKSPACE</span><h2>{lang==='fa'?'فضای تصمیم':'Decision workspace'}</h2><p>{lang==='fa'?'پیش‌نمایش، شواهد، مبلغ و تاریخچه در یک محل.':'Preview, evidence, amount and history in one place.'}</p><div className="evidence"><div><span>ACCOUNT</span><b>{active==='order'?'PT-10492':'NightFox'}</b></div><div><span>AMOUNT</span><b>{active==='payout'?'$84.50':'$20.00'}</b></div><div><span>RISK</span><b className="accent">LOW</b></div><div><span>STATUS</span><b>{lang==='fa'?'آماده بررسی':'READY'}</b></div></div><div className="preview"><div className="preview-art"><span>P</span></div><div><span className="eyebrow">PREVIEW / EVIDENCE</span><h3>{active==='listing'?'CS2 DreamHollow':active==='order'?'CS2 DreamHollow · $84.50':'Seller application'}</h3><small>{lang==='fa'?'اطلاعات تصمیم‌گیری کامل است.':'Decision-critical context is complete.'}</small></div></div><div className="modal-actions"><button>Hold</button><button>Reject</button><button className="primary">{lang==='fa'?'تأیید':'Approve'} ✓</button></div></div></div>}
 </div>
}

createRoot(document.getElementById('root')!).render(<App/>);
