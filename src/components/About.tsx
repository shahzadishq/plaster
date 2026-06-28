import { Check, ArrowRight } from "lucide-react";
import { Reveal } from "./motion";
import { asset } from "@/lib/asset";
import settings from "@/content/settings.json";

const features: [string, string][] = [
  ["Persönlich & regional:", "fester Ansprechpartner für jedes Objekt – kurze Wege, schnelle Reaktion."],
  ["Geschultes Personal:", "regelmäßig weitergebildete Fachkräfte mit professioneller Ausrüstung."],
  ["Umweltschonend:", "Einsatz nachhaltiger Reinigungsmittel (Buzil Planta) und ressourcenbewusster Verfahren."],
];

export default function About() {
  return (
    <section className="section" id="ueber-uns">
      <div className="container split">
        <Reveal>
          <span className="eyebrow">Über uns</span>
          <h2 className="section-title">Ein Familienbetrieb mit <em>Tradition</em></h2>
          <p>{settings.about.text}</p>
          <ul className="feature-list">
            {features.map(([b, t]) => (
              <li key={b}>
                <span className="tick"><Check strokeWidth={2.5} /></span>
                <span><strong>{b}</strong> {t}</span>
              </li>
            ))}
          </ul>
          <a className="btn btn--primary" href="#kontakt" style={{ marginTop: "var(--sp-3)" }}>
            Lernen Sie uns kennen <ArrowRight />
          </a>
        </Reveal>

        <Reveal>
          <figure className="about-video">
            <video controls preload="none" playsInline poster={asset("assets/video-poster.webp")}>
              <source src={asset("assets/normal_669198d5de7f1.mp4")} type="video/mp4" />
              Ihr Browser unterstützt keine Videos.
            </video>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
