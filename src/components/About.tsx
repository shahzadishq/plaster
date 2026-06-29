import { Check, ArrowRight } from "lucide-react";
import { Reveal } from "./motion";
import { asset } from "@/lib/asset";
import { useContent } from "@/content/store";

export default function About() {
  const { settings, homepage } = useContent();
  const a = homepage.about;
  return (
    <section className="section" id="ueber-uns">
      <div className="container split">
        <Reveal variant="fadeRight">
          <span className="eyebrow">{a.eyebrow}</span>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: a.titleHtml }} />
          <p>{settings.about.text}</p>
          <ul className="feature-list">
            {a.features.map((f) => (
              <li key={f.strong}>
                <span className="tick"><Check strokeWidth={2.5} /></span>
                <span><strong>{f.strong}</strong> {f.text}</span>
              </li>
            ))}
          </ul>
          <a className="btn btn--primary" href="#kontakt" style={{ marginTop: "var(--sp-3)" }}>
            {a.cta} <ArrowRight />
          </a>
        </Reveal>

        <Reveal variant="fadeLeft">
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
