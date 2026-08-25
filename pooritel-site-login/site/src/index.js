import { Client } from "pg";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_ACTIVE_SESSIONS = 2;
const PBKDF2_ITERATIONS = 310000;
const COOKIE_NAME = "pooritel_session";

function json(data, status = 200, headers = {}) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function base64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function randomBytes(length) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

async function derivePasswordHash(password, salt, iterations = PBKDF2_ITERATIONS) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256",
    },
    key,
    256
  );

  return new Uint8Array(bits);
}

async function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = await derivePasswordHash(password, salt);

  return [
    "pbkdf2-sha256",
    PBKDF2_ITERATIONS,
    base64Url(salt),
    base64Url(derived),
  ].join("$");
}

async function verifyPassword(password, storedHash) {
  const parts = String(storedHash || "").split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2-sha256") return false;

  const iterations = Number(parts[1]);
  const salt = fromBase64Url(parts[2]);
  const expected = fromBase64Url(parts[3]);
  if (!Number.isInteger(iterations) || iterations < 100000 || !salt.length || !expected.length) {
    return false;
  }

  const derived = await derivePasswordHash(password, salt, iterations);
  if (derived.length !== expected.length) return false;

  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) diff |= derived[i] ^ expected[i];
  return diff === 0;
}

async function createTokenHash(token) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return base64Url(new Uint8Array(digest));
}

function sessionCookie(token, maxAgeSeconds = SESSION_TTL_MS / 1000) {
  return [
    `${COOKIE_NAME}=${token}`,
    "Path=/",
    `Max-Age=${Math.floor(maxAgeSeconds)}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
  ].join("; ");
}

function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}

function getSessionToken(request) {
  const cookie = request.headers.get("Cookie") || "";
  const entry = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  return entry ? entry.slice(COOKIE_NAME.length + 1) : null;
}

async function openDb(env) {
  const client = new Client({
    connectionString: env.HYPERDRIVE.connectionString,
  });
  await client.connect();
  return client;
}

async function createSession(client, userId, inTransaction = false) {
  const token = base64Url(randomBytes(32));
  const tokenHash = await createTokenHash(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  if (!inTransaction) await client.query("BEGIN");
  try {
    await client.query(
      `UPDATE user_sessions
       SET revoked_at = NOW()
       WHERE user_id = $1
         AND revoked_at IS NULL
         AND expires_at > NOW()
         AND id IN (
           SELECT id
           FROM user_sessions
           WHERE user_id = $1
             AND revoked_at IS NULL
             AND expires_at > NOW()
           ORDER BY created_at ASC
           OFFSET $2
         )`,
      [userId, Math.max(0, MAX_ACTIVE_SESSIONS - 1)]
    );

    await client.query(
      `INSERT INTO user_sessions
        (user_id, session_token_hash, device_info, ip_address, expires_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, tokenHash, "browser", null, expiresAt]
    );

    if (!inTransaction) await client.query("COMMIT");
    return { token, expiresAt };
  } catch (error) {
    if (!inTransaction) await client.query("ROLLBACK");
    throw error;
  }
}

async function registerEmail(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: "Invalid JSON body." }, 400);
  }

  const email = normalizeEmail(body?.email);
  const password = String(body?.password || "");

  if (!/^\S+@\S+\.\S{2,}$/.test(email)) {
    return json({ success: false, error: "Invalid email address." }, 400);
  }

  if (password.length < 6) {
    return json({ success: false, error: "Password must be at least 6 characters." }, 400);
  }

  let client;
  try {
    client = await openDb(env);

    const existing = await client.query(
      `SELECT id
       FROM auth_accounts
       WHERE provider = 'email' AND LOWER(email) = $1
       LIMIT 1`,
      [email]
    );

    if (existing.rowCount) {
      return json({ success: false, error: "An account with this email already exists." }, 409);
    }

    const passwordHash = await hashPassword(password);

    await client.query("BEGIN");
    try {
      const userResult = await client.query(
        `INSERT INTO users (status)
         VALUES ('active')
         RETURNING id`
      );
      const userId = userResult.rows[0].id;

      await client.query(
        `INSERT INTO auth_accounts
          (user_id, provider, email, password_hash)
         VALUES ($1, 'email', $2, $3)`,
        [userId, email, passwordHash]
      );

      const session = await createSession(client, userId, true);

      await client.query("COMMIT");

      return json(
        {
          success: true,
          user: {
            id: userId,
            email,
            emailVerified: false,
          },
        },
        201,
        { "Set-Cookie": sessionCookie(session.token) }
      );
    } catch (error) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // Preserve the original error.
      }
      console.error("Register error:", error);
      return json({ success: false, error: "Unable to create account right now." }, 500);
    }
  } catch (error) {
    console.error("Register connection error:", error);
    return json({ success: false, error: "Unable to create account right now." }, 500);
  } finally {
    if (client) {
      try {
        await client.end();
      } catch {
        // Ignore connection close errors.
      }
    }
  }
}

