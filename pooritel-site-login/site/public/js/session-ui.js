const SESSION_ENDPOINT = '/api/auth/me';

export async function getCurrentUser() {
  try {
    const response = await fetch(SESSION_ENDPOINT, { credentials: 'include', cache: 'no-store' });
    if (!response.ok) return null;
    const data = await response.json();
    return data?.authenticated ? data.user : null;
  } catch {
    return null;
  }
}

export async function signOut() {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  window.location.assign('/auth/');
}

autoSessionUI();

async function autoSessionUI() {
  const user = await getCurrentUser();
  document.dispatchEvent(new CustomEvent('pooritel:session', { detail: { user } }));
}
