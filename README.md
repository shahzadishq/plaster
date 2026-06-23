# Pläster Gebäudereinigung — Website

Premium B2B redesign for **Pläster Gebäudereinigung**, a professional cleaning
company established in **1982** in Emmendingen, Germany.

Pure HTML/CSS with lightweight vanilla JS — no build step, no frameworks.
Open `index.html` in a browser to view.

## Structure

```
index.html        # All sections (semantic, SEO meta, JSON-LD)
css/styles.css    # Design-token-driven stylesheet
js/main.js        # Scroll reveal, counters, parallax, menu, form validation
assets/favicon.svg
```

## Design system

| Token group | Choice |
|-------------|--------|
| Pattern | Trust & Authority + Minimal |
| Headings | Poppins (geometric sans) |
| Body | Inter (high readability, 1.6 line-height) |
| Primary | Deep blue `#1e3a8a` |
| Accent / CTA | Blue `#2563eb` |
| Highlight | Teal `#14b8a6` (hover states) |
| Background | White `#ffffff` / off-white `#f9fafb` / muted `#f3f4f6` |
| Text | Gray `#1f2937` |
| Spacing | 8px rhythm (8/16/24/32/48/64/96) |
| Radius | 8–12px |

Light mode only (B2B professional), WCAG AA contrast, full keyboard focus
states, and `prefers-reduced-motion` support throughout.

## Sections

Header · Hero · Stats (counter) · Services grid · Über uns · Detailed services
(alternating) · Warum Pläster · Testimonials · CTA band · Contact + form · Footer.

## ⚠️ Placeholders to replace before launch

The live site blocks scrapers, so real content/photos couldn't be pulled.
Swap these for the company's actual assets:

1. **Images** — all `images.unsplash.com/...` URLs (hero, Über-uns, detail rows,
   CTA band, testimonial avatars). Replace with real Pläster photos.
2. **Contact data** — `index.html`: address (`Musterstraße 12`), phone
   (`07641 / 00 00 00`), email, opening hours, and the JSON-LD block.
3. **Testimonials** — names, roles and quotes are realistic placeholders.
4. **Legal links** — Impressum / Datenschutz / AGB hrefs (`#`).
5. **Form endpoint** — `js/main.js` simulates submission. Wire the `<form>` to a
   real backend or service (e.g. `fetch` to your endpoint / Formspree).
6. **Social links** — footer Facebook/Instagram/LinkedIn hrefs (`#`).
