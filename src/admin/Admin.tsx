import { useEffect, useMemo, useState } from "react";
import App from "@/App";
import { ContentProvider, defaultContent, type SiteContent } from "@/content/store";
import { asset } from "@/lib/asset";
import { api } from "./api";
import { CONTENT_FILES } from "./config";
import { UI, type Lang } from "./i18n";
import Field, { deepClone } from "./Fields";
import "./admin.css";

type Tab = "pages" | "posts" | "media" | "services" | "faq" | "settings" | "sections";

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
    { id: "sections", label: ui.sections },
  ];

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
                <button className="is-active">🏠 {ui.homepage}</button>
                <button className="cms-disabled" title={ui.comingSoon} disabled>+ {lang === "de" ? "Seite hinzufügen" : "Add page"}</button>
              </div>
              <p className="cms-hint">{ui.servicesHint} · {ui.faqHint}</p>
              <Field value={draft.homepage} lang={lang} ui={ui}
                onChange={(v) => patch("homepage", v as SiteContent["homepage"])} />
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

          {tab === "sections" && (
            <Field value={draft.sections.items} lang={lang} ui={ui}
              onChange={(v) => patch("sections", { ...draft.sections, items: v as typeof draft.sections.items })} />
          )}

          {(tab === "posts" || tab === "media") && (
            <div className="cms-soon">{ui.comingSoon}</div>
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
