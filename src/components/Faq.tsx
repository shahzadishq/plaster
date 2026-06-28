import { useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { Reveal } from "./motion";
import { asset } from "@/lib/asset";

type QA = { q: string; a: string };

const faqs: QA[] = [
  { q: "Welche Reinigungsleistungen bietet Pläster Gebäudereinigung an?", a: "Wir übernehmen Unterhalts-, Glas- & Fassaden-, Bauschluss-, Grund-, Photovoltaik-, Reinraum- und Tatortreinigung sowie Teppichbodenreinigung, Geruchsneutralisierung und Desinfektion. Auf Wunsch erstellen wir ein individuelles Reinigungskonzept für Ihr Objekt." },
  { q: "In welchem Gebiet sind Sie tätig?", a: "Wir sind mit eigenem Fuhrpark in Emmendingen und der gesamten Umgebung im Einsatz – zuverlässig und pünktlich vor Ort. Sprechen Sie uns gerne auf Ihren Standort an." },
  { q: "Wie erhalte ich ein Angebot?", a: "Ganz einfach: über unser Kontaktformular oder telefonisch unter 07641 95257. Wir erstellen Ihnen ein unverbindliches, kostenloses Angebot – auf Wunsch nach einer Besichtigung vor Ort." },
  { q: "Arbeiten Sie mit umweltschonenden Reinigungsmitteln?", a: "Ja. Wir setzen auf nachhaltige, materialschonende Reinigungsmittel (u. a. der Buzil-Planta-Linie) und ressourcenbewusste Verfahren – gut für Ihre Oberflächen, Ihre Mitarbeitenden und die Umwelt." },
  { q: "Reinigen Sie auch außerhalb der Geschäftszeiten?", a: "Selbstverständlich. Wir richten uns flexibel nach Ihrem Betrieb und reinigen auf Wunsch früh morgens, abends oder am Wochenende – ohne Störung Ihres Tagesgeschäfts." },
  { q: "Übernehmen Sie auch Sonderreinigungen?", a: "Ja – neben der klassischen Gebäudereinigung bieten wir Spezialleistungen wie Photovoltaik-, Reinraum- und Tatortreinigung sowie Gerätevermietung an. Fragen Sie einfach nach Ihrem Anliegen." },
];

function FaqItem({ q, a, defaultOpen }: QA & { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <details className="faq-item" open={open}>
      <summary onClick={(e) => { e.preventDefault(); setOpen((o) => !o); }}>
        {q}
        <span className="faq-sign" aria-hidden="true" />
      </summary>
      <div className="faq-item__body"><p>{a}</p></div>
    </details>
  );
}

export default function Faq() {
  return (
    <section className="section faq-section" id="faq">
      <div className="container faq-layout">
        <Reveal className="faq-intro">
          <span className="eyebrow">FAQ &amp; Support</span>
          <h2 className="section-title">Alles, was Sie<br /><em>wissen müssen</em></h2>
          <div className="faq-card">
            <a className="faq-card__media" href="#ueber-uns" aria-label="Video ansehen">
              <img
                src={asset("assets/469479909_122124989606401905_1792001857027702583_n.jpg")}
                alt="Das Team der Pläster Gebäudereinigung"
                loading="lazy"
              />
              <span className="faq-card__play"><Play fill="currentColor" strokeWidth={0} /></span>
            </a>
            <p>
              Haben Sie weitere Fragen oder wünschen ein individuelles Angebot? Unser Team berät Sie gerne
              persönlich und findet die passende Lösung für Ihre Anforderungen.
            </p>
            <a className="btn btn--primary" href="#kontakt">Jetzt Kontakt aufnehmen <ArrowRight /></a>
          </div>
        </Reveal>

        <Reveal className="faq" amount={0.1}>
          {faqs.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
