import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { Menu, X, Phone, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { asset } from "@/lib/asset";

const EASE = [0.22, 1, 0.36, 1] as const;

const menuItems = [
  { name: "Über uns", href: "#ueber-uns" },
  { name: "Leistungen", href: "#leistungen" },
  { name: "Referenzen", href: "#referenzen" },
  { name: "Warum Pläster", href: "#warum" },
  { name: "FAQ", href: "#faq" },
  { name: "Kontakt", href: "#kontakt" },
];

const trust = [
  "Seit 1982",
  "Eigener Fuhrpark",
  "Geschultes Fachpersonal",
  "Umweltschonende Mittel",
  "Termintreu & zuverlässig",
];

export function HeroHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => scrollYProgress.on("change", (v) => setScrolled(v > 0.05)), [scrollYProgress]);

  return (
    <header>
      <nav data-state={open ? "active" : undefined} className="fixed z-30 w-full pt-2">
        <div
          className={cn(
            "mx-auto max-w-7xl rounded-3xl px-6 transition-all duration-300 lg:px-12",
            scrolled && "bg-white/75 shadow-sm backdrop-blur-2xl"
          )}
        >
          <div
            className={cn(
              "relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-6",
              scrolled && "lg:py-4"
            )}
          >
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <a href="#top" aria-label="Pläster Gebäudereinigung – Startseite" className="flex items-center">
                <img src={asset("assets/Plaster-logo.webp")} alt="Pläster Gebäudereinigung GmbH Logo" className="h-9 w-auto" />
              </a>

              <button
                onClick={() => setOpen(!open)}
                aria-label={open ? "Menü schließen" : "Menü öffnen"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                {open ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>

              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm font-head">
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <a href={item.href} className="text-slate-600 duration-150 hover:text-brand">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              className={cn(
                "mb-6 w-full flex-wrap items-center justify-end space-y-6 rounded-3xl border bg-white p-6 shadow-2xl shadow-slate-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none",
                open ? "flex" : "hidden lg:flex"
              )}
            >
              <div className="lg:hidden">
                <ul className="space-y-6 text-base font-head">
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="text-slate-600 duration-150 hover:text-brand"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col gap-3 sm:flex-row md:w-fit">
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <a href="tel:+49764195257">
                    <Phone className="size-4" /> Anrufen
                  </a>
                </Button>
                <Button asChild size="sm" className="rounded-full">
                  <a href="#kontakt" onClick={() => setOpen(false)}>Angebot anfordern</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-x-hidden">
        <section>
          <div className="relative">
            <div className="relative z-10 flex min-h-[92vh] flex-col justify-end px-6">
              <div className="mx-auto w-full max-w-7xl pb-16 lg:px-12 lg:pb-28">
                <motion.div
                  className="max-w-2xl"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur font-head">
                    <span className="size-2 rounded-full bg-brand-amber shadow-[0_0_0_4px_rgba(255,196,0,0.22)]" />
                    Familienbetrieb · Qualität seit 1982
                  </span>

                  <h1 className="text-balance font-display text-5xl font-extrabold leading-[1.04] text-white drop-shadow-[0_2px_26px_rgba(0,0,0,0.35)] md:text-6xl xl:text-7xl">
                    Professionelle <em className="italic">Gebäude&shy;reinigung</em>{" "}
                    <span className="bg-gradient-to-r from-brand-light to-white bg-clip-text text-transparent">seit 1982</span>
                  </h1>

                  <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-blue-50">
                    Seit über 40 Jahren sorgen wir in Emmendingen und Umgebung für saubere Büros, Glasfassaden,
                    Photovoltaikanlagen und vieles mehr – zuverlässig, gründlich und mit eigenem Fuhrpark.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Button asChild size="lg" className="h-12 rounded-full pl-5 pr-4 text-base">
                      <a href="#kontakt">
                        <span className="text-nowrap">Kostenloses Angebot</span>
                        <ChevronRight className="ml-1 size-5" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="ghost"
                      className="h-12 rounded-full border border-white/40 px-5 text-base text-white hover:bg-white/10"
                    >
                      <a href="#leistungen"><span className="text-nowrap">Unsere Leistungen</span></a>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* full-bleed rounded media (real photo + brand overlay) */}
            <motion.div
              className="pointer-events-none absolute inset-1 overflow-hidden rounded-3xl border border-white/10 lg:rounded-[3rem]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <img
                src={asset("assets/468340775_122129564642398209_5784847375390515268_n.jpg")}
                alt="Firmensitz und Fuhrpark der Pläster Gebäudereinigung"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#05397E]/92 via-[#05397E]/62 to-[#019AEA]/25" />
            </motion.div>
          </div>
        </section>

        {/* on-brand trust strip (replaces the third-party logo marquee) */}
        <section className="bg-white py-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 md:flex-row md:justify-between">
            <p className="text-sm text-slate-500 md:max-w-44 md:border-r md:pr-6 md:text-right">
              Vertraut von Unternehmen, Hausverwaltungen &amp; Privatkunden in der Region
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 font-head">
              {trust.map((t) => (
                <span key={t} className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Check className="size-4 text-brand" strokeWidth={2.5} />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
