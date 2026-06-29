import { useEffect, useMemo, useState } from "react";
import App from "@/App";
import { ContentProvider, defaultContent, type SiteContent } from "@/content/store";
import { asset } from "@/lib/asset";
import { api } from "./api";
import { CONTENT_FILES } from "./config";
import { UI, type Lang } from "./i18n";
import Field, { deepClone } from "./Fields";
import "./admin.css";

type Tab = "pages" | "posts" | "media" | "services" | "faq" | "settings";

const today = () => new Date().toISOString().slice(0, 10);
const slugify = (s: string) =>
  s.toLowerCase().replace(/[äàá]/g, "a").replace(/[öòó]/g, "o").replace(/[üùú]/g, "u").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "neu";
const PAGE_TEMPLATE = { slug: "neue-seite", title: "Neue Seite", nav: false, bodyHtml: "<p>Inhalt …</p>" };
const POST_TEMPLATE = { slug: "neuer-beitrag", title: "Neuer Beitrag", date: today(), cover: "", excerpt: "", bodyHtml: "<p>Inhalt …</p>" };

export default function Admin() {
  const [lang, setLang] = useState<Lang>("de");
  const ui = UI[lang];
  const [auth, setAuth] = useState<"checking" | "out" | "in">("checking");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [busy, setBusy] = useState(false);

  const [draft, setDraft] = useState<SiteContent>(() => deepClone(defaultContent));
  const [saved, setSaved] = useState<SiteContent>(() => deepClone(defaultContent));
  const [tab, setTab] = useState<Tab>("pages");
  const [selPage, setSelPage] = useState<"home" | number>("home");
  const [selPost, setSelPost] = useState<number | null>(null);
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  useEffect(() => {
    api.me().then((r) => setAuth(r.authenticated ? "in" : "out")).catch(() => setAuth("out"));
  }, []);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setLoginErr("");
    try { await api.login(password); setAuth("in"); setPassword(""); }
    catch (err) { setLoginErr(err instanceof Error ? err.message : ui.wrongPassword); }
    finally { setBusy(false); }
  }

  async function doSave() {
    setBusy(true); setStatus(null);
    try {
      const files = Object.entries(CONTENT_FILES).map(([key, path]) => ({
        path,
        content: JSON.stringify(draft[key as keyof SiteContent], null, 2) + "\n",
      }));
      await api.save(files, "Inhalt über das Pläster CMS aktualisiert");
      setSaved(deepClone(draft));
      setStatus({ kind: "ok", msg: ui.saved });
    } catch (err) {
      setStatus({ kind: "err", msg: `${ui.saveError} ${err instanceof Error ? err.message : err}` });
    } finally { setBusy(false); }
  }

  function patch<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  // ── login screen ──────────────────────────────────────────
  if (auth === "checking") {
    return <div className="cms-boot"><img src={asset("assets/Plaster-logo.webp")} alt="Pläster" /></div>;
  }
  if (auth === "out") {
    return (
      <div className="cms-login">
        <form className="cms-login__card" onSubmit={doLogin}>
          <img className="cms-login__logo" src={asset("assets/Plaster-logo.webp")} alt="Pläster" />
          <h1>CMS</h1>
          <label className="cms-label">{ui.password}</label>
          <input className="cms-input" type="password" value={password} autoFocus
            onChange={(e) => setPassword(e.target.value)} />
          {loginErr && <p className="cms-login__err">{loginErr}</p>}
          <button className="cms-btn cms-btn--primary" type="submit" disabled={busy}>
            {busy ? ui.loggingIn : ui.login}
          </button>
          <button type="button" className="cms-lang" onClick={() => setLang(lang === "de" ? "en" : "de")}>
            {lang === "de" ? "English" : "Deutsch"}
          </button>
        </form>
      </div>
    );
  }

  // ── editor shell ──────────────────────────────────────────
  const navItems: { id: Tab; label: string }[] = [
    { id: "pages", label: ui.pages },
    { id: "posts", label: ui.posts },
    { id: "media", label: ui.media },
    { id: "services", label: ui.services },
    { id: "faq", label: ui.faq },
    { id: "settings", label: ui.settings },
  ];

  // pages / posts array helpers
  const pageItems = draft.pages.items as Array<typeof PAGE_TEMPLATE>;
  const postItems = draft.posts.items as Array<typeof POST_TEMPLATE>;
  const setPages = (items: unknown) => patch("pages", { ...draft.pages, items: items as typeof draft.pages.items });
  const setPosts = (items: unknown) => patch("posts", { ...draft.posts, items: items as typeof draft.posts.items });
  const addPage = () => { const next = [...pageItems, { ...PAGE_TEMPLATE, slug: `seite-${pageItems.length + 1}` }]; setPages(next); setSelPage(next.length - 1); };
  const addPost = () => { const next = [...postItems, { ...POST_TEMPLATE, date: today(), slug: `beitrag-${postItems.length + 1}` }]; setPosts(next); setSelPost(next.length - 1); };

  return (
    <div className="cms">
      <header className="cms-top">
        <img className="cms-top__logo" src={asset("assets/Plaster-logo.webp")} alt="Pläster" />
        <span className="cms-top__title">CMS</span>
        <div className="cms-top__spacer" />
        {dirty && <span className="cms-top__dirty">● {ui.unsaved}</span>}
        <div className="cms-seg" role="group" aria-label={ui.language}>
          <button className={lang === "de" ? "is-active" : ""} onClick={() => setLang("de")}>DE</button>
          <button className={lang === "en" ? "is-active" : ""} onClick={() => setLang("en")}>EN</button>
        </div>
        <button className="cms-btn cms-btn--primary" disabled={busy || !dirty} onClick={doSave}>
          {busy ? ui.saving : ui.save}
        </button>
        <button className="cms-btn" onClick={() => api.logout().finally(() => setAuth("out"))}>{ui.logout}</button>
      </header>

      {status && <div className={`cms-status cms-status--${status.kind}`}>{status.msg}</div>}

      <div className="cms-body">
        <nav className="cms-nav">
          {navItems.map((n) => (
            <button key={n.id} className={tab === n.id ? "is-active" : ""} onClick={() => setTab(n.id)}>
              {n.label}
            </button>
          ))}
        </nav>

        <section className="cms-editor">
          {tab === "pages" && (
            <>
              <div className="cms-pagelist">
                <button className={selPage === "home" ? "is-active" : ""} onClick={() => setSelPage("home")}>🏠 {ui.homepage}</button>
                {pageItems.map((p, i) => (
                  <button key={i} className={selPage === i ? "is-active" : ""} onClick={() => setSelPage(i)}>{p.title || p.slug}</button>
                ))}
                <button className="cms-add" onClick={addPage}>+ {ui.addPage}</button>
              </div>

              {selPage === "home" ? (
                <>
                  <p className="cms-hint">{ui.servicesHint} · {ui.faqHint}</p>
                  <Field value={draft.homepage} lang={lang} ui={ui}
                    onChange={(v) => patch("homepage", v as SiteContent["homepage"])} />
                </>
              ) : (
                <>
                  <p className="cms-hint">{ui.newPageHint}</p>
                  <Field value={pageItems[selPage]} lang={lang} ui={ui}
                    onChange={(v) => setPages(pageItems.map((p, i) => (i === selPage ? v : p)))} />
                  <button className="cms-btn cms-del-btn" onClick={() => {
                    if (confirm(ui.confirmDelete)) { setPages(pageItems.filter((_, i) => i !== selPage)); setSelPage("home"); }
                  }}>{ui.deleteItem}</button>
                </>
              )}
            </>
          )}

          {tab === "posts" && (
            <>
              <div className="cms-pagelist">
                {postItems.map((p, i) => (
                  <button key={i} className={selPost === i ? "is-active" : ""} onClick={() => setSelPost(i)}>{p.title || p.slug}</button>
                ))}
                <button className="cms-add" onClick={addPost}>+ {ui.addPost}</button>
              </div>
              {selPost !== null && postItems[selPost] ? (
                <>
                  <p className="cms-hint">{ui.newPostHint}</p>
                  <Field value={postItems[selPost]} lang={lang} ui={ui}
                    onChange={(v) => setPosts(postItems.map((p, i) => (i === selPost ? v : p)))} />
                  <button className="cms-btn cms-del-btn" onClick={() => {
                    if (confirm(ui.confirmDelete)) { setPosts(postItems.filter((_, i) => i !== selPost)); setSelPost(null); }
                  }}>{ui.deleteItem}</button>
                </>
              ) : (
                <p className="cms-hint">{ui.newPostHint}</p>
              )}
            </>
          )}

          {tab === "services" && (
            <Field value={draft.services.items} lang={lang} ui={ui}
              onChange={(v) => patch("services", { ...draft.services, items: v as typeof draft.services.items })} />
          )}

          {tab === "faq" && (
            <Field value={draft.faq.items} lang={lang} ui={ui}
              onChange={(v) => patch("faq", { ...draft.faq, items: v as typeof draft.faq.items })} />
          )}

          {tab === "settings" && (
            <Field value={draft.settings} lang={lang} ui={ui}
              onChange={(v) => patch("settings", v as SiteContent["settings"])} />
          )}

          {tab === "media" && (
            <div className="cms-soon">
              {lang === "de"
                ? "Bilder werden direkt an Ort und Stelle hochgeladen: Öffnen Sie eine Seite/Leistung/einen Beitrag und klicken Sie beim jeweiligen Bild auf „Bild hochladen“. Das Bild wird gespeichert und erscheint nach dem Veröffentlichen auf der Website."
                : "Images upload right where you need them: open a page/service/post and use the “Upload image” button on any image field. The file is committed and appears on the site after publishing."}
            </div>
          )}
        </section>

        <section className="cms-previewpane">
          <div className="cms-previewpane__bar">{ui.preview}</div>
          <div className="cms-preview">
            <ContentProvider value={draft}><App /></ContentProvider>
          </div>
        </section>
      </div>
    </div>
  );
}
