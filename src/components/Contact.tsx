import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Reveal } from "./motion";
import CircleMarquee from "./CircleMarquee";
import { useContent } from "@/content/store";

export default function Contact() {
  const { settings, homepage } = useContent();
  const c = settings.contact;
  const k = homepage.contact;
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setSubmitting(true);
    // Simulated submit — replace with a real endpoint (fetch) or service.
    setTimeout(() => {
      setSubmitting(false);
      form.reset();
      setDone(true);
      setTimeout(() => setDone(false), 6000);
    }, 900);
  }

  return (
    <section className="section kontakt" id="kontakt">
      <CircleMarquee />
      <div className="container">
        <Reveal className="section-head section-head--left" variant="fadeRight">
          <span className="eyebrow">{k.eyebrow}</span>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: k.titleHtml }} />
          <p className="section-sub">{k.sub}</p>
        </Reveal>

        <div className="contact__grid">
          <div className="contact-info">
            <div className="contact-info__item">
              <span className="contact-info__icon"><MapPin /></span>
              <div><h4>Adresse</h4><p>{c.company}<br />{c.street}<br />{c.postal} {c.city}{c.country ? `, ${c.country}` : ""}</p></div>
            </div>
            <div className="contact-info__item">
              <span className="contact-info__icon"><Phone /></span>
              <div><h4>Telefon</h4><p><a href={`tel:${c.phoneHref}`}>{c.phone}</a></p></div>
            </div>
            <div className="contact-info__item">
              <span className="contact-info__icon"><Mail /></span>
              <div><h4>E-Mail</h4><p><a href={`mailto:${c.email}`}>{c.email}</a></p></div>
            </div>
            <div className="contact-info__item">
              <span className="contact-info__icon"><Clock /></span>
              <div><h4>Erreichbarkeit</h4><p>{c.hours}</p></div>
            </div>
          </div>

          <form className="form" id="contactForm" noValidate onSubmit={onSubmit}>
            <div className="form__row">
              <div className="field">
                <label htmlFor="name">Name <span className="req" aria-hidden="true">*</span></label>
                <input type="text" id="name" name="name" autoComplete="name" required placeholder="Ihr Name" />
                <span className="field__error">Bitte geben Sie Ihren Namen ein.</span>
              </div>
              <div className="field">
                <label htmlFor="company">Unternehmen</label>
                <input type="text" id="company" name="company" autoComplete="organization" placeholder="Optional" />
              </div>
            </div>
            <div className="form__row">
              <div className="field">
                <label htmlFor="email">E-Mail <span className="req" aria-hidden="true">*</span></label>
                <input type="email" id="email" name="email" autoComplete="email" required placeholder="name@firma.de" />
                <span className="field__error">Bitte geben Sie eine gültige E-Mail-Adresse ein.</span>
              </div>
              <div className="field">
                <label htmlFor="phone">Telefon</label>
                <input type="tel" id="phone" name="phone" autoComplete="tel" placeholder="Optional" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="service">Gewünschte Leistung</label>
              <select id="service" name="service" defaultValue="">
                <option value="">Bitte wählen …</option>
                {k.services.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="message">Ihre Nachricht <span className="req" aria-hidden="true">*</span></label>
              <textarea id="message" name="message" required placeholder="Beschreiben Sie kurz Ihr Objekt und Ihr Anliegen …" />
              <span className="field__error">Bitte hinterlassen Sie uns eine kurze Nachricht.</span>
            </div>
            <p className="form__hint">
              Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Angaben gemäß unserer Datenschutzerklärung zu.
              <span className="req" aria-hidden="true"> *</span> Pflichtfeld.
            </p>
            <button type="submit" className="btn btn--primary form__submit btn--lg" disabled={submitting}>
              {submitting ? "Wird gesendet …" : (<>Anfrage senden <Send /></>)}
            </button>
            <p className={`form__status${done ? " is-visible" : ""}`} role="status" aria-live="polite">
              Vielen Dank! Ihre Anfrage wurde übermittelt – wir melden uns in Kürze bei Ihnen.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
