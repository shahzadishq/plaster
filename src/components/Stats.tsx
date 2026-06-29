import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { Reveal, staggerContainer, staggerItem } from "./motion";
import AnimatedDots from "./AnimatedDots";
import { useContent } from "@/content/store";

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

export default function Stats() {
  const { homepage } = useContent();
  const s = homepage.stats;
  return (
    <section className="section stats stats--brand" aria-label="Zahlen &amp; Fakten">
      <AnimatedDots />
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">{s.eyebrow}</span>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: s.titleHtml }} />
          <p className="section-sub">{s.sub}</p>
        </Reveal>

        <motion.div
          className="stats__grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {s.items.map((it) => (
            <motion.div className="stat" key={it.label} variants={staggerItem}>
              <div className="stat__num">
                {it.value ? it.value : <Counter to={it.to ?? 0} />}
                {it.suffix && <span className="stat__suffix">{it.suffix}</span>}
              </div>
              <div className="stat__label">{it.label}</div>
              <div className="stat__desc">{it.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
