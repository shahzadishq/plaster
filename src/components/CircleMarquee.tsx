import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

// A small rotating circular-text badge (sample). Sits bottom-left above the footer.
export default function CircleMarquee() {
  const text = "PLÄSTER GEBÄUDEREINIGUNG · SEIT 1982 · ";
  return (
    <div className="circle-band">
      <div className="container">
        <a className="circle-marquee" href="#kontakt" aria-label="Kontakt aufnehmen">
          <motion.svg
            className="circle-marquee__svg"
            viewBox="0 0 200 200"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          >
            <defs>
              <path id="cm-circle" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
            </defs>
            <text>
              <textPath href="#cm-circle" className="circle-marquee__text">{text + text}</textPath>
            </text>
          </motion.svg>
          <span className="circle-marquee__center"><ArrowUpRight /></span>
        </a>
      </div>
    </div>
  );
}
