import { ArrowRight } from "lucide-react";
import { Reveal } from "./motion";
import AnimatedDots from "./AnimatedDots";
import Magnetic from "./Magnetic";

export default function Cta() {
  return (
    <section className="section section--alt">
      <div className="container">
        <Reveal className="cta-band">
          <AnimatedDots />
          <div className="cta-band__inner">
            <span className="eyebrow" style={{ color: "#fff", justifyContent: "center" }}>Seit 1982</span>
            <h2>40+ Jahre Sauberkeit mit <em>Vertrauen</em></h2>
            <p>
              Lassen Sie uns über Ihr Gebäude sprechen. Wir erstellen Ihnen ein unverbindliches Angebot –
              individuell und kostenlos.
            </p>
            <Magnetic>
              <a className="btn btn--light btn--lg" href="#kontakt">Jetzt Angebot anfordern <ArrowRight /></a>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
