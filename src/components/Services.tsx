import { motion } from "framer-motion";
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

export default function Services() {
  const { homepage, services: servicesData } = useContent();
  const head = homepage.services;
  const services = servicesData.items;
  return (
    <section className="section svc" id="leistungen">
      <div className="svc-bubbles" aria-hidden="true">
        <span /><span /><span /><span />
      </div>
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">{head.eyebrow}</span>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: head.titleHtml }} />
          <p className="section-sub">{head.sub}</p>
        </Reveal>

        <motion.div
          className="service-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {services.map((s) => {
            const Icon = ICONS[s.icon] ?? Building2;
            return (
              <TiltCard className="service-card" key={s.title} variants={staggerItem}>
                <div className="service-card__media">
                  <img src={asset(s.image)} alt={s.alt ?? s.title} loading="lazy" />
                </div>
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
