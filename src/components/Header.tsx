import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { asset } from "@/lib/asset";
import { useContent } from "@/content/store";

const baseLinks = [
  { href: "/#ueber-uns", label: "Über uns" },
  { href: "/#leistungen", label: "Leistungen" },
  { href: "/#referenzen", label: "Referenzen" },
  { href: "/#warum", label: "Warum Pläster" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#kontakt", label: "Kontakt" },
];

export default function Header() {
  const { pages, posts } = useContent();
  const navPages = pages.items.filter((p) => p.nav);
  const links = [
    ...baseLinks,
    ...(posts.items.length ? [{ href: "/blog", label: "Blog" }] : []),
    ...navPages.map((p) => ({ href: `/${p.slug}`, label: p.title })),
  ];
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className={`header${scrolled ? " is-scrolled" : ""}`} id="header">
      <div className="container nav">
        <a className="brand__logo" href="/" aria-label="Pläster Gebäudereinigung GmbH – Startseite">
          <img src={asset("assets/Plaster-logo.webp")} alt="Pläster Gebäudereinigung GmbH Logo" width={200} height={50} />
        </a>

        <nav className={`nav__menu${open ? " is-open" : ""}`} id="navMenu" aria-label="Hauptnavigation">
          {links.map((l) => (
            <a key={l.href} className="nav__link" href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <span className="nav__cta">
            <a className="btn btn--primary" href="/#kontakt" onClick={() => setOpen(false)}>
              Angebot anfordern
            </a>
          </span>
        </nav>

        <div className="nav__actions">
          <a className="btn btn--primary" href="/#kontakt">Angebot anfordern</a>
          <button
            className="nav__toggle"
            id="navToggle"
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={open}
            aria-controls="navMenu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
