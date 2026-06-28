import { motion } from "framer-motion";
import {
  ArrowRight, Building2, PanelTop, HardHat, Sun, ShieldCheck, ShieldAlert, Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal, staggerContainer, staggerItem } from "./motion";
import TiltCard from "./TiltCard";
import { asset } from "@/lib/asset";

type Service = { icon: LucideIcon; img: string; title: string; alt: string; desc: string };

const services: Service[] = [
  { icon: Building2, img: "assets/Unterhaltsreinigung.webp", title: "Unterhaltsreinigung", alt: "Unterhaltsreinigung von Büro- und Gemeinschaftsflächen", desc: "Regelmäßige, werterhaltende Reinigung von Büros, Treppenhäusern, Sanitär- und Gemeinschaftsflächen – zuverlässig nach Ihrem individuellen Plan." },
  { icon: PanelTop, img: "assets/Glas-Fassadenreinigung.webp", title: "Glas- & Fassadenreinigung", alt: "Glas- und Fassadenreinigung", desc: "Streifenfreie Fenster, Glasfassaden und Rahmen sowie schonende Fassadenreinigung – für einen klaren, gepflegten Auftritt, auch in der Höhe." },
  { icon: HardHat, img: "assets/Bauschlussreinigung.webp", title: "Bauschlussreinigung", alt: "Bauschlussreinigung nach Neubau und Renovierung", desc: "Nach Neubau, Umbau oder Renovierung entfernen wir Baustaub und Rückstände und übergeben bezugsfertige, besenreine Flächen." },
  { icon: Sun, img: "assets/Photovoltaik%20-%20Reinigung.webp", title: "Photovoltaik-Reinigung", alt: "Reinigung von Photovoltaikanlagen", desc: "Verschmutzte Module kosten Ertrag. Mit schonender, entkalkter Reinigung steigern wir die Leistung Ihrer Anlage – materialgerecht und sicher." },
  { icon: ShieldCheck, img: "assets/Reinraum%20Reinigung.webp", title: "Reinraumreinigung", alt: "Reinraumreinigung für sensible Bereiche", desc: "Spezialreinigung für sensible Bereiche mit höchsten Hygieneanforderungen – nach validierten Verfahren für Labore, Produktion und Technik." },
  { icon: ShieldAlert, img: "assets/Tatortreinigung.webp", title: "Tatortreinigung", alt: "Diskrete und fachgerechte Tatortreinigung", desc: "Diskrete, fachgerechte Tatort-, Geruchs- und Desinfektionsreinigung mit zertifizierten Verfahren – einfühlsam, gründlich und zuverlässig." },
  { icon: Wrench, img: "assets/Ger%C3%A4tevermietung.webp", title: "Gerätevermietung", alt: "Vermietung professioneller Reinigungsmaschinen und Geräte", desc: "Professionelle Reinigungsmaschinen und Geräte zur Miete – vom Reinigungsautomaten bis zum Hochdruckreiniger, inklusive Einweisung." },
];

export default function Services() {
  return (
    <section className="section svc" id="leistungen">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Leistungen</span>
          <h2 className="section-title">Saubere Lösungen für <em>jedes Gebäude</em></h2>
          <p className="section-sub">
            Von der regelmäßigen Unterhaltsreinigung bis zur Spezialreinigung – ein Ansprechpartner für alle
            Reinigungsaufgaben.
          </p>
        </Reveal>

        <motion.div
          className="service-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <TiltCard className="service-card" key={s.title} variants={staggerItem}>
                <div className="service-card__media">
                  <img src={asset(s.img)} alt={s.alt} loading="lazy" />
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
