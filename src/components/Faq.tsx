import { useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { Reveal } from "./motion";
import { asset } from "@/lib/asset";
import { useContent } from "@/content/store";

type QA = { q: string; a: string };

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
  const { homepage, faq } = useContent();
  const f = homepage.faq;
  const faqs = faq.items;
  return (
    <section className="section faq-section" id="faq">
      <div className="container faq-layout">
        <Reveal className="faq-intro" variant="fadeRight">
          <span className="eyebrow">{f.eyebrow}</span>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: f.titleHtml }} />
          <div className="faq-card">
            <a className="faq-card__media" href="#ueber-uns" aria-label="Video ansehen">
              <img src={asset(f.image)} alt={f.imageAlt} loading="lazy" />
              <span className="faq-card__play"><Play fill="currentColor" strokeWidth={0} /></span>
            </a>
            <p>{f.cardText}</p>
            <a className="btn btn--primary" href="#kontakt">{f.cardCta} <ArrowRight /></a>
          </div>
        </Reveal>

        <Reveal className="faq" amount={0.1} variant="fadeLeft">
          {faqs.map((item, i) => (
            <FaqItem key={item.q} q={item.q} a={item.a} defaultOpen={i === 0} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
