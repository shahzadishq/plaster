import { ArrowRight } from "lucide-react";
import { Reveal } from "./motion";

export default function Cta() {
  return (
    <section className="section section--alt">
      <div className="container">
        <Reveal className="cta-band">
          <div className="cta-band__inner">
            <span className="eyebrow" style={{ color: "#fff", justifyContent: "center" }}>Seit 1982</span>
            <h2>40+ Jahre Sauberkeit mit Vertrauen</h2>
            <p>
              Lassen Sie uns über Ihr Gebäude sprechen. Wir erstellen Ihnen ein unverbindliches Angebot –
              individuell und kostenlos.
            </p>
            <a className="btn btn--light btn--lg" href="#kontakt">Jetzt Angebot anfordern <ArrowRight /></a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
