import { ArrowRight } from "lucide-react";
import { Reveal } from "./motion";
import AnimatedDots from "./AnimatedDots";
import { useContent } from "@/content/store";

export default function Cta() {
  const { homepage } = useContent();
  const c = homepage.cta;
  return (
    <section className="section section--alt">
      <div className="container">
        <Reveal className="cta-band" variant="zoomIn">
          <AnimatedDots />
          <div className="cta-band__inner">
            <span className="eyebrow" style={{ color: "#fff", justifyContent: "center" }}>{c.eyebrow}</span>
            <h2 dangerouslySetInnerHTML={{ __html: c.titleHtml }} />
            <p>{c.text}</p>
            <a className="btn btn--light btn--lg" href="#kontakt">{c.button} <ArrowRight /></a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
