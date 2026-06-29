# Decap OAuth proxy (Cloudflare Worker)

A **standalone** GitHub-OAuth proxy for the Decap CMS admin. It is **not** the
website — do **not** connect it to the `plaster` repo or a Vite build.

## Deploy (dashboard, no Git / no wrangler)
1. Cloudflare → **Workers & Pages → Create → Workers → Create Worker**. Name it
   e.g. `plaster-cms-auth`. Click **Deploy**, then **Edit code**.
2. Delete the sample, paste the contents of [`worker.js`](./worker.js), **Deploy**.
3. **Settings → Variables and Secrets** → add:
   - `GITHUB_CLIENT_ID` (text)
   - `GITHUB_CLIENT_SECRET` (secret)
   Both come from your GitHub OAuth App. Re-deploy after adding.
4. Copy the Worker URL: `https://plaster-cms-auth.<sub>.workers.dev`.

## GitHub OAuth App
GitHub → Settings → Developer settings → **OAuth Apps → New**:
- Homepage URL: `https://shahzadishq.github.io/plaster/`
- Authorization callback URL: `https://plaster-cms-auth.<sub>.workers.dev/callback`

## Wire it up
In `public/admin/config.yml`:
```yaml
backend:
  name: github
  repo: shahzadishq/plaster
  branch: main
  base_url: https://plaster-cms-auth.<sub>.workers.dev
```
Then open `https://shahzadishq.github.io/plaster/admin/` → **Login with GitHub**.

> If you already created a Git-connected Cloudflare project pointing at the
> `plaster` repo, delete it — that one was trying to deploy the website by mistake.
