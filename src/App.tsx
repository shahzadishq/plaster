import type { ComponentType } from "react";
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
import Shell from "./components/Shell";
import { useContent } from "./content/store";

// Registry of toggleable / reorderable homepage sections (managed in the CMS).
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
  const { homepage } = useContent();
  const sections = homepage.sections.filter((s) => s.visible);

  return (
    <Shell>
      <Hero />
      {sections.map((s) => {
        const C = REGISTRY[s.id];
        return C ? <C key={s.id} /> : null;
      })}
    </Shell>
  );
}
