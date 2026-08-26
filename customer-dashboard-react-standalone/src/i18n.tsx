import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import faRaw from './locales/fa.json?raw';
import enRaw from './locales/en.json?raw';

export type Lang = 'fa' | 'en';
export type Dir = 'rtl' | 'ltr';
type Section = Record<string, string>;
type Dict = Record<string, Section>;

const fa = JSON.parse(faRaw) as Dict;
const en = JSON.parse(enRaw) as Dict;
const dicts: Record<Lang, Dict> = { fa, en };

interface I18nValue { lang: Lang; dir: Dir; t: (key: string, vars?: Record<string, string | number>) => string; setLang: (l: Lang) => void; }
const I18nContext = createContext<I18nValue>({ lang: 'fa', dir: 'rtl', t: (k) => k, setLang: () => {} });

function readStored(): Lang {
  try { return localStorage.getItem('pt-lang') === 'en' ? 'en' : 'fa'; } catch { return 'fa'; }
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStored);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    try { localStorage.setItem('pt-lang', lang); } catch { /* ignore */ }
  }, [lang]);
  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const t = useCallback((key: string, vars?: Record<string, string | number>) => {
    const [section, name] = key.split('.');
    const lookup = (d: Dict) => d?.[section]?.[name];
    let str = lookup(dicts[lang]) ?? lookup(fa) ?? lookup(en) ?? key;
    if (vars) for (const k of Object.keys(vars)) str = str.replace(`{${k}}`, String(vars[k]));
    return str;
  }, [lang]);
  const value = useMemo(() => ({ lang, dir: lang === 'fa' ? 'rtl' : 'ltr' as Dir, t, setLang }), [lang, t, setLang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
export function useI18n() { return useContext(I18nContext); }
