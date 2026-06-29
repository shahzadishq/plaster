import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Reveal, staggerContainer, staggerItem } from "./motion";
import TiltCard from "./TiltCard";
import { useContent } from "@/content/store";

export default function Testimonials() {
  const { homepage } = useContent();
  const t = homepage.testimonials;
  return (
    <section className="section testimonials" id="stimmen">
      <div className="container">
        <Reveal className="section-head" variant="zoomIn">
          <span className="eyebrow">{t.eyebrow}</span>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t.titleHtml }} />
          <p className="section-sub">{t.sub}</p>
        </Reveal>

        <motion.div
          className="testimonial-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {t.items.map((item) => (
            <TiltCard className="testimonial" key={item.name} variants={staggerItem} max={6}>
              <div className="testimonial__stars" aria-label="5 von 5 Sternen">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="testimonial__quote">{item.quote}</p>
              <div className="testimonial__author">
                <span className="testimonial__avatar" aria-hidden="true">{item.initials}</span>
                <div>
                  <div className="testimonial__name">{item.name}</div>
                  <div className="testimonial__role">{item.role}</div>
                </div>
              </div>
            </TiltCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
