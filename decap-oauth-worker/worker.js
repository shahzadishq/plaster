/**
 * Decap CMS — GitHub OAuth proxy (Cloudflare Worker)
 *
 * This is a STANDALONE worker. It is NOT the website. Do not connect it to the
 * plaster repo / Vite build. Deploy it by pasting this code into a new Worker in
 * the Cloudflare dashboard (Workers & Pages → Create → Worker → Edit code).
 *
 * Required Worker variables (Settings → Variables and Secrets):
 *   GITHUB_CLIENT_ID      (plain text)  — from your GitHub OAuth App
 *   GITHUB_CLIENT_SECRET  (secret)      — from your GitHub OAuth App
 *
 * GitHub OAuth App settings:
 *   Homepage URL:               https://shahzadishq.github.io/plaster/
 *   Authorization callback URL: https://<your-worker-subdomain>.workers.dev/callback
 *
 * Then in public/admin/config.yml:
 *   backend.base_url: https://<your-worker-subdomain>.workers.dev
 */

const GITHUB_AUTHORIZE = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN = "https://github.com/login/oauth/access_token";
const PROVIDER = "github";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1) Decap opens this; we send the user to GitHub to authorize.
    if (url.pathname === "/auth") {
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        redirect_uri: `${url.origin}/callback`,
        scope: url.searchParams.get("scope") || "repo",
        state: crypto.randomUUID(),
      });
      return Response.redirect(`${GITHUB_AUTHORIZE}?${params.toString()}`, 302);
    }

    // 2) GitHub redirects back here with ?code=...; we exchange it for a token
    //    and hand it back to the Decap admin window.
    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) return new Response("Missing ?code", { status: 400 });

      const res = await fetch(GITHUB_TOKEN, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });
      const data = await res.json();

      const result = data.access_token
        ? `success:${JSON.stringify({ token: data.access_token, provider: PROVIDER })}`
        : `error:${JSON.stringify(data)}`;
      const message = `authorization:${PROVIDER}:${result}`;

      const html = `<!doctype html><html><body>
        <p>Anmeldung abgeschlossen – dieses Fenster kann geschlossen werden.</p>
        <script>
          (function () {
            function receive(e) {
              window.opener && window.opener.postMessage(${JSON.stringify(message)}, e.origin);
              window.removeEventListener("message", receive, false);
            }
            window.addEventListener("message", receive, false);
            window.opener && window.opener.postMessage("authorizing:${PROVIDER}", "*");
          })();
        </script>
      </body></html>`;
      return new Response(html, { headers: { "Content-Type": "text/html; charset=UTF-8" } });
    }

    return new Response("Decap OAuth proxy is running. Decap should call /auth.", {
      headers: { "Content-Type": "text/plain; charset=UTF-8" },
    });
  },
};
