import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { asset } from "@/lib/asset";
import settings from "@/content/settings.json";

const EASE = [0.22, 1, 0.36, 1] as const;

const heroBg = {
  background:
    `linear-gradient(100deg, rgba(5,42,94,0.84) 0%, rgba(5,57,126,0.58) 44%, rgba(5,57,126,0.24) 100%), ` +
    `url(${asset("assets/468340775_122129564642398209_5784847375390515268_n.jpg")}) center/cover no-repeat`,
};

const stats = [
  { num: "40+", label: "Jahre Erfahrung" },
  { num: "1982", label: "Gegründet" },
  { num: "7+", label: "Leistungsbereiche" },
  { num: "100%", label: "Zuverlässigkeit" },
];

export default function Hero() {
  return (
    <section className="hero" style={heroBg}>
      <span className="hero__glow" aria-hidden="true" />
      <div className="container hero__grid">
        <motion.div
          className="hero__copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span className="hero__badge"><span className="dot" /> Familienbetrieb · Qualität seit 1982</span>
          <h1>Professionelle <em>Gebäude&shy;reinigung</em> <span className="accent">seit 1982</span></h1>
          <p className="hero__lead">{settings.hero.lead}</p>
          <div className="hero__actions">
            <a className="btn btn--light btn--lg" href="#kontakt">
              Kostenloses Angebot <ArrowRight />
            </a>
            <a className="btn btn--ghost btn--on-dark btn--lg" href="#leistungen">Unsere Leistungen</a>
          </div>
        </motion.div>

        <motion.figure
          className="hero__figure"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
        >
          <img
            src={asset("assets/plaster.webp")}
            alt="Zwei Mitarbeiter der Pläster Gebäudereinigung mit professioneller Reinigungsausrüstung"
            width={520}
            height={548}
          />
        </motion.figure>
      </div>

      <motion.div
        className="hero__statbar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        <div className="container hero__statbar-inner">
          {stats.map((s) => (
            <div className="hero__stat" key={s.label}>
              <b>{s.num}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
