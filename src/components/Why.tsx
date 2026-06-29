import { motion } from "framer-motion";
import { Award, Users, Leaf, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal, staggerContainer, staggerItem } from "./motion";
import { asset } from "@/lib/asset";
import { useContent } from "@/content/store";

const ICONS: Record<string, LucideIcon> = { award: Award, users: Users, leaf: Leaf, truck: Truck };

export default function Why() {
  const { homepage } = useContent();
  const w = homepage.why;
  return (
    <section className="section why why--brand" id="warum">
      <div className="container">
        <div className="why__layout">
          <Reveal className="why__media" variant="fadeRight">
            <img
              src={asset(w.image)}
              alt={w.imageAlt}
              loading="lazy"
              width={900}
              height={1100}
            />
          </Reveal>

          <div className="why__content">
            <Reveal className="section-head section-head--left" variant="fadeLeft">
              <span className="eyebrow">{w.eyebrow}</span>
              <h2 className="section-title" dangerouslySetInnerHTML={{ __html: w.titleHtml }} />
              <p className="section-sub">{w.sub}</p>
            </Reveal>

            <motion.div
              className="why__grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {w.items.map((it) => {
                const Icon = ICONS[it.icon] ?? Award;
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
