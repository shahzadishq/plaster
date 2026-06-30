import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import {
  ArrowRight, Building2, PanelTop, HardHat, Sun, ShieldCheck, ShieldAlert, Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal, staggerContainer, staggerItem } from "./motion";
import TiltCard from "./TiltCard";
import { asset } from "@/lib/asset";
import { useContent } from "@/content/store";

const ICONS: Record<string, LucideIcon> = {
  building: Building2, window: PanelTop, hardhat: HardHat, sun: Sun,
  shield: ShieldCheck, alert: ShieldAlert, wrench: Wrench,
};
const EASE = [0.16, 1, 0.3, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

function useCompact() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const on = () => setCompact(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return compact;
}

type Svc = { icon: string; image: string; title: string; alt?: string; desc: string };

export default function ServicesShowcase() {
  const { homepage, services: servicesData } = useContent();
  const head = homepage.services;
  const services = servicesData.items as Svc[];
  const reduce = useReducedMotion();
  const compact = useCompact();

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [index, setIndex] = useState(0);
  const n = services.length;

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!n) return;
    setIndex(Math.min(n - 1, Math.max(0, Math.floor(p * n))));
  });

  function goTo(i: number) {
    const el = ref.current;
    if (!el || n < 2) return;
    const travel = el.offsetHeight - window.innerHeight; // sticky scroll distance
    const target = el.offsetTop + ((i + 0.5) / n) * travel;
    window.scrollTo({ top: target, behavior: "smooth" });
  }

  // Static, accessible fallback (mobile / reduced motion): the classic grid.
  if (reduce || compact || n === 0) {
    return (
      <section className="section svc" id="leistungen">
        <div className="svc-bubbles" aria-hidden="true"><span /><span /><span /><span /></div>
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">{head.eyebrow}</span>
            <h2 className="section-title" dangerouslySetInnerHTML={{ __html: head.titleHtml }} />
            <p className="section-sub">{head.sub}</p>
          </Reveal>
          <motion.div className="service-grid" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
            {services.map((s) => {
              const Icon = ICONS[s.icon] ?? Building2;
              return (
                <TiltCard className="service-card" key={s.title} variants={staggerItem}>
                  <div className="service-card__media"><img src={asset(s.image)} alt={s.alt ?? s.title} loading="lazy" /></div>
                  <div className="service-card__body">
                    <span className="service-card__icon"><Icon /></span>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    <a className="service-card__link" href="#kontakt">Anfragen <ArrowRight /></a>
                  </div>
                </TiltCard>
              );
            })}
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="svc-show" id="leistungen" ref={ref} style={{ height: `${n * 100}vh` }}>
      <div className="svc-show__sticky">
        <span className="svc-show__bg" aria-hidden="true" />
        <span className="svc-show__ghost" aria-hidden="true">{pad(index + 1)}</span>

        <div className="container svc-show__inner">
          <header className="svc-show__head">
            <span className="eyebrow eyebrow--light">{head.eyebrow}</span>
            <h2 className="svc-show__title" dangerouslySetInnerHTML={{ __html: head.titleHtml }} />
          </header>

          <div className="svc-show__stage">
            {services.map((s, i) => {
              const Icon = ICONS[s.icon] ?? Building2;
              const active = i === index;
              return (
                <motion.article
                  key={i}
                  className="svc-slide"
                  aria-hidden={!active}
                  initial={false}
                  animate={{ opacity: active ? 1 : 0, y: active ? 0 : i < index ? -48 : 48 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  style={{ pointerEvents: active ? "auto" : "none" }}
                >
                  <div className="svc-slide__text">
                    <span className="svc-slide__no">{pad(i + 1)} <i>/ {pad(n)}</i></span>
                    <span className="svc-slide__icon"><Icon /></span>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    <a className="btn btn--light btn--lg" href="#kontakt">Anfragen <ArrowRight /></a>
                  </div>
                  <div className="svc-slide__media">
                    <motion.img
                      src={asset(s.image)}
                      alt={s.alt ?? s.title}
                      loading="lazy"
                      animate={{ scale: active ? 1 : 1.12 }}
                      transition={{ duration: 0.8, ease: EASE }}
                    />
                  </div>
                </motion.article>
              );
            })}
          </div>

          <nav className="svc-show__rail" aria-label="Leistungen">
            {services.map((s, i) => (
              <button
                key={i}
                className={i === index ? "is-active" : ""}
                aria-label={s.title}
                aria-current={i === index}
                onClick={() => goTo(i)}
              >
                <span />
              </button>
            ))}
          </nav>

          <span className="svc-show__hint" aria-hidden="true">Scrollen<i /></span>
        </div>
      </div>
    </section>
  );
}
