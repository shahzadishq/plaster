import type { ComponentType } from "react";
import { MotionConfig, motion, useScroll } from "framer-motion";
import ThemeInjector from "./components/ThemeInjector";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Stats from "./components/Stats";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Why from "./components/Why";
import Testimonials from "./components/Testimonials";
import Faq from "./components/Faq";
import Cta from "./components/Cta";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import sectionsData from "./content/sections.json";

// Registry of toggleable / reorderable sections (managed in the CMS).
const REGISTRY: Record<string, ComponentType> = {
  about: About,
  marquee: Marquee,
  stats: Stats,
  services: Services,
  projects: Projects,
  why: Why,
  testimonials: Testimonials,
  faq: Faq,
  cta: Cta,
  contact: Contact,
};

export default function App() {
  const { scrollYProgress } = useScroll();
  const sections = sectionsData.items.filter((s) => s.visible);

  return (
    <MotionConfig reducedMotion="user">
      <ThemeInjector />
      <a className="skip-link" href="#main">Zum Inhalt springen</a>
      <motion.div
        className="progress"
        aria-hidden="true"
        style={{ width: "100%", scaleX: scrollYProgress, transformOrigin: "0% 50%" }}
      />

      <Header />

      <main id="main">
        <span id="top" />
        <Hero />
        {sections.map((s) => {
          const C = REGISTRY[s.id];
          return C ? <C key={s.id} /> : null;
        })}
      </main>

      <Footer />
    </MotionConfig>
  );
}
