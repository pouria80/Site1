import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Lang = 'en'|'fa';
type Page = 'overview'|'users'|'sellers'|'sellerRequests'|'products'|'orders'|'finance'|'payouts'|'verification'|'disputes'|'risk'|'support'|'admins'|'audit'|'settings';

const nav:{id:Page;icon:string;en:string;fa:string;group:string;badge?:string}[]=[
 {id:'overview',icon:'⌂',en:'Overview',fa:'نمای کلی',group:'CONTROL'},
 {id:'users',icon:'◌',en:'Users',fa:'کاربران',group:'MARKETPLACE'},
 {id:'sellers',icon:'◈',en:'Sellers',fa:'فروشندگان',group:'MARKETPLACE'},
 {id:'sellerRequests',icon:'↗',en:'Seller Requests',fa:'درخواست فروشندگی',group:'MARKETPLACE',badge:'17'},
 {id:'products',icon:'◇',en:'Listings',fa:'آگهی‌ها',group:'MARKETPLACE',badge:'9'},
 {id:'orders',icon:'□',en:'Orders & Trades',fa:'سفارش‌ها و معاملات',group:'TRANSACTIONS',badge:'6'},
 {id:'finance',icon:'₿',en:'Platform Wallet',fa:'کیف پول پلتفرم',group:'FINANCE'},
 {id:'payouts',icon:'↙',en:'Payouts',fa:'برداشت‌ها',group:'FINANCE',badge:'11'},
 {id:'verification',icon:'✓',en:'Verification / KYC',fa:'احراز هویت',group:'TRUST',badge:'4'},
 {id:'disputes',icon:'!',en:'Disputes & Refunds',fa:'اختلاف‌ها و بازپرداخت',group:'TRUST',badge:'3'},
 {id:'risk',icon:'⚡',en:'Risk & Trust',fa:'ریسک و اعتماد',group:'TRUST',badge:'2'},
 {id:'support',icon:'?',en:'Support & Tickets',fa:'پشتیبانی و تیکت‌ها',group:'SUPPORT',badge:'5'},
 {id:'admins',icon:'◎',en:'Admins & Roles',fa:'ادمین‌ها و دسترسی',group:'SYSTEM'},
 {id:'audit',icon:'⌁',en:'Audit Log',fa:'لاگ حسابرسی',group:'SYSTEM'},
 {id:'settings',icon:'⚙',en:'System Settings',fa:'تنظیمات سیستم',group:'SYSTEM'},
];

const text={
 en:{brand:'POORITEL',sub:'PRISM COMMAND',healthy:'All systems nominal',live:'LIVE',search:'Search anything...',open:'Open store ↗',today:'Today',review:'Review',view:'View',approve:'Approve',hold:'Hold',reject:'Reject'},
 fa:{brand:'پُری‌تل',sub:'مرکز فرمان',healthy:'همه سیستم‌ها پایدار',live:'زنده',search:'جستجو در همه چیز...',open:'ورود به فروشگاه ↗',today:'امروز',review:'بررسی',view:'مشاهده',approve:'تأیید',hold:'توقف',reject:'رد'}
} as const;

const queue=[
 {id:'seller',n:'17',icon:'↗',en:'Seller applications',fa:'درخواست‌های فروشندگی',detailEn:'Identity + history + intended listing',detailFa:'هویت + سابقه + آگهی پیشنهادی',page:'sellerRequests' as Page},
 {id:'listing',n:'09',icon:'◇',en:'Listings awaiting approval',fa:'آگهی‌های منتظر تأیید',detailEn:'Preview + price + ownership evidence',detailFa:'پیش‌نمایش + قیمت + مدرک مالکیت',page:'products' as Page},
 {id:'trade',n:'06',icon:'□',en:'Trades awaiting approval',fa:'معاملات منتظر تأیید',detailEn:'Item + amount + settlement point',detailFa:'آگهی + مبلغ + نقطه تسویه',page:'orders' as Page},
 {id:'payout',n:'11',icon:'↙',en:'Withdrawal requests',fa:'درخواست‌های برداشت',detailEn:'Account + amount + risk controls',detailFa:'حساب + مبلغ + کنترل ریسک',page:'payouts' as Page},
 {id:'kyc',n:'04',icon:'✓',en:'Verification reviews',fa:'پرونده‌های احراز هویت',detailEn:'Documents + risk + history',detailFa:'مدارک + ریسک + سابقه',page:'verification' as Page},
];

