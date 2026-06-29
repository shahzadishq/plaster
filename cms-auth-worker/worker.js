/**
 * Pläster CMS — auth + save API (Cloudflare Worker)
 * ──────────────────────────────────────────────────
 * Backend for the custom Pläster admin at /admin. You log in with your own
 * password; on success the worker sets a signed, HttpOnly session cookie. Saving
 * content commits JSON/images to the GitHub repo using a server-side token that
 * NEVER reaches the browser.
 *
 * Standalone worker — NOT the website. Deploy separately (see README.md).
 *
 * Required Worker secrets (Settings → Variables and Secrets → "Encrypt"):
 *   CMS_PASSWORD     the password you type to log in
 *   GITHUB_TOKEN     fine-grained PAT for shahzadishq/plaster, Contents: Read+write
 *   SESSION_SECRET   any long random string (signs the session cookie)
 *
 * Optional plain-text variable:
 *   ALLOWED_ORIGIN   the admin site origin; defaults to
 *                    https://plaster.shahzadishaq.workers.dev
 */

const REPO = "shahzadishq/plaster";
const BRANCH = "main";
const DEFAULT_ORIGIN = "https://plaster.shahzadishaq.workers.dev";
const SESSION_TTL = 60 * 60 * 12; // 12 hours
const COOKIE = "pl_session";

// ── small crypto helpers (HMAC-SHA256 signed token) ────────────────────────
const enc = new TextEncoder();
function b64url(bytes) {
  let s = btoa(String.fromCharCode(...new Uint8Array(bytes)));
  return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlToBytes(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}
async function hmacKey(secret) {
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}
async function sign(payloadObj, secret) {
  const key = await hmacKey(secret);
  const payload = b64url(enc.encode(JSON.stringify(payloadObj)));
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return `${payload}.${b64url(sig)}`;
}
async function verify(token, secret) {
  if (!token || token.indexOf(".") < 0) return null;
  const [payload, sig] = token.split(".");
  const key = await hmacKey(secret);
  const ok = await crypto.subtle.verify("HMAC", key, b64urlToBytes(sig), enc.encode(payload));
  if (!ok) return null;
  try {
    const data = JSON.parse(new TextDecoder().decode(b64urlToBytes(payload)));
    if (data.exp && Date.now() / 1000 > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}
function safeEqual(a, b) {
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  let diff = ab.length ^ bb.length;
  const len = Math.max(ab.length, bb.length);
  for (let i = 0; i < len; i++) diff |= (ab[i] || 0) ^ (bb[i] || 0);
  return diff === 0;
}
function getCookie(req, name) {
  const h = req.headers.get("Cookie") || "";
  const m = h.match(new RegExp("(?:^|; )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[1]) : null;
}

// ── CORS ───────────────────────────────────────────────────────────────────
function corsHeaders(env, req) {
  const allowed = env.ALLOWED_ORIGIN || DEFAULT_ORIGIN;
  const origin = req.headers.get("Origin");
  return {
    "Access-Control-Allow-Origin": origin === allowed ? origin : allowed,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}
function json(body, env, req, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Cache-Control": "no-store",
      ...corsHeaders(env, req),
      ...(init.headers || {}),
    },
  });
}

// ── GitHub commit ────────────────────────────────────────────────────────────
async function ghHeaders(env) {
  return {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "plaster-cms",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}
function toBase64(str) {
  // UTF-8 safe base64 for file contents
  const bytes = enc.encode(str);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
async function putFile(env, path, contentBase64, message) {
  const base = `https://api.github.com/repos/${REPO}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`;
  const headers = await ghHeaders(env);
  // current sha (if file exists)
  let sha;
  const cur = await fetch(`${base}?ref=${BRANCH}`, { headers });
  if (cur.ok) sha = (await cur.json()).sha;
  const res = await fetch(base, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: contentBase64, branch: BRANCH, sha }),
  });
  if (!res.ok) throw new Error(`GitHub PUT ${path} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

// ── handler ──────────────────────────────────────────────────────────────────
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env, request) });
    }

    const configured = env.CMS_PASSWORD && env.GITHUB_TOKEN && env.SESSION_SECRET;

    // POST /api/login {password}
    if (path === "/api/login" && request.method === "POST") {
      if (!configured) return json({ error: "Worker not configured (CMS_PASSWORD/GITHUB_TOKEN/SESSION_SECRET)." }, env, request, { status: 500 });
      const { password } = await request.json().catch(() => ({}));
      await new Promise((r) => setTimeout(r, 350));
      if (!safeEqual(String(password || ""), env.CMS_PASSWORD)) {
        return json({ error: "Falsches Passwort." }, env, request, { status: 401 });
      }
      const token = await sign({ exp: Math.floor(Date.now() / 1000) + SESSION_TTL }, env.SESSION_SECRET);
      return json({ ok: true }, env, request, {
        headers: {
          "Set-Cookie": `${COOKIE}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${SESSION_TTL}`,
        },
      });
    }

    // GET /api/me
    if (path === "/api/me" && request.method === "GET") {
      const data = configured ? await verify(getCookie(request, COOKIE), env.SESSION_SECRET) : null;
      return json({ authenticated: !!data }, env, request);
    }

    // POST /api/logout
    if (path === "/api/logout" && request.method === "POST") {
      return json({ ok: true }, env, request, {
        headers: { "Set-Cookie": `${COOKIE}=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0` },
      });
    }

    // POST /api/save {files:[{path,content,encoding?}], message}
    if (path === "/api/save" && request.method === "POST") {
      if (!configured) return json({ error: "Worker not configured." }, env, request, { status: 500 });
      const session = await verify(getCookie(request, COOKIE), env.SESSION_SECRET);
      if (!session) return json({ error: "Nicht angemeldet." }, env, request, { status: 401 });
      const body = await request.json().catch(() => ({}));
      const files = Array.isArray(body.files) ? body.files : [];
      if (!files.length) return json({ error: "Keine Dateien." }, env, request, { status: 400 });
      const message = body.message || "Inhalt über das Pläster CMS aktualisiert";
      try {
        const results = [];
        for (const f of files) {
          const contentB64 = f.encoding === "base64" ? f.content : toBase64(f.content);
          const r = await putFile(env, f.path, contentB64, message);
          results.push({ path: f.path, commit: r.commit && r.commit.sha });
        }
        return json({ ok: true, results }, env, request);
      } catch (e) {
        return json({ error: String(e && e.message ? e.message : e) }, env, request, { status: 502 });
      }
    }

    return json({ name: "plaster-cms", endpoints: ["/api/login", "/api/me", "/api/logout", "/api/save"] }, env, request);
  },
};
