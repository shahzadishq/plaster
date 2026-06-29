/**
 * Pläster CMS — password auth backend (Cloudflare Worker)
 * ───────────────────────────────────────────────────────
 * Lets you log into the Decap admin (/admin) with YOUR OWN PASSWORD instead of
 * a GitHub account. When the password is correct, the worker hands Decap a
 * GitHub token (stored as a Worker secret) so your content edits are committed
 * to the repository on your behalf. The token never appears in the page source
 * and is only released after a correct password.
 *
 * This is a STANDALONE worker — it is NOT the website. Deploy it separately
 * (see README.md). Do NOT connect it to the website's Vite build.
 *
 * Required Worker secrets (Settings → Variables and Secrets → "Encrypt"):
 *   CMS_PASSWORD   the password you will type to log in
 *   GITHUB_TOKEN   a fine-grained GitHub Personal Access Token, scoped to the
 *                  repo shahzadishq/plaster, with:
 *                    • Contents  → Read and write
 *                    • Metadata  → Read-only  (granted automatically)
 *
 * Then in public/admin/config.yml set:
 *   backend.base_url: https://<this-worker-subdomain>.workers.dev
 */

const PROVIDER = "github";

/** Constant-time-ish comparison so a wrong password can't be guessed by timing. */
function safeEqual(a, b) {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  const len = Math.max(ab.length, bb.length);
  let diff = ab.length ^ bb.length;
  for (let i = 0; i < len; i++) diff |= (ab[i] || 0) ^ (bb[i] || 0);
  return diff === 0;
}

const SECURITY_HEADERS = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "no-referrer",
};

function html(body, init = {}) {
  return new Response(body, {
    ...init,
    headers: { "Content-Type": "text/html; charset=UTF-8", ...SECURITY_HEADERS, ...(init.headers || {}) },
  });
}

function loginPage({ error = "" } = {}) {
  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <title>Pläster · Anmeldung</title>
  <style>
    :root { --brand:#019AEA; --navy:#05397E; }
    * { box-sizing: border-box; }
    body {
      margin: 0; min-height: 100vh; display: grid; place-items: center;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(135deg, var(--navy), var(--brand));
      color: #0f172a; padding: 24px;
    }
    .card {
      width: 100%; max-width: 380px; background: #fff; border-radius: 16px;
      padding: 32px 28px; box-shadow: 0 24px 60px rgba(5,57,126,.35);
    }
    .brand { font-weight: 800; font-size: 22px; color: var(--navy); letter-spacing: -.02em; }
    .brand span { color: var(--brand); }
    p.sub { margin: 6px 0 22px; color: #64748b; font-size: 14px; }
    label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #334155; }
    input {
      width: 100%; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 10px;
      font-size: 15px; outline: none; transition: border-color .15s, box-shadow .15s;
    }
    input:focus { border-color: var(--brand); box-shadow: 0 0 0 3px rgba(1,154,234,.2); }
    button {
      width: 100%; margin-top: 18px; padding: 12px 16px; border: 0; border-radius: 10px;
      background: var(--brand); color: #fff; font-size: 15px; font-weight: 700; cursor: pointer;
      transition: background .15s;
    }
    button:hover { background: var(--navy); }
    .error { margin: 0 0 16px; padding: 10px 12px; border-radius: 10px; background: #fef2f2; color: #b91c1c; font-size: 14px; }
  </style>
</head>
<body>
  <form class="card" method="post" autocomplete="off">
    <div class="brand">Pläster<span>.</span> CMS</div>
    <p class="sub">Bitte geben Sie Ihr Passwort ein, um Inhalte zu bearbeiten.</p>
    ${error ? `<p class="error">${error}</p>` : ""}
    <label for="password">Passwort</label>
    <input id="password" name="password" type="password" required autofocus />
    <button type="submit">Anmelden</button>
  </form>
</body>
</html>`;
}

function handoffPage() {
  // The token is injected server-side just before sending; see fetch handler.
  return (token) => `<!doctype html>
<html lang="de">
<head><meta charset="utf-8" /><meta name="robots" content="noindex" /><title>Anmeldung …</title></head>
<body>
  <p style="font-family:system-ui,sans-serif;color:#334155">Anmeldung abgeschlossen – dieses Fenster kann geschlossen werden.</p>
  <script>
    (function () {
      var message = "authorization:${PROVIDER}:success:" + JSON.stringify({ token: ${JSON.stringify(
        token
      )}, provider: "${PROVIDER}" });
      function receive(e) {
        if (window.opener) window.opener.postMessage(message, e.origin);
        window.removeEventListener("message", receive, false);
      }
      window.addEventListener("message", receive, false);
      if (window.opener) window.opener.postMessage("authorizing:${PROVIDER}", "*");
    })();
  </script>
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/auth") {
      if (!env.CMS_PASSWORD || !env.GITHUB_TOKEN) {
        return new Response(
          "Worker not configured. Set the CMS_PASSWORD and GITHUB_TOKEN secrets.",
          { status: 500, headers: SECURITY_HEADERS }
        );
      }

      if (request.method === "GET") {
        return html(loginPage());
      }

      if (request.method === "POST") {
        const form = await request.formData();
        const password = String(form.get("password") || "");

        // Blunt brute-force attempts with a small fixed delay.
        await new Promise((r) => setTimeout(r, 400));

        if (!safeEqual(password, env.CMS_PASSWORD)) {
          return html(loginPage({ error: "Falsches Passwort. Bitte erneut versuchen." }), { status: 401 });
        }

        return html(handoffPage()(env.GITHUB_TOKEN));
      }

      return new Response("Method not allowed", { status: 405, headers: SECURITY_HEADERS });
    }

    return new Response("Pläster CMS auth worker is running. Decap should call /auth.", {
      headers: { "Content-Type": "text/plain; charset=UTF-8", ...SECURITY_HEADERS },
    });
  },
};
