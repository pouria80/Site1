import React,{createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react';
type Lang='fa'|'en'; type Ctx={lang:Lang;dir:'rtl'|'ltr';setLang:(l:Lang)=>void};
const I18nContext=createContext<Ctx>({lang:'fa',dir:'rtl',setLang:()=>{}});
export function I18nProvider({children}:{children:React.ReactNode}){const [lang,setLang]=useState<Lang>('fa');useEffect(()=>{document.documentElement.lang=lang;document.documentElement.dir=lang==='fa'?'rtl':'ltr'},[lang]);const value=useMemo(()=>({lang,dir:lang==='fa'?'rtl':'ltr',setLang}),[lang]);return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>}
export function useI18n(){return useContext(I18nContext)}
