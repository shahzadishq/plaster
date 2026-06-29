# Pläster CMS — password login (Cloudflare Worker)

This small, **standalone** Cloudflare Worker lets you log into the content editor
at `/admin` with **your own password** instead of a GitHub account. When the
password is correct, the worker hands the editor a GitHub token (stored as a
secret) so your edits are saved straight to the repository.

It is **not** the website. Deploy it as its own worker, once. After that you only
ever touch the `/admin` page to edit content.

---

## What you need first

1. **A password** you'll use to log in (pick anything — it's separate from GitHub).
2. **A GitHub token** the worker uses to save edits:
   - Go to GitHub → **Settings → Developer settings → Personal access tokens →
     Fine-grained tokens → Generate new token**.
   - **Repository access:** Only select repositories → `shahzadishq/plaster`.
   - **Permissions:** **Contents → Read and write** (Metadata read-only is added
     automatically). Nothing else is needed.
   - Set an expiry you're comfortable with, generate, and copy the token
     (starts with `github_pat_…`). You'll paste it in step 3 below.

---

## Deploy (two ways — pick one)

### Option 1 — Cloudflare dashboard (no tools)

1. Cloudflare dashboard → **Workers & Pages → Create → Worker**. Name it
   `plaster-cms-auth`, deploy the default, then **Edit code**.
2. Delete the sample code, paste the contents of [`worker.js`](./worker.js), **Save and deploy**.
3. Open the worker's **Settings → Variables and Secrets** and add two secrets
   (choose **Encrypt** for each):
   - `CMS_PASSWORD` → the password you chose.
   - `GITHUB_TOKEN` → the `github_pat_…` token from above.
4. Note the worker URL, e.g. `https://plaster-cms-auth.<your-subdomain>.workers.dev`.

### Option 2 — Wrangler CLI (from this folder)

```bash
cd cms-auth-worker
npx wrangler deploy
npx wrangler secret put CMS_PASSWORD   # paste your password when prompted
npx wrangler secret put GITHUB_TOKEN   # paste the github_pat_… token
```

---

## Point the editor at the worker

In [`../public/admin/config.yml`](../public/admin/config.yml), set `base_url` to
your worker URL (no trailing slash):

```yaml
backend:
  name: github
  repo: shahzadishq/plaster
  branch: main
  base_url: https://plaster-cms-auth.<your-subdomain>.workers.dev
```

Commit and push so the live site picks it up.

---

## Use it

1. Visit `https://plaster.shahzadishaq.workers.dev/admin/`.
2. Click **Login** — a Pläster-branded popup asks for your password.
3. Enter the password → you're in. Edit text, colours, FAQs, services and
   sections; **Publish** saves the change to the repo and the site redeploys
   automatically.

To change the password later, update the `CMS_PASSWORD` secret on the worker.
To rotate access, regenerate the GitHub token and update `GITHUB_TOKEN`.

---

## How it works / security notes

- The editor never sees the GitHub token until the **correct password** is
  entered; the token lives only as an encrypted Worker secret and is released
  through the standard login handshake.
- Wrong passwords are rejected with a constant-time comparison and a small fixed
  delay to blunt guessing.
- Anyone can open `/admin`, but without the password they get no token and can't
  read or write anything. If you want to hide the page entirely, you can also put
  **Cloudflare Access** in front of the `/admin` path — optional, not required.
- The GitHub token is scoped to this one repo with contents-only write, so its
  blast radius is limited to editing site content.
