export async function getCurrentUser(){try{const r=await fetch('/api/auth/me',{credentials:'include',cache:'no-store'});if(!r.ok)return null;const d=await r.json();return d?.authenticated?d.user:null}catch{return null}}
export async function signOut(){try{await fetch('/api/auth/logout',{method:'POST',credentials:'include'})}finally{window.location.assign('/auth/')}}
