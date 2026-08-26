let dictionaries = {};
let currentLanguage = localStorage.getItem('pooritel-language') || 'fa';

async function loadLocale(language){
  const response = await fetch(`/locales/${language}.json`, {cache:'no-store'});
  if(!response.ok) throw new Error(`Failed to load ${language}.json`);
  return response.json();
}

function getValue(object, path){
  return path.split('.').reduce((acc,key)=>acc?.[key], object);
}

function t(key){
  return getValue(dictionaries[currentLanguage], key) ?? key;
}

function applyLanguage(language){
  if(!dictionaries[language]) return;
  currentLanguage = language;
  localStorage.setItem('pooritel-language', language);
  const isFa = language === 'fa';
  document.documentElement.lang = language;
  document.documentElement.dir = isFa ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{ el.textContent = t(el.dataset.i18n); });
  document.title = t('meta.productTitle');
  document.getElementById('currentFlag').textContent = isFa ? '🇮🇷' : '🇺🇸';
  document.getElementById('currentLanguageName').textContent = isFa ? 'فارسی' : 'English';
  document.getElementById('targetFlag').textContent = isFa ? '🇺🇸' : '🇮🇷';
  document.getElementById('targetLanguageName').textContent = isFa ? 'English' : 'فارسی';
  updatePrices();
}

function updatePrices(){
  const isFa = currentLanguage === 'fa';
  document.querySelectorAll('.price-value').forEach(el=>{
    const fa = Number(el.dataset.priceFa);
    const en = Number(el.dataset.priceEn);
    if(isFa){
      el.textContent = new Intl.NumberFormat('fa-IR').format(fa);
    }else{
      el.textContent = `$${en.toFixed(2)}`;
    }
  });
  const badge = document.getElementById('currencyBadge');
  if(badge) badge.textContent = isFa ? 'تومان' : 'USD';
}

function closeMenu(){
  const menu = document.getElementById('languageMenu');
  const trigger = document.getElementById('langTrigger');
  menu.classList.remove('open');
  trigger.setAttribute('aria-expanded','false');
}

async function init(){
  dictionaries.fa = await loadLocale('fa');
  dictionaries.en = await loadLocale('en');
  if(!dictionaries[currentLanguage]) currentLanguage = 'fa';
  applyLanguage(currentLanguage);

  const trigger = document.getElementById('langTrigger');
  const menu = document.getElementById('languageMenu');
  const option = document.getElementById('languageOption');

  trigger.addEventListener('click',()=>{
    const open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    trigger.setAttribute('aria-expanded', String(open));
  });

  option.addEventListener('click',()=>{
    applyLanguage(currentLanguage === 'fa' ? 'en' : 'fa');
    closeMenu();
  });

  document.addEventListener('click',(event)=>{
    if(!event.target.closest('.language-wrap')) closeMenu();
  });

  document.getElementById('buyButton').addEventListener('click',()=>{
    alert(t('product.demoBuyMessage'));
  });
}

init().catch(error=>console.error('Product page init failed:', error));