function App(){
 const [lang,setLang]=useState<Lang>('en');
 const [dark,setDark]=useState(false);
 const [page,setPage]=useState<Page>('overview');
 const [collapsed,setCollapsed]=useState(false);
 const [modal,setModal]=useState<string|null>(null);
 const t=text[lang];
 const groups=[...new Set(nav.map(n=>n.group))];
 const title=nav.find(n=>n.id===page);
 const go=(p:Page)=>setPage(p);
 return <div className={`app ${dark?'dark':''} ${collapsed?'sidebar-collapsed':''}`}>
   <div className="aurora a1"/><div className="aurora a2"/><div className="grain"/>
   <aside className="sidebar">
    <div className="brand"><div className="brand-prism">P</div><div className="brand-copy"><b>{t.brand}</b><small>{t.sub}</small></div></div>
    <button className="side-toggle" onClick={()=>setCollapsed(v=>!v)} aria-label="toggle sidebar">{collapsed?'›':'‹'}</button>
    <div className="side-scroll">{groups.map(g=><section key={g} className="nav-group"><div className="group-title">{lang==='fa'?({CONTROL:'کنترل',MARKETPLACE:'مارکت‌پلیس',TRANSACTIONS:'تراکنش‌ها',FINANCE:'مالی',TRUST:'اعتماد و ریسک',SUPPORT:'پشتیبانی',SYSTEM:'سیستم'} as Record<string,string>)[g]:g}</div>{nav.filter(n=>n.group===g).map(n=><button key={n.id} className={`nav-item ${page===n.id?'active':''}`} onClick={()=>go(n.id)}><span className="nav-icon">{n.icon}</span>{!collapsed&&<><span className="nav-text">{lang==='fa'?n.fa:n.en}</span>{n.badge&&<b className="nav-badge">{n.badge}</b>}</>}</button>)}</section>)}</div>
    {!collapsed&&<div className="sidebar-footer"><div className="admin-status"><span/> {t.healthy}</div><div className="admin-user"><div className="avatar">P</div><div><b>Pouria</b><small>Super Admin</small></div></div></div>}
   </aside>
   <main className="main">
     <header className="topbar glass"><div className="crumb"><span>{t.brand}</span><i>/</i><b>{lang==='fa'?(title?.fa||'نمای کلی'):(title?.en||'Overview')}</b></div><div className="top-actions"><div className="searchbox"><span>⌕</span><input placeholder={t.search}/></div><button className="lang-btn" onClick={()=>setLang(lang==='en'?'fa':'en')}>{lang==='en'?'فا':'EN'}</button><button className="icon-btn" onClick={()=>setDark(v=>!v)}>{dark?'☼':'◐'}</button><button className="store-btn" onClick={()=>window.open('/','_blank')}>{t.open}</button></div></header>
     <div className="content">
      {page==='overview'?<Overview lang={lang} t={t} go={go} open={setModal}/>:<Placeholder lang={lang} page={page} t={t} open={setModal}/>} 
     </div>
   </main>
   {modal&&<DecisionModal lang={lang} kind={modal} close={()=>setModal(null)} t={t}/>} 
 </div>
}

