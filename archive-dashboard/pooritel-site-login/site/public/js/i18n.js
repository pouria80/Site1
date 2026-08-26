let translations = {};
let currentLanguage = localStorage.getItem('pooritel-language') || 'fa';

export async function initI18n() {
  translations = {
    fa: await load('/locales/fa.json'),
    en: await load('/locales/en.json')
  };

  if (!translations[currentLanguage]) currentLanguage = 'fa';
  applyLanguage(currentLanguage, false);
}

async function load(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`);
  }
  return response.json();
}

function getValue(dictionary, path) {
  return path
    .split('.')
    .reduce((value, key) => value?.[key], dictionary);
}

export function t(key) {
  return getValue(translations[currentLanguage], key) ?? key;
}

export function getLanguage() {
  return currentLanguage;
}

export function applyLanguage(language, persist = true) {
  if (!translations[language]) return;

  currentLanguage = language;

  if (persist) {
    localStorage.setItem('pooritel-language', language);
  }

  const isFa = language === 'fa';

  document.documentElement.lang = language;
  document.documentElement.dir = isFa ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = t(element.dataset.i18n);
    element.textContent = value;
  });

  document.querySelectorAll('[data-i18n-html]').forEach((element) => {
    const value = t(element.dataset.i18nHtml);
    element.innerHTML = value;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  updateLanguageControl();
  document.title = t('meta.title');

  window.dispatchEvent(
    new CustomEvent('pooritel:languagechange', {
      detail: { language }
    })
  );
}

function updateLanguageControl() {
  const currentFlag = document.getElementById('currentFlag');
  const currentName = document.getElementById('currentLanguageName');
  const targetFlag = document.getElementById('targetFlag');
  const targetName = document.getElementById('targetLanguageName');
  const switcher = document.getElementById('langSwitch');
  const option = document.getElementById('langTargetOption');

  if (!currentFlag || !currentName || !targetFlag || !targetName || !switcher || !option) {
    return;
  }

  const isFa = currentLanguage === 'fa';
  const targetLanguage = isFa ? 'en' : 'fa';

  currentFlag.textContent = isFa ? '🇮🇷' : '🇺🇸';
  currentName.textContent = isFa ? 'فارسی' : 'English';

  targetFlag.textContent = isFa ? '🇺🇸' : '🇮🇷';
  targetName.textContent = isFa ? 'English' : 'فارسی';

  option.dataset.lang = targetLanguage;
  option.setAttribute('aria-label', isFa ? 'Switch to English' : 'تغییر به فارسی');

  switcher.setAttribute('aria-expanded', 'false');
  switcher.setAttribute(
    'aria-label',
    isFa ? 'انتخاب زبان' : 'Select language'
  );
}

export function setLanguage(language) {
  applyLanguage(language);
  closeLanguageMenu();
}

export function toggleLanguageMenu() {
  const dropdown = document.getElementById('langDropdown');
  const trigger = document.getElementById('langSwitch');

  if (!dropdown || !trigger) return;

  const willOpen = !dropdown.classList.contains('open');
  dropdown.classList.toggle('open', willOpen);
  trigger.setAttribute('aria-expanded', String(willOpen));
}

export function closeLanguageMenu() {
  const dropdown = document.getElementById('langDropdown');
  const trigger = document.getElementById('langSwitch');

  if (!dropdown || !trigger) return;

  dropdown.classList.remove('open');
  trigger.setAttribute('aria-expanded', 'false');
}
