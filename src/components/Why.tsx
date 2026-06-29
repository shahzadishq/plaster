import { motion } from "framer-motion";
import { Award, Users, Leaf, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal, staggerContainer, staggerItem } from "./motion";
import { asset } from "@/lib/asset";

type Item = { icon: LucideIcon; title: string; desc: string };

const items: Item[] = [
  { icon: Award, title: "Erfahrung seit 1982", desc: "Über 40 Jahre Praxis – wir kennen jedes Objekt und jede Herausforderung." },
  { icon: Users, title: "Geschultes Personal", desc: "Festangestellte, regelmäßig geschulte Fachkräfte – zuverlässig und sorgfältig." },
  { icon: Leaf, title: "Umweltbewusst", desc: "Schonende Reinigungsmittel und ressourcensparende Verfahren für Mensch & Umwelt." },
  { icon: Truck, title: "Eigener Fuhrpark", desc: "Pünktlich vor Ort mit eigener Flotte – flexibel und termintreu in der ganzen Region." },
];

export default function Why() {
  return (
    <section className="section why why--brand" id="warum">
      <div className="container">
        <div className="why__layout">
          <Reveal className="why__media" variant="fadeRight">
            <img
              src={asset("assets/469739262_122125029824401905_4926986459299821165_n.jpg")}
              alt="Mitarbeiter der Pläster Gebäudereinigung bei der professionellen Reinigung"
              loading="lazy"
              width={900}
              height={1100}
            />
          </Reveal>

          <div className="why__content">
            <Reveal className="section-head section-head--left" variant="fadeLeft">
              <span className="eyebrow">Warum Pläster</span>
              <h2 className="section-title">Warum Pläster <em>Gebäudereinigung?</em></h2>
              <p className="section-sub">Vier gute Gründe, warum Kunden seit über 40 Jahren auf uns vertrauen.</p>
            </Reveal>

            <motion.div
              className="why__grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {items.map((it) => {
                const Icon = it.icon;
                return (
                  <motion.div className="why__item" key={it.title} variants={staggerItem}>
                    <div className="why__icon"><Icon /></div>
                    <h3>{it.title}</h3>
                    <p>{it.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
