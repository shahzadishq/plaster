import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { Reveal, staggerContainer, staggerItem } from "./motion";
import AnimatedDots from "./AnimatedDots";

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);
  return <span ref={ref}>{val.toLocaleString("de-DE")}</span>;
}

type Stat = { to?: number; value?: string; suffix?: string; label: string; desc: string };

const stats: Stat[] = [
  { to: 40, suffix: "+", label: "Jahre Erfahrung", desc: "Seit 1982 im Einsatz" },
  { value: "1982", label: "Gegründet", desc: "Inhabergeführt" },
  { to: 100, suffix: "%", label: "Zuverlässigkeit", desc: "Termintreu & gründlich" },
  { to: 9, suffix: "+", label: "Leistungsbereiche", desc: "Rund um die Reinigung" },
];

export default function Stats() {
  return (
    <section className="section stats stats--brand" aria-label="Zahlen &amp; Fakten">
      <AnimatedDots />
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Seit 1982</span>
          <h2 className="section-title">40+ Jahre Erfahrung &amp; <em>Qualität</em></h2>
          <p className="section-sub">
            Ein verlässlicher Partner für Unternehmen, Hausverwaltungen und Privatkunden – mit eigenem Fuhrpark
            und geschultem Team.
          </p>
        </Reveal>

        <motion.div
          className="stats__grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {stats.map((s) => (
            <motion.div className="stat" key={s.label} variants={staggerItem}>
              <div className="stat__num">
                {s.value ? s.value : <Counter to={s.to!} />}
                {s.suffix && <span className="stat__suffix">{s.suffix}</span>}
              </div>
              <div className="stat__label">{s.label}</div>
              <div className="stat__desc">{s.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