async function loginEmail(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: "Invalid JSON body." }, 400);
  }

  const email = normalizeEmail(body?.email);
  const password = String(body?.password || "");

  let client;
  try {
    client = await openDb(env);
    const result = await client.query(
      `SELECT u.id, u.status, a.password_hash, a.email, a.verified_at
       FROM auth_accounts a
       JOIN users u ON u.id = a.user_id
       WHERE a.provider = 'email'
         AND LOWER(a.email) = $1
       LIMIT 1`,
      [email]
    );

    const account = result.rows[0];
    if (!account || !(await verifyPassword(password, account.password_hash))) {
      return json({ success: false, error: "Invalid email or password." }, 401);
    }

    if (account.status !== "active") {
      return json({ success: false, error: `Account is ${account.status}.` }, 403);
    }

    const session = await createSession(client, account.id, false);

    return json(
      {
        success: true,
        user: {
          id: account.id,
          email: account.email,
          emailVerified: Boolean(account.verified_at),
        },
      },
      200,
      { "Set-Cookie": sessionCookie(session.token) }
    );
  } catch (error) {
    console.error("Login error:", error);
    return json({ success: false, error: "Unable to sign in right now." }, 500);
  } finally {
    if (client) {
      try {
        await client.end();
      } catch {
        // Ignore connection close errors.
      }
    }
  }
}

async function logout(request, env) {
  const token = getSessionToken(request);
  if (!token) return json({ success: true }, 200, { "Set-Cookie": clearSessionCookie() });

  let client;
  try {
    client = await openDb(env);
    const tokenHash = await createTokenHash(token);
    await client.query(
      `UPDATE user_sessions
       SET revoked_at = NOW()
       WHERE session_token_hash = $1
         AND revoked_at IS NULL`,
      [tokenHash]
    );
    return json({ success: true }, 200, { "Set-Cookie": clearSessionCookie() });
  } finally {
    if (client) {
      try {
        await client.end();
      } catch {
        // Ignore connection close errors.
      }
    }
  }
}

async function cryptoTest() {
  const testIterations = 5000;
  const salt = randomBytes(16);
  const start = Date.now();
  try {
    await derivePasswordHash("pooritel-debug-password", salt, testIterations);
    const elapsedMs = Date.now() - start;
    return json({
      success: true,
      test_iterations: testIterations,
      elapsed_ms: elapsedMs,
      production_iterations: PBKDF2_ITERATIONS,
      conclusion: "baseline_ok",
    });
  } catch (error) {
    return json({
      success: false,
      test_iterations: testIterations,
      elapsed_ms: Date.now() - start,
      error_type: error instanceof Error ? error.name : "unknown",
      error_message: error instanceof Error ? error.message : String(error),
    }, 500);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/api/auth/crypto-test") {
      return cryptoTest();
    }

    if (request.method === "POST" && url.pathname === "/api/auth/register") {
      return registerEmail(request, env);
    }

    if (request.method === "POST" && url.pathname === "/api/auth/login") {
      return loginEmail(request, env);
    }

    if (request.method === "POST" && url.pathname === "/api/auth/logout") {
      return logout(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};