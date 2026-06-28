import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Reveal, staggerContainer, staggerItem } from "./motion";
import TiltCard from "./TiltCard";

type T = { quote: string; name: string; role: string; initials: string };

const items: T[] = [
  { quote: "Seit Jahren reinigt Pläster unsere Bürogebäude – immer zuverlässig, gründlich und absolut vertrauenswürdig. Ein Partner, auf den wir uns blind verlassen können.", name: "Michael Bauer", role: "Geschäftsführer", initials: "MB" },
  { quote: "Die Treppenhausreinigung in unseren Wohnanlagen läuft seit Jahren reibungslos. Pünktlich, sauber und immer freundlich – genau so soll es sein.", name: "Sabine Keller", role: "Hausverwalterin", initials: "SK" },
  { quote: "Hygiene hat in unserer Praxis höchste Priorität. Auf Pläster ist absolut Verlass – gründlich, diskret und mit einem Auge fürs Detail.", name: "Dr. Thomas Wolf", role: "Praxisinhaber", initials: "TW" },
];

export default function Testimonials() {
  return (
    <section className="section testimonials" id="stimmen">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Kundenstimmen</span>
          <h2 className="section-title">Das sagen unsere <em>Kunden</em></h2>
          <p className="section-sub">Vertrauen, das über Jahre gewachsen ist.</p>
        </Reveal>

        <motion.div
          className="testimonial-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {items.map((t) => (
            <TiltCard className="testimonial" key={t.name} variants={staggerItem} max={6}>
              <div className="testimonial__stars" aria-label="5 von 5 Sternen">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="testimonial__quote">{t.quote}</p>
              <div className="testimonial__author">
                <span className="testimonial__avatar" aria-hidden="true">{t.initials}</span>
                <div>
                  <div className="testimonial__name">{t.name}</div>
                  <div className="testimonial__role">{t.role}</div>
                </div>
              </div>
            </TiltCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
