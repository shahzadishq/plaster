import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal, staggerContainer, staggerItem } from "./motion";
import TiltCard from "./TiltCard";
import { asset } from "@/lib/asset";

type Project = { img: string; tag: string; title: string; sub: string; alt: string };

const projects: Project[] = [
  { img: "assets/video-poster.webp", tag: "Glas- & Fassadenreinigung", title: "Fassadenreinigung in der Höhe", sub: "Bürogebäude · Gewerbe", alt: "Fassadenreinigung in der Höhe mit Hebebühne" },
  { img: "assets/469159898_122124697940401905_6463789775555365842_n.jpg", tag: "Grund- & Bodenreinigung", title: "Bodenreinigung Gewerbe", sub: "Außenanlagen · Innenbereich", alt: "Maschinelle Bodenreinigung in Gewerberäumen" },
  { img: "assets/469649322_122125024898401905_7948855457755618054_n.jpg", tag: "Unterhaltsreinigung", title: "Sanitär & Hygiene", sub: "Praxis · Verwaltung", alt: "Sanitär- und Hygienereinigung" },
  { img: "assets/Photovoltaik%20-%20Reinigung.webp", tag: "Photovoltaik-Reinigung", title: "Photovoltaikanlage", sub: "Mehr Ertrag · materialschonend", alt: "Gereinigte Photovoltaikanlage" },
  { img: "assets/469479909_122124989606401905_1792001857027702583_n.jpg", tag: "Unser Team", title: "Eingespielt & zuverlässig", sub: "Geschultes Fachpersonal", alt: "Das Team der Pläster Gebäudereinigung" },
  { img: "assets/468221710_122123566232401905_8775708943227813901_n.jpg", tag: "Fuhrpark", title: "Immer einsatzbereit", sub: "Eigene Flotte · regional", alt: "Servicefahrzeug der Pläster Gebäudereinigung" },
];

export default function Projects() {
  return (
    <section className="section section--alt" id="referenzen">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Referenzen</span>
          <h2 className="section-title">Projekte, die für sich <em>sprechen</em></h2>
          <p className="section-sub">
            Ein Auszug aus unserer täglichen Arbeit – vom Bürogebäude bis zur Photovoltaikanlage.
          </p>
        </Reveal>

        <motion.div
          className="project-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {projects.map((p) => (
            <TiltCard as="a" href="#kontakt" className="project-card" key={p.title} variants={staggerItem} max={6}>
              <img src={asset(p.img)} alt={p.alt} loading="lazy" />
              <span className="project-card__tag">{p.tag}</span>
              <div className="project-card__cap">
                <h3>{p.title}</h3>
                <span>{p.sub} <ArrowRight className="arrow" size={16} /></span>
              </div>
            </TiltCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
