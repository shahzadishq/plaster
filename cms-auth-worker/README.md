# Pläster CMS — auth + save worker (Cloudflare)

This **standalone** Cloudflare Worker is the backend for the custom Pläster admin
at `/admin`. You log in with **your own password**; on success the worker sets a
signed, HttpOnly session cookie. Saving content commits the JSON files (and, later,
images) to the GitHub repo using a server-side token that **never reaches the
browser** — more secure than a git-based editor.

It is **not** the website. Deploy it once as its own worker.

---

## What you need first

1. **A password** for logging in (anything you like).
2. **A GitHub token** for saving edits:
   - GitHub → Settings → Developer settings → Personal access tokens →
     **Fine-grained tokens → Generate**.
   - Repository access: only `shahzadishq/plaster`.
   - Permissions: **Contents → Read and write** (Metadata read-only is automatic).
   - Copy the `github_pat_…` value.
3. **A session secret** — any long random string (e.g. from a password manager).

---

## Deploy

### Dashboard (no tools)
1. Cloudflare → Workers & Pages → **Create → Worker**, name it `plaster-cms-auth`,
   deploy, then **Edit code**.
2. Paste the contents of [`worker.js`](./worker.js), **Save and deploy**.
3. **Settings → Variables and Secrets** → add three **secrets** (Encrypt):
   - `CMS_PASSWORD` → your password
   - `GITHUB_TOKEN` → the `github_pat_…`
   - `SESSION_SECRET` → your long random string

### Wrangler CLI (from this folder)
```bash
cd cms-auth-worker
npx wrangler deploy
npx wrangler secret put CMS_PASSWORD
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put SESSION_SECRET
```

---

## Connect the admin to the worker

The admin already points at `https://plaster-cms-auth.shahzadishaq.workers.dev`
(see `src/admin/config.ts`). If your worker URL differs, update `WORKER_BASE`
there and push.

Optional plain-text variable on the worker: `ALLOWED_ORIGIN` — defaults to
`https://plaster.shahzadishaq.workers.dev`. Set it if your site origin changes.

---

## API

| Method & path     | Auth        | Purpose                                   |
|-------------------|-------------|-------------------------------------------|
| `POST /api/login` | password    | Verify password, set session cookie       |
| `GET  /api/me`    | cookie      | `{ authenticated: boolean }`              |
| `POST /api/logout`| —           | Clear the session cookie                  |
| `POST /api/save`  | cookie      | Commit `{ files:[{path,content}] }` to GitHub |

The cookie is `HttpOnly; Secure; SameSite=None` so the admin (a different origin)
can use it via `fetch(..., { credentials: "include" })`.

---

## Use it
1. Visit `https://plaster.shahzadishaq.workers.dev/admin`.
2. Enter your password.
3. Edit content with live preview, then **Save & publish** — the change is
   committed and the site redeploys (~1 min).

Change the password anytime by updating the `CMS_PASSWORD` secret.
