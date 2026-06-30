import type { ComponentType } from "react";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Stats from "./components/Stats";
import Services from "./components/ServicesShowcase";
import Projects from "./components/Projects";
import Why from "./components/Why";
import Testimonials from "./components/Testimonials";
import Faq from "./components/Faq";
import Cta from "./components/Cta";
import Contact from "./components/Contact";
import Shell from "./components/Shell";
import { useContent } from "./content/store";

// Each homepage section carries its own id/name/visible (managed in the CMS,
// inside Pages → Homepage). Render order is fixed here; visibility is per-section.
const ORDER = ["hero", "about", "marquee", "stats", "services", "projects", "why", "testimonials", "faq", "cta", "contact"] as const;

const REGISTRY: Record<string, ComponentType> = {
  hero: Hero,
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
  const hp = homepage as Record<string, { visible?: boolean }>;

  return (
    <Shell>
      {ORDER.map((id) => {
        const C = REGISTRY[id];
        if (!C || hp[id]?.visible === false) return null;
        return <C key={id} />;
      })}
    </Shell>
  );
}
