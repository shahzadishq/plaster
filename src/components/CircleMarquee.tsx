import { motion } from "framer-motion";

// A large rotating circular-text badge (sample). Positioned half off-screen,
// bottom-left, inside the contact section.
export default function CircleMarquee() {
  const text = "PLÄSTER GEBÄUDEREINIGUNG · SEIT 1982 · ";
  return (
    <a className="circle-marquee" href="#kontakt" aria-label="Kontakt aufnehmen">
      <motion.svg
        className="circle-marquee__svg"
        viewBox="0 0 200 200"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      >
        <defs>
          <path id="cm-circle" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        </defs>
        <text>
          <textPath href="#cm-circle" className="circle-marquee__text">{text + text}</textPath>
        </text>
      </motion.svg>
    </a>
  );
}
