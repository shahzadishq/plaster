import { motion, useReducedMotion } from "framer-motion";
import { useContent } from "@/content/store";

export default function Marquee() {
  const reduce = useReducedMotion();
  const { homepage } = useContent();
  const loop = [...homepage.marquee.items, ...homepage.marquee.items];
  return (
    <div className="marquee" aria-hidden="true">
      <motion.div
        className="marquee__track"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      >
        {loop.map((t, i) => (
          <span className="marquee__item" key={i}>
            {t}
            <span className="marquee__sep" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
