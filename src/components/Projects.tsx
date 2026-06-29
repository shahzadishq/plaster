import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal, staggerContainer, staggerItem } from "./motion";
import TiltCard from "./TiltCard";
import { asset } from "@/lib/asset";
import { useContent } from "@/content/store";

export default function Projects() {
  const { homepage } = useContent();
  const p = homepage.projects;
  return (
    <section className="section section--alt" id="referenzen">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">{p.eyebrow}</span>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: p.titleHtml }} />
          <p className="section-sub">{p.sub}</p>
        </Reveal>

        <motion.div
          className="project-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {p.items.map((proj) => (
            <TiltCard as="a" href="#kontakt" className="project-card" key={proj.title} variants={staggerItem} max={6}>
              <img src={asset(proj.img)} alt={proj.alt} loading="lazy" />
              <span className="project-card__tag">{proj.tag}</span>
              <div className="project-card__cap">
                <h3>{proj.title}</h3>
                <span>{proj.sub} <ArrowRight className="arrow" size={16} /></span>
              </div>
            </TiltCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