function Overview({lang,t,go,open}:{lang:Lang;t:any;go:(p:Page)=>void;open:(s:string)=>void}){
 return <div className="overview">
   <section className="hero-strip"><div><span className="eyebrow">{lang==='fa'?'مرکز فرمان عملیات':'OPERATIONS CONTROL'}</span><h1>{lang==='fa'?'امروز چه چیزی نیاز به تصمیم دارد؟':'What needs your decision today?'}</h1><p>{lang==='fa'?'صف تصمیم‌ها، پول پلتفرم و سلامت بازار در یک نگاه.':'Approval queues, platform money and marketplace health — in one view.'}</p></div><div className="date-pill">{t.today} · 27 Aug 2026</div></section>
   <section className="metric-row">
    {[[lang==='fa'?'حجم معاملات امروز':'GMV today','$12,840','+18.4%','mint'],[lang==='fa'?'سفارش‌های باز':'Open orders','24','7 action','amber'],[lang==='fa'?'کمیسیون ۳۰ روزه':'30d commission','$1,284','+9.2%','cyan'],[lang==='fa'?'موجودی پلتفرم':'Platform available','$8,420','USD','violet']].map((m,i)=><div className={`metric glass ${m[3]}`} key={i}><span>{m[0]}</span><strong>{m[1]}</strong><small>{m[2]}</small><i/></div>)}
   </section>
   <section className="prism-zone glass">
     <div className="prism-copy"><span className="eyebrow">{lang==='fa'?'هسته وضعیت':'STATE PRISM'}</span><h2>{lang==='fa'?'بازار تحت کنترل است':'Marketplace under control'}</h2><p>{lang==='fa'?'این هسته به‌جای نمایش تزئینی، وضعیت تصمیم‌های اصلی را خلاصه می‌کند.':'A visual summary of the decision-critical state, not decorative data.'}</p><div className="prism-status"><span className="status-dot"/><b>94.7</b><small>{lang==='fa'?'امتیاز اعتماد جهانی':'GLOBAL TRUST'}</small></div></div>
     <div className="prism"><div className="prism-plane p1"/><div className="prism-plane p2"/><div className="prism-plane p3"/><div className="prism-core"><b>PT</b><small>{lang==='fa'?'فعال':'ACTIVE'}</small></div><div className="prism-beam b1"/><div className="prism-beam b2"/><div className="prism-beam b3"/><span className="prism-label l1">SELLERS</span><span className="prism-label l2">TRADES</span><span className="prism-label l3">MONEY</span></div>
   </section>
   <section className="workspace-grid">
     <div className="panel glass"><div className="panel-head"><div><span className="eyebrow">{lang==='fa'?'صف تصمیم':'DECISION QUEUE'}</span><h2>{lang==='fa'?'نیازمند اقدام':'Needs your action'}</h2></div><span className="open-chip">47 OPEN</span></div><div className="decision-list">{queue.map(q=><button className="decision" key={q.id} onClick={()=>{go(q.page);open(q.id)}}><span className="decision-icon">{q.icon}</span><div><b>{lang==='fa'?q.fa:q.en}</b><small>{lang==='fa'?q.detailFa:q.detailEn}</small></div><strong>{q.n}</strong><i>→</i></button>)}</div></div>
     <div className="right-stack"><div className="panel glass wallet-panel"><div className="panel-head"><div><span className="eyebrow">{lang==='fa'?'کیف پول پلتفرم':'PLATFORM WALLET'}</span><h2>{lang==='fa'?'پول پلتفرم':'Platform funds'}</h2></div><span className="live-mark">●</span></div><div className="wallet-visual"><div className="wallet-prism"><b>$8.4K</b><small>{lang==='fa'?'در دسترس':'AVAILABLE'}</small></div><div className="wallet-lines"><div><span>{lang==='fa'?'کمیسیون':'Commission'}</span><b>$1,284</b></div><div><span>{lang==='fa'?'تسویه در انتظار':'Pending settlement'}</span><b>$3,420</b></div><div><span>{lang==='fa'?'ذخیره بازپرداخت':'Refund reserve'}</span><b>$620</b></div></div></div></div>
       <div className="panel glass signals"><div className="panel-head"><div><span className="eyebrow">{lang==='fa'?'جریان سیگنال':'SIGNAL STREAM'}</span><h2>{lang==='fa'?'فعالیت مهم':'Important activity'}</h2></div></div><div className="signal-bars">{[22,44,29,56,38,76,52,86,61,46,68,38].map((h,i)=><i key={i} style={{height:h}}/>)}</div><div className="signal-row"><span>12:41</span><b>{lang==='fa'?'آگهی جدید ثبت شد':'New listing submitted'}</b><em>NightFox</em></div><div className="signal-row"><span>12:38</span><b>{lang==='fa'?'درخواست برداشت':'Payout request'}</b><em>$84.50</em></div><div className="signal-row"><span>12:34</span><b>{lang==='fa'?'بروزرسانی احراز':'Verification update'}</b><em>Mina K</em></div></div></div>
   </section>
   <section className="health-strip glass"><div><span className="eyebrow">{lang==='fa'?'سلامت بازار':'MARKET HEALTH'}</span><h2>{lang==='fa'?'شاخص‌های کلیدی':'Core health signals'}</h2></div><div className="health-items"><span><i className="ok"/> {lang==='fa'?'پرداخت‌ها سالم':'Payments healthy'}</span><span><i className="warn"/> {lang==='fa'?'۱۱ برداشت در انتظار':'11 payouts waiting'}</span><span><i className="ok"/> {lang==='fa'?'ریسک پایین':'Risk low'}</span><span><i className="ok"/> {lang==='fa'?'۹۶٪ تکمیل احراز':'96% KYC complete'}</span></div></section>
 </div>
}

