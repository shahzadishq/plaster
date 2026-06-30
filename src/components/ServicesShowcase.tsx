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

// Slide acts as a group; children rise in with a staggered delay (custom).
const groupV = { hidden: {}, show: {} };
const riseV = {
  hidden: { opacity: 0, y: 36 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: d } }),
};

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
  const [step, setStep] = useState(0); // 0 = intro, 1..N = service (N services)
  const n = services.length;
  const steps = n + 1; // intro + one per service

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!n) return;
    setStep(Math.min(steps - 1, Math.max(0, Math.floor(p * steps))));
  });

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

  const introActive = step === 0;

  return (
    <section className="svc-show" id="leistungen" ref={ref} style={{ height: `${steps * 100}vh` }}>
      <div className="svc-show__sticky">
        <span className="svc-show__bg" aria-hidden="true" />

        <div className="container svc-show__inner">
          {/* Slide 0 — centered intro */}
          <motion.div
            className="svc-intro"
            aria-hidden={!introActive}
            initial={false}
            animate={{ opacity: introActive ? 1 : 0, y: introActive ? 0 : -40 }}
            transition={{ duration: 0.55, ease: EASE }}
            style={{ pointerEvents: introActive ? "auto" : "none" }}
          >
            <span className="eyebrow eyebrow--light eyebrow--center">{head.eyebrow}</span>
            <h2 className="svc-intro__title" dangerouslySetInnerHTML={{ __html: head.titleHtml }} />
            <p className="svc-intro__sub">{head.sub}</p>
          </motion.div>

          {/* Slides 1..N — one service each */}
          {services.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Building2;
            const active = step === i + 1;
            return (
              <motion.article
                key={i}
                className="svc-slide"
                aria-hidden={!active}
                variants={groupV}
                initial="hidden"
                animate={active ? "show" : "hidden"}
                style={{ pointerEvents: active ? "auto" : "none" }}
              >
                <div className="svc-slide__text">
                  <motion.span className="svc-slide__icon" variants={riseV} custom={0}><Icon /></motion.span>
                  <motion.h3 variants={riseV} custom={0}>{s.title}</motion.h3>
                  <motion.p variants={riseV} custom={0.18}>{s.desc}</motion.p>
                  <motion.a className="btn btn--light btn--lg" href="#kontakt" variants={riseV} custom={0.36}>Anfragen <ArrowRight /></motion.a>
                </div>
                <motion.div className="svc-slide__media" variants={riseV} custom={0}>
                  <img src={asset(s.image)} alt={s.alt ?? s.title} loading="lazy" />
                </motion.div>
              </motion.article>
            );
          })}

          <span className={`svc-show__hint${introActive ? " is-visible" : ""}`} aria-hidden="true">Scrollen<i /></span>
        </div>
      </div>
    </section>
  );
}
