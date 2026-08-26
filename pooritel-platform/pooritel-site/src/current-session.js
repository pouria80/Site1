export async function lookupCurrentSession(request, env) {
  const cookie = request.headers.get('Cookie') || '';
  const entry = cookie.split(';').map((p) => p.trim()).find((p) => p.startsWith('pooritel_session='));
  const token = entry ? entry.slice('pooritel_session='.length) : null;
  if (!token) return Response.json({ success:false, authenticated:false }, { status:401, headers:{'Cache-Control':'no-store'} });
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  const bytes = new Uint8Array(digest); let binary=''; for (const b of bytes) binary += String.fromCharCode(b);
  const tokenHash = btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/g,'');
  const { Client } = await import('pg');
  const client = new Client({ connectionString: env.HYPERDRIVE.connectionString });
  await client.connect();
  try {
    const result = await client.query(`SELECT u.id, u.status, a.email, a.verified_at, s.expires_at FROM user_sessions s JOIN users u ON u.id=s.user_id JOIN auth_accounts a ON a.user_id=u.id AND a.provider='email' WHERE s.session_token_hash=$1 AND s.revoked_at IS NULL AND s.expires_at>NOW() AND u.status='active' ORDER BY s.created_at DESC LIMIT 1`, [tokenHash]);
    const row = result.rows[0];
    if (!row) return Response.json({ success:false, authenticated:false }, { status:401, headers:{'Cache-Control':'no-store'} });
    return Response.json({ success:true, authenticated:true, user:{ id:row.id, email:row.email, emailVerified:Boolean(row.verified_at) }, expiresAt:row.expires_at }, { headers:{'Cache-Control':'no-store'} });
  } finally { await client.end(); }
}