function Placeholder({lang,page,t,open}:{lang:Lang;page:Page;t:any;open:(s:string)=>void}){
 const n=nav.find(x=>x.id===page); return <div className="placeholder"><div className="hero-strip"><div><span className="eyebrow">{lang==='fa'?n?.fa:n?.en}</span><h1>{lang==='fa'?'فضای کاری مدیریت':'Management workspace'}</h1><p>{lang==='fa'?'این بخش برای نمایش و بررسی دقیق داده‌ها آماده شده است.':'A decision-focused workspace for detailed operational review.'}</p></div><button className="ghost">⌘ K</button></div><div className="detail-surface glass"><div className="surface-title"><div><span className="eyebrow">{lang==='fa'?'صف بررسی':'REVIEW QUEUE'}</span><h2>{lang==='fa'?'موارد در انتظار تصمیم':'Items awaiting decision'}</h2></div><span className="open-chip">{n?.badge||'12'} OPEN</span></div><div className="rich-list">{Array.from({length:5}).map((_,i)=><button key={i} onClick={()=>open(page)} className="rich-row"><div className="rich-thumb"><span>P</span></div><div className="rich-main"><b>{page==='verification'?'Mina K':page==='orders'?'PT-10492':page==='products'?'CS2 DreamHollow':'NightFox'}</b><small>{lang==='fa'?'مدارک و شواهد برای بررسی':'Evidence package ready for review'}</small></div><div className="rich-meta"><b>{['$84.50','$20.00','96','2 docs','Low'][i]}</b><small>{lang==='fa'?'قابل بررسی':'Reviewable'}</small></div><strong>→</strong></button>)}</div></div></div>
}

function DecisionModal({lang,kind,close,t}:{lang:Lang;kind:string;close:()=>void;t:any}){
 const titles:any={seller:['Seller Application','درخواست فروشندگی'],listing:['Listing Review','بررسی آگهی'],trade:['Trade Approval','تأیید معامله'],payout:['Withdrawal Review','بررسی برداشت'],kyc:['Verification Review','بررسی احراز هویت']};
 const [en,fa]=titles[kind]||['Decision Review','بررسی تصمیم'];
 return <div className="modal-backdrop" onMouseDown={close}><div className="glass-modal" onMouseDown={e=>e.stopPropagation()}><button className="modal-close" onClick={close}>×</button><div className="modal-head"><div><span className="eyebrow">DECISION WORKSPACE</span><h2>{lang==='fa'?fa:en}</h2><p>{lang==='fa'?'تمام شواهد و اطلاعات لازم برای یک تصمیم آگاهانه در یک جا.':'All decision-critical evidence and context in one place.'}</p></div><span className="modal-status">REVIEW</span></div><div className="evidence-layout"><div className="preview-card"><span className="preview-badge">PREVIEW</span><div className="preview-art"><div className="preview-prism">P</div><span>pooritel.app/market/...</span></div><b>{kind==='listing'?'CS2 DreamHollow':kind==='trade'?'CS2 DreamHollow · $84.50':kind==='kyc'?'Identity package':'NightFox'}</b><small>{lang==='fa'?'پیش‌نمایش زنده / شواهد':'Live preview / evidence'}</small></div><div className="evidence-grid">{[[lang==='fa'?'حساب':'Account','NightFox'],[lang==='fa'?'ریسک':'Risk','LOW'],[lang==='fa'?'مبلغ':'Amount',kind==='trade'?'$84.50':'—'],[lang==='fa'?'اسناد':'Documents',kind==='kyc'?'2 / 2':'Ready'],[lang==='fa'?'سابقه خرید':'Buyer history','42 orders'],[lang==='fa'?'کمیسیون':'Commission','$8.45']].map((x:any,i)=><div key={i}><span>{x[0]}</span><b>{x[1]}</b></div>)}</div></div><div className="modal-note"><span>✦</span>{lang==='fa'?'سیستم تمام کنترل‌های اولیه را با موفقیت گذرانده است.':'Automated pre-checks passed successfully.'}</div><div className="modal-actions"><button className="secondary">{t.hold}</button><button className="danger">{t.reject}</button><button className="primary">{t.approve} ✓</button></div></div></div>
}

createRoot(document.getElementById('root')!).render(<App/>);
